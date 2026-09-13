import test from 'node:test';
import assert from 'node:assert/strict';
import {PRESETS,generate,boundary,frameFor,svgFor,displace} from './leaf.mjs';
import {framework,profileAt,isSimple} from './growth.mjs';
import {atlasRows,atlasTable,atlasSvg} from './atlas.mjs';
const clone=name=>structuredClone(PRESETS.find(p=>p.name===name));
const area=s=>s.surfaces.reduce((sum,points)=>sum+Math.abs(points.reduce((a,p,i)=>{const q=points[(i+1)%points.length];return a+p.x*q.y-p.y*q.x;},0))/2,0);
const coordinates=s=>s.surfaces.map(points=>points.map(({x,y})=>[x,y]));
const primary=s=>s.branches.filter(b=>b.id&&!b.parent);

test('all 16 recipes generate complete, finite, symmetric E-first sequences',()=>{
 assert.equal(PRESETS.length,16);
 for(const p of PRESETS){
  const before=JSON.stringify(p),{steps}=generate(p),frame=frameFor(steps);
  assert.equal(JSON.stringify(p),before,'Generation must not mutate a recipe');
  assert.equal(steps.length,p.stages.reduce((n,s)=>n+s.cycles*2,0),p.name);
  for(const [i,s] of steps.entries()){
   assert.equal(s.operation,i%2?'C':'E');assert.ok(s.pointCount<=4096,p.name);
   for(const polygon of s.surfaces)assert.ok(isSimple(polygon),`${p.name}: self intersection`);
   const points=boundary(s),set=new Set(points.map(p=>`${p.x.toFixed(9)},${p.y.toFixed(9)}`));
   for(const p of points){
    assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
    assert.ok(p.x>=frame.x&&p.x<=frame.x+frame.size&&p.y>=frame.y&&p.y<=frame.y+frame.size);
    assert.ok(set.has(`${(-p.x||0).toFixed(9)},${p.y.toFixed(9)}`),'Exact bilateral geometry');
   }
   assert.doesNotMatch(svgFor(s,p,frame),/NaN|Infinity/);
  }
 }
});

test('primary shoot identities and positions survive blade and margin development',()=>{
 for(const p of PRESETS){
  const steps=generate(p).steps,structure=steps.filter(s=>s.stage===1).at(-1);
  assert.equal(structure.primaryCount,p.growth.shoots*2+1);
  for(const step of steps.filter(s=>s.stage>1))assert.deepEqual(primary(step),primary(structure),p.name);
 }
});

test('compound leaves separate before filling; continuous blades remain connected',()=>{
 for(const name of ['Walnut','American ash']){
  const p=clone(name),s=generate(p).steps,early=s.filter(s=>s.stage===1).at(-1),final=s.at(-1);
  assert.equal(early.surfaces.length,p.growth.shoots*2+1);
  assert.equal(final.surfaces.length,early.surfaces.length);
  assert.ok(area(final)>area(early)*2,`${name}: leaflets should broaden`);
 }
 for(const name of ['Magnolia','White oak','Buttercup'])assert.ok(generate(clone(name)).steps.every(s=>s.surfaces.length===1));
});

test('signed E and C retain opposite area effects during local blade development',()=>{
 const p=clone('Walnut');p.stages[1].cycles=1;p.stages[2].cycles=0;
 const base=generate(p).steps.filter(s=>s.stage===1).at(-1);
 const values={};
 for(const intensity of [-.3,0,.3]){
  const v=structuredClone(p);v.stages[1].expansion.intensity=intensity;v.stages[1].contraction.intensity=0;
  values[intensity]=area(generate(v).steps.find(s=>s.stage===2&&s.operation==='E'));
 }
 assert.ok(values[-.3]<area(base));assert.ok(Math.abs(values[0]-area(base))<1e-9);assert.ok(values[.3]>area(base));
 for(const intensity of [-.3,0,.3]){
  const v=structuredClone(p);v.stages[1].contraction.intensity=intensity;
  const s=generate(v).steps.slice(-2),difference=area(s[1])-area(s[0]);
  if(intensity===0)assert.ok(Math.abs(difference)<1e-9);else assert.ok(difference*intensity<0);
 }
});

test('all six local E/C controls independently change geometry without rewriting earlier steps',()=>{
 const p=clone('Walnut');p.stages[1].cycles=1;p.stages[2].cycles=0;
 const original=generate(p).steps;
 for(const operation of ['expansion','contraction'])for(const parameter of ['position','intensity','rotation']){
  const v=structuredClone(p);v.stages[1][operation][parameter]+=parameter==='rotation'?15:.15;
  const result=generate(v).steps,index=result.length-(operation==='expansion'?2:1);
  assert.notDeepEqual(coordinates(result[index]),coordinates(original[index]),`${operation}.${parameter}`);
  assert.deepEqual(result.slice(0,index),original.slice(0,index),'Earlier snapshots must remain independent');
 }
});

