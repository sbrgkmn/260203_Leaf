import {createGenerator} from './generator.mjs?v=studio-1';
export {PRESETS} from './presets.mjs?v=studio-1';
export {lerp,distance,displace} from './geometry.mjs';
export const generate=createGenerator();
export const boundary=step=>step.surfaces.flat();
export function frameFor(steps) {
  let extent=.1,minY=0,maxY=10;
  for(const step of steps)for(const p of boundary(step)) {
    extent=Math.max(extent,Math.abs(p.x));minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
  }
  const size=Math.max(extent*2,maxY-minY)*1.12;
  return {x:-size/2,y:(minY+maxY-size)/2,size};
}
const fmt=p=>`${p.x.toFixed(6)} ${(-p.y).toFixed(6)}`;
export const outlinePath=points=>`M ${points.map(fmt).join(' L ')} Z`;
export function svgFor(step,params,frame,id='leaf') {
  const {x,y,size}=frame,d=step.surfaces.map(outlinePath).join(' '),stroke=size/600;
  const line=(a,b,width,color)=>`<path d="M ${fmt(a)} L ${fmt(b)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  const veins=params.veins?step.branches.map(b=>line(b.a,b.b,stroke*(b.depth===0?1.3:.8),'white')).join(''):'';
  const dots=params.points?step.controlPoints.map(p=>`<circle cx="${p.x}" cy="${-p.y}" r="${stroke*1.8}" fill="${p.polarity>0?'#00a083':'white'}" stroke="#777" stroke-width="${stroke*.4}"/>`).join(''):'';
  const frontier=params.frontier?step.edges.map(e=>line(e.a,e.b,stroke*(e.active?2.5:.8),e.active?'#009b82':'#a5a9a3')).join(''):'';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${-y-size} ${size} ${size}" role="img" aria-label="${step.operation==='E'?'Expansion':'Contraction'}, stage ${step.stage}, cycle ${step.cycle}" width="800" height="800"><rect x="${x}" y="${-y-size}" width="${size}" height="${size}" fill="white"/><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="black" stroke="black" stroke-width="${stroke*.5}"/><g clip-path="url(#${id})">${veins}</g>${frontier}${dots}</svg>`;
}
