import {PRESETS,generate} from './leaf.mjs?v=pole-pairs-2';
import {studyParams} from './presets.mjs?v=studio-1';
import {lerp,distance} from './geometry.mjs';
import {rationalBezier} from './blade.mjs?v=pole-pairs-2';

export function simpleBladeRecipe(){
  const p=studyParams(PRESETS.find(p=>p.name==='Buttercup'));
  p.name='Three shoots';p.stages[0].cycles=1;p.stages[1].cycles=0;
  p.stages[0].contraction.intensity=.7;
  p.rounding=true;p.positiveWeight=.7;p.negativeWeight=.6;
  return p;
}
export const signedArea=points=>points.reduce((a,p,i)=>{const q=points[(i+1)%points.length];return a+p.x*q.y-q.x*p.y;},0)/2;
// A study-only finishing operation, after E/C. Zero retains rational rounding.
// The offset and its first derivative vanish at every arc join, preserving tangency.
export function bowedBoundary(points,{bulge=0,positiveWeight=.7,negativeWeight=.6,samples=100}={}){
  const orientation=Math.sign(signedArea(points))||1,result=[{x:points[0].x,y:points[0].y}];
  for(let i=1;i<points.length-1;i++){
    const p=points[i],a=lerp(p,points[i-1],.5),b=lerp(p,points[i+1],.5);
    const w=p.polarity>0?positiveWeight:negativeWeight;
    const length=Math.min(distance(p,points[i-1]),distance(p,points[i+1]));
    for(let j=0;j<=samples;j++){
      const t=j/samples,q=rationalBezier(a,p,b,t,w);
      const dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;
      const offset=(p.id==='L.0:C'||p.id==='R.0:C'?0:bulge)*length*16*t*t*(1-t)*(1-t);
      result.push({x:q.x+orientation*dy/l*offset,y:q.y-orientation*dx/l*offset});
    }
  }
  result.push({x:points.at(-1).x,y:points.at(-1).y});return result;
}
export function simpleBlade(bulge=0,negativeWeight=.6){
  const params=simpleBladeRecipe(),steps=generate(params).steps,source=steps.at(-1);
  return {params,source,steps,step:{...source,surfaces:[bowedBoundary(source.controlPoints,{bulge,negativeWeight})]}};
}
