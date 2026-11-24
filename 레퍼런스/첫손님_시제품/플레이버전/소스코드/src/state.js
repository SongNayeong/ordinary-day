const E=globalThis.FirstGuestEngine;
const SAVE_KEY='first-guest.game.v1';
const initial=()=>({view:'title',briefingSeason:-1,presentationStep:0,presenter:0,dialogueFrom:'presenter',aiCount:0,aiErrorSlot:Math.floor(Math.random()*4),feedback:{},aiCorrections:0,season:0,budget:1400,safety:60,growth:0,selected:null,scale:'small',tokens:3,known:[2,3,5],companies:{},history:[],frauds:0,caught:false,tip:'처음이라 모르는 게 당연해요. 같이 살펴봐요!',sound:true,result:null,fact:0,roundState:null,started:false,finished:false,seed:Math.floor(Math.random()*0xffffffff)});
let s=initial(),timer=null,toastTimer=null,round=null,modalReturn=null,playing=false,paused=false,ctx;
let savedGame=null,lastFrame=0,lastCheckpoint=0,lastEffect='',saveWarning=false,pointerDragging=false,roundResumeAfterModal=false;
try{
 const payload=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
 if(payload?.version===1&&payload.state&&Number.isInteger(payload.state.season)&&payload.state.season>=0&&payload.state.season<4&&Array.isArray(payload.state.history)&&payload.state.history.length<=4&&Number.isFinite(payload.state.budget)){
  savedGame={...initial(),...payload.state};
  if(savedGame.roundState&&!E.validRound(savedGame.roundState))savedGame.roundState=null;
  s.sound=savedGame.sound;
 }
}catch{}
function persist(){
 if(!s.started)return;
 if(round)s.roundState=JSON.parse(JSON.stringify(round));
 const snapshot=JSON.parse(JSON.stringify(s));if(snapshot.view==='title')snapshot.view=s.resumeView||'season';savedGame=snapshot;
 try{localStorage.setItem(SAVE_KEY,JSON.stringify({version:1,savedAt:Date.now(),state:snapshot}));}
 catch{if(!saveWarning){saveWarning=true;toast('이 브라우저에서는 이어하기 저장이 제한돼요. 창을 닫기 전에 끝까지 플레이해 주세요.');}}
}
const FIELD_TIPS=[
 {title:'연기를 잡아라!',instruction:'숲에서 피어나는 회색 연기를 눌러요.',detail:'고구마 굽는 연기는 그대로 두세요. 바람을 타고 연기가 움직여요.',action:'연기 진압',fake:'고구마 굽는 중',good:'수상한 연기'},
 {title:'차단기를 내려라!',instruction:'물이 차오른 길의 차단기를 내려요.',detail:'세 갈래 지하차도를 살펴요. 분수만 흐르는 곳은 막지 마세요.',action:'차단기 내리기',fake:'분수대 정상',good:'물이 차올라요'},
 {title:'신호를 바꿔라!',instruction:'아이가 가까워지면 보행 신호를 켜요.',detail:'노란 대기 구간을 지나 초록 구간에 들어왔을 때! 비둘기는 그냥 두세요.',action:'보행 신호 켜기',fake:'비둘기 무리',good:'아이들이 와요'},
 {title:'따뜻한 안부를 전해라!',instruction:'도움 불빛이 켜진 집으로 방문차를 보내요.',detail:'집을 누르면 출발! 차량을 직접 끌어도 돼요. Zzz는 편히 주무시는 집이에요.',action:'방문하기',fake:'Zzz · 주무시는 중',good:'도움이 필요해요'}
];
