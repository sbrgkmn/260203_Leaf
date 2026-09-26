import {bladeConfigurations,simpleButtercupRecipe,BLADE_CONFIGURATIONS} from './blade-configurations.mjs?v=pole-pairs-2';
import {constructionSvg} from './diagrams.mjs?v=pole-pairs-2';
import {generate,frameFor} from './leaf.mjs?v=pole-pairs-2';
const text=(x,y,s,size=13,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
const nest=(svg,x,y,size)=>svg.replace('<svg ',`<svg x="${x}" y="${y}" `).replace('width="800" height="800"',`width="${size}" height="${size}"`);
const plate=(h,title,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="${h}" viewBox="0 0 1100 ${h}" role="img" aria-label="${title}"><title>${title}</title><rect width="1100" height="${h}" fill="white"/><g font-family="Arial,sans-serif" fill="#171c16">${body}</g></svg>`;

export function bladeConfigurationSvg({filled=false}={}){
  const cases=bladeConfigurations(),frame=frameFor(cases.flatMap(r=>r.steps));
  let body=text(30,34,'Five-lobed leaf / upper tip / lower node',23)+text(30,61,'First letter: upper tip. Second letter: lower node. E = sharp / anchored; C = rounded.',13);
  cases.forEach((r,i)=>{
    const x=20+i*270;
    body+=text(x+130,96,r.name,18,'middle')+text(x+130,119,r.description,12,'middle')+nest(constructionSvg(r.steps.at(-1),undefined,frame,{filled,rounding:true},`blade-config-${i}`),x,138,260);
    body+=text(x+130,424,String(i+1).padStart(2,'0'),13,'middle');
  });
  body+=text(30,461,'One rule for all tips, one for all nodes. C / E rounds the lobes between fixed sharp anchors: the Ground ivy-like finish.',12);
  return plate(486,'Four combinations of upper tip and lower node treatment on one five-lobed scaffold',body);
}
export function bladeDevelopmentSvg({profile='ec',filled=false}={}){
  const params=simpleButtercupRecipe(profile),{steps}=generate(params),frame=frameFor(steps);
  const configuration=BLADE_CONFIGURATIONS.find(c=>c.id===profile);
  const title=configuration.name+' / '+configuration.description;
  let body=text(30,34,`${title} / two E/C cycles`,23)+text(30,61,'The same construction drawing as Worked buttercup, reduced to four operations and five primary lobes.',13);
  steps.forEach((s,i)=>{
    const x=20+i*270;
    body+=text(x+130,100,s.operation,15,'middle')+nest(constructionSvg(s,steps[i-1],frame,{filled,rounding:true},`blade-step-${i}`),x,113,260);
    body+=text(x+130,400,String(i+1).padStart(2,'0'),13,'middle');
  });
  body+=text(30,446,'E places a positive pole; C introduces a sinus. The blade finish is applied after each operation, without moving its poles.',12);
  return plate(471,'Four E/C construction steps of the selected simple Buttercup blade finish',body);
}
