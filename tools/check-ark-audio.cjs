const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const sources=[];let fetchCount=0;
class AudioContext{
 constructor(){this.currentTime=0;this.state='suspended';this.destination={};}
 createGain(){return {gain:{value:0,setTargetAtTime(v){this.value=v}},connect(){},disconnect(){}};}
 createBufferSource(){const s={connect(){},disconnect(){},start(){this.started=true}};sources.push(s);return s;}
 async decodeAudioData(a){assert(a.byteLength>44);return {decoded:true};}
 async resume(){this.state='running'}async suspend(){this.state='suspended'}async close(){this.state='closed'}
}
const s={AudioContext,document:{hidden:false},ArkScene:{surface:()=>({material:'steps'})},fetch:async path=>{fetchCount++;return {ok:true,arrayBuffer:async()=>Uint8Array.from(fs.readFileSync(path)).buffer}}};s.window=s;vm.createContext(s);vm.runInContext(fs.readFileSync('ark-audio.js','utf8'),s);
(async()=>{
 assert.equal(fetchCount,0,'sound must wait for user input');assert.equal(await s.ArkAudio.toggle(),true);assert.equal(fetchCount,8);assert.equal(sources.filter(a=>a.loop).length,3);
 s.ArkAudio.update({x:836,y:290,moving:true},1/60,1);assert.equal(sources.length,4);s.ArkAudio.update({x:836,y:290,moving:true},1/60,1.1);assert.equal(sources.length,4,'footsteps throttled');
 s.ArkAudio.suspend();s.ArkAudio.play('blocked');assert.equal(sources.length,4,'blur suspends cues');s.ArkAudio.resume();
 assert.equal(await s.ArkAudio.toggle(),false);s.ArkAudio.play('link-chime');assert.equal(sources.length,4,'muted cues silent');
 assert.equal(await s.ArkAudio.toggle(),true);assert.equal(fetchCount,8,'reuse decoded audio');s.ArkAudio.play('link-chime');assert.equal(sources.length,5);
 const unsupported={};unsupported.window=unsupported;vm.createContext(unsupported);vm.runInContext(fs.readFileSync('ark-audio.js','utf8'),unsupported);assert.equal(await unsupported.ArkAudio.toggle(),false);
 console.log('PASS: opt-in audio loading, valid WAVs, ambient loops, footstep cadence, blur suspension, mute/resume, buffer reuse and unsupported-browser fallback.');
})().catch(e=>{console.error(e);process.exitCode=1});
