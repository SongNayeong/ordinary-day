// 게임에 쓰인 글자만 담은 글꼴(woff2)을 Google Fonts에서 받아 outDir에 저장 (인터넷 필요)
// 사용: node tools/fontsub.js demo/ordinary-day.html demo/fonts   → 그다음 node tools/build-ordinary.js
const fs = require('fs');
const path = require('path');
const [, , srcHtml, outDir] = process.argv;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const s = fs.readFileSync(srcHtml, 'utf8').replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/g, '');
const set = new Set();
for (let c = 32; c < 127; c++) set.add(String.fromCharCode(c));
for (const ch of s) { const cp = ch.codePointAt(0); if (cp > 127 && !(cp >= 0x1F000) && !(cp >= 0xFE00 && cp <= 0xFE0F) && cp !== 0x200D) set.add(ch); }
const chars = [...set].sort().join('');
fs.writeFileSync(path.join(outDir, 'chars.txt'), chars);
console.log('글자 수', [...chars].length);
const reqs = [['jua', 'Jua'], ['noto-kr-500', 'Noto Sans KR:wght@500'], ['noto-kr-700', 'Noto Sans KR:wght@700'], ['noto-kr-900', 'Noto Sans KR:wght@900']];
(async () => {
  for (const [name, fam] of reqs) {
    const url = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(fam).replace(/%20/g, '+') + '&text=' + encodeURIComponent(chars);
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!r.ok) throw new Error(name + ' css ' + r.status + ' (url length ' + url.length + ')');
    const css = await r.text();
    const faces = [...css.matchAll(/@font-face\s*{[\s\S]*?}/g)].map(m => m[0]);
    if (faces.length !== 1) throw new Error(name + ': face 수 ' + faces.length);
    const src = faces[0].match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)\s*format\('woff2'\)/);
    if (!src) throw new Error(name + ': woff2 주소 없음');
    const fr = await fetch(src[1], { headers: { 'User-Agent': UA } });
    const buf = Buffer.from(await fr.arrayBuffer());
    if (buf.slice(0, 4).toString('latin1') !== 'wOF2') throw new Error(name + ': woff2 아님');
    fs.writeFileSync(path.join(outDir, name + '.woff2'), buf);
    console.log(name, Math.round(buf.length / 1024) + 'KB', 'weight', (faces[0].match(/font-weight:\s*(\d+)/) || [])[1]);
  }
})().catch(e => { console.error('실패', e.message); process.exit(1); });
