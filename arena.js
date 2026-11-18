const canvas=document.getElementById('arena'),c=canvas.getContext('2d'),keys=new Set();
const overlay=document.getElementById('overlay'),begin=document.getElementById('begin');
const state={ready:false,started:false,paused:false,ended:false,scenery:false,enemies:[],shots:[],sparks:[],pointer:null,time:0};
const player={x:430,y:465,hp:500,z:0,vz:0,facing:1,action:'idle',timer:0,shootCooldown:0,bladeCooldown:0,dash:0,dashCooldown:0,invuln:0,dir:{x:1,y:0}};
const bg=new Image(),atlas=new Image(),combatAtlas=new Image();
c.imageSmoothingEnabled=false;
function load(img,src){return new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error(src));img.src=src;});}
Promise.all([load(bg,'assets/arenas/hangar-01-2_5d.png'),load(atlas,'assets/animations/valhalla/mobility-combat-atlas.png'),load(combatAtlas,'assets/animations/valhalla/idle-combat-atlas.png')]).then(()=>{state.ready=true;begin.disabled=false;begin.textContent='PLAY →';}).catch(()=>{document.getElementById('brief-copy').textContent='An arena asset could not load. Refresh to retry.';});
// A convex floor footprint excludes the rear wall, side machinery, reactor pit and foreground ledges.
const floor=[[230,280],[960,280],[1120,408],[1190,475],[880,675],[435,675],[110,492],[145,355]];
function inside(x,y){let hit=false;for(let i=0,j=floor.length-1;i<floor.length;j=i++){const a=floor[i],b=floor[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;}
function reset(){Object.assign(player,{x:430,y:465,hp:500,z:0,vz:0,facing:1,action:'idle',timer:0,shootCooldown:0,bladeCooldown:0,dash:0,dashCooldown:0,invuln:1,dir:{x:1,y:0}});state.enemies=[{id:0,x:790,y:355,hp:160,maxHp:160,cooldown:2.4},{id:1,x:990,y:470,hp:190,maxHp:190,cooldown:3.4},{id:2,x:750,y:590,hp:160,maxHp:160,cooldown:4.3}];state.shots=[];state.sparks=[];state.started=true;state.ended=false;state.paused=false;state.scenery=false;keys.clear();overlay.classList.add('hidden');sync();}
function pause(){if(!state.started||state.ended)return;state.paused=!state.paused;keys.clear();overlay.classList.toggle('hidden',!state.paused);document.getElementById('brief-title').textContent='MISSION PAUSED';document.getElementById('brief-copy').textContent='The hangar is on hold. Resume when you are ready.';begin.textContent='RESUME →';sync();}
begin.onclick=()=>{if(!state.ready)return;if(state.paused&&!state.ended){pause();return;}reset();};
function finish(won){state.ended=true;keys.clear();overlay.classList.remove('hidden');document.getElementById('brief-title').textContent=won?'HANGAR SECURED':'FRAME DISABLED';document.getElementById('brief-copy').textContent=won?'All three sentinels neutralized. Reactor access is secure.':'Armor depleted. Redeploy and use dash or jump to avoid incoming fire.';begin.textContent='REDEPLOY →';sync();}
function scenery(){state.scenery=!state.scenery;keys.clear();document.getElementById('environment').textContent=state.scenery?'RETURN TO ARENA':'VIEW ENVIRONMENT';overlay.classList.toggle('hidden',state.scenery||state.started&&!state.paused&&!state.ended);document.getElementById('canvas-tip').hidden=state.scenery;sync();}
document.getElementById('environment').onclick=scenery;
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();if(k==='escape'&&!e.repeat){pause();return;}if(k==='v'&&!e.repeat){scenery();return;}if(state.paused||state.ended||state.scenery||!state.started)return;keys.add(k);if(k===' '&&!e.repeat&&player.z===0)player.vz=340;if((k==='shift'||k==='k')&&!e.repeat&&player.dashCooldown<=0&&!locked()){player.dash=.28;player.dashCooldown=.9;player.invuln=.35;player.action='evade';player.timer=0;}});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{keys.clear();if(state.started&&!state.paused&&!state.ended)pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();if(state.started&&!state.paused&&!state.ended)pause();}});
canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();state.pointer={x:(e.clientX-r.left)*1280/r.width,y:(e.clientY-r.top)*720/r.height};});canvas.addEventListener('pointerleave',()=>{state.pointer=null;keys.delete('mouse');});canvas.addEventListener('pointerdown',e=>{if(e.button===0)keys.add('mouse');});window.addEventListener('pointerup',()=>keys.delete('mouse'));
function hit(enemy,damage){if(enemy.hp<=0)return;enemy.hp=Math.max(0,enemy.hp-damage);for(let i=0;i<8;i++)state.sparks.push({x:enemy.x,y:enemy.y-26,vx:(Math.random()-.5)*190,vy:(Math.random()-.5)*140,life:.35});}
const actionDurations={shoot:.34,blade:.5,charge:.65,barrage:.65,evade:.4};
function locked(){return !!actionDurations[player.action] && player.timer<actionDurations[player.action];}
function aim(){const targets=state.enemies.filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));const t=(keys.has('mouse')&&state.pointer)||targets[0]||{x:player.x+player.facing*100,y:player.y};const dx=t.x-player.x,dy=t.y-player.y,m=Math.hypot(dx,dy)||1;player.facing=dx>=0?1:-1;return {x:dx/m,y:dy/m};}
function projectile(damage=42,spread=0,piercing=false){const a=player.aim||aim(),angle=Math.atan2(a.y,a.x)+spread;state.shots.push({x:player.x,y:player.y,vx:Math.cos(angle)*750,vy:Math.sin(angle)*750,life:1.5,friendly:true,damage,piercing,hitIds:new Set()});}
function attack(kind){if(locked())return false;player.aim=aim();player.action=kind;player.timer=0;player.events=0;return true;}
function fire(){if(player.shootCooldown>0||!attack('shoot'))return;player.shootCooldown=.36;}
function attackEvents(before){const t=player.timer;
 if(player.action==='shoot'&&before<.11&&t>=.11)projectile();
 if(player.action==='blade')for(const [i,at] of [.17,.28].entries()){if(before<at&&t>=at){state.enemies.forEach(e=>{const dx=(e.x-player.x)*player.facing;if(dx>-50&&Math.hypot(e.x-player.x,(e.y-player.y)*1.3)<150)hit(e,i?35:40);});}}
 if(player.action==='charge'&&before<.325&&t>=.325)projectile(120,0,true);
 if(player.action==='barrage')for(const [i,at] of [.2,.3,.4].entries())if(before<at&&t>=at)projectile(38,(i-1)*.13);
}
function tick(dt){state.time+=dt;player.shootCooldown-=dt;player.bladeCooldown-=dt;player.dashCooldown-=dt;player.dash-=dt;player.invuln-=dt;const previousTimer=player.timer;player.timer+=dt;attackEvents(previousTimer);
 let dx=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft')),dy=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'));const mag=Math.hypot(dx,dy)||1;dx/=mag;dy/=mag;if(dx||dy){player.dir={x:dx,y:dy};if(dx)player.facing=dx>0?1:-1;}if(player.dash>0){dx=player.dir.x;dy=player.dir.y;}const speed=player.dash>0?650:205,nx=player.x+dx*speed*dt,ny=player.y+dy*speed*.7*dt;if(inside(nx,player.y))player.x=nx;if(inside(player.x,ny))player.y=ny;
 if(player.z>0||player.vz>0){player.vz-=900*dt;player.z=Math.max(0,player.z+player.vz*dt);if(!player.z)player.vz=0;}
 if(locked()){
   // Finish the active pose sequence before accepting another attack.
 }else{
   if(actionDurations[player.action])player.action='idle';
   if(keys.has('j')&&player.bladeCooldown<=0){attack('blade');player.bladeCooldown=.55;}
   else if(keys.has('i')&&player.shootCooldown<=0){attack('charge');player.shootCooldown=1.1;}
   else if(keys.has('o')&&player.shootCooldown<=0){attack('barrage');player.shootCooldown=1.3;}
   else if(keys.has('u')||keys.has('mouse'))fire();
   if(!locked())player.action=player.z>0?'jump':dx||dy?'walk':'idle';
 }
 for(const e of state.enemies){if(e.hp<=0)continue;e.cooldown-=dt;if(e.cooldown<=0){const ax=player.x-e.x,ay=player.y-e.y,m=Math.hypot(ax,ay)||1;state.shots.push({x:e.x,y:e.y,vx:ax/m*270,vy:ay/m*270,life:4,friendly:false});e.cooldown=2.6;}}
 for(const shot of state.shots){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;if(shot.friendly){for(const e of state.enemies){if(e.hp>0&&!shot.hitIds.has(e.id)&&Math.hypot(shot.x-e.x,shot.y-e.y)<28){shot.hitIds.add(e.id);hit(e,shot.damage);if(!shot.piercing){shot.life=0;break;}}}}else if(player.z<35&&player.invuln<=0&&Math.hypot(shot.x-player.x,shot.y-player.y)<24){player.hp=Math.max(0,player.hp-35);player.invuln=.5;shot.life=0;}}
 state.shots=state.shots.filter(s=>s.life>0);for(const p of state.sparks){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}state.sparks=state.sparks.filter(p=>p.life>0);if(player.hp<=0)finish(false);else if(state.enemies.every(e=>e.hp<=0))finish(true);sync();}
