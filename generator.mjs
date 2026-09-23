import {generateGrowth,drawLeaf} from './growth.mjs?v=studio-1';
export function createGenerator(limit=24) {
  const cache=new Map();
  return params=>{
    const key=JSON.stringify([params.seedHalfWidth,params.trajectory,params.leftRightPosition,params.leftRightIntensity,params.stages,params.variant]);
    let geometry=cache.get(key);
    if(!geometry){
      geometry=generateGrowth(params,{draw:false});
      const shared=new Map();
      for(const frame of geometry.steps){
        const signature=JSON.stringify([frame.points,frame.axes]);
        const previous=shared.get(signature);
        if(previous){frame.points=previous.points;frame.controlPoints=previous.controlPoints;frame.axes=previous.axes;}
        else shared.set(signature,frame);
      }
      cache.set(key,geometry);
      if(cache.size>limit)cache.delete(cache.keys().next().value);
    }
    const drawings=new Map();
    const steps=geometry.steps.map(frame=>{
      let drawing=drawings.get(frame.points);
      if(!drawing){drawing=drawLeaf(frame,params);drawings.set(frame.points,drawing);}
      return {...frame,branches:drawing.branches,surfaces:drawing.surfaces};
    });
    return {steps,stops:[...geometry.stops]};
  };
}
