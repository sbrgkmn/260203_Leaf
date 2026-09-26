import test from 'node:test';
import assert from 'node:assert/strict';
import {expansionGeometry,contractionGeometry,buttercupSequence,serialData,serialRecipes,workedSvg,continuationSvg,geometrySvg,smoothingSvg,bladeFamily,bladeGrowthFamily,serialSvg,getStudy,bowedBladeSvg,bradyReferenceSvg,serialInspectorSvg} from './diagrams.mjs';
import {bradyRecipe,STRUCTURAL_ANCHORS,BRADY_REFERENCE} from './brady-series.mjs';
import {simpleBlade,signedArea} from './blade-study.mjs';
import {isSimple} from './geometry.mjs';
import {buildLeaf,generateGrowth} from './growth.mjs';
import {generate,frameFor,svgFor} from './leaf.mjs';
import {rationalBezier} from './blade.mjs';
import {VARIATIONS,varyRecipe} from './variations.mjs';
const near=(a,b)=>{assert.ok(Math.abs(a.x-b.x)<1e-9);assert.ok(Math.abs(a.y-b.y)<1e-9);};

test('diagram E and C constructions agree with actual Buttercup events',()=>{
  const p=getStudy('Buttercup'),s=p.stages[0],frame=buildLeaf(p,[2,0]);
  const a={x:-p.seedHalfWidth,y:0},b={x:0,y:10},origin={x:0,y:0};
  const e=expansionGeometry(a,b,origin,b,s.positions[0],s.intensities[0],s.rotation);
  near(e.point,frame.points.find(p=>p.id==='L:E'));
  // L.1 is the C flank whose endpoint is positive, so the regular C rule applies.
  const c=contractionGeometry(e.point,b,e.center,s.positions[1],s.intensities[1]);
  near(c.point,frame.points.find(p=>p.id==='L.1:C'));
  near(contractionGeometry(a,b,origin,.5,0).point,{x:-.05,y:5});
  near(contractionGeometry(a,b,origin,.5,1).point,origin);
  assert.ok(contractionGeometry(a,b,origin,.5,-.5).point.y>5);
});
test('worked example uses the twelve saved frames without changing the recipe',()=>{
  const {params,steps,stops}=buttercupSequence();assert.equal(steps.length,12);assert.deepEqual(stops,[]);
  assert.deepEqual(steps,generate(params).steps);
  assert.deepEqual(steps.map(s=>s.stage),[1,1,1,1,1,1,2,2,2,2,2,2]);
});
test('rounding weights leave recursive geometry unchanged and meet the same anchors',()=>{
  const p=getStudy('Buttercup'),a=generate(p).steps.at(-1);
  const b=generate({...p,positiveWeight:.15,negativeWeight:8}).steps.at(-1);
  assert.deepEqual(a.points,b.points);assert.notDeepEqual(a.surfaces,b.surfaces);
  const left={x:0,y:0},pole={x:1,y:1},right={x:2,y:0};
  for(const weight of [0,.15,1,8,20]){near(rationalBezier(left,pole,right,0,weight),left);near(rationalBezier(left,pole,right,1,weight),right);}
});
test('parametric studies reproduce their stated offsets from source recipes',()=>{
  for(const p of VARIATIONS){
    const source=varyRecipe(getStudy(p.parent),p.offsets);
    assert.deepEqual(generate(p).steps,generate(source).steps);
  }
});
test('serial matrix supports eight and twelve real E/C sequences with aligned operation indices',()=>{
  for(const options of [{count:12},{count:8,articulation:.75,spread:-10},{count:9,articulation:1.25,spread:10}]){
    const rows=serialData(options);assert.equal(rows.length,options.count);
    assert.equal(new Set(rows.map(r=>JSON.stringify(r.steps.at(-1).surfaces))).size,options.count);
    for(const r of rows){
      assert.deepEqual(r.stops,[]);assert.equal(r.steps.length,12);
      assert.deepEqual(r.steps.map(s=>s.operation),Array.from({length:12},(_,i)=>i%2?'C':'E'));
      const direct=generateGrowth(r.params);
      r.steps.forEach((s,i)=>{assert.deepEqual(s.points,direct.steps[i].points);assert.deepEqual(s.surfaces,direct.steps[i].surfaces);});
    }
  }
  const before=serialRecipes();serialData();assert.deepEqual(serialRecipes(),before);
});
test('structural anchors preserve their symmetric schedules and interpolate linearly',()=>{
  assert.equal(BRADY_REFERENCE.forms.length,9);
  assert.equal(serialRecipes()[0].position,0);assert.equal(serialRecipes().at(-1).position,8);
  for(let i=0;i<9;i++){
    const r=bradyRecipe(i);assert.deepEqual(r.params.stages,STRUCTURAL_ANCHORS[i].stages);
    assert.equal(r.relativeSize,BRADY_REFERENCE.forms[i].relativeSize);
    if(i<8){
      const halfway=bradyRecipe(i+.5),next=bradyRecipe(i+1);
      assert.equal(halfway.params.stages[0].rotation,(r.params.stages[0].rotation+next.params.stages[0].rotation)/2);
      assert.ok(Math.abs(bradyRecipe(i+1-1e-8).params.stages[0].rotation-next.params.stages[0].rotation)<1e-5);
    }
  }
  assert.throws(()=>serialRecipes({count:7}),RangeError);
});
test('every serial construction stays symmetric and formal complexity rises then falls',()=>{
  for(const options of [{count:12},{count:8,articulation:.85,spread:-6},{count:12,articulation:1.05,spread:6}]){
    const rows=serialData(options);
    for(const r of rows){
      assert.equal(r.params.leftRightPosition,.5);assert.equal(r.params.leftRightIntensity,.5);
      for(const s of r.steps)for(const [i,p] of s.controlPoints.entries()){
        const q=s.controlPoints.at(-i-1);near({x:-p.x,y:p.y},q);
      }
    }
  }
  const rows=serialData(),counts=rows.map(r=>r.steps.at(-1).points.length);
  assert.ok(Math.max(...counts)>counts[0]*8);assert.equal(counts.at(-1),counts[0]);
  for(const r of rows)assert.ok(isSimple(r.steps.at(-1).surfaces[0]));
  assert.ok(!serialSvg().includes('Silhouette overlap'));
});
test('signed blade finish changes area without changing E/C poles or creating crossings',()=>{
  for(const w of [.3,.6,1]){
    const inward=simpleBlade(-.05,w),neutral=simpleBlade(0,w),outward=simpleBlade(.25,w);
    const area=r=>Math.abs(signedArea(r.step.surfaces[0]));
    assert.ok(area(inward)<area(neutral));assert.ok(area(outward)>area(neutral));
    for(const r of [inward,neutral,outward]){
      assert.deepEqual(r.step.controlPoints,neutral.step.controlPoints);
      assert.ok(isSimple(r.step.surfaces[0]));
      const notch=r.step.controlPoints.findIndex(p=>p.id==='L.1:C');
      const arc=r.step.surfaces[0].slice(1+(notch-1)*101,1+notch*101);
      const a=arc[0],b=arc.at(-1),mid=arc[50];
      assert.ok(Math.abs((mid.x-a.x)*(b.y-a.y)-(mid.y-a.y)*(b.x-a.x))>.01);
    }
  }
});
test('all exported plates are standalone SVGs with finite coordinates and unique clipping IDs',()=>{
  for(const svg of [geometrySvg(),geometrySvg({position:.9,rotation:10,intensity:1,contraction:-.35}),workedSvg(),workedSvg({filled:true,rounding:true}),continuationSvg(0),continuationSvg(5),smoothingSvg(),bladeFamily(),bladeGrowthFamily('Magnolia'),bowedBladeSvg(),bradyReferenceSvg(),serialInspectorSvg(4.5),serialSvg({relativeSize:true})]){
    assert.ok(svg.startsWith('<svg xmlns='));assert.ok(svg.endsWith('</svg>'));assert.ok(!/NaN|Infinity|undefined/.test(svg));
    const ids=[...svg.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  }
});
