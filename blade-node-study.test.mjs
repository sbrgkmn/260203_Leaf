import test from 'node:test';
import assert from 'node:assert/strict';
import {NODE_TREATMENTS,nodeStudy,nodeConstruction,sampleNodeStudy,bladeNodeStudySvg,constructionHistory} from './blade-node-study.mjs';
import {generateGrowth} from './growth.mjs';
import {isSimple} from './geometry.mjs';
const near=(a,b)=>assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<1e-8);
const q=(s,t)=>({x:(1-t)**2*s.start.x+2*(1-t)*t*s.control.x+t*t*s.end.x,y:(1-t)**2*s.start.y+2*(1-t)*t*s.control.y+t*t*s.end.y});
test('the shared construction stops at the actual second contraction before CV placement',()=>{
  const r=nodeConstruction();assert.deepEqual(r.steps.map(s=>s.operation),['E','C','E','C']);
  assert.deepEqual(r.steps,generateGrowth(r.params).steps);
  assert.equal(r.steps.at(-1).points.length,15);
  assert.equal(r.steps.at(-1).points.filter(p=>p.polarity>0).length,5);
  for(const c of NODE_TREATMENTS)assert.deepEqual(nodeStudy(c).source,r.steps.at(-1));
});
test('all post-C2 layouts are distinct, symmetric and non-crossing quadratic contours',()=>{
  const studies=NODE_TREATMENTS.map(nodeStudy);assert.equal(new Set(studies.map(s=>s.path)).size,4);
  for(const s of studies){
    const ps=sampleNodeStudy(s,60);assert.ok(isSimple(ps),s.id);
    assert.ok(s.controls.length+s.points.length>=(s.id==='ce'?16:16));
    assert.ok(!s.path.includes(' C '));
    for(const p of ps)assert.ok(ps.some(r=>Math.hypot(r.x+p.x,r.y-p.y)<1e-7),s.id+' must remain symmetric');
  }
});
test('simplified blades use four CVs per half with exact smooth joins and natural bases',()=>{
 for(const config of NODE_TREATMENTS){
  const r=nodeStudy(config);assert.equal(r.controls.length,8);assert.equal(r.segments.length,8);
  assert.ok(r.segments.every(s=>s.type==='quadratic'));
  const half=r.segments.slice(0,4);
  near(half[3].end,{x:0,y:108});assert.equal(half[3].control.x,0);
  const joins=config.id==='ce'?[2]:config.id==='ec'?[1,2]:[0,1,2];
  for(const i of joins){const a=half[i],b=half[i+1];near(a.end,b.start);
   near({x:a.end.x-a.control.x,y:a.end.y-a.control.y},{x:b.control.x-b.start.x,y:b.control.y-b.start.y});
  }
 }
});
test('history recovers the actual pre-contraction points and retains every earlier boundary',()=>{
  const history=constructionHistory();assert.deepEqual(history.map(h=>h.earlier.length),[0,1,2,3]);
  assert.deepEqual(history.map(h=>h.moves.length),[2,4,2,4]);
  for(const h of history)for(const m of h.moves){
    for(const p of [m.start,m.end,m.pole])assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
    if(m.operation==='C')near({x:m.start.x*(1-m.intensity)+m.pole.x*m.intensity,y:m.start.y*(1-m.intensity)+m.pole.y*m.intensity},m.end);
  }
});
test('03 mirrors four half-leaf arcs into a continuous pointed blade',()=>{
 const s=nodeStudy({id:'ce'}),arcs=s.segments.filter(s=>s.type==='quadratic');
 assert.equal(s.veins.length,3);assert.equal(arcs.length,8);assert.equal(s.points.length,8);
 for(let i=0;i<4;i++){const a=arcs[i],b=arcs[7-i];near({x:-a.start.x,y:a.start.y},b.end);near({x:-a.control.x,y:a.control.y},b.control);}
 for(let i=0;i<s.segments.length;i++)near(s.segments[i].end,s.segments[(i+1)%s.segments.length].start);
 const svg=bladeNodeStudySvg();assert.ok(!/NaN|undefined/.test(svg));assert.ok(svg.includes('Half-leaf / 4 CVs'));
});

test('02 lower join matches quadratic curvature across CVs 2 and 3',()=>{
 const [a,b]=nodeStudy({id:'ec'}).segments.slice(1,3);
 const dd=s=>({x:s.start.x-2*s.control.x+s.end.x,y:s.start.y-2*s.control.y+s.end.y});
 near(dd(a),dd(b));
});

test('all study branches share the central 03 origin while retaining their target points',()=>{
 for(const config of NODE_TREATMENTS){const r=nodeStudy(config),v=r.veins[1];
  near(v.a,{x:0,y:22});near(r.veins[2].a,v.a);near(v.b,{x:76,y:-40});
  near(r.veins[2].b,{x:-v.b.x,y:v.b.y});
 }
 const r=nodeStudy({id:'cc'});near(r.veins[1].b,r.controls[2]);
});
