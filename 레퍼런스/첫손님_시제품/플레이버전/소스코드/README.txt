첫 손님 게임 소스

Node.js로 수정·빌드할 수 있는 정적 브라우저 게임입니다. 별도 패키지 설치는 필요하지 않습니다.

node build.cjs            게임 파일 생성 → dist/첫손님_게임.html
node --test tests/engine.test.cjs    현장 규칙 테스트 11개
node serve.cjs            개발 미리보기 → http://127.0.0.1:5190

주요 파일
src/engine.js: 네 계절의 현장 규칙, 점수, 제품 능력, 이동 및 시간
src/state.js: 게임 상태, 브라우저 저장·복구, 계절별 조작 설명
src/game-functions.js: 화면, 선택·구매, 조사, 기업 성장, 결과와 리포트
src/events.js: 마우스·터치·키보드 이벤트와 일시정지
src/game.css: 실제 게임 화면과 네 계절 현장의 스타일
src/design-base.js / design-base.css: 확정한 디자인 기반
src/assets.json: 공식 캐릭터와 생성 배경의 내장 그림 데이터

검증: 규칙 테스트 11개 통과. Edge에서 네 계절 완주, 발표 후 선택 해제,
AI 분석 오류 1/4, 중간 저장·복구, 가짜 AI 적발, 예산 제한,
피드백에 따른 재도전, 재임명 조건, PNG 저장, 320–1280px 배치를 확인했습니다.
