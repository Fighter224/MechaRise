const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const elements=new Map();function el(){return {style:{},classList:{toggle(){}},setAttribute(){},append(){},addEventListener(){},getContext:()=>({setTransform(){}}),showModal(){this.open=true},close(){this.open=false}};}
const sandbox={document:{getElementById(id){if(!elements.has(id))elements.set(id,el());return elements.get(id)},createElement:el,querySelectorAll:()=>[]},window:{addEventListener(){}},innerWidth:1280,innerHeight:720,devicePixelRatio:1,Image:class{},performance:{now:()=>0},requestAnimationFrame(){},assert,console};
sandbox.window=sandbox;sandbox.addEventListener=()=>{};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('ark-scene.js','utf8'),sandbox);vm.runInContext(fs.readFileSync('ark-lobby.js','utf8')+`
assert(walkable(pilot.x,pilot.y));assert(!walkable(20,20));
for(const target of [{x:836,y:300},sites[1],sites[2],sites[3],sites[4]]){const path=routeTo(target.x,target.y);assert(path.length>0,JSON.stringify(target));for(const p of path)assert(walkable(p.x,p.y));}
// Follow each route at real movement ticks, including reverse stair descents.
for(const target of [...sites,{x:800,y:1000},{x:830,y:720}]){ark.path=routeTo(target.x,target.y);assert(ark.path.length>0,JSON.stringify(target));const goal={...ark.path.at(-1)};for(let i=0;i<6000&&ark.path.length;i++)update(1/60);assert.equal(ark.path.length,0,JSON.stringify({target,pilot,next:ark.path[0]}));assert(Math.hypot(pilot.x-goal.x,pilot.y-goal.y)<6);}
for(const r of ArkScene.layout.stairs){assert(ArkScene.canTraverse(r.x,r.bottom,r.x,r.top),r.id);assert(ArkScene.canTraverse(r.x,r.top,r.x,r.bottom),r.id);const mid=(r.top+r.bottom)/2;assert(!ArkScene.canTraverse(r.x,mid,r.x+r.width/2+15,mid),'side of '+r.id);assert(ArkScene.surface(r.x,r.top).height>ArkScene.surface(r.x,r.bottom).height);}
assert(!ArkScene.canTraverse(1120,730,1220,730),'arrival side wall');
for(const prop of ArkScene.layout.props)assert(!walkable(prop.x,prop.y),'equipment collision');
assert.equal(requestMove(20,20),false);assert(ark.feedback&&!ark.feedback.valid);update(.01);assert(hint.textContent.includes('NO ROUTE'));
assert.equal(requestMove(800,1000),true);assert(ark.feedback.valid);stop();
const p=project(500,400),q=unproject(p.x,p.y);assert(Math.abs(q.x-500)<1e-6&&Math.abs(q.y-400)<1e-6);
const x=pilot.x;keys.add('d');update(.1);keys.clear();assert(pilot.x>x);assert.equal(pilot.direction,'right');
openSite(sites[2]);assert(dialog.open);assert(content.innerHTML.includes('This bay is empty'));const px=pilot.x;keys.add('d');update(.1);assert.equal(pilot.x,px);keys.clear();dialog.close();
openSite(sites[1]);assert(content.innerHTML.includes('chapter.html'));assert(content.innerHTML.includes('NO ANCHOR'));
console.log('PASS: all station routes walked in real ticks; six stair ascents/descents; stair side and arrival wall collision; projection, controls, modal freeze and battle links.');`,sandbox);
