import test from 'node:test';
import assert from 'node:assert/strict';
import {bradyMatrixData,bradyMorphControls} from './brady-matrix.mjs';
const area=step=>step.surfaces.reduce((sum,poly)=>sum+Math.abs(poly.reduce((a,p,i)=>{const q=poly[(i+1)%poly.length];return a+p.x*q.y-q.x*p.y;},0))/2,0);
test('all rows retain twelve operations, seven shoot poles and a shared frame',()=>{
 const rows=bradyMatrixData();assert.equal(rows.length,12);
 for(const row of rows){assert.equal(row.cells.length,12);assert.equal(row.steps[5].points.filter(p=>p.polarity>0).length,7);assert.deepEqual(row.frame,rows[0].frame);for(const step of row.steps)for(const poly of step.surfaces)for(const p of poly)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));}
});
test('mature surface builds to a full middle plateau and decreases after row seven',()=>{
 const areas=bradyMatrixData().map(r=>area(r.steps.at(-1)));
 for(let i=1;i<=3;i++)assert.ok(areas[i]>areas[i-1]);
 // Fuller early blades no longer require area to rise as every sinus deepens.
 const middle=areas.slice(3,7);
 assert.ok(Math.min(...middle)/Math.max(...middle)>.85);
 for(let i=7;i<12;i++)assert.ok(areas[i]<areas[i-1]);
});
test('petioles shorten smoothly across the series and elongate within each row',()=>{
 const rows=bradyMatrixData();
 assert.ok(rows[0].controls.stalk>rows.at(-1).controls.stalk*5);
 rows.forEach((row,r)=>{
  if(r)assert.ok(row.controls.stalk<rows[r-1].controls.stalk);
  const lengths=row.steps.map(s=>-Math.min(...s.surfaces.at(-1).map(p=>p.y)));
  for(let i=1;i<lengths.length;i++)assert.ok(lengths[i]>lengths[i-1]);
  assert.ok(Math.abs(lengths.at(-1)-row.controls.stalk)<1e-9);
 });
});
test('morph controls remain continuous at intermediate anchors',()=>{
 for(const t of [3/11,6/11]){const a=bradyMorphControls(t-1e-6),b=bradyMorphControls(t+1e-6);for(const k of Object.keys(a))assert.ok(Math.abs(a[k]-b[k])<1e-7);}
});
