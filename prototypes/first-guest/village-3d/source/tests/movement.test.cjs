const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const context={THREE:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../src/world.js'),'utf8'),context);
test('Automatic walking reaches a nearby waypoint at low frame rates instead of oscillating past it',()=>{
 let arrived=false;const world={t:0,keys:{},stick:{x:0,y:0},path:[{x:0,z:0}],arrival:'need',clickRing:{visible:true},nav:{free:()=>true},setActor(){},onArrival(){arrived=true;},player:{group:{position:{x:-.27,z:0}},sprite:{position:{y:0},material:{rotation:0}},walk:0},dari:{group:{position:{x:0,z:0}},sprite:{position:{y:0}}}};
 for(let i=0;i<8;i++)context.FirstGuestWorld.prototype.move.call(world,.08);
 assert(arrived,'The resident conversation must open even with 80 ms frames');assert(Math.abs(world.player.group.position.x)<.01);assert.equal(world.path.length,0);
});
