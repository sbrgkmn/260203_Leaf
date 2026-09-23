export const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
export const distance=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
export function displace(origin,vector,intensity,rotation) {
  const angle=rotation*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
  return {x:origin.x+(vector.x*c-vector.y*s)*intensity,y:origin.y+(vector.x*s+vector.y*c)*intensity};
}
export function project(p,axis) {
  const dx=axis.b.x-axis.a.x,dy=axis.b.y-axis.a.y;
  return lerp(axis.a,axis.b,Math.max(0,Math.min(1,((p.x-axis.a.x)*dx+(p.y-axis.a.y)*dy)/(dx*dx+dy*dy||1))));
}
export function crosses(a,b,c,d) {
  if(Math.max(a.x,b.x)<Math.min(c.x,d.x)||Math.max(c.x,d.x)<Math.min(a.x,b.x)||Math.max(a.y,b.y)<Math.min(c.y,d.y)||Math.max(c.y,d.y)<Math.min(a.y,b.y))return false;
  const side=(p,q,r)=>(q.x-p.x)*(r.y-p.y)-(q.y-p.y)*(r.x-p.x);
  return side(a,b,c)*side(a,b,d)<-1e-14&&side(c,d,a)*side(c,d,b)<-1e-14;
}
export function isSimple(points) {
  for(let i=0;i<points.length;i++)for(let j=i+2;j<points.length;j++) {
    if(i===0&&j===points.length-1)continue;
    if(crosses(points[i],points[(i+1)%points.length],points[j],points[(j+1)%points.length]))return false;
  }
  return true;
}
