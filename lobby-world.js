const canvas=document.getElementById('lobby-canvas'),ctx=canvas.getContext('2d'),keys=new Set();
const assets=new Map(),labels=new Map(),lights=[],props=[];
const world={ready:false,width:1280,height:720,time:0,mode:'sun',mix:{...BASE_MAP.lighting.sun},camera:{x:1496,y:828,zoom:1.02,follow:true},path:[],nearest:null};
const pilot={x:BASE_MAP.spawn.x,y:BASE_MAP.spawn.y,direction:'down',moving:false,phase:0};
const hint=document.getElementById('interaction');
function iso(x,y){return {x:1400+(x-y)*48,y:90+(x+y)*24};}
function uniso(x,y){const dx=(x-1400)/48,dy=(y-90)/24;return {x:(dx+dy)/2,y:(dy-dx)/2};}
function screen(p){return {x:(p.x-world.camera.x)*world.camera.zoom+world.width/2,y:(p.y-world.camera.y)*world.camera.zoom+world.height/2};}
function worldPoint(x,y){return {x:(x-world.width/2)/world.camera.zoom+world.camera.x,y:(y-world.height/2)/world.camera.zoom+world.camera.y};}
function stopWalking(){world.path=[];pilot.moving=false;}
const buildings=BASE_MAP.buildings.map(b=>({...b,p:iso(b.x,b.y)}));
const gates=BASE_MAP.gates.map(g=>({...g,p:iso(g.x,g.y)}));
function inLand(x,y){let inside=false;const pts=BASE_MAP.outline;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
function riverTile(x,y){return x>25.8+Math.sin(y*.43)*.7&&y>4&&y<23;}
function blocked(x,y){if(!inLand(x,y)||riverTile(x,y))return true;return buildings.some(b=>Math.abs(x-b.x)<b.footprint[0]/2&&Math.abs(y-b.y)<b.footprint[1]/2)||props.some(p=>((p.id.startsWith('tree-')||p.id==='crates'||p.id==='bench')&&Math.hypot(x-p.x,y-p.y)<.5)||(p.id==='garden-pond'&&Math.hypot(x-p.x,y-p.y)<1.65));}
function findPath(start,end){const sx=Math.round(start.x),sy=Math.round(start.y),ex=Math.round(end.x),ey=Math.round(end.y);if(blocked(ex,ey))return [];const queue=[[sx,sy]],parent=new Map([[`${sx},${sy}`,null]]);for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===ex&&y===ey){const result=[];let key=`${x},${y}`;while(parent.get(key)!==null){const [a,b]=key.split(',').map(Number);result.unshift({x:a,y:b});key=parent.get(key);}return result;}for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,key=`${nx},${ny}`;if(!parent.has(key)&&!blocked(nx,ny)){parent.set(key,`${x},${y}`);queue.push([nx,ny]);}}}return [];}
function addProp(asset,x,y,width,light=null){const p=iso(x,y);props.push({id:asset,p,width,x,y});if(light)lights.push({x:p.x,y:p.y-width*(asset==='lamp-amber'?.85:.70),asset,width,radius:asset==='lamp-amber'?70:50,color:light,ground:{x:p.x,y:p.y}});}
// Hand-composed neighborhoods replace a perimeter ring and repeated grid spacing.
for(const [x,y,w] of [[4,7,175],[5,5,200],[7,4,165],[11,3,175],[14,3,155],[18,3,180],[23,4,160],[25,6,185],[26,12,170],[25,20,170],[22,23,190],[18,24,155],[13,24,170],[7,21,180],[4,18,185],[3,14,190],[3,11,160],[5,17,145]])addProp('tree-green',x,y,w);
for(const [x,y,w] of [[12,5,175],[20,4,190],[7,18,165],[21,22,155]])addProp('tree-pink',x,y,w);
for(const [x,y] of [[11,10],[14,12],[18,14],[21,11],[23,16],[12,18],[19,22]])addProp('lamp-amber',x,y,30,'#ffbd60');
for(const [x,y] of [[6,12],[24,19],[17,22]])addProp('lamp-cyan',x,y,38,'#61e9ff');
for(const [x,y,w] of [[8,8,105],[12,7,85],[24,14,90],[25,15,65]])addProp('crates',x,y,w);
for(const [x,y] of [[10,19],[12,19],[20,9]])addProp('bench',x,y,96);
for(const [x,y,w] of [[12,16,72],[14,11,80],[19,13,70],[22,11,60],[11,20,60],[20,17,60]])addProp('planter',x,y,w);
addProp('garden-pond',8,21,320);
addProp('garden-terrace',17,7,300);
addProp('garden-terrace',23,5,260);
addProp('waterfall',27,9,360);
addProp('waterfall',27,19,300);
for(const b of buildings){const height=b.width;for(const [x,y] of b.windows)lights.push({x:b.p.x+x*b.width,y:b.p.y+y*height,radius:55,color:b.cyan?'#66efff':'#ffd083',building:true});if(b.cyan)lights.push({x:b.p.x,y:b.p.y-b.width*.65,radius:95,color:'#50dfff',building:true});}
for(const g of gates)lights.push({x:g.p.x,y:g.p.y-120,radius:90,color:'#7df6ff',building:true});
function setTime(mode){if(!BASE_MAP.lighting[mode])return;world.mode=mode;document.querySelectorAll('[data-time]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.time===mode));try{localStorage.setItem('mecharise-lighting',mode);}catch{}}
try{setTime(localStorage.getItem('mecharise-lighting')||'sun');world.mix={...BASE_MAP.lighting[world.mode]};}catch{}
document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>setTime(b.dataset.time));
function gatePanel(g){stopWalking();keys.clear();content.innerHTML=`<span class="eyebrow">SECTOR TRANSIT</span><h2>${g.name}</h2><p>Choose a destination beyond the base.</p><div class="mission-list">${g.stages.map(i=>`<a class="mission-choice" href="${i===0?'arena.html':`combat.html?stage=${i}`}"><span>0${i+1} / ${missionNames[i]}</span><small>DEPLOY →</small></a>`).join('')}</div>`;dialog.showModal();}
for(const obj of [...buildings,...gates]){const label=document.createElement('button');label.className='world-label'+(obj.stages?' gate':'');label.textContent=obj.name;label.setAttribute('aria-label',obj.stages?`Open ${obj.name}`:`Open ${obj.name}`);label.onclick=()=>obj.stages?gatePanel(obj):openStation(obj.id);document.getElementById('station-labels').append(label);labels.set(obj.id,label);}
function setZoom(value){world.camera.zoom=Math.max(.45,Math.min(1.6,value));document.getElementById('zoom-label').textContent=`${Math.round(world.camera.zoom*100)}%`;}
document.getElementById('zoom-in').onclick=()=>setZoom(world.camera.zoom+.15);document.getElementById('zoom-out').onclick=()=>setZoom(world.camera.zoom-.15);document.getElementById('center-camera').onclick=()=>{world.camera.follow=true;};setZoom(world.camera.zoom);
let drag=null;
canvas.addEventListener('pointerdown',e=>{if(dialog.open||!world.ready)return;canvas.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};});
canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>6)drag.moved=true;if(drag.moved){world.camera.follow=false;world.camera.x-=dx/world.camera.zoom;world.camera.y-=dy/world.camera.zoom;}drag.lastX=e.clientX;drag.lastY=e.clientY;});
canvas.addEventListener('pointerup',e=>{if(!drag)return;if(!drag.moved){const r=canvas.getBoundingClientRect(),p=worldPoint(e.clientX-r.left,e.clientY-r.top),tile=uniso(p.x,p.y);world.path=findPath(pilot,tile);if(world.path.length)world.camera.follow=true;}drag=null;});canvas.addEventListener('pointercancel',()=>drag=null);
canvas.addEventListener('wheel',e=>{e.preventDefault();setZoom(world.camera.zoom-e.deltaY*.001);},{passive:false});
window.addEventListener('keydown',e=>{if(dialog.open)return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','e','c'].includes(k)){e.preventDefault();keys.add(k);if(k==='c')world.camera.follow=true;if(k==='e'&&world.nearest&&!e.repeat){const n=world.nearest;n.stages?gatePanel(n):openStation(n.id);}}});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();drag=null;});
for(const b of document.querySelectorAll('[data-move]')){b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.move);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.move);}
const terrain=document.createElement('canvas');terrain.width=3000;terrain.height=1800;const tc=terrain.getContext('2d');
function distanceSegment(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
function pathTile(x,y){return BASE_MAP.paths.some(route=>route.slice(1).some((b,i)=>distanceSegment(x,y,route[i],b)<1.0))||Math.hypot(x-17,y-15)<2.1||buildings.some(b=>Math.abs(x-b.x)<b.footprint[0]/2+.35&&Math.abs(y-b.y)<b.footprint[1]/2+.35);}
function terrainCache(){
 tc.clearRect(0,0,terrain.width,terrain.height);
 const cliff=assets.get('cliff-bank');
 // Natural rocky banks follow a nonrectangular land silhouette.
 for(let sum=0;sum<60;sum++)for(let x=0;x<30;x++){const y=sum-x;if(y<0||y>=26||!inLand(x,y))continue;if(!inLand(x+1,y)||!inLand(x,y+1)){const p=iso(x,y),w=165,h=w*cliff.naturalHeight/cliff.naturalWidth;tc.drawImage(cliff,p.x-w/2,p.y+85-h,w,h);}}
 for(let sum=0;sum<60;sum++)for(let x=0;x<30;x++){const y=sum-x;if(y<0||y>=26)continue;const land=inLand(x,y),river=riverTile(x,y);if(!land&&!river)continue;const p=iso(x,y),id=river?'water':pathTile(x,y)?'path':(x*7+y*11)%5===0?'flowers':'grass';tc.drawImage(assets.get(id),p.x-49,p.y-25,98,51);}
 // Warm stone curbs edge the central plaza without widening every road.
 for(const [x,y] of [[15,15],[16,17],[18,17]]){const p=iso(x,y);tc.strokeStyle='#e7d6ac88';tc.lineWidth=3;tc.beginPath();tc.moveTo(p.x-40,p.y);tc.lineTo(p.x,p.y+20);tc.stroke();}
}
function resize(){world.width=innerWidth;world.height=innerHeight;const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(world.width*ratio);canvas.height=Math.round(world.height*ratio);canvas.style.width=world.width+'px';canvas.style.height=world.height+'px';ctx.setTransform(ratio,0,0,ratio,0,0);}
window.addEventListener('resize',resize);resize();
async function load(){try{const response=await fetch('assets/lobby/modular/asset-manifest.json');if(!response.ok)throw new Error('manifest');const manifest=await response.json();await Promise.all(manifest.assets.map(a=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{assets.set(a.id,img);resolve();};img.onerror=reject;img.src=a.file;})));for(const l of lights){if(l.asset){const img=assets.get(l.asset),h=l.width*img.naturalHeight/img.naturalWidth;l.y=l.ground.y-h*(l.asset==='lamp-amber'?.78:.68);}}terrainCache();world.ready=true;document.getElementById('world-loading').hidden=true;}catch{document.getElementById('world-loading').textContent='BASE COULD NOT LOAD · REFRESH TO RETRY';}}
function update(dt){world.time+=dt;const target=BASE_MAP.lighting[world.mode],t=1-Math.exp(-dt*3);world.mix.opacity+=(target.opacity-world.mix.opacity)*t;world.mix.lamps+=(target.lamps-world.mix.lamps)*t;world.mix.shadow+=(target.shadow-world.mix.shadow)*t;world.mix.tint=world.mix.tint.map((v,i)=>v+(target.tint[i]-v)*t);
 pilot.moving=false;if(!dialog.open){let dx=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft')),dy=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'));if(dx||dy){world.path=[];world.camera.follow=true;}else if(world.path.length){const step=world.path[0],from=iso(pilot.x,pilot.y),to=iso(step.x,step.y);dx=to.x-from.x;dy=to.y-from.y;if(Math.hypot(dx,dy)<7){pilot.x=step.x;pilot.y=step.y;world.path.shift();dx=dy=0;}}
 if(dx||dy){const magnitude=Math.hypot(dx,dy),sx=dx/magnitude*175*dt,sy=dy/magnitude*175*dt;const from=iso(pilot.x,pilot.y);const desired=uniso(from.x+sx,from.y+sy);if(!blocked(desired.x,desired.y)){pilot.x=desired.x;pilot.y=desired.y;pilot.moving=true;}else{const a=uniso(from.x+sx,from.y),b=uniso(from.x,from.y+sy);if(!blocked(a.x,a.y)){pilot.x=a.x;pilot.y=a.y;pilot.moving=true;}else if(!blocked(b.x,b.y)){pilot.x=b.x;pilot.y=b.y;pilot.moving=true;}else world.path=[];}pilot.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';if(pilot.moving)pilot.phase+=dt*9;}
 }
 const pos=iso(pilot.x,pilot.y);if(world.camera.follow){const speed=1-Math.exp(-dt*7);world.camera.x+=(pos.x-world.camera.x)*speed;world.camera.y+=(pos.y-30-world.camera.y)*speed;}world.camera.x=Math.max(300,Math.min(2500,world.camera.x));world.camera.y=Math.max(250,Math.min(1400,world.camera.y));world.nearest=null;let nearest=150;for(const b of [...buildings,...gates]){const d=Math.hypot(pos.x-b.p.x,(pos.y-b.p.y)*1.4);if(d<nearest){nearest=d;world.nearest=b;}const label=labels.get(b.id),p=screen({x:b.p.x,y:b.p.y+22});label.style.left=p.x+'px';label.style.top=p.y+'px';label.hidden=p.x<-70||p.x>world.width+70||p.y<-30||p.y>world.height+30;label.classList.toggle('nearby',world.nearest===b);}hint.textContent=world.nearest?`[E] ${world.nearest.name}`:pilot.moving?'Exploring base…':'WASD · Move   /   Click · Walk   /   Drag · Look around';}
