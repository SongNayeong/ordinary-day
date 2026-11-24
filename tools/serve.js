// 데모 미리보기용 아주 작은 정적 파일 서버 (외부 패키지 없음)
// 사용: node tools/serve.js <폴더> <포트> [저장폴더]
//  - 저장폴더를 주면 POST /save?name=파일.png 로 받은 PNG를 그 폴더에 저장 (이미지 추출 도구용, 127.0.0.1 전용)
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || '.');
const port = Number(process.argv[3]) || 5178;
const saveDir = process.argv[4] ? path.resolve(process.argv[4]) : null;
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.pdf': 'application/pdf',
};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'POST' && url.pathname === '/save' && saveDir) {
    const name = url.searchParams.get('name') || '';
    if (!/^[a-z0-9_]+\.png$/.test(name)) { res.writeHead(400); return res.end('bad name'); }
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      fs.mkdirSync(saveDir, { recursive: true });
      fs.writeFileSync(path.join(saveDir, name), Buffer.concat(chunks));
      res.writeHead(200); res.end('saved ' + name);
    });
    return;
  }
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.resolve(path.join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} on http://localhost:${port}` + (saveDir ? ` (save -> ${saveDir})` : '')));
