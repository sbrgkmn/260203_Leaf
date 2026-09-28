import {buttercupSequence} from './diagrams.mjs?v=clean-garamond-2';
import {bradyRecipe,BRADY_REFERENCE} from './brady-series.mjs?v=pole-pairs-2';
import {generate,frameFor,svgFor} from './leaf.mjs?v=pole-pairs-2';
// One continuous morph trajectory, sampled uniformly for all twelve rows.
// Values are authored controls, not a fitted reconstruction of the source.
const MORPH_KEYS=[
 {t:0,shootE:.78,shootC:.78,rotation:55,bladeRotation:38,lateExpansion:.50,position:.18,bladeE:.48,bladeC:.30,round:.7},
 {t:3/11,shootE:.95,shootC:.86,rotation:65,bladeRotation:46,lateExpansion:.60,position:.14,bladeE:.58,bladeC:.38,round:1.1},
 {t:6/11,shootE:1,shootC:.90,rotation:74,bladeRotation:54,lateExpansion:.78,position:.11,bladeE:.56,bladeC:.46,round:1.65},
 {t:1,shootE:.53,shootC:.995,rotation:54,bladeRotation:40,lateExpansion:.70,position:.08,bladeE:.16,bladeC:.96,round:2.2},
];
export function bradyMorphControls(t){
 t=Math.max(0,Math.min(1,t));
 const hi=MORPH_KEYS.findIndex(k=>k.t>=t);
 const a=MORPH_KEYS[Math.max(0,hi-1)],b=MORPH_KEYS[hi];
 const u=b.t===a.t?0:(t-a.t)/(b.t-a.t),blend=u*u*(3-2*u);
 return Object.fromEntries(Object.keys(a).filter(k=>k!=='t').map(k=>[k,a[k]+(b[k]-a[k])*blend]));
}
export function bradyMorphParams(t){
 const params=structuredClone(buttercupSequence().params),m=bradyMorphControls(t);
 params.leftRightPosition=.5;params.leftRightIntensity=.5;
 params.positiveWeight=m.round;params.negativeWeight=.65+.6*t;
 const [shoot,blade]=params.stages;
 // Fixed recursion depth and eligibility avoid threshold-driven jumps.
 for(const stage of params.stages){stage.cycles=3;stage.minExpansionLength=0;stage.minContractionLength=0;stage.expansion.intensity=1;stage.contraction.intensity=1;}
 blade.rotation=m.bladeRotation;
 shoot.rotation=m.rotation;shoot.positions[0]=m.position;
 shoot.intensities=shoot.intensities.map((v,g)=>g%2?(g===1?.94:m.shootC):v*m.shootE);
 blade.intensities=[m.bladeE,m.bladeC,m.bladeE*m.lateExpansion,m.bladeC+.02,m.bladeE*.66,Math.min(.99,m.bladeC+.04)];
 blade.firstStemIntensity=.3;blade.stemIntensity=.3;
 params.name='Worked Buttercup / continuous morph';
 return params;
}
export function bradyMatrixData(){
 const positions=[0,.5,1,1.5,2,3,4,5,5.5,6,7,8];
 const rows=positions.map((position,index)=>{
  const recipe=bradyRecipe(position),t=index/11,params=bradyMorphParams(t);
  const row={...recipe,params,controls:bradyMorphControls(t),...generate(params)};
  // Separate basal elongation from the unchanged E/C blade construction.
  // The stemming end of the series gains a slender, progressive petiole.
  if(index===0)row.steps=row.steps.map((step,i)=>{
   const length=2.4*i/11;
   if(!length)return step;
   const stalk=[{x:-.075,y:.12},{x:.075,y:.12},{x:.045,y:-length},{x:-.045,y:-length}];
   return {...step,surfaces:[...step.surfaces,stalk]};
  });
  return {...row,index,cells:row.steps.map((step,i)=>({step,index:i+1}))};
 });
 // One scale across the complete grid: surface loss remains visible vertically.
 const frame=frameFor(rows.flatMap(row=>row.steps));
 return rows.map(row=>({...row,frame}));
}
export function bradyMatrixSvg(){
 const rows=bradyMatrixData(),width=2160,height=1900;
 const txt=(x,y,s,size=16,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}">${s}</text>`;
 let body=txt(650,34,'Worked Buttercup / Brady parameter series',25)+txt(670,64,'Individual development →',18);
 body+=txt(707,78,'SHOOTS',14)+txt(1637,78,'BLADES',14);
 Array.from({length:12},(_,i)=>i).forEach(i=>body+=txt(320+i*155,100,i%2?'C':'E',14));
 body+=txt(58,100,'Series',15)+txt(160,100,'Source anchor',15);
 body+=`<rect x="1955" y="113" width="155" height="1656" fill="#f4f4f4"/>`;
 rows.forEach((row,r)=>{
  const y=120+r*138;
  body+=txt(58,y+61,String(r+1).padStart(2,'0'),18);
  const ref=BRADY_REFERENCE.forms[Math.round(row.position)];
  const ps=ref.contours.flat(),minX=Math.min(...ps.map(p=>p[0])),maxX=Math.max(...ps.map(p=>p[0])),minY=Math.min(...ps.map(p=>p[1])),maxY=Math.max(...ps.map(p=>p[1]));
  const size=Math.max(maxX-minX,maxY-minY)*1.15,cx=(minX+maxX)/2,cy=(minY+maxY)/2;
  const d=ref.contours.map(poly=>'M '+poly.map(p=>`${p[0]} ${-p[1]}`).join(' L ')+' Z').join(' ');
  body+=`<svg x="110" y="${y}" width="100" height="100" viewBox="${cx-size/2} ${-cy-size/2} ${size} ${size}"><path d="${d}" fill="black" fill-rule="evenodd"/></svg>`;
  body+=txt(160,y+117,`${row.blend>1e-8?`Between ${row.lower}–${row.upper}`:`Source ${ref.index}`}`,11);
  row.cells.forEach((cell,c)=>{
   body+=svgFor(cell.step,{...row.params,veins:true,points:false,frontier:false},row.frame,`brady-matrix-${r}-${c}`).replace('<svg ',`<svg x="${255+c*155}" y="${y-4}" `).replace('width="800" height="800"','width="130" height="118"').replace(/<rect[^>]*fill="white"\/>/,'');
   body+=txt(320+c*155,y+122,`${cell.index}`,11);
  });
  if(r<11)body+=`<path d="M 30 ${y+132} H 2130" stroke="#ddd" stroke-width=".6"/>`;
 });
 body+=txt(30,1810,'Down: a continuous Buttercup parameter trajectory; surface reduction begins after row 7.',16,'start');
 body+=txt(30,1837,'Across: the Worked Buttercup construction, all 12 operations: 3 shoot + 3 blade cycles; no steps omitted.',16,'start');
 body+=txt(30,1864,'Shared scale across all 144 forms. Source silhouettes are references, not fitted targets.',14,'start');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-label="Brady embryogenesis by ontogenetic series"><rect width="${width}" height="${height}" fill="white"/><g fill="black" font-family="Garamond, serif">${body}</g></svg>`;
}

// Generated-only companion: retain the same data and row/operation numbering.
export function bradyGeneratedMatrixSvg(){
 let svg=bradyMatrixSvg();
 svg=svg.replace(/<svg x="110"[\s\S]*?<\/svg>/g,'');
 svg=svg.replace(/<text x="160"[^>]*>[\s\S]*?<\/text>/g,'');
 svg=svg.replace(/<text x="(\d+)"/g,(match,x)=>`<text x="${Number(x)>=255?Number(x)-120:x}"`);
 svg=svg.replace(/<svg x="(\d+)"/g,(match,x)=>`<svg x="${Number(x)-120}"`);
 svg=svg.replace('x="1955"','x="1835"').replaceAll('H 2130','H 2010');
 svg=svg.replaceAll('2160','2040');
 svg=svg.replace('Source silhouettes are references, not fitted targets.','Generated E/C forms only; identical parameters to the reference matrix.');
 return svg;
}
