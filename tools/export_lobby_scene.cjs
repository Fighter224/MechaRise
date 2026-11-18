// Export the actual web scene and verify its navigation before packaging for Unity.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const elements = new Map();
const ctx = new Proxy({}, {get:(obj,key)=>obj[key] || (()=>{}),set:(o,k,v)=>(o[k]=v,true)});
function element(){return {style:{},classList:{toggle(){}},append(){},setAttribute(){},addEventListener(){},getContext:()=>ctx};}
const sandbox = {
 document:{getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},createElement:element,querySelectorAll:()=>[]},
 window:{addEventListener(){}},innerWidth:1280,innerHeight:720,devicePixelRatio:1,
 performance:{now:()=>0},requestAnimationFrame(){},localStorage:{getItem:()=>null,setItem(){}},
 fetch:()=>new Promise(()=>{}),Image:class{},dialog:{open:false},content:{},openStation(){},assert
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('lobby-map.js','utf8')+'\n'+fs.readFileSync('lobby-world.js','utf8'),sandbox);
vm.runInContext(`
 assert(!blocked(BASE_MAP.spawn.x,BASE_MAP.spawn.y));
 for(const b of buildings){assert(blocked(b.x,b.y));assert(findPath(BASE_MAP.spawn,{x:Math.round(b.x+2),y:Math.round(b.y+2)}).length>0,b.id+' entrance unreachable');}
 for(const g of gates){const route=findPath(BASE_MAP.spawn,g);assert(route.length>0,g.id+' unreachable');for(const p of route)assert(!blocked(p.x,p.y));}
 const p=iso(12.3,15.7),back=uniso(p.x,p.y);assert(Math.abs(back.x-12.3)<1e-6);assert(Math.abs(back.y-15.7)<1e-6);
 const before=iso(pilot.x,pilot.y);keys.add('d');update(.2);keys.clear();assert(iso(pilot.x,pilot.y).x>before.x);
 const px=pilot.x;dialog.open=true;keys.add('d');update(.2);assert.equal(pilot.x,px);dialog.open=false;keys.clear();
 setTime('night');for(let i=0;i<90;i++)update(1/30);assert(world.mix.lamps>.99);
 setTime('sun');for(let i=0;i<90;i++)update(1/30);assert(world.mix.lamps<.09);
`,sandbox);
const scene=JSON.parse(vm.runInContext(`JSON.stringify({coordinateSystem:'isometric world pixels; ground Y sorts depth',tileSize:[96,48],origin:[1400,90],buildings,gates,props,lights,pilot:{spawn:BASE_MAP.spawn,drawWidth:90,directions:['down','left','right','up'],framesPerDirection:4}})`,sandbox));
const manifest=JSON.parse(fs.readFileSync('assets/lobby/modular/asset-manifest.json','utf8'));
const assets=Object.fromEntries(manifest.assets.map(a=>[a.id,a]));
for(const l of scene.lights){if(l.asset){const [w,h]=assets[l.asset].size;l.y=l.ground.y-l.width*h/w*(l.asset==='lamp-amber'?.78:.68);}}
const root='assets/lobby/modular/';
fs.writeFileSync(root+'scene-manifest.json',JSON.stringify(scene,null,2)+'\n');
fs.writeFileSync(root+'base-map.json',vm.runInContext('JSON.stringify(BASE_MAP,null,2)',sandbox)+'\n');
console.log(`PASS: six entrances and both gates reachable, safe paths, collision, projection, movement, modal freeze, lighting. Exported ${scene.props.length} props and ${scene.lights.length} lights.`);
