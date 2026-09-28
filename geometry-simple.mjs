import {expansionGeometry,contractionGeometry} from './diagrams.mjs?v=pole-pairs-2';
const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
const text=(x,y,s,size=13)=>`<text x="${x}" y="${y}" font-size="${size}">${s}</text>`;
export function simpleGeometrySvg({position=.35,rotation=100,intensity=.65,contraction=.65}={}){
 const a={x:0,y:0},b={x:8,y:0},e=expansionGeometry(a,b,a,b,position,intensity,rotation);
 const project=p=>({x:90+p.x*43,y:340-p.y*43});
 const coord=p=>`${p.x} ${p.y}`;
 const line=(ps,color='#aaa',width=.8,dash='')=>`<path d="M ${ps.map(p=>coord(project(p))).join(' L ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}"/>`;
 const dot=(p,filled=true)=>{const q=project(p);return `<circle cx="${q.x}" cy="${q.y}" r="4" fill="${filled?'black':'white'}" stroke="black" stroke-width="1.2"/>`;};
 const arrow=(from,to)=>line([from,to],'#333',1.2,'2 4').replace('/>',' marker-end="url(#simple-ec-arrow)"/>');
 const smooth=ps=>{
  const q=ps.map(project);let d=`M ${coord(q[0])}`;
  for(let i=1;i<q.length-1;i++){const before=lerp(q[i-1],q[i],.78),after=lerp(q[i],q[i+1],.22);d+=` L ${coord(before)} Q ${coord(q[i])} ${coord(after)}`;}
  return `<path d="${d} L ${coord(q.at(-1))}" fill="none" stroke="black" stroke-width="2.8" stroke-linejoin="round"/>`;
 };
 let body=`<defs><marker id="simple-ec-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#333"/></marker></defs>`;
 for(let col=0;col<2;col++){
  body+=`<g transform="translate(${col*550} 0)">`+text(180,48,col?'Contraction':'Expansion',27);
  if(!col){
   for(const p of [.12,.22,.32,.42,.52,.62]){const v=expansionGeometry(a,b,a,b,p,intensity,rotation);body+=line([a,v.point,b]);}
   body+=line([a,e.point,b],'#777',.9)+line([a,b],'#333',1)+arrow(e.center,e.point)+smooth([a,e.point,b]);
   body+=dot(a,false)+dot(b)+dot(e.point)+dot(e.center,false);
   const q=project(e.center),p=project(e.point);
   body+=text(q.x-30,365,'position p',12)+text((q.x+p.x)/2+12,(q.y+p.y)/2,'intensity',12);
   body+=text(60,410,'Place a pole on a rotated shoot; connect it to the edge ends.',13);
  }else{
   const left=contractionGeometry(a,e.point,e.center,position,contraction),right=contractionGeometry(b,e.point,e.center,position,contraction);
   for(const i of [.05,.2,.4,.6,.8,.95]){const l=contractionGeometry(a,e.point,e.center,position,i),r=contractionGeometry(b,e.point,e.center,position,i);body+=line([a,l.point,e.point,r.point,b]);}
   body+=line([a,e.point,b],'#888',.9,'5 4')+line([a,b],'#333',1);
   body+=line([left.at,e.center],'#aaa',.8,'2 4')+line([right.at,e.center],'#aaa',.8,'2 4');
   body+=arrow(left.at,left.point)+arrow(right.at,right.point)+smooth([a,left.point,e.point,right.point,b]);
   body+=dot(a,false)+dot(b)+dot(e.point)+dot(left.point,false)+dot(right.point,false)+dot(e.center,false);
   body+=text(190,365,'inherited origin O',12)+text(60,410,'Pull points on the two edges toward the inherited origin.',13);
  }
  body+='</g>';
 }
 body+=`<path d="M 550 25 V 430" stroke="#ddd"/>`;
 body+=text(45,466,'Filled dots: E poles   /   Open dots: C poles and origins   /   Light lines: parameter variants',13);
 body+=text(45,491,'Bold outline: illustrative quadratic rounding of the selected construction; smoothing follows the E/C move.',12);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="515" viewBox="0 0 1100 515" role="img" aria-label="Simple expansion and contraction geometry"><rect width="1100" height="515" fill="white"/><g font-family="Arial,sans-serif" fill="black">${body}</g></svg>`;
}
