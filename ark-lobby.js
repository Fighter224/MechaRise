const canvas=document.getElementById('ark-canvas'),ctx=canvas.getContext('2d'),dialog=document.getElementById('station-dialog'),content=document.getElementById('dialog-content'),hint=document.getElementById('interaction'),keys=new Set();
const sprites=new Map();
if(window.Chapter0?.load().completed&&!window.Chapter0.load().rewardsGranted)window.Chapter0.grantRewards();
const chapter=window.Chapter0?.load()||{completed:false,menderRescued:false,warmLamp:false};
document.getElementById('chapter-entry').href=window.Chapter0?.url('chapter.html')||'chapter.html';
document.getElementById('chapter-entry').textContent=chapter.completed?'✓ CHAPTER 0':chapter.updatedAt?'▶ CONTINUE CHAPTER':'▶ BEGIN CHAPTER 0';
const ark={ready:false,width:1280,height:720,time:0,zoom:1,camera:{x:900,y:555},path:[],nearest:null,follow:false};
const pilot={x:830,y:720,direction:'down',phase:0,moving:false};
const siteNames={core:'SYSTEM CORE',gate:'MULTIVERSE GATE',bay1:'RESCUE BAY 01',bay2:'RESCUE BAY 02',bay3:'RESCUE BAY 03'};
const sites=ArkScene.layout.sites.map(s=>({...s,name:siteNames[s.id]}));
if(chapter.menderRescued)sites[2].name='MENDER / M-03';if(chapter.completed)sites[3].name='VALHALLA / GX-01';
function walkable(x,y){return ArkScene.walkable(x,y);}
function routeTo(x,y){return ArkScene.findPath(pilot,{x,y});}
function requestMove(x,y){
 ark.path=routeTo(x,y);const valid=ark.path.length>0;
 ark.feedback={x,y,valid,at:ark.time};
 if(!valid)window.ArkAudio?.play('blocked',.5);
 return valid;
}
const reducedMotion=!!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
function project(x,y){return {x:(x-ark.camera.x)*ark.zoom+ark.width/2,y:(y-ark.camera.y)*ark.zoom+ark.height/2};}
function unproject(x,y){return {x:(x-ark.width/2)/ark.zoom+ark.camera.x,y:(y-ark.height/2)/ark.zoom+ark.camera.y};}
const labels=new Map();for(const s of sites){const b=document.createElement('button');b.className='world-label'+(s.id.startsWith('bay')?' bay':'');b.innerHTML=`<span class="station-code">${s.id==='core'?'◇':s.id==='gate'?'⌁':s.id.slice(-1).padStart(2,'0')}</span><span class="station-name">${s.name}</span>`;b.title=s.name;b.setAttribute('aria-label',`Open ${s.name.toLowerCase()}`);b.onclick=()=>openSite(s);document.getElementById('station-labels').append(b);labels.set(s.id,b);}
const missionNames=['Industrial Hangar','Mech Chamber','Damaged Corridor','Reactor Chasm','Sunset City Ruins','Eclipse Wasteland'];
function stop(){keys.clear();ark.path=[];pilot.moving=false;}
function openSite(s){stop();window.ArkAudio?.play('link-chime',.5);const title=s.id==='bay1'&&chapter.menderRescued?'MENDER / M-03':s.name,head=`<span class="eyebrow">ARK BETWEEN WORLDS</span><h2>${title}</h2>`;
if(s.id==='core'){content.innerHTML=head+'<p>“Humanity built robots everywhere, until technology and war became inseparable. I ask one thing: retrieve the machines I entrusted to them.”</p><p>“Every confirmed retrieval grants resources and authorization to control the returned robot.”</p><a class="primary" href="chapter.html">'+(chapter.completed?'REVIEW CHAPTER 0':'CONTINUE THE LAST SIGNAL')+'</a><a class="primary" href="squad.html">ROBOT ARCHIVE →</a>'+(chapter.completed?'<p class="notice">Chapter 0 confirmed · 150 scrap issued · Valhalla control and Mender support authorized.</p>':'');}
else if(s.id==='gate'){content.innerHTML=head+'<p>Anchored world signals.</p><div class="mission-list">'+missionNames.map((n,i)=>{if(i===0)return `<a class="mission-choice" href="${chapter.completed?'arena.html':'chapter.html'}"><span>01 / ${n}</span><small>${chapter.completed?'REVISIT':'CHAPTER 0 →'}</small></a>`;if(i===1&&chapter.completed)return `<a class="mission-choice" href="combat.html?stage=1"><span>02 / ${n}</span><small>NEW SIGNAL →</small></a>`;return `<div class="mission-choice" aria-disabled="true" style="opacity:.45"><span>0${i+1} / ${n}</span><small>NO ANCHOR</small></div>`;}).join('')+'</div>';}
else if(s.id==='bay1'&&chapter.menderRescued){content.innerHTML=head+'<p>“I checked the lamp again. It still works. I think... I like having time to notice that.”</p><div class="panel-stats"><div>ANCHOR<b>STABLE</b></div><div>ROLE<b>REPAIR</b></div><div>STATUS<b>HOME</b></div></div><p>Mender is the Ark’s first resident. Valhalla is anchored in bay two.</p>';}
else if(s.id==='bay2'&&chapter.completed){content.innerHTML=head+'<p>GX-01 Valhalla is anchored. Permanent operator control is authorized; its identity records remain fragmented.</p><a class="primary" href="squad.html">VIEW VALHALLA →</a>';}
else{content.innerHTML=head+'<p>This bay is empty. No returned robot is linked to this platform.</p><div class="panel-stats"><div>LINK<b>EMPTY</b></div><div>POWER<b>STANDBY</b></div><div>ANCHOR<b>STABLE</b></div></div>';}
if(window.Chapter0?.playtest)for(const a of content.querySelectorAll('a'))a.setAttribute('href',Chapter0.url(a.getAttribute('href')));if(!dialog.open)dialog.showModal();}
document.getElementById('close-dialog').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.getElementById('help-button').onclick=()=>{stop();content.innerHTML='<span class="eyebrow">SYSTEM GUIDANCE</span><h2>Move through the Ark.</h2><p>WASD or arrow keys to move. Click the floor to walk to a destination. Use the stairs to enter raised decks; their edges cannot be crossed. Press E near the system core, multiverse gate, or a rescue bay to interact.</p><p>Drag to look around. Scroll or use +/− to zoom. Press C or the center button to restore the sanctuary view. Hover or approach a station marker to reveal its name. Click it to open the station. Use the music button to enable ambient sound and footsteps.</p><a class="ark-link" href="village.html">Previous village prototype ↗</a>';dialog.showModal();};
function fit(){return Math.min(ark.width/(ArkScene.layout.width+100),ark.height/(ArkScene.layout.height+20));}
function zoom(v){ark.zoom=Math.max(fit()*.75,Math.min(fit()*2.2,v));document.getElementById('zoom-label').textContent=`${Math.round(ark.zoom/fit()*100)}%`;}
function center(){ark.camera={x:900,y:555};ark.follow=false;zoom(fit());}
function resize(){ark.width=innerWidth;ark.height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=ark.width*dpr;canvas.height=ark.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);center();}
window.addEventListener('resize',resize);resize();document.getElementById('center-camera').onclick=center;document.getElementById('zoom-in').onclick=()=>zoom(ark.zoom*1.15);document.getElementById('zoom-out').onclick=()=>zoom(ark.zoom/1.15);
let drag=null;canvas.addEventListener('pointerdown',e=>{if(!ark.ready||dialog.open)return;canvas.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,lx:e.clientX,ly:e.clientY,moved:false};});canvas.addEventListener('pointermove',e=>{if(!drag)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>6)drag.moved=true;if(drag.moved){ark.follow=false;ark.camera.x-=(e.clientX-drag.lx)/ark.zoom;ark.camera.y-=(e.clientY-drag.ly)/ark.zoom;}drag.lx=e.clientX;drag.ly=e.clientY;});canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved){const r=canvas.getBoundingClientRect(),p=unproject(e.clientX-r.left,e.clientY-r.top);requestMove(p.x,p.y);}drag=null;});canvas.addEventListener('pointercancel',()=>drag=null);canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(ark.zoom*Math.exp(-e.deltaY*.001));},{passive:false});
window.addEventListener('keydown',e=>{if(dialog.open)return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','e','c'].includes(k)){e.preventDefault();keys.add(k);if(k==='e'&&ark.nearest&&!e.repeat)openSite(ark.nearest);if(k==='c')center();}});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();drag=null;});for(const b of document.querySelectorAll('[data-move]')){b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.move);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.move);}
function loadImage(img,path){return new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=path;});}
Promise.all([ArkScene.load(),...['down','left','right','up'].flatMap(d=>Array.from({length:4},(_,i)=>{const id=`${d}-${String(i+1).padStart(2,'0')}`,img=new Image();sprites.set(id,img);return loadImage(img,`assets/lobby/modular/pilot/${id}.png`);} ))]).then(()=>{ark.ready=true;document.getElementById('world-loading').hidden=true;}).catch(()=>{document.getElementById('world-loading').textContent='SANCTUARY COULD NOT LOAD · REFRESH TO RETRY';});
function update(dt){
 ark.time+=dt;pilot.moving=false;
 if(!dialog.open){
  let dx=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'));
  let dy=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'));
  const keyboard=!!(dx||dy);if(keyboard)ark.path=[];
  let remaining=Infinity;
  if(!keyboard&&ark.path.length){
   const next=ark.path[0];dx=next.x-pilot.x;dy=next.y-pilot.y;remaining=Math.hypot(dx,dy);
   if(remaining<.7&&ArkScene.canTraverse(pilot.x,pilot.y,next.x,next.y)){pilot.x=next.x;pilot.y=next.y;ark.path.shift();dx=dy=0;}
  }
  if(dx||dy){
   const n=Math.hypot(dx,dy),speed=ArkScene.surface(pilot.x,pilot.y).stair?142:190,travel=Math.min(remaining,speed*dt);
   const nx=pilot.x+dx/n*travel,ny=pilot.y+dy/n*travel;
   if(ArkScene.canTraverse(pilot.x,pilot.y,nx,ny)){pilot.x=nx;pilot.y=ny;pilot.moving=true;}
   else if(keyboard&&ArkScene.canTraverse(pilot.x,pilot.y,nx,pilot.y)){pilot.x=nx;pilot.moving=true;}
   else if(keyboard&&ArkScene.canTraverse(pilot.x,pilot.y,pilot.x,ny)){pilot.y=ny;pilot.moving=true;}
   else{ark.path=[];if(!ark.feedback||ark.time-ark.feedback.at>1)ark.feedback={x:nx,y:ny,valid:false,at:ark.time};}
   pilot.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';if(pilot.moving)pilot.phase+=dt*(speed/22);
  }
 }
 const p=project(pilot.x,pilot.y);
 if(pilot.moving&&ark.zoom>fit()*1.1&&(p.x<ark.width*.18||p.x>ark.width*.82||p.y<ark.height*.2||p.y>ark.height*.82))ark.follow=true;
 if(ark.follow){const t=1-Math.exp(-dt*4);ark.camera.x+=(pilot.x-ark.camera.x)*t;ark.camera.y+=(pilot.y-ark.camera.y)*t;}
 ark.nearest=null;let best=Infinity;
 for(const s of sites){
  const d=Math.hypot(s.x-pilot.x,s.y-pilot.y);if(d<s.radius&&d<best){ark.nearest=s;best=d;}
  const offset=s.id==='core'?{x:140,y:10}:s.id==='gate'?{x:-160,y:36}:{x:s.id==='bay2'?191:170,y:18};
  const b=labels.get(s.id),p=project(s.x+offset.x,s.y+offset.y);b.style.left=p.x+'px';b.style.top=p.y+'px';b.hidden=p.x<-30||p.x>ark.width+30||p.y<0||p.y>ark.height+30;
 }
 for(const s of sites)labels.get(s.id).classList.toggle('nearby',ark.nearest===s);
 const ground=ArkScene.surface(pilot.x,pilot.y);pilot.elevation=ground.height;
 const blocked=ark.feedback&&!ark.feedback.valid&&ark.time-ark.feedback.at<1.5;
 hint.textContent=blocked?'NO ROUTE · Use the stair entrances':ground.stair?'STAIRS · '+(ground.stair==='arrival'?'ARRIVAL DECK':'RAISED PLATFORM'):ark.nearest?`[E] ${ark.nearest.name}`:pilot.moving?'':'WASD · Move  /  Click · Walk';
 window.ArkAudio?.update(pilot,dt,ark.time);
}
function drawPilot(){
 const frame=pilot.moving?Math.floor(pilot.phase)%4+1:1,img=sprites.get(`${pilot.direction}-${String(frame).padStart(2,'0')}`),size=88;
 const ground=ArkScene.surface(pilot.x,pilot.y),breath=reducedMotion?0:Math.sin(ark.time*2.2)*.8;
 const lift=pilot.moving&&ground.stair&&!reducedMotion?Math.max(0,Math.sin(pilot.phase*Math.PI))*2:0;
 ctx.save();ctx.fillStyle='#344a6555';ctx.beginPath();ctx.ellipse(pilot.x+1,pilot.y,ground.stair?13:17,ground.stair?3:5,0,0,Math.PI*2);ctx.fill();
 if(ground.material==='metal'){
  ctx.save();ctx.translate(pilot.x,pilot.y+1);ctx.scale(1,-.25);ctx.globalAlpha=.07;ctx.imageSmoothingEnabled=false;ctx.drawImage(img,-size/2,-size,size,size);ctx.restore();
 }
 ctx.imageSmoothingEnabled=false;ctx.filter='drop-shadow(0px 1px 1px rgba(34,48,67,.4))';
 ctx.drawImage(img,Math.round(pilot.x-size/2),Math.round(pilot.y-size+4-lift-breath),size,size+breath);ctx.restore();
}
function drawRoute(){
 if(ark.path.length){
  ctx.save();ctx.setLineDash([2,9]);ctx.lineWidth=2;ctx.strokeStyle='#587f9388';ctx.beginPath();ctx.moveTo(pilot.x,pilot.y);for(const p of ark.path)ctx.lineTo(p.x,p.y);ctx.stroke();ctx.restore();
  const goal=ark.path.at(-1),pulse=reducedMotion?0:Math.sin(ark.time*5)*2;ctx.strokeStyle='#5b9baf';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(goal.x,goal.y,12+pulse,5+pulse*.3,0,0,Math.PI*2);ctx.stroke();
 }
 const f=ark.feedback;if(!f)return;const age=ark.time-f.at;if(age>1.5)return;
 ctx.save();ctx.globalAlpha=1-age/1.5;ctx.strokeStyle=f.valid?'#78aebf':'#ac6c65';ctx.lineWidth=2;
 if(f.valid){ctx.beginPath();ctx.ellipse(f.x,f.y,12+age*12,5+age*4,0,0,Math.PI*2);ctx.stroke();}
 else{ctx.beginPath();ctx.moveTo(f.x-6,f.y-6);ctx.lineTo(f.x+6,f.y+6);ctx.moveTo(f.x+6,f.y-6);ctx.lineTo(f.x-6,f.y+6);ctx.stroke();}ctx.restore();
}
function render(){ctx.clearRect(0,0,ark.width,ark.height);ctx.save();ctx.translate(ark.width/2,ark.height/2);ctx.scale(ark.zoom,ark.zoom);ctx.translate(-ark.camera.x,-ark.camera.y);ArkScene.draw(ctx,{time:ark.time,chapter,pilotDraw:drawPilot,pilotY:pilot.y,pilotX:pilot.x,motion:!reducedMotion});
 drawRoute();ctx.restore();}
let last=performance.now();function loop(now){const dt=Math.min(.04,(now-last)/1000);last=now;if(ark.ready){update(dt);render();}requestAnimationFrame(loop);}requestAnimationFrame(loop);

const audioButton=document.getElementById('sound-button');
if(audioButton)audioButton.onclick=async()=>{audioButton.disabled=true;const on=await window.ArkAudio?.toggle();audioButton.disabled=false;audioButton.textContent=on?'♫':'♪';audioButton.setAttribute('aria-pressed',String(!!on));audioButton.setAttribute('aria-label',on?'Mute sanctuary sound':'Enable sanctuary sound');audioButton.title=on?'Sound on':'Sound off';};
window.addEventListener('blur',()=>window.ArkAudio?.suspend());
window.addEventListener('focus',()=>window.ArkAudio?.resume());
document.addEventListener?.('visibilitychange',()=>{if(document.hidden)window.ArkAudio?.suspend();else window.ArkAudio?.resume();});