function sprite(id,p,width,pivot=.94,pixel=false){const img=assets.get(id);if(!img)return;const h=width*img.naturalHeight/img.naturalWidth;ctx.imageSmoothingEnabled=!pixel;ctx.drawImage(img,p.x-width/2,p.y-h*pivot,width,h);ctx.imageSmoothingEnabled=true;}
function shadow(p,w){ctx.fillStyle=`rgba(14,28,34,${world.mix.shadow})`;ctx.beginPath();ctx.ellipse(p.x,p.y,w,w*.32,-.1,0,Math.PI*2);ctx.fill();}
function glow(x,y,radius,color,alpha){ctx.save();ctx.globalAlpha=alpha;ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(x,y,0,x,y,radius);g.addColorStop(0,color+'bd');g.addColorStop(.25,color+'50');g.addColorStop(1,color+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();ctx.restore();}
function render(){const palette=BASE_MAP.lighting[world.mode];const sky=ctx.createLinearGradient(0,0,0,world.height);sky.addColorStop(0,palette.sky[0]);sky.addColorStop(1,palette.sky[1]);ctx.fillStyle=sky;ctx.fillRect(0,0,world.width,world.height);ctx.save();ctx.translate(world.width/2,world.height/2);ctx.scale(world.camera.zoom,world.camera.zoom);ctx.translate(-world.camera.x,-world.camera.y);ctx.drawImage(terrain,0,0);
 // Subtle river highlights animate independently of the scenic waterfall sprites.
 for(const [x,y] of [[27,10],[27,19]]){const p=iso(x,y);ctx.save();ctx.globalAlpha=.25;ctx.strokeStyle='#c7fff3';ctx.lineWidth=2;for(let j=0;j<5;j++){const yy=(world.time*28+j*17)%75;ctx.beginPath();ctx.ellipse(p.x+Math.sin(j)*14,p.y+yy,15,4,0,0,Math.PI*1.5);ctx.stroke();}ctx.restore();}
 const drawables=[];for(const b of buildings)drawables.push({depth:b.p.y,draw:()=>{shadow(b.p,b.width*.32);sprite(b.id,b.p,b.width);}});for(const p of props)drawables.push({depth:p.p.y,draw:()=>{if(p.width>65)shadow(p.p,p.width*.24);sprite(p.id,p.p,p.width);}});for(const g of gates)drawables.push({depth:g.p.y,draw:()=>sprite('sector-gate',g.p,g.width)});
 const p=iso(pilot.x,pilot.y);drawables.push({depth:p.y+4,draw:()=>{shadow(p,17);const frame=pilot.moving?Math.floor(pilot.phase)%4:0;sprite(`${pilot.direction}-${String(frame+1).padStart(2,'0')}`,{x:p.x,y:p.y+3},90,1,true);}});drawables.sort((a,b)=>a.depth-b.depth).forEach(d=>d.draw());ctx.restore();
 ctx.fillStyle=`rgba(${world.mix.tint.map(Math.round).join(',')},${world.mix.opacity})`;ctx.fillRect(0,0,world.width,world.height);
 ctx.save();ctx.translate(world.width/2,world.height/2);ctx.scale(world.camera.zoom,world.camera.zoom);ctx.translate(-world.camera.x,-world.camera.y);
 for(const l of lights){const flicker=.96+.04*Math.sin(world.time*2.4+l.x);glow(l.x,l.y,l.radius,l.color,world.mix.lamps*flicker*.72);if(l.ground)glow(l.ground.x,l.ground.y,55,l.color,world.mix.lamps*.36);ctx.save();ctx.globalAlpha=world.mix.lamps;ctx.fillStyle=l.color;ctx.shadowBlur=8;ctx.shadowColor=l.color;ctx.fillRect(l.x-2,l.y-4,4,8);ctx.restore();}
 if(world.path.length){const end=iso(world.path.at(-1).x,world.path.at(-1).y);ctx.strokeStyle='#fff1b0aa';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(end.x,end.y,14,7,0,0,Math.PI*2);ctx.stroke();}
 if(world.mode!=='sun')for(let i=0;i<25;i++){const x=700+(i*137)%1400+Math.sin(world.time*.4+i)*20,y=300+(i*83)%900+Math.sin(world.time*.7+i)*12;glow(x,y,7,'#dcffa6',(.3+.3*Math.sin(world.time+i))*world.mix.lamps);}
 ctx.restore();}
let last=performance.now();function frame(now){const dt=Math.min(.04,(now-last)/1000);last=now;if(world.ready){update(dt);render();}requestAnimationFrame(frame);}load();requestAnimationFrame(frame);
