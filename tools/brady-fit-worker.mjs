import readline from 'node:readline';
import {PRESETS} from '../presets.mjs';
import {studyParams} from '../presets.mjs';
import {buildLeaf} from '../growth.mjs';
const base=studyParams(PRESETS.find(p=>p.name==='Buttercup'));
for await(const line of readline.createInterface({input:process.stdin})){
  const input=JSON.parse(line);
  if(input.params){
    const leaf=buildLeaf(input.params,[6,6]);
    process.stdout.write(JSON.stringify(leaf.surfaces.map(s=>s.map(p=>[+p.x.toFixed(4),+p.y.toFixed(4)])))+'\n');
    continue;
  }
  const v=input,p=structuredClone(base),[a,b]=p.stages;
  [a.rotation,a.expansion.intensity,a.contraction.intensity,a.positions[0],b.expansion.intensity,b.contraction.intensity,b.minExpansionLength,p.positiveWeight,p.negativeWeight,a.stemIntensity,a.minExpansionLength,b.rotation]=v;
  a.firstStemIntensity=a.stemIntensity;b.firstStemIntensity=0;b.stemIntensity=0;
  const leaf=buildLeaf(p,[6,6]);
  process.stdout.write(JSON.stringify({surfaces:leaf.surfaces,params:p})+'\n');
}
