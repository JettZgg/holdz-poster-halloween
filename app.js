/*
 * HOLDZ / HALLOWEEN 2026
 * Editable, resolution-independent SVG motion posters.
 * GSAP, when available, drives the render clock. Rendering is deterministic via
 * window.renderAt(seconds), allowing frame-exact exports without a screen recorder.
 * Canvas: 1080×1440, duration 4s each, designed at 24fps.
 */
const W=1080, H=1440, DURATION=4;
const C={cream:'#EEEDE6',black:'#111111',orange:'#FF5C29',gray:'#82827B',lime:'#DDFF42',soft:'#D7D5C9',white:'#F7F6EF'};
const $=(id)=>document.getElementById(id);
const latin=`font-family="Inter Display, Inter, Arial, sans-serif"`;
const han=`font-family="Noto Sans CJK SC, Noto Sans SC, sans-serif"`;
const mono=`font-family="Liberation Mono, Courier New, monospace"`;
function rect(x,y,w,h,fill,extra=''){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`}
function line(x1,y1,x2,y2,color,width=2,extra=''){return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${extra}/>`}
function circle(cx,cy,r,fill,extra=''){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`}
function text(str,x,y,size,fill,weight=800,extra='',family=latin){return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${family} ${extra}>${str}</text>`}
function fit(str,x,y,w,size,fill,extra='',family=latin){return text(str,x,y,size,fill,900,`textLength="${w}" lengthAdjust="spacingAndGlyphs" ${extra}`,family)}
function label(str,x,y,fill=C.black,size=24,extra=''){return text(str,x,y,size,fill,600,`letter-spacing="2" ${extra}`,mono)}
function bracket(x,y,w,h,color=C.black){return `<path d="M${x+25} ${y}H${x}V${y+25} M${x+w-25} ${y}H${x+w}V${y+25} M${x} ${y+h-25}V${y+h}H${x+25} M${x+w-25} ${y+h}H${x+w}V${y+h-25}" fill="none" stroke="${color}" stroke-width="4"/>`}
function stamp(cx,cy,color){return `<g id="spinstamp"><circle cx="${cx}" cy="${cy}" r="132" fill="none" stroke="${color}" stroke-width="7"/><circle cx="${cx}" cy="${cy}" r="110" fill="none" stroke="${color}" stroke-width="1.5"/>${Array.from({length:12},(_,i)=>{let a=i*Math.PI/6;let x1=cx+119*Math.cos(a),y1=cy+119*Math.sin(a),x2=cx+136*Math.cos(a),y2=cy+136*Math.sin(a);return line(x1,y1,x2,y2,color,5)}).join('')} ${text('HOLDZ',cx,cy-6,42,color,900,`text-anchor="middle"`)} ${label('10/31',cx,cy+39,color,28,`text-anchor="middle"`)}</g>`}
function defs(){return `<defs>
 <pattern id="grid" width="51" height="51" patternUnits="userSpaceOnUse"><path d="M 51 0 L 0 0 0 51" fill="none" stroke="${C.black}" stroke-opacity="0.10" stroke-width="1" /></pattern>
 <pattern id="dots" width="15" height="15" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="${C.black}" fill-opacity=".23"/></pattern>
 <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves="2" result="noise" seed="4"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.09"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
 <clipPath id="heroClip"><rect x="61" y="615" width="958" height="500" /></clipPath>
 <clipPath id="screen"><rect x="0" y="0" width="1080" height="1440" /></clipPath>
 </defs>`}
