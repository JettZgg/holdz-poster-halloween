# HOLDZ 万圣节动态海报

四张可编辑的 JavaScript / SVG 海报：活动封面、万圣主题线路、自带创意镁粉袋、万圣趣味游戏。画幅为 **1080 × 1440（3:4）**，每张 **4 秒、24 fps**。

## 查看与编辑

在本目录运行静态服务器：

```sh
python -m http.server 8000 --bind 0.0.0.0
```

用浏览器打开服务地址，页面下方可以切换海报、暂停和播放。查询参数 `?poster=0` 至 `?poster=3` 可以直接选择海报。应用不需要框架构建；GSAP 可用时负责计时，离线时使用内置 JavaScript 动画。

- `app.js`：`poster0` 至 `poster3` 为四张 SVG；`C` 定义颜色，`renderAt(seconds)` 定义确定性动画。
- `style.css`：浏览器展示与控制栏样式。
- `assets/`：海报使用的桩图片；套圈由代码绘制，不依赖套圈抠图。
- 字体：英文优先使用 Inter，中文优先使用 Noto Sans CJK SC。导出机须安装中文字体，否则字体替换可能改变版式。

## 本次活动文案

- 封面入场说明：“刷卡入场 COSPLAY免门票”。
- 创意镁粉袋活动：顾客自备安全且能装镁粉的创意容器，带来现场参加；不是店方提供镁粉袋的大赏展示。
- 趣味游戏人人可参与，每项游戏每人 1 次正式机会，完成一项挑战可获得 1 次抽奖资格。
- 共 **30 份奖品**：月卡 × 2、肌贴 × 1、次卡 × 12、攀岩胶带 × 15；抽完即止。

## 导出 PNG 与 MP4

依赖 Python Playwright、Chromium、ffmpeg 和 ffprobe。当前云环境已提供这些工具；默认 Chromium 路径为 `/usr/bin/chromium`，可通过 `--chromium` 或 `CHROMIUM_PATH` 指定。

```sh
# 四张预览 PNG；无需启动 HTTP 服务器
python export_mp4.py --preview-only --output-dir ../holdz_exports

# 四张预览 PNG 与 MP4
python export_mp4.py --output-dir ../holdz_exports

# 只导出第四张海报
python export_mp4.py 3 --output-dir ../holdz_exports
```

`PREVIEW_ONLY=1` 仍可用于只导出预览。默认输出目录为源码目录旁的 `holdz_exports`；文件名为 `HOLDZ_Halloween_00` 至 `HOLDZ_Halloween_03`。

导出器通过 Playwright 本地路由读取 HTML、脚本和当前实际引用的图片，不访问外部网络，也不修改应用源码。`capture=1` 停止实时播放，再逐帧调用 `renderAt`。每张 MP4 导出 96 帧，完成后用 ffprobe 核对尺寸、帧率、帧数和时长；缺失图片、JavaScript 错误或视频编码失败会使命令报错。临时帧在导出后清理，预览和成片保留。
