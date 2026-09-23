import {generate,frameFor,svgFor} from './leaf.mjs?v=rhino-2';

export function atlasRows(studies) {
  return studies.map((params,index) => {
    const result = generate(params);
    return {params,index,...result,frame:frameFor(result.steps)};
  });
}

export function atlasTable(rows) {
  const count = Math.max(0,...rows.map(row => row.steps.length));
  const headings = Array.from({length:count},(_,i) => `<th scope="col"><b>Step</b><span>${String(i+1).padStart(2,'0')}</span></th>`).join('');
  return `<table class="atlas-table"><caption>All generated E/C operations, starting at 01 / E. Each row uses a fixed scale. Green dividers begin blade differentiation.</caption><thead><tr><th scope="col" class="row-name">Leaf / Figure 7</th>${headings}<th scope="col" class="atlas-final">Final</th></tr></thead><tbody>${rows.map(row => {
    const {params,index,steps,frame,stops} = row;
    const cells = Array.from({length:count},(_,i) => {
      const step = steps[i];
      if (!step) return '<td class="no-step"><span aria-label="No further operation">&ndash;</span></td>';
      const boundary = step.stage>1 && (i===0 || steps[i-1].stage!==step.stage);
      return `<td class="${boundary?`stage-break stage-${step.stage}`:''}"><button data-study="${index}" data-step="${i}" aria-label="${params.name}, step ${i+1}, ${step.operation}, stage ${step.stage}">${svgFor(step,params,frame,`atlas-${index}-${i}`)}<span class="atlas-step-label">${String(i+1).padStart(2,'0')} / ${step.operation}<small>S${step.stage}</small></span></button></td>`;
    }).join('');
    return `<tr><th scope="row" class="row-name"><button data-study="${index}"><span class="row-letter">${String.fromCharCode(97+index)}</span>${params.name}<small>${params.trajectory==='base'?'Radial':'Linear'} / ${steps.length} steps</small><span class="edit-link">Edit leaf &rarr;</span></button>${stops.length?`<span class="row-stop" title="${stops.join(' ')}">Local growth limit</span>`:''}</th>${cells}<td class="atlas-final">${steps.length?`<button data-study="${index}" data-step="${steps.length-1}" aria-label="Edit final ${params.name}">${svgFor(steps.at(-1),params,frame,`atlas-final-${index}`)}</button>`:'No cycles'}</td></tr>`;
  }).join('')}</tbody></table>`;
}

// Standalone vector contact sheet: every operation, no screenshots or omitted steps.
export function atlasSvg(rows) {
  const count=Math.max(0,...rows.map(row=>row.steps.length));
  const cell=125,label=180,top=95,rowHeight=155,width=label+(count+1)*cell,height=top+rows.length*rowHeight;
  const text=(x,y,value,size=13)=>`<text x="${x}" y="${y}" font-family="sans-serif" font-size="${size}" fill="#333">${value}</text>`;
  const nested=(step,row,id,x,y)=>svgFor(step,row.params,row.frame,id).replace('<svg ',`<svg x="${x}" y="${y}" `).replace('width="800" height="800"',`width="${cell}" height="${cell}"`);
  let content=text(18,28,'Metamorphic leaves / 16 development sequences',22)+text(18,51,'Recovered Grasshopper studies. Every E/C operation shown; shared scale within each row.');
  for(let i=0;i<count;i++)content+=text(label+i*cell+45,80,`Step ${String(i+1).padStart(2,'0')}`);
  content+=text(label+count*cell+40,80,'Final');
  rows.forEach(row=>{
    const y=top+row.index*rowHeight;
    content+=`<path d="M 0 ${y} H ${width}" stroke="#ddd"/>`+text(18,y+35,`${String.fromCharCode(97+row.index)} / ${row.params.name}`)+text(18,y+58,`${row.steps.length} operations`,11);
    row.steps.forEach((step,i)=>{
      content+=nested(step,row,`sheet-${row.index}-${i}`,label+i*cell,y+5);
      content+=text(label+i*cell+42,y+145,`S${step.stage} / ${step.operation} ${step.intensity>0?'+':''}${step.intensity.toFixed(2)}`,11);
      if(step.stage>1&&(i===0||row.steps[i-1].stage!==step.stage))content+=`<path d="M ${label+i*cell} ${y} v ${rowHeight}" stroke="#586b43" stroke-width="2"/>`;
    });
    if(row.steps.length)content+=nested(row.steps.at(-1),row,`sheet-final-${row.index}`,label+count*cell,y+5);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="white"/>${content}</svg>`;
}
