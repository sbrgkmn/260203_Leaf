import {ontologyClockSvg} from './ontology-clock.mjs';
import {developmentClockSvg} from './development-clock.mjs?v=6';
import {bradyMatrixSvg,bradyGeneratedMatrixSvg} from './brady-matrix.mjs?v=10';
import {developmentMatrixSvg} from './development-matrix.mjs?v=2';
import {ontologySvg} from './ontology.mjs?v=trace-1';
import {simpleGeometrySvg} from './geometry-simple.mjs?v=ec-simple-2';
import {geometrySvg,continuationSvg,workedSvg,redOakSilhouettesSvg,serialSvg,bradyReferenceSvg} from './diagrams.mjs?v=red-oak-2';
import {bladeNodeStudySvg} from './blade-node-study.mjs?v=node-tags-1';
import {bladeConfigurationSvg,bladeDevelopmentSvg} from './blade-configuration-diagrams.mjs?v=pole-pairs-2';
import {atlasRows,atlasSvg} from './atlas.mjs';
import {chartRows,figureSvg} from './figure-chart.mjs';
import {PRESETS,studyParams} from './presets.mjs';
import {VARIATIONS} from './variations.mjs';
const entries=[
 ['ontology-clock','Ontology / formative activities',()=>ontologyClockSvg()],
 ['development-clock','Ontology / developmental clock',()=>developmentClockSvg()],
 ['brady-generated','Brady / generated sequences only',()=>bradyGeneratedMatrixSvg()],
 ['brady-matrix','Brady / 12-form developmental series',()=>bradyMatrixSvg()],
 ['ec','E/C geometry',()=>simpleGeometrySvg()],
 ['trajectories','Radial / linear trajectories',()=>continuationSvg(.7,{expansionFirst:true})],
 ['blades','Eight blade surfaces',()=>bladeNodeStudySvg()],
 ['buttercup','Worked Buttercup',()=>workedSvg({filled:false,rounding:true})],
 ['buttercup-filled','Buttercup silhouettes',()=>workedSvg({filled:true,rounding:true})],
 ['red-oak-filled','Red oak silhouettes',()=>redOakSilhouettesSvg()],
 ['published','16 published sequences',()=>atlasSvg(atlasRows(PRESETS.map(studyParams)))],
 ['lab','Variation lab sequences',()=>atlasSvg(atlasRows(VARIATIONS.map(studyParams)))],
 ['chart','Development chart',()=>figureSvg(chartRows(PRESETS.map(studyParams),12),12)],
];
const $=id=>document.getElementById(id),cache=new Map();
$('figure').innerHTML=entries.map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
const requested=new URLSearchParams(location.search).get('figure');if(entries.some(e=>e[0]===requested))$('figure').value=requested;
function render(){
 const [id,name,create]=entries.find(e=>e[0]===$('figure').value);$('status').textContent='';
 if(!cache.has(id))cache.set(id,create());
 const doc=new DOMParser().parseFromString(cache.get(id),'image/svg+xml');
 if(doc.querySelector('parsererror'))throw Error('Could not render this figure.');
 const svg=doc.documentElement;
 for(const node of svg.querySelectorAll('text')){
  if(id==='ontology-clock'||id==='development-clock'||id==='ontology'||id==='development-matrix'||id==='brady-matrix'||id==='brady-generated'){
   if(!$('labels').checked&&/^\d{2}$/.test(node.textContent.trim()))node.remove();
   continue;
  }
  if(id==='chart'&&node.parentElement.classList.contains('figure-row')){
   node.textContent=node.parentElement.getAttribute('data-leaf');
   node.setAttribute('font-weight','400');
   continue;
  }
  const value=node.textContent.trim();
  if(!$('labels').checked||!/^([0-9]{1,2}|E|C)$/.test(value))node.remove();
 }
 for(const node of svg.querySelectorAll('[data-clean-only]'))node.removeAttribute('display');
 const font='Garamond, "EB Garamond", "Palatino Linotype", "Book Antiqua", serif';
 for(const node of [svg,...svg.querySelectorAll('[font-family],text')]){
  node.setAttribute('font-family',font);if(node.style)node.style.fontFamily=font;
 }
 // Measure every drawing row, not just the first direct group.
 const rootGroup=doc.createElementNS('http://www.w3.org/2000/svg','g');
 for(const child of [...svg.children]){
  const tag=child.tagName.toLowerCase();
  const background=tag==='rect'&&child.getAttribute('fill')==='white';
  if(!background&&!['defs','title','desc'].includes(tag))rootGroup.append(child);
 }
 svg.append(rootGroup);
 const caption=(x,y,label)=>{const t=doc.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('text-anchor','middle');t.setAttribute('font-size','22');t.setAttribute('font-family',font);t.textContent=label;rootGroup.append(t);};
 if(id==='ec'){caption(275,395,'expansion');caption(825,395,'contraction');}
 if(id==='trajectories'){caption(305,555,'expansion');caption(855,555,'contraction');}
 svg.setAttribute('aria-label',name);$('drawing').replaceChildren(document.importNode(svg,true));
 // Trim outer caption space while retaining the native drawing geometry.
 const live=$('drawing').firstElementChild,group=[...live.children].find(n=>n.tagName.toLowerCase()==='g');
 if(group){const b=group.getBBox();if(b.width&&b.height){const pad=18;live.setAttribute('viewBox',`${b.x-pad} ${b.y-pad} ${b.width+pad*2} ${b.height+pad*2}`);live.setAttribute('width',b.width+pad*2);live.setAttribute('height',b.height+pad*2);}}
 history.replaceState(null,'',`?figure=${id}`);
}
$('figure').onchange=render;$('labels').onchange=render;
$('export').onclick=()=>{const svg=$('drawing').firstElementChild,url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download=`metamorphic-${$('figure').value}-clean.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent='SVG exported.';};
$('print').onclick=()=>window.print();render();
