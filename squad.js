const robots=[
{id:0,name:'VALHALLA',code:'GX-01',role:'Assault',hp:500,power:1480,color:'#a9f3f1',skill:'Photon blade',description:'A balanced frontline frame. Precise blade strikes and a versatile energy rifle keep pressure on any target.'},
{id:1,name:'EMBER',code:'GX-02',role:'Artillery',hp:420,power:1860,color:'#ffa679',skill:'Inferno barrage',description:'A heavy weapons platform built for sustained fire. Shoulder launchers overwhelm armored positions.'},
{id:2,name:'WRAITH',code:'GX-03',role:'Stealth',hp:340,power:1720,color:'#c6abff',skill:'Phantom edge',description:'A light infiltration frame with twin plasma blades. Speed and precision are its strongest defenses.'},
{id:3,name:'AEGIS',code:'GX-04',role:'Guardian',hp:820,power:980,color:'#a4caff',skill:'Bastion shield',description:'A walking bulwark. Reinforced armor and a massive shield protect the squad through heavy incoming fire.'}
];
let saved={};try{saved=JSON.parse(localStorage.getItem('mecharise-squad')||'{}')||{};}catch{}
let order=Array.isArray(saved.order)&&saved.order.length===4&&new Set(saved.order).size===4&&saved.order.every(id=>robots[id])?saved.order:[0,1,2,3];
let mode=[0,1,2].includes(saved.mode)?saved.mode:0,slot=0;
const style=(id,row)=>`--art-x:${id*100/3}%;--art-y:${[0,47.1074,100][row]}%;--art-height:${[299.415,343.624,266.667][row]}%`;
const art=(id,row,extra='')=>{
 const canonical = id===0 ? `valhalla-art ${row===1?'valhalla-original':row===2?'valhalla-3d':'valhalla-2d'}` : '';
 return `<div class="art ${row===1?'pixel':''} ${canonical} ${extra}" style="${style(id,row)}" role="img" aria-label="${robots[id].name} ${['2D illustration','pixel art','3D render'][row]}"></div>`;
};
function render(){
 document.querySelectorAll('[data-mode]').forEach(el=>el.setAttribute('aria-pressed',Number(el.dataset.mode)===mode));
 document.getElementById('squad-cards').innerHTML=order.map((id,i)=>{const r=robots[id];return `<button class="squad-card ${slot===i?'selected':''}" data-slot="${i}" style="--accent:${r.color}" aria-label="Slot ${i+1}: ${r.name}${i===0?', leader':''}" aria-pressed="${slot===i}"><div class="card-top"><span>${i===0?'◆ LEADER':`SLOT 0${i+1}`}</span><span class="stars">★★★★★</span></div>${art(id,mode,'card-art')}<div class="card-info"><span class="frame-id">${r.code} / LV. 01</span><h3>${r.name}</h3><span class="role">${r.role.toUpperCase()} FRAME</span>${art(id,1,'mini-preview')}<div class="frame-stat">FIREPOWER <b>${r.power.toLocaleString()}</b></div><div class="frame-stat">ARMOR <b>${r.hp}</b></div></div><span class="slot-footer">${slot===i?'◈ SELECTED SLOT':'SELECT SLOT'}</span></button>`;}).join('');
 document.getElementById('roster').innerHTML=robots.map(r=>`<button class="roster-item ${order[slot]===r.id?'assigned':''}" data-robot="${r.id}" aria-label="Assign ${r.name} to slot ${slot+1}">${art(r.id,1)}<span>${r.name}<small>0${order.indexOf(r.id)+1}</small></span></button>`).join('');
 const r=robots[order[slot]];document.getElementById('robot-detail').innerHTML=`<span class="eyebrow">SLOT 0${slot+1} / ${r.role.toUpperCase()}</span><h3>${r.name}</h3><p>${r.description}</p><div class="ability">◈ ${r.skill.toUpperCase()}</div>`;
 document.getElementById('total-power').textContent=order.reduce((s,id)=>s+robots[id].power,0).toLocaleString();document.getElementById('total-armor').textContent=order.reduce((s,id)=>s+robots[id].hp,0).toLocaleString();
 document.querySelectorAll('[data-slot]').forEach(el=>el.onclick=()=>{slot=Number(el.dataset.slot);render();});
 document.querySelectorAll('[data-robot]').forEach(el=>el.onclick=()=>{const id=Number(el.dataset.robot),previous=order.indexOf(id);[order[slot],order[previous]]=[order[previous],order[slot]];document.getElementById('save-status').textContent=`${robots[id].name} assigned to slot ${slot+1}. Save to keep your changes.`;render();});
}
document.querySelectorAll('[data-mode]').forEach(el=>el.onclick=()=>{mode=Number(el.dataset.mode);document.getElementById('save-status').textContent='Artwork updated. Save to keep your preference.';render();});
document.getElementById('save-squad').onclick=()=>{try{localStorage.setItem('mecharise-squad',JSON.stringify({order,mode}));document.getElementById('save-status').textContent=`Squad saved · ${robots[order[0]].name} leads your formation.`;}catch{document.getElementById('save-status').textContent='Storage unavailable. Your squad is kept for this visit only.';}};
render();
