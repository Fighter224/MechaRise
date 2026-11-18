// Coordinates and footprints are in tile space; lights are independent scene objects.
const BASE_MAP={columns:30,rows:26,tileWidth:96,tileHeight:48,
 outline:[[2,7],[6,3],[15,2],[24,4],[28,10],[27,18],[22,24],[13,25],[5,21],[2,15]],
 paths:[[[5,11],[10,11],[13,14],[17,15],[21,17],[24,18]],[[10,11],[12,9]],[[17,15],[18,13]],[[18,13],[23,10],[24,10]],[[21,17],[24,16]],[[13,14],[11,18]],[[17,15],[19,20],[20,22]]],
 buildings:[
  {id:'hangar',name:'Mech Bay',x:10,y:7,width:340,footprint:[3.8,3.5],windows:[[-.26,-.32],[.30,-.42]]},
  {id:'command',name:'Command',x:16,y:11,width:310,footprint:[3.4,3.4],windows:[[-.16,-.25],[.16,-.25],[.27,-.48]],cyan:true},
  {id:'medical',name:'Med Bay',x:22,y:7,width:265,footprint:[3.3,3.2],windows:[[-.25,-.24],[.28,-.30]]},
  {id:'supply',name:'Supply Depot',x:23,y:14,width:275,footprint:[3.5,3.4],windows:[[-.31,-.39],[.22,-.40]]},
  {id:'lounge',name:'Crew Quarters',x:9,y:17,width:285,footprint:[3.5,3.4],windows:[[-.25,-.20],[.11,-.30],[.28,-.44]]},
  {id:'deploy',name:'Deploy',x:18,y:20,width:285,footprint:[3.5,3.3],windows:[[0,-.40]],cyan:true}
 ],
 gates:[{id:'west-gate',name:'Sector 01–03',x:5,y:11,width:155,stages:[0,1,2]},{id:'east-gate',name:'Sector 04–06',x:22,y:18,width:155,stages:[3,4,5]}],
 spawn:{x:17,y:15},
 lighting:{
  sun:{tint:[255,232,180],opacity:0.04,lamps:.08,sky:['#79b4b8','#345c70'],shadow:.20},
  evening:{tint:[114,48,94],opacity:.30,lamps:.72,sky:['#b27478','#303652'],shadow:.32},
  night:{tint:[8,17,55],opacity:.62,lamps:1,sky:['#111a35','#050c1d'],shadow:.48}
 }
};
const stations=Object.fromEntries(BASE_MAP.buildings.map(b=>[b.id,{name:b.name}]));
