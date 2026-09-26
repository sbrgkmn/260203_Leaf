import {lerp} from './geometry.mjs';

export function rationalBezier(a,b,c,t,w) {
  const u=1-t,aa=u*u,bb=2*u*t*w,cc=t*t,denominator=aa+bb+cc;
  return {x:(aa*a.x+bb*b.x+cc*c.x)/denominator,y:(aa*a.y+bb*b.y+cc*c.y)/denominator};
}
function cubic(a,b,c,d,t){
  const u=1-t;
  return {x:u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x,
    y:u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y};
}
export function roundedPoint(p,left,right,params,t=.5) {
  const fraction=params.roundPosition??.5;
  let a=lerp(p,left,fraction),b=lerp(p,right,1-fraction);
  // Rounded lobes can span the whole interval between exact lower anchors.
  // Collapse the adjacent negative arc ends to those anchors, avoiding overlap.
  if(params.anchoredLobes){
    if(p.polarity>0){if(left.polarity<0)a=left;if(right.polarity<0)b=right;}
    else {if(left.polarity>0)a=p;if(right.polarity>0)b=p;}
    if(p.polarity>0&&left.polarity<0&&right.polarity<0){
      // Two tangent-continuous arcs swell between fixed nodes and meet at a
      // rounded crest. Retain the crest height instead of shrinking the lobe.
      const span=Math.hypot(b.x-a.x,b.y-a.y)||1;
      const handle=.28*Math.min(Math.hypot(p.x-a.x,p.y-a.y),Math.hypot(p.x-b.x,p.y-b.y));
      const v={x:(b.x-a.x)/span*handle,y:(b.y-a.y)/span*handle};
      return t<=.5?cubic(a,a,{x:p.x-v.x,y:p.y-v.y},p,t*2):
        cubic(p,{x:p.x+v.x,y:p.y+v.y},b,b,t*2-1);
    }
  }
  // Optional study finish: select upper tips and lower anchoring nodes independently.
  // Saved recipes omit these fields and retain their original rational curves.
  const pointed=p.polarity>0?(params.apices==='all'||
    (params.apices==='terminal'&&p.id==='apex')||(params.apices==='lateral'&&p.id!=='apex')):params.sinuses==='pointed';
  if(pointed)return t<=.5?lerp(a,p,t*2):lerp(p,b,(t-.5)*2);
  return rationalBezier(a,p,b,t,
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
