import {buttercupSequence} from './diagrams.mjs?v=clean-garamond-2';
import {bradyRecipe,BRADY_REFERENCE} from './brady-series.mjs?v=pole-pairs-2';
import {generate,frameFor,svgFor} from './leaf.mjs?v=pole-pairs-2';
// One continuous morph trajectory, sampled uniformly for all twelve rows.
// Values are authored controls, not a fitted reconstruction of the source.
const MORPH_KEYS=[
 {t:0,shootE:.78,shootC:.72,firstC:.84,rotation:55,bladeRotation:45,lateExpansion:.72,position:.18,bladeE:.85,bladeC:.66,bladeStem:.15,stalk:4.5,round:1.3},
 {t:3/11,shootE:.94,shootC:.82,firstC:.91,rotation:62,bladeRotation:48,lateExpansion:.86,position:.14,bladeE:.98,bladeC:.82,bladeStem:.32,stalk:3.3,round:1.45},
 {t:6/11,shootE:1,shootC:.87,firstC:.94,rotation:68,bladeRotation:52,lateExpansion:.95,position:.123,bladeE:1,bladeC:1,bladeStem:.606,stalk:1.8,round:1.6},
 {t:1,shootE:.53,shootC:.98,firstC:.96,rotation:52,bladeRotation:40,lateExpansion:.60,position:.08,bladeE:.35,bladeC:1.25,bladeStem:.606,stalk:.3,round:1.9},
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
 // Keep twelve operations and seven primary shoot poles. Buttercup's blade
 // cutoff lets short edges rest instead of subdividing every margin indefinitely.
 for(const stage of params.stages){stage.cycles=3;stage.expansion.intensity=1;stage.contraction.intensity=1;}
 shoot.minExpansionLength=0;shoot.minContractionLength=0;
 blade.minExpansionLength*=m.shootE;
 blade.rotation=m.bladeRotation;
 shoot.rotation=m.rotation;shoot.positions[0]=m.position;
 shoot.intensities=shoot.intensities.map((v,g)=>g%2?(g===1?m.firstC:m.shootC):v*m.shootE);
 // Modulate the saved generation-dependent schedule, retaining its E/C balance.
 blade.intensities=blade.intensities.map((v,g)=>g%2?Math.min(.98,v*m.bladeC):v*m.bladeE*Math.pow(m.lateExpansion,g/2));
 blade.firstStemIntensity=m.bladeStem;blade.stemIntensity=m.bladeStem;
 params.name='Worked Buttercup / continuous morph';
 return params;
}
export function bradyMatrixData(){
 const positions=[0,.5,1,1.5,2,3,4,5,5.5,6,7,8];
 const rows=positions.map((position,index)=>{
  const recipe=bradyRecipe(position),t=index/11,params=bradyMorphParams(t);
  const row={...recipe,params,controls:bradyMorphControls(t),...generate(params)};
  // Separate basal elongation from the unchanged E/C blade construction.
  // Stalk length varies continuously along the series and grows within each row.
  row.steps=row.steps.map((step,i)=>{
   const length=row.controls.stalk*(i+1)/12;
   const stalk=[{x:-.10,y:.12},{x:.10,y:.12},{x:.065,y:-length},{x:-.065,y:-length}];
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
 // A4 portrait, 10 mm margins: 10 drawing units per mm, 30 units ≈ 8.5 pt.
 // Same rows, steps and shared frame as the reference matrix; only layout changes.
 const rows=bradyMatrixData(),left=82,pitch=150,top=100,rowHeight=150;
 const label=(x,y,s)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="30">${s}</text>`;
 let body='';
 for(let c=0;c<12;c++){
  body+=label(left+c*pitch+72,79,c%2?'C':'E');
 }
 rows.forEach((row,r)=>{
  const y=top+r*rowHeight;
  body+=label(30,y+80,String(r+1).padStart(2,'0'));
  row.cells.forEach((cell,c)=>{
   let leaf=svgFor(cell.step,{...row.params,veins:true,points:false,frontier:false},row.frame,`brady-print-${r}-${c}`)
    .replace('<svg ',`<svg x="${left+c*pitch}" y="${y}" `)
    .replace('width="800" height="800"','width="144" height="144"')
    .replace(/<rect[^>]*fill="white"\/>/,'');
   // Strengthen veins without erasing the narrow terminal forms.
   leaf=leaf.replace(/stroke="white" stroke-width="([^"]+)"/g,(_,weight)=>`stroke="white" stroke-width="${Math.min(Number(weight)*2,row.frame.size*.45/144)}"`);
   body+=leaf;
  });
 });
 return `<svg xmlns="http://www.w3.org/2000/svg" width="190mm" height="190mm" viewBox="0 0 1900 1900" data-publication="a4" aria-label="Generated Brady series: rows 01–12, development steps 01–12 across"><rect width="1900" height="1900" fill="white"/><g fill="black" font-family="Garamond, serif">${body}</g></svg>`;
}
