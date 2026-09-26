import {PRESETS,studyParams} from './presets.mjs?v=studio-1';

// Authored structural anchors: shared, symmetric Buttercup rules throughout.
// Columns: shoot E, shoot C, shoot cutoff, blade E, blade C, blade cutoff, w+, w-.
const controls=[
  [.68,.58,7.8,.55,.7,8,.55,.7],
  [.83,.7,4.6,.6,.8,4,1,1.1],
  [.97,.9,2,.58,.9,2.6,1.8,2],
  [1,1,.738,.55,.9,1.8,2.6,3.2],
  [.92,1.02,1.3,.5,.9,2.2,3.2,4],
  [.82,1.03,2.6,.5,.9,2.8,4,5],
  [.7,1.04,4.4,.45,.9,4.5,4,7],
  [.58,1.025,7.6,.3,1.1,8,4,8],
  [.45,1.01,9.5,.2,1.1,10,3,6],
];
export const STRUCTURAL_ANCHORS=controls.map((v,index)=>{
  const p=studyParams(PRESETS.find(p=>p.name==='Buttercup')),[a,b]=p.stages;
  p.name=`Symmetric Buttercup ${index+1}`;p.leftRightPosition=.5;p.leftRightIntensity=.5;
  [a.expansion.intensity,a.contraction.intensity,a.minExpansionLength,b.expansion.intensity,b.contraction.intensity,b.minExpansionLength,p.positiveWeight,p.negativeWeight]=v;
  b.firstStemIntensity=0;b.stemIntensity=0;
  p.rounding=true;
  return p;
});