test('profile, spacing and rotation schedules act without changing shoot count',()=>{
 assert.equal(profileAt([.2,1,.4],0),.2);assert.equal(profileAt([.2,1,.4],.5),1);assert.equal(profileAt([.2,1,.4],1),.4);
 for(const name of ['Walnut','Buttercup'])for(const key of ['profile','spacing','tipRotation']){
  const p=clone(name),before=framework(p);
  if(key==='profile')p.growth.profile[1]*=.6;else p.growth[key]+=key==='spacing'?.5:15;
  const after=framework(p);assert.equal(after.axes.length,before.axes.length);assert.notDeepEqual(after.axes,before.axes,`${name}: ${key}`);
 }
});

test('regional growth leaves unselected lower shoots untouched',()=>{
 const p=clone('Walnut');p.stages[1].cycles=2;p.stages[1].target='upper';p.stages[2].cycles=0;
 const steps=generate(p).steps,early=steps.filter(s=>s.stage===1).at(-1),final=steps.at(-1);
 // Subdivision may add collinear points, so compare area of the lowest leaflet.
 assert.ok(Math.abs(area({surfaces:[early.surfaces[0]]})-area({surfaces:[final.surfaces[0]]}))<1e-10);
 assert.notEqual(area(early),area(final));
});

test('cycle decay changes later growth while keeping the first cycle identical',()=>{
 const p=clone('Walnut');p.stages[1].decay=1;const full=generate(p).steps;
 p.stages[1].decay=.2;const decayed=generate(p).steps;
 assert.deepEqual(full.filter(s=>s.stage===2&&s.cycle===1),decayed.filter(s=>s.stage===2&&s.cycle===1));
 assert.notDeepEqual(coordinates(full.at(-1)),coordinates(decayed.at(-1)));
});

test('fern secondary shoots appear in the blade stage with parent identities',()=>{
 const steps=generate(clone('Fern')).steps;
 assert.ok(steps.filter(s=>s.stage===1).every(s=>s.branches.every(b=>!b.parent)));
 const first=steps.find(s=>s.stage===2),last=steps.filter(s=>s.stage===2).at(-1);
 assert.ok(first.branches.some(b=>b.parent));
 assert.ok(last.branches.filter(b=>b.parent).length>first.branches.filter(b=>b.parent).length);
});

test('skipped stages and a zero seed never display an axis-only operation',()=>{
 const p=clone('Walnut');p.stages.forEach(s=>s.cycles=0);assert.equal(generate(p).steps.length,0);
 p.stages[2].cycles=1;const result=generate(p);assert.equal(result.steps[0].stage,3);assert.equal(result.steps[0].operation,'E');assert.ok(area(result.steps[0])>0);
 p.stages[0].expansion.intensity=0;assert.equal(generate(p).steps.length,0);
});

test('signed displacement is neutral at zero and rotation steers the reference vector',()=>{
 assert.deepEqual(displace({x:1,y:2},{x:3,y:0},0,45),{x:1,y:2});
 assert.deepEqual(displace({x:0,y:0},{x:1,y:0},-2,0),{x:-2,y:0});
 const p=displace({x:0,y:0},{x:1,y:0},1,90);assert.ok(Math.abs(p.x)<1e-12&&Math.abs(p.y-1)<1e-12);
});

test('atlas exports every operation and both developmental stage boundaries',()=>{
 const rows=atlasRows(PRESETS),html=atlasTable(rows),svg=atlasSvg(rows),total=rows.reduce((n,r)=>n+r.steps.length,0);
 assert.equal((html.match(/class="atlas-step-label"/g)||[]).length,total);
 assert.equal((svg.match(/id="sheet-\d+-\d+"/g)||[]).length,total);
 assert.match(html,/stage-2/);assert.match(html,/stage-3/);assert.match(svg,/#a98339/);
 for(const output of [html,svg]){assert.doesNotMatch(output,/Seed axis|NaN|Infinity/);const ids=[...output.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);}
});

test('extreme signed controls and dense secondary branching remain bounded',()=>{
 for(const name of ['Buttercup','Walnut','Fern'])for(const intensity of [-1.5,1.5]){
  const p=clone(name);p.growth.shoots=18;p.growth.secondaryPairs=p.growth.family==='compound'?7:0;
  p.stages[0].cycles=4;
  for(const s of p.stages.slice(1)){s.cycles=4;s.minLength=.005;s.expansion.intensity=intensity;s.contraction.intensity=-intensity;s.expansion.rotation=85;s.contraction.rotation=-80;}
  const result=generate(p);assert.ok(result.steps.length>0);
  for(const s of result.steps){assert.ok(s.pointCount<=4096,`${name}: ${s.pointCount}`);for(const points of s.surfaces){assert.ok(isSimple(points));for(const p of points)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));}}
 }
});
