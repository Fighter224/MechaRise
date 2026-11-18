let save = {scrap:0,armor:0,missions:0};
try { Object.assign(save,JSON.parse(localStorage.getItem('mecharise-save') || '{}')); } catch {}
function persist(){try{localStorage.setItem('mecharise-save',JSON.stringify(save));}catch{} document.getElementById('scrap').textContent=save.scrap;}
persist();
const dialog=document.getElementById('station-dialog'), content=document.getElementById('dialog-content');
const missionNames=['Industrial Hangar','Mech Chamber','Damaged Corridor','Reactor Chasm','Sunset City Ruins','Eclipse Wasteland'];
function openStation(id){
  keys.clear(); if (typeof stopWalking === 'function') stopWalking();
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
document.getElementById('close-dialog').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.getElementById('help-button').onclick=()=>{keys.clear();content.innerHTML='<span class="eyebrow">PILOT HANDBOOK</span><h2>Welcome home.</h2><p>Move with WASD or the arrow keys. Explore the base with the follow camera and press E near a station. You can also click a destination to walk there.</p><p>You can also click or tap any station directly. Visit Command for your briefing, Mech Bay for armor upgrades, and Deploy to enter combat.</p><p>Use the sun, sunset, and moon controls to change lighting. Scroll to zoom; drag to look around; press C to center on your pilot. Sector gates open the operation list. Press Escape to close a panel.</p>';dialog.showModal();};
