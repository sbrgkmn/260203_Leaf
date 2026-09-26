import test from 'node:test';import assert from 'node:assert/strict';
import {EXPERIMENTS} from './experimental.mjs';
import {generateGrowth} from './growth.mjs';
import {generate} from './leaf.mjs';
import {varyRecipe} from './variations.mjs';

test('single lab leaves are exactly the published E/C engine at every step',()=>{
  for(const p of EXPERIMENTS.filter(p=>!p.compound)){
    assert.equal(p.experiment,undefined);
    assert.deepEqual(generate(p),generateGrowth(p));
    const steps=generate(p).steps;assert.ok(steps.length>=12);
    for(const frame of steps){
      assert.ok(frame.events.length>0);
      assert.equal(frame.points.length,frame.events.length+3);
    }
  }
});
test('compound scaffold and every local blade come from the original E/C routine',()=>{
  for(const p of EXPERIMENTS.filter(p=>p.compound)){
    const q=structuredClone(p);q.stages[1].cycles=0;
    const scaffold=generateGrowth(q).steps,result=generate(p).steps;
    assert.deepEqual(result.slice(0,scaffold.length),scaffold);
    const local=structuredClone(p),cycles=p.stages[1].cycles;
    local.stages=[{...structuredClone(p.stages[1]),cycles:Math.max(0,cycles-1)},{...structuredClone(p.leafletFinish),cycles:Math.min(1,cycles)}];
    local.variant.firstRotationFull=false;local.trajectory='tip';
    const expected=generateGrowth(local).steps;
    result.slice(scaffold.length).forEach((frame,i)=>{
      assert.equal(frame.events.length,expected[i].events.length*frame.shoots.length);
      for(const shoot of frame.shoots){
        const dx=(shoot.b.x-shoot.a.x)/10,dy=(shoot.b.y-shoot.a.y)/10;
        const pts=frame.points.filter(point=>point.id.startsWith(shoot.id+'/'));
        assert.equal(pts.length,expected[i].points.length);
        pts.forEach((point,j)=>{
          const v=expected[i].points[j];
          assert.ok(Math.abs(point.x-(shoot.a.x+v.x*dy+v.y*dx))<1e-9);
          assert.ok(Math.abs(point.y-(shoot.a.y-v.x*dx+v.y*dy))<1e-9);
        });
      }
    });
  }
});
test('wood sorrel establishes three equal shoots in its first E/C cycle',()=>{
  const p=EXPERIMENTS.find(p=>p.name==='Wood sorrel'),steps=generate(p).steps;
  assert.deepEqual(steps.slice(0,2).map(s=>[s.stage,s.operation]),[[1,'E'],[1,'C']]);
  const shoots=steps[2].shoots;assert.equal(shoots.length,3);
  const lengths=shoots.map(s=>Math.hypot(s.b.x-s.a.x,s.b.y-s.a.y));
  assert.ok(lengths.every(n=>Math.abs(n-lengths[0])<1e-9));
  assert.equal(steps[2].surfaces.length,3);
});
test('all lab boundaries stay symmetrical and macros still operate on recursion',()=>{
  for(const p of EXPERIMENTS){
    const before=JSON.stringify(p),r=generate(p);assert.deepEqual(r.stops,[]);
    for(const frame of r.steps){
      const points=frame.surfaces.flat();
      for(const v of points)assert.ok(points.some(q=>Math.abs(q.x+v.x)<1e-7&&Math.abs(q.y-v.y)<1e-7),p.name);
    }
    const changed=generate(varyRecipe(p,{spread:5,fullness:.2}));
    assert.notDeepEqual(changed.steps.at(-1).surfaces,r.steps.at(-1).surfaces);
    assert.equal(JSON.stringify(p),before);
  }
});
