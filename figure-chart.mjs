import {generate,frameFor,svgFor} from './leaf.mjs?v=studio-1';
export const FIGURE_ORDER=['Magnolia','Ginkgo','Date palm','American ash','Maple','Holly','Larkspur','Saw palmetto','Fig','Fern','Red oak','Walnut','Ground ivy','Sycamore','Buttercup','White oak'];

// Compare silhouettes on one scale, sampling by boundary arc length rather than vertex count.
export function signature(step,size) {
  const points=step.surfaces[0],lengths=[0];
  for(let i=1;i<=points.length;i++){const a=points[i-1],b=points[i%points.length];lengths.push(lengths.at(-1)+Math.hypot(b.x-a.x,b.y-a.y));}
  const total=lengths.at(-1),out=[];let edge=0;
  for(let i=0;i<96;i++){
    const target=total*i/96;
    while(edge<points.length-1&&lengths[edge+1]<target)edge++;
    const a=points[edge],b=points[(edge+1)%points.length],t=(target-lengths[edge])/(lengths[edge+1]-lengths[edge]||1);
    out.push((a.x+(b.x-a.x)*t)/size,(a.y+(b.y-a.y)*t)/size);
  }
  return out;
}
export const difference=(a,b)=>Math.sqrt(a.reduce((sum,v,i)=>sum+(v-b[i])**2,0)/a.length);

// Keep whole E/C pairs so every drawing agrees with its column header.
export function developmentPairs(steps,tolerance=.002) {
  const frame=frameFor(steps),pairs=[];
  for(let i=0;i<steps.length-1;i++) {
    const e=steps[i],c=steps[i+1];
    if(e.operation!=='E'||c.operation!=='C'||e.stage!==c.stage)continue;
    const items=[e,c].map((step,j)=>({step,sourceStep:i+j+1,label:String(i+j+1),signature:signature(step,frame.size)}));
    const previous=pairs.at(-1);
    const pair={items,sourceStep:i+1,step:e,signature:items.flatMap(item=>item.signature)};
    const similar=previous&&Math.max(...items.map((item,j)=>difference(item.signature,previous.items[j].signature)))<=tolerance;
    // Retain the actual final cycle, even when its last operation is dormant.
    if(similar){if(i===steps.length-2&&pairs.length>1)pairs[pairs.length-1]=pair;}
    else pairs.push(pair);
    i++;
  }
  return pairs;
}

export function selectPairs(pairs,count) {
  if(pairs.length<=count)return pairs;
  const chosen=new Set([0,pairs.length-1]);
  const blade=pairs.findIndex((x,i)=>i&&x.step.stage!==pairs[i-1].step.stage);
  if(blade>0&&count>=4){chosen.add(blade-1);chosen.add(blade);}
  while(chosen.size<count) {
    let best=-1,score=-1;
    for(let i=1;i<pairs.length-1;i++)if(!chosen.has(i)) {
      const nearest=Math.min(...[...chosen].map(j=>Math.abs(pairs[i].sourceStep-pairs[j].sourceStep)));
      const visual=Math.min(...[...chosen].map(j=>difference(pairs[i].signature,pairs[j].signature)));
      const value=visual+nearest*.002;
      if(value>score){score=value;best=i;}
    }
    if(best<0)break;chosen.add(best);
  }
  return [...chosen].sort((a,b)=>a-b).map(i=>pairs[i]);
}

export function chartRow(source,count=12) {
  const target=Math.ceil(count/2),params=structuredClone(source);
  // Chart-only recipes complete half cycles and can develop beyond the saved form.
  params.stages.forEach(s=>s.cycles=Math.ceil(s.cycles));
  let result=generate(params),pairs=developmentPairs(result.steps),attempt=0;
  while(pairs.length<target&&attempt<12&&!result.stops.length) {
    // Alternate additional shoot branching and blade differentiation. Gradually
    // relax length cutoffs so dormant short edges can take part in later growth.
    const phase=attempt%2,rule=params.stages[phase];
    rule.cycles=Math.min(20,rule.cycles+1);
    for(const stage of params.stages)for(const key of ['minExpansionLength','minContractionLength'])
      if(stage[key]!==null)stage[key]*=.7;
    result=generate(params);pairs=developmentPairs(result.steps);attempt++;
  }
  const selected=selectPairs(pairs,target).flatMap(pair=>pair.items);
  return {params,total:result.steps.length,selected,frame:frameFor(result.steps),
    skipped:result.steps.length-selected.length,extended:attempt>0,
    shortfall:Math.max(0,count-selected.length),stops:result.stops};
}
export function chartRows(studies,count=12) {
  return FIGURE_ORDER.map(name=>studies.find(p=>p.name===name)).filter(Boolean).map(p=>chartRow(p,count));
}

const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function figureSvg(rows,count=12) {
  const cell=92,label=155,top=100,rowHeight=108,width=label+count*cell+24,height=top+rows.length*rowHeight+72;
  const text=(x,y,s,size=13,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra}>${escape(s)}</text>`;
  let body=text(24,34,'Metamorphic leaves',26,'font-weight="600"')+text(24,58,'Development chart · 16 leaves · selected E/C states',14);
  for(let i=0;i<count;i++)body+=text(label+(i+.5)*cell,88,i%2?'C':'E',13,'text-anchor="middle" font-weight="600" class="operation-header"');
  rows.forEach((row,r)=>{
    const y=top+r*rowHeight;
    body+=`<g class="figure-row" data-leaf="${escape(row.params.name)}">`+text(24,y+34,`${String.fromCharCode(97+r)} / ${row.params.name}`,13,'font-weight="600"');
    row.selected.forEach((item,i)=>{
      const x=label+i*cell;
      body+=`<g class="figure-cell" data-step="${item.label}"><title>${escape(row.params.name)} · ${item.label} · ${item.step.operation}</title>`;
      body+=svgFor(item.step,{...row.params,veins:true,points:false,frontier:false},row.frame,`figure-${r}-${i}`).replace('<svg ',`<svg x="${x}" y="${y}" `).replace('width="800" height="800"',`width="${cell}" height="82"`);
      body+=text(x+cell/2,y+96,item.label,12,'text-anchor="middle"');
      if(i&&item.step.stage!==row.selected[i-1].step.stage)body+=`<path d="M ${x-2} ${y+12} v 65" stroke="#b0b6a8" stroke-width="1"/>`;
      body+='</g>';
    });
    body+='</g>';
  });
  body+=text(24,height-36,'Numbers retain computation indices; gaps indicate skipped similar states. E = expansion, C = contraction.',12);
  body+=text(24,height-16,'Short sequences develop additional branches and blades. Lines mark the blade phase.',12);
  return `<svg xmlns="http://www.w3.org/2000/svg" class="development-figure" role="img" aria-label="Sixteen leaf development sequences" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" font-family="Arial,sans-serif" fill="#222"><rect width="100%" height="100%" fill="white"/>${body}</svg>`;
}
