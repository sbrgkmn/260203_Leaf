import {expansionGeometry,contractionGeometry} from './diagrams.mjs?v=pole-pairs-2';
const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
const text=(x,y,s,size=13)=>`<text x="${x}" y="${y}" font-size="${size}">${s}</text>`;
export function simpleGeometrySvg({position=.35,rotation=100,intensity=.65,contraction=.65}={}){
 const a={x:0,y:0},b={x:8,y:0},e=expansionGeometry(a,b,a,b,position,intensity,rotation);
 let side=-1;
 const project=p=>({x:550+side*p.y*55,y:570-p.x*55});
 const coord=p=>`${p.x} ${p.y}`;
 const line=(ps,color='#aaa',width=.8,dash='')=>`<path d="M ${ps.map(p=>coord(project(p))).join(' L ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-dasharray="${dash}"/>`;
 const dot=(p,filled=true)=>{const q=project(p);return `<circle cx="${q.x}" cy="${q.y}" r="4" fill="${filled?'black':'white'}" stroke="black" stroke-width="1.2"/>`;};
 const arrow=(from,to,endGap=10)=>{
  const length=Math.hypot(to.x-from.x,to.y-from.y);
  if(length<.001)return '';
  const gap=Math.min(10/55,length*.24),tipGap=Math.min(endGap/55,length*.65);
  return line([lerp(from,to,gap/length),lerp(from,to,1-tipGap/length)],'#333',1.5,'2 4').replace('/>',' marker-end="url(#simple-ec-arrow)"/>');
 };
 const smooth=ps=>{
  const q=ps.map(project);let d=`M ${coord(q[0])}`;
  for(let i=1;i<q.length-1;i++){const before=lerp(q[i-1],q[i],.78),after=lerp(q[i],q[i+1],.22);d+=` L ${coord(before)} Q ${coord(q[i])} ${coord(after)}`;}
  return `<path d="${d} L ${coord(q.at(-1))}" fill="none" stroke="black" stroke-width="2.8" stroke-linejoin="round"/>`;
 };
 let body=`<defs><marker id="simple-ec-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#333"/></marker></defs>`;
 for(let col=0;col<2;col++){
  side=col?1:-1;
  body+='<g>'+text(col?910:70,350,col?'contraction':'expansion',27);
  if(!col){
   for(const p of [.12,.22,.32,.42,.52,.62]){const v=expansionGeometry(a,b,a,b,p,intensity,rotation);body+=line([a,v.point,b]);}
   body+=line([a,e.point,b],'#777',.9)+line([a,b],'#333',1)+smooth([a,e.point,b])+arrow(e.center,e.point);
   body+=dot(a,false)+dot(b)+dot(e.point)+dot(e.center,false);
   const q=project(e.center),p=project(e.point);
   body+=text(q.x-80,q.y+20,'position p',12)+text((q.x+p.x)/2-50,(q.y+p.y)/2-12,'intensity',12);
   body+=text(65,620,'Place a pole on a rotated shoot; connect it to the edge ends.',13);
  }else{
   const left=contractionGeometry(a,e.point,e.center,position,contraction),right=contractionGeometry(b,e.point,e.center,position,contraction);
   for(const i of [.05,.2,.4,.6,.8,.95]){const l=contractionGeometry(a,e.point,e.center,position,i),r=contractionGeometry(b,e.point,e.center,position,i);body+=line([a,l.point,e.point,r.point,b]);}
   body+=line([a,e.point,b],'#888',.9,'5 4')+line([a,b],'#333',1);
   body+=line([left.point,e.center],'#aaa',.8,'2 4')+line([right.point,e.center],'#aaa',.8,'2 4');
   body+=smooth([a,left.point,e.point,right.point,b])+arrow(left.at,left.point,32)+arrow(right.at,right.point,32);
   body+=dot(a,false)+dot(b)+dot(e.point)+dot(left.point,false)+dot(right.point,false)+dot(e.center,false);
   body+=text(570,project(e.center).y+20,'inherited origin O',12)+text(610,620,'Pull points on the two edges toward the inherited origin.',13);
  }
  body+='</g>';
 }

 body+=text(45,660,'Filled dots: E poles   /   Open dots: C poles and origins   /   Light lines: parameter variants',13);
 body+=text(45,685,'Bold outline: illustrative quadratic rounding of the selected construction; smoothing follows the E/C move.',12);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="710" viewBox="0 0 1100 710" role="img" aria-label="Simple expansion and contraction geometry"><rect width="1100" height="710" fill="white"/><g font-family="Arial,sans-serif" fill="black">${body}</g></svg>`;
}
