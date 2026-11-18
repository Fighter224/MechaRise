(function(root){
 'use strict';
 const playtest=new URLSearchParams(root.location?.search||'').get('playtest')==='1';
 const KEY=playtest?'mecharise-playtest-chapter0-v1':'mecharise-chapter0-v1',CAREER=playtest?'mecharise-playtest-career-v1':'mecharise-save',stages=['space','awakening','signal','corridor','link','reactor','mender','escort','return','complete'];
 const fresh=()=>({version:1,checkpoint:'space',completed:false,menderRescued:false,valhallaLinked:false,warmLamp:false,access:[],rewardsGranted:false,flags:{},stats:{interceptors:0},updatedAt:0});
 let memory=fresh(),warning=false,loaded=false;
 function load(){if(loaded)return structuredClone(memory);loaded=true;try{const raw=JSON.parse(root.localStorage.getItem(KEY)||'null');if(raw&&raw.version===1&&stages.includes(raw.checkpoint)){memory={...fresh(),...raw,flags:{...raw.flags},stats:{...fresh().stats,...raw.stats}};}}catch{warning=true;}return structuredClone(memory);}
 function save(patch={}){const next={...load(),...patch,flags:{...memory.flags,...patch.flags},stats:{...memory.stats,...patch.stats},updatedAt:Date.now()};if(!stages.includes(next.checkpoint))throw new Error('Invalid chapter checkpoint');memory=next;try{root.localStorage.setItem(KEY,JSON.stringify(next));warning=false;}catch{warning=true;}return structuredClone(memory);}
 function reset(){memory=fresh();loaded=true;try{root.localStorage.removeItem(KEY);}catch{warning=true;}return structuredClone(memory);}
 function grantRewards(){
  let career={scrap:0,armor:0,missions:0};
  try{const stored=JSON.parse(root.localStorage.getItem(CAREER)||'null');if(stored&&typeof stored==='object')career={...career,...stored};}catch{}
  if(!career.chapter0Reward){career.scrap=(Number.isFinite(career.scrap)?career.scrap:0)+150;career.chapter0Reward=true;try{root.localStorage.setItem(CAREER,JSON.stringify(career));}catch{warning=true;return false;}}
  save({rewardsGranted:true,access:['valhalla','mender']});return true;
 }
 function url(path){return playtest?path+(path.includes('?')?'&':'?')+'playtest=1':path;}
 root.Chapter0={KEY,playtest,url,stages,load,save,reset,grantRewards,storageWarning:()=>warning};
})(typeof window!=='undefined'?window:globalThis);
