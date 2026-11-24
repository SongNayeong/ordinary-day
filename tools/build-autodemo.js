// 녹화용 자동 시연 사본 만들기 (제출 파일과 별개)
// 사용: node tools/build-autodemo.js  →  제출용/녹화용/별일없는하루_자동시연.html
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const game = fs.readFileSync(path.join(root, '제출용', '별일없는하루', '별일없는하루.html'), 'utf8');
const demo = fs.readFileSync(path.join(__dirname, 'autodemo.js'), 'utf8');
if (/<\/script/i.test(demo)) throw new Error('autodemo.js 안에 </script 가 있어요');
const i = game.lastIndexOf('</body>');
if (i < 0) throw new Error('</body> 없음');
const out = game.slice(0, i) + '<script>\n' + demo + '\n</script>\n' + game.slice(i);
const dir = path.join(root, '제출용', '녹화용');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, '별일없는하루_자동시연.html');
fs.writeFileSync(file, out);
console.log('완료', file);
