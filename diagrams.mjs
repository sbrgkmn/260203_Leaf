import {trajectoryStudies} from './trajectory-study.mjs?v=pole-pairs-2';
import {PRESETS,generate,frameFor,svgFor,outlinePath} from './leaf.mjs?v=pole-pairs-2';
import {studyParams} from './presets.mjs?v=studio-1';
import {lerp,displace} from './geometry.mjs';
import {rationalBezier} from './blade.mjs?v=pole-pairs-2';
import {simpleBlade,signedArea} from './blade-study.mjs?v=pole-pairs-2';
import {serialData,serialRecipes,bradyRecipe,BRADY_REFERENCE} from './brady-series.mjs?v=pole-pairs-2';
export {serialData,serialRecipes} from './brady-series.mjs?v=pole-pairs-2';

export const escapeXml=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const txt=(x,y,s,size=13,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${escapeXml(s)}</text>`;
const path=(ps,color='#111',width=1.5,dash='')=>`<path d="M ${ps.map(p=>`${p.x},${p.y}`).join(' L ')}" fill="none" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const dot=(p,label,filled=true)=>`<circle cx="${p.x}" cy="${p.y}" r="3.8" fill="${filled?'#111':'white'}" stroke="#111"/>${label?txt(p.x+8,p.y-8,label,12):''}`;
const documentSvg=(w,h,title,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${escapeXml(title)}"><title>${escapeXml(title)}</title><rect width="${w}" height="${h}" fill="white"/><g font-family="Arial, sans-serif" fill="#171c16">${body}</g></svg>`;
export const getStudy=name=>studyParams(PRESETS.find(p=>p.name===name));
// The default edge-vector rule. Direction is +1 on one flank, -1 on its mirror.
export function expansionGeometry(a,b,axisA,axisB,position,intensity,rotation,dir=1,firstFull=false){
  const center=lerp(axisA,axisB,position),angle=rotation*(firstFull?1:1-position)*dir;
  return {center,point:displace(center,{x:b.x-a.x,y:b.y-a.y},intensity,angle),angle};
}
export function contractionGeometry(a,b,origin,position,intensity){
  const at=lerp(a,b,position);return {at,point:lerp(at,origin,intensity)};
}
export function geometrySvg({position=.35,rotation=100,intensity=.65,contraction=.65}={}){
  const w=1120,h=1040;
  let body=txt(35,38,'A local operation, repeated on selected edges',23)+txt(35,64,'Gray: parameter family     Black: selected construction     Filled pole: E     Open pole: C');
  body+=txt(38,108,'E / EXPANSION',18)+txt(590,108,'C / CONTRACTION',18);
  for(let row=0;row<3;row++)for(let col=0;col<2;col++){
    const x=col*550+35,y=138+row*273;
    const title=col?['Position on edge','Inherited direction','Signed intensity'][row]:['Position on axis','Rotation of shoot','Intensity of shoot'][row];
    let panel=txt(0,0,title,16);
    // Geometry is drawn in Cartesian coordinates, then mapped to screen space.
    const a={x:0,y:0},b={x:8,y:0},origin={x:4,y:5};
    const project=p=>({x:60+p.x*26,y:178-p.y*23});
    const draw=(v,selected=false)=>{
      let ps,aux,pole,at;
      if(!col){
        const p=row===0?v:position,r=row===1?v:rotation,i=row===2?v:intensity;
        const result=expansionGeometry(a,b,a,b,p,i,r);
        pole=result.point;at=result.center;ps=[a,pole,b];aux=[at,pole];
      }else{
        const p=row===0?v:position,i=row===2?v:contraction;
        const o=row===1?{x:4+2*Math.sin(v*Math.PI/180),y:5}:origin;
        const result=contractionGeometry(a,b,o,p,i);
        pole=result.point;at=result.at;ps=[a,pole,b];aux=[at,o];
      }
      return path(ps.map(project),selected?'#111':'#bdc1b9',selected?2.5:.8)+
        (selected?path(aux.map(project),'#555',1,'3 4')+dot(project(at),'Q',false)+dot(project(pole),col?'P−':'P+'):'');
    };
    const family=col?(row===0?[.15,.3,.45,.6,.75,.9]:row===1?[-65,-40,0,40,65]:[-.35,0,.25,.5,.75,1]):
      (row===0?[.15,.3,.45,.6,.75,.9]:row===1?[20,40,60,80,100,120]:[.2,.35,.5,.65,.8,.95]);
    panel+=family.map(v=>draw(v)).join('');
    if(col)panel+=path([a,origin,b].map(project),'#888',1,'3 4')+dot(project(origin),'O');
    panel+=path([a,b].map(project),'#555',1)+draw(col?(row===0?position:row===1?0:contraction):(row===0?position:row===1?rotation:intensity),true);
    panel+=dot(project(a),'A',false)+dot(project(b),'B');
    panel+=txt(0,233,col?(row===0?'Q = (1 − p)A + pB':row===1?'O comes from the previous operation; no C rotation slider.':'P− = (1 − i)Q + iO; i < 0 moves away from O.'):
      (row===0?'Q lies on the current vein axis.':'P+ = Q + i · Rotate(B − A, θ); θ = r(1 − p)'),12);
    body+=`<g transform="translate(${x} ${y})">${panel}</g>`;
  }
  body+=txt(35,988,`Selected: position ${position.toFixed(2)} · E rotation ${rotation}° · E intensity ${intensity.toFixed(2)} · C intensity ${contraction.toFixed(2)}`,14);
  body+=txt(35,1014,'Edge-vector variant shown. E is clamped to 0–1; signed C depends on the saved definition. Stem endpoints use their own C rule.',12);
  return documentSvg(w,h,'Expansion and contraction: position, rotation and intensity',body);
}

function nest(svg,x,y,size){return svg.replace('<svg ',`<svg x="${x}" y="${y}" `).replace('width="800" height="800"',`width="${size}" height="${size}"`);}
export function constructionSvg(step,previous,frame,{filled=false,rounding=false}={},id='construction'){
  const {x,y,size}=frame,stroke=size/330;
  const d=outlinePath(rounding?step.surfaces[0]:step.controlPoints);
  const oldIds=new Set(previous?.points.map(p=>p.id)??['apex','base-left','base-right']);
  const line=(a,b,color,width=stroke,dash='')=>`<path d="M ${a.x} ${-a.y} L ${b.x} ${-b.y}" fill="none" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  let content=previous?`<path d="${outlinePath(previous.controlPoints)}" fill="none" stroke="#aaa" stroke-width="${stroke*.7}" stroke-dasharray="${stroke*2} ${stroke*2}"/>`:'';
  if(rounding&&!filled)content+=`<path d="${outlinePath(step.controlPoints)}" fill="none" stroke="#aaa" stroke-width="${stroke*.6}"/>`;
  content+=`<path d="${d}" fill="${filled?'black':'none'}" stroke="black" stroke-width="${stroke}"/>`;
  content+=`<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g ${filled?`clip-path="url(#${id})"`:''}>`;
  content+=step.axes.map(b=>line(b.a,b.b,filled?'white':'#c2c2c2',stroke*.6)).join('');
  content+=step.points.filter(p=>p.polarity>0).map(p=>line(p.origin,p,filled?'white':'#aaa',stroke*.6)).join('')+'</g>';
  if(!filled)content+=step.points.filter(p=>!oldIds.has(p.id)).map(p=>`<circle cx="${p.x}" cy="${-p.y}" r="${stroke*1.8}" fill="${p.polarity>0?'black':'white'}" stroke="black" stroke-width="${stroke*.8}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${-y-size} ${size} ${size}" width="800" height="800" role="img" aria-label="${step.operation} construction"><rect x="${x}" y="${-y-size}" width="${size}" height="${size}" fill="white"/>${content}</svg>`;
}
export function buttercupSequence(){const params=getStudy('Buttercup');return {params,...generate(params)};}
export function workedSvg(options={}){
  options={rounding:true,...options};
  const {steps}=buttercupSequence(),frame=frameFor(steps);
  let body=txt(30,34,'Buttercup / one rule, two phases',23)+txt(30,60,options.filled?'Black: blade surface    White: inherited axes    Dashed: preceding boundary':'Black: leaf outline    Gray: polar construction and axes    Dashed: preceding boundary    Dots: new poles',12);
  for(let row=0;row<2;row++){
    const top=95+row*260;
    body+=txt(30,top,row?'02 / BLADES · repeat locally on the finished shoot edges':'01 / SHOOTS · establish and differentiate the branching scaffold',15);
    for(let c=0;c<6;c++){
      const i=row*6+c,s=steps[i],x=20+c*176;
      body+=txt(x+84,top+28,s.operation,14,'middle')+nest(constructionSvg(s,steps[i-1],frame,options,`worked-${i}`),x,top+35,168)+txt(x+84,top+225,String(i+1).padStart(2,'0'),13,'middle');
    }
  }
  body+=txt(30,616,'The exact saved Buttercup recipe: 3 shoot cycles + 3 blade cycles. All frames share a fixed scale.',12);
  return documentSvg(1100,640,'Buttercup: twelve actual E/C operations in two phases',body);
}
// Highlight the actual eligible frontier after the first E/C pair.
function trajectoryChoiceSvg(step,frame,id){
  const {x,y,size}=frame,stroke=size/180;
  const line=(a,b,color,width,arrow=false)=>`<path d="M ${a.x} ${-a.y} L ${b.x} ${-b.y}" fill="none" stroke="${color}" stroke-width="${width}" ${arrow?`marker-end="url(#${id}-arrow)"`:''}/>`;
  let content=`<defs><marker id="${id}-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="black"/></marker></defs>`;
  content+=`<path d="${outlinePath(step.controlPoints)}" fill="none" stroke="#bbb" stroke-width="${stroke*.5}"/>`;
  content+=step.axes.map(b=>line(b.a,b.b,'#ccc',stroke*.5)).join('');
  content+=step.points.filter(p=>p.polarity>0).map(p=>line(p.origin,p,'#bbb',stroke*.5)).join('');
  content+=step.edges.filter(e=>e.active).map(e=>line(e.a,e.b,'black',stroke,true)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${-y-size} ${size} ${size}" width="800" height="800" role="img" aria-label="Eligible edges after the first E/C pair"><rect x="${x}" y="${-y-size}" width="${size}" height="${size}" fill="white"/>${content}</svg>`;
}
export function continuationSvg(cutoff=.7,{expansionFirst=false}={}){
  const rows=trajectoryStudies(cutoff).map(r=>{
    const params=structuredClone(r.params);
    params.rounding=true;params.positiveWeight=1.7;params.negativeWeight=.5;
    params.apices=undefined;params.sinuses=undefined;params.anchoredLobes=false;
    const rule=params.stages[0];rule.rotation=75;
    rule.positions=rule.positions.map((p,i)=>i%2?p:.34);
    rule.intensities=rule.intensities.map((p,i)=>i%2?.56:p);
    // Shape-specific teaching offsets: central radial branching and balanced tiers.
    if(params.trajectory==='base')rule.positions[0]=.48;
    else rule.intensities[0]*=.68;
    return {params,...generate(params)};
  });
  const frame=frameFor(rows.flatMap(r=>r.steps));
  let body=txt(30,34,'From E/C operation to developmental trajectory',23)+txt(30,62,'Both paths alternate E and C. The difference is which descendant edge continues after contraction.',13);
  body+=`<defs><marker id="trajectory-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="black"/></marker></defs>`;
  rows.forEach(({steps},row)=>{
    const x=30+(expansionFirst?1-row:row)*550,last=steps.at(-1),size=365,px=x+105,py=150;
    body+=txt(x,106,row?'LINEAR / toward the terminal apex':'RADIAL / around the lateral shoots',18);
    body+=txt(x,132,row?'Expansive trajectory / fern-like arrangement':'Contractive trajectory / palmate arrangement',12);
    body+=nest(constructionSvg(last,undefined,frame,{filled:true,rounding:true},`trajectory-final-${row}`),px,py,size);
    const project=p=>({x:px+(p.x-frame.x)/frame.size*size,y:py+(-p.y+frame.y+frame.size)/frame.size*size});
    const apex=project(last.points.find(p=>p.id==='apex'));
    const bounds=last.surfaces.flat().map(project);
    const left=Math.min(...bounds.map(p=>p.x))-32;
    const bottom=Math.max(...bounds.map(p=>p.y));
    const top=apex.y-18;
    // A single envelope arc communicates direction; computation indices live below.
    const d=row?`M ${left+12} ${bottom-28} C ${left-15} ${bottom-170}, ${left-5} ${top+30}, ${apex.x-12} ${top}`:
      `M ${apex.x-12} ${top} C ${left-15} ${top+10}, ${left-35} ${bottom-150}, ${left+35} ${bottom-50}`;
    body+=`<path d="${d}" fill="none" stroke="#333" stroke-width="1.25" stroke-dasharray="5 5" marker-end="url(#trajectory-arrow)"/>`;
    body+=txt(apex.x+12,top+4,row?'toward tip':'from tip',12);
    body+=txt(x,545,row?'Successive branch pairs advance toward the apex.':'Successive shoots turn outward and toward the lower lobes.',12);
    body+=txt(x,567,row?'Continue the tip-side descendant; the other edge rests.':'Continue the lateral-side descendant; the other edge rests.',12);
  });
  body+=txt(30,612,'The same E/C pair, followed along two different paths',18);
  (expansionFirst?[...rows].reverse():rows).forEach(({steps},row)=>{
    const y=652+row*248;
    body+=txt(30,y,row?'02 / LINEAR DEVELOPMENT':'01 / RADIAL DEVELOPMENT',15);
    steps.forEach((s,i)=>{
      const x=20+i*176;
      body+=txt(x+84,y+25,s.operation,14,'middle')+nest(constructionSvg(s,steps[i-1],frame,{filled:true,rounding:true},`continuation-${row}-${i}`),x,y+32,168);
      body+=txt(x+84,y+214,String(i+1).padStart(2,'0'),13,'middle');
    });
  });
  body+=txt(30,1150,`E edge-length cutoff: ${cutoff.toFixed(2)}. The numbered frames below show the computed E/C order.`,12);
  body+=txt(30,1174,'Figure 2 informs the direction comparison. These controlled E/C studies are not reconstructions of the photographed leaves.',12);
  body+=txt(30,1198,'Shared E/C framework and scale; radial origin centered, first linear expansion reduced. Rounding is applied after growth.',12);
  return documentSvg(1100,1220,'Radial and linear development with smooth envelope arrows and E/C steps',body);
}
export function smoothingSvg(){
  let body=txt(30,36,'Round the boundary; retain the recursive poles',22);
  for(let c=0;c<2;c++){
    const x=40+c*510,center={x:230,y:c?190:70},left={x:40,y:c?60:220},right={x:420,y:c?60:220};
    const a=lerp(center,left,.5),b=lerp(center,right,.5);
    let g=txt(0,30,c?'NEGATIVE POLE / indentation':'POSITIVE POLE / tip',16)+path([left,center,right],'#b0b0b0',1,'4 4');
    for(const [j,weight] of [.25,.4,.6,.85,1.2].entries()){
      const points=Array.from({length:41},(_,i)=>rationalBezier(a,center,b,i/40,weight));
      g+=path(points,['#ccc','#999','#666','#333','#111'][j],1.7);
    }
    g+=dot(a,'A',false)+dot(b,'B',false)+dot(center,c?'P−':'P+',!c)+txt(20,259,'w = 0.25, 0.40, 0.60, 0.85, 1.20 / curved arcs',12);
    body+=`<g transform="translate(${x} 55)">${g}</g>`;
  }
  body+=txt(40,365,'R(t) = [(1−t)² A + 2wt(1−t) P + t² B] / [(1−t)² + 2wt(1−t) + t²]',17);
  body+=txt(40,399,'A and B sit halfway to adjacent poles. Separate positive / negative weights control tips and notches.',13);
  body+=txt(40,425,'Lower weights soften a corner more. Rounding samples this 2D curve; it does not add shoots or change their positions.',13);
  return documentSvg(1100,455,'Rational boundary smoothing at positive and negative poles',body);
}
export function bladeFamily(name='Buttercup',positive=1.6,negative=1.4){
  const source=getStudy(name),base=generate(source);
  const weights=[.25,.6,1.2];
  const cells=weights.flatMap(n=>weights.map(p=>{
    const params={...source,rounding:true,positiveWeight:p*positive/1.6,negativeWeight:n*negative/1.4};
    return {params,step:generate(params).steps.at(-1)};
  }));
  const frame=frameFor([...base.steps,...cells.map(c=>c.step)]);
  let body=txt(30,36,`${name} / one scaffold, nine blade finishes`,22)+txt(30,63,'Positive weight increases →     Negative weight increases ↓     All nine use identical recursive poles.',13);
  cells.forEach(({params,step},i)=>{
    const x=55+i%3*330,y=105+Math.floor(i/3)*280;
    body+=nest(svgFor(step,params,frame,`blade-${i}`),x+35,y,230)+txt(x+150,y+250,`P+ ${params.positiveWeight.toFixed(2)} / P− ${params.negativeWeight.toFixed(2)}`,13,'middle');
  });
  return documentSvg(1100,960,'Blade rounding family with identical growth geometry',body);
}

export function bowedBladeSvg(strength=1){
  const amount=Math.max(0,Math.min(1,strength)),weights=[.3,.6,1],bulges=[-.05,0,.25];
  const cells=weights.flatMap(weight=>bulges.map(bulge=>({...simpleBlade(bulge*amount,weight),bulge:bulge*amount,weight})));
  const frame=frameFor(cells.map(c=>c.step)),cell=340;
  let body=txt(30,36,'Three shoots / one scaffold, continuous blade curves',23)+txt(30,63,'Only the boundary finish changes. Gray shows the fixed E/C polygon; white shows the inherited branches.',13);
  ['Inward bow','Rounded boundary','Outward bulge'].forEach((s,i)=>body+=txt(210+i*cell,106,s,17,'middle'));
  for(const [i,c] of cells.entries()){
    const x=40+(i%3)*cell,y=130+Math.floor(i/3)*310;
    let svg=svgFor(c.step,c.params,frame,`bow-${i}`);
    svg=svg.replace('</svg>',`<path d="${outlinePath(c.source.controlPoints)}" fill="none" stroke="#777" stroke-width="${frame.size/500}" stroke-dasharray="${frame.size/130} ${frame.size/180}"/></svg>`);
    body+=nest(svg,x+15,y,280)+txt(x+155,y+281,`bow ${c.bulge.toFixed(2)} / notch weight ${c.weight}`,13,'middle');
    const base=simpleBlade(0,c.weight),ratio=Math.abs(signedArea(c.step.surfaces[0])/signedArea(base.step.surfaces[0]));
    body+=txt(x+155,y+299,`Blade area ${Math.round(ratio*100)}% of rounded reference`,11,'middle');
  }
  body+=txt(30,1086,'The signed bow offsets each smooth arc; zero slope at arc joins preserves tangency. Basal stalk arcs remain fixed.',12);
  body+=txt(30,1110,'Notches remain curved at every setting. This finishing study is separate from the unchanged published E/C recipes.',12);
  return documentSvg(1100,1140,'Inward and outward blade surfaces on a simple three-shoot E/C scaffold',body);
}

export function bladeGrowthFamily(name='Buttercup'){
  const source=getStudy(name),eValues=[.6,1,1.3],cValues=source.variant.contractionIntensityMin===0?[.3,.65,1]:[-.5,0,1];
  const cells=cValues.flatMap(c=>eValues.map(e=>{
    const params=structuredClone(source);
    params.stages[1].expansion.intensity=e;params.stages[1].contraction.intensity=c;
    return {params,e,c,steps:generate(params).steps};
  }));
  const frame=frameFor(cells.flatMap(c=>c.steps));
  let body=txt(30,36,`${name} / nine local blade recipes`,22)+txt(30,63,'Blade E strength increases →     Blade C strength increases ↓     Shoot settings and rounding stay fixed.',13);
  cells.forEach(({params,e,c,steps},i)=>{
    const x=55+i%3*330,y=105+Math.floor(i/3)*280;
    body+=nest(svgFor(steps.at(-1),params,frame,`blade-growth-${i}`),x+35,y,230)+txt(x+150,y+250,`E × ${e.toFixed(2)} / C × ${c.toFixed(2)}`,13,'middle');
  });
  body+=txt(30,930,'Values multiply saved blade schedules before source clamps. Negative C is shown only for definitions that allow it.',12);
  return documentSvg(1100,960,'Blade variation from local E/C growth',body);
}


function referenceLeaf(form,frame){
  const d=form.contours.map(c=>outlinePath(c.map(([x,y])=>({x,y})))).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame.x} ${-frame.y-frame.size} ${frame.size} ${frame.size}" width="800" height="800"><path d="${d}" fill="black" fill-rule="evenodd"/></svg>`;
}
export function bradyReferenceSvg(){
  const refs=BRADY_REFERENCE.forms;
  const frame=frameFor(refs.map(f=>({surfaces:f.contours.map(c=>c.map(([x,y])=>({x,y})))})));
  let body=txt(25,32,'Brady / source leaf series',21)+txt(25,58,'Organic references for fullness, division, branching and simplification; not silhouette-fitting targets.',12);
  refs.forEach((f,i)=>{
    const x=20+i*120,size=115*f.relativeSize;
    body+=txt(x+57,92,String(i+1),13,'middle')+nest(referenceLeaf(f,frame),x+(115-size)/2,108+115-size,size);
  });
  body+=txt(25,258,'The generated series interprets these structural changes using a shared, bilaterally symmetric E/C program.',12);
  return documentSvg(1100,280,'Brady organic reference silhouettes for a symmetric structural interpretation',body);
}
export function serialSvg(options={}){
  const columns=serialData(options),frame=frameFor(columns.flatMap(r=>r.steps)),cell=136,left=110,top=285,width=left+cell*columns.length+25;
  let body=txt(30,35,'Embryogenesis x ontogenesis / Brady-inspired Buttercup',23);
  body+=txt(30,63,'Across: a symmetric progression of fullness, branching and division. Down: twelve E/C construction operations.',13);
  body+=txt(30,89,'Filled blades > expanded, divided forms > reduced branches. Every cell is regenerated by the same E/C engine.',12);
  columns.forEach((r,j)=>{
    const x=left+j*cell,scale=options.relativeSize?r.relativeSize:1,size=cell*scale;
    body+=txt(x+cell/2,122,String(j+1).padStart(2,'0'),15,'middle');
    const source=r.t<.25?'Fullness':r.t<.6?'Differentiation':r.t<.84?'Division':'Reduction';
    body+=txt(x+cell/2,143,source,11,'middle')+nest(svgFor(r.steps.at(-1),r.params,frame,`serial-final-${j}`),x+(cell-size)/2,148+cell-size,size);
  });
  body+=txt(25,195,'FINAL',12)+txt(25,212,'FORMS',12);
  for(let i=0;i<12;i++){
    const y=top+i*cell;
    body+=txt(24,y+60,String(i+1).padStart(2,'0'),16)+txt(57,y+60,i%2?'C':'E',14);
    if(i===0||i===6)body+=txt(25,y+84,i===0?'Shoots':'Blades',11);
    columns.forEach((r,j)=>{
      const scale=options.relativeSize?r.relativeSize:1,size=cell*scale;
      body+=nest(svgFor(r.steps[i],r.params,frame,`serial-${i}-${j}`),left+j*cell+(cell-size)/2,y+cell-size,size);
    });
    if(i===5)body+=path([{x:20,y:y+cell},{x:width-20,y:y+cell}],'#aaa',.7);
  }
  const bottom=top+12*cell;
  body+=txt(30,bottom+27,"Reference: Ronald H. Brady, Form and Cause in Goethe's Morphology, Figure 4 / Ranunculus acris.",12);
  body+=txt(30,bottom+49,'Shared symmetric schedules interpolate between structural anchors. The series interprets complexity; it does not fit specimen outlines.',12);
  body+=txt(30,bottom+71,options.relativeSize?'Column sizes follow the source drawing proportions. Left and right use identical settings at every development step.':'Common axis scale. Embryogenesis here means algorithmic construction, not observed embryo development.',12);
  return documentSvg(width,bottom+96,`${columns.length} Brady-inspired serial leaves, each with twelve E/C construction stages`,body);
}
export function serialInspectorSvg(position=0,options={}){
  const recipe=bradyRecipe(position,options),left=bradyRecipe(recipe.lower-1,options),right=bradyRecipe(recipe.upper-1,options);
  const leaves=[left,recipe,right].map(r=>({...r,...generate(r.params)})),frame=frameFor(leaves.flatMap(r=>r.steps));
  let body=txt(25,30,`Structural transition / anchors ${recipe.lower} and ${recipe.upper}`,20);
  leaves.forEach((r,i)=>{body+=nest(svgFor(r.steps.at(-1),r.params,frame,`serial-inspector-${i}`),30+i*370,70,250);});
  body+=txt(155,345,`Structure ${recipe.lower}`,14,'middle')+txt(525,345,`Transition ${Math.round(recipe.blend*100)}%`,14,'middle')+txt(895,345,`Structure ${recipe.upper}`,14,'middle');
  body+=txt(25,390,'All three are generated E/C forms. Intermediate parameters remain symmetric; no organic contour is copied or overlaid.',12);
  return documentSvg(1100,415,'Interpolation between symmetric E/C structural anchors',body);
}
