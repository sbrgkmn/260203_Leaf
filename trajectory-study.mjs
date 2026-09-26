import {PRESETS,studyParams} from './presets.mjs?v=studio-1';
import {generate} from './leaf.mjs?v=pole-pairs-2';

// A controlled teaching recipe, independent of the sixteen saved studies.
// Axis-aligned E vectors keep the linear tiers parallel. Their lengths taper
// with the remaining axis: constant position 1/4 gives a ratio of 3/4.
function proportionalRecipe(){
  const p=studyParams(PRESETS.find(p=>p.name==='Buttercup'));
  p.name='Proportional shoot trajectories';p.trajectory='tip';p.seedHalfWidth=0;
  p.variant.vectorMode='axis';p.stages[1].cycles=0;
  const s=p.stages[0];s.cycles=3;s.rotation=60;s.minExpansionLength=0;
  s.positions=[.25,.5,.25,.5,.25,.5];s.intensities=[.55,.85,.55,.85,.55,.85];
  s.firstStemIntensity=.85;s.stemIntensity=.85;
  // C alters the next edge length. Compensate in the E schedule, never by
  // scaling rendered branches. Both trajectories then use this same schedule.
  for(let tier=1;tier<3;tier++){
    const step=generate(p).steps[tier*2];
    const branch=step.points.find(q=>q.id.startsWith('L')&&q.g===tier*2&&q.polarity>0);
    const length=Math.hypot(branch.x-branch.origin.x,branch.y-branch.origin.y);
    s.intensities[tier*2]*=5.5*.75**tier/length;
  }
  return p;
}
const template=proportionalRecipe();
export function trajectoryStudies(cutoff=.7){
  return ['base','tip'].map(trajectory=>{
    const params=structuredClone(template);params.trajectory=trajectory;
    params.stages[0].minExpansionLength=cutoff;
    return {params,...generate(params)};
  });
}
