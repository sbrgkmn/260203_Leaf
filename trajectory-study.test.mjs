import test from 'node:test';
import assert from 'node:assert/strict';
import {trajectoryStudies} from './trajectory-study.mjs';
import {generateGrowth} from './growth.mjs';
import {continuationSvg} from './diagrams.mjs';

test('trajectory comparison changes only continuation and retains genuine E/C states',()=>{
  for(const cutoff of [0,.7,5]){
    const [radial,linear]=trajectoryStudies(cutoff);
    assert.deepEqual({...radial.params,trajectory:'tip'},linear.params);
    assert.deepEqual(radial.steps[1].controlPoints,linear.steps[1].controlPoints);
    for(const r of [radial,linear]){
      assert.deepEqual(r.stops,[]);
      assert.deepEqual(r.steps.map(s=>s.operation),['E','C','E','C','E','C']);
      assert.deepEqual(r.steps,generateGrowth(r.params).steps);
    }
  }
});

test('linear pairs stay symmetric and parallel with a three-quarter length ratio',()=>{
  for(const cutoff of [0,.7,5]){
    const r=trajectoryStudies(cutoff)[1],points=r.steps.at(-1).points;
    const left=points.filter(p=>p.id.startsWith('L')&&p.polarity>0).sort((a,b)=>a.g-b.g);
    const vectors=left.map(p=>({x:p.x-p.origin.x,y:p.y-p.origin.y}));
    if(cutoff<1)assert.equal(left.length,3);
    for(let i=0;i<left.length;i++){
      const p=left[i],q=points.find(q=>q.id===p.id.replace(/^L/,'R'));
      assert.ok(Math.abs(p.x+q.x)<1e-9&&Math.abs(p.y-q.y)<1e-9);
      if(i){
        assert.ok(Math.abs(vectors[i].x/vectors[i-1].x-.75)<1e-9);
        assert.ok(Math.abs(vectors[i].y/vectors[i-1].y-.75)<1e-9);
        assert.ok(p.origin.y>left[i-1].origin.y);
      }
    }
  }
});

test('choice arrows identify different eligible descendants after the shared first pair',()=>{
  const [radial,linear]=trajectoryStudies();
  const targets=r=>r.steps[1].edges.filter(e=>e.active).map(e=>e.b.id);
  assert.deepEqual(targets(radial),['L:E','R:E']);
  assert.deepEqual(targets(linear),['apex','apex']);
  const svg=continuationSvg();
  assert.ok(svg.includes('75%'));
  assert.ok(svg.includes('marker-end="url(#choice-0-arrow)"'));
  assert.ok(svg.includes('marker-end="url(#choice-1-arrow)"'));
});
