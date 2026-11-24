function icon(name){const glyph={glasses:'◎','briefcase-business':'▣',phone:'☎',radar:'◉','scan-eye':'⌕','tower-control':'♜','traffic-cone':'△','audio-lines':'♫',truck:'▰','lock-keyhole':'▣',mic:'♪',sparkles:'✦'};return `<span class="fg-icon" aria-hidden="true">${glyph[name]||'❧'}</span>`;}
function icons(){}
function title(){
 const canContinue=!!savedGame?.started;
 return `<section class="fg-title"><div class="fg-title-brand">작은 믿음으로 바꾸는, 커다란 내일</div><span class="fg-title-version">혁신조달 어드벤처 · 1년의 첫 믿음</span><div class="fg-title-copy"><div class="fg-subtitle fg-display">나라가 처음 사주는 날</div><h1 class="fg-logo fg-display">첫 손님<small>THE FIRST CUSTOMER</small></h1><p>아무도 안 써본 새 기술,<br>나라가 처음 써볼까?</p>${canContinue?`<button class="fg-btn fg-primary fg-start fg-display" data-action="continue">${savedGame.finished?'올해의 리포트':'이어서 출근하기'}</button><span class="fg-save-note">${seasons[savedGame.season].symbol} ${seasons[savedGame.season].name} · 국민 안심 ${savedGame.safety} · 자동 저장됨</span><button class="fg-btn fg-new-year" data-action="new-game">새로운 1년 시작</button>`:'<button class="fg-btn fg-primary fg-start fg-display" data-action="new-game">출근하기</button>'}<button class="fg-plain fg-title-help" data-go="guide">어떻게 하나요?</button></div><div class="fg-title-bubble">팀장님, 첫 출근 준비됐나요?</div>${mascots('fg-title-mascots')}<div class="fg-copyright">캐릭터 나르미·달이 © 조달청 · 등장 회사는 모두 가상</div><div class="fg-title-options"><button class="fg-btn fg-small" data-action="sound" aria-label="소리 설정">${s.sound?'소리 켜짐 ♪':'소리 꺼짐'}</button><span>한 해 약 6분 · 터치 / 마우스 / 숫자키</span></div></section>`;
}
function guide(){return `<section class="fg-simple texture"><div class="fg-topline"><span class="fg-eyebrow">첫 출근 안내서</span><span class="fg-corner-logo">첫 손님</span></div><h2 class="fg-display">당신의 믿음이, 이 마을의 다음 장면.</h2><p class="fg-muted">모두의 발표를 듣고, 조사하고, 직접 현장을 지켜요.</p><div class="fg-guide-grid"><article class="fg-guide-card"><span class="fg-step-number">1</span><div class="fg-guide-art"><div class="mini-card">?</div><div class="mini-card">★</div></div><b class="fg-display">깐깐하게 고르기</b><p>발표는 세 명 모두.<br>조사 기회는 세 번이에요.</p></article><article class="fg-guide-card"><span class="fg-step-number">2</span><div class="fg-guide-art"><div class="fg-hazard-inner">☁</div><span style="font-size:35px;margin-left:17px">✦</span></div><b class="fg-display">현장을 지키기</b><p>계절마다 다른 30초 미션.<br>헛경보는 그냥 두세요!</p></article><article class="fg-guide-card"><span class="fg-step-number">3</span><div class="fg-guide-art">${sprite(0)}</div><b class="fg-display">같이 커가기</b><p>성공하면 기업이 자라고,<br>피드백으로 기술이 좋아져요.</p></article></div><p class="fg-guide-goal">연말 목표 · 국민 안심 75 이상 + 혁신 성장 4 이상<br><small>마우스·터치로 선택 · 현장은 숫자키 1–8도 가능 · Esc로 잠깐 멈추기</small></p><div class="fg-bottom-action"><button class="fg-btn fg-primary" data-action="begin">알겠어요, 출근할게요!</button><button class="fg-plain" data-go="title">처음 화면</button></div></section>`;}
function startNew(){
 stop();const sound=s.sound;s=initial();s.sound=sound;s.started=true;savedGame=null;round=null;s.known=products().map(p=>p.known);go('guide');
}
function resumeGame(){
 if(!savedGame?.started)return;stop();s=JSON.parse(JSON.stringify(savedGame));round=E.validRound(s.roundState)?JSON.parse(JSON.stringify(s.roundState)):null;
 if(s.finished)s.view='report';render();if(s.view==='field'&&round?.done)finishRound();
}
function products(){
 const lineup=productData[s.season].map(p=>({...p}));
 const recent=Object.entries(s.companies).filter(([id,c])=>c.lastSeason===s.season-1&&!lineup.some(p=>p.id===id)&&id!=='fox').sort((a,b)=>b[1].level-a[1].level)[0];
 if(s.season>0&&recent){const [id]=recent,previous=productData.flat().find(p=>p.id===id&&!p.old&&!p.fraud);if(previous){
  const names={raccoon:['AI 산불 감지 카메라','AI 침수 감지 카메라','통학로 감지 카메라','낙상 감지 센서'],hedgehog:['산불 순찰 드론','수해 순찰 드론','등굣길 드론','안부 순찰 드론'],otter:['산불 감지 센서','침수 감지 센서','통학로 접근 센서','겨울 안부 센서'],hamster:['스마트 산불 알림','스마트 침수 알림','스마트 횡단보도','스마트 안부 알림'],sheep:['숲 지킴이 스피커','침수 경보 스피커','등굣길 안내 스피커','안부 AI 스피커']};
  lineup[0]={...previous,name:names[id]?.[s.season]||previous.name,quote:'팀장님 덕분에 다시 왔어요! 이번엔 더 싸게 드릴게요.',desc:'지난 현장의 사용 기록을 반영했어요. '+(previous.ability==='미리 보기'?'위험을 미리 알려줘요.':previous.ability==='움직이는 눈'?'드론 주변 위험을 찾아 해결을 도와요.':'일부 위험을 자동으로 처리해요.')};
 }}
 return lineup.map(p=>{const history=s.companies[p.id],feedback=s.feedback[p.id],back=!!history&&!p.old&&!p.fraud;const upgrade=back&&(history.level>0||feedback?.correct)?1:0;return {...p,back,price:back?Math.round(p.price*.8):p.price,known:back?5:p.known,stars:Math.min(5,p.stars+upgrade),desc:feedback?.correct?p.desc+' 지난 피드백으로 성능이 한 단계 좋아졌어요.':p.desc};});
}
function futureReserve(){return productData.slice(s.season+1).reduce((sum,list)=>sum+Math.min(...list.filter(p=>!p.fraud).map(p=>p.price)),0);}
function canCommit(){return presentationComplete()&&s.selected!==null&&!(current().fraud&&s.caught)&&cost()+futureReserve()<=s.budget;}
function purchase(){
 if(!canCommit()){toast('다음 계절의 최소 예산도 남겨두어야 해요. 구매 규모나 제품을 바꿔보세요.');return;}
 if(s.history.some(h=>h.season===s.season))return;
 const p=current();s.budget-=cost();s.history.push({season:s.season,id:p.id,name:p.name,company:p.company,price:cost(),scale:s.scale,old:!!p.old,fraud:!!p.fraud,stars:p.stars,result:null});
 if(!p.old&&!p.fraud&&!s.companies[p.id])s.companies[p.id]={name:p.company,sprite:p.sprite,level:0,lastSeason:s.season};
 s.roundState=null;round=null;go('stamp');beep(180,.2);
}
function render(){
 stopPresentation();screen.innerHTML=(renders[s.view]||title)();icons();
 if(s.view==='pitch'){mountPresentation();const footer=root.querySelector('.fg-pitch-footer');if(footer){const note=document.createElement('div');note.className='fg-reserve-note';note.textContent=futureReserve()?`다음 계절을 위해 ${futureReserve()}코인은 남겨둬요.`:'올해의 마지막 선택이에요.';footer.appendChild(note);}}
 if(s.view==='field'){bindField();drawField();}
 if(s.view==='facts'&&s.fact===4){const g=screen.querySelector('.fg-mascots');g.querySelector('.narmi').style.height='90px';g.querySelector('.dari').style.height='45px';g.style.justifyContent='center';}
 if(s.view==='share'&&!companyList().length){const list=root.querySelector('.fg-share-companies');list.innerHTML='<p class="fg-empty-companies">올해는 기존 제품으로 현장을 지켰어요.</p>';}
}
function stop(){stopPresentation();cancelAnimationFrame(timer);timer=null;playing=false;paused=false;roundResumeAfterModal=false;showResumeAfterModal=false;}
function go(view){
 if(view==='title'&&s.view!=='title')s.resumeView=s.view;
 stop();closeModal();clearTimeout(toastTimer);root.querySelector('.fg-toast').hidden=true;
 if(view==='field'&&!s.history.some(h=>h.season===s.season))view='pitch';
 s.view=view;if(view==='report'&&s.history.length===4&&s.history.every(h=>h.result)){s.finished=true;}
 render();persist();
}
function nextSeason(){
 if(!s.result)return;if(s.season===3){go('award');return;}
 s.season++;resetPresentation();s.tokens=3;s.scale='small';s.caught=false;s.selected=null;s.tip=seasons[s.season].intro;s.result=null;s.roundState=null;round=null;s.known=products().map(p=>p.known);go('season');
}
function modal(html,type=''){
 modalReturn=document.activeElement;
 if(showRunning){showResumeAfterModal=true;stopPresentation();setPresentationButton();}
 if(playing){roundResumeAfterModal=true;playing=false;paused=true;cancelAnimationFrame(timer);persist();}
 overlay.innerHTML=`<div class="fg-modal ${type}" role="dialog" aria-modal="true" aria-label="조사와 게임 안내"><button class="fg-close" data-action="close-modal" aria-label="닫기">×</button>${html}</div>`;overlay.hidden=false;icons();overlay.querySelector('button:not(.fg-close)')?.focus();
}
function closeModal(){
 const resumeShow=showResumeAfterModal,resumeRound=roundResumeAfterModal;showResumeAfterModal=false;roundResumeAfterModal=false;overlay.hidden=true;overlay.innerHTML='';paused=false;
 if(modalReturn){const target=modalReturn;modalReturn=null;if(target.isConnected)target.focus({preventScroll:true});}
 if(resumeShow&&s.view==='pitch'&&!presentationComplete())togglePresentation();
 if(resumeRound&&s.view==='field'&&round&&!round.done)runField();
}
function pause(){
 modal(`<span class="fg-eyebrow">잠깐, 숨 고르기</span><h2 class="fg-display">쉬었다 갈까요?</h2>${mascots()}<div class="fg-pause-buttons"><button class="fg-btn fg-primary" data-action="close-modal">계속하기</button><button class="fg-btn" data-action="sound">${s.sound?'소리 끄기':'소리 켜기'}</button><button class="fg-btn" data-action="home">저장하고 처음 화면</button></div><p class="fg-pause-note">발표와 현장 시간도 함께 멈췄어요.</p>`);
}
function research(type){
 if(!presentationComplete()||!s.tokens)return;if(s.selected===null){toast('마음에 드는 제품 카드를 먼저 골라주세요.');return;}
 const p=current();s.tokens--;s.dialogueFrom='dari';if(type!=='phone')s.known[s.selected]=Math.min(5,s.known[s.selected]+1);
 if(type==='glasses'&&p.fraud){
  s.tip='발표는 화려한데… 뒤에서 딸깍 소리가 나요!';render();
  modal(`<span class="fg-pill green">나르미의 스마트 안경 · 실제 시연</span><h2 class="fg-display">어라? 뒤에서 딸깍…?</h2><div class="fg-demo-reveal">${sprite(4)}<i class="fg-curtain"></i><i class="fg-curtain right"></i><span class="fg-hidden-operator">딸깍! <b>☞ ▣</b></span></div><div class="fg-evidence">AI 칩 없음 · 사람이 누른 신호 감지<br>“정확도 100%”를 뒷받침할 시험 자료 없음</div><p>여우 대표가 몰래 버튼을 누르고 있었어요!<br>화려한 말보다, 진짜 기술을 봐야겠네요.</p><button class="fg-btn fg-primary" data-action="catch">무늬만 AI 적발하기</button>`,'goggles');
 }else if(type==='glasses'){
  s.tip=p.desc;render();modal(`<span class="fg-pill green">직접 보여주세요! · 나르미 스마트 안경</span><h2 class="fg-display">실제로 확인했어요.</h2><div class="fg-scan-art">${sprite(p.sprite)}</div>${stars(p,s.known[s.selected])}<p>${p.desc}</p><button class="fg-btn fg-primary" data-action="close-modal">잘 봤어요!</button>`,'goggles');
 }else if(type==='ai'){
  const wrong=(s.aiCount++%4)===(s.aiErrorSlot??2);s.aiPending={wrong,product:p.id};
  const evidence=p.fraud?'성능 시험 자료가 제출되지 않았어요. AI를 썼다는 주장도 시연으로 확인해야 해요.':p.desc;
  s.tip='달이가 AI 분석 자료를 꺼냈어요. 근거도 함께 살펴봐요.';render();
  modal(`<span class="fg-pill green">달이가 꺼낸 자료 · AI 분석 시스템</span><h2 class="fg-display">분석 자료가 도착했어요.</h2>${img('dari','fg-analysis-dari','달이')}<p><b>${p.name}</b><br>“${wrong?'어떤 날씨, 어떤 상황에서도 완벽해요!':evidence}”</p>${stars(p,s.known[s.selected])}<span class="fg-pill gray">AI라 틀릴 수도 있어요</span><p class="fg-analysis-note">분석은 AI 시스템이, 마지막 판단은 팀장님이 해요.</p><button class="fg-btn" data-action="evidence">근거 보기</button><div data-evidence hidden class="fg-evidence"><strong>현장 시험 기록</strong><p>${evidence}</p><p>시험은 정해진 환경에서만 진행했어요.</p><button data-action="${wrong?'correct-ai':'wrong-ai'}">모든 상황에서 완벽하다는 근거는 없어요</button><button data-action="${wrong?'wrong-ai':'confirm-ai'}">자료의 조건과 한계를 잘 설명했네요</button></div>`);
 }else{
  const hints=['바람이 바뀌면 연기가 옆으로 움직여요. 미리 보기로 먼저 대비하면 좋아요.','폭우가 세질 때 차가 빨리 다가와요. 물 높이를 먼저 알려주는 기술이 도움이 돼요.','아이들이 노란 구간에 있을 때는 기다려요. 초록 구간에서 신호를 바꾸면 돼요.','집들이 떨어져 있어요. 가까운 도움 불빛부터 방문하면 시간을 아낄 수 있어요.'];
  s.tip=hints[s.season];render();modal(`<span class="fg-pill green">현장 직원과 통화 중</span><h2 class="fg-display">여기는 현장이에요!</h2><div class="fg-phone-art">☎</div><div class="fg-chat-bubble">“${s.tip}”</div><p>제품의 능력과 현장을 함께 생각해 보세요.</p><button class="fg-btn fg-primary" data-action="close-modal">고맙습니다!</button>`);
 }persist();
}
function field(){
 const a=seasons[s.season],p=current(),tip=FIELD_TIPS[s.season];
 if(!round&&E.validRound(s.roundState))round=JSON.parse(JSON.stringify(s.roundState));
 return `<section class="fg-field fg-playfield season-${s.season}">${hud()}<div class="fg-map" style="${s.season?'background-image:var(--season-image);background-size:100% 300%;background-position:center '+(s.season-1)*50+'%':''}"></div><div class="fg-field-top"><div class="fg-mission"><h2 class="fg-display">${tip.title}</h2><p>${tip.instruction}</p></div><div class="fg-timer" aria-label="남은 현장 시간"><small>남은 시간</small><span data-timer>30<small>초</small></span></div></div><div class="fg-weather" data-weather>${a.weather}</div><div class="fg-game-counter"><span data-hits>0개 해결</span><b data-combo>준비!</b></div><div class="fg-arena" aria-label="${a.name} 현장 조작 구역"><div class="fg-arena-slots">${E.LOCATIONS[s.season].map(([x,y],i)=>`<button class="fg-location" data-location="${i}" style="--x:${x}%;--y:${y}%" aria-label="${i+1}번 위치" disabled></button>`).join('')}</div><div class="fg-effect-layer" aria-live="off"></div>${p.ability==='움직이는 눈'?'<button class="fg-patrol" data-patrol="drone" aria-label="순찰 드론, 끌거나 방향키로 이동"><span class="fg-patrol-range"></span><span class="fg-patrol-body">✥</span><small>드론</small></button>':''}${s.season===3?'<button class="fg-visit-van" data-patrol="van" aria-label="방문 차량, 끌거나 방향키로 이동"><span class="fg-van-body">안부</span><small>끌어서 이동</small></button>':''}</div><div class="fg-field-bottom"><div class="fg-product-chip">${sprite(p.sprite)}<div><b>${p.name}</b><small>${p.ability} · ${'★'.repeat(p.stars)}</small></div></div><div class="fg-field-speech">${img('dari','','달이')}<span>${tip.detail}</span></div></div><div class="fg-time-track"><div class="fg-time-fill"></div></div><div class="fg-field-ready"><div class="fg-ready-box"><span class="fg-pill green">${a.name} 현장 · ${round?'이어서 도전':'30초'}</span><div class="fg-ready-illustration">${s.season===0?'☁':s.season===1?'▰':s.season===2?'🚦':'⌂'}</div><h2 class="fg-display">${tip.title}</h2><p>${tip.instruction}<br>${tip.detail}</p><div class="fg-ability-note">${p.fraud?'약속한 자동 기능이 작동하지 않아요. 직접 대응해야 해요!':p.ability==='미리 보기'?'예고 표시로 먼저 대비할 수 있어요.':p.ability==='자동 처리'?'일부 위험은 선택한 기술이 자동으로 해결해요.':p.ability==='움직이는 눈'?'드론을 끌거나 방향키로 옮겨요. 드론 주변 위험은 자동으로 해결돼요.':'검증된 제품은 대응 시간이 조금 더 넉넉해요.'}${s.scale==='large'?'<br>넉넉하게 도입해서 대응 시간도 늘어났어요.':''}</div><small>숫자키 1–${E.LOCATIONS[s.season].length} · Esc로 멈추기</small><button class="fg-btn fg-primary" data-action="play">${round?'이어서 지키기':'준비됐어요!'}</button></div></div><span class="fg-sr" data-game-announcement aria-live="polite"></span></section>`;
}
function startRound(){
 if(playing)return;if(!round)round=E.create({season:s.season,product:current(),scale:s.scale,seed:(s.seed+s.season*104729)>>>0});
 if(round.done){finishRound();return;}root.querySelector('.fg-field-ready').hidden=true;runField();persist();
}
function runField(){playing=true;paused=false;lastFrame=performance.now();cancelAnimationFrame(timer);timer=requestAnimationFrame(tick);}
function tick(now){
 if(!playing||!round||s.view!=='field')return;
 const currentTime=performance.now(),dt=Math.max(0,Math.min(.2,(currentTime-lastFrame)/1000));lastFrame=currentTime;
 E.update(round,dt);drawField();if(round.elapsed-lastCheckpoint>=1){lastCheckpoint=round.elapsed;persist();}
 if(round.done){finishRound();return;}timer=requestAnimationFrame(tick);
}
function hit(id){
 if(!playing||paused||!round)return;const result=E.action(round,id);
 if(result.kind==='warning'||result.kind==='dispatch')toast(result.text);
 if(result.kind==='hit')beep(490+Math.min(8,round.combo)*65);if(result.kind==='false'||result.kind==='early')beep(170,.15);
 drawField();
}
function drawField(){
 if(s.view!=='field')return;const arena=root.querySelector('.fg-arena');if(!arena)return;
 const r=round,events=r?.events||[],a=FIELD_TIPS[s.season];
 arena.querySelectorAll('[data-location]').forEach(button=>{
  const slot=+button.dataset.location,e=events.find(e=>e.slot===slot),fx=r?.effects.filter(x=>x.slot===slot).at(-1),warning=e&&e.age<e.warning,ratio=e?E.progress(e):0;
  button.disabled=!e||!playing||warning;button.dataset.event=e?.id??'';button.dataset.phase=warning?'warning':e?'active':'idle';button.dataset.fake=e?.fake?'true':'false';button.dataset.progress=ratio.toFixed(3);
  button.className='fg-location '+(e?'has-event ':'')+(e?.fake?'is-fake ':'')+(warning?'is-warning ':'')+(ratio>.74?'is-urgent ':'')+(fx?'fx-'+fx.kind:'');
  button.style.setProperty('--remaining',(1-ratio)*100+'%');button.style.setProperty('--phase',ratio);if(e&&s.season===0)button.style.setProperty('--x',e.x+'%');
  button.setAttribute('aria-label',`${slot+1}번 · ${warning?'곧 위험':e?(e.fake?a.fake:a.good):s.season===3?'평온한 집':'대기 중'}${e?' · '+a.action:''}`);
  const status=warning?'곧!':fx?.kind==='hit'?'지켰어요!':e?(e.fake?a.fake:ratio>.78?'급해요!':a.good):'안전해요';
  const signature=[s.season,e?.id,warning,ratio>.78,s.season===2&&ratio<.23,fx?.kind].join('|');
  if(button.dataset.art!==signature){button.dataset.art=signature;
  if(s.season===0){button.innerHTML=e?`<span class="fg-action-ring"><span class="fg-smoke-shape ${e.fake?'sweet-potato':''}"><i></i><i></i><i></i>${e.fake?'<b>🍠</b>':'<b>!</b>'}</span></span><span class="fg-location-label"><kbd>${slot+1}</kbd> ${status}</span>`:fx?.kind==='miss'?'<span class="fg-spread-fire">🔥</span>':'';}
  else if(s.season===1){button.innerHTML=`<span class="fg-station-name">${slot+1}번 지하차도</span><span class="fg-road-scene"><span class="fg-tunnel"></span><span class="fg-road-water ${e?.fake?'fountain':''}"></span><span class="fg-approach-car">${e?.fake?'⛲':'▰'}</span><span class="fg-barrier"><i></i></span><span class="fg-water-gauge"><i></i></span></span><span class="fg-station-status">${status}</span><span class="fg-action-key"><kbd>${slot+1}</kbd> 차단기 내리기</span>`;}
  else if(s.season===2){button.innerHTML=`<span class="fg-station-name">${slot+1}번 통학로</span><span class="fg-crossing-scene"><span class="fg-zebra"></span><span class="fg-crossing-car">▰</span><span class="fg-kids">${e?.fake?'🐦 🐦':'<i></i><i></i>'}</span><span class="fg-traffic-lamp"><i></i><b></b></span></span><span class="fg-timing-meter"><span class="fg-timing-zone"></span><i></i></span><span class="fg-station-status">${e&&!e.fake&&ratio<.23&&!warning?'조금만 기다려요':status}</span><span class="fg-action-key"><kbd>${slot+1}</kbd> 보행 신호</span>`;}
  else{button.innerHTML=`<span class="fg-house-roof"></span><span class="fg-house-body"><i class="fg-house-window"></i><b class="fg-house-door"></b>${e?`<span class="fg-house-signal">${warning?'곧':e.fake?'Zzz':'!'}</span>`:''}</span><span class="fg-house-label"><kbd>${slot+1}</kbd> ${e?status:'어르신 댁'}</span>`;}
  }
 });
 const patrol=arena.querySelector('[data-patrol="drone"]');if(patrol&&r){patrol.style.left=r.drone.x+'%';patrol.style.top=r.drone.y+'%';patrol.style.setProperty('--range',(15+r.product.stars*2)+'cqw');}
 const van=arena.querySelector('[data-patrol="van"]');if(van){van.style.left=(r?.van.x??50)+'%';van.style.top=(r?.van.y??94)+'%';van.classList.toggle('travelling',r?.van.target!=null);}
 const time=r?.time??30;root.querySelector('[data-timer]').innerHTML=Math.ceil(time)+'<small>초</small>';root.querySelector('.fg-timer').classList.toggle('urgent',time<=5);root.querySelector('.fg-time-fill').style.width=time/30*100+'%';
 root.querySelector('[data-hits]').textContent=(r?.hits??0)+'개 해결';root.querySelector('[data-combo]').textContent=r?(r.combo>=3?r.combo+' COMBO!':r.score+'점'):'준비!';
 if(r){root.querySelector('[data-weather]').textContent=s.season===0?(r.wind===1?'동쪽 바람 →':'← 서쪽 바람'):s.season===1?(r.weather===2?'폭우가 세졌어요!':'비가 내려요 · 물 높이를 보세요'):s.season===2?'초록 타이밍에 신호를 켜요':'방문차를 보내 안부를 확인해요';
  const layer=arena.querySelector('.fg-effect-layer');layer.innerHTML=r.effects.map(f=>`<span class="fg-action-effect ${f.kind}" style="left:${f.x}%;top:${f.y}%;opacity:${Math.min(1,f.life*2)};transform:translate(-50%,${-35-(1.1-f.life)*28}px)">${f.text}</span>`).join('');
  const latest=r.effects.at(-1);if(latest&&latest.id!==lastEffect){lastEffect=latest.id;root.querySelector('[data-game-announcement]').textContent=latest.text;if(latest.kind==='hit')beep(580+Math.min(7,r.combo)*45,.06);else if(latest.kind==='miss')beep(150,.12);}
 }
}
function bindField(){
 const arena=root.querySelector('.fg-arena');
 arena.querySelectorAll('[data-patrol]').forEach(el=>{
  const move=ev=>{if(!playing||!pointerDragging)return;const rect=arena.getBoundingClientRect(),x=(ev.clientX-rect.left)/rect.width*100,y=(ev.clientY-rect.top)/rect.height*100;if(el.dataset.patrol==='drone')E.moveDrone(round,x,y);else E.moveVan(round,x,y);drawField();};
  el.addEventListener('pointerdown',e=>{if(!playing)return;pointerDragging=true;el.setPointerCapture(e.pointerId);move(e);});
  el.addEventListener('pointermove',move);el.addEventListener('pointerup',()=>{pointerDragging=false;});el.addEventListener('pointercancel',()=>pointerDragging=false);
 });
}
function finishRound(){
 if(!round)return;const old=s.history.find(h=>h.season===s.season);if(old?.result){s.result=old.result;round=null;s.roundState=null;go('result');return;}
 const r=E.summary(round),p=current();s.result=r;s.safety=Math.max(0,Math.min(100,s.safety+r.safetyDelta));s.growth+=r.growth;
 if(!p.old&&!p.fraud){const c=s.companies[p.id]||{name:p.company,sprite:p.sprite,level:0};s.companies[p.id]={...c,level:Math.min(3,c.level+r.growth),lastSeason:s.season};}
 if(old)old.result={...r};s.roundState=null;round=null;lastCheckpoint=0;go('result');
}
function resultData(){return s.result||{hits:0,total:0,missed:0,falseAlarms:0,close:0,maxCombo:0,stars:0,success:false,score:0,growth:0,safetyDelta:0,weakness:'speed'};}
function result(){
 const r=resultData(),p=current(),level=s.companies[p.id]?.level??0,feedback=s.feedback[p.id];
 const feedbackChoices={speed:'대응할 시간이 짧아요',false:['고구마 연기를 헷갈려요','분수대를 헷갈려요','새를 아이로 착각해요','코 고는 소리를 헷갈려요'][s.season],rain:'폭우 때 놓쳐요',night:'밤에 신호를 놓쳐요'};
 const observation=r.falseAlarms?`헛경보에 ${r.falseAlarms}번 출동했어요.`:r.missed?`${['바람을 타는 연기','빠르게 차오른 물','다가오는 아이','멀리 있는 도움 불빛'][s.season]}을 ${r.missed}번 놓쳤어요.`:'침착하게 현장을 살폈어요.';
 return `<section class="fg-simple texture fg-game-result"><div class="fg-topline"><span class="fg-eyebrow">${seasons[s.season].name} 현장 실증 완료</span><span class="fg-corner-logo">첫 손님</span></div><h2 class="fg-display">${r.success?'작은 믿음으로, 오늘을 지켜냈어요!':'이번 경험이, 다음 발명의 힌트가 돼요.'}</h2><div class="fg-result-deltas"><span>국민 안심 ${r.safetyDelta>=0?'+':''}${r.safetyDelta}</span><span>혁신 성장 +${r.growth}</span><b>${r.score.toLocaleString()}점 · 최고 ${r.maxCombo}콤보</b></div><div class="fg-result-grid"><div class="fg-ticket"><div class="fg-result-stars">${'★'.repeat(r.stars)}<span style="color:#d8d0bc">${'☆'.repeat(3-r.stars)}</span></div><div class="fg-stat-row"><span>막아낸 위험</span><strong>${r.hits} / ${r.total}</strong></div><div class="fg-stat-row"><span>악화된 위험</span><strong>${r.missed}</strong></div><div class="fg-stat-row"><span>헛경보 출동</span><strong>${r.falseAlarms}</strong></div><div class="fg-stat-row"><span>아슬아슬 구조 / 기술 도움</span><strong>${r.close} / ${r.auto}</strong></div></div><div class="fg-growth-panel"><span class="fg-pill green">${p.old?'믿음직한 기존 제품':p.fraud?'기술을 다시 확인해요':r.success?'우리 회사가 자랐어요!':'현장에서 찾은 다음 힌트'}</span>${sprite(p.sprite)}<h3 class="fg-display">${p.old?'현장을 지키는, 익숙한 힘':p.fraud?'약속한 AI가 없었어요…':r.success?`${['차고','작은 공장','큰 공장','세계 지사'][level]}로 한 걸음!`:'어디를 고치면 좋을까요?'}</h3>${p.old?'<p>국민 안심은 쌓였어요.<br>혁신 성장은 새 기술의 성공으로 자라요.</p>':p.fraud?'<p>다음에는 실제 시연으로 확인해 보세요.</p>':r.success?`<div class="fg-growth-steps">${['차고','작은 공장','큰 공장','세계 지사'].map((a,i)=>`<span class="${i===level?'active':''}">${a}</span>`).join('')}</div><p>다음엔 성능 +1, 가격 20% 할인으로 돌아올게요!</p>`:`<p>${observation}</p><div class="fg-feedback">${[r.weakness,...Object.keys(feedbackChoices).filter(k=>k!==r.weakness)].slice(0,3).sort().map(k=>`<button data-feedback="${k}" ${feedback?.season===s.season?'disabled':''}>${feedbackChoices[k]}</button>`).join('')}</div>${feedback?.season===s.season?'<small>✓ 현장 피드백을 전달했어요.</small>':''}`}</div></div><div class="fg-comments"><div class="fg-comment"><small>마을 주민</small>${r.success?'“오늘은 한결 마음이 놓이네요.”':'“다음에는 함께 더 잘해봐요.”'}</div><div class="fg-comment"><small>현장 직원</small>${r.falseAlarms?['“출동했다가 군고구마도 받아 왔어요.”','“분수대 물놀이까지 확인하고 왔네요.”','“비둘기들에게 교통안전 교육을 했어요.”','“코 고는 소리가 아주 우렁찼어요.”'][s.season]:'“팀장님, 현장 지원 고맙습니다!”'}</div><div class="fg-comment"><small>${p.who}</small>${p.old?'“늘 하던 대로, 우직하게 지켰어요.”':p.fraud?'“100%라고 했던 건… 마음이었어요!”':'“첫 사용 기록이 생겼어요. 큰 힘이 돼요!”'}</div></div><div class="fg-bottom-action"><button class="fg-btn fg-primary" data-go="${s.season===3?'award':'street'}">${s.season===3?'연말 시상식으로':'우리 혁신 거리 구경하기'}</button></div></section>`;
}
function applyFeedback(kind,button){
 const p=current();if(p.old||p.fraud||s.feedback[p.id]?.season===s.season)return;
 const correct=kind===s.result?.weakness;s.feedback[p.id]={kind,season:s.season,correct};
 const c=s.companies[p.id]||{name:p.company,sprite:p.sprite,level:0};s.companies[p.id]={...c,lastSeason:s.season};
 render();toast(correct?'현장에서 본 문제를 정확히 짚었어요! 성능 +1로 다시 도전해요.':'의견을 전달했어요. 실제로 놓친 상황도 함께 살펴보면 더 좋아져요.');persist();
}
function companyList(){return Object.entries(s.companies).map(([id,v])=>({id,...v}));}
function street(){
 const list=companyList(),last=list.find(p=>p.id===current().id)||list.at(-1);
 return `<section class="fg-street"><span class="fg-eyebrow">우리가 함께 키운 곳</span><h2 class="fg-display">처음엔, 작은 차고 하나였어요.</h2><p>${list.length?'당신의 첫 주문이 이 거리의 내일이 됩니다.':'다음 계절에는 새 기술의 첫 손님이 되어볼까요?'}</p><div class="fg-street-sky" aria-hidden="true">☁ ☁</div><div class="fg-street-lots">${[0,1,2,3].map(i=>list[i]?`<div class="fg-lot level-${list[i].level}"><span class="fg-lot-level">${['차고','작은 공장','큰 공장','세계 지사'][list[i].level]} · LV.${list[i].level+1}</span><div class="fg-building" style="height:${110+list[i].level*22}px"><span class="fg-building-sign">${list[i].name}</span><i class="fg-building-window"></i><i class="fg-building-window"></i>${list[i].level===3?'<span class="fg-global-flag">⚑</span>':''}</div></div>`:`<div class="fg-lot empty"><b>＋</b>다음 첫 손님 자리</div>`).join('')}</div><div class="fg-street-chat">${mascots('',true)}<div class="fg-chat-bubble">${last?`<b>${last.name}</b><br>“${last.level?'첫 주문 덕분에 한 뼘 자랐어요!':'첫 경험을 바탕으로 다시 도전할게요!'}<br>다음엔 20% 더 싸게 찾아갈게요.”`:'새 기술이 첫 손님을 기다리고 있어요.<br>작게 시작해도 괜찮아요, 팀장님.'}</div></div><button class="fg-btn fg-primary fg-street-next" data-action="next-season">${seasons[s.season+1].name} 현장으로</button></section>`;
}
function report(){
 const safety=s.safety,growth=s.growth,reappointed=safety>=75&&growth>=4,allSafe=s.history.every(h=>h.old),innov=s.history.filter(h=>!h.old&&!h.fraud).length;
 const feedback=Object.values(s.feedback).filter(x=>x.correct).length;
 const story=allSafe?['검증된 제품만 선택했어요 → 새 기술에는 첫 기회가 없었어요.',safety>=75?'현장은 지켰지만, 혁신 성장은 아직 부족해요.':'익숙한 제품도 현장에서는 꼼꼼하게 살펴야 해요.','다음엔 작은 규모로 새 기술을 믿어보면 어떨까요?']:[`새 기술의 첫 손님이 된 ${innov}번 → 사용 실적이 쌓였어요.`,growth>=4?'믿어준 기업이 성장했어요 → 더 좋고 싼 제품으로 돌아왔어요.':'새 기술에 기회를 줬어요 → 다음에는 현장 성공을 더 쌓아봐요.',s.frauds?'시연으로 확인했어요 → 무늬만 AI의 과장을 밝혔어요.':feedback?`정확한 피드백 ${feedback}번 → 기술 개선의 단서를 만들었어요.`:safety>=75?'생활 속 위험을 막았어요 → 주민들의 안심이 높아졌어요.':'현장에 남은 위험 → 다음에는 대응 순서도 살펴봐요.'];
 return `<section class="fg-simple texture fg-game-report"><div class="fg-topline"><span class="fg-eyebrow">2026 · 올해의 첫 손님 리포트</span><span class="fg-corner-logo">첫 손님</span></div><h2 class="fg-display">${reappointed?'내년에도 혁신조달팀을 맡아주세요!':'이번 경험을, 다음 도전의 씨앗으로.'}</h2><span class="fg-report-criteria">재임명 기준 · 국민 안심 75 이상 + 혁신 성장 4 이상</span><div class="fg-report-grid"><div class="fg-badge-card"><span class="fg-reappointment">${reappointed?'재임명되었어요!':'다시 도전해요'}</span><div class="fg-eyebrow">당신은 이런 팀장님</div><div class="fg-medal">${s.frauds?'⌕':'✦'}</div><h3 class="fg-display">${badge()}</h3><p>${allSafe?'익숙한 선택에서 안정감을 찾는 사람.':'가능성을 알아보고,<br>첫 번째 기회를 만드는 사람.'}</p>${mascots()}</div><div class="fg-report-paper"><h3 class="fg-display">내 선택이 바꾼 것들</h3>${[['국민 안심',safety,100],['혁신 성장',growth,8],['남은 예산',s.budget,1400]].map(([label,value,max])=>`<div class="fg-meter"><div><span>${label}</span><b>${value}${label==='국민 안심'?' / 100':label==='남은 예산'?' 코인':''}</b></div><div class="fg-meter-track"><span style="width:${Math.min(100,value/max*100)}%"></span></div></div>`).join('')}<div class="fg-report-lines">${story.map(a=>`<p>❧ ${a}</p>`).join('')}</div></div></div><div class="fg-year-record">${s.history.map(h=>`<div><b>${seasons[h.season].symbol} ${seasons[h.season].name}</b><span>${h.name}</span><small>${'★'.repeat(h.result?.stars??0)||'다음 도전'} · ${h.result?.hits??0}/${h.result?.total??0} 해결</small></div>`).join('')}</div><div class="fg-row fg-report-actions"><button class="fg-btn fg-primary" data-go="facts">게임 밖의 진짜 이야기</button><button class="fg-btn" data-go="share">결과 카드 저장</button><button class="fg-plain" data-action="home">처음 화면</button></div></section>`;
}