function sync(){document.getElementById('armor').textContent=`${player.hp} / 500`;document.getElementById('health-fill').style.width=`${player.hp/5}%`;document.getElementById('hostiles').textContent=`${state.started?state.enemies.filter(e=>e.hp>0).length:3} / 3`;document.getElementById('status').textContent=state.scenery?'ENVIRONMENT VIEW':state.ended?(player.hp?'ARENA CLEARED':'FRAME DISABLED'):state.paused?'PAUSED':state.started?'ENGAGED':'AWAITING DEPLOYMENT';}
function shadow(x,y,w){c.fillStyle='#07132066';c.beginPath();c.ellipse(x,y,w,w*.27,0,0,Math.PI*2);c.fill();}
function drawPlayer(){
 const scale=.7+player.y/1100,size=135*scale;shadow(player.x,player.y,25*scale);
 c.save();c.translate(Math.round(player.x),Math.round(player.y-player.z));c.scale(player.facing,1);
 if(player.invuln>0&&Math.floor(state.time*16)%2)c.globalAlpha=.55;
 let source=atlas,row=0,frame=0;
 if(player.action==='idle'){source=combatAtlas;row=0;frame=Math.floor(state.time*6)%6;}
 else if(player.action==='blade'){source=combatAtlas;row=1;frame=Math.min(5,Math.floor(player.timer*12));}
 else if(player.action==='charge'||player.action==='barrage'){source=combatAtlas;row=2;frame=Math.min(5,Math.floor(player.timer*9.23));}
 else if(player.action==='evade'){source=combatAtlas;row=3;frame=Math.min(5,Math.floor(player.timer*15));}
 else if(player.action==='shoot'){row=1;frame=Math.min(5,Math.floor(player.timer*18));}
 else if(player.action==='jump'){row=2;frame=player.vz>60?2:player.vz<-60?4:3;}
 else{row=0;frame=Math.floor(state.time*12)%6;}
 if(source.complete&&source.naturalWidth){const cw=source.naturalWidth/6,ch=source.naturalHeight/4;c.drawImage(source,frame*cw,row*ch,cw,ch,-size/2,-size*.93,size,size);}
 c.restore();
}
function drawEnemy(e){const scale=.65+e.y/1100;shadow(e.x,e.y,24*scale);c.save();c.translate(e.x,e.y);c.scale(scale,scale);c.fillStyle='#152537';c.strokeStyle='#db9b76';c.lineWidth=2;c.fillRect(-20,-57,40,38);c.strokeRect(-20,-57,40,38);c.fillStyle='#53687b';c.fillRect(-29,-52,11,28);c.fillRect(18,-52,11,28);c.fillRect(-17,-20,12,20);c.fillRect(5,-20,12,20);c.fillStyle='#ff6b67';c.fillRect(-11,-49,22,5);c.fillStyle='#ffcb88';c.fillRect(-5,-34,10,10);if(e.cooldown<.7){c.strokeStyle='#ff8d73';c.beginPath();c.ellipse(0,0,40,15,0,0,Math.PI*2);c.stroke();c.fillStyle='#ffc899';c.font='bold 15px monospace';c.fillText('!',-4,-76);}c.fillStyle='#101b29';c.fillRect(-25,-68,50,4);c.fillStyle='#ff9c81';c.fillRect(-25,-68,50*e.hp/e.maxHp,4);c.restore();}
function render(){c.clearRect(0,0,1280,720);if(bg.complete&&bg.naturalWidth)c.drawImage(bg,0,0,1280,720);if(state.scenery)return;if(!state.started)return;const entities=state.enemies.filter(e=>e.hp>0).map(e=>({y:e.y,draw:()=>drawEnemy(e)}));entities.push({y:player.y,draw:drawPlayer});entities.sort((a,b)=>a.y-b.y).forEach(e=>e.draw());for(const s of state.shots){c.strokeStyle=s.friendly?'#bbfaff':'#ffad77';c.lineWidth=s.friendly?4:6;c.beginPath();c.moveTo(s.x-s.vx*.025,s.y-35-s.vy*.025);c.lineTo(s.x,s.y-35);c.stroke();}for(const p of state.sparks){c.fillStyle='#ffe2ae';c.fillRect(p.x,p.y,3,3);}if(state.pointer){c.strokeStyle='#ddffff77';c.lineWidth=1;c.beginPath();c.arc(state.pointer.x,state.pointer.y-35,9,0,Math.PI*2);c.stroke();}}
let last=performance.now();function loop(now){const dt=Math.min(.04,(now-last)/1000);last=now;if(state.started&&!state.paused&&!state.ended&&!state.scenery)tick(dt);render();requestAnimationFrame(loop);}requestAnimationFrame(loop);sync();
