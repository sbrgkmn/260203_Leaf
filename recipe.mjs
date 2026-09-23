// Compact recipes keep exceptions; expansion restores the original editable schema.
export const RECIPE_DEFAULTS={seedHalfWidth:.1,bladeContinue:false,roundPosition:.5,leftRightPosition:.5,leftRightIntensity:.5};
const variantDefaults={firstRotationFull:false,vectorMode:'edge',contractionLRIntensity:true,connectOrigins:true,veinFollowsRounding:false,veinAtControlPoint:false};
export function compactRecipe(input,activeDepths) {
  const p=structuredClone(input);
  for(const [k,v] of Object.entries(RECIPE_DEFAULTS))if(p[k]===v)delete p[k];
  p.stages.forEach((s,i)=>{
    for(const op of ['expansion','contraction'])if(s[op].position===1&&s[op].intensity===1)delete s[op];
    if(s.firstStemIntensity===s.stemIntensity)delete s.firstStemIntensity;
    const depth=activeDepths?.[i]??s.cycles*2;
    const continuation={};
    for(const key of ['positions','intensities'])if(s[key].length>depth){continuation[key]=s[key].slice(depth);s[key]=s[key].slice(0,depth);}
    if(Object.keys(continuation).length)s.continuation=continuation;
  });
  const v=p.variant;
  if(v.contractionPositionMin===v.contractionIntensityMin){v.contractionMinimum=v.contractionPositionMin;delete v.contractionPositionMin;delete v.contractionIntensityMin;}
  for(const [k,value] of Object.entries(variantDefaults))if(v[k]===value)delete v[k];
  delete p.sourceFrames;
  return p;
}
export function expandRecipe(input) {
  const p={...RECIPE_DEFAULTS,...structuredClone(input)};
  p.variant={...variantDefaults,...p.variant};
  if(Object.hasOwn(p.variant,'contractionMinimum')){
    p.variant.contractionPositionMin=p.variant.contractionMinimum;
    p.variant.contractionIntensityMin=p.variant.contractionMinimum;delete p.variant.contractionMinimum;
  }
  p.stages.forEach(s=>{
    for(const op of ['expansion','contraction'])s[op]={position:1,intensity:1,...s[op]};
    s.firstStemIntensity??=s.stemIntensity;
    for(const key of ['positions','intensities'])s[key]=s[key].concat(s.continuation?.[key]??[]);
    delete s.continuation;
  });
  p.sourceFrames=[];
  for(let phase=0;phase<2;phase++)for(let depth=1;depth<=p.stages[phase].cycles*2;depth++)p.sourceFrames.push(phase?[p.stages[0].cycles*2,depth]:[depth,0]);
  return p;
}
