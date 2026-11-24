const fs=require('fs'),path=require('path'),vm=require('vm');
const dir=__dirname,read=file=>fs.readFileSync(path.join(dir,'src',file),'utf8');
let code=read('design-base.js');
const first=code.indexOf('const initial='),last=code.indexOf('function icon(',first);if(first<0||last<0)throw Error('Missing source state');
code=code.slice(0,first)+read('state.js')+'\n'+code.slice(last);
const eventsStart=code.indexOf("root.addEventListener('click'"),eventsEnd=code.indexOf('function startRound(',eventsStart);if(eventsStart<0||eventsEnd<0)throw Error('Missing preview controls');
code=code.slice(0,eventsStart)+code.slice(eventsEnd);
code=code.replace(/^document\.addEventListener\('visibilitychange'.*\n/gm,'').replace(/^const positions=.*\n/gm,'');
function replaceFunction(name,replacement){
 const re=new RegExp('^(?:async )?function '+name+'\\(','m'),match=re.exec(code);
 if(!match)return false;
 const tail=code.slice(match.index+match[0].length);
 const next=/^(?:(?:async )?function |const |let |root\.|document\.|window\.|render\(\);|if\(globalThis)/m.exec(tail);
 if(!next)throw Error('Cannot find function end: '+name);
 const end=match.index+match[0].length+next.index;
 code=code.slice(0,match.index)+(replacement?replacement+'\n':'')+code.slice(end);return true;
}
for(const name of ['preview','spawn','drawHazard','removeHazard','floatAt','bindDrone'])replaceFunction(name,'');
const funcs=read('game-functions.js'),matches=[...funcs.matchAll(/^(?:async )?function (\w+)\(/gm)];let additions='';
for(let i=0;i<matches.length;i++){const m=matches[i],body=funcs.slice(m.index,matches[i+1]?.index??funcs.length).trim();if(!replaceFunction(m[1],body))additions+=body+'\n';}
const bootstrap=code.lastIndexOf('render();\nif(globalThis.Tweak)');if(bootstrap<0)throw Error('Missing final render');
code=code.slice(0,bootstrap)+additions+'\n'+read('events.js')+'\nrender();\n})();';
code=code.replaceAll('s.selected===null||cost()>s.budget', '!canCommit()');
code=code.replace('차근차근, 성장 +1',"${s.selected!==null&&current().old?'필요한 만큼 도입':'차근차근, 성장 +1'}");
code=code.replace('비용 ×2 · 성공하면 성장 +2',"${s.selected!==null&&current().old?'비용 ×2 · 대응 시간 늘림':'비용 ×2 · 성공하면 성장 +2'}");
code=code.replace("const dataUrl=canvas.toDataURL('image/png');modal(","const dataUrl=canvas.toDataURL('image/png');const download=document.createElement('a');download.href=dataUrl;download.download='첫손님_2026_혁신도감.png';document.body.appendChild(download);download.click();download.remove();modal(");
code=code.replace('이 미리보기에서는 저장이 제한될 수 있어요. 화면 캡처로 간직할 수 있어요.','이미지 저장에 실패했어요. 잠시 후 다시 시도해 주세요.');
code=code.replaceAll('<b>${s.history.length}</b>','<b>${s.history.filter(h=>!h.old&&!h.fraud).length}</b>').replace('s.history.length?s.safety:92,s.history.length,s.frauds','s.safety,s.history.filter(h=>!h.old&&!h.fraud).length,s.frauds');
code=code.replace('__ASSETS__',read('assets.json'));
code=code.replaceAll(' →</button>','</button>').replaceAll(' ↓</button>','</button>');
new vm.Script(code,{filename:'app.js'});new vm.Script(read('engine.js'),{filename:'engine.js'});
const css=read('design-base.css')+'\n'+read('game.css');
const html='<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#75a98b"><meta name="description" content="혁신조달팀 팀장 나르미가 되어 새 기술의 첫 손님이 되고, 네 계절의 생활 재난을 막는 게임"><title>첫 손님 — 나라가 처음 사주는 날</title><style>'+css+'</style></head><body><main id="first-guest" aria-label="첫 손님 게임"><div class="fg-game"><div class="fg-screen"></div><div class="fg-overlay" hidden></div><div class="fg-toast" role="status" hidden></div></div></main><script>'+read('engine.js')+'</script><script>'+code+'</script></body></html>';
fs.mkdirSync(path.join(dir,'dist'),{recursive:true});fs.mkdirSync(path.join(dir,'generated'),{recursive:true});
fs.writeFileSync(path.join(dir,'dist','index.html'),html);fs.writeFileSync(path.join(dir,'dist','첫손님_게임.html'),html);
fs.writeFileSync(path.join(dir,'generated','app.js'),code);fs.writeFileSync(path.join(dir,'generated','game.css'),css);
console.log(JSON.stringify({built:'dist/첫손님_게임.html',bytes:Buffer.byteLength(html)}));
