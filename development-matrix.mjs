import {generate,frameFor,svgFor} from './leaf.mjs?v=pole-pairs-2';
import {ontologyRecipe} from './ontology.mjs?v=trace-1';
const profiles=[{name:'Rounded blade',cut:-.22,width:1.08,stem:2.6},{name:'Shallow lobes',cut:.2,width:1,stem:1.9},{name:'Divided blade',cut:.58,width:.92,stem:1.2}];
export function developmentMatrixData(){
 return profiles.map(profile=>{
  const cells=Array.from({length:6},(_,i)=>{
   const params=ontologyRecipe();params.trajectory='base';
   const s=params.stages[0];s.rotation=68;s.positions=[.48,.5,.38,.5,.32,.5];
   s.cycles=i<2?1:2;s.intensities=[.58,.68,.52,.68,.44,.68];
   params.variant.contractionIntensityMin=null;
   const cut=i<3?.68:profile.cut;
   s.intensities=s.intensities.map((v,k)=>k%2?cut:v*(i>=3?profile.width:1));
   if(i===0)s.intensities[0]=.065;
   params.rounding=i!==2;params.positiveWeight=i>=4?.75:1.5;params.negativeWeight=.55;
   const generated=generate(params),raw=i===0?generated.steps[0]:generated.steps.at(-1);
   const axis=[.45,.65,.8,1,1,1][i],stalk=i===5?profile.stem:0;
   const move=p=>({...p,x:p.x*axis,y:p.y*axis+(p.y>1e-6?stalk:0)});
   const step={...raw,surfaces:raw.surfaces.map(poly=>poly.map(move)),branches:raw.branches.map(b=>({...b,a:move(b.a),b:move(b.b)}))};
   if(stalk){const attachment=raw.points.find(p=>p.id==='L.0:C');const y=(attachment?.y??2.2)+stalk;step.surfaces.push([{x:-.08,y:0},{x:.08,y:0},{x:.08,y},{x:-.08,y}]);}
   return {params,step,controls:{axis,shootPairs:s.cycles,contraction:cut,stalk}};
  });
  return {profile,cells};
 });
}
export function developmentMatrixSvg(){
 const rows=developmentMatrixData(),frame=frameFor(rows.flatMap(r=>r.cells.map(c=>c.step)));
 const text=(x,y,s,size=17,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}">${s}</text>`;
 let body=text(670,38,'Individual development →',24);
 const names=['Primordium','Lateral points','Differentiation','Blade filling','Rounding','Stalk elongation'];
 names.forEach((name,i)=>body+=text(270+i*180,88,name));
 body+=`<rect x="1085" y="104" width="170" height="590" fill="#f4f4f4"/>`;
 rows.forEach((row,r)=>{
  const y=110+r*195;
  body+=text(25,y+78,row.profile.name,19,'start');
  row.cells.forEach((cell,c)=>{
   body+=svgFor(cell.step,cell.params,frame,`matrix-${r}-${c}`).replace('<svg ',`<svg x="${185+c*180}" y="${y}" `).replace('width="800" height="800"','width="170" height="170"').replace(/<rect[^>]*fill="white"\/>/,'');
  });
  if(r<2)body+=`<path d="M 20 ${y+185} H 1345" stroke="#ddd" stroke-width=".7"/>`;
 });
 body+=text(1170,724,'Mature forms',18)+text(25,760,'Across: one developmental schedule. Down: different balances of the same rules.',17,'start');
 body+=text(25,789,'Shared scale · E/C geometry + margin rounding + explicit basal elongation',16,'start');
 body+=text(25,818,'A parametric comparison, not yet an observed ontogenetic leaf sequence.',16,'start');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1380" height="845" viewBox="0 0 1380 845"><rect width="1380" height="845" fill="white"/><g fill="black" font-family="Garamond, serif">${body}</g></svg>`;
}
