(()=>{
'use strict';
const P=FirstGuestWorld.prototype,T=THREE,clamp=v=>Math.max(0,Math.min(1,v));
const update=P.updateInteraction,oldRound=P.updateRound;
P.updateRound=function(r){if(r.kind==='pilot'){this.currentRound=r;return;}oldRound.call(this,r);};
P.initStoryWorld=function(){
 this.storyWorld=true;this.promiseLights=[];
 const board=this.group(-7,0,12);this.box(6,.2,2,'#bb9a70',board,0,.5,0);this.sign('함께 지키는 사계절',0,3.2,0,7,board);
 for(let i=0;i<4;i++){const g=this.group(-2.25+i*1.5,0,0,board);this.cylinder(.08,.12,1.5,'#8e9170',g,0,1,0);const lamp=this.ball(.45,'#b9c5aa',g,0,2,0);this.promiseLights.push(lamp);}
 this.operator=this.actor('animal2',-5,35,3.4);this.operator.group.visible=false;
 this.operatorHat=this.group(0,0,0,this.operator.group);this.cylinder(.68,.68,.13,'#e9b45b',this.operatorHat,0,3.36,0,16);this.ball(.56,'#e9b45b',this.operatorHat,0,3.47,0,1,.55,1);
 this.operatorLabel=this.sign('공공기관 · 운용',0,4.5,0,6,this.operator.group);
 this.observerLabel=this.sign('나르미 · 사용 기록',0,4.5,0,6,this.player.group);this.observerLabel.visible=false;
 this.clipboard=this.box(.8,1,.13,'#e6c58c',this.player.group,.9,1.1,.5);this.clipboard.rotation.z=-.2;this.clipboard.visible=false;
 this.responder=this.vehicle('#de8b75','현장',1.5);this.scene.add(this.responder);this.responder.visible=false;
 this.pilotProps=this.group();this.pilotProps.visible=false;
 this.testSignal=this.group(0,0,35,this.pilotProps);this.smoke=[];
 for(let i=0;i<5;i++)this.smoke.push(this.ball(.5+i*.1,'#bbc4bc',this.testSignal,Math.sin(i)*.5,1+i*.6,0,1,1.2,1));
 this.pilotWater=this.box(5,.12,6,'#6eafbd',this.pilotProps,0,.4,31);
 this.beacon=this.ball(.48,'#f6d06c',this.pilotProps,0,4,35);
 this.signalRing=this.mesh(new T.TorusGeometry(1,.07,8,48),'#f1d17b',this.pilotProps,3,2.5,33);this.signalRing.rotation.x=Math.PI/2;
 this.spray=[];for(let i=0;i<12;i++)this.spray.push(this.ball(.1,'#b8e9e2',this.pilotProps,0,0,0));
};
P.updateInteraction=function(dt,options){
 this.storyHiddenSigns?.forEach(o=>o.visible=o.userData.beforeStory);this.storyHiddenSigns=[];
 update.call(this,dt,options);if(!this.storyWorld)this.initStoryWorld();
 if(['prologue','need','feedback','npcChat'].includes(options.modal)){this.scene.traverse(o=>{if(o.userData.sign){o.userData.beforeStory=o.visible;this.storyHiddenSigns.push(o);o.visible=false;}});}
 const history=options.history||[];this.promiseLights.forEach((lamp,i)=>{const h=history.find(h=>h.season===i);lamp.material=this.mat(h?.success?'#f8d581':h?'#b2ccb0':'#b9c5aa',{emissive:h?.success?'#8d6824':'#000000',emissiveIntensity:.2});});
 const r=this.currentRound,active=this.mode==='field'&&r?.kind==='pilot';
 this.operator.group.visible=active;this.observerLabel.visible=active;this.clipboard.visible=active;this.responder.visible=false;this.pilotProps.visible=active;if(this.pilotDevice)this.pilotDevice.visible=active;
 if(options.modal==='prologue'){
  const step=options.prologueStep||0,a=step===0?this.roamers[1]:step===1?this.presenters[0]:this.dari;
  this.player.group.position.set(0,.04,7);this.dari.group.position.set(-1.6,.04,8);a.group.position.set(3,.04,6);
  a.rig.update(dt,this.t,{pose:'talk',facing:-.5});this.player.rig.update(dt,this.t,{pose:'listen',facing:2});
  const span=this.aspect<.8?7.7/this.aspect:8;this.focus.lerp(new T.Vector3(1,1.5,7),1-Math.exp(-dt*4));this.camera.left=-span*this.aspect;this.camera.right=span*this.aspect;this.camera.top=span;this.camera.bottom=-span;this.camera.updateProjectionMatrix();this.camera.position.copy(this.focus).add(new T.Vector3(8,6,16));this.camera.lookAt(this.focus);
 }
 if(!active)return;
 const c=FirstGuestPilot.current(r),clock=r.clock,responded=clock>=c.operatorAt,detect=c.notifyAt!==null&&clock>=c.notifyAt,progress=clamp((clock-c.operatorAt)/2.4),fake=c.fake,season=r.season;
 const deviceKey=r.product.id+'-'+season;if(deviceKey!==this.pilotDeviceKey){if(this.pilotDevice)this.scene.remove(this.pilotDevice);this.pilotDevice=this.device(r.product.ability,3,32);this.sign('시험 장비',0,4.8,0,3.5,this.pilotDevice);this.pilotDeviceKey=deviceKey;}this.pilotDevice.visible=r.product.ability!=='움직이는 눈';
 this.van.visible=false;this.drone.visible=r.product.ability==='움직이는 눈';
 if(this.drone.visible){this.drone.position.set(Math.sin(clock*.7)*4,5+Math.sin(clock*2)*.3,34+Math.cos(clock*.7)*3);this.drone.rotation.z=c.issue==='wind'&&clock>2?Math.sin(clock*12)*.22:0;}
 this.setActor(this.operator,'animal'+[2,3,6,5][season]);this.operator.group.position.set(-6+progress*2,.04,37);this.operator.rig.update(dt,this.t,{pose:responded?'point':detect?'surprise':'listen',facing:1});
 this.operatorHat.visible=season<2;
 this.player.group.position.set(7,.04,35.5);this.dari.group.position.set(5.8,.04,37);this.player.rig.update(dt,this.t,{pose:r.phase==='recorded'?'thanks':r.phase==='record'?'think':'listen',facing:-1});this.dari.rig.update(dt,this.t,{pose:r.phase==='recorded'?'clap':'listen',facing:-1});
 this.testSignal.visible=season===0&&clock>0;this.pilotWater.visible=season===1&&clock>0;this.beacon.visible=season===3&&clock>0;
 const tx=season===3?this.houses[2].position.x:0,tz=season===3?36+this.houses[2].position.z:35;
 this.testSignal.position.set(fake?10:0,0,fake?43:35);this.testSignal.scale.setScalar(!fake&&responded?Math.max(.03,1-progress):1);
 this.smoke.forEach((m,i)=>{m.position.y=1+i*.6+Math.sin(clock*1.5+i)*.18;m.position.x=Math.sin(clock+i)*.45;m.material=this.mat(fake?'#e9ddc7':'#a1b1ab');});
 this.pilotWater.scale.y=fake?1:1+Math.min(1,clock/4)*3;this.pilotWater.scale.z=fake?.25:1;
 this.beacon.position.set(tx,5.1+Math.sin(clock*4)*.15,tz);this.beacon.material=this.mat(fake?'#b9d9cf':responded?'#a4d4a0':'#f6ce6e');
 this.signalRing.visible=detect&&!responded;this.signalRing.scale.setScalar(1+(clock%1)*3);
 this.fieldCars.forEach((car,i)=>{if(season!==1&&season!==2)return;const chosen=i===1,stopped=chosen&&responded&&!fake;car.position.z=stopped?5:8-Math.min(clock,4)*.65;if(season===1&&chosen&&stopped&&progress>.3){car.position.x=progress*4;car.rotation.y=-progress*Math.PI/2;}else{car.position.x=(i-1)*12;car.rotation.y=0;}});
 this.barriers.forEach((b,i)=>{if(season===1)b.rotation.z=i===1&&responded&&!fake?(1-progress)*Math.PI/2:Math.PI/2;});
 this.fieldChildren.forEach((kid,i)=>{const crossing=i===1&&responded&&!fake;kid.group.position.x=(i-1)*12+(crossing?-3+progress*6:-3.2);kid.rig.update(dt,this.t,{pose:crossing?'walk':'listen',walk:crossing&&progress<1?1:0,facing:Math.PI/2});const l=this.signals[i];if(l){l.red.material=this.mat(crossing?'#6f8271':'#dc8466');l.green.material=this.mat(crossing?'#8ed49b':'#4c7162');}});
 if((season===0||season===3)&&responded&&!fake){this.responder.visible=true;this.responder.position.set(-13+(tx+11)*progress,.2,42+(tz+(season===3?3:0)-42)*progress);this.responder.rotation.y=Math.atan2(tx+11,tz-42);}
 this.spray.forEach((drop,i)=>{drop.visible=season===0&&!fake&&progress>.65;if(drop.visible){const f=(clock*1.5+i/12)%1;drop.position.set(-2+f*2,1.5+Math.sin(f*Math.PI)*1.2,35);}});
 const span=this.aspect<.8?12.3/this.aspect:13.4,target=new T.Vector3(0,-1.5,35);this.focus.lerp(target,1-Math.exp(-dt*5));this.camera.left=-span*this.aspect;this.camera.right=span*this.aspect;this.camera.top=span;this.camera.bottom=-span;this.camera.updateProjectionMatrix();this.camera.position.copy(this.focus).add(new T.Vector3(7,23,28));this.camera.lookAt(this.focus);
};
})();
