const stations = {
  hangar: {name:'Mech Bay',x:.32,y:.37}, command:{name:'Command',x:.51,y:.66},
  medical:{name:'Med Bay',x:.47,y:.29}, supply:{name:'Supply Depot',x:.70,y:.43},
  lounge:{name:'Crew Quarters',x:.34,y:.66}, deploy:{name:'Deployment',x:.66,y:.76}
};
let save = {scrap:0,armor:0,missions:0};
try { Object.assign(save,JSON.parse(localStorage.getItem('mecharise-save') || '{}')); } catch {}
function persist(){try{localStorage.setItem('mecharise-save',JSON.stringify(save));}catch{} document.getElementById('scrap').textContent=save.scrap;}
persist();
const dialog=document.getElementById('station-dialog'), content=document.getElementById('dialog-content');
const missionNames=['Industrial Hangar','Mech Chamber','Damaged Corridor','Reactor Chasm','Sunset City Ruins','Eclipse Wasteland'];
function openStation(id){
  keys.clear(); pilot.classList.remove('walking');
  const heading=`<span class="eyebrow">IRON DAWN / ${id.toUpperCase()}</span><h2>${stations[id].name}</h2>`;
  const panels={
    hangar:`<img class="portrait" src="assets/frames/portraits/valhalla_full.png" alt="Valhalla mech"><p>GX-01 “VALHALLA” is standing by. Reinforce your armor before the next sortie.</p><a href="squad.html" class="primary">CONFIGURE ROBOT SQUAD →</a><div class="panel-stats"><div>ARMOR<b>${500+save.armor*50}</b></div><div>ENERGY<b>100</b></div><div>PLATING<b>MK ${save.armor+1}</b></div></div><button id="upgrade" class="primary" ${save.scrap<75?'disabled':''}>UPGRADE ARMOR · 75 SCRAP</button><p class="notice">${save.scrap<75?'Earn scrap by defeating enemies on missions.':'Adds 50 armor to your mission loadout.'}</p>`,
    command:`<p>Welcome to Iron Dawn, pilot. Our foothold is secure, but six sectors remain under hostile control. Your Valhalla frame is our spearhead.</p><div class="panel-stats"><div>OPERATION<b>01</b></div><div>SECTORS<b>06</b></div><div>DEPLOYMENTS<b>${save.missions}</b></div></div><p>Visit the mech bay to reinforce your armor. When ready, use the deployment pad to select a sector.</p><button class="primary" id="open-deploy">VIEW OPERATIONS →</button>`,
    medical:`<p>Medical systems are online. Pilot vitals are stable and your frame is cleared for deployment.</p><div class="panel-stats"><div>PILOT<b>STABLE</b></div><div>REPAIR<b>100%</b></div><div>STATUS<b>READY</b></div></div><p>Your armor and energy are restored at the start of every sortie. There is no recovery cost.</p>`,
    supply:`<p>The quartermaster has your standard weapon loadout ready. All four systems are included with Valhalla.</p><div class="mission-list"><div class="mission-choice">[U] Pulse rifle <small>8 ENERGY</small></div><div class="mission-choice">[I] Rail cannon <small>25 ENERGY</small></div><div class="mission-choice">[O] Burst salvo <small>35 ENERGY</small></div><div class="mission-choice">[P] Orbital strike <small>100% OVERDRIVE</small></div></div><p>Land melee attacks to recover energy. Save overdrive for armored targets.</p>`,
    lounge:`<p>The hum of the reactor fades beneath the sound of the coffee machine. For a moment, the war feels far away.</p><p>“Valhalla’s back in one piece. That’s a good day.”<br>— Hangar crew</p><button class="primary" id="rest">TAKE A COFFEE BREAK</button><p id="rest-message" aria-live="polite" class="notice"></p>`,
    deploy:`<p>Select your next sortie. Your frame launches with full armor and energy. Return here anytime from the mission HUD.</p><div class="mission-list">${missionNames.map((n,i)=>`<a class="mission-choice" href="${i===0?'arena.html':`combat.html?stage=${i}`}"><span>0${i+1} / ${n}</span><small>${i===5?'BOSS':'DEPLOY →'}</small></a>`).join('')}</div>`
  };
  content.innerHTML=heading+panels[id];
  if(!dialog.open)dialog.showModal();
  document.getElementById('upgrade')?.addEventListener('click',()=>{if(save.scrap>=75){save.scrap-=75;save.armor++;persist();openStation('hangar');}});
  document.getElementById('open-deploy')?.addEventListener('click',()=>openStation('deploy'));
  document.getElementById('rest')?.addEventListener('click',()=>{document.getElementById('rest-message').textContent='Coffee acquired. Take your time, pilot. The base is safe.';});
}
document.querySelectorAll('[data-station]').forEach(button=>button.addEventListener('click',()=>openStation(button.dataset.station)));
document.getElementById('close-dialog').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.getElementById('help-button').onclick=()=>{keys.clear();content.innerHTML='<span class="eyebrow">PILOT HANDBOOK</span><h2>Welcome home.</h2><p>Move with WASD or the arrow keys. Follow the village roads and press E near a station to interact.</p><p>You can also click or tap any station directly. Visit Command for your briefing, Mech Bay for armor upgrades, and Deploy to enter combat.</p><p>Press Escape to close a panel. Inside missions, Escape pauses the game.</p>';dialog.showModal();};
const pilot=document.getElementById('pilot'), hint=document.getElementById('interaction'),keys=new Set();
let pos={x:.48,y:.72},nearest=null,last=performance.now();
// Roads around the central headquarters, measured in normalized map coordinates.
const roads = [
  [.28,.46,.45,.27],[.45,.27,.74,.51],[.74,.51,.48,.73],[.48,.73,.28,.46],
  [.48,.73,.64,.87],[.64,.87,.76,.77],[.28,.46,.16,.39],[.48,.73,.31,.82]
];
function walkable(x,y){
  return roads.some(([ax,ay,bx,by])=>{
    const px=x,py=y*.563, sx=ax,sy=ay*.563,dx=bx-ax,dy=(by-ay)*.563;
    const t=Math.max(0,Math.min(1,((px-sx)*dx+(py-sy)*dy)/(dx*dx+dy*dy)));
    return Math.hypot(px-(sx+t*dx),py-(sy+t*dy))<.028;
  });
}
window.addEventListener('keydown',e=>{if(dialog.open)return;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','e'].includes(k)){e.preventDefault();keys.add(k);if(k==='e'&&nearest&&!e.repeat)openStation(nearest);}});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>keys.clear());
function frame(now){const dt=Math.min((now-last)/1000,.04);last=now;let dx=0,dy=0;if(!dialog.open){dx=Number(keys.has('d')||keys.has('arrowright'))-Number(keys.has('a')||keys.has('arrowleft'));dy=Number(keys.has('s')||keys.has('arrowdown'))-Number(keys.has('w')||keys.has('arrowup'));const norm=Math.hypot(dx,dy)||1;const nx=pos.x+dx/norm*dt*.17,ny=pos.y+dy/norm*dt*.255;if(walkable(nx,pos.y))pos.x=nx;if(walkable(pos.x,ny))pos.y=ny;}
 pilot.style.setProperty("--pilot-scale", .70 + pos.y * .30);
 pilot.style.left=`${pos.x*100}%`;pilot.style.top=`${pos.y*100}%`;pilot.classList.toggle('walking',!!(dx||dy));
 nearest=null;let min=.12;Object.entries(stations).forEach(([id,s])=>{const dist=Math.hypot(pos.x-s.x,(pos.y-s.y)*.67);if(dist<min){min=dist;nearest=id;}});
 document.querySelectorAll('[data-station]').forEach(el=>el.classList.toggle('nearby',el.dataset.station===nearest));hint.textContent=nearest?`[E] ${stations[nearest].name} · Interact`:'IRON DAWN VILLAGE · Explore your home';requestAnimationFrame(frame);}
requestAnimationFrame(frame);
