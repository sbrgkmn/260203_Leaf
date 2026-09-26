import {marginSeries,fiveLobeRecipe} from './margin-study.mjs?v=pole-pairs-2';
import {generate,frameFor,svgFor,outlinePath} from './leaf.mjs?v=pole-pairs-2';
import {rationalBezier} from './blade.mjs?v=pole-pairs-2';
const text=(x,y,s,size=14,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
const plate=(w,h,title,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><title>${title}</title><rect width="${w}" height="${h}" fill="white"/><g fill="#171c16" font-family="Arial,sans-serif">${body}</g></svg>`;
function leaf(step,params,frame,id,x,y,size,construction){
  let svg=svgFor(step,params,frame,id).replace('width="800" height="800"',`x="${x}" y="${y}" width="${size}" height="${size}"`);
  if(construction)svg=svg.replace('</svg>',`<path d="${outlinePath(step.controlPoints)}" fill="none" stroke="#90978d" stroke-width="${frame.size/500}" stroke-dasharray="${frame.size/180} ${frame.size/180}"/></svg>`);
  return svg;
}
export function marginDepthSvg(options={}){
  const rows=marginSeries(options),frame=frameFor(rows.flatMap(r=>r.steps));
  let body=text(30,35,'Five primary shoots / a linear series of margins',23)+text(30,64,'Two pairs along the midrib, plus the apex. E/C makes the cuts; rational curves shape their tips and sinuses.',14);
  rows.forEach((r,i)=>{
    const x=30+i*245;
    body+=text(x+115,107,r.name,18,'middle')+leaf(r.steps.at(-1),r.params,frame,`margin-depth-${i}`,x,122,230,options.construction??true);
    body+=text(x+115,377,r.note,11,'middle')+text(x+115,400,`C ${r.params.stages[0].intensities[1].toFixed(2)} / tip w ${r.params.positiveWeight.toFixed(1)} / notch w ${r.params.negativeWeight.toFixed(1)}`,11,'middle');
  });
  body+=text(30,444,'Lobed, cleft, parted and divided describe increasing separation. Incised adds finer sharp cuts; it is not simply a deeper stage.',13);
  body+=text(30,468,'Schematic types: C strength is a construction parameter, not a measured incision-depth percentage. Divided remains a simple blade.',12);
  return plate(1530,492,'Five-lobed E/C leaves: shallow lobed, lobed, cleft, parted, divided and incised margins',body);
}
export function marginRoundingSvg({construction=true}={}){
  const weights=[.3,.7,1.6,5,16],base=fiveLobeRecipe({depth:.66,tipWeight:1.6,notchWeight:1.6});
  const rows=[weights.map(w=>({...base,positiveWeight:w})),weights.map(w=>({...base,negativeWeight:w}))];
  const steps=rows.map(row=>row.map(p=>generate(p).steps.at(-1))),frame=frameFor(steps.flat());
  let body=text(30,36,'Rounding can sharpen / identical E/C poles in every cell',23)+text(30,64,'Read left to right: soft arcs become tighter around their poles. The boundary stays curved, even at high weights.',14);
  rows.forEach((row,j)=>{
    const y=90+j*330;
    body+=text(30,y+23,j?'02 / NOTCH SHARPNESS — tip weight stays 1.6':'01 / TIP SHARPNESS — notch weight stays 1.6',16);
    row.forEach((p,i)=>{
      const x=60+i*286;
      body+=leaf(steps[j][i],p,frame,`margin-round-${j}-${i}`,x,y+42,235,construction)+text(x+118,y+295,`w = ${weights[i]}`,14,'middle');
    });
  });
  body+=text(30,775,'Lower w smooths away from a pole; higher w approaches it. Tip and notch weights are independent; neither adds branches.',13);
  return plate(1530,805,'Independent tip and notch sharpening in two linear series on the same five-lobed scaffold',body);
}
export function marginRuleSvg(){
  let body=text(30,35,'One rounding function / two independent pole roles',23);
  for(let i=0;i<2;i++){
    const x=60+i*710,a={x:60,y:220},p={x:300,y:i?310:80},b={x:540,y:220};
    body+=`<g transform="translate(${x} 20)">`+text(35,58,i?'Negative pole: sinus / notch':'Positive pole: lobe / tip',18);
    body+=`<path d="M ${a.x} ${a.y} L ${p.x} ${p.y} L ${b.x} ${b.y}" fill="none" stroke="#aaa" stroke-dasharray="5 5"/>`;
    for(const [k,w] of [.3,.7,1.6,5,16].entries()){
      const pts=Array.from({length:101},(_,j)=>rationalBezier(a,p,b,j/100,w));
      body+=`<path d="M ${pts.map(q=>`${q.x} ${q.y}`).join(' L ')}" fill="none" stroke="${['#bbc2b7','#919b8c','#66745e','#3c4a36','#111'][k]}" stroke-width="2"/>`;
    }
    body+=`<circle cx="${p.x}" cy="${p.y}" r="4" fill="${i?'white':'black'}" stroke="black"/>`+text(35,352,'w: 0.3 → 0.7 → 1.6 → 5 → 16 / soft → sharp',14)+'</g>';
  }
  body+=text(35,438,'R(t) = [(1−t)² A + 2wt(1−t) P + t² B] / [(1−t)² + 2wt(1−t) + t²]',19);
  body+=text(35,471,'A and B are neighboring edge midpoints. This rational quadratic interpolates A and B, with P controlling curvature.',14);
  body+=text(35,495,'Moving P by C deepens a cut. Increasing its rounding weight tightens the curve near P. These are different changes.',14);
  return plate(1530,525,'Rational quadratic rounding formula and soft-to-sharp families at positive and negative poles',body);
}
