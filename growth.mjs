// Port of the supplied Grasshopper Leaf / EXP / CON recursion.
// Per-file differences are data (thresholds, stem rules, vector mode), not species branches.
import {lerp,distance,displace} from './geometry.mjs';
import {bladeBoundary,roundedPoint} from './blade.mjs?v=studio-1';
export {isSimple} from './geometry.mjs';
export const STAGES=['Shoots','Blades'];
export const MAX_POINTS=12000;
const xy=p=>({x:p.x,y:p.y});
const axis=(a,b)=>({a:xy(a),b:xy(b)});
const clamp=(v,min=0)=>Math.min(1,min===null?v:Math.max(min,v));

// Schedules alternate E/C. Extending a sequence holds the last value of each parity.
export function scheduleAt(values,g) {
  if(g<values.length)return values[g];
  const last=values.length-1;
  return values[last-((last-g)%2!==0?1:0)]??values[0]??0;
}

export function buildLeaf(params,limits=params.stages.map(s=>Math.round(s.cycles*2)),draw=true) {
  const points=[],connectors=[],terminals=[],events=[];
  const variant=params.variant,radial=params.trajectory==='base';
  function point(loc,positive,origin,id,phase=-1,g=-1) {
    if(points.length>=MAX_POINTS)throw new RangeError('Recursion reached the 12,000-point limit.');
    const p={...xy(loc),polarity:positive?1:-1,origin:xy(origin),id,phase,g,left:null,right:null};
    points.push(p);return p;
  }
  const base={x:0,y:0},tip={x:0,y:10};
  const A=point({x:-params.seedHalfWidth,y:0},false,base,'base-left');
  const B=point(tip,true,base,'apex');
  const C=point({x:params.seedHalfWidth,y:0},false,lerp(base,tip,params.stages[0].positions[0]),'base-right');
  A.right=B;B.left=A;B.right=C;C.left=A;
  function insert(p,a,b,dir) {
    if(dir>0){p.left=a;p.right=b;a.right=p;b.left=p;}
    else {p.right=a;p.left=b;a.left=p;b.right=p;}
  }
  function leaf(a,b,vein,expanding,g,origin,dir,enabled,phase,rPol,rInt,path) {
    const rule=params.stages[phase],tol=expanding?rule.minExpansionLength:rule.minContractionLength;
    const eligible=(a.polarity>0||b.polarity>0)&&(tol===null||distance(a,b)>tol);
    if(!eligible||g>=limits[phase]) {
      if(phase===0&&limits[1]>0)leaf(a,b,vein,true,0,origin,dir,true,1,rPol,rInt,path+':blade');
      else terminals.push({a,b,active:eligible&&(!expanding||enabled),phase,g,operation:expanding?'E':'C'});
      return;
    }
    // A dormant expansion consumes depth, but does not insert a point.
    if(expanding&&!enabled){leaf(a,b,vein,true,g+1,origin,dir,false,phase,rPol,rInt,path);return;}
    const operation=expanding?'E':'C',scale=expanding?rule.expansion:rule.contraction;
    const position=clamp(scheduleAt(rule.positions,g)*scale.position*(phase===0?1+rPol-.5:1),expanding?0:variant.contractionPositionMin);
    const intensity=clamp(scheduleAt(rule.intensities,g)*scale.intensity*
      (phase===0&&(expanding||variant.contractionLRIntensity)?1+rInt-.5:1),expanding?0:variant.contractionIntensityMin);
    let p;
    if(expanding) {
      // Unlike a normal displacement, E is anchored on the current vein axis.
      const center=lerp(vein.a,vein.b,position);
      let vector={x:b.x-a.x,y:b.y-a.y};
      if(variant.vectorMode==='axis') {
        const length=distance(a,b)/(distance(vein.a,vein.b)||1);
        vector={x:(vein.b.x-vein.a.x)*length,y:(vein.b.y-vein.a.y)*length};
      } else if(variant.vectorMode==='tipDistance') {
        const length=distance(b,center)/(distance(a,b)||1);
        vector={x:vector.x*length,y:vector.y*length};
      }
      const angle=rule.rotation*(variant.firstRotationFull&&g===0?1:1-position)*dir;
      p=point(displace(center,vector,intensity,angle),true,center,path+':E',phase,g);
      insert(p,a,b,dir);
      if(variant.connectOrigins)connectors.push({a:xy(a.origin),b:xy(center),depth:phase+1});
      b.origin=xy(center);
      events.push({operation,phase,g,position,intensity,center:xy(center),point:p.id});
      leaf(p,a,axis(center,a),false,g+1,center,-dir,phase===0&&enabled&&radial,phase,rPol,rInt,path+'.0');
      leaf(p,b,axis(center,b),false,g+1,center,dir,phase===0&&enabled&&!radial,phase,1-rPol,1-rInt,path+'.1');
    } else {
      // On a negative endpoint the source uses a separate stem position/intensity.
      const at=lerp(a,b,b.polarity>0?position:rule.stemPosition);
      const strength=b.polarity>0?intensity:g===1?rule.firstStemIntensity:rule.stemIntensity;
      p=point(lerp(at,origin,strength),false,origin,path+':C',phase,g);
      insert(p,a,b,dir);
      events.push({operation,phase,g,position,intensity:strength,center:xy(origin),point:p.id});
      const left=phase===0?radial&&enabled&&a.polarity>0:a.polarity>0;
      const right=phase===0?!radial&&enabled&&a.polarity>0:b.polarity>0;
      leaf(p,a,axis(origin,a),true,g+1,at,-dir,left,phase,rPol,rInt,path+'.0');
      leaf(p,b,vein,true,g+1,at,dir,right,phase,1-rPol,1-rInt,path+'.1');
    }
  }
  leaf(A,B,axis(base,tip),true,0,lerp(A,B,.5),1,true,0,params.leftRightPosition,params.leftRightIntensity,'L');
  leaf(C,B,axis(base,tip),true,0,lerp(C,B,params.stages[0].positions[0]),-1,true,0,1-params.leftRightPosition,1-params.leftRightIntensity,'R');
  const serial=p=>({...xy(p),id:p.id,polarity:p.polarity,origin:xy(p.origin),phase:p.phase,g:p.g});
  const ordered=[];
  for(let p=A;p;p=p.right){ordered.push(p);if(ordered.length>points.length)throw new Error('Invalid boundary linkage.');}
  const controlPoints=ordered.map(serial),axes=[{a:base,b:tip,depth:0},...connectors];
  const edges=terminals.map(t=>({id:[t.a.id,t.b.id].sort().join('/'),a:serial(t.a),b:serial(t.b),active:t.active,phase:t.phase,operation:t.operation}));
  const result={points:points.map(serial),controlPoints,edges,axes,events,pointCount:points.length,
    activeCount:edges.filter(e=>e.active).length,dormantCount:edges.filter(e=>!e.active).length,limits:[...limits]};
  return draw?drawLeaf(result,params):result;
}

