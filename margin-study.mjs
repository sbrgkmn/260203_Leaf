import {PRESETS,studyParams} from './presets.mjs?v=studio-1';
import {generate} from './leaf.mjs?v=pole-pairs-2';

// Two shoot cycles add two mirrored pairs to the apical shoot: five positive poles.
// The linear trajectory distributes those shoots along the midrib.
export function fiveLobeRecipe({depth=.5,tipWeight=2,notchWeight=1,trajectory='tip',bladeCycles=0}={}){
  const p=studyParams(PRESETS.find(p=>p.name==='Buttercup'));
  p.name='Five-lobed margin study';p.trajectory=trajectory;
  const [a,b]=p.stages;
  a.cycles=2;a.rotation=135;a.minExpansionLength=0;
  a.positions=[.4,.5,.4,.5];a.intensities=[.5,depth,.85,depth];
  a.expansion.intensity=1;a.contraction.intensity=1;
  a.firstStemIntensity=.7;a.stemIntensity=.75;
  b.cycles=bladeCycles;b.minExpansionLength=.4;b.rotation=60;
  b.positions=[.5,.5,.5,.5,.5,.5];b.intensities=[.32,.65,.25,.7,.2,.7];
  b.expansion.intensity=1;b.contraction.intensity=1;
  b.firstStemIntensity=0;b.stemIntensity=0;
  p.rounding=true;p.positiveWeight=tipWeight;p.negativeWeight=notchWeight;
  return p;
}

// Botanical terms are schematic here: depth is an E/C coefficient, not a measured
// fraction of the final rounded lamina. Incision and tip shape are separate axes.
export const MARGIN_TYPES=[
  {name:'Shallow lobed',depth:.18,tipWeight:.65,notchWeight:.65,note:'Broad lobes; shallow sinuses'},
  {name:'Lobed',depth:.35,tipWeight:.9,notchWeight:.9,note:'Rounded lobes and notches'},
  {name:'Cleft',depth:.58,tipWeight:1.4,notchWeight:1.5,note:'Deeper cuts toward the midrib'},
  {name:'Parted',depth:.8,tipWeight:2.5,notchWeight:3,note:'Narrow connections between lobes'},
  {name:'Divided',depth:.96,tipWeight:4,notchWeight:9,note:'Cuts approach the vein origins'},
  {name:'Incised',depth:.8,tipWeight:12,notchWeight:10,bladeCycles:1,note:'Secondary sharp incisions'},
];
export function marginSeries({depthShift=0,sharpness=1,notchSharpness=1}={}){
  return MARGIN_TYPES.map(type=>{
    const params=fiveLobeRecipe({...type,depth:Math.max(.03,Math.min(.99,type.depth+depthShift)),tipWeight:type.tipWeight*sharpness,notchWeight:type.notchWeight*notchSharpness});
    return {...type,params,...generate(params)};
  });
}
