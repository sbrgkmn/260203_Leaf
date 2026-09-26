import {generateGrowth,MAX_POINTS} from './growth.mjs?v=pole-pairs-2';

// Composition only: both the scaffold and every leaflet are built by the same
// archived E/C routine. There are no target contours, shape envelopes or tweens.
export function generateCompound(params){
  const scaffoldParams=structuredClone(params);scaffoldParams.stages[1].cycles=0;
  const scaffold=generateGrowth(scaffoldParams),steps=[...scaffold.steps];
  const final=scaffold.steps.at(-1);
  if(!final||!params.stages[1].cycles||scaffold.stops.length)return scaffold;
  const shoots=final.points.filter(p=>p.polarity>0).map(p=>({id:p.id,a:p.origin,b:p})).filter(s=>Math.hypot(s.b.x-s.a.x,s.b.y-s.a.y)>1e-6);
  const local=structuredClone(params),cycles=params.stages[1].cycles;
  local.stages=[{...structuredClone(params.stages[1]),cycles:Math.max(0,cycles-1)},
    {...structuredClone(params.leafletFinish),cycles:Math.min(1,cycles)}];
  local.variant={...params.variant,firstRotationFull:false};local.trajectory='tip';
  const blades=generateGrowth(local),stops=[...blades.stops];
  for(const frame of blades.steps){
    if(frame.pointCount*shoots.length>MAX_POINTS){stops.push('Compound recursion reached the 12,000-point limit.');break;}
    const points=[],controlPoints=[],surfaces=[],branches=[],axes=[],edges=[],events=[];
    for(const shoot of shoots){
      const dx=(shoot.b.x-shoot.a.x)/10,dy=(shoot.b.y-shoot.a.y)/10;
      const transform=p=>({x:shoot.a.x+p.x*dy+p.y*dx,y:shoot.a.y-p.x*dx+p.y*dy});
      const point=p=>({...p,...transform(p),origin:transform(p.origin),id:shoot.id+'/'+p.id,phase:1});
      points.push(...frame.points.map(point));controlPoints.push(...frame.controlPoints.map(point));
      surfaces.push(...frame.surfaces.map(s=>s.map(transform)));
      const segment=s=>({...s,a:transform(s.a),b:transform(s.b),depth:(s.depth??0)+1});
      branches.push(...frame.branches.map(segment));axes.push(...frame.axes.map(segment));
      edges.push(...frame.edges.map(e=>({...e,a:point(e.a),b:point(e.b),id:shoot.id+'/'+e.id,phase:1})));
      events.push(...frame.events.map(e=>({...e,center:transform(e.center),point:shoot.id+'/'+e.point,phase:1})));
    }
    steps.push({...frame,stage:2,points,controlPoints,surfaces,branches,axes,edges,events,
      pointCount:points.length,activeCount:edges.filter(e=>e.active).length,dormantCount:edges.filter(e=>!e.active).length,
      cycle:Math.ceil((steps.length-scaffold.steps.length+1)/2),limits:[final.limits[0],frame.limits[0]+frame.limits[1]],shoots});
  }
  return {steps,stops};
}
