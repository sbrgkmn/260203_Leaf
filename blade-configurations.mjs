import {PRESETS,studyParams} from './presets.mjs?v=studio-1';
import {generate} from './leaf.mjs?v=pole-pairs-2';

export const BLADE_CONFIGURATIONS=[
  {id:'cc',name:'C / C',upper:'rounded',lower:'rounded',description:'Rounded tips / rounded nodes'},
  {id:'ec',name:'E / C',upper:'pointed',lower:'rounded',description:'Sharp tips / rounded nodes'},
  {id:'ce',name:'C / E',upper:'rounded',lower:'pointed',description:'Rounded lobes / sharp anchors'},
  {id:'ee',name:'E / E',upper:'pointed',lower:'pointed',description:'Sharp tips / sharp nodes'},
];
export function simpleButtercupRecipe(apices='ec'){
  const configuration=BLADE_CONFIGURATIONS.find(c=>c.id===apices);
  // Preserve existing lab recipes independently of the lesson's four combinations.
  if(!configuration&&!['rounded','all','terminal','lateral'].includes(apices))throw new RangeError('Unknown blade configuration.');
  const p=studyParams(PRESETS.find(p=>p.name==='Buttercup'));
  p.name='Simple Buttercup';p.stages[0].cycles=2;p.stages[1].cycles=0;
  p.stages[0].positions[0]=.22;p.stages[0].expansion.intensity=.78;
  p.stages[0].contraction.intensity=.72;
  p.positiveWeight=.5;p.negativeWeight=.65;p.rounding=true;p.apices=configuration?(configuration.upper==='pointed'?'all':'rounded'):apices;
  if(configuration){
    p.sinuses=configuration.lower;p.anchoredLobes=configuration.id==='ce';
    // Open five distinct palmate lobes on the same scaffold for every finish.
    p.stages[0].rotation=50;p.stages[0].intensities[2]=.9;
  }
  return p;
}
export function bladeConfigurations(){return BLADE_CONFIGURATIONS.map(c=>{
  const params=simpleButtercupRecipe(c.id);return {...c,params,...generate(params)};
});}
