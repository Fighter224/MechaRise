const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const paths=[],calls=[];const manifest=JSON.parse(fs.readFileSync('assets/ark-between-worlds/manifest.json','utf8'));
const dimensions=new Map([...manifest.sprites,...manifest.floorAssets,...manifest.detailAssets].map(a=>['assets/ark-between-worlds/'+a.file,a.size]));
class Image{set src(path){this.path=path;paths.push(path);[this.naturalWidth,this.naturalHeight]=dimensions.get(path)||(path.includes('atlas')?[1536,1024]:[1184,1376]);queueMicrotask(()=>this.onload?.());}}
const sandbox={Image,queueMicrotask};sandbox.window=sandbox;vm.createContext(sandbox);vm.runInContext(fs.readFileSync('ark-scene.js','utf8'),sandbox);
const gradient={addColorStop(){}};const context=new Proxy({createLinearGradient:()=>gradient,createRadialGradient:()=>gradient,drawImage:(img,...args)=>calls.push({path:img.path,args})},{get:(o,k)=>o[k]??(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
(async()=>{
 await sandbox.ArkScene.load();assert(sandbox.ArkScene.ready);assert(!paths.some(p=>p.includes('ark-prologue-background')));
 for(const p of paths)assert(fs.existsSync(p),p);
 let pilotDrawn=false;sandbox.ArkScene.draw(context,{time:.5,chapter:{completed:true,menderRescued:true,warmLamp:true},pilotY:720,pilotDraw:()=>pilotDrawn=true});
 assert(pilotDrawn);assert.equal(calls.filter(c=>c.path.endsWith('/rescue-bay.png')&&c.args.length===8).length,9);for(const a of manifest.detailAssets)assert(calls.some(c=>c.path.endsWith(a.file)),a.id);assert.equal(calls.filter(c=>c.path.endsWith('/rescue-bay.png')&&c.args.length===4).length,3);
 for(const id of ['core-walkway','gate-walkway','rescue-walkway','arrival-platform-hd','system-core','broken-gateway'])assert(calls.some(c=>c.path.endsWith('/'+id+'.png')),id);
 const mender=calls.find(c=>c.path.endsWith('/mender.png')),valhalla=calls.find(c=>c.path.endsWith('/idle-combat-atlas.png'));
 assert.equal(mender.args.at(-1),135);assert.equal(valhalla.args.at(-1),250);assert.equal(valhalla.args.at(-2),250);
 console.log('PASS: independent scene asset loading/rendering, no full-scene backdrop, three bay instances, pilot depth callback, 135px Mender and 250px Valhalla.');
})().catch(e=>{console.error(e);process.exitCode=1});
