import test from 'node:test';
import assert from 'node:assert/strict';
import {fiveLobeRecipe,marginSeries} from './margin-study.mjs';
import {marginDepthSvg,marginRoundingSvg,marginRuleSvg} from './margin-diagrams.mjs';
import {VARIATIONS} from './variations.mjs';
import {generate} from './leaf.mjs';
import {isSimple} from './geometry.mjs';
import {buildLeaf} from './growth.mjs';

test('margin scaffold has exactly five primary shoots and real E/C frames',()=>{
  const params=fiveLobeRecipe(),g=generate(params);
  assert.deepEqual(g.steps.map(s=>s.operation),['E','C','E','C']);
  assert.equal(g.steps.at(-1).points.filter(p=>p.polarity>0).length,5);
  assert.deepEqual(g.steps.at(-1).controlPoints,buildLeaf(params,[4,0]).controlPoints);
  for(const r of marginSeries()){
    assert.equal(r.steps.at(-1).points.filter(p=>p.polarity>0&&p.phase<1).length,5);
    assert.ok(isSimple(r.steps.at(-1).surfaces[0]),r.name);
  }
});
test('tip and notch sharpness change curves without moving any recursive pole',()=>{
  const p=fiveLobeRecipe({depth:.66}),base=generate(p).steps.at(-1);
  for(const key of ['positiveWeight','negativeWeight'])for(const w of [.3,.7,1.6,5,16]){
    const step=generate({...p,[key]:w}).steps.at(-1);
    assert.deepEqual(step.controlPoints,base.controlPoints);
    assert.ok(isSimple(step.surfaces[0]));
  }
});
test('all new variation studies are bilaterally symmetric E/C recipes',()=>{
  for(const p of VARIATIONS.slice(8)){
    assert.equal(p.leftRightPosition,.5);assert.equal(p.leftRightIntensity,.5);
    const step=generate(p).steps.at(-1),points=step.controlPoints;
    for(const q of points)assert.ok(points.some(r=>Math.abs(r.x+q.x)<1e-8&&Math.abs(r.y-q.y)<1e-8),p.name);
  }
});
test('margin diagrams export finite SVGs with independent clipping IDs',()=>{
  for(const svg of [marginDepthSvg(),marginDepthSvg({depthShift:.12,sharpness:3,notchSharpness:3}),marginRoundingSvg(),marginRuleSvg()]){
    assert.ok(svg.startsWith('<svg xmlns='));assert.ok(!/NaN|undefined|Infinity/.test(svg));
    const ids=[...svg.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  }
});
