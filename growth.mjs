// A persistent shoot framework, followed by local blade and margin development.
// E/C deform the surface; only the structural stage establishes primary shoots.
import { displace, lerp, distance } from './leaf.mjs';

export const STAGES = ['Establish shoots', 'Develop blades', 'Refine margins'];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const point=(x,y,axis,role='margin')=>({x,y,axis,role});
const mix=(a,b,t)=>a+(b-a)*t;
export function profileAt(profile,t) {
  t=clamp(t,0,1);
  return t<.5?mix(profile[0],profile[1],t*2):mix(profile[1],profile[2],(t-.5)*2);
}
function project(p,axis) {
  const dx=axis.b.x-axis.a.x,dy=axis.b.y-axis.a.y;
  return lerp(axis.a,axis.b,clamp(((p.x-axis.a.x)*dx+(p.y-axis.a.y)*dy)/(dx*dx+dy*dy||1),0,1));
}
function intersect(a,b,c,d) {
  const side=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
  return side(a,b,c)*side(a,b,d)<-1e-13&&side(c,d,a)*side(c,d,b)<-1e-13;
}
export function isSimple(points) {
  for(let i=0;i<points.length;i++)for(let j=i+2;j<points.length;j++) {
    if(i===0&&j===points.length-1)continue;
    if(intersect(points[i],points[(i+1)%points.length],points[j],points[(j+1)%points.length]))return false;
  }
  return true;
}
function area(points) {
  return points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p.x*q.y-p.y*q.x;},0)/2;
}
const mirror=p=>({...p,x:-p.x,axis:p.axis?{...p.axis,a:{...p.axis.a,x:-p.axis.a.x},b:{...p.axis.b,x:-p.axis.b.x}}:undefined});
const bilateral=half=>[...half,...half.slice(1,-1).reverse().map(mirror)];
function ordered(points) {return area(points)>0?points:[...points].reverse();}

