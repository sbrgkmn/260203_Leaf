import {lerp} from './geometry.mjs';

export function rationalBezier(a,b,c,t,w) {
  const u=1-t,aa=u*u,bb=2*u*t*w,cc=t*t,denominator=aa+bb+cc;
  return {x:(aa*a.x+bb*b.x+cc*c.x)/denominator,y:(aa*a.y+bb*b.y+cc*c.y)/denominator};
}
export function roundedPoint(p,left,right,params,t=.5) {
  const fraction=params.roundPosition??.5;
  return rationalBezier(lerp(p,left,fraction),p,lerp(p,right,1-fraction),t,
    p.polarity>0?params.positiveWeight:params.negativeWeight);
}
// Original RoundEdges: separate rational weights for positive and negative poles.
export function bladeBoundary(points,params) {
  if(!params.rounding)return points;
  const result=[points[0]];
  for(let i=1;i<points.length-1;i++)for(let j=0;j<=20;j++) {
    result.push(roundedPoint(points[i],points[i-1],points[i+1],params,j/20));
  }
  result.push(points.at(-1));
  return result;
}
