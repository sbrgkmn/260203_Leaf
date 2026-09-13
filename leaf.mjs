// Geometry helpers and SVG drawing. Development lives in growth.mjs.
import { generateGrowth } from './growth.mjs';
export { PRESETS } from './presets.mjs';
export const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
export const distance=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const generate=generateGrowth;
export const boundary=step=>step.surfaces.flat();
export function displace(origin, vector, intensity, rotation) {
  const angle=rotation*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
  return {x:origin.x+(vector.x*c-vector.y*s)*intensity,
          y:origin.y+(vector.x*s+vector.y*c)*intensity};
}
function project(point,axis) {
  const dx=axis.b.x-axis.a.x,dy=axis.b.y-axis.a.y;
  const t=clamp(((point.x-axis.a.x)*dx+(point.y-axis.a.y)*dy)/(dx*dx+dy*dy||1),0,1);
  return lerp(axis.a,axis.b,t);
}
export function frameFor(steps) {
  let extent=.02,minY=-.075,maxY=1;
  for(const step of steps)for(const p of boundary(step)) {
    extent=Math.max(extent,Math.abs(p.x));minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
  }
  const size=Math.max(extent*2,maxY-minY)*1.16;
  return {x:-size/2,y:(minY+maxY-size)/2,size};
}
// Quadratic corner subdivision affects only the display, never recursion geometry.
export function outlinePath(points,smoothing) {
  const n=points.length,round=clamp(smoothing,0,1)*.48;
  const fmt=p=>`${p.x.toFixed(6)} ${(-p.y).toFixed(6)}`;
  if(!round)return `M ${points.map(fmt).join(' L ')} Z`;
  let path='';
  points.forEach((p,i)=>{
    // Keep the base fixed so the smoothed blade remains attached to its stem.
    const amount=i===0?0:round;
    const incoming=lerp(p,points[(i+n-1)%n],amount),outgoing=lerp(p,points[(i+1)%n],amount);
    path+=`${i?' L':'M'} ${fmt(incoming)} Q ${fmt(p)} ${fmt(outgoing)}`;
  });
  return path+' Z';
}
// Remove detail below a display-scale tolerance before rounding, so smoothing
// does not disappear merely because later stages inserted more control points.
function displayContour(points,smoothing) {
  if(smoothing<.45||points.length<12)return points;
  const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
  const tolerance=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys))*.022*smoothing;
  let result=[...points],changed=true;
  while(changed&&result.length>8) {
    changed=false;
    for(let i=result.length-1;i>0&&result.length>8;i--) {
      const a=result[(i+result.length-1)%result.length],b=result[(i+1)%result.length],p=result[i];
      if(p.role==='base'||p.role==='tip'||p.role==='sinus')continue;
      if(distance(p,project(p,{a,b}))<tolerance){result.splice(i,1);changed=true;}
    }
  }
  return result;
}
export function svgFor(step,params,frame,id='leaf') {
  const {x,y,size}=frame,points=boundary(step),d=step.surfaces.map((p,i)=>{
    let shape;
    if(step.halfFlags[i]){const half=displayContour(p.slice(0,p.length/2+1),params.smoothing);shape=[...half,...half.slice(1,-1).reverse().map(p=>({...p,x:-p.x}))];}
    else shape=displayContour(p,params.smoothing);
    return outlinePath(shape,params.smoothing);
  }).join(' '),stroke=size/450;
  const line=(a,b,width,color)=>`<path d="M ${a.x} ${-a.y} L ${b.x} ${-b.y}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  let veins='';
  if(params.veins)for(const branch of step.branches) {
    const width=stroke*(branch.depth===0?1.25:Math.max(.45,1-branch.depth*.12));
    veins+=line(branch.a,branch.b,width,'white');
    if(branch.depth)veins+=line({...branch.a,x:-branch.a.x},{...branch.b,x:-branch.b.x},width,'white');
  }
  const dots=params.points?points.map(p=>`<circle cx="${p.x}" cy="${-p.y}" r="${stroke*1.8}" fill="${p.polarity>0?'black':'white'}" stroke="#777" stroke-width="${stroke*.4}"/>`).join(''):'';
  let stems='';
  if(step.surfaces)for(const b of step.branches.filter(b=>b.id)) {
    const width=stroke*(b.depth===0?3:1.8);
    stems+=line(b.a,b.b,width,'black');
    if(b.depth)stems+=line({...b.a,x:-b.a.x},{...b.b,x:-b.b.x},width,'black');
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${-y-size} ${size} ${size}" role="img" aria-label="${step.operation==='E'?'Expansion':'Contraction'}, stage ${step.stage}, cycle ${step.cycle}" width="800" height="800"><rect x="${x}" y="${-y-size}" width="${size}" height="${size}" fill="white"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>${line({x:0,y:-.065},{x:0,y:.025},stroke*2,'black')}${stems}<path d="${d}" fill="black"/><g clip-path="url(#${id})">${veins}</g>${dots}</svg>`;
}
