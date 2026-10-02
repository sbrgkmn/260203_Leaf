import {simpleGeometrySvg} from './geometry-simple.mjs?v=ec-vertical-1';
import {bladeNodeStudySvg} from './blade-node-study.mjs?v=node-tags-1';
import {bladeConfigurationSvg,bladeDevelopmentSvg} from './blade-configuration-diagrams.mjs?v=pole-pairs-2';
import {BLADE_CONFIGURATIONS} from './blade-configurations.mjs?v=pole-pairs-2';
import {frameFor} from './leaf.mjs?v=pole-pairs-2';
import {geometrySvg,buttercupSequence,workedSvg,constructionSvg,continuationSvg,serialSvg,serialData,bradyReferenceSvg,serialInspectorSvg} from './diagrams.mjs?v=trajectory-balanced-1';

export const LEARNING_TABS=[['rules','E/C geometry'],['worked','Worked buttercup'],['blades','Blade surfaces'],['serial','Embryo × onto']];
const heading=(number,title,description)=>`<div class="lesson-heading"><span class="eyebrow">METHOD / ${number}</span><h2>${title}</h2><p>${description}</p></div>`;
const range=(id,title,min,max,step,value)=>`<label class="lesson-range" for="${id}"><span>${title} <output id="${id}Value">${value}</output></span><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
const exportButton=(id,label='Export diagram SVG')=>`<button data-diagram-export="${id}">${label}</button><span class="diagram-export-status" role="status" data-export-status="${id}"></span>`;
const plot=id=>`<div class="lesson-plot" id="${id}"></div>`;
const brady='https://www.natureinstitute.org/ronald-h-brady/form-and-cause-in-goethes-morphology';
const holdrege='https://www.natureinstitute.org/article/craig-holdrege/goethe-and-the-evolution-of-science';

export function mountLearning(){
  const $=id=>document.getElementById(id),figures=new Map();
  const put=(id,svg)=>{$(id).innerHTML=svg;figures.set(id,svg);};
  for(const [id,title] of LEARNING_TABS){
    document.querySelector('.studio-tabs').insertAdjacentHTML('beforeend',`<button id="${id}Tab" role="tab" tabindex="-1" aria-selected="false" aria-controls="${id}Panel">${title}</button>`);
    $('chartPanel').insertAdjacentHTML('afterend',`<section id="${id}Panel" class="lesson" role="tabpanel" aria-labelledby="${id}Tab" hidden></section>`);
  }
  $('rulesPanel').innerHTML=heading('01','The geometry of E and C.','Expansion introduces a shoot pole; contraction pulls edge points toward its inherited origin. Bold outlines show the rounded result, and light lines show neighboring possibilities.')+
    `<div class="lesson-controls">${range('rulePosition','Position p',.1,.9,.01,.35)}${range('ruleRotation','E rotation r (degrees)',10,120,1,100)}${range('ruleIntensity','E intensity i',.1,1,.01,.65)}${range('ruleContraction','C intensity i',-.35,1,.01,.65)}${exportButton('rulesFigure')}</div>`+plot('rulesFigure')+`<details class="lesson-details"><summary>Detailed parameter diagrams and equations</summary>${plot('rulesDetail')}`+
    `<div class="lesson-notes"><article><h3>Expansion adds a positive pole</h3><p>Place Q on the current vein axis. Rotate and scale the boundary vector A→B, then anchor it at Q. The usual angle is r × (1 − p), so position also changes orientation. Mirrored flanks use opposite rotation signs.</p></article><article><h3>Contraction adds a negative pole</h3><p>Locate Q on an edge and interpolate toward its inherited origin O. Positive strength moves toward O; negative strength moves away. C has no independent rotation parameter in this engine. The middle-right panel varies the inherited origin to explain this directional dependence.</p></article><article><h3>What continues?</h3><p>Polarity, radial/linear trajectory and edge length select continuing descendants. Resting edges do not receive a new E pole. A finished shoot edge enters its own blade phase locally; the entire silhouette is never globally inflated or shrunk.</p></article></div>
    <details class="lesson-details"><summary>Source variants and limits</summary><p>This diagram isolates the common edge-vector rule. Some saved definitions use an axis-aligned vector or tip-distance scaling; some use the full rotation for the first E. E position and intensity are clamped to 0–1. C bounds differ by definition. A negative endpoint uses its own stem position and first/later stem strength. The generation schedules, length thresholds and these variants remain available in the main editor. The signed C diagram illustrates the general formula; Buttercup itself clamps C to 0–1.</p></details>`+
    `</details><div class="lesson-controls">${range('ruleCutoff','Stop edges shorter than',0,5,.1,.7)}${exportButton('continuationFigure','Export trajectory comparison SVG')}</div>`+plot('continuationFigure');
  $('workedPanel').innerHTML=heading('02','Buttercup, operation by operation.','The saved Buttercup definition builds its shoots in six operations, then develops their blades in six more. These are the actual generated states, with construction lines replacing the filled rendering.')+
    `<div class="lesson-controls"><label class="check"><input type="checkbox" id="workedFilled"> Black filled surfaces</label><label class="check"><input type="checkbox" id="workedRounded" checked> Apply boundary rounding</label>${exportButton('workedFigure','Export twelve-step SVG')}</div>`+plot('workedFigure')+
    `<div class="worked-inspector"><div id="workedDetail"></div><div><span class="eyebrow">INSPECT AN OPERATION</span>${range('workedStep','Step',1,12,1,2)}<p id="workedReadout" aria-live="polite"></p><p class="hint">Filled dots mark new E poles; open dots mark new C poles. Dashed lines retain the previous boundary. Gray axes show the origins inherited by new shoots.</p><details class="lesson-details"><summary>Read the actual generation schedules</summary><div id="workedSchedule"></div></details></div></div>`;
  $('bladesPanel').innerHTML=heading('03','Curve controls after the second contraction.','Compare eight form studies using four quadratic CVs on a half-leaf, then mirror. Each blade flows into a natural tapered base; smooth joins use the midpoint between adjacent CVs.')+
    `<div class="lesson-controls"><label class="check"><input type="checkbox" id="bladeFilled" checked> Black filled surfaces</label>${exportButton('bladeFigure','Export eight studies SVG')}</div>`+plot('bladeFigure')+
    `<details class="lesson-details"><summary>Read the quadratic construction</summary><p>These eight surface studies are authored post-C2 finishes. Each uses four off-curve CVs on one half-leaf; its contour is mirrored to form the blade. At a smooth join, the endpoint is the midpoint of the neighboring CVs, so both quadratic tangents agree exactly. In 03 this removes the kink between CVs 3 and 4. Pointed apices and the sinus remain anchored. Thin gray lines connect the unsmoothed boundary anchors, matching the control polygon weight. Short dashed lines connect the surface-study C nodes to their shared contraction target on the axis. Gray lines show the separate quadratic CV polygon, and black shows the smoothed contour. These are authored surface-study targets, distinct from the recursive engine events.</p></details>`+
    `<details class="lesson-details"><summary>Earlier five-lobed leaf and E/C development</summary><p>The previous five-lobed application remains available below. Its C/E inflated-lobe finish uses joined cubic arcs; the elementary matrix above uses quadratic arcs only.</p>${exportButton('bladeFiveLobed','Export five-lobed comparison SVG')}${plot('bladeFiveLobed')}<div class="lesson-controls"><label for="bladeProfile">Follow a configuration <select id="bladeProfile">${BLADE_CONFIGURATIONS.map(c=>`<option value="${c.id}" ${c.id==='ce'?'selected':''}>${c.name} / ${c.description}</option>`).join('')}</select></label>${exportButton('bladeDevelopment','Export four-step construction SVG')}</div>${plot('bladeDevelopment')}</details>`;
  $('serialPanel').innerHTML=heading('04','A symmetric sequence of leaf structures.','Twelve forms pass from full blades through branching and division to simpler terminal shoots. Each column develops through twelve E/C operations. Brady informs the progression of complexity; specimen asymmetry is not reproduced.')+
    `<div class="lesson-controls"><label for="serialCount">Forms across <select id="serialCount"><option value="8">8 forms</option><option value="9">9 structural anchors</option><option value="12" selected>12 forms</option></select></label>${range('serialArticulation','Division strength',.85,1.05,.05,1)}${range('serialSpread','Shoot rotation offset',-6,6,1,0)}<label class="check"><input type="checkbox" id="serialSize"> Serial size progression</label>${exportButton('serialFigure','Export full matrix SVG')}</div>`+
    `<label for="serialScale" class="serial-scale">Matrix size <select id="serialScale"><option value="fit">Fit all columns</option><option value="100">Full size / scroll</option><option value="150">Enlarged / scroll</option></select></label>`+plot('serialFigure')+
    `<details class="lesson-details"><summary>Brady source series and interpretation</summary><p>The <i>Ranunculus acris</i> specimens suggest full, differentiated, divided and reduced forms. We interpret these changes through symmetric E/C rules rather than fitting photographed outlines. "Embryogenesis" here means algorithmic construction, not observed embryo development. <a href="${brady}" target="_blank" rel="noopener">Brady / Figure 4</a> &middot; <a href="${holdrege}" target="_blank" rel="noopener">Holdrege / serial forms</a></p>${plot('serialReferences')}</details>`+
    `<details class="lesson-details"><summary>Explore the structural transitions</summary>${range('serialPosition','Position along the structural series',1,9,.01,1)}${plot('serialInspector')}<p>Nine authored anchors share the recovered Buttercup schedules and three shoot plus three blade cycles. Expansion, contraction, branch eligibility and rounding vary continuously between anchors; discrete thresholds determine which branches continue or rest. Left and right stay identical, including after control changes. Dormant operations may repeat. The optional size progression follows the source drawing heights, not measured plant dimensions.</p><div id="serialSchedule"></div></details>`;

  const val=id=>Number($(id).value);
  const renderRules=()=>{put('rulesFigure',simpleGeometrySvg({position:val('rulePosition'),rotation:val('ruleRotation'),intensity:val('ruleIntensity'),contraction:val('ruleContraction')}));put('rulesDetail',geometrySvg({position:val('rulePosition'),rotation:val('ruleRotation'),intensity:val('ruleIntensity'),contraction:val('ruleContraction')}));put('continuationFigure',continuationSvg(val('ruleCutoff')));};
  const buttercup=buttercupSequence(),fixedFrame=frameFor(buttercup.steps);
  const workedOptions=()=>({filled:$('workedFilled').checked,rounding:$('workedRounded').checked});
  const inspect=()=>{
    const i=val('workedStep')-1,s=buttercup.steps[i],previous=buttercup.steps[i-1],ids=new Set(previous?.points.map(p=>p.id)??['apex','base-left','base-right']);
    const added=s.points.filter(p=>!ids.has(p.id));
    $('workedDetail').innerHTML=constructionSvg(s,previous,fixedFrame,workedOptions(),'worked-inspector');
    $('workedReadout').textContent=`${String(i+1).padStart(2,'0')} / ${s.operation==='E'?'Expansion':'Contraction'} / ${s.stage===1?'Shoots':'Blades'}. ${added.length} new poles; ${s.activeCount} continuing and ${s.dormantCount} resting terminal edges. ${s.operation==='E'?'New positive poles extend rotated shoots from their inherited axes.':'New negative poles divide the flanks and move toward their inherited origins.'}`;
  };
  const renderWorked=()=>{put('workedFigure',workedSvg(workedOptions()));inspect();};
  $('workedSchedule').innerHTML='<table class="schedule-table"><thead><tr><th>Step</th><th>Phase</th><th>p</th><th>i</th><th>r°</th></tr></thead><tbody>'+buttercup.steps.map((s,i)=>{
    const rule=buttercup.params.stages[s.stage-1],g=i%6;
    return `<tr><td>${i+1} / ${s.operation}</td><td>${s.stage===1?'Shoots':'Blades'}</td><td>${rule.positions[g].toFixed(3)}</td><td>${rule.intensities[g].toFixed(3)}</td><td>${s.operation==='E'?rule.rotation.toFixed(2):'inherited'}</td></tr>`;
  }).join('')+'</tbody></table>';
  const renderBlades=()=>{
    const options={filled:$('bladeFilled').checked,profile:$('bladeProfile').value};
    put('bladeFigure',bladeNodeStudySvg(options));put('bladeFiveLobed',bladeConfigurationSvg(options));put('bladeDevelopment',bladeDevelopmentSvg(options));
  };
  const serialOptions=()=>({count:val('serialCount'),articulation:val('serialArticulation'),spread:val('serialSpread'),relativeSize:$('serialSize').checked});
  const scaleSerial=()=>{
    const svg=$('serialFigure').querySelector('svg'),scale=$('serialScale').value;
    svg.style.width=scale==='fit'?'100%':`${Number(svg.getAttribute('width'))*Number(scale)/100}px`;
  };
  const inspectSerial=()=>put('serialInspector',serialInspectorSvg(val('serialPosition')-1,serialOptions()));
  const renderSerial=()=>{
    const options=serialOptions();
    put('serialReferences',bradyReferenceSvg(options));put('serialFigure',serialSvg(options));scaleSerial();inspectSerial();
    $('serialSchedule').innerHTML='<table class="schedule-table"><thead><tr><th>Form</th><th>Structure interval</th><th>First E p</th><th>Shoot E x</th><th>Shoot C x</th><th>Blade E x</th><th>Blade C x</th></tr></thead><tbody>'+serialData(options).map(({params:p,lower,upper,blend},i)=>`<tr><td>${i+1}</td><td>${blend<1e-9?lower:lower+' to '+upper+' / '+Math.round(blend*100)+'%'}</td><td>${p.stages[0].positions[0].toFixed(2)}</td>${p.stages.flatMap(s=>[s.expansion.intensity,s.contraction.intensity]).map(v=>`<td>${v.toFixed(2)}</td>`).join('')}</tr>`).join('')+'</tbody></table>';
  };
  const renderers={rules:renderRules,worked:renderWorked,blades:renderBlades,serial:renderSerial};
  const rendered=new Set();
  for(const [id] of LEARNING_TABS){
    let pending=false;
    $(id+'Panel').addEventListener('input',event=>{
      const output=$(event.target.id+'Value');if(output)output.textContent=event.target.value;
      if(pending)return;pending=true;
      requestAnimationFrame(()=>{pending=false;if(event.target.id==='workedStep')inspect();else if(event.target.id==='serialPosition')inspectSerial();else if(event.target.id==='serialScale')scaleSerial();else renderers[id]();});
    });
    $(id+'Panel').addEventListener('click',event=>{
      const button=event.target.closest('[data-diagram-export]');if(!button)return;
      const key=button.dataset.diagramExport,svg=figures.get(key),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),a=document.createElement('a');
      a.href=url;a.download=`metamorphic-leaves-${key}.svg`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      $(id+'Panel').querySelector(`[data-export-status="${key}"]`).textContent='SVG download requested.';
    });
  }
  return id=>{if(!rendered.has(id)){renderers[id]();rendered.add(id);}};
}