// Profiles act along the whole shoot sequence, independently of recursion density.
export function framework(params) {
  const g=params.growth,rule=params.stages[0].expansion;
  const radial=params.trajectory==='base';
  const top=radial?g.start+(1-g.start)*(g.terminalScale??1):1;
  const root={id:'axis',a:{x:0,y:0},b:{x:0,y:top},depth:0,station:.5};
  const terminal={id:'terminal',a:{x:0,y:radial?g.start:g.end},b:{x:0,y:top},depth:1,station:1};
  const axes=[];
  for(let i=0;i<g.shoots;i++) {
    const t=g.shoots===1?.5:i/(g.shoots-1),s=Math.pow(t,g.spacing);
    const station=radial?1-t:t;
    const gain=profileAt(g.profile,station),strength=Math.abs(rule.intensity)/.45;
    let a,b;
    if(radial) {
      const angle=clamp(g.spread*Math.pow((i+1)/(g.shoots+.35),g.spacing)+(rule.position-.5)*5+(rule.rotation-20)*(t+.2)*.35+(g.tipRotation||0)*station,.5,177)*Math.PI/180;
      a={x:0,y:g.start};
      const length=(1-g.start)*g.width*gain*strength;
      b={x:Math.max(.012,Math.sin(angle)*length),y:a.y+Math.cos(angle)*length};
    } else {
      const y=mix(g.start,g.end,clamp(s+(rule.position-.5)*.25,0,1));
      a={x:0,y};
      const angle=clamp(g.spread+rule.rotation-20+(g.tipRotation||0)*t,-20,70)*Math.PI/180;
      const x=g.width*gain*strength;
      b={x,y:y+x*Math.tan(angle)};
    }
    axes.push({id:`shoot-${i}`,a,b,depth:1,station,order:i});
  }
  return {root,terminal,axes};
}
function blade(axis,width,peak=.55,rotation=0) {
  const {a,b}=axis,len=distance(a,b),normal={x:-(b.y-a.y)/len,y:(b.x-a.x)/len};
  const side=(t,w)=>{const p=lerp(a,b,t),v=displace(p,normal,w,rotation*Math.sign(w));return point(v.x,v.y,axis);};
  return ordered([point(a.x,a.y,axis,'base'),side(peak*.5,width*.7),side(peak,width),side((1+peak)*.5,width*.6),
    point(b.x,b.y,axis,'tip'),side((1+peak)*.5,-width*.6),side(peak,-width),side(peak*.5,-width*.7)]);
}
function compoundSurfaces(axes,terminal,g,phase,rule) {
  const surfaces=[];
  const separation=phase==='C'?Math.max(.025,1-rule.contraction.intensity):1;
  // The apical frontier shrinks as attachment sites advance up the axis.
  // Its E blade and C stalk explain the large phase contrast in compound series.
  const frontier={...terminal,a:axes.at(-1)?.a||terminal.a};
  for(const axis of [...axes,frontier]) {
    const breadth=axis.id==='terminal'&&phase==='E'?.25:g.leafletWidth;
    const width=distance(axis.a,axis.b)*breadth*separation;
    surfaces.push(shootSurface(axis,width,axis.id,phase==='C'?.3+rule.contraction.position*.4:.55,phase==='C'?rule.contraction.rotation:0));
  }
  return surfaces;
}
function shootSurface(axis,width,id=axis.id,peak=.55,rotation=0) {
  let points=blade(axis,width,peak,rotation);
  const half=axis.a.x===0&&axis.b.x===0;
  if(half)points=[points.find(p=>p.role==='base'),...points.filter(p=>p.x>0).sort((a,b)=>a.y-b.y),points.find(p=>p.role==='tip')];
  return {id,axis,points,half,mirror:!half};
}
function joinedSurface(axes,root,terminal,params,phase,activeIds) {
  const rule=params.stages[0],radial=params.trajectory==='base';
  const orderedAxes=radial?[...axes].reverse():axes;
  const tips=[...orderedAxes,terminal];
  const half=[point(0,params.growth.start*.65,root,'base')];
  for(let i=0;i<tips.length;i++) {
    const axis=tips[i],prior=i?tips[i-1]:null;
    if(prior) {
      const expanding=phase==='E'&&(activeIds.has(axis.id)||activeIds.has(prior.id));
      const mid=lerp(prior.b,axis.b,expanding?.5:rule.contraction.position);
      const center=lerp(prior.a,axis.a,.5);
      const depth=expanding?0:rule.contraction.intensity;
      const v=displace(mid,{x:center.x-mid.x,y:center.y-mid.y},depth,rule.contraction.rotation);
      half.push(point(Math.max(.002,v.x),v.y,axis,'sinus'));
    }
    half.push(point(axis.b.x,axis.b.y,axis,'tip'));
  }
  return [{id:'blade',axis:root,points:ordered(half),half:true,mirror:false}];
}
function allBranches(tree,axes) {return [tree.root,...axes,tree.terminal];}
function secondaryFramework(axes,pairs,stageProgress) {
  const result=[];
  const count=Math.max(1,Math.ceil(pairs*stageProgress));
  for(const parent of axes) {
    const dx=parent.b.x-parent.a.x,dy=parent.b.y-parent.a.y,len=Math.hypot(dx,dy);
    for(let i=0;i<count;i++)for(const sign of [-1,1]) {
      const t=.18+.65*(i+.5)/pairs,a=lerp(parent.a,parent.b,t);
      const size=len*.19*Math.pow(1-t,.6);
      const b={x:a.x+(dx/len*.5-dy/len*sign)*size,y:a.y+(dy/len*.5+dx/len*sign)*size};
      // Right-half shoots keep their leaflets on the right of the central rachis.
      if(Math.min(a.x,b.x)<.004)continue;
      result.push({id:`${parent.id}-pinna-${i}-${sign}`,a,b,depth:2,station:t,parent:parent.id});
    }
  }
  return result;
}
function roleGain(p,rule) {
  if(p.role==='base'||p.role==='tip'||p.role==='sinus')return 0;
  const target=rule.target||'all';
  if(target==='upper'&&p.axis.station<.5)return 0;
  if(target==='lower'&&p.axis.station>.5)return 0;
  if(target==='tips'&&distance(p,p.axis.b)>distance(p.axis.a,p.axis.b)*.4)return 0;
  return 1;
}
// Signed local displacement, with a backoff only when a polygon would fold.
// Existing shoot tips and bases are anchors; new margin points never become primary axes.
function develop(surface,rule,operation,stageIndex,cycle,budget) {
  const control=operation==='E'?rule.expansion:rule.contraction;
  const attenuation=Math.pow(rule.decay??.65,cycle-1),scale=stageIndex===1?.65:(operation==='E'?.65:.8);
  const source=surface.points,subdivide=stageIndex===2||cycle===1;
  const draft=[];
  for(let i=0;i<source.length;i++) {
    const a=source[i],b=source[(i+1)%source.length];draft.push(a);
    if(subdivide&&!(surface.half&&a.x===0&&b.x===0)&&distance(a,b)>rule.minLength&&draft.length+source.length-i<budget) {
      const axis=a.role==='sinus'||a.role==='base'?b.axis:a.axis;
      const origin=lerp(a,b,control.position);
      draft.push({...point(origin.x,origin.y,axis),phase:operation});
    }
  }
  for(let attempt=0;attempt<12;attempt++) {
    const factor=scale*attenuation*Math.pow(.5,attempt);
    const points=draft.map((p,i)=>{
      const gain=roleGain(p,rule);if(!gain)return p;
      if(surface.half&&p.x===0)return p;
      if(stageIndex===2&&source.includes(p))return p;
      if(operation==='C'&&p.phase==='E')return p;
      const previous=draft[(i+draft.length-1)%draft.length],next=draft[(i+1)%draft.length];
      const center=project(p,p.axis),side=p.x<center.x?-1:1;
      let vector;
      if(operation==='E') {
        // Clockwise normal to a counterclockwise polygon is outward.
        vector={x:(next.y-previous.y)*.5,y:(previous.x-next.x)*.5};
      } else vector={x:center.x-p.x,y:center.y-p.y};
      const station=clamp(p.axis.station??.5,0,1);
      const spatial=profileAt(rule.profile||[1,1,1],station);
      const length=distance(p.axis.a,p.axis.b);
      const along=length?distance(p.axis.a,center)/length:.5;
      const taper=surface.half?1:Math.pow(Math.max(0,Math.sin(Math.PI*along)),.7);
      const moved=displace(p,vector,control.intensity*factor*gain*spatial*taper,control.rotation*side);
      return {...p,...moved};
    });
    if(area(points)*area(source)>0&&isSimple(points)&&(!(surface.mirror||surface.half)||points.every(p=>p.x>=0))) {
      return {surface:{...surface,points},limited:attempt>0};
    }
  }
  return {surface,limited:true};
}
function localVeins(surfaces) {
  const groups=new Map(),veins=[];
  for(const surface of surfaces)for(const p of surface.points) {
    if(p.x<0||p.role==='base'||p.role==='tip')continue;
    const key=p.axis.id,group=groups.get(key)||[];group.push(p);groups.set(key,group);
  }
  for(const group of groups.values()) {
    const axis=group[0].axis,dx=axis.b.x-axis.a.x,dy=axis.b.y-axis.a.y,len2=dx*dx+dy*dy;
    if(axis.depth>1)continue;
    for(const t of [.3,.55,.78])for(const sign of [-1,1]) {
      let best=null,score=Infinity;
      for(const p of group) {
        const cross=dx*(p.y-axis.a.y)-dy*(p.x-axis.a.x);if(Math.sign(cross)!==sign)continue;
        const station=((p.x-axis.a.x)*dx+(p.y-axis.a.y)*dy)/len2;
        const error=Math.abs(station-t);if(error<score){score=error;best=p;}
      }
      if(best&&score<.22)veins.push({a:lerp(axis.a,axis.b,Math.max(.08,t-.12)),b:{x:best.x,y:best.y},depth:axis.depth+1});
    }
  }
  return veins;
}
export function generateGrowth(params) {
  if(params.stages[0].expansion.intensity===0)return {steps:[],stops:['Initial E intensity is zero; increase it to establish a surface.']};
  const tree=framework(params),g=params.growth,steps=[],stops=[];
  let axes=[],surfaces=[],branches=[tree.root],limited=false,surfaceCapacity=0;
  const snapshot=(operation,stageIndex,cycle,rule)=>{
    const full=[],halfFlags=[];
    for(const surface of surfaces) {
      full.push(surface.half?bilateral(surface.points):surface.points);
      halfFlags.push(!!surface.half);
      if(surface.mirror){full.push(surface.points.map(mirror));halfFlags.push(false);}
    }
    const points=full.flat();
    const refinementBranches=stageIndex?localVeins(surfaces):[];
    steps.push({surfaces:full,halfFlags,branches:[...branches,...refinementBranches],operation,stage:stageIndex+1,
      cycle,intensity:rule[operation==='E'?'expansion':'contraction'].intensity,
      primaryCount:axes.length*2+1,pointCount:points.length,
      stageName:STAGES[stageIndex],added:points.length});
  };
  for(const [stageIndex,rule] of params.stages.entries()) {
    const cycles=clamp(Math.floor(rule.cycles),0,20);if(!cycles)continue;
    for(let cycle=1;cycle<=cycles;cycle++) {
      if(stageIndex===0||!surfaces.length) {
        const count=stageIndex===0?Math.ceil(g.shoots*cycle/cycles):g.shoots;
        const previous=new Set(axes.map(a=>a.id));axes=tree.axes.slice(0,count);
        const active=new Set(axes.filter(a=>!previous.has(a.id)).map(a=>a.id));active.add('terminal');
        branches=allBranches(tree,axes);
        const pair=[];
        for(const operation of ['E','C']) {
          const proposed=g.family==='compound'?compoundSurfaces(axes,tree.terminal,g,operation,params.stages[0]):joinedSurface(axes,tree.root,tree.terminal,params,operation,active);
          if(proposed.some(s=>!isSimple(s.points)||(s.mirror||s.half)&&s.points.some(p=>p.x<0))) {
            stops.push('Framework would fold. Reduce branch angle, reach, or structural C intensity.');
            return {steps,stops};
          }
          pair.push(proposed);
        }
        for(const [i,operation] of ['E','C'].entries()) {
          surfaces=pair[i];
          snapshot(operation,stageIndex,cycle,rule);
        }
        if(stageIndex===0)continue;
        // If structure is skipped, the first active stage develops the complete framework.
        steps.splice(-2);
      }
      if(stageIndex===1&&g.family==='compound'&&g.secondaryPairs>0) {
        const pairs=Math.min(g.secondaryPairs,Math.max(1,Math.floor((240-axes.length-1)/(axes.length*2))));
        // Reserve detail for the complete hierarchy, including shoots born in later cycles.
        surfaceCapacity=axes.length*2*pairs+axes.length+1;
        if(pairs<g.secondaryPairs&&!stops.some(s=>s.startsWith('Secondary density')))stops.push(`Secondary density limited to ${pairs} pairs per shoot to keep geometry bounded.`);
        const secondary=secondaryFramework(axes,pairs,cycle/cycles);
        const known=new Map(surfaces.map(s=>[s.id,s]));
        surfaces=secondary.map(axis=>known.get(axis.id)||shootSurface(axis,distance(axis.a,axis.b)*.05));
        // A small terminal blade closes each primary rachis.
        for(const axis of [...axes,tree.terminal]) {
          const end={...axis,a:lerp(axis.a,axis.b,.82)};
          surfaces.push(known.get(`${axis.id}-end`)||shootSurface(end,distance(end.a,end.b)*.16,`${axis.id}-end`));
        }
        branches=[...allBranches(tree,axes),...secondary];
      }
      for(const operation of ['E','C']) {
        const budget=Math.max(8,Math.min(512,Math.floor(2000/Math.max(surfaces.length,surfaceCapacity))));
        const developed=surfaces.map(s=>develop(s,rule,operation,stageIndex,cycle,budget));
        surfaces=developed.map(d=>d.surface);limited||=developed.some(d=>d.limited);
        snapshot(operation,stageIndex,cycle,rule);
      }
    }
  }
  if(limited)stops.push('Some local displacements were reduced to preserve the blade boundary.');
  return {steps,stops};
}
