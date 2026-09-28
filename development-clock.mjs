import {bradyMatrixData} from './brady-matrix.mjs?v=9';
import {generate,svgFor} from './leaf.mjs?v=pole-pairs-2';
const center=960;
const point=(r,a)=>({x:center+r*Math.cos(a*Math.PI/180),y:center+r*Math.sin(a*Math.PI/180)});
const text=(x,y,value,size=22)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}">${value}</text>`;
export function developmentClockSvg(){
 const all=bradyMatrixData();
 // Place mature examples first. The quadrant mapping is interpretive;
 // no generated leaf is deformed to force it into a sector.
 const families=all.map((_,index)=>({index,angle:75-index*30}));
 const average=values=>typeof values[0]==='number'?values.reduce((a,b)=>a+b,0)/values.length:
  Array.isArray(values[0])?values[0].map((_,i)=>average(values.map(v=>v[i]))):
  values[0]&&typeof values[0]==='object'?Object.fromEntries(Object.keys(values[0]).map(k=>[k,average(values.map(v=>v[k]))])):values[0];
 const params=average(all.map(r=>r.params)),seed=generate(params).steps[0];
 const leaf=(step,params,frame,p,size,id)=>svgFor(step,{...params,veins:true,points:false,frontier:false},frame,id).replace('<svg ',`<svg x="${p.x-size/2}" y="${p.y-size/2}" `).replace('width="800" height="800"',`width="${size}" height="${size}"`);
 let body=`<defs><marker id="clock-arrow" viewBox="0 0 10 8" refX="9" refY="4" markerWidth="8" markerHeight="7" orient="auto"><path d="M 0 0 L 10 4 L 0 8 Z" fill="black"/></marker></defs>`;
 body+=text(center,25,'Buttercup / formative trajectories',32)+text(center,65,'EXPANSION (+)',27);
 body+=`<path d="M 960 850 V 145 M 960 1070 V 1750" fill="none" stroke="#aaa" stroke-width="1" marker-end="url(#clock-arrow)"/><path d="M 140 960 H 1780" stroke="#ddd"/>`;
 for(const r of [310,520,735])body+=`<circle cx="960" cy="960" r="${r}" fill="none" stroke="#ddd" stroke-width="1"/>`;
 body+=text(center,1795,'CONTRACTION (−)',27);
 for(const [x,y,title,sub] of [[310,245,'Segmenting','Differentiated shoots'],[1610,245,'Spreading','Broader blade'],[310,1625,'Shooting','Reduced, pointed form'],[1610,1625,'Stemming','Basal elongation']])body+=text(x,y,title,30)+text(x,y+34,sub,20);
 families.forEach(({index,angle},r)=>{
  const row=all[index],locate=radius=>point(radius,angle-80*(1-radius/735));
  const ps=Array.from({length:75},(_,i)=>locate(65+i*(735-65)/74));
  body+=`<path d="M ${ps.map(p=>`${p.x} ${p.y}`).join(' L ')}" fill="none" stroke="#777" stroke-width="1.8"/>`;
  for(const radius of [420,640]){const a=locate(radius),b=locate(radius+22);body+=`<path d="M ${a.x} ${a.y} L ${b.x} ${b.y}" stroke="black" stroke-width="1.8" marker-end="url(#clock-arrow)"/>`;}
  [[310,5],[520,7],[735,11]].forEach(([radius,stepIndex],c)=>{
   // Suppress redundant inner states of the simple terminal series.
   if(c===0 && index%2===1)return;
   const p=locate(radius),size=c===2?180:c===1?125:110;
   body+=leaf(row.steps[stepIndex],row.params,row.frame,p,size,`clock-${r}-${c}`);
   
  });
 });
 // Counter-clockwise from stemming, via spreading and segmenting, to shooting.
 for(const [a,b] of [[90,0],[0,-90],[-90,-180],[-180,-270]]){const p=point(870,a),q=point(870,b);body+=`<path d="M ${p.x} ${p.y} A 870 870 0 0 0 ${q.x} ${q.y}" fill="none" stroke="black" stroke-width="1.8" stroke-dasharray="10 7" marker-end="url(#clock-arrow)"/>`;}
 body+=leaf(seed,params,all[0].frame,{x:960,y:960},155,'clock-shared-seed');
 
 body+=text(center,1850,'Embryogenesis: one shared origin, curving outward through selected E/C states.',21);
 body+=text(center,1885,'Ontogenetic reading: stemming → spreading → segmenting → shooting (dashed perimeter).',21);
 body+=text(center,1923,'Twelve mature Brady forms, ordered 1 to 12 counterclockwise. Inner rings show selected development stages from the same matrix.',17);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1970" viewBox="0 0 1920 1970" aria-label="Concentric formative trajectories"><rect width="1920" height="1970" fill="white"/><g fill="black" font-family="Garamond, serif">${body}</g></svg>`;
}
