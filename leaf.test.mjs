import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {PRESETS,generate,frameFor,svgFor} from './leaf.mjs';
import {buildLeaf,scheduleAt,MAX_POINTS} from './growth.mjs';
import {atlasRows,atlasTable,atlasSvg} from './atlas.mjs';
const fixtures=JSON.parse(gunzipSync(readFileSync(new URL('./test/fixtures/grasshopper.json.gz',import.meta.url))));
const close=(a,b,context='')=>assert.ok(Math.abs(a-b)<1e-9,`${context}: ${a} != ${b}`);
const xy=(p,a,context)=>{close(p.x,a[0],context);close(p.y,a[1],context);};

for(const preset of PRESETS) test(`${preset.name}: original Python recursion, links, veins and final curves`,()=>{
  const fixture=fixtures.find(f=>f.sourceKey===preset.sourceKey);
  assert.equal(fixture.scriptHash,preset.scriptHash);
  const generated=generate(preset);
  assert.deepEqual(generated.stops,[]);
  assert.deepEqual(generated.steps.map(s=>s.limits),preset.sourceFrames);
  assert.equal(generated.steps[0].operation,'E');
  for(const expected of fixture.frames) {
    const actual=buildLeaf(preset,expected.limits);
    assert.equal(actual.points.length,expected.points.length);
    actual.points.forEach((p,i)=>{
      const e=expected.points[i];xy(p,e,p.id);assert.equal(p.polarity,e[2]);xy(p.origin,e.slice(3),p.id+' origin');
    });
    let cursor=0;
    for(const p of actual.controlPoints) {
      assert.equal(p.id,actual.points[cursor].id);
      cursor=expected.points[cursor][6];
    }
    assert.equal(cursor,-1);
    const branches=actual.branches.slice(1);
    assert.equal(branches.length,expected.veins.length);
    branches.forEach((b,i)=>{
      const e=expected.veins[i],reverse=b.id!==undefined;
      xy(b.a,e[reverse?1:0],`vein ${i}`);xy(b.b,e[reverse?0:1],`vein ${i}`);
    });
    if(expected.blade&&preset.rounding) {
      const key=p=>p.map(x=>x.toFixed(7).replace('-0.0000000','0.0000000')).join(',');
      const samples=new Set(actual.surfaces[0].map(p=>key([p.x,p.y])));
      for(const curve of expected.blade)for(const p of curve)assert.ok(samples.has(key(p)),`Missing original curve sample ${p}`);
    }
    const svg=svgFor({...actual,stage:1,operation:'E',cycle:1},{...preset,veins:true},frameFor([actual]));
    assert.ok(!/NaN|Infinity|undefined/.test(svg));
  }
});

test('first E uses an axis position, not a boundary-normal displacement',()=>{
  const p=structuredClone(PRESETS[0]);p.stages[0].positions[0]=.4;
  const a=buildLeaf(p,[1,0]),event=a.events[0],point=a.points.find(x=>x.id===event.point);
  close(event.center.y,4);close(event.center.x,0);
  const angle=p.stages[0].rotation*.6*Math.PI/180,strength=p.stages[0].intensities[0];
  close(point.x,(p.seedHalfWidth*Math.cos(angle)-10*Math.sin(angle))*strength);
  close(point.y,4+(p.seedHalfWidth*Math.sin(angle)+10*Math.cos(angle))*strength);
  p.stages[0].positions[0]=.7;
  assert.notDeepEqual(buildLeaf(p,[1,0]).surfaces,a.surfaces);
});

test('stem C has its own position and first-operation strength',()=>{
  const p=structuredClone(PRESETS[1]),frame=buildLeaf(p,[2,0]);
  const e=frame.points.find(p=>p.id==='L:E'),c=frame.points.find(p=>p.id==='L.0:C');
  const rule=p.stages[0],base=frame.points[0];
  const at={x:e.x+(base.x-e.x)*rule.stemPosition,y:e.y+(base.y-e.y)*rule.stemPosition};
  close(c.x,at.x+(e.origin.x-at.x)*rule.firstStemIntensity);
  close(c.y,at.y+(e.origin.y-at.y)*rule.firstStemIntensity);
});

test('dormant shoot edges retain their points and blades begin locally',()=>{
  const p=PRESETS[0],early=buildLeaf(p,[2,0]),later=buildLeaf(p,[6,0]);
  assert.ok(early.dormantCount>0);
  for(const a of early.points){const b=later.points.find(p=>p.id===a.id);assert.ok(b);xy(b,[a.x,a.y]);}
  const all=buildLeaf(p),firstBlade=all.events.findIndex(e=>e.phase===1);
  assert.ok(firstBlade>=0&&all.events.slice(firstBlade+1).some(e=>e.phase===0));
});

test('source bounds retain negative C in the definitions that permit it',()=>{
  const ash=structuredClone(PRESETS.find(p=>p.name==='American ash'));
  ash.stages[0].intensities[1]=-.4;
  assert.ok(buildLeaf(ash,[2,0]).events.some(e=>e.operation==='C'&&e.intensity<0));
  const buttercup=structuredClone(PRESETS[0]);buttercup.stages[0].intensities[1]=-.4;
  assert.ok(buildLeaf(buttercup,[2,0]).events.filter(e=>e.operation==='C').every(e=>e.intensity>=0));
});

test('rounding changes the drawing without changing recursion',()=>{
  const p=structuredClone(PRESETS[0]),a=buildLeaf(p);
  p.negativeWeight=.1;p.positiveWeight=9;
  const b=buildLeaf(p);assert.deepEqual(a.points,b.points);assert.notDeepEqual(a.surfaces,b.surfaces);
  p.rounding=false;assert.deepEqual(buildLeaf(p).surfaces[0],a.controlPoints);
});

test('extended schedules hold each parity and skipped phases remain valid',()=>{
  assert.equal(scheduleAt([.1,.2,.3,.4],7),.4);assert.equal(scheduleAt([.1,.2,.3,.4],6),.3);
  const p=structuredClone(PRESETS[0]);p.stages[0].cycles=0;
  assert.ok(generate(p).steps.every(s=>s.stage===2));
  p.stages[1].cycles=0;assert.equal(generate(p).steps.length,0);
});

test('point budget stops excessive recursion with complete frames',()=>{
  const p=structuredClone(PRESETS.find(p=>p.name==='Fern'));
  p.stages.forEach(s=>{s.cycles=20;s.minExpansionLength=0;s.minContractionLength=0;});
  const result=generate(p);assert.ok(result.stops.length);assert.ok(result.steps.every(s=>s.pointCount<=MAX_POINTS));
});

test('atlas includes all sixteen source sequences without mutating recipes',()=>{
  const before=JSON.stringify(PRESETS),rows=atlasRows(PRESETS),table=atlasTable(rows),svg=atlasSvg(rows);
  assert.equal(rows.length,16);assert.equal(JSON.stringify(PRESETS),before);
  for(const row of rows){assert.ok(table.includes(row.params.name));assert.ok(svg.includes(row.params.name));}
  assert.equal((table.match(/data-step=/g)||[]).length,rows.reduce((n,r)=>n+r.steps.length+1,0));
});
