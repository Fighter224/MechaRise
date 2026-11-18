(function(root){
'use strict';
const WIDTH=1800,HEIGHT=1140;
const layout={
 width:WIDTH,height:HEIGHT,
 floors:[{id:'core-walkway',x:650,y:270,width:370,height:380},{id:'gate-walkway',x:140,y:375,width:620,height:275},{id:'rescue-walkway',x:900,y:280,width:850,height:710}],
 structures:[
 {id:'arrival-platform',x:800,y:470,width:1000,pivot:'top',depth:720},
 {id:'system-core',x:836,y:25,width:260,pivot:'top',depth:278},
 {id:'broken-gateway',x:260,y:190,width:340,pivot:'top',depth:450},
 {id:'rescue-bay',x:1250,y:335,width:320,pivot:'floor',depth:335},
 {id:'rescue-bay',x:1550,y:500,width:370,pivot:'floor',depth:500},
 {id:'rescue-bay',x:1490,y:800,width:340,pivot:'floor',depth:800}
 ],
 sites:[{id:'core',x:836,y:290,radius:150},{id:'gate',x:260,y:450,radius:145},{id:'bay1',x:1250,y:335,radius:115},{id:'bay2',x:1550,y:500,radius:125},{id:'bay3',x:1490,y:800,radius:120}],
 residents:{mender:{x:1250,y:335,height:135},valhalla:{x:1550,y:500,size:250}},
 polygons:[[[690,610],[980,610],[950,340],[905,285],[755,285],[710,340]],[[200,450],[245,410],[360,405],[550,445],[770,480],[770,610],[650,600],[520,540],[340,550],[215,545]],[[945,485],[1040,410],[1220,300],[1340,320],[1600,420],[1700,500],[1660,600],[1420,630],[1420,725],[1600,755],[1640,840],[1580,920],[1430,930],[1320,850],[1280,705],[1190,630],[1090,610],[990,575]]],
 ellipses:[{x:800,y:678,rx:410,ry:180},{x:836,y:286,rx:123,ry:40},{x:260,y:450,rx:155,ry:45},{x:1250,y:335,rx:155,ry:53},{x:1550,y:500,rx:180,ry:61},{x:1490,y:800,rx:165,ry:57}]
};
// Coordinates are projected floor positions. Height is navigation metadata, not a
// second visual offset: sprite feet already lie on the projected stair treads.
layout.stairs=[
 {id:'arrival',x:800,top:849,bottom:1000,width:280,height:0,base:-60},
 {id:'core',x:836,top:304,bottom:371,width:94,height:32,base:0},
 {id:'gate',x:260,top:461,bottom:516,width:115,height:28,base:0},
 {id:'bay1',x:1250,top:355,bottom:420,width:104,height:28,base:0},
 {id:'bay2',x:1550,top:524,bottom:589,width:116,height:28,base:0},
 {id:'bay3',x:1490,top:822,bottom:887,width:108,height:28,base:0}
];
layout.fixtures=[[695,560],[968,554],[550,457],[378,411],[1075,426],[1330,638],[1630,640],[1370,906],[665,805],[935,805]].map(([x,y])=>({id:'ark-lantern',x,y,width:34}));
layout.decks=layout.ellipses.slice(1).map((e,i)=>({...e,rx:e.rx*.78,ry:e.ry*.68,height:i===0?32:28}));
layout.ellipses.push({x:800,y:1005,rx:160,ry:32});
layout.props=[
 {id:'maintenance-console',x:1110,y:394,width:62,block:{rx:13,ry:7}},
 {id:'repair-station',x:1370,y:365,width:90,block:{rx:27,ry:12},requires:'menderRescued'},
 {id:'maintenance-console',x:1700,y:535,width:62,block:{rx:13,ry:7}},
 {id:'maintenance-console',x:1630,y:835,width:62,block:{rx:13,ry:7}},
 {id:'gateway-rubble',x:365,y:457,width:82,block:{rx:23,ry:10}},
 {id:'gateway-rubble',x:148,y:470,width:57,block:{rx:16,ry:7}}
];
layout.supports=[[696,610],[973,610],[355,548],[560,570],[1647,592],[1417,718],[1576,921]];
layout.rails=[[[225,540],[338,550]],[[385,548],[495,541]],[[995,595],[1085,625]],[[1660,600],[1460,625]],[[1420,660],[1420,711]],[[1550,927],[1438,936]]];
layout.details=['stair-flight','ark-lantern','arrival-landing','maintenance-console','repair-station','docking-cradle','support-bracket','gateway-rubble','bridge-threshold'];
layout.thresholds=[{x:836,y:507,width:140,angle:0},{x:604,y:541,width:125,angle:-.28},{x:1065,y:551,width:135,angle:.3}];
const images=new Map();let ready=false,pending=null;
const ellipseContains=(x,y,e)=>((x-e.x)/e.rx)**2+((y-e.y)/e.ry)**2<=1;
function inPolygon(x,y,pts){let inside=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
function onStair(x,y,r){return Math.abs(x-r.x)<=r.width/2&&y>=r.top&&y<=r.bottom;}
function surface(x,y){
 for(const r of layout.stairs)if(onStair(x,y,r))return {height:r.height+(r.base-r.height)*(y-r.top)/(r.bottom-r.top),stair:r.id,material:'steps'};
 for(const d of layout.decks)if(ellipseContains(x,y,d))return {height:d.height,stair:null,material:'metal'};
 if(ellipseContains(x,y,layout.ellipses.at(-1)))return {height:-60,stair:null,material:'stone'};
 return {height:0,stair:null,material:ellipseContains(x,y,layout.ellipses[0])?'metal':'stone'};
}
// Permanent fixtures reserve their footprints even before the resident arrives.
const obstacles=[...layout.fixtures.map(f=>({x:f.x,y:f.y,rx:8,ry:5})),...layout.props.map(p=>({x:p.x,y:p.y,...p.block})),...layout.structures.filter(s=>s.id==='rescue-bay').flatMap(s=>[{x:s.x-s.width*.404,y:s.y+s.width*.021,rx:17,ry:8},{x:s.x+s.width*.404,y:s.y+s.width*.021,rx:17,ry:8},{x:s.x,y:s.y-s.width*.18,rx:16,ry:8}])];
function walkable(x,y){
 if(obstacles.some(o=>ellipseContains(x,y,o)))return false;
 for(const [a,b] of layout.rails){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));if(Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy)<4)return false;}
 return layout.stairs.some(r=>onStair(x,y,r))||layout.polygons.some(p=>inPolygon(x,y,p))||layout.ellipses.some(e=>ellipseContains(x,y,e));
}
function canTraverse(ax,ay,bx,by){
 if(!walkable(ax,ay)||!walkable(bx,by))return false;
 const count=Math.max(1,Math.ceil(Math.hypot(bx-ax,by-ay)/2));let px=ax,py=ay,previous=surface(ax,ay).height;
 for(let i=1;i<=count;i++){
  const x=ax+(bx-ax)*i/count,y=ay+(by-ay)*i/count;
  if(!walkable(x,y))return false;
  if(ellipseContains(px,py,layout.ellipses[0])!==ellipseContains(x,y,layout.ellipses[0])&&y>610&&!onStair(x,y,layout.stairs[0]))return false;
  const h=surface(x,y).height;if(Math.abs(h-previous)>2.5)return false;previous=h;px=x;py=y;
 }return true;
}
// A virtual start/end connects only to grid nodes on the same reachable surface.
// This avoids rounding a click across a wall, and shares navigation with Chapter 0.
function findPath(start,target,step=20){
 if(!walkable(start.x,start.y)||!walkable(target.x,target.y))return [];
 const sx=Math.round(start.x/step),sy=Math.round(start.y/step),ex=Math.round(target.x/step),ey=Math.round(target.y/step);
 const queue=[],parents=new Map(),positions=new Map();
 for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){
  const x=(sx+dx)*step,y=(sy+dy)*step,key=`${sx+dx},${sy+dy}`;
  if(canTraverse(start.x,start.y,x,y)){queue.push([sx+dx,sy+dy]);parents.set(key,null);positions.set(key,{x,y});}
 }
 for(let i=0;i<queue.length;i++){
  const [a,b]=queue[i],key=`${a},${b}`,x=a*step,y=b*step;
  if(Math.abs(a-ex)<=1&&Math.abs(b-ey)<=1&&canTraverse(x,y,target.x,target.y)){
   const path=[{x:target.x,y:target.y}];let k=key;
   while(k!==null){path.unshift(positions.get(k));k=parents.get(k);}return path;
  }
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=a+dx,ny=b+dy,k=`${nx},${ny}`;
   if(!parents.has(k)&&canTraverse(x,y,nx*step,ny*step)){parents.set(k,key);positions.set(k,{x:nx*step,y:ny*step});queue.push([nx,ny]);}
  }
 }return [];
}
function load(){
 if(pending)return pending;
 const list=[...['arrival-platform','system-core','broken-gateway','rescue-bay','system-beacon','floating-fragments'].map(id=>[id,`assets/ark-between-worlds/sprites/${id==='arrival-platform'?'arrival-platform-hd':id}.png`]),...layout.floors.map(f=>[f.id,`assets/ark-between-worlds/floors/${f.id}.png`]),...layout.details.map(id=>[id,`assets/ark-between-worlds/details/${id}.png`]),['mender','assets/chapter0/mender.png'],['valhalla','assets/animations/valhalla/idle-combat-atlas.png']];
 pending=Promise.all(list.map(([id,path])=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{images.set(id,image);resolve();};image.onerror=()=>reject(new Error(path));image.src=path;}))).then(()=>{ready=true;});return pending;
}
function sprite(c,id,x,y,width,top=false){c.imageSmoothingQuality='high';const img=images.get(id);if(!img)return;const h=width*img.naturalHeight/img.naturalWidth;c.drawImage(img,x-width/2,top?y:y-h*.68,width,h);}
function shadow(c,x,y,rx,ry,alpha=.22){
 c.save();c.translate(x,y);c.scale(rx,ry);const shade=c.createRadialGradient(0,0,0,0,0,1);shade.addColorStop(0,`rgba(53,70,99,${alpha})`);shade.addColorStop(1,'rgba(53,70,99,0)');c.fillStyle=shade;c.fillRect(-1,-1,2,2);c.restore();
}
function light(c,x,y,rx,ry,color,alpha){c.save();c.translate(x,y);c.scale(rx,ry);const g=c.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,`rgba(${color},${alpha})`);g.addColorStop(1,`rgba(${color},0)`);c.fillStyle=g;c.fillRect(-1,-1,2,2);c.restore();}
function line(c,a,b,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}
function rune(c,x,y,size=24,color='#a78e61'){c.strokeStyle=color;c.lineWidth=1.3;c.beginPath();c.moveTo(x-size,y);c.lineTo(x,y-size*.38);c.lineTo(x+size,y);c.lineTo(x,y+size*.38);c.closePath();c.stroke();line(c,[x-size*.4,y],[x+size*.4,y],color);}
function stairDraw(c,r){if(r.id==='arrival'||r.id==='gate')return;const w=r.width+24;c.drawImage(images.get('stair-flight'),r.x-w/2,r.top-7,w,r.bottom-r.top+17);}
function rail(c,a,b){
 const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/44));
 for(let i=0;i<=n;i++){const t=i/n,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;shadow(c,x,y,7,3,.25);line(c,[x,y],[x,y-24],'#949dac',4);line(c,[x-1,y-24],[x-1,y-2],'#f2ead9',1.5);}
 line(c,[a[0],a[1]-24],[b[0],b[1]-24],'#8a8d94',4);line(c,[a[0],a[1]-25],[b[0],b[1]-25],'#ddc79f',2);line(c,[a[0],a[1]-12],[b[0],b[1]-12],'#b6c8d1',1);
}
function floorDetails(c,time,chapter){
 for(const [x,y] of [[836,423],[550,490],[1084,480],[1368,666],[1500,913]])rune(c,x,y);
 for(const [i,s] of layout.sites.entries())if(s.id.startsWith('bay')){
  const active=i===2?chapter.menderRescued:i===3?chapter.completed:false;
  c.save();c.font='bold 13px monospace';c.textAlign='center';c.fillStyle=active?'#627d8e':'#939ba8';c.fillText('0'+(i-1)+' / '+(active?'ANCHORED':'STANDBY'),s.x,s.y+105);c.restore();
 }
 for(const [a,b] of [[[836,385],[836,560]],[[378,485],[660,557]],[[1015,531],[1165,432]],[[1375,662],[1432,734]]]){
  line(c,a,b,'#6f9cab66',2);line(c,[a[0]+4,a[1]+2],[b[0]+4,b[1]+2],'#e7dbc2',1);
  const t=(time*.14)%1,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;light(c,x,y,18,7,'123,214,230',.28);line(c,[x-4,y],[x+4,y],'#a7e7eb',2);
 }
 // Gateway damage and restrained expansion cues stay on architectural surfaces.
 for(const [x,y] of [[326,448],[206,501],[370,483]]){line(c,[x-8,y-5],[x,y],'#8796a5',1);line(c,[x,y],[x-3,y+8],'#8796a5',1);line(c,[x,y],[x+12,y+2],'#a5adb7',1);}
}
function crystal(c,time,active){
 const x=836,y=157,turn=time*.35,w=17+Math.abs(Math.cos(turn))*8,h=42;
 light(c,x,y,65,65,'110,204,225',active?.2:.1);
 c.save();c.globalAlpha=.9;c.beginPath();c.moveTo(x,y-h);c.lineTo(x+w,y);c.lineTo(x,y+h*.4);c.lineTo(x-w,y);c.closePath();c.fillStyle='#8ad7e4';c.fill();
 c.beginPath();c.moveTo(x,y-h);c.lineTo(x+Math.cos(turn)*w*.6,y);c.lineTo(x,y+h*.4);c.lineTo(x-w,y);c.closePath();c.fillStyle='#cbf7f4';c.fill();line(c,[x,y-h],[x+Math.cos(turn)*w*.6,y],'#f5ffff',1.5);c.restore();
 c.save();c.strokeStyle=active?'#81bfce88':'#aec5cd66';c.lineWidth=1;c.beginPath();c.ellipse(x,y+7,46,12,0,turn,turn+Math.PI*1.7);c.stroke();c.restore();
}
function gateField(c,time,chapter){
 const active=!!(chapter.completed||chapter.checkpoint==='signal'||chapter.checkpoint==='return');
 const x=260,y=335;c.save();
 if(active){
  light(c,x,y,86,101,'137,203,220',.14+Math.sin(time*1.1)*.025);
  c.strokeStyle='#91c5d27a';c.lineWidth=1.3;c.beginPath();c.ellipse(x,y,76,94,-.1,0,Math.PI*2);c.stroke();
  for(let i=0;i<5;i++){const t=time*.18+i*Math.PI*2/5,px=x+Math.cos(t)*72,py=y+Math.sin(t)*91;c.fillStyle='#c5f4fa';c.beginPath();c.arc(px,py,2,0,Math.PI*2);c.fill();}
  rune(c,x,y+55,22,'#a4cfd5aa');
 }else{light(c,x,y+85,24,9,'198,175,131',.15);}
 c.restore();
}
function draw(c,{time=0,chapter={},pilotDraw=null,pilotY=720,pilotX=830,motion=true}={}){
 if(!motion)time=0;
 const bg=c.createLinearGradient(0,-200,0,1400);bg.addColorStop(0,'#f5f3f6');bg.addColorStop(.65,'#dce3ed');bg.addColorStop(1,'#eef1f5');c.fillStyle=bg;c.fillRect(-3000,-2000,8000,6000);if(!ready)return;
 // Fog and distant architecture sit behind the player, never across her silhouette.
 c.save();c.globalAlpha=.13;sprite(c,'floating-fragments',80,250+Math.sin(time*.25)*8,230,true);sprite(c,'floating-fragments',1680,40+Math.sin(time*.2)*6,270,true);sprite(c,'broken-gateway',290,-130,190,true);sprite(c,'system-core',1770,740,110,true);c.restore();
 c.save();c.globalAlpha=.7;sprite(c,'gateway-rubble',382,281+Math.sin(time*.7)*4,35,true);c.restore();
 light(c,100,810,400,190,'255,255,255',.55);light(c,1750,840,330,170,'255,255,255',.55);
 for(const [x,y] of layout.supports)sprite(c,'support-bracket',x,y+38,72);
 for(const f of layout.floors){shadow(c,f.x+f.width*.5,f.y+f.height*.8,f.width*.48,60,.12);c.drawImage(images.get(f.id),f.x,f.y,f.width,f.height);}
 shadow(c,800,930,440,130,.18);sprite(c,'arrival-landing',800,1008,355);const arrival=layout.structures[0];sprite(c,arrival.id,arrival.x,arrival.y,arrival.width,true);
 for(const p of layout.thresholds){c.save();c.translate(p.x,p.y);c.rotate(p.angle);sprite(c,'bridge-threshold',0,0,p.width);c.restore();}
 floorDetails(c,time,chapter);gateField(c,time,chapter);
 // Station foot shadows establish weight without tinting the whole white floor.
 for(const s of layout.sites)shadow(c,s.x+8,s.y+32,s.id==='core'?120:145,33,.29);
 const objects=layout.structures.slice(1).map(s=>({depth:s.id==='rescue-bay'?s.depth-100:s.depth,draw:()=>{
  sprite(c,s.id,s.x,s.y,s.width,s.pivot==='top');
  const r=layout.stairs.find(r=>r.id===({'system-core':'core','broken-gateway':'gate'}[s.id]||layout.sites.find(t=>t.x===s.x)?.id));if(r)stairDraw(c,r);
 }}));
 // The same bay texture supplies small foreground pillar layers for occlusion.
 for(const s of layout.structures.filter(s=>s.id==='rescue-bay')){
  const img=images.get('rescue-bay'),scale=s.width/img.naturalWidth,top=s.y-img.naturalHeight*scale*.68;
  for(const [sx,sy,w,h] of [[0,76,88,122],[370,76,88,122],[190,0,78,98]]){
   const x=s.x-s.width/2+sx*scale,y=top+sy*scale;
   objects.push({depth:y+h*scale-7,draw:()=>c.drawImage(img,sx,sy,w,h,x,y,w*scale,h*scale)});
  }
 }
 for(const f of layout.fixtures)objects.push({depth:f.y,draw:()=>{shadow(c,f.x,f.y,17,6,.25);light(c,f.x,f.y,55,18,'160,214,224',.19);sprite(c,f.id,f.x,f.y,f.width);}});
 for(const p of layout.props)if(!p.requires||chapter[p.requires]||chapter.checkpoint==='return')objects.push({depth:p.y,draw:()=>{shadow(c,p.x,p.y,p.width*.4,p.width*.1,.22);sprite(c,p.id,p.x,p.y,p.width);if(p.id==='maintenance-console')light(c,p.x,p.y-42,12,6,'121,199,211',.12+Math.sin(time*2)*.04);}});
 for(const [a,b] of layout.rails)objects.push({depth:(a[1]+b[1])/2,draw:()=>rail(c,a,b)});
 if(chapter.completed||chapter.checkpoint==='return')objects.push({depth:490,draw:()=>sprite(c,'docking-cradle',1550,512,300)});
 if(chapter.menderRescued||chapter.checkpoint==='return')objects.push({depth:335,draw:()=>{
  const r=layout.residents.mender,img=images.get('mender'),h=r.height,w=h*img.naturalWidth/img.naturalHeight,bob=Math.sin(time*1.8)*1.1;shadow(c,r.x,r.y,28,7,.28);c.imageSmoothingEnabled=false;c.drawImage(img,r.x-w/2,r.y-h*.94+bob,w,h);c.imageSmoothingEnabled=true;
  light(c,r.x-9,r.y-h*.65,9,5,'242,199,111',.12+Math.sin(time*1.4)*.04);
 }});
 if(chapter.completed||chapter.checkpoint==='return')objects.push({depth:500,draw:()=>{
  const r=layout.residents.valhalla,img=images.get('valhalla'),frame=Math.floor(time*6)%6;shadow(c,r.x,r.y,45,12,.3);c.imageSmoothingEnabled=false;c.drawImage(img,frame*256,0,256,256,r.x-r.size/2,r.y-r.size*.94,r.size,r.size);c.imageSmoothingEnabled=true;
 }});
 if(pilotDraw)objects.push({depth:pilotY,draw:pilotDraw});objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
 // Active bays receive modest floor light; standby bays have a quiet amber anchor.
 for(const [i,s] of layout.sites.filter(s=>s.id.startsWith('bay')).entries()){
  const active=i===0?chapter.menderRescued:i===1?chapter.completed:false;
  light(c,s.x,s.y,75,23,active?(i===1?'182,153,201':'119,190,200'):'197,176,130',active?.09:.035);
 }
 crystal(c,time,!!chapter.updatedAt);
 const bob=Math.sin(time*1.5)*4;c.save();c.translate(830,520+bob);c.scale(.8+Math.cos(time*.6)*.12,1);sprite(c,'system-beacon',0,0,30,true);c.restore();
 if(chapter.warmLamp){light(c,1135,345,95,45,'255,208,126',.24);sprite(c,'ark-lantern',1135,345,42);}
 c.save();for(let i=0;i<24;i++){const x=60+(i*173)%1690,y=160+(i*97)%790-Math.sin(time*.4+i)*12;if(Math.hypot((x-pilotX)*.6,y-pilotY)<70)continue;c.globalAlpha=.13+Math.sin(time+i)*.08;c.fillStyle='#719cb2';c.fillRect(x,y,2,2);}c.restore();
}
root.ArkScene={layout,load,walkable,surface,canTraverse,findPath,draw,get ready(){return ready;}};
})(typeof window!=='undefined'?window:globalThis);
