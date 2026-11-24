(function(scope){
'use strict';
// A fictional, supervised procurement trial. The agency operates the equipment;
// the player starts test conditions, observes evidence and signs an accurate record.
const conditions=[
 [['작은 연기가 피어오르면','숲의 작은 시험 연기를 소방서가 확인해요.'],['군고구마 연기라면','군고구마 가게의 연기는 출동 대상이 아니에요.'],['멀리, 바람 부는 숲이라면','순찰대에서 먼 숲에도 신호가 닿는지 살펴요.']],
 [['수위가 오르기 시작하면','관리센터가 위험 수위 전에 차량 진입을 막아요.'],['빗물이 잠깐 튀었다면','물튀김과 계속 차오르는 수위를 구별해요.'],['폭우 속 먼 지하차도라면','시야가 나쁜 먼 구역의 알림도 도착해야 해요.']],
 [['아이가 건너려 하면','담당자가 차량 정지를 확인한 뒤 아이를 안내해요.'],['비둘기만 지나간다면','아무도 건너지 않는 횡단보도를 구별해요.'],['모퉁이의 작은 아이라면','가려진 곳의 작은 아이도 확인해야 해요.']],
 [['집에서 도움을 요청하면','복지관이 알림을 받고 연락한 뒤 방문해요.'],['편안하게 쉬고 있다면','일상적인 소리를 도움 요청과 구별해요.'],['눈 오는 밤, 작은 요청이라면','먼 집의 조용한 요청도 복지관으로 이어져야 해요.']]
];
const issues={false:'헛경보를 줄이도록 실제 위험과 일상을 구별해 주세요',wind:'바람 속에서도 관측을 이어갈 수 있도록 개선해 주세요',coverage:'멀리 떨어진 구역까지 확인할 수 있도록 보완해 주세요',night:'조용한 야간 요청도 알아들을 수 있도록 개선해 주세요',rain:'폭우 속에서도 감지할 수 있도록 개선해 주세요',speed:'작은 신호를 더 일찍 알려주세요',expand:'통과한 조건을 유지하며 더 다양한 현장에서도 확인해 주세요'};
const answers=[{id:'timely',text:'필요한 신호를 제때 전달했어요'},{id:'quiet',text:'일상 신호를 구별해 불필요한 대응을 막았어요'},{id:'false',text:'위험이 아닌데도 알림이 울렸어요'},{id:'backup',text:'제품이 놓쳐 담당자의 추가 확인이 필요했어요'}];
function casesFor(season,product){return conditions[season].map(([title,condition],index)=>{
 const fake=index===1,drone=product.ability==='움직이는 눈',improved=product.stars>=5&&!product.fraud;
 const missed=product.fraud||(!fake&&index===2&&(product.old||drone)&&!improved);
 const falseAlarm=fake&&!product.old&&!drone&&!improved;
 const notify=product.fraud?null:missed?null:fake?(falseAlarm?2.4:null):product.old?4:2.4;
 const answer=missed?'backup':fake?(falseAlarm?'false':'quiet'):'timely';
 const issue=missed?(product.old?'coverage':drone?'wind':season===1?'rain':season===3?'night':'speed'):falseAlarm?'false':null;
 const result=answers.find(a=>a.id===answer).text;
 const log=answer==='backup'?'제품 알림 없음 · 담당자가 6.0초에 추가 확인':answer==='false'?'2.4초 알림 · 4.8초 담당자 확인: 위험 아님':answer==='quiet'?'불필요한 알림 없음 · 4.8초 담당자 확인: 일상 신호':`${notify.toFixed(1)}초 ${product.old?'담당자 직접 확인':'제품 알림'} · 4.8초 담당 기관 대응`;
 return {index,title,condition,fake,answer,issue,notifyAt:notify,operatorAt:missed?6:4.8,needMet:answer==='timely'||answer==='quiet',result,log,duration:8.4};
});}
function create({season,product,scale='small',seed=0}){if(!Number.isInteger(season)||season<0||season>3||!product)throw Error('Invalid pilot');return {version:3,kind:'pilot',season,product:{...product},scale,seed,caseIndex:0,phase:'ready',clock:0,cases:casesFor(season,product),records:[],events:[],effects:[],done:false,replays:0};}
function current(r){return r.cases[r.caseIndex];}
function start(r){if(r.done||!['ready','record'].includes(r.phase))return false;if(r.phase==='record')r.replays++;r.phase='running';r.clock=0;return true;}
function update(r,dt){if(r.phase!=='running'||!Number.isFinite(dt)||dt<0)return;r.clock=Math.min(current(r).duration,r.clock+dt);if(r.clock>=current(r).duration)r.phase='record';}
function record(r,key){if(r.phase!=='record')return {ok:false,reason:'먼저 시험을 끝까지 관찰해 주세요.'};const c=current(r);if(key!==c.answer)return {ok:false,reason:c.log+' — 이 기록과 맞는 관찰을 골라볼까요?'};r.records.push({...c});r.phase='recorded';return {ok:true};}
function next(r){if(r.phase!=='recorded')return false;if(r.caseIndex===2){r.done=true;r.phase='done';}else{r.caseIndex++;r.phase='ready';r.clock=0;}return true;}
function summary(r){if(!r.done||r.records.length!==3)throw Error('Pilot is incomplete');const hits=r.records.filter(c=>c.needMet).length,success=hits>=2,weakness=r.records.find(c=>c.issue)?.issue||'expand';return {kind:'pilot',hits,total:3,stars:hits,success,safetyDelta:[-12,-4,8,13][hits],growth:success&&!r.product.old&&!r.product.fraud?(r.scale==='large'?2:1):0,falseAlarms:r.records.filter(c=>c.answer==='false').length,weakness,records:r.records.map(c=>({...c})),replays:r.replays};}
function validRound(r){return r?.version===3&&r.kind==='pilot'&&Number.isInteger(r.season)&&r.season>=0&&r.season<4&&!!r.product&&Number.isInteger(r.caseIndex)&&r.caseIndex>=0&&r.caseIndex<3&&['ready','running','record','recorded','done'].includes(r.phase)&&Number.isFinite(r.clock)&&r.clock>=0&&r.clock<=8.4&&Array.isArray(r.cases)&&r.cases.length===3&&Array.isArray(r.records)&&r.records.length<=3;}
const LOCATIONS=[[[17,23],[43,18],[75,25],[27,52],[60,48],[83,66],[46,78],[15,78]],[[18,50],[50,50],[82,50]],[[18,50],[50,50],[82,50]],[[20,25],[50,22],[80,27],[20,70],[50,72],[80,68]]];
const api={LOCATIONS,create,current,start,update,record,next,summary,validRound,issues,answers,casesFor};if(typeof module!=='undefined'&&module.exports)module.exports=api;else scope.FirstGuestPilot=api;
})(globalThis);
