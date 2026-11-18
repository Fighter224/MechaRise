const fs=require('node:fs'),vm=require('node:vm');
const sandbox={};sandbox.window=sandbox;vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('ark-scene.js','utf8'),sandbox);
fs.writeFileSync('assets/ark-between-worlds/scene-layout.json',JSON.stringify(sandbox.ArkScene.layout,null,2)+'\n');
console.log('Exported Ark structure, floor, stair, fixture, equipment and railing layout.');
