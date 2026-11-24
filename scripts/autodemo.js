/* 「별일 없는 하루」 녹화용 자동 시연 (약 1분)
   - 제출 게임 파일 뒤에 붙여서 씀. 게임 안의 함수(S, startIntro, nextDay, EVENTS, showEnding …)를 그대로 불러 실제 화면·소리로 진행.
   - 직접 녹화할 때: 파일을 열고 녹화를 켠 뒤 [자동 시연 시작] 버튼을 누르면 됨. */
(function(){
  const W = ms => new Promise(r => setTimeout(r, ms));
  const $$ = s => document.querySelector(s);
  EVENTS[2] = () => {};            // 시연 흐름을 끊는 안내 토스트는 생략
  window.__recVol = 3.5; window.__recLim = -2.5;   // 녹화본만 전체 소리를 키움 (리미터가 찢어짐을 막음, 게임 본편은 그대로)
  TUT.done = true;                  // 튜토리얼 대신 손가락이 직접 보여 줌

  /* 손가락 커서 */
  const cur = document.createElement('div');
  cur.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;pointer-events:none;display:none;filter:drop-shadow(0 6px 0 rgba(74,44,44,.35))';
  cur.innerHTML = '<svg id="dcSvg" width="78" height="78" viewBox="0 0 48 48" style="transform-origin:29% 8%"><path d="M18 6a4 4 0 0 1 8 0v14l9 2.4a5 5 0 0 1 3.6 5.8L36.5 40a4 4 0 0 1-4 3.3H21a5 5 0 0 1-4-2l-8-10.6a3.6 3.6 0 0 1 5.3-4.8L18 29z" fill="#fff" stroke="#4a2c2c" stroke-width="3" stroke-linejoin="round"/><path d="M26 22v8M31 23.4v7" stroke="#4a2c2c" stroke-width="2.4" stroke-linecap="round"/></svg>';
  document.body.appendChild(cur);
  let cx = 0, cy = 0;
  const TIP = [22 * 78 / 48, 3 * 78 / 48];
  const setCur = (x, y) => { cx = x; cy = y; cur.style.transform = `translate(${x - TIP[0]}px,${y - TIP[1]}px)`; };
  const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  const moveTo = (x, y, ms = 600, onStep) => new Promise(res => {
    const sx = cx, sy = cy, t0 = performance.now();
    (function step(){ const k = Math.min(1, (performance.now() - t0) / ms), e = ease(k); setCur(sx + (x - sx) * e, sy + (y - sy) * e); if(onStep) onStep(cx, cy); k < 1 ? requestAnimationFrame(step) : res(); })();
  });
  const mid = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const tap = async () => { $$('#dcSvg').animate([{ transform:'scale(1)' }, { transform:'scale(.82)' }, { transform:'scale(1)' }], { duration:260 }); await W(140); };
  async function clickEl(sel, ms = 650){ const el = $$(sel); const [x, y] = mid(el); await moveTo(x, y, ms); await tap(); el.click(); await W(120); }
  const pe = (type, x, y, target) => (target || window).dispatchEvent(new PointerEvent(type, { clientX:x, clientY:y, bubbles:true, cancelable:true, pointerId:1, isPrimary:true, pointerType:'mouse', buttons: type === 'pointerup' ? 0 : 1 }));
  async function drag(id, r, c, ms = 850){
    const el = $$(`#tray .crate[data-id="${id}"]`); if(!el) return;
    const [x0, y0] = mid(el);
    await moveTo(x0, y0, 420); await tap();
    pe('pointerdown', x0, y0, el);
    const T = TYPES[S.crates.find(k => k.id === id).type], g = $$('#grid').getBoundingClientRect();
    const tx = g.left + (c * S.cell + T.w * S.cell / 2) * K, ty = g.top + (r * S.cell + (T.h * S.cell - 4) / 2) * K;
    await moveTo(tx, ty, ms, (x, y) => pe('pointermove', x, y));
    await W(90);
    pe('pointerup', tx, ty);
    await W(260);
  }
  const vnGo = i => { VN.i = i; showLine(); };
  const shelf = (id, type, r, c) => ({ id, type, tray:false, r, c, age:0, hard:false });

  async function run(){
    const b = $$('#demoStart'); if(b) b.remove();
    while($$('#loading')) await W(100);
    cur.style.display = 'block'; setCur(innerWidth * .78, innerHeight * .9);
    await W(1500);
    /* 1. 타이틀 → 출근 */
    await clickEl('#startBtn', 900);
    /* 2. 상황 설명: 인사 → 요소 카드 → '없으면?' 공개 → 목표 */
    await moveTo(innerWidth * .86, innerHeight * .9, 700);
    await W(1400);
    await tap(); vnGo(4); await W(2300);
    await tap(); vnGo(5); await W(2600);
    await tap(); vnGo(12); await W(2400);
    vnGo(14); await W(1200);
    await clickEl('#vnBtns button', 600);
    await W(1500);
    /* 3. 첫날: 상자를 끌어 선반에 올리기 → 주문 → 하루 보내기 */
    await drag(3, 0, 0, 900);
    await drag(1, 0, 1, 900);
    await drag(6, 2, 2, 900);
    await drag(4, 1, 0, 520);
    await drag(5, 2, 0, 520);
    await drag(2, 0, 4, 520);
    await W(500);
    await clickEl('.oc[data-t="copper"]', 700);
    await W(1100);
    await clickEl('#nextBtn', 700);
    // 밤 → 아침 DAY 2 → 달이가 예보를 크게 알려 줌
    for(let i = 0; i < 100 && !$$('#fcOv').classList.contains('show'); i++) await W(100);
    await W(2300);
    await clickEl('#fcOk', 650);
    await W(400);
    /* 4. 4일째: 동쪽 바닷길 봉쇄 → 새 공급처 찾기 */
    S.day = 4; S.lastBad = []; S.budget = 96;
    S.history = [{ urea:true, copper:true, med:true }, { urea:true, copper:true, med:true }, { urea:true, copper:true, med:true }];
    S.crates = [shelf(101,'urea',0,0), shelf(102,'urea',1,0), shelf(103,'med',0,1), shelf(104,'copper',2,2), shelf(105,'urea',2,0)];
    S.orders = [];
    render();
    const tk = $$('#truck'); tk.classList.remove('arrive'); void tk.offsetWidth; tk.classList.add('arrive');
    dayBanner(); await W(1700);
    EVENTS[4](); await W(2400);
    await clickEl('#mChoices .choice', 800);
    await W(1500);
    /* 5. 마지막 밤 → 결과(별점) */
    S.day = 8; S.lastBad = []; S.trust = 1; S.newSupplier = true; S.noticed = 0; S.budget = 57;
    S.history = Array.from({ length:7 }, () => ({ urea:true, copper:true, med:true }));
    S.crates = [shelf(201,'urea',0,0), shelf(202,'urea',1,0), shelf(203,'med',0,1), shelf(204,'copper',2,2)];
    render(); dayBanner(); await W(1900);
    await clickEl('#nextBtn', 700);
    await W(4300);                       // 밤 → 결과 화면, 별이 하나씩
    await W(2000);
    await clickEl('#eStory', 800);
    /* 6. 진짜 조달청 이야기 */
    await moveTo(innerWidth * .9, innerHeight * .95, 600);
    await W(1500);
    vnGo(1); await W(2500);
    vnGo(7); await W(3100);
    vnGo(11); await W(3500);
    cur.style.display = 'none';
    await W(200);
  }
  window.__runDemo = run;
  /* 직접 녹화용 시작 버튼 */
  const btn = document.createElement('button');
  btn.id = 'demoStart'; btn.className = 'jb green';
  btn.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99998;height:64px;padding:0 34px;font-size:26px';
  btn.innerHTML = '<span class="ol">▶ 자동 시연 시작</span>';
  btn.onclick = () => run();
  document.body.appendChild(btn);
})();
