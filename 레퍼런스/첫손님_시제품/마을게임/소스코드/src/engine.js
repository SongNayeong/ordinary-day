/* First Guest: deterministic, frame-independent mission rules. No browser dependency. */
(function(scope){
 'use strict';
 const LENGTH=30;
 const LOCATIONS=[
  [[17,23],[43,18],[75,25],[27,52],[60,48],[83,66],[46,78],[15,78]],
  [[18,50],[50,50],[82,50]],
  [[18,50],[50,50],[82,50]],
  [[20,25],[50,22],[80,27],[20,70],[50,72],[80,68]]
 ];
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 function random(r){let a=r.seed+=0x6D2B79F5;a=Math.imul(a^(a>>>15),a|1);a^=a+Math.imul(a^(a>>>7),a|61);return ((a^(a>>>14))>>>0)/4294967296;}
 function create({season,product,scale='small',seed=12345}){
  return {version:1,season,product:{...product},scale,seed:seed>>>0,time:LENGTH,elapsed:0,next:.7,seq:0,events:[],effects:[],hits:0,total:0,missed:0,falseAlarms:0,early:0,close:0,auto:0,combo:0,maxCombo:0,score:0,wind:1,weather:1,drone:{x:50,y:50},van:{x:50,y:94,target:null},done:false};
 }
 function progress(e){return clamp((e.age-e.warning)/e.duration,0,1);}
 function effect(r,e,kind,text){r.effects.push({id:'fx-'+r.seq+'-'+Math.round(r.elapsed*1000)+'-'+r.effects.length,x:e.x,y:e.y,slot:e.slot,kind,text,life:1.1});}
 function resolve(r,e,mode='tap'){
  if(e.resolved||e.age<e.warning)return false;
  e.resolved=true;
  if(e.fake){r.falseAlarms++;r.combo=0;r.score=Math.max(0,r.score-40);effect(r,e,'false',['군고구마였어요!','분수대예요!','비둘기예요!','주무시는 중!'][r.season]);}
  else{
   r.hits++;r.combo++;r.maxCombo=Math.max(r.maxCombo,r.combo);
   const close=progress(e)>.8;r.close+=close?1:0;r.auto+=mode==='auto'?1:0;
   r.score+=100+Math.min(8,r.combo)*10+(close?40:0);
   effect(r,e,'hit',mode==='auto'?'기술이 도왔어요!':close?'아슬아슬! +40':r.season===3?'안부 확인!':'지켰어요!');
  }
  return true;
 }
 function spawn(r){
  const points=LOCATIONS[r.season],used=new Set(r.events.filter(e=>!e.resolved).map(e=>e.slot));
  const available=points.map((p,i)=>i).filter(i=>!used.has(i));if(!available.length)return;
  const slot=available[Math.floor(random(r)*available.length)],pos=points[slot],p=r.product;
  const fake=(r.seq%5===3)||!!(p.fraud&&random(r)<.18);
  let duration=3.4+p.stars*.22+(p.old&&pos[0]<61?.8:0)+(r.scale==='large'?.65:0);
  if(r.season===1)duration-=r.weather===2?.45:0;
  if(r.season===2)duration+=.45;
  if(r.season===3)duration+=1.8;
  const warning=p.ability==='미리 보기'&&!p.fraud?.5+p.stars*.17:0;
  if(r.time<warning+1.7)return;
  duration=Math.min(duration,LENGTH-r.elapsed-warning-.05);
  const e={id:++r.seq,slot,x:pos[0],y:pos[1],fake,age:0,warning,duration,resolved:false,earlyUntil:0};
  r.events.push(e);if(!fake)r.total++;
 }
 function action(r,id){
  if(r.done)return {kind:'ignored'};
  const e=r.events.find(e=>e.id===Number(id)&&!e.resolved);if(!e)return {kind:'ignored'};
  if(e.age<e.warning)return {kind:'warning',text:'곧 위험이 생겨요. 잠깐 기다려요!'};
  if(r.season===2&&!e.fake&&progress(e)<.23){
   if(r.elapsed>=e.earlyUntil){e.earlyUntil=r.elapsed+.7;r.early++;r.score=Math.max(0,r.score-10);effect(r,e,'early','아직 멀어요! 조금만 기다려요');}
   return {kind:'early'};
  }
  if(r.season===3){r.van.target=e.id;return {kind:'dispatch',text:'방문 차량이 출발해요!'};}
  resolve(r,e);return {kind:e.fake?'false':'hit'};
 }
 function moveDrone(r,x,y){r.drone.x=clamp(x,3,97);r.drone.y=clamp(y,5,95);}
 function moveVan(r,x,y){if(r.done)return;r.van.x=clamp(x,3,97);r.van.y=clamp(y,5,95);r.van.target=null;r.van.manual=.25;}
 function update(r,seconds){
  if(r.done||!Number.isFinite(seconds)||seconds<=0)return r;
  let left=Math.min(seconds,1);
  while(left>0&&!r.done){const dt=Math.min(.04,left);step(r,dt);left-=dt;}
  return r;
 }
 function step(r,dt){
  r.elapsed=Math.min(LENGTH,r.elapsed+dt);r.time=Math.max(0,LENGTH-r.elapsed);r.wind=Math.floor(r.elapsed/8)%2? -1:1;r.weather=r.elapsed>=12&&r.elapsed<22?2:1;
  r.effects=r.effects.map(f=>({...f,life:f.life-dt})).filter(f=>f.life>0);
  r.van.manual=Math.max(0,(r.van.manual||0)-dt);
  r.next-=dt;if(r.next<=0&&r.time>1.7){spawn(r);r.next=r.season===3?(r.time<6?1.4:2.35):r.time<6?.72:1.65;}
  for(const e of r.events){
   if(e.resolved)continue;e.age+=dt;
   if(r.season===0)e.x=clamp(LOCATIONS[0][e.slot][0]+r.wind*progress(e)*5,8,92);
   if(e.age<e.warning)continue;
   const p=r.product,age=e.age-e.warning;
   if(!e.fake&&!p.fraud&&p.ability==='자동 처리'&&e.id%(p.stars>=4?3:4)===0&&age>1.35){resolve(r,e,'auto');continue;}
   if(!e.fake&&p.ability==='움직이는 눈'&&Math.hypot(e.x-r.drone.x,e.y-r.drone.y)<15+p.stars*2&&age>.8){resolve(r,e,'auto');continue;}
   if(r.season===3&&(r.van.target===e.id||r.van.manual>0)&&Math.hypot(e.x-r.van.x,e.y-r.van.y)<9){resolve(r,e);continue;}
   if(progress(e)>=1){e.resolved=true;if(!e.fake){r.missed++;r.combo=0;effect(r,e,'miss',['불이 번졌어요','진입을 놓쳤어요','아이가 멈칫했어요','안부를 놓쳤어요'][r.season]);}}
  }
  if(r.season===3&&r.van.target!==null){
   const e=r.events.find(e=>e.id===r.van.target&&!e.resolved);
   if(e){const dx=e.x-r.van.x,dy=e.y-r.van.y,d=Math.hypot(dx,dy),speed=r.product.old?42:54;const k=Math.min(1,speed*dt/Math.max(.01,d));r.van.x+=dx*k;r.van.y+=dy*k;}else r.van.target=null;
  }
  r.events=r.events.filter(e=>!e.resolved);
  if(r.time<=0){for(const e of r.events)if(!e.fake)r.missed++;r.events=[];r.done=true;}
 }
 function summary(r){
  const ratio=r.hits/Math.max(1,r.total),effective=Math.max(0,(r.hits-r.falseAlarms*.5-r.early*.12)/Math.max(1,r.total));
  const success=effective>=.6,stars=effective>=.85?3:effective>=.6?2:effective>0?1:0;
  let safetyDelta=Math.round((effective-.53)*26);if(!success&&r.scale==='large')safetyDelta-=5;
  return {hits:r.hits,total:r.total,missed:r.missed,falseAlarms:r.falseAlarms,early:r.early,close:r.close,maxCombo:r.maxCombo,auto:r.auto,score:r.score,ratio,effective,stars,success,safetyDelta,growth:success&&!r.product.old&&!r.product.fraud?(r.scale==='large'?2:1):0,weakness:r.falseAlarms?'false':r.season===1?'rain':r.season===3?'night':'speed'};
 }
 function validRound(r){return !!r&&r.version===1&&Number.isInteger(r.season)&&r.season>=0&&r.season<4&&Number.isFinite(r.elapsed)&&r.elapsed>=0&&r.elapsed<=30&&Array.isArray(r.events)&&r.product&&Number.isFinite(r.product.stars);}
 const api={create,update,action,moveDrone,moveVan,summary,progress,validRound,LOCATIONS,LENGTH};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else scope.FirstGuestEngine=api;
})(globalThis);
