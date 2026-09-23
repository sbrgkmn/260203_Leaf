// Parameter schedules and small source-code variations recovered from the GH archives.
import {LEAF_RECIPES} from './data/leaf-recipes.mjs?v=studio-1';
import {expandRecipe} from './recipe.mjs?v=studio-1';
export const PRESETS=LEAF_RECIPES.map(expandRecipe);
// Presentation override requested for White oak; the recovered source stays intact.
export function studyParams(p) {
  return {...structuredClone(p),rounding:p.sourceKey==='oak'?true:p.rounding,veins:true,points:false,frontier:false};
}
