import {BRADY_REFERENCE} from './data/brady-reference.mjs';
import {STRUCTURAL_ANCHORS} from './serial-structures.mjs?v=structures-5';
import {generate} from './leaf.mjs?v=pole-pairs-2';
export {BRADY_REFERENCE,STRUCTURAL_ANCHORS};

// Interpolate numeric E/C recipes, never the rendered shapes or operation frames.
// Shared discrete rules and cycle counts remain those of the saved Buttercup.
function mix(a,b,t){
  if(typeof a==='number'&&typeof b==='number')return a+(b-a)*t;
  if(Array.isArray(a))return a.map((v,i)=>mix(v,b[i],t));
  if(a&&typeof a==='object')return Object.fromEntries(Object.entries(a).map(([k,v])=>[k,mix(v,b[k],t)]));
  return a;
}
export function bradyRecipe(position,{articulation=1,spread=0}={}){
  const at=Math.max(0,Math.min(8,position)),lo=Math.floor(at),hi=Math.min(8,lo+1),t=at-lo;
  const params=mix(STRUCTURAL_ANCHORS[lo],STRUCTURAL_ANCHORS[hi],t);
  params.leftRightPosition=.5;params.leftRightIntensity=.5;
  params.name='Brady-inspired Buttercup';params.stages[0].rotation+=spread;
  params.stages.forEach(s=>s.contraction.intensity*=articulation);
  const a=BRADY_REFERENCE.forms[lo],b=BRADY_REFERENCE.forms[hi];
  return {params,t:at/8,position:at,lower:lo+1,upper:hi+1,blend:t,
    relativeSize:a.relativeSize+(b.relativeSize-a.relativeSize)*t};
}
export function serialRecipes({count=12,...options}={}){
  if(![8,9,12].includes(count))throw new RangeError('Choose 8, 9 or 12 serial forms.');
  return Array.from({length:count},(_,i)=>bradyRecipe(i*8/(count-1),options));
}
export function serialData(options={}){return serialRecipes(options).map(r=>({...r,...generate(r.params)}));}
