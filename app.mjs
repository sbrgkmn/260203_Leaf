import { PRESETS, generate, frameFor, svgFor } from './leaf.mjs';
import { atlasRows, atlasTable, atlasSvg } from './atlas.mjs';
import { STAGES } from './growth.mjs';
const $ = id => document.getElementById(id);
const studies = PRESETS.map(p => ({ ...structuredClone(p), veins: true, points: false }));
let presetIndex = 0, params, steps = [], frame, selected = 0, timer = null, pending = false;
const operationFields = [
  ['position', 'Position', .02, .98, .01],
  ['intensity', 'Intensity', -1.5, 1.5, .01],
  ['rotation', 'Rotation', -80, 85, 1],
];
const help = {
  expansion: ['Place a point along the current edge.', 'Signed displacement from the boundary: positive pushes out, negative pulls in. Zero leaves the edge unchanged.', 'Rotate the displacement relative to the outward edge normal.'],
  contraction: ['Place a point along each edge, toward the E point.', 'Signed displacement: positive pulls toward the center; negative pushes away and can keep adding surface.', 'Rotate the displacement to or away from the center.'],
};
function format(id, value) {
  if (/cycles|shoots|secondaryPairs/.test(id)) return String(value);
  if (/rotation|Rotation|spread/.test(id)) return `${value} deg`;
  if (id.includes('intensity')) return `${Number(value)>0?'+':''}${Number(value).toFixed(2)}`;
  return Number(value).toFixed(id.includes('minLength') ? 3 : 2);
}
function slider(id, label, min, max, increment, value, title = '') {
  return `<label class="slider" for="${id}" title="${title}"><span class="slider-heading"><span>${label}</span><output for="${id}" id="${id}Value">${format(id,value)}</output></span><input id="${id}" type="range" min="${min}" max="${max}" step="${increment}" value="${value}"></label>`;
}
function renderControls() {
  $('trajectory').value = params.trajectory;
  $('paperReference').textContent = params.reference + ' / inferred rule';
  $('paperObservation').textContent = params.observation;
  $('paperRecipe').textContent = params.recipe;
  const g=params.growth;
  $('family').value=g.family==='compound'?'compound':'joined';
  $('growthControls').innerHTML = `
    ${slider('g-shoots',params.trajectory==='base'?'Rays per side':'Shoot pairs',1,18,1,g.shoots)}
    ${slider('g-width',params.trajectory==='base'?'Ray length':'Lateral reach',.08,1.3,.01,g.width)}
    ${slider('g-spread',params.trajectory==='base'?'Fan spread':'Branch angle',0,165,1,g.spread)}
    <details class="advanced" open><summary>Base → middle → tip profile</summary><p class="stage-note">Relative shoot length along the framework. Position and rotation can vary along it too.</p><div id="profilePlot"></div>
    ${['Base','Middle','Tip'].map((name,i)=>slider(`g-profile-${i}`,`${name} length`,.05,1.5,.01,g.profile[i])).join('')}
    ${slider('g-spacing','Spacing bias',.4,2.5,.05,g.spacing,'1 is evenly spaced; higher values cluster attachments toward the base.')}
    ${slider('g-tipRotation','Rotation change toward tip',-35,35,1,g.tipRotation)}
    </details>
    <details class="advanced"><summary>Attachment and hierarchy</summary>
    ${slider('g-start','First attachment / stem',.05,.7,.01,g.start)}
    ${params.trajectory==='base'?slider('g-terminalScale','Central ray length',.3,1.3,.01,g.terminalScale):slider('g-end','Last attachment',.35,.9,.01,g.end)}
    ${g.family==='compound'?slider('g-leafletWidth','Initial leaflet width',.02,.35,.01,g.leafletWidth)+slider('g-secondaryPairs','Secondary pairs per shoot',0,7,1,g.secondaryPairs):''}
    </details>`;
  renderProfile();
  $('stageControls').innerHTML = params.stages.map((rule, i) => `
    <fieldset class="stage-control"><legend>0${i+1} / ${STAGES[i]}</legend>
    <p class="stage-note">${['Set the primary framework. C controls separation between shoots.','Broaden local blades while primary tips and attachment points stay fixed.','Add smaller lobes or teeth along existing margins.'][i]}</p>
    ${slider(`s${i}-cycles`, 'E / C cycles', 0, 20, 1, rule.cycles, 'Zero skips this stage.')}
    <div class="operation-pair">${['expansion','contraction'].map(operation => `
      <fieldset class="operation-control"><legend>${operation === 'expansion' ? 'E / Expansion' : 'C / Contraction'}</legend>
      <p class="phase-key">${operation==='expansion'?(i?'Negative: inward / Positive: outward':'Reach / opposite signs seed mirrored shoots'):'Negative: outward / Positive: inward'}</p>
      ${operationFields.map(([key,label,min,max,increment],j) => slider(`s${i}-${operation}-${key}`, label,
        min, max,
        increment, rule[operation][key], !i&&operation==='expansion'?['Shift shoot placement.','Set structural shoot reach; opposite signs establish mirrored shoots. Later stages apply signed boundary displacement.','Rotate the primary shoots.'][j]:help[operation][j])).join('')}</fieldset>`).join('')}</div>
    ${i?`<details class="advanced"><summary>Cycle schedule and affected region</summary>
    ${slider(`s${i}-decay`,'Intensity retained each cycle',.1,1, .05,rule.decay,'0.5 halves the displacement each successive cycle.')}
    <label class="select-label" for="s${i}-target">Affected region</label><select id="s${i}-target">${[['all','All blade margins'],['upper','Upper shoots'],['lower','Lower shoots'],['tips','Near shoot tips']].map(([v,label])=>`<option value="${v}" ${v===rule.target?'selected':''}>${label}</option>`).join('')}</select>
    ${['Base','Middle','Tip'].map((name,j)=>slider(`s${i}-profile-${j}`,`${name} intensity multiplier`,0,1.5,.05,rule.profile[j])).join('')}
    ${slider(`s${i}-minLength`, 'Minimum detail length', .005, .3, .001, rule.minLength)}</details>`:''}
    </fieldset>`).join('');
  $('drawingControls').innerHTML = slider('smoothing', 'Boundary smoothing', 0, 1, .01, params.smoothing);
  $('veins').checked = params.veins; $('points').checked = params.points;
}
function renderProfile() {
  const p=params.growth.profile;
  $('profilePlot').innerHTML=`<svg viewBox="0 0 260 68" role="img" aria-label="Shoot length profile from base to tip"><path d="M 10 54 H 250" stroke="#ddd"/><path d="M 10 ${54-p[0]*30} L 130 ${54-p[1]*30} L 250 ${54-p[2]*30}" fill="none" stroke="#586b43" stroke-width="2"/>${p.map((v,i)=>`<circle cx="${10+i*120}" cy="${54-v*30}" r="3" fill="#586b43"/>`).join('')}<text x="10" y="66">Base</text><text x="115" y="66">Middle</text><text x="233" y="66">Tip</text></svg>`;
}
function presetButton(preset, i) {
  const sample = generate(preset).steps;
  const thumbnail = sample.length ? svgFor(sample.at(-1), preset, frameFor(sample), `preset-${i}`) : '<span class="empty-thumb">No cycles</span>';
  return `<button class="preset" aria-label="${preset.name} starting form" aria-pressed="${i === presetIndex}" data-preset="${i}">${thumbnail}<span>${String.fromCharCode(97+i)} / ${preset.name}</span></button>`;
}
function loadPreset(index) {
  pause(); presetIndex = index; params = studies[index];
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
  const direction=step && (step.operation==='E' ? (step.stage===1?'establish shoots':step.intensity<0?'inward':'outward') : (step.intensity<0?'away from center':'toward center'));
  $('stepDirection').textContent = step ? `${step.operation} ${format('intensity',step.intensity)} / ${step.intensity===0?'neutral displacement':direction}` : '';
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
  $('paperComparison').innerHTML=`<div class="reference-pair"><figure><img src="references/${slug}-final.png" alt="Published ${params.name}, Figure 7" loading="lazy"><figcaption>Published / Figure 7</figcaption></figure><figure>${steps.length?svgFor(steps.at(-1),params,frame,'reference-current'):'No surface'}<figcaption>Current reconstruction</figcaption></figure></div><p>The published series below may skip operations. Compare branching and stage changes; its columns do not correspond one-to-one with ours.</p><div class="reference-series"><img src="references/${slug}-series.png" alt="Published E/C development series for ${params.name}" loading="lazy"></div><p>${params.reference} · Sabri Gokmen, <i>Metamorphic Leaves</i> (2020).</p>`;
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
  if (/^s[012]-/.test(id)) {
    const [stage,key,parameter] = id.split('-'), rule = params.stages[Number(stage[1])];
    if (parameter) rule[key][parameter] = Number(value); else rule[key] = key==='target'?value:Number(value);
  } else if(id.startsWith('g-')) {
    const [,key,index]=id.split('-');
    if(index!==undefined)params.growth[key][Number(index)]=Number(value);else params.growth[key]=Number(value);
    if(key==='start'&&params.growth.start>=params.growth.end)params.growth.end=Math.min(.9,params.growth.start+.05);
    if(key==='end'&&params.growth.end<=params.growth.start)params.growth.start=Math.max(.05,params.growth.end-.05);
    if(key==='start'||key==='end')for(const other of ['start','end'])if($(`g-${other}`)){$(`g-${other}`).value=params.growth[other];$(`g-${other}Value`).textContent=format(other,params.growth[other]);}
    if(key==='profile')renderProfile();
  } else if (id === 'trajectory') {params.trajectory = value;renderControls();}
  else if (id === 'family') {params.growth.family=value;renderControls();}
  else if (id === 'smoothing') params.smoothing = Number(value);
  else if (id === 'veins' || id === 'points') params[id] = checked;
  else return;
  if ($(id+'Value')) $(id+'Value').textContent = format(id,value);
  pause();
  if (!pending) {
    pending = true;
    requestAnimationFrame(() => {
      pending = false; render();
      document.querySelector(`[data-preset="${presetIndex}"]`).outerHTML = presetButton(params,presetIndex);
    });
  }
});
$('reset').onclick = () => {
  studies[presetIndex] = {...structuredClone(PRESETS[presetIndex]), veins:true, points:false};
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
  pause(); atlasData = atlasRows(studies);
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
  sizeAtlas(Math.max(16,Math.floor(($('atlasContent').clientWidth-label)/columns)-2));
};
$('atlasContent').onclick = event => {
  const button = event.target.closest('[data-study]'); if (!button) return;
  $('atlas').close(); loadPreset(Number(button.dataset.study));
  if (button.dataset.step !== undefined) select(Number(button.dataset.step));
};
$('exportAtlas').onclick = () => {
  download(new Blob([atlasSvg(atlasData)],{type:'image/svg+xml'}),'metamorphic-leaves-16-sequences.svg');
  $('atlasStatus').textContent = 'Atlas SVG exported.';
};
loadPreset(0);
