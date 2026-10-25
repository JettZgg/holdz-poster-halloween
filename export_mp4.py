"""Offline, deterministic poster export with Playwright, Chromium and ffmpeg."""
import argparse
import asyncio
from contextlib import suppress
import json
import mimetypes
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
from urllib.parse import unquote, urlsplit

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent
FPS = 24
DURATION = 4
FRAME_COUNT = FPS * DURATION
ORIGIN = "http://holdz.invalid"


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("posters", nargs="*", type=int, choices=range(4),
                        help="Poster numbers 0–3; defaults to all four")
    parser.add_argument("--output-dir", type=Path,
                        default=ROOT.parent / "holdz_exports")
    parser.add_argument("--preview-only", action="store_true",
                        default=bool(os.getenv("PREVIEW_ONLY")),
                        help="Export one PNG per poster, without MP4s")
    parser.add_argument("--chromium", default=os.getenv("CHROMIUM_PATH", "/usr/bin/chromium"))
    return parser.parse_args()


def verify_video(path):
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,nb_frames,r_frame_rate:format=duration", "-of", "json", str(path)],
        check=True, capture_output=True, text=True,
    )
    info = json.loads(result.stdout)
    stream = info["streams"][0]
    expected = (1080, 1440, str(FRAME_COUNT), f"{FPS}/1")
    actual = (stream["width"], stream["height"], stream.get("nb_frames"), stream["r_frame_rate"])
    if actual != expected or abs(float(info["format"]["duration"]) - DURATION) > 0.02:
        raise RuntimeError(f"Unexpected exported video format: {info}")


async def settle_render(page, time):
    """Let SVG opacity, transforms and glyph painting settle before capture."""
    await page.evaluate("""async time => {
        renderAt(time);
        // Resolve SVG text layout before Chromium paints groups whose opacity changed.
        for (const text of document.querySelectorAll('#stage svg text')) {
            text.getBBox();
            text.getComputedTextLength();
        }
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }""", time)


async def export(args):
    output = args.output_dir.resolve()
    output.mkdir(parents=True, exist_ok=True)
    if not args.preview_only:
        for command in ("ffmpeg", "ffprobe"):
            if not shutil.which(command):
                raise RuntimeError(f"Missing executable: {command}")
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=True, executable_path=args.chromium,
            args=["--no-sandbox", "--disable-dev-shm-usage", "--disable-background-networking"],
        )
        context = await browser.new_context(
            # Leave room around the SVG so element screenshots need no edge scrolling.
            viewport={"width": 1110, "height": 1470}, device_scale_factor=1,
            service_workers="block",
        )
        resource_errors = []

        async def serve_local(route):
            url = urlsplit(route.request.url)
            if url.netloc != "holdz.invalid":
                # GSAP is optional: exercise the app's deterministic offline fallback.
                if url.netloc == "cdnjs.cloudflare.com" and "/gsap/" in url.path:
                    await route.fulfill(status=200, content_type="application/javascript", body="/* offline export */")
                else:
                    resource_errors.append(f"Unexpected external resource: {url.netloc}{url.path}")
                    await route.fulfill(status=403, body="Offline export")
                return
            resource = (ROOT / unquote(url.path).lstrip("/")).resolve()
            if not resource.is_relative_to(ROOT) or not resource.is_file():
                resource_errors.append(f"Missing local resource: {url.path}")
                await route.fulfill(status=404, body="Not found")
                return
            mime = mimetypes.guess_type(resource.name)[0] or "application/octet-stream"
            await route.fulfill(status=200, content_type=mime, body=resource.read_bytes())

        await context.route("**/*", serve_local)
        try:
            for idx in args.posters or range(4):
                page = await context.new_page()
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                resource_errors.clear()
                try:
                    await page.goto(f"{ORIGIN}/index.html?poster={idx}&capture=1", wait_until="load")
                    await page.add_style_tag(content="""
                        body { display:block!important; margin:0!important; }
                        #stage { width:1080px!important; max-width:none!important; margin:0!important; box-shadow:none!important; }
                        .controls { display:none!important; }
                    """)
                    await page.evaluate("document.fonts.ready")
                    await page.evaluate("""async () => {
                        await Promise.all(Array.from(document.querySelectorAll('#stage image'), async node => {
                            const href = node.getAttribute('href') || node.getAttribute('xlink:href');
                            const image = new Image();
                            image.src = href;
                            await image.decode();
                        }));
                    }""")
                    if errors or resource_errors:
                        raise RuntimeError("; ".join(errors + resource_errors))
                    svg = page.locator("#stage svg")
                    await settle_render(page, 2.65)
                    preview = output / f"HOLDZ_Halloween_{idx:02d}.png"
                    await svg.screenshot(path=str(preview), animations="disabled")
                    print(f"PREVIEW {preview}", flush=True)
                    if args.preview_only:
                        continue
                    with tempfile.TemporaryDirectory(prefix=f"frames_{idx}_", dir=output) as temporary:
                        frames = Path(temporary)
                        for frame in range(FRAME_COUNT):
                            await settle_render(page, frame / FPS)
                            await svg.screenshot(path=str(frames / f"frame_{frame:04d}.png"), animations="disabled")
                            if (frame + 1) % FPS == 0:
                                print(f"FRAMES poster={idx} {frame + 1}/{FRAME_COUNT}", flush=True)
                        if errors or resource_errors:
                            raise RuntimeError("; ".join(errors + resource_errors))
                        pending = frames / "export.mp4"
                        subprocess.run([
                            "ffmpeg", "-v", "error", "-y", "-framerate", str(FPS),
                            "-i", str(frames / "frame_%04d.png"), "-frames:v", str(FRAME_COUNT),
                            "-c:v", "libx264", "-threads", "2", "-preset", "medium", "-crf", "18",
                            "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-r", str(FPS), str(pending),
                        ], check=True)
                        verify_video(pending)
                        destination = output / f"HOLDZ_Halloween_{idx:02d}.mp4"
                        pending.replace(destination)
                        print(f"CREATED {destination} ({destination.stat().st_size / 1024 / 1024:.2f} MB)", flush=True)
                finally:
                    await page.close()
        finally:
            with suppress(Exception):
                await context.close()
            await browser.close()


if __name__ == "__main__":
    asyncio.run(export(parse_args()))