function masthead(light=false){const f=light?C.white:C.black;return `<g id="top" opacity="0">${fit('HOLDZ',60,86,255,59,f)}${label('CLIMBING',340,80,f,24)}${text('苏州吴中店',540,80,25,f,700,'',han)}${label('31.10.2026',842,80,f,22)}${line(60,110,1020,110,f,2)}</g>`}
function footer(idx,light=false){const f=light?C.white:C.black;return `<g id="footer" opacity="0">${line(60,1385,1020,1385,f,2)}${label('HOLDZ // HALLOWEEN 2026',62,1418,f,19)}${label(`${String(idx).padStart(2,'0')} / 03`,917,1418,f,20)}</g>`}
function gridLines(y=100,opacity=.11){return `<g opacity="${opacity}">${Array.from({length:11},(_,i)=>line(60+i*96,y,60+i*96,1352,C.black,1)).join('')}</g>`}
// Official uploaded mark: the path is preserved verbatim; costume pieces are separate vectors.
const brandLogoPath='M108.49,309.67a89.17,89.17,0,0,1-22.92-69.8C89.75,201.72,109,144,121.78,130.69c24.8-25.88,68.83-37.74,133.54-45.08,38.5-3.42,71.46,8.47,96.24,38.92,19.72,22.58,33.3,37.47,48.82,57.25,21.23,25.22,16.44,47.84,3.62,72.9-4.54,10.32-16.16,33-21.63,43.13-4.14,7.64-5.6,15-1.91,22.23l.06.12c3.52,7,7.54,13.95,9.42,21.39,4.78,18.88-1.91,34.37-19.38,43.79s-35,16.09-54.27,24.78c-15.68,7.22-32.69,6-48.3-1-16.28-7.34-136.42-77.7-159.5-99.4Zm273.6-30.92c5.78-10.71,3.72-21.57-4-27.49-9.34-7.11-21-7.38-29.86-.83s-12.49,3.76-19.51-4.89c-14.29-17.6-35.7-20.25-55.13-10.77-13.83,6.75-24.3,16.92-23.5,32.77.78,15.51,13.78,22.38,27.21,27.31,10,3.66,10,6.25,3.83,14.9-4.67,6.57-9.12,13.08-11.53,20.59-6.9,21.5,2,41.05,23.41,50.66,24.35,10.95,48,6.84,72.37-5.25,7.39-4.64,13.52-11.5,14.17-21.47.82-12.66-6.62-22.14-13-32-10.07-15.52-9.09-12.81,1.49-23.21C376.27,290.87,382.09,278.75,382.09,278.75Z';
function coverBat(id,x,y,scale){return `<g id="${id}" opacity="0"><g transform="translate(${x} ${y}) scale(${scale})">
 <path id="${id}WingL" d="M-3 4 Q-19 -21 -60 -24 Q-41 -5 -49 12 Q-27 0 -21 20 Q-13 7 -3 11Z" fill="${C.cream}"/>
 <path id="${id}WingR" d="M-3 4 Q-19 -21 -60 -24 Q-41 -5 -49 12 Q-27 0 -21 20 Q-13 7 -3 11Z" fill="${C.cream}" transform="scale(-1 1)"/>
 <path d="M-8 -8 L-10 -19 L-2 -13 L3 -13 L11 -19 L8 -7 Q16 14 0 21 Q-16 14 -8 -8Z" fill="${C.cream}"/>
 ${circle(-3,-2,1.8,C.black)}${circle(4,-2,1.8,C.black)}
 </g></g>`}
function halloweenLogo(){return `<g id="brandHero" opacity="0">
 <g transform="translate(135 240) scale(1.6)">
  <path data-brand-logo="official" d="${brandLogoPath}" fill="${C.orange}"/>
  <g id="witchHat">
   <path d="M129 104 Q155 72 173 22 Q182 1 182 -31 Q221 -28 231 -3 L273 69 L315 100Z" fill="${C.cream}" stroke="${C.black}" stroke-width="5" stroke-linejoin="round"/>
   <path d="M149 67 Q200 81 268 63 L281 84 Q215 104 140 90Z" fill="${C.black}"/>
   <path d="M209 80 L233 77 L236 93 L212 97Z" fill="${C.orange}" stroke="${C.cream}" stroke-width="2"/>
   <path d="M110 108 Q153 89 218 97 Q273 101 328 92 Q347 99 322 113 Q221 142 118 123 Q100 118 110 108Z" fill="${C.cream}" stroke="${C.black}" stroke-width="5"/>
  </g>
 </g>
 </g>`}
