// 「별일 없는 하루」 제출본 만들기
// demo/ordinary-day.html 의 그림을 파일 안에 넣어(data URI) 한 파일로 만들고, 점검용 코드를 뺀다.
// 사용: node tools/build-ordinary.js  →  제출용/별일없는하루/별일없는하루.html
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const src = path.join(root, 'demo', 'ordinary-day.html');
const assets = path.join(root, 'game', 'assets');
const outDir = path.join(root, '제출용', '별일없는하루');

let html = fs.readFileSync(src, 'utf8');
const used = new Set();
html = html.replace(/\.\.\/game\/assets\/([A-Za-z0-9_-]+\.webp)/g, (m, f) => {
  used.add(f);
  return 'data:image/webp;base64,' + fs.readFileSync(path.join(assets, f)).toString('base64');
});
// 글꼴도 파일 안에 넣기 (인터넷 없이도 같은 모습)
const fontDir = path.join(root, 'demo', 'fonts');
html = html.replace(/url\(fonts\/([a-z0-9-]+\.woff2)\)/g, (m, f) => {
  used.add(f);
  return 'url(data:font/woff2;base64,' + fs.readFileSync(path.join(fontDir, f)).toString('base64') + ')';
});
if (/fonts\.googleapis|fonts\.gstatic|url\(fonts\//.test(html)) throw new Error('바깥 글꼴 주소가 남았어요');
// 글꼴에 없는 글자가 새로 쓰였는지 확인 — 있으면: node tools/fontsub.js demo/ordinary-day.html demo/fonts
{
  const have = new Set(fs.readFileSync(path.join(fontDir, 'chars.txt'), 'utf8'));
  const text = fs.readFileSync(src, 'utf8').replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g, '');
  const missing = [...new Set(text)].filter(ch => { const cp = ch.codePointAt(0); return cp > 127 && cp < 0x1F000 && !(cp >= 0xFE00 && cp <= 0xFE0F) && cp !== 0x200D && !have.has(ch); });
  if (missing.length) throw new Error('글꼴에 없는 글자: ' + missing.join(''));
}
// 점검용 훅 제거
html = html.replace(/\n\/\* 점검용 \*\/\nwindow\.__od = [^\n]*\n/, '\n');

if (/\.\.\/game\/assets\//.test(html)) throw new Error('data URI로 바뀌지 않은 그림 경로가 남았어요');
if (/window\.__od/.test(html)) throw new Error('점검용 코드가 남았어요');

fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, '별일없는하루.html');
fs.writeFileSync(out, html);
console.log('그림', [...used].join(', '));
console.log('완료', out, Math.round(Buffer.byteLength(html) / 1024) + 'KB');
