import test from 'node:test';
import assert from 'node:assert/strict';
import {bladeConfigurations,simpleButtercupRecipe} from './blade-configurations.mjs';
import {bladeConfigurationSvg,bladeDevelopmentSvg} from './blade-configuration-diagrams.mjs';
import {generate} from './leaf.mjs';
import {roundedPoint} from './blade.mjs';
import {isSimple} from './geometry.mjs';
import {VARIATIONS} from './variations.mjs';

test('four upper/lower combinations share all four E/C constructions and only change the surface',()=>{
  const cases=bladeConfigurations();assert.equal(cases.length,4);
  const surfaces=new Set();
  for(const r of cases){
    assert.deepEqual(r.steps.map(s=>s.operation),['E','C','E','C']);
    for(const [i,s] of r.steps.entries())assert.deepEqual(s.controlPoints,cases[0].steps[i].controlPoints);
    const final=r.steps.at(-1);assert.equal(final.points.filter(p=>p.polarity>0).length,5);
    assert.ok(isSimple(final.surfaces[0]));surfaces.add(JSON.stringify(final.surfaces));
  }
  assert.equal(surfaces.size,4);
});
test('upper and lower treatments apply consistently and retain every selected anchor',()=>{
  for(const r of bladeConfigurations()){
    const points=r.steps.at(-1).controlPoints;
    for(let i=1;i<points.length-1;i++){
      const p=points[i],at=roundedPoint(p,points[i-1],points[i+1],r.params);
      const pointed=p.polarity>0?r.upper==='pointed':r.lower==='pointed';
      const d=Math.hypot(at.x-p.x,at.y-p.y);
      if(pointed)assert.ok(d<1e-10);
      else if(r.id==='ce'&&p.polarity>0){
        assert.ok(d<1e-10);
        const before=roundedPoint(p,points[i-1],points[i+1],r.params,.5-1e-5);
        const after=roundedPoint(p,points[i-1],points[i+1],r.params,.5+1e-5);
        const u={x:p.x-before.x,y:p.y-before.y},v={x:after.x-p.x,y:after.y-p.y};
        const cosine=(u.x*v.x+u.y*v.y)/(Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y));
        assert.ok(cosine>.999999,'The rounded crest must have a continuous tangent.');
      }else assert.ok(d>1e-6);
    }
  }
  assert.throws(()=>simpleButtercupRecipe('bad'),RangeError);
});
test('requested lab numbers contain the five reviewed replacements',()=>{
  const names={18:'Magnolia / Elliptic blade',25:'Ivy / soft scallops',26:'Maple / slender lobes',27:'Buttercup / simple pointed apex',30:'Walnut / fine leaflets'};
  for(const [id,name] of Object.entries(names)){
    const p=VARIATIONS[Number(id)-17];assert.equal(p.name,name);
    const g=generate(p);assert.deepEqual(g.stops,[]);assert.equal(g.steps[0].operation,'E');
  }
});
test('the simplified comparison and construction plates export valid finite structures',()=>{
  for(const svg of [bladeConfigurationSvg(),bladeConfigurationSvg({filled:true}),bladeDevelopmentSvg(),bladeDevelopmentSvg({profile:'ee',filled:true})]){
    assert.ok(svg.startsWith('<svg xmlns='));assert.ok(!/NaN|undefined|Infinity/.test(svg));
    const ids=[...svg.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  }
});
