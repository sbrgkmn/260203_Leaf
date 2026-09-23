import test from 'node:test';
import assert from 'node:assert/strict';
import {PRESETS,studyParams} from './presets.mjs';
import {generate} from './leaf.mjs';
import {chartRows,chartRow,figureSvg,developmentPairs} from './figure-chart.mjs';
const studies=PRESETS.map(studyParams);

test('all chart sizes contain real integer-numbered E/C pairs without changing saved recipes',()=>{
  const before=JSON.stringify(studies);
  for(const count of [12,16,20])for(const row of chartRows(studies,count)){
    const computed=generate(row.params).steps;
    assert.equal(row.selected.length,count,row.params.name);
    assert.equal(row.shortfall,0);assert.deepEqual(row.stops,[]);
    assert.equal(row.selected[0].sourceStep,1);
    assert.equal(row.selected.at(-1).sourceStep,computed.length);
    row.selected.forEach((item,i)=>{
      assert.match(item.label,/^\d+$/);
      assert.equal(item.step.operation,i%2?'C':'E');
      assert.deepEqual(item.step,computed[item.sourceStep-1]);
      if(i)assert.ok(item.sourceStep>row.selected[i-1].sourceStep);
      if(i%2)assert.equal(item.sourceStep,row.selected[i-1].sourceStep+1);
      assert.ok(item.step.surfaces.flat().every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
    });
  }
  assert.equal(JSON.stringify(studies),before);
});
test('short rows add actual branching or differentiation rather than interpolated geometry',()=>{
  for(const name of ['Larkspur','Red oak']){
    const source=studies.find(p=>p.name===name),row=chartRow(source),original=generate(source).steps;
    assert.ok(row.extended);
    assert.ok(row.selected.at(-1).step.pointCount>original.at(-1).pointCount);
    assert.ok(row.total>original.length);
    assert.notDeepEqual(row.selected.at(-1).step.surfaces,original.at(-1).surfaces);
  }
});
test('selection skips complete cycles and retains the last computed form',()=>{
  const row=chartRow(studies.find(p=>p.name==='Ginkgo'));
  assert.ok(row.selected.some((s,i)=>i&&s.sourceStep-row.selected[i-1].sourceStep>1));
  const computed=generate(row.params).steps;
  assert.deepEqual(row.selected.at(-1).step,computed.at(-1));
  const repeated=[...computed.slice(0,2),...computed.slice(0,2),...computed.slice(0,2)];
  assert.equal(developmentPairs(repeated).length,1);
});
test('figure has E/C headers, integer-only captions, no operation counts or interpolation',()=>{
  const svg=figureSvg(chartRows(studies));
  assert.equal((svg.match(/class="figure-row"/g)||[]).length,16);
  assert.equal((svg.match(/class="figure-cell"/g)||[]).length,192);
  assert.deepEqual([...svg.matchAll(/class="operation-header">([EC])<\/text>/g)].map(m=>m[1]),Array.from({length:12},(_,i)=>i%2?'C':'E'));
  assert.ok(!/\d+ operations|Decimal|intermediate|NaN|undefined|Infinity/.test(svg));
  const labels=[...svg.matchAll(/y="\d+" font-size="12" text-anchor="middle">([^<]+)<\/text>/g)].map(m=>m[1]);
  assert.equal(labels.length,192);assert.ok(labels.every(label=>/^\d+$/.test(label)));
  const ids=[...svg.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
});
