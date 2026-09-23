import test from 'node:test';
import assert from 'node:assert/strict';
import {GRASSHOPPER_RECIPES} from './data/grasshopper-recipes.mjs';
import {PRESETS,studyParams} from './presets.mjs';
import {compactRecipe,expandRecipe} from './recipe.mjs';
import {createGenerator} from './generator.mjs';
import {generate} from './leaf.mjs';
import {VARIATIONS,NEUTRAL,varyRecipe,neighboringVariations} from './variations.mjs';

test('compact recipes restore every original setting, including archived continuation values',()=>{
  assert.deepEqual(PRESETS,GRASSHOPPER_RECIPES);
  for(const p of PRESETS){assert.deepEqual(expandRecipe(compactRecipe(p)),p);assert.deepEqual(varyRecipe(p,NEUTRAL),p);}
});
test('rounding and display edits reuse growth; generative edits invalidate it',()=>{
  const run=createGenerator(),p=structuredClone(PRESETS[0]),a=run(p);
  p.positiveWeight+=1;p.veins=true;
  const b=run(p);assert.equal(a.steps.at(-1).points,b.steps.at(-1).points);assert.notDeepEqual(a.steps.at(-1).surfaces,b.steps.at(-1).surfaces);
  p.stages[0].positions[0]+=.01;
  const c=run(p);assert.notEqual(b.steps.at(-1).points,c.steps.at(-1).points);assert.notDeepEqual(b.steps.at(-1).points,c.steps.at(-1).points);
});
test('duplicate geometry is shared without removing labeled frames',()=>{
  const p=PRESETS.find(p=>p.name==='Magnolia'),r=createGenerator()(p);
  assert.equal(r.steps.length,p.sourceFrames.length);
  assert.ok(r.steps.some((s,i)=>i&&s.points===r.steps[i-1].points&&s.surfaces===r.steps[i-1].surfaces));
});
test('variation controls are reversible and never modify their source',()=>{
  const p=PRESETS[0],original=JSON.stringify(p);
  const changed=varyRecipe(p,{origin:.1,spread:8,fullness:.2,shoots:1,blades:-.5,roundness:.4});
  assert.notDeepEqual(generate(changed).steps.at(-1).points,generate(p).steps.at(-1).points);
  assert.deepEqual(varyRecipe(p,NEUTRAL),p);assert.equal(JSON.stringify(p),original);
});
test('all eight new forms are distinct, finite and complete',()=>{
  const shapes=new Set();
  for(const p of VARIATIONS){
    const r=generate(p);assert.deepEqual(r.stops,[]);assert.ok(r.steps.length);assert.equal(r.steps[0].operation,'E');
    const final=r.steps.at(-1);assert.ok(final.surfaces.flat().every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
    const shape=JSON.stringify(final.surfaces);assert.ok(!shapes.has(shape));shapes.add(shape);
    const parent=PRESETS.find(q=>q.name===p.parent);assert.notEqual(shape,JSON.stringify(generate(parent).steps.at(-1).surfaces));
  }
});
test('neighboring grid is deterministic and its center retains the selected geometry',()=>{
  const p=VARIATIONS[0],grid=neighboringVariations(p);
  assert.equal(grid.length,9);assert.deepEqual(grid,neighboringVariations(p));
  assert.deepEqual(generate(grid[4]).steps.at(-1).surfaces,generate(p).steps.at(-1).surfaces);
});

test('White oak opens and resets with smoothing, preserving the entire growth sequence',()=>{
  const source=PRESETS.find(p=>p.name==='White oak'),smoothed=studyParams(source);
  assert.equal(source.rounding,false);assert.equal(smoothed.rounding,true);
  const a=generate(source).steps,b=generate(smoothed).steps;
  assert.equal(a.length,b.length);
  for(let i=0;i<a.length;i++){assert.deepEqual(a[i].points,b[i].points);assert.deepEqual(a[i].edges,b[i].edges);assert.deepEqual(a[i].branches,b[i].branches);}
  assert.notDeepEqual(a.at(-1).surfaces,b.at(-1).surfaces);
  smoothed.rounding=false;assert.equal(studyParams(source).rounding,true);
});