function poster0(){return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HOLDZ万圣节，苏州吴中店">${defs()}
 ${rect(0,0,1080,1440,C.cream)}
 ${rect(0,155,1080,823,C.black)}
 ${rect(0,978,1080,462,C.orange)}
 ${masthead()}
 <g id="t0" opacity="0">${label('HALLOWEEN / 2026',60,218,C.orange,27)}${label('10.31 / SAT',840,215,C.cream,22)}</g>
 <g id="logoHalo" opacity="0">
  ${circle(535,583,307,'none',`stroke="${C.orange}" stroke-width="1.5" stroke-opacity=".26" stroke-dasharray="5 13"`)}
  ${circle(535,583,281,'none',`stroke="${C.cream}" stroke-width="1" stroke-opacity=".11"`)}
 </g>
 ${halloweenLogo()}
 ${coverBat('coverBatL',164,680,.8)}
 ${coverBat('coverBatR',869,374,1.15)}
 <g id="coverSparks" opacity="0">
  <path d="M175 365 L181 387 L203 393 L181 399 L175 421 L169 399 L147 393 L169 387Z" fill="${C.orange}"/>
  <path d="M886 728 L891 745 L908 750 L891 755 L886 772 L881 755 L864 750 L881 745Z" fill="${C.cream}"/>
  ${circle(837,631,5,C.orange)}${circle(233,805,4,C.cream)}
 </g>
 <g id="t1" opacity="0">${label('TRICK / TREAT / CLIMB',60,943,C.cream,22)}${label('HALLOWEEN SPECIAL',734,943,C.orange,20)}</g>
 <g id="desc" opacity="0">${text('万圣节，来点不一样',60,1109,64,C.black,900,'',han)}
   ${line(60,1146,1020,1146,C.black,2)}
   ${label('SATURDAY / OCTOBER',64,1201,C.black,26)}
   ${fit('10.31',60,1312,385,112,C.black)}
   ${label('11:00 - 21:00',520,1201,C.black,26)}
   <g data-copy="刷卡入场 COSPLAY免门票" aria-label="刷卡入场 COSPLAY免门票">
    ${text('刷卡入场',520,1260,41,C.black,900,'',han)}
    ${text('COSPLAY免门票',520,1312,40,C.black,900,'',han)}
   </g>
 </g>
 ${footer(0)}
 <g id="wipe" opacity="0">${rect(0,0,1080,1440,C.cream)}</g>
 </svg>`}
function hold(cx,cy,scale=1,color=C.orange){let d='M -38 -17 C -17 -45 22 -48 44 -18 C 57 2 39 32 4 38 C -27 44 -54 14 -38 -17 Z';return `<g transform="translate(${cx} ${cy}) scale(${scale})"><path d="${d}" fill="${color}" stroke="${C.black}" stroke-width="5"/><circle cx="3" cy="-5" r="9" fill="${C.black}"/></g>`}
function poster1(){return `<svg viewBox="0 0 1080 1440" xmlns="http://www.w3.org/2000/svg" aria-label="主题线路打卡">${defs()}
 ${rect(0,0,1080,1440,C.cream)} ${masthead()}
 ${label('ACTIVITY 01 / BOULDER PROBLEM',61,190,C.black,24)}
 <g id="t0" opacity="0">${fit('HALLOWEEN',59,356,961,128,C.black)}</g>
 <g id="t1" opacity="0">${fit('ROUTES',54,545,965,187,C.black)}</g>
 ${line(61,570,1020,570,C.black,3)}
 <defs><clipPath id="routePanel"><rect x="60" y="590" width="960" height="385"/></clipPath></defs>
 <g id="num" opacity="0" data-count="2条">${text('2',59,965,380,C.orange,900)}${text('条',290,943,116,C.orange,900,'',han)}</g>
 <g clip-path="url(#routePanel)"><g id="route" opacity="0">
   <path id="climbPath" d="M450 866 C510 757 600 918 645 788 S785 727 810 637 S920 692 978 640" fill="none" stroke="${C.black}" stroke-width="9" stroke-linecap="round" stroke-dasharray="13 19"/>
   ${hold(455,869,.85,C.black)}${hold(652,785,.95,C.orange)}${hold(812,647,.72,C.black)}${hold(970,647,.92,C.orange)}
   ${label('START',425,939,C.black,20,`data-route-label="start"`)}${label('TOP',925,713,C.black,20,`data-route-label="top"`)}
 </g></g>
 <g id="desc" opacity="0">
  ${rect(0,989,1080,451,C.black)}
  ${text('万圣主题线路打卡',60,1069,64,C.white,900,'',han)}
  ${line(60,1103,1020,1103,C.orange,5)}
  ${label('01',63,1162,C.orange,31)}${text('完成主题线路挑战',145,1161,30,C.white,700,'',han)}
  ${label('02',63,1218,C.orange,31)}${text('发布 3 图 / 1 视频 + 门店定位及话题标签',145,1217,30,C.white,700,'',han)}
  ${text('奖励',63,1288,28,C.orange,700,'',han)}${text('糖果包 + 攀岩鞋除臭炭包一对',145,1288,30,C.white,700,'',han)}
  ${text('截止 11.01 营业结束 / 炭包有限，先到先得',63,1343,23,C.white,600,'',han)}
 </g>
 ${footer(1,true)}
 <g id="wipe" opacity="0">${rect(0,0,1080,1440,C.cream)}</g>
 </svg>`}
function bagSketch(){return `<g id="bagObjects" opacity="0">
 <g id="obj1" transform="translate(84 714)" aria-label="带提手、盒盖、搭扣和分格的便当盒">
  <path d="M87 5 V-4 Q87 -15 100 -15 H145 Q158 -15 158 -4 V5" fill="none" stroke="${C.black}" stroke-width="7"/>
  ${rect(21,5,203,66,C.orange,`rx="17" stroke="${C.black}" stroke-width="7"`)}
  ${rect(11,139,223,125,C.orange,`rx="23" stroke="${C.black}" stroke-width="7"`)}
  ${rect(0,53,245,160,C.cream,`rx="23" stroke="${C.black}" stroke-width="7"`)}
  ${rect(19,73,207,120,C.cream,`rx="12" stroke="${C.black}" stroke-width="4"`)}
  ${line(102,73,102,193,C.black,4)}${line(102,132,226,132,C.black,4)}
  ${rect(-5,124,20,50,C.orange,`rx="5" stroke="${C.black}" stroke-width="5"`)}
  ${rect(230,124,20,50,C.orange,`rx="5" stroke="${C.black}" stroke-width="5"`)}
  ${rect(102,213,41,27,C.cream,`rx="4" stroke="${C.black}" stroke-width="5"`)}
  ${line(113,226,132,226,C.black,4)}
 </g>
 <g id="obj2" transform="translate(423 706)">
  <path d="M55 78 C-12 26 29 -19 83 21 C110 -33 182 -13 169 44 C231 15 250 97 196 118 L213 210 C221 260 175 276 147 253 L118 227 L72 256 C28 273 0 241 22 198 Z" fill="${C.orange}" stroke="${C.black}" stroke-width="8"/>
  ${circle(78,111,10,C.black)}${circle(148,111,10,C.black)}
  <path d="M100 144 Q117 164 136 144" fill="none" stroke="${C.black}" stroke-width="8"/>
 </g>
 <g id="obj3" transform="translate(738 708)">
  <path d="M30 80 H206 L188 276 H53 Z" fill="${C.cream}" stroke="${C.black}" stroke-width="7"/>
  <path d="M34 82 Q0 10 58 22 Q78 -30 122 19 Q187 -32 198 29 Q261 14 215 84Z" fill="${C.orange}" stroke="${C.black}" stroke-width="7"/>
  ${line(48,158,201,158,C.orange,14)}
 </g>
 ${text('饭盒？',206,1021,27,C.black,700,`text-anchor="middle" data-object-label="lunchbox"`,han)}
 ${text('玩偶？',541,1021,27,C.black,700,`text-anchor="middle" data-object-label="plush"`,han)}
 ${text('爆米花桶？',862,1021,27,C.black,700,`text-anchor="middle" data-object-label="popcorn"`,han)}
 </g>`}
function poster2(){return `<svg viewBox="0 0 1080 1440" xmlns="http://www.w3.org/2000/svg" aria-label="自带搞怪镁粉袋挑战">${defs()}
 ${rect(0,0,1080,1440,C.black)}${masthead(true)}
 ${label('ACTIVITY 02 / MAKE IT ABSURD',61,190,C.orange,24)}
 ${text('不用传统镁粉袋，自己带个怪东西！',60,239,32,C.cream,700,'',han)}
 <g id="t0" opacity="0">${fit('ANYTHING',58,380,964,144,C.cream)}</g>
 <g id="t1" opacity="0">${fit('BUT A CHALK',57,517,964,123,C.orange)}</g>
 <g id="t2" opacity="0">${fit('BAG.',58,652,560,144,C.cream)}</g>
 <g id="orb" opacity="0">${circle(834,606,192,'none',`stroke="${C.orange}" stroke-width="6"`)}${circle(834,606,161,'none',`stroke="${C.orange}" stroke-width="2"`)}${Array.from({length:7},(_,i)=>circle(834,606,180+i*13,'none',`stroke="${C.orange}" stroke-opacity="${.5-i*.06}" stroke-width="1"`)).join('')}</g>
 ${rect(0,685,1080,380,C.cream)}
 ${bagSketch()}
 <g id="desc" opacity="0">
  ${rect(0,1059,1080,381,C.orange)}
  ${text('自带搞怪镁粉袋挑战',60,1134,64,C.black,900,'',han)}
  ${line(60,1164,1020,1164,C.black,3)}
  <g data-copy="bring-your-own-container">
   ${text('找个安全容器装镁粉',60,1213,30,C.black,700,'',han)}
   ${text('带来现场参加',60,1258,30,C.black,700,'',han)}
  </g>
  ${text('评选',60,1308,24,C.black,700,'',han)}${text('创意 / 实用 / 出片',145,1308,28,C.black,700,'',han)}
  ${text('不限 COSPLAY · 安全且能装镁粉即可',60,1355,22,C.black,600,'',han)}
  ${line(582,1190,582,1355,C.black,2)}
  <g data-prize-column="right">
   ${text('挑战奖励',638,1208,25,C.black,800,'',han)}
   ${label('NO.01',638,1259,C.black,22)}${text('月卡 × 1',800,1258,30,C.black,700,'',han)}
   ${label('NO.02–06',638,1325,C.black,22)}${text('次卡 + 胶带',800,1324,30,C.black,700,'',han)}
  </g>
 </g>
 ${footer(2)}
 <g id="wipe" opacity="0">${rect(0,0,1080,1440,C.black)}</g>
 </svg>`}
// Rings are SVG paths, split behind/in front of the cone for depth.
// Every frame is derived from time, so exports and browser playback match.
const ringSpecs=[
 {cx:803,cy:805,rx:147,ry:48,color:C.orange,phase:0},
 {cx:557,cy:973,rx:99,ry:32,color:C.cream,phase:1.4},
 {cx:575,cy:1020,rx:87,ry:27,color:C.orange,phase:2.8}
];
function vectorRings(part){return ringSpecs.map((r,i)=>`<g data-vector-ring="${i}" data-ring-part="${part}">
 <path data-ring-shadow="" fill="none" stroke="${C.black}" stroke-width="19" stroke-linecap="round"/>
 <path data-ring-body="" fill="none" stroke="${r.color}" stroke-width="13" stroke-linecap="round"/>
 <path data-ring-stripe="" fill="none" stroke="${C.white}" stroke-width="4" stroke-linecap="round" stroke-dasharray="19 118"/>
 </g>`).join('')}
function animateRings(t){
 document.querySelectorAll('[data-vector-ring]').forEach(g=>{
  const r=ringSpecs[Number(g.dataset.vectorRing)], back=g.dataset.ringPart==='back';
  const ry=r.ry*(.78+.28*Math.sin(t*2+r.phase));
  const cx=r.cx+8*Math.sin(t*1.6+r.phase),cy=r.cy+9*Math.sin(t*2.2+r.phase);
  const angle=12*Math.sin(t*1.8+r.phase);
  const d=`M ${cx-r.rx} ${cy} A ${r.rx} ${ry} 0 0 ${back?1:0} ${cx+r.rx} ${cy}`;
  g.setAttribute('transform',`rotate(${angle} ${cx} ${cy})`);
  g.querySelectorAll('path').forEach(p=>p.setAttribute('d',d));
  g.querySelector('[data-ring-stripe]').setAttribute('stroke-dashoffset',String(-t*120-r.phase*60));
 });
}
function poster3(){return `<svg viewBox="0 0 1080 1440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="万圣趣味游戏，人人可参与，30份奖品">${defs()}
 ${rect(0,0,1080,1440,C.cream)}${masthead()}
 ${label('ACTIVITY 03 / EVERYONE CAN PLAY',60,190,C.black,24)}
 <g id="t0" opacity="0">${fit('PLAY',55,418,965,266,C.black)}</g>
 <g id="t1" opacity="0">${fit('GROUND',55,580,965,172,C.black)}</g>
 <defs><clipPath id="gameArtClip"><rect x="60" y="626" width="960" height="442"/></clipPath></defs>
 ${rect(60,626,960,442,C.black)}
 <g clip-path="url(#gameArtClip)">${circle(823,837,302,C.orange)}${circle(823,837,254,'none',`stroke="${C.black}" stroke-width="1" stroke-opacity=".2"`)}</g>
 <g id="ringBack" opacity="0">${vectorRings('back')}</g>
 <g id="photo" opacity="0">
  <image x="631" y="595" width="369" height="469" preserveAspectRatio="xMidYMid meet" href="assets/cone-sticker.png" aria-label="万圣节套圈路锥，白色平滑描边"/>
 </g>
 <g id="rings" opacity="0">${vectorRings('front')}</g>
 <g id="cue" opacity="0">
  ${label('01 / RING TOSS',88,688,C.cream,22)}
  ${text('套圈',85,773,76,C.white,900,'',han)}
  ${line(88,809,392,809,C.cream,2)}
  ${label('02 / STACK HOLDS',88,870,C.cream,22)}
  ${text('岩点搭积木',85,946,58,C.white,900,'',han)}
  ${label('14:00 – 21:00',88,1032,C.white,26)}
 </g>
 <g id="desc" opacity="0">
  ${rect(0,1084,1080,356,C.orange)}
  ${text('万圣趣味游戏',60,1154,64,C.black,900,'',han)}
  ${text('人人可参与',1018,1147,30,C.black,800,'text-anchor="end"',han)}
  ${line(60,1180,1020,1180,C.black,3)}
  ${text('每项游戏每人 1 次正式机会',60,1221,28,C.black,700,'',han)}
  ${fit('30',57,1339,232,134,C.black)}
  ${text('份奖品',311,1330,31,C.black,800,'',han)}
  ${text('月卡 × 2',492,1274,30,C.black,800,'data-prize="monthly"',han)}
  ${text('肌贴 × 1',766,1274,30,C.black,800,'data-prize="kinesiology"',han)}
  ${text('次卡 × 12',492,1324,30,C.black,800,'data-prize="visits"',han)}
  ${text('攀岩胶带 × 15',766,1324,30,C.black,800,'data-prize="tape"',han)}
  ${text('完成一项挑战可抽奖 1 次 · 奖品抽完即止',60,1365,25,C.black,700,'',han)}
 </g>
 ${footer(3)}
 <g id="wipe" opacity="0">${rect(0,0,1080,1440,C.cream)}</g>
 </svg>`}
const posterFn=[poster0,poster1,poster2,poster3];
let idx=Number(new URL(location.href).searchParams.get('poster')||0);if(!Number.isInteger(idx)||idx<0||idx>3)idx=0;
let state={time:0}, activeTimeline=null, raf=0, clockStart=0, playing=true;
function setPoster(n){idx=n; $('stage').innerHTML=posterFn[n]();document.querySelector('#selector').value=String(n);renderAt(state.time)}
function easeOut(t){t=Math.max(0,Math.min(1,t));return 1-Math.pow(1-t,3)}
function easeBack(t){t=Math.max(0,Math.min(1,t));return 1+2.2*Math.pow(t-1,3)+1.2*Math.pow(t-1,2)}
function segment(t,start,len=0.65){return easeOut((t-start)/len)}
function apply(id, transform='', opacity=null){const e=$(id);if(!e)return;if(transform)e.setAttribute('transform',transform);if(opacity!==null)e.setAttribute('opacity',String(opacity))}
function intro(id,t,delay,dx=0,dy=70,len=.67){const p=segment(t,delay,len);apply(id,`translate(${dx*(1-p)} ${dy*(1-p)})`,p)}
function renderAt(time){
 const t=Math.max(0,Math.min(DURATION,time));state.time=t;
 intro('top',t,.03,0,-45,.56);
 intro('t0',t,.20,-125,0,.64);
 intro('t1',t,.38,-145,0,.70);
 intro('t2',t,.52,-165,0,.71);
 intro('t3',t,.63,-105,0,.64);
 intro('desc',t,1.5,0,130,.62);
 intro('footer',t,2.0,0,30,.45);
 const logoIn=segment(t,.27,.85),logoFloat=7*Math.sin(t*Math.PI/2);
 apply('brandHero',`translate(535 ${583+46*(1-logoIn)+logoFloat}) rotate(${2.4*Math.sin(t*1.6)}) scale(${.89+.11*logoIn}) translate(-535 -583)`,logoIn);
 apply('witchHat',`rotate(${3.5*Math.sin(t*2.0)} 221 106)`);
 apply('logoHalo',`rotate(${t*7} 535 583)`,segment(t,.35,.8));
 apply('coverSparks','',segment(t,.9,.7)*(.72+.28*Math.sin(t*3)));
 ['coverBatL','coverBatR'].forEach((id,i)=>{
  const p=segment(t,.65+i*.13,.7),flap=.7+.3*Math.sin(t*7+i*2);
  apply(id,`translate(${(1-p)*(i?80:-80)+8*Math.sin(t*2+i)} ${10*Math.sin(t*2.1+i)})`,p);
  apply(id+'WingL',`scale(1 ${flap})`);
  apply(id+'WingR',`scale(-1 ${flap})`);
 });
 let e=segment(t,.93,.83), spin=t*25;
 apply('seal',`translate(${(1-e)*130} 0) rotate(${spin*0.8} 845 597) scale(${.86+.14*e})`,e);
 apply('num',`translate(${-150*(1-e)} 0)`,e);
 apply('route',`translate(${120*(1-e)} 0)`,e);
 apply('orb',`rotate(${15*Math.sin(t*.9)} 834 606)`,segment(t,.7,.7));
 apply('bagObjects',`translate(0 ${19*Math.sin(t*2.3)})`,segment(t,.88,.72));
 apply('photo',`translate(0 ${55*(1-e)})`,e);
 apply('ringBack','',segment(t,1.05,.56));
 apply('rings','',segment(t,1.05,.56));
 animateRings(t);
 apply('cue',`translate(${(1-segment(t,1.16,.6))*-90} 0)`,segment(t,1.16,.6));
 apply('wipe','',Math.max(0,(t-3.82)/.18));
}
window.renderAt=renderAt;
window.setPoster=setPoster;
window.getDuration=()=>DURATION;
setPoster(idx);
function startPlayback(){cancelAnimationFrame(raf);if(activeTimeline){activeTimeline.kill();activeTimeline=null;}playing=true;$('play').textContent='暂停';
  if(window.gsap){state.time=0;activeTimeline=gsap.to(state,{time:DURATION,duration:DURATION,ease:'none',repeat:-1,onUpdate:()=>renderAt(state.time)});}
  else {clockStart=performance.now();const tick=()=>{if(!playing)return;renderAt(((performance.now()-clockStart)/1000)%DURATION);raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)}
}
function pausePlayback(){playing=false;cancelAnimationFrame(raf);if(activeTimeline)activeTimeline.pause();$('play').textContent='播放'}
$('selector').addEventListener('change',e=>{setPoster(Number(e.target.value));startPlayback()});
$('play').addEventListener('click',()=>{if(playing)pausePlayback();else startPlayback()});
// Use ?capture=1 during automated MP4 rendering to disable real-time tick.
if(!new URL(location.href).searchParams.has('capture')) startPlayback(); else renderAt(2.65);
