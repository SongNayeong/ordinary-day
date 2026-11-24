(function(scope){
'use strict';
const T=THREE,TAU=Math.PI*2;
const palettes=[
 {fur:'#a87a55',muzzle:'#f4dfba',coat:'#3f9c8a',ears:'round',mask:true},
 {fur:'#b87d4e',muzzle:'#f5dcad',coat:'#ce7c48',ears:'small',spines:true},
 {fur:'#b57a47',muzzle:'#efd4a7',coat:'#b5a16c',ears:'round'},
 {fur:'#a77d55',muzzle:'#efdcb9',coat:'#54a7a1',ears:'small'},
 {fur:'#d88d4b',muzzle:'#ffdfb8',coat:'#957ba1',ears:'point',fox:true},
 {fur:'#f5e9d2',muzzle:'#d5b798',coat:'#e6ab97',ears:'wool',glasses:true},
 {fur:'#e6ac64',muzzle:'#fff1cf',coat:'#7eaf94',ears:'round'}
];
class TownCharacter{
 constructor(world,key,height){this.w=world;this.key=key;this.height=height;this.root=new T.Group();this.root.scale.setScalar(height/3.8);this.motion=new T.Group();this.root.add(this.motion);this.heading=0;this.goalHeading=0;this.expression='idle';this.expressionUntil=0;this.phase=Math.random()*TAU;this.eyes=[];this.brows=[];this.build(key);this.previous=new T.Vector3();this.initialized=false;}
 g(x=0,y=0,z=0,parent=this.motion){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
 b(r,c,parent,x=0,y=0,z=0,sx=1,sy=1,sz=1){return this.w.ball(r,c,parent,x,y,z,sx,sy,sz);}
 box(w,h,d,c,parent,x=0,y=0,z=0){return this.w.box(w,h,d,c,parent,x,y,z);}
 torus(r,t,c,parent,x,y,z){const m=this.w.mesh(new T.TorusGeometry(r,t,8,24),c,parent,x,y,z);return m;}
 build(key){
  const bird=key.startsWith('narmi'),dari=key.startsWith('dari');this.bird=bird;this.dari=dari;const index=key.startsWith('animal')?Number(key.slice(6)):6;this.kind=index;const p=palettes[index]||palettes[6];this.palette=p;
  this.torso=this.g(0,0,0);this.b(.64,bird?'#faf8e8':dari?'#f0b36a':p.coat,this.torso,0,1.35,0,1,.96,.78);this.b(.5,bird?'#fffdf0':dari?'#fff6dc':p.muzzle,this.torso,0,1.25,.39,.83,.95,.36);
  if(!bird&&!dari){[-.37,.37].forEach(x=>{this.box(.15,.9,.12,p.coat,this.torso,x,1.48,.51);this.b(.055,'#eed18d',this.torso,x,1.65,.6);});this.box(.47,.3,.1,p.coat,this.torso,0,1.2,.61);this.b(.085,'#e7d29b',this.torso,.03,1.24,.68,1,1,.2);}
  this.arms=[-1,1].map(side=>{const arm=this.g(side*.63,1.78,0,this.torso);this.b(.24,bird?'#626d66':dari?p.fur:p.coat,arm,side*.06,-.32,0,.76,1.8,1);this.b(.22,bird?'#747e74':dari?'#edb573':p.fur,arm,side*.06,-.69,.04,1,1,1);return arm;});
  this.legs=[-1,1].map(side=>{const leg=this.g(side*.27,.7,0,this.torso);this.b(.2,bird?'#d79e40':dari?'#dc9d57':p.coat,leg,0,-.2,0,.9,1.5,.9);this.b(.23,bird?'#e9b14b':dari?'#dfab6a':'#685c48',leg,0,-.47,.14,1.2,.6,1.45);return leg;});
  this.head=this.g(0,2.52,0,this.torso);this.b(.88,bird?'#fffdf2':dari?'#efb270':p.fur,this.head,0,0,0,1,1,.86);
  if(bird){
   const mask=this.b(.76,'#455251',this.head,0,-.03,.54,1.06,.65,.37);this.b(.72,'#d5e9eb',this.head,0,-.015,.64,1.06,.62,.24);
   for(let i=0;i<3;i++){const f=this.b(.32,'#fffdf0',this.head,.05+i*.22,.65+i*.06,-.06,1.6,.45,.7);f.rotation.z=.12+i*.16;}
   this.beak=this.b(.19,'#e7ad48',this.head,0,-.35,.85,1,.7,1.15);this.box(.28,.035,.13,'#7e6847',this.head,0,-.37,1.03);
   const scarf=this.torus(.47,.12,'#d65e50',this.torso,0,1.95,0);scarf.rotation.x=Math.PI/2;this.scarf=this.box(.22,.65,.1,'#df6956',this.torso,.38,1.65,.44);this.scarf.rotation.z=-.3;
  }else{
   if(p.mask&&!dari){[-1,1].forEach(side=>{const mask=this.b(.4,'#605043',this.head,side*.39,0,.62,1,.65,.23);mask.rotation.z=side*.2;});}
   this.b(.54,dari?'#fff5df':p.muzzle,this.head,0,-.27,.53,1.25,.72,.52);
   if(p.fox){[-1,1].forEach(side=>{const cheek=this.b(.37,p.muzzle,this.head,side*.56,-.21,.45,1.1,.55,.65);cheek.rotation.z=-side*.28;});}
   if(p.ears==='point'&&!dari){[-1,1].forEach(side=>{const ear=this.w.mesh(new T.ConeGeometry(.35,.83,3),p.fur,this.head,side*.62,.72,0);ear.rotation.z=-side*.24;const inner=this.w.mesh(new T.ConeGeometry(.2,.5,3),'#ecc2b1',this.head,side*.62,.8,.2);inner.rotation.z=-side*.24;});}
   else if(p.ears==='wool'&&!dari){for(let i=0;i<10;i++){const a=i/10*TAU;this.b(.32,'#fff4dd',this.head,Math.cos(a)*.75,Math.sin(a)*.75,-.08);}}
   else{[-1,1].forEach(side=>{this.b(.29,p.fur,this.head,side*.66,.64,-.1,1,1,.6);this.b(.18,'#edc5ad',this.head,side*.66,.67,.07,1,1,.35);});}
   this.b(.12,'#584e43',this.head,0,-.13,.99,1.15,.7,.6);
   if(p.spines&&!dari){for(let i=0;i<12;i++){const a=i/12*TAU;const spike=this.w.mesh(new T.ConeGeometry(.25,.7,5),'#855c43',this.head,Math.cos(a)*.7,Math.sin(a)*.72,-.4);spike.rotation.z=-a+Math.PI/2;}}
   if(p.mask||p.fox||dari){const tail=this.g(.4,.95,-.46,this.torso);this.b(.32,dari?'#fff4dd':p.fur,tail,.1,0,-.36,1,1.1,1.8);if(p.mask&&!dari)for(let i=0;i<3;i++){const ring=this.torus(.29,.08,'#685248',tail,.1,0,-.2-i*.18);ring.scale.y=1.05;}if(p.fox)this.b(.25,'#fff0cf',tail,.1,-.05,-.86,1,.9,1.4);this.tail=tail;}
   if(dari){for(let i=-1;i<=1;i++)this.box(.08,.46,.045,'#b57945',this.head,i*.22,.5,.64);}
  }
  const eyeY=bird?.04:.06,eyeZ=bird?.84:.78;for(const side of[-1,1]){const eye=this.g(side*.31,eyeY,eyeZ,this.head);this.b(.115,'#3d4039',eye,0,0,0,.85,1.12,.6);this.b(.032,'#fffdf4',eye,-.025,.045,.068);this.eyes.push(eye);const brow=this.box(.18,.036,.05,bird?'#738c8e':'#70533d',this.head,side*.31,.26,eyeZ+.015);brow.rotation.z=side*.12;this.brows.push(brow);this.b(.125,'#e9ae9b',this.head,side*.54,-.19,.71,1,.5,.15);}
  this.mouth=this.g(0,bird?-.38:-.38,bird?1.05:.93,this.head);this.b(.105,'#654e42',this.mouth,0,0,0,1,.45,.16);this.tongue=this.b(.065,'#dd9a8f',this.mouth,0,-.02,.025,1,.45,.15);
  if((p.glasses||p.mask)&&!bird&&!dari){for(const side of[-1,1])this.torus(.21,.026,'#816b47',this.head,side*.31,.065,.89);this.box(.2,.026,.03,'#816b47',this.head,0,.065,.91);}
  if(p.spines&&!bird&&!dari){for(const side of[-1,1]){this.torus(.2,.06,'#be9956',this.head,side*.3,.61,.5);this.b(.16,'#9ccfc6',this.head,side*.3,.61,.52,1,1,.2);}const scarf=this.torus(.45,.12,'#d17943',this.torso,0,1.96,0);scarf.rotation.x=Math.PI/2;}
  if(index===3&&!dari&&!bird){this.b(.9,'#5caaa0',this.head,0,.52,-.03,1,.48,1);this.w.cylinder(1.02,1.02,.1,'#ddb96f',this.head,0,.48,0,24);}
  this.emoteCanvas=document.createElement('canvas');this.emoteCanvas.width=this.emoteCanvas.height=160;this.emoteMap=new T.CanvasTexture(this.emoteCanvas);this.emoteMap.colorSpace=T.SRGBColorSpace;this.emote=new T.Sprite(new T.SpriteMaterial({map:this.emoteMap,transparent:true,depthTest:false,toneMapped:false}));this.emote.position.set(.82,3.95,0);this.emote.scale.set(1.05,1.05,1);this.emote.visible=false;this.root.add(this.emote);
 }
 emotion(name,now,duration=2){this.expression=name;this.expressionUntil=now+duration;const symbols={wave:'♪',cheer:'♥',surprise:'!',think:'?',worry:'…',clap:'✦',point:'✧',sad:'…',thanks:'♥',talk:'♪'};const c=this.emoteCanvas.getContext('2d');c.clearRect(0,0,160,160);c.fillStyle=name==='worry'||name==='sad'?'#c5e1e1':name==='cheer'||name==='thanks'?'#f5d6cf':'#fff0b8';c.beginPath();c.arc(80,80,69,0,TAU);c.fill();c.lineWidth=7;c.strokeStyle='#fffaf0';c.stroke();c.fillStyle=name==='cheer'||name==='thanks'?'#c67c77':'#8c8154';c.font='900 90px "Malgun Gothic",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(symbols[name]||'♪',80,84);this.emoteMap.needsUpdate=true;}
 facePoint(dx,dz){if(Math.hypot(dx,dz)>.01)this.goalHeading=Math.atan2(dx,dz);}
 update(dt,t,{walk=0,pose='idle',lookAt=null,facing=null}={}){
  const p=t+this.phase,react=t<this.expressionUntil?this.expression:null;if(react)pose=react;this.pose=pose;this.walk=walk;if(facing!==null)this.goalHeading=facing;let delta=Math.atan2(Math.sin(this.goalHeading-this.heading),Math.cos(this.goalHeading-this.heading));this.heading+=delta*Math.min(1,dt*10);this.root.rotation.y=this.heading;
  const stride=Math.sin(t*10+this.phase)*Math.min(1,walk),hop=Math.abs(Math.sin(t*10+this.phase))*Math.min(1,walk)*.1;this.motion.position.y=hop;this.motion.rotation.set(0,0,Math.sin(p*2)*.018);this.torso.scale.set(1,1+Math.sin(p*2.5)*.012,1);this.head.rotation.set(Math.sin(p*1.7)*.018,Math.sin(p*.9)*.055,0);this.arms.forEach((a,i)=>{a.rotation.set((i===0?1:-1)*stride*.65,0,(i===0?1:-1)*.12);});this.legs.forEach((a,i)=>a.rotation.x=(i===0?1:-1)*stride*.7);
  if(lookAt){this.head.rotation.y=Math.max(-.45,Math.min(.45,lookAt));}
  const talking=pose==='talk'||pose==='point';this.mouth.scale.y=talking?.9+Math.abs(Math.sin(t*18))*1.8:.45;this.mouth.scale.x=pose==='surprise'?.8:1;
  const blink=((p%4.1)<.12)? .08:1;this.eyes.forEach(e=>e.scale.y=pose==='cheer'||pose==='thanks'? .35:blink);this.brows.forEach((b,i)=>b.rotation.z=(i===0?-1:1)*(pose==='worry'||pose==='sad'?-.38:pose==='surprise'?.3:.12));
  if(pose==='wave'){this.arms[1].rotation.z=-2.2+Math.sin(t*12)*.32;this.head.rotation.z=Math.sin(t*4)*.08;}
  if(pose==='talk'){this.arms[0].rotation.x=-.4+Math.sin(t*6)*.3;this.arms[1].rotation.z=-.45-Math.sin(t*5)*.2;this.head.rotation.x=Math.sin(t*7)*.055;}
  if(pose==='point'){this.arms[0].rotation.z=-1.6+Math.sin(t*4)*.06;this.arms[0].rotation.y=-.25;this.arms[1].rotation.x=-.45;this.head.rotation.y=-.26;}
  if(pose==='press'){this.arms[1].rotation.x=-1.5+Math.sin(t*10)*.22;this.head.rotation.x=.1;}
  if(pose==='clap'){this.arms[0].rotation.set(-1.2,Math.sin(t*14)*.25+.35,-.55);this.arms[1].rotation.set(-1.2,-Math.sin(t*14)*.25-.35,.55);this.head.rotation.x=-.05;}
  if(pose==='cheer'||pose==='thanks'){this.arms[0].rotation.z=2.4+Math.sin(t*7)*.15;this.arms[1].rotation.z=-2.4-Math.sin(t*7)*.15;this.motion.position.y=Math.max(0,Math.sin(t*7))*.35;this.legs[0].rotation.x=.15;this.legs[1].rotation.x=-.15;}
  if(pose==='think'||pose==='worry'){this.arms[1].rotation.set(-1.6,0,-.65);this.head.rotation.z=.13;this.head.rotation.x=.08;}
  if(pose==='bow'){this.motion.rotation.x=.35+.12*Math.sin(t*3);this.arms[0].rotation.z=.1;this.arms[1].rotation.z=-.1;}
  if(pose==='surprise'){this.arms[0].rotation.z=1.1;this.arms[1].rotation.z=-1.1;this.motion.position.y=.12;this.mouth.scale.y=2;}
  if(pose==='listen'){this.head.rotation.x=Math.sin(t*3)*.07;this.arms[0].rotation.x=-.15;this.arms[1].rotation.x=-.15;}
  if(this.tail)this.tail.rotation.x=Math.sin(t*3)*.13;if(this.scarf)this.scarf.rotation.x=Math.sin(t*5)*.12;
  this.emote.visible=!!react;this.emote.position.y=3.98+Math.sin(t*6)*.08;const remain=Math.min(1,(this.expressionUntil-t)*4);this.emote.scale.setScalar(Math.max(0,remain)*(1+.08*Math.sin(t*7)));
 }
 dispose(){this.root.traverse(o=>{if(o.isMesh)o.geometry?.dispose();});this.emoteMap.dispose();this.emote.material.dispose();}
}
scope.TownCharacter=TownCharacter;
})(globalThis);
