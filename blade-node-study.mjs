import {trajectoryStudies} from './trajectory-study.mjs?v=pole-pairs-2';
import {generate} from './leaf.mjs?v=pole-pairs-2';
const pt=(x,y)=>({x,y}),mid=(a,b)=>pt((a.x+b.x)/2,(a.y+b.y)/2);
const params=trajectoryStudies(0)[1].params;
params.stages[0].cycles=2;params.stages[0].rotation=100;
const construction=generate(params);
export function nodeConstruction(){return structuredClone({params,...construction});}
const map=p=>({...p,x:p.x*12,y:90-p.y*18});
export const NODE_TREATMENTS=[
 {id:'ee',name:'E / E',title:'Expanded blade',note:'Four CVs: a rounded expanded blade flowing into a tapered base.'},
 {id:'ec',name:'E / C',title:'Pointed blade',note:'Four CVs: sharp upper tips with a smooth transition into the base.'},
 {id:'ce',name:'C / E',title:'Lobed blade',note:'Four CVs per half: pointed lobes, an anchored sinus, and a naturally tapered base.'},
 {id:'cc',name:'C / C',title:'Rounded / contracted',note:'Four CVs: rounded tips, inward flanks, and a smoothly tapered base.'},
];
const quad=(start,control,end)=>({type:'quadratic',start,control,end});
function bladeSegments(id){
 const base=pt(0,108),mirror=p=>pt(-p.x,p.y);
 let tip=pt(0,-90),half,lateral;
 if(id==='ce'){
  const notch=pt(18,-18);lateral=pt(76,-40);
  const c3=pt(68,20),c4=pt(0,64),join=mid(c3,c4);
  half=[quad(tip,pt(34,-64),notch),quad(notch,pt(43,-49),lateral),quad(lateral,c3,join),quad(join,c4,base)];
 }else if(id==='ec'){
  tip=pt(0,-80);lateral=pt(72,0);
  const c1=pt(14,-14),c2=pt(45,25),c4=pt(0,78);
  // Match second derivatives as well as tangents across the CV 2/3 join.
  const c3=pt((4*c2.x+c4.x-2*lateral.x)/3,(4*c2.y+c4.y-2*lateral.y)/3);
  half=[quad(tip,c1,lateral),quad(lateral,c2,mid(c2,c3)),quad(mid(c2,c3),c3,mid(c3,c4)),quad(mid(c3,c4),c4,base)];
 }else {
  // Midpoint joins make neighboring quadratic derivatives identical.
  const cvs=id==='ee'?[pt(42,-90),pt(88,-32),pt(68,36),pt(0,68)]:[pt(12,-90),pt(18,-10),pt(85,0),pt(0,68)];
  half=cvs.map((c,i)=>quad(i?mid(cvs[i-1],c):tip,c,i===3?base:mid(c,cvs[i+1])));
  lateral=id==='cc'?cvs[2]:half[1].end;
 }
 // Map the lateral pole to the shared 03 branch, keeping the central axis
 // fixed. This affine change preserves quadratic tangency and curvature joins.
 const sourceLateral=lateral;
 const align=p=>pt(p.x*76/sourceLateral.x,p.y+(-40-sourceLateral.y)*p.x/sourceLateral.x);
 half=half.map(s=>quad(align(s.start),align(s.control),align(s.end)));
 lateral=pt(76,-40);
 const segments=[...half,...half.toReversed().map(s=>quad(mirror(s.end),mirror(s.control),mirror(s.start)))];
 // All studies share the central branch origin of reference 03.
 const branchOrigin=pt(0,22);
 const veins=[{a:base,b:tip},{a:branchOrigin,b:lateral},{a:branchOrigin,b:mirror(lateral)}];
 return {segments,veins};
}
export function nodeStudy({id='ee'}={}){
 const config=NODE_TREATMENTS.find(p=>p.id===id);if(!config)throw new RangeError('Unknown CV study.');
 const {segments,veins}=bladeSegments(id);
 let path=`M ${segments[0].start.x} ${segments[0].start.y}`;
 for(const s of segments)path+=s.type==='quadratic'?` Q ${s.control.x} ${s.control.y} ${s.end.x} ${s.end.y}`:` L ${s.end.x} ${s.end.y}`;
 const controls=segments.filter(s=>s.type==='quadratic').map((s,i)=>({...s.control,label:`${i+1}`,role:'control'}));
 const points=segments.map((s,i)=>({...s.start,label:`A${i+1}`,role:'anchor'}));
 return {...config,segments,path:path+' Z',controls,points,veins,source:construction.steps.at(-1)};
}
export function sampleNodeStudy(study,resolution=30){
 const ps=[];for(const s of study.segments){if(s.type==='line'){ps.push(s.start);continue;}
 for(let k=0;k<resolution;k++){const t=k/resolution,u=1-t;ps.push(pt(u*u*s.start.x+2*u*t*s.control.x+t*t*s.end.x,u*u*s.start.y+2*u*t*s.control.y+t*t*s.end.y));}}return ps;
}
// Recover the pre-contraction point from the recorded interpolation, exactly
// for this fixed construction (C intensity .85). These are actual engine moves.
export function constructionHistory(){return construction.steps.map((s,i)=>({
 earlier:construction.steps.slice(0,i).map(f=>f.controlPoints.map(map)),
 moves:s.events.filter(e=>e.g===i).map(e=>{const p=s.controlPoints.find(p=>p.id===e.point);
 const a=e.operation==='E'?e.center:pt((p.x-e.intensity*e.center.x)/(1-e.intensity),(p.y-e.intensity*e.center.y)/(1-e.intensity));
 return {operation:e.operation,id:p.id,start:map(a),end:map(p),pole:map(e.center),intensity:e.intensity};})
}));}
const text=(x,y,s,size=13,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
const edgePath=ps=>`M ${ps.map(p=>`${p.x} ${p.y}`).join(' L ')} Z`;
const stroke=(a,b,attrs='')=>`<path d="M ${a.x} ${a.y} L ${b.x} ${b.y}" fill="none" ${attrs}/>`;
function axesView(veins){return `<g stroke="#999" stroke-width=".7" stroke-dasharray="6 3">${veins.map(v=>stroke(v.a,v.b)).join('')}</g>`;}
function controlsView(study,x,y){
 let body=`<g transform="translate(${x} ${y})">`+axesView(study.veins.slice(0,2));
 // Unsmoothed boundary joins the same anchors used by the quadratic arcs.
 const anchors=[study.segments[0].start,...study.segments.slice(0,4).map(s=>s.end)];
 body+=`<path d="M ${anchors.map(p=>`${p.x} ${p.y}`).join(' L ')}" fill="none" stroke="#aaa" stroke-width=".7"/>`;
 // These authored surface-study C nodes pull toward the shared branch origin.
 const target=study.veins[1].a;
 const cIndices=study.cIndices??(study.id==='ce'?[1,3,4]:study.id==='ec'?[2,3,4]:study.id==='ee'?[1,3,4]:[1,2,3,4]);
 for(const i of cIndices)body+=stroke(anchors[i],target,'stroke="#666" stroke-width=".8" stroke-dasharray="3 4"');
 body+=`<circle cx="${target.x}" cy="${target.y}" r="2.3" fill="white" stroke="#666" stroke-width="1"/>`;
 for(const s of study.segments.slice(0,4)){
  body+=`<path d="M ${s.start.x} ${s.start.y} ${s.type==='quadratic'?`L ${s.control.x} ${s.control.y}`:''} L ${s.end.x} ${s.end.y}" fill="none" stroke="#aaa" stroke-width=".7"/>`;
 }
 body+=`<path d="M ${study.segments[0].start.x} ${study.segments[0].start.y} ${study.segments.slice(0,4).map(s=>`Q ${s.control.x} ${s.control.y} ${s.end.x} ${s.end.y}`).join(' ')}" fill="none" stroke="black" stroke-width="1.8"/>`;
 for(const [i,p] of anchors.entries()){
  const type=cIndices.includes(i)?'C':'E';
  body+=`<circle cx="${p.x}" cy="${p.y}" r="2.4" fill="${type==='C'?'white':'black'}" stroke="black" stroke-width=".9"/>`;
  body+=text(p.x-8,p.y+3,type,10,'end');
 }
 for(const p of study.controls.slice(0,4)){const l=Math.hypot(p.x,p.y)||1;
  body+=`<rect x="${p.x-2.8}" y="${p.y-2.8}" width="5.6" height="5.6" fill="white" stroke="black"/>`+text(p.x+p.x/l*11,p.y+p.y/l*11+3,p.label,8,'middle');
 }
 if(study.stem)body+=stroke(study.stem.a,study.stem.b,'stroke="black" stroke-width="1.8" stroke-linecap="round"');
 return body+'</g>';
}
export function bladeNodeStudySvg({filled=true}={}){
 let body=`<defs><marker id="cv-pull" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 6 3 L 0 6" fill="none" stroke="#777" stroke-width="1"/></marker></defs>`;
 [...NODE_TREATMENTS,...MIXED_TREATMENTS].forEach((config,i)=>{
  const x=30+i%2*550,y=20+Math.floor(i/2)*350,r=i<4?nodeStudy(config):mixedStudy(config);
  body+=`<rect x="${x}" y="${y}" width="520" height="330" fill="none" stroke="#ddd"/>`+text(x+18,y+27,`${String(i+1).padStart(2,'0')} / ${r.name?r.name+' / ':''}${r.title}`,17);
  body+=`<text x="${x+18}" y="${y+27}" data-clean-only="true" display="none" font-size="17">${String(i+1).padStart(2,'0')}</text>`;
  body+=text(x+132,y+54,'Half-leaf / 4 CVs',12,'middle')+text(x+389,y+54,'Blade + dashed axes',12,'middle');
  body+=controlsView(r,x+132,y+172)+stroke(pt(x+249,y+172),pt(x+271,y+172),'stroke="#888" marker-end="url(#cv-pull)"');
  body+=`<g transform="translate(${x+389} ${y+172})"><defs><clipPath id="node-study-${i}"><path d="${r.path}"/></clipPath></defs><path d="${r.path}" fill="${filled?'black':'white'}" stroke="black" stroke-width="1.2"/><g clip-path="url(#node-study-${i})" stroke="${filled?'white':'#888'}" stroke-width=".65" stroke-dasharray="5 3">`;
  for(const v of r.veins)body+=stroke(v.a,v.b);
  body+='</g>';
  if(r.stem)body+=stroke(r.stem.a,r.stem.b,'stroke="black" stroke-width="2.4" stroke-linecap="round"');
  body+=`</g>`+text(x+18,y+315,r.note,10.5);
 });
 body+=text(30,1436,'Heavy solid = smoothed contour. Short dashes = C targets. Thin gray = unsmoothed boundary and CV polygon.',12);
 body+=text(30,1462,'Q(t) = (1-t)^2 A + 2t(1-t) CV + t^2 B. At t = 1/2, the curve lies halfway from the chord midpoint to its CV.',12);
 body+=text(30,1488,'E/E and C/C name the surface treatments, not extra engine steps. All curved segments are quadratic.',12);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1130" height="1510" viewBox="0 0 1130 1510" role="img" aria-label="Eight quadratic form studies"><title>Eight quadratic form studies</title><rect width="1130" height="1510" fill="white"/><g font-family="Arial,sans-serif" fill="#171c16">${body}</g></svg>`;
}

export const MIXED_TREATMENTS=[
 {id:'basal-lobes',title:'Basal lobes',note:'Expansion below the origin opens two basal lobes around a contracted base.'},
 {id:'split-apex',title:'Split apex',note:'A contracted terminal node separates two expanded upper lobes.'},
 {id:'deep-division',title:'Deep division',note:'Sinuses approach the axis, nearly separating the three lobes.'},
 {id:'stamen',title:'Stamen-like form',note:'Rounded paired lobes with a short stem attached at the lower notch.'},
];
export function mixedStudy(config=MIXED_TREATMENTS[0]){
 let tip=pt(0,-90),base=pt(0,108),lateral,half,cIndices;
 if(config.id==='basal-lobes'){
  base=pt(0,35);lateral=pt(45,70);
  half=[quad(tip,pt(40,-55),pt(70,-5)),quad(pt(70,-5),pt(105,60),lateral),quad(lateral,pt(15,75),pt(8,42)),quad(pt(8,42),pt(0,22),base)];cIndices=[4];
 }else if(config.id==='split-apex'){
  tip=pt(0,-35);
  const c1=pt(20,-95),c2=pt(105,-80),c3=pt(85,30),c4=pt(0,70);
  lateral=mid(c2,c3);
  half=[quad(tip,c1,mid(c1,c2)),quad(mid(c1,c2),c2,lateral),quad(lateral,c3,mid(c3,c4)),quad(mid(c3,c4),c4,base)];cIndices=[0,4];
 }else if(config.id==='stamen'){
  // Mirror the upper quadrant across y=0 for exact top/bottom symmetry.
  tip=pt(0,-32);base=pt(0,32);lateral=pt(72,0);
  const c1=pt(0,-96),c2=pt(72,-96),join=mid(c1,c2);
  const lower=pt(join.x,-join.y);
  half=[quad(tip,c1,join),quad(join,c2,lateral),quad(lateral,pt(c2.x,-c2.y),lower),quad(lower,pt(c1.x,-c1.y),base)];cIndices=[0,4];
 }else{
  const deep=config.id==='deep-division';tip=pt(0,deep?-90:-35);
  const notch=deep?pt(4,18):pt(14,-4);lateral=deep?pt(76,-40):pt(92,-55);
  const c3=deep?pt(20,15):pt(100,5),c4=pt(0,70);
  half=[quad(tip,deep?pt(22,-40):pt(15,-30),notch),quad(notch,deep?pt(40,-35):pt(60,-85),lateral),quad(lateral,c3,mid(c3,c4)),quad(mid(c3,c4),c4,base)];cIndices=[1,4];
 }
 const origin=pt(0,config.id==='stamen'?0:22),mirror=p=>pt(-p.x,p.y);
 const segments=[...half,...half.toReversed().map(s=>quad(mirror(s.end),mirror(s.control),mirror(s.start)))];
 const path=`M ${tip.x} ${tip.y} ${segments.map(s=>`Q ${s.control.x} ${s.control.y} ${s.end.x} ${s.end.y}`).join(' ')} Z`;
 return {...config,stem:config.id==='stamen'?{a:base,b:pt(0,108)}:null,segments,path,controls:segments.map((s,i)=>({...s.control,label:String(i+1)})),points:segments.map(s=>s.start),veins:[{a:base,b:tip},{a:origin,b:lateral},{a:origin,b:mirror(lateral)}],cIndices};
}
export function mixedTreatmentSvg({filled=true}={}){
 let body=text(30,35,'Structural variations',23)+text(30,62,'Redistribute expansion and contraction: basal lobes, a divided apex, deep sinuses, or dominant lateral lobes.',13);
 for(const [i,config] of MIXED_TREATMENTS.entries()){
  const r=mixedStudy(config),x=30+i%2*550,y=90+Math.floor(i/2)*340;
  body+=`<rect x="${x}" y="${y}" width="520" height="320" fill="none" stroke="#ddd"/>`;
  body+=text(x+18,y+27,`${String(i+1).padStart(2,'0')} / ${r.title}`,16);
  body+=text(x+132,y+52,'Half-leaf / 4 CVs',12,'middle')+text(x+389,y+52,'Structural study',12,'middle');
  body+=controlsView(r,x+132,y+166);
  body+=`<g transform="translate(${x+389} ${y+166})"><defs><clipPath id="mixed-${i}"><path d="${r.path}"/></clipPath></defs><path d="${r.path}" fill="${filled?'black':'white'}" stroke="black" stroke-width="1.2"/><g clip-path="url(#mixed-${i})" stroke="${filled?'white':'#888'}" stroke-width=".65" stroke-dasharray="5 3">${r.veins.map(v=>stroke(v.a,v.b)).join('')}</g></g>`;
  body+=text(x+18,y+300,r.note,11);
 }
 body+=text(30,784,'Authored structural hypotheses using quadratic contours; not recovered engine sequences. Four CVs per half, mirrored.',12);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1130" height="810" viewBox="0 0 1130 810" role="img" aria-label="Four structural leaf variations"><rect width="1130" height="810" fill="white"/><g font-family="Arial,sans-serif" fill="#171c16">${body}</g></svg>`;
}
