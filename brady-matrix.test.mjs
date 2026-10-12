import test from 'node:test';
import assert from 'node:assert/strict';
import {bradyMatrixData,bradyMorphControls} from './brady-matrix.mjs';
import {buttercupSequence} from './diagrams.mjs';
const area=step=>step.surfaces.reduce((sum,poly)=>sum+Math.abs(poly.reduce((a,p,i)=>{const q=poly[(i+1)%poly.length];return a+p.x*q.y-q.x*p.y;},0))/2,0);
test('all rows retain twelve operations and a shared frame while late shoots simplify',()=>{
 const rows=bradyMatrixData();assert.equal(rows.length,12);
 for(const row of rows){assert.equal(row.cells.length,12);if(row.index<7)assert.equal(row.steps[5].points.filter(p=>p.polarity>0).length,7);assert.deepEqual(row.frame,rows[0].frame);for(const step of row.steps)for(const poly of step.surfaces)for(const p of poly)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));}
 const counts=rows.slice(6).map(r=>r.steps.at(-1).points.filter(p=>p.polarity>0).length);
 for(let i=1;i<counts.length;i++)assert.ok(counts[i]<=counts[i-1]);
 // Terminal leaves retain subordinate tips, but far fewer than the full leaf.
 assert.ok(counts.at(-1)>3&&counts.at(-1)<counts[0]/3);
});
test('mature surface builds to a full middle plateau and decreases after row seven',()=>{
 const areas=bradyMatrixData().map(r=>area(r.steps.at(-1)));
 for(let i=1;i<=3;i++)assert.ok(areas[i]>areas[i-1]);
 // Fuller early blades no longer require area to rise as every sinus deepens.
 const middle=areas.slice(3,7);
 // Allow up to 20% variation as the anchored contour gains deeper divisions.
 assert.ok(Math.min(...middle)/Math.max(...middle)>.8);
 for(let i=7;i<12;i++)assert.ok(areas[i]<areas[i-1]);
});
test('petioles vary only vertically, not with the horizontal operation index',()=>{
 const rows=bradyMatrixData();
 assert.ok(rows[0].controls.stalk>rows.at(-1).controls.stalk*5);
 rows.forEach((row,r)=>{
  if(r)assert.ok(row.controls.stalk<rows[r-1].controls.stalk);
  const lengths=row.steps.map(s=>-Math.min(...s.surfaces.at(-1).map(p=>p.y)));
  for(const length of lengths)assert.ok(Math.abs(length-row.controls.stalk)<1e-9);
  assert.ok(Math.abs(lengths.at(-1)-row.controls.stalk)<1e-9);
 });
});
test('every row follows a fixed Buttercup recipe with row-level primary and secondary scaling',()=>{
 const base=buttercupSequence().params;
 for(const row of bradyMatrixData()){
  assert.deepEqual(row.steps.map(s=>s.operation),Array.from({length:12},(_,i)=>i%2?'C':'E'));
  row.params.stages.forEach((stage,phase)=>{
   for(let parity=0;parity<2;parity++){
    const ratios=stage.intensities.filter((_,g)=>g%2===parity).map((v,i)=>v/base.stages[phase].intensities[i*2+parity]/(parity===0&&i>0?row.controls.secondaryExpansion:1));
    for(const ratio of ratios)assert.ok(Math.abs(ratio-ratios[0])<1e-12);
   }
  });
  const final=new Map(row.steps.at(-1).points.map(p=>[p.id,p]));
  for(const step of row.steps)for(const p of step.points){
   assert.ok(final.has(p.id));
   assert.equal(p.x,final.get(p.id).x);assert.equal(p.y,final.get(p.id).y);
  }
 }
});
test('morph controls remain continuous at intermediate anchors',()=>{
 for(const t of [3/11,6/11]){const a=bradyMorphControls(t-1e-6),b=bradyMorphControls(t+1e-6);for(const k of Object.keys(a))assert.ok(Math.abs(a[k]-b[k])<1e-7);}
});
test('early mature leaves retain most of their first blade expansion surface',()=>{
 for(const row of bradyMatrixData().slice(0,3)){
  const bladeArea=step=>area({...step,surfaces:[step.surfaces[0]]});
  assert.ok(bladeArea(row.steps.at(-1))/bladeArea(row.steps[6])>.8);
 }
});
