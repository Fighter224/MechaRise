(function(root){
'use strict';
let context=null,master=null,enabled=false,loading=null,lastStep=-1;
const buffers=new Map(),loops=new Map(),names=['void-air','core-hum','dock-machinery','step-metal','step-stone','step-stairs','link-chime','blocked'];
async function init(){
 if(loading)return loading;
 const AudioContext=root.AudioContext||root.webkitAudioContext;if(!AudioContext)return false;
 context=new AudioContext();context.resume().catch(()=>{});master=context.createGain();master.gain.value=0;master.connect(context.destination);
 loading=Promise.all(names.map(async name=>{const response=await fetch(`assets/ark-between-worlds/audio/${name}.wav`);if(!response.ok)throw Error('Audio unavailable');buffers.set(name,await context.decodeAudioData(await response.arrayBuffer()));})).then(()=>{
  for(const name of names.slice(0,3)){const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffers.get(name);source.loop=true;gain.gain.value=0;source.connect(gain);gain.connect(master);source.start();loops.set(name,gain);}return true;
 }).catch(()=>{loading=null;context?.close();context=null;return false;});
 return loading;
}
async function toggle(){
 if(!await init())return false;
 enabled=!enabled;if(enabled)await context.resume();master.gain.setTargetAtTime(enabled?.42:0,context.currentTime,.12);return enabled;
}
function play(name,gain=.7){if(!enabled||!buffers.has(name)||context?.state!=='running')return;const source=context.createBufferSource(),level=context.createGain();source.buffer=buffers.get(name);level.gain.value=gain;source.connect(level);level.connect(master);source.start();source.onended=()=>{source.disconnect();level.disconnect();};}
function update(pilot,dt,time){
 if(!context||!enabled)return;
 const ramp=(id,value)=>loops.get(id)?.gain.setTargetAtTime(value,context.currentTime,.4);
 ramp('void-air',document.hidden?0:.4);
 ramp('core-hum',document.hidden?0:Math.max(0,1-Math.hypot(pilot.x-836,pilot.y-290)/620)*.42);
 ramp('dock-machinery',document.hidden?0:Math.max(0,1-Math.hypot(pilot.x-1510,pilot.y-530)/650)*.3);
 if(pilot.moving&&time-lastStep>.32){const material=root.ArkScene.surface(pilot.x,pilot.y).material;play(material==='steps'?'step-stairs':material==='metal'?'step-metal':'step-stone',.35);lastStep=time;}
}
function suspend(){if(context?.state==='running')context.suspend();}
function resume(){if(enabled&&context?.state==='suspended')context.resume();}
root.ArkAudio={toggle,play,update,suspend,resume,get enabled(){return enabled;}};
})(typeof window!=='undefined'?window:globalThis);
