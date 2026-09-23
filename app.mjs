import { PRESETS, generate, frameFor, svgFor } from './leaf.mjs?v=studio-1';
import { atlasRows, atlasTable, atlasSvg } from './atlas.mjs?v=studio-1';
import { STAGES } from './growth.mjs?v=studio-1';
import {VARIATIONS,NEUTRAL,MACRO_FIELDS,varyRecipe,neighboringVariations} from './variations.mjs?v=studio-1';
import {studyParams} from './presets.mjs?v=studio-1';
import {chartRows,figureSvg} from './figure-chart.mjs?v=figure-2';
const $ = id => document.getElementById(id);
const editable=studyParams;
const collection=source=>({source,studies:source.map(editable),anchors:source.map(editable),controls:source.map(()=>({...NEUTRAL})),index:0});
const collections={paper:collection(PRESETS),lab:collection(VARIATIONS)};
let mode='paper',studies=collections.paper.studies,candidates=[];
let presetIndex = 0, params, steps = [], frame, selected = 0, timer = null, pending = false;
const operationFields = [
  ['position', 'Position scale', 0, 2, .01],
  ['intensity', 'Intensity scale', -2, 2, .01],
];
const help = {
  expansion: ['Scale the saved E positions along the current vein axis.', 'Scale the saved E vector lengths. The source clamps E values to 0–1.'],
  contraction: ['Scale the saved C positions along each boundary edge.', 'Scale the saved C strengths. Negative values are retained where the original definition permits them. Negative endpoints use the separate stem rule.'],
};
function format(id, value) {
  if(id==='macro-origin')return `${value>0?'+':''}${Number(value).toFixed(3)}`;
  if(id==='macro-fullness')return `${value>0?'+':''}${Number(value).toFixed(2)}`;
  if(id.startsWith('macro-')&&id!=='macro-roundness')return `${value>0?'+':''}${Number(value).toFixed(1)}${id==='macro-spread'?'°':''}`;
  if (id.includes('cycles')) return String(value);
  if (id.includes('rotation')) return `${value} deg`;
  if (id.includes('intensity')) return `${Number(value)>0?'+':''}${Number(value).toFixed(2)}`;
  return Number(value).toFixed(id==='firstPosition'||id.includes('Length') ? 3 : 2);
}
function slider(id, label, min, max, increment, value, title = '') {
  return `<label class="slider" for="${id}" title="${title}"><span class="slider-heading"><span>${label}</span><output for="${id}" id="${id}Value">${format(id,value)}</output></span><input id="${id}" type="range" min="${min}" max="${max}" step="${increment}" value="${value}"></label>`;
}
function renderControls(preserveMacros=false) {
  if(!preserveMacros)renderMacros();
  $('trajectory').value=params.trajectory;
  $('paperReference').textContent=params.reference+' / '+params.source;
  $('paperObservation').textContent=params.observation;
  $('paperRecipe').textContent=params.recipe+(params.sourceKey==='oak'&&params.rounding?' Boundary smoothing is enabled; the source growth rules are unchanged.':'');
  $('stageControls').innerHTML=params.stages.map((rule,i)=>`
    <fieldset class="stage-control"><legend>0${i+1} / ${STAGES[i]}</legend>
    <p class="stage-note">${i?'Each finished shoot edge starts its own blade recursion.':'Radial or linear continuation selects which descendant edges develop.'}</p>
    ${!i?slider('firstPosition','First E / blade origin',0,1,.001,rule.positions[0],'Position along the initial axis: 0 at the base, 1 at the tip. Sets the first branching origin and influences stalk length.'):''}
    ${slider(`s${i}-cycles`,'E / C cycles',0,20,.5,rule.cycles,'Half a cycle ends at E. Zero skips this phase.')}
    ${slider(`s${i}-rotation`,'E rotation',0,180,.001,rule.rotation,'The source usually multiplies this angle by 1 − axis position.')}
    <details class="advanced"><summary>Vary saved E / C schedules</summary>
    <p class="stage-note">Scales of 1 retain the saved curves. Source limits still apply.</p>
    <div class="operation-pair">${['expansion','contraction'].map(operation=>`
      <fieldset class="operation-control"><legend>${operation==='expansion'?'E / Expansion':'C / Contraction'}</legend>
      ${operationFields.map(([key,label,min,max,increment],j)=>slider(`s${i}-${operation}-${key}`,label,operation==='expansion'||params.variant.contractionIntensityMin===0?0:min,max,increment,rule[operation][key],help[operation][j])).join('')}
      </fieldset>`).join('')}</div>
    ${slider(`s${i}-stemPosition`,'Stem C position',0,1,.01,rule.stemPosition)}
    ${slider(`s${i}-firstStemIntensity`,'First stem C strength',-1,1,.01,rule.firstStemIntensity)}
    ${slider(`s${i}-stemIntensity`,'Later stem C strength',-1,1,.01,rule.stemIntensity)}
    ${slider(`s${i}-minExpansionLength`,'E minimum edge length',0,5,.01,rule.minExpansionLength)}
    ${rule.minContractionLength===null?'':slider(`s${i}-minContractionLength`,'C minimum edge length',0,5,.01,rule.minContractionLength)}
    <details><summary>Original generation values</summary><table class="schedule-table"><thead><tr><th>Step</th><th>Position</th><th>Intensity</th></tr></thead><tbody>${rule.positions.map((v,g)=>`<tr><td>${g+1} / ${g%2?'C':'E'}</td><td>${v.toFixed(4)}</td><td>${rule.intensities[g]?.toFixed(4)??'—'}</td></tr>`).join('')}</tbody></table></details></details>
    </fieldset>`).join('');
  $('drawingControls').innerHTML=`<details><summary>Exact margin weights</summary><label class="check"><input id="rounding" type="checkbox" ${params.rounding?'checked':''}> Rounded blade boundary</label>`+slider('positiveWeight','Positive pole weight',0,20,.01,params.positiveWeight)+slider('negativeWeight','Negative pole weight',0,20,.01,params.negativeWeight)+'</details>';
  for(const key of ['veins','points','frontier'])$(key).checked=!!params[key];
}
function renderMacros() {
  const values=collections[mode].controls[presetIndex];
  $('macroControls').innerHTML=MACRO_FIELDS.map(([key,label,min,max,increment,title])=>slider(`macro-${key}`,label,min,max,increment,values[key],title)).join('');
}
function switchMode(next) {
  pause();
  for(const name of ['paper','lab','chart']){
    $(name+'Tab').setAttribute('aria-selected',String(name===next));$(name+'Tab').tabIndex=name===next?0:-1;
  }
  $('workspace').hidden=next==='chart';$('chartPanel').hidden=next!=='chart';
  if(next==='chart'){renderFigure();return;}
  pause();collections[mode].index=presetIndex;mode=next;studies=collections[mode].studies;
  $('paperTab').setAttribute('aria-selected',String(mode==='paper'));
  $('labTab').setAttribute('aria-selected',String(mode==='lab'));
  $('paperTab').tabIndex=mode==='paper'?0:-1;$('labTab').tabIndex=mode==='lab'?0:-1;
  $('workspace').setAttribute('aria-labelledby',mode==='paper'?'paperTab':'labTab');
  $('labTools').hidden=mode!=='lab';$('comparePaper').hidden=mode!=='paper';
  $('catalogTitle').textContent=mode==='paper'?'16 published studies':'Variation studies';
  $('catalogCaption').textContent=mode==='paper'?'Figure 7 / a–p':'Same rules / new forms';
  $('presets').innerHTML=studies.map(presetButton).join('');
  loadPreset(collections[mode].index);
}
function presetButton(preset, i) {
  const sample = generate(preset).steps;
  const thumbnail = sample.length ? svgFor(sample.at(-1), preset, frameFor(sample), `preset-${i}`) : '<span class="empty-thumb">No cycles</span>';
  return `<button class="preset" aria-label="${preset.name} starting form" aria-pressed="${i === presetIndex}" data-preset="${i}">${thumbnail}<span>${String.fromCharCode(97+i)} / ${preset.name}</span></button>`;
}
function loadPreset(index) {
  pause(); presetIndex = index; params = studies[index];
  $('candidateGrid').innerHTML='';candidates=[];
  if(mode==='lab')$('labBase').value=params.parent??'Magnolia';
  renderControls(); render(true);
  document.querySelectorAll('.preset').forEach((b,i) => b.setAttribute('aria-pressed', String(i === index)));
}
function pause() { clearInterval(timer); timer = null; $('play').textContent = 'Play sequence'; }
function select(index) {
  selected = Math.max(0, Math.min(index, steps.length-1));
  const step = steps[selected];
  $('preview').innerHTML = step ? svgFor(step, params, frame, 'preview-clip') : `<div class="empty-preview">${params.stages.some(s=>s.cycles)?'No surface formed. Use a non-zero initial E intensity or adjust the stopping rule.':'Set a stage to at least one cycle to begin expansion.'}</div>`;
  $('previewTitle').textContent = !step ? 'No operations' : selected === steps.length-1 ? 'Final form' : step.operation === 'E' ? 'Expansion' : 'Contraction';
  $('previewCode').textContent = step ? `${String(selected+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}` : '0 / 0';
  $('stepDirection').textContent = step ? `${STAGES[step.stage-1]} / ${step.operation} / schedule strength ${format('intensity',step.intensity)}` : '';
  $('frontierSummary').textContent=step?`${step.activeCount} continuing / ${step.dormantCount} resting boundary edges`:'';
  $('previous').disabled = !step || selected === 0;
  $('next').disabled = !step || selected === steps.length-1;
  $('play').disabled = steps.length < 2; $('last').disabled = !step;
  document.querySelectorAll('.exports button').forEach(b => b.disabled = !step);
  document.querySelectorAll('.step').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.index) === selected)));
}
function render(final = false) {
  const atEnd = selected === steps.length-1;
  const result = generate(params); steps = result.steps; frame = frameFor(steps);
  $('sequenceSummary').textContent = `${steps.length} operations / ${params.name}`;
  $('stopReason').textContent = result.stops.join(' ');
  const slug=params.name.toLowerCase().replaceAll(' ','-');
  $('paperComparison').innerHTML=mode==='lab'?'':`<div class="reference-pair"><figure><img src="references/${slug}-final.png" alt="Published ${params.name}, Figure 7" loading="lazy"><figcaption>Published / Figure 7</figcaption></figure><figure>${steps.length?svgFor(steps.at(-1),params,frame,'reference-current'):'No surface'}<figcaption>Saved definition / current settings</figcaption></figure></div><p>The saved definition and the publication may represent different revisions. Every saved E/C step is shown here; the paper sometimes omits intermediate steps.</p><div class="reference-series"><img src="references/${slug}-series.png" alt="Published E/C development series for ${params.name}" loading="lazy"></div><p>${params.reference} · Sabri Gokmen, <i>Metamorphic Leaves</i> (2020).</p>`;
  let html = '', lastStage = -1;
  steps.forEach((step,i) => {
    if (step.stage !== lastStage) {
      if (lastStage !== -1) html += '</div>';
      html += `<div class="stage-heading">0${step.stage} / ${STAGES[step.stage-1]}</div><div class="step-grid">`;
      lastStage = step.stage;
    }
    html += `<button class="step" data-index="${i}" aria-label="Step ${i+1}: ${step.operation === 'E' ? 'expansion' : 'contraction'}, stage ${step.stage}" aria-pressed="false">${svgFor(step,params,frame,`step-${i}`)}<div class="step-caption"><b>${String(i+1).padStart(2,'0')} / ${step.operation === 'E' ? 'Expansion' : 'Contraction'}</b><span>Cycle ${step.cycle}</span></div></button>`;
  });
  $('steps').innerHTML = steps.length ? html+'</div>' : '<p class="hint">No surface to plot. Check the cycle counts and initial E intensity.</p>';
  select(final || atEnd ? steps.length-1 : selected);
}
$('presets').innerHTML = studies.map(presetButton).join('');
$('presets').addEventListener('click', event => {
  const b = event.target.closest('[data-preset]'); if (b) loadPreset(Number(b.dataset.preset));
});
$('steps').addEventListener('click', event => {
  const b = event.target.closest('[data-index]'); if (b) { pause(); select(Number(b.dataset.index)); }
});
document.querySelector('aside').addEventListener('input', event => {
  const {id, value, checked} = event.target;
  if(id.startsWith('macro-')){
    const state=collections[mode];state.controls[presetIndex][id.slice(6)]=Number(value);
    params=studies[presetIndex]=varyRecipe(state.anchors[presetIndex],state.controls[presetIndex]);
  } else if (/^s[01]-/.test(id)) {
    const [stage,key,parameter] = id.split('-'), rule = params.stages[Number(stage[1])];
    if (parameter) rule[key][parameter] = Number(value); else rule[key] = Number(value);
  } else if(id==='trajectory'){params.trajectory=value;renderControls();}
  else if(id==='firstPosition')params.stages[0].positions[0]=Number(value);
  else if(['positiveWeight','negativeWeight'].includes(id))params[id]=Number(value);
  else if(['veins','points','frontier','rounding'].includes(id))params[id]=checked;
  else return;
  if(['veins','points','frontier'].includes(id))collections[mode].anchors[presetIndex][id]=checked;
  else if(!id.startsWith('macro-')){
    collections[mode].anchors[presetIndex]=structuredClone(params);
    collections[mode].controls[presetIndex]={...NEUTRAL};renderMacros();
  }
  if ($(id+'Value')) $(id+'Value').textContent = format(id,value);
  pause();
  if (!pending) {
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      if(id.startsWith('macro-'))renderControls(true);
      render();$('candidateGrid').innerHTML='';candidates=[];
      document.querySelector(`[data-preset="${presetIndex}"]`).outerHTML = presetButton(params,presetIndex);
    });
  }
});
$('reset').onclick = () => {
  const state=collections[mode];studies[presetIndex]=editable(state.source[presetIndex]);
  state.anchors[presetIndex]=structuredClone(studies[presetIndex]);state.controls[presetIndex]={...NEUTRAL};
  loadPreset(presetIndex);
  document.querySelector(`[data-preset="${presetIndex}"]`).outerHTML = presetButton(params,presetIndex);
};
$('previous').onclick = () => {pause(); select(selected-1);};
$('next').onclick = () => {pause(); select(selected+1);};
$('last').onclick = () => {pause(); select(steps.length-1);};
$('play').onclick = () => {
  if (timer) {pause(); return;}
  if (selected === steps.length-1) select(0);
  $('play').textContent = 'Pause';
  timer = setInterval(() => {select(selected+1); if (selected === steps.length-1) pause();},650);
};
function download(blob,name) {
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
}
async function raster(svg) {
  const url = URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  try {const image = new Image(); image.src = url; await image.decode(); return image;}
  finally {URL.revokeObjectURL(url);}
}
async function png(sheet) {
  if (!steps.length) return;
  pause(); const buttons = [...document.querySelectorAll('.exports button')]; buttons.forEach(b => b.disabled = true);
  $('exportStatus').textContent = 'Preparing PNG...';
  const chosen = sheet ? [...steps] : [steps[selected]], settings = structuredClone(params), exportFrame = {...frame}, number = selected+1;
  const cell = sheet ? 480 : 1800, caption = sheet ? 45 : 0, columns = sheet ? Math.min(6,chosen.length) : 1;
  try {
    const canvas = document.createElement('canvas'); canvas.width = columns*cell; canvas.height = Math.ceil(chosen.length/columns)*(cell+caption);
    const ctx = canvas.getContext('2d'); ctx.fillStyle = 'white'; ctx.fillRect(0,0,canvas.width,canvas.height);
    for (let i=0; i<chosen.length; i++) {
      const image = await raster(svgFor(chosen[i],settings,exportFrame,`export-${i}`));
      const x = i%columns*cell, y = Math.floor(i/columns)*(cell+caption); ctx.drawImage(image,x,y,cell,cell);
      if (sheet) {ctx.fillStyle = '#333'; ctx.font = '16px sans-serif'; ctx.fillText(`${String(i+1).padStart(2,'0')} / ${chosen[i].operation} / Stage ${chosen[i].stage} / Cycle ${chosen[i].cycle}`,x+20,y+cell+24);}
    }
    const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/png'));
    if (!blob) throw new Error('The image could not be encoded.');
    download(blob,`${settings.name.toLowerCase()}-${sheet ? 'steps' : `step-${number}`}.png`);
    $('exportStatus').textContent = 'PNG exported.';
  } catch (error) {$('exportStatus').textContent = `Export failed: ${error.message}`;}
  finally {buttons.forEach(b => b.disabled = !steps.length);}
}
$('exportPng').onclick = () => png(false); $('exportSheet').onclick = () => png(true);
$('exportSvg').onclick = () => {
  if (!steps.length) return;
  download(new Blob([svgFor(steps[selected],params,frame,'export')],{type:'image/svg+xml'}),`${params.name.toLowerCase()}-step-${selected+1}.svg`);
  $('exportStatus').textContent = 'SVG exported.';
};
let atlasData = [];
$('openAtlas').onclick = () => {
  pause(); atlasData = atlasRows(collections.paper.studies);
  $('atlasContent').innerHTML = atlasTable(atlasData);
  $('atlasStatus').textContent = '';
  $('atlas').showModal();
  sizeAtlas(Number($('atlasZoom').value));
};
$('closeAtlas').onclick = () => $('atlas').close();
function sizeAtlas(size) {
  $('atlasContent').style.setProperty('--atlas-cell',`${size}px`);
  $('atlasZoomValue').textContent = `${size}px`;
  $('atlasZoom').value = size;
  $('atlasContent').classList.toggle('compact-atlas',size<64);
}
$('atlasZoom').oninput = event => sizeAtlas(Number(event.target.value));
$('fitAtlas').onclick = () => {
  const columns=Math.max(0,...atlasData.map(row=>row.steps.length))+1;
  const label=$('atlasContent').querySelector('.row-name').getBoundingClientRect().width;
  sizeAtlas(Math.max(12,Math.floor(($('atlasContent').clientWidth-label)/columns)-2));
};
$('atlasContent').onclick = event => {
  const button = event.target.closest('[data-study]'); if (!button) return;
  $('atlas').close();if(mode!=='paper')switchMode('paper');loadPreset(Number(button.dataset.study));
  if (button.dataset.step !== undefined) select(Number(button.dataset.step));
};
$('exportAtlas').onclick = () => {
  download(new Blob([atlasSvg(atlasData)],{type:'image/svg+xml'}),'metamorphic-leaves-16-sequences.svg');
  $('atlasStatus').textContent = 'Atlas SVG exported.';
};
$('paperTab').onclick=()=>switchMode('paper');
$('labTab').onclick=()=>switchMode('lab');
$('chartTab').onclick=()=>switchMode('chart');
for(const tab of [$('paperTab'),$('labTab'),$('chartTab')])tab.onkeydown=event=>{
  if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
    event.preventDefault();const names=['paper','lab','chart'],i=names.indexOf(tab.id.replace('Tab',''));
    const next=event.key==='Home'?'paper':event.key==='End'?'chart':names[(i+(event.key==='ArrowRight'?1:2))%3];
    switchMode(next);$(next+'Tab').focus();
  }
};
$('labBase').innerHTML=PRESETS.map(p=>`<option>${p.name}</option>`).join('');
$('labBase').onchange=event=>{
  const source=PRESETS.find(p=>p.name===event.target.value),p=editable(source);
  p.parent=source.name;p.name=source.name+' variation';p.source='Derived from '+source.name;
  p.reference='Variation study';p.observation='Explore neighboring forms from this saved recipe.';
  p.recipe='The published study remains available in the first tab.';
  studies[presetIndex]=p;collections.lab.anchors[presetIndex]=structuredClone(p);collections.lab.controls[presetIndex]={...NEUTRAL};
  loadPreset(presetIndex);$('presets').innerHTML=studies.map(presetButton).join('');
};
$('exploreNeighbors').onclick=()=>{
  pause();candidates=neighboringVariations(params);
  const results=candidates.map(p=>generate(p)),sharedFrame=frameFor(results.flatMap(r=>r.steps));
  $('candidateGrid').innerHTML=candidates.map((p,i)=>{
    const result=results[i],last=result.steps.at(-1);
    return `<button class="candidate" data-candidate="${i}" ${!last||result.stops.length?'disabled':''}>${last?svgFor(last,p,sharedFrame,`candidate-${i}`):''}<b>${p.name}</b><small>${result.stops.length?'Growth limit reached':'Use this variation'}</small></button>`;
  }).join('');
};
$('candidateGrid').onclick=event=>{
  const button=event.target.closest('[data-candidate]');if(!button)return;
  const chosen=structuredClone(candidates[Number(button.dataset.candidate)]);
  chosen.name='Custom '+(chosen.parent??'leaf');studies[presetIndex]=chosen;
  collections.lab.anchors[presetIndex]=structuredClone(chosen);collections.lab.controls[presetIndex]={...NEUTRAL};
  loadPreset(presetIndex);$('presets').innerHTML=studies.map(presetButton).join('');
};
let currentFigure='';
function renderFigure() {
  const count=Number($('chartCount').value),rows=chartRows(collections.paper.studies,count);
  currentFigure=figureSvg(rows,count);$('chartFigure').innerHTML=currentFigure;
  const extended=rows.filter(r=>r.extended).length,skipped=rows.reduce((n,r)=>n+r.skipped,0),short=rows.filter(r=>r.shortfall).length;
  $('chartSummary').textContent=`${rows.length} leaves / ${count} frames per leaf / ${skipped} computed states omitted / ${extended} leaves developed further${short?` / ${short} rows reached a growth limit`:""}`;
  $('chartExportStatus').textContent='';
}
$('chartCount').onchange=renderFigure;
$('chartZoom').oninput=event=>{
  $('chartFigure').style.width=event.target.value+'%';$('chartZoomValue').textContent=event.target.value+'%';
};
$('chartExportSvg').onclick=()=>download(new Blob([currentFigure],{type:'image/svg+xml'}),'metamorphic-leaves-development-chart.svg');
$('chartExportPng').onclick=async()=>{
  $('chartExportPng').disabled=true;$('chartExportStatus').textContent='Preparing image…';
  try {
    const image=await raster(currentFigure),canvas=document.createElement('canvas');
    canvas.width=image.naturalWidth*2;canvas.height=image.naturalHeight*2;
    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    if(!blob)throw new Error('PNG encoding failed.');
    download(blob,'metamorphic-leaves-development-chart.png');$('chartExportStatus').textContent='PNG exported.';
  }catch(error){$('chartExportStatus').textContent=error.message;}
  finally{$('chartExportPng').disabled=false;}
};
loadPreset(0);