export function drawLeaf(frame,params) {
  const {controlPoints}=frame,indices=new Map(controlPoints.map((p,i)=>[p.id,i]));
  const branches=[...frame.axes],variant=params.variant;
  for(const p of frame.points)if(p.polarity>0){
    const i=indices.get(p.id);if(i===0||i===controlPoints.length-1)continue;
    const atControl=variant.veinAtControlPoint||(variant.veinFollowsRounding&&!params.rounding);
    branches.push({id:p.id,a:xy(p.origin),b:atControl?xy(p):roundedPoint(p,controlPoints[i-1],controlPoints[i+1],{...params,roundPosition:.5}),depth:p.phase+1});
  }
  return {...frame,branches,surfaces:[bladeBoundary(controlPoints,params)]};
}

export function generateGrowth(params,{draw=true}={}) {
  const steps=[],stops=[],limits=params.stages.map(s=>Math.max(0,Math.min(40,Math.round(s.cycles*2))));
  for(let phase=0;phase<2;phase++)for(let depth=1;depth<=limits[phase];depth++) {
    try {
      const frame=buildLeaf(params,phase===0?[depth,0]:[limits[0],depth],draw);
      if(!frame.events.length)continue;
      const operation=depth%2?'E':'C',g=depth-1,rule=params.stages[phase];
      steps.push({...frame,operation,stage:phase+1,cycle:Math.ceil(depth/2),
        intensity:scheduleAt(rule.intensities,g)*rule[operation==='E'?'expansion':'contraction'].intensity});
    } catch(error) {
      if(!(error instanceof RangeError))throw error;
      stops.push(error.message);return {steps,stops};
    }
  }
  return {steps,stops};
}
