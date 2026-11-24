root.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;beep(540,.035);
 if(b.dataset.go){go(b.dataset.go);return;}
 if(b.dataset.select!==undefined){if(!presentationComplete())return;s.selected=+b.dataset.select;s.presenter=s.selected;s.dialogueFrom='presenter';render();persist();return;}
 if(b.dataset.scale){s.scale=b.dataset.scale;render();persist();return;}
 if(b.dataset.research){research(b.dataset.research);return;}
 if(b.dataset.feedback){applyFeedback(b.dataset.feedback,b);return;}
 if(b.dataset.location!==undefined){if(!pointerDragging&&b.dataset.event)hit(b.dataset.event);return;}
 if(b.dataset.fact!==undefined){s.fact=+b.dataset.fact;render();persist();return;}
 switch(b.dataset.action){
  case 'new-game':if(savedGame?.started){modal('<h2 class="fg-display">새로운 1년을 시작할까요?</h2><p>현재 이어하기 기록이 새 게임으로 바뀝니다.</p><div class="fg-row" style="justify-content:center"><button class="fg-btn" data-action="close-modal">돌아가기</button><button class="fg-btn fg-primary" data-action="confirm-new">새로 시작하기</button></div>');}else startNew();break;
  case 'confirm-new':startNew();break;
  case 'continue':resumeGame();break;
  case 'begin':if(!s.started){startNew();}go('season');break;
  case 'show-toggle':togglePresentation();break;
  case 'pause':pause();break;
  case 'close-modal':closeModal();break;
  case 'home':persist();go('title');break;
  case 'sound':s.sound=!s.sound;beep(660);b.textContent=s.sound?'소리 켜짐 ♪':'소리 꺼짐';if(savedGame)savedGame.sound=s.sound;persist();break;
  case 'commit':purchase();break;
  case 'play':startRound();break;
  case 'next-season':nextSeason();break;
  case 'evidence':overlay.querySelector('[data-evidence]').hidden=false;b.hidden=true;break;
  case 'correct-ai':if(s.aiPending?.wrong){s.aiCorrections++;s.tip='찾았다! 시험하지 않은 상황까지 보장한 AI의 추측을 바로잡았어요.';s.aiPending=null;closeModal();render();toast(s.tip);persist();}break;
  case 'confirm-ai':s.tip='이번 분석은 자료의 조건과 한계를 잘 설명했어요.';s.aiPending=null;closeModal();render();toast(s.tip);persist();break;
  case 'wrong-ai':toast('시험 기록과 AI의 말을 다시 비교해 보세요. 자료에 없는 보장이 있나요?');break;
  case 'catch':if(!s.caught){s.frauds++;s.safety=Math.min(100,s.safety+5);s.caught=true;}s.selected=null;s.tip='무늬만 AI의 과장을 밝혔어요. 다른 제품을 살펴봐요!';closeModal();render();toast('기술을 확인했어요! 국민 안심 +5');persist();break;
  case 'next-fact':if(s.fact<facts.length-1){s.fact++;render();persist();}else go('share');break;
  case 'save-image':saveImage();break;
 }
});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){e.preventDefault();if(!overlay.hidden)closeModal();else if(s.view!=='title')pause();return;}
 if(e.key==='Tab'&&!overlay.hidden){const focus=[...overlay.querySelectorAll('button,a,input,select')].filter(x=>!x.disabled&&x.getClientRects().length);const first=focus[0],last=focus.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}return;}
 if(!playing||!overlay.hidden||s.view!=='field')return;
 if(/^[1-8]$/.test(e.key)){e.preventDefault();const event=round.events.find(h=>h.slot===Number(e.key)-1);if(event)hit(event.id);}
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const useDrone=current().ability==='움직이는 눈',pos=useDrone?round.drone:round.van;if(!useDrone&&s.season!==3)return;const dx=e.key==='ArrowLeft'?-4:e.key==='ArrowRight'?4:0,dy=e.key==='ArrowUp'?-4:e.key==='ArrowDown'?4:0;(useDrone?E.moveDrone:E.moveVan)(round,pos.x+dx,pos.y+dy);drawField();}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(playing||showRunning)pause();persist();}});
window.addEventListener('pagehide',()=>persist());
