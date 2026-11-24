(function(scope){
class TownNav{
 constructor(blocks=[]){this.blocks=blocks;this.step=1;this.minX=-24;this.maxX=24;this.minZ=-23;this.maxZ=53;}
 free(x,z,r=.5){return x>=this.minX&&x<=this.maxX&&z>=this.minZ&&z<=this.maxZ&&!this.blocks.some(b=>x>b.x-b.w/2-r&&x<b.x+b.w/2+r&&z>b.z-b.d/2-r&&z<b.z+b.d/2+r);}
 path(from,to){const cell=p=>({x:Math.round(p.x),z:Math.round(p.z)}),start=cell(from),end=cell(to),key=p=>p.x+','+p.z;
 if(!this.free(end.x,end.z)){let found=null;for(let r=1;r<8&&!found;r++)for(let x=-r;x<=r&&!found;x++)for(let z=-r;z<=r;z++){if(this.free(end.x+x,end.z+z)){found={x:end.x+x,z:end.z+z};break;}}if(!found)return [];Object.assign(end,found);}
 const open=[{...start,g:0,f:0}],best=new Map([[key(start),0]]),parents=new Map();let count=0;
 while(open.length&&count++<6000){open.sort((a,b)=>b.f-a.f);const cur=open.pop();if(cur.x===end.x&&cur.z===end.z){const out=[end];let k=key(end);while(parents.has(k)){const p=parents.get(k);out.unshift(p);k=key(p);}out.shift();return out;}
 for(const [dx,dz]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const p={x:cur.x+dx,z:cur.z+dz};if(!this.free(p.x,p.z)||!this.free(cur.x+dx,cur.z)||!this.free(cur.x,cur.z+dz))continue;const g=cur.g+Math.hypot(dx,dz),k=key(p);if(g>=(best.get(k)??Infinity))continue;best.set(k,g);parents.set(k,{x:cur.x,z:cur.z});open.push({...p,g,f:g+Math.hypot(end.x-p.x,end.z-p.z)});}}
 return [];
 }
}
if(typeof module!=='undefined'&&module.exports)module.exports=TownNav;else scope.TownNav=TownNav;
})(globalThis);
