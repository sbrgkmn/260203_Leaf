"""Refine individual generation schedules against silhouette AND boundary detail.

Writes a candidate file until --accept is supplied. Original published recipes
are never touched. Requires scipy, numpy, opencv-python; deterministic seed.
"""
from pathlib import Path
import copy,json,subprocess,sys
import cv2
import numpy as np
from scipy.optimize import differential_evolution
ROOT=Path(__file__).resolve().parents[1]
def module(path):return json.loads(path.read_text(encoding='utf-8').split(' = ',1)[1].rstrip(';\n'))
old=module(ROOT/('tmp/brady-fits-candidate.mjs' if '--cuts' in sys.argv else 'data/brady-fits.mjs'))
reference=module(ROOT/'data/brady-reference.mjs')
worker=subprocess.Popen(['node','tools/brady-fit-worker.mjs'],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE,text=True,encoding='utf-8')
SCALE=20
def raster(contours):
    image=np.zeros((260,460),np.uint8)
    cs=[np.rint((np.array(c)+[11,1])*SCALE).astype(np.int32) for c in contours]
    cv2.fillPoly(image,cs,1)
    return image
def boundary(mask):return cv2.morphologyEx(mask,cv2.MORPH_GRADIENT,np.ones((3,3),np.uint8)).astype(bool)
def contour(params):
    worker.stdin.write(json.dumps({'params':params},separators=(',',':'))+'\n');worker.stdin.flush()
    return json.loads(worker.stdout.readline())
def encode(p):
    v=[]
    for s in p['stages']:
        v+=s['positions'][:6]
        v+=[min(1,i*s['expansion' if j%2==0 else 'contraction']['intensity']) for j,i in enumerate(s['intensities'][:6])]
    v += [s['rotation'] for s in p['stages']]
    v += [s['minExpansionLength'] for s in p['stages']]
    v += [p['stages'][0]['firstStemIntensity'],p['stages'][0]['stemIntensity']]
    v += [np.log(p['positiveWeight']),np.log(p['negativeWeight']),p['leftRightPosition'],p['leftRightIntensity']]
    return np.array(v)
def decode(v,base):
    p=copy.deepcopy(base)
    for k,s in enumerate(p['stages']):
        s['positions'][:6]=list(v[k*12:k*12+6]);s['intensities'][:6]=list(v[k*12+6:k*12+12])
        s['expansion']['intensity']=s['contraction']['intensity']=1
        s['rotation']=v[24+k];s['minExpansionLength']=v[26+k]
    p['stages'][0]['firstStemIntensity']=v[28];p['stages'][0]['stemIntensity']=v[29]
    p['positiveWeight']=float(np.exp(v[30]));p['negativeWeight']=float(np.exp(v[31]))
    p['leftRightPosition']=v[32];p['leftRightIntensity']=v[33]
    return p
bounds=[(.03,.9)]*6+[(.025,.999)]*6+[(.03,.95)]*6+[(.025,.999)]*6+[(25,150)]*2+[(.15,9.5),(.1,9.5)]+[(.02,.99)]*2+[(np.log(.25),np.log(45))]*2+[(.35,.65)]*2
lo,hi=np.array(bounds).T
results=[]
for index,(f,previous) in enumerate(zip(reference['forms'],old['fits'])):
    target=raster(f['contours']);target_edge=boundary(target)
    hull=np.zeros_like(target)
    pixels=cv2.findNonZero(target)
    cv2.fillConvexPoly(hull,cv2.convexHull(pixels),1)
    stem_y=10*(1-np.linalg.norm(np.array(f['sourceTip'])-f['sourceRoot'])/f['pixelHeight'])
    hull[:max(0,int((stem_y+1)*SCALE)),:]=0
    target_cuts=hull.astype(bool)&~target.astype(bool)
    target_distance=cv2.distanceTransform(1-target_edge.astype(np.uint8),cv2.DIST_L2,3)
    base=previous['params'];evaluations=0
    def metrics(mask):
        union=np.count_nonzero(mask|target);iou=np.count_nonzero(mask&target)/max(1,union)
        edge=boundary(mask);distance=cv2.distanceTransform(1-edge.astype(np.uint8),cv2.DIST_L2,3)
        # Bidirectional boundary F1, tolerance 0.15 axis units. Deep cut edges count.
        precision=np.mean(target_distance[edge]<=3) if edge.any() else 0
        recall=np.mean(distance[target_edge]<=3)
        bf=2*precision*recall/max(1e-9,precision+recall)
        cuts=hull.astype(bool)&~mask.astype(bool)
        cut_iou=np.count_nonzero(cuts&target_cuts)/max(1,np.count_nonzero(cuts|target_cuts))
        return float(iou),float(bf),float(cut_iou)
    old_iou,old_bf,old_cuts=metrics(raster(contour(base)))
    best=[-.1,None,None]
    def objective(v):
        params=decode(v,base)
        iou,bf,cut_iou=metrics(raster(contour(params)))
        score=.5*iou+.25*bf+.25*cut_iou if '--cuts' in sys.argv else .65*iou+.35*bf
        if score>best[0]:best[:]=[score,list(v),(iou,bf,cut_iou)]
        return -score
    start=np.clip(encode(base),lo,hi)
    objective(start)
    # Search around the existing fit but also seed crisp, deeply cut alternatives.
    rng=np.random.default_rng(7100+index)
    population=np.clip(start+rng.normal(0,.12,(136,len(start)))*(hi-lo),lo,hi)
    population[0]=start
    for i in range(1,30):
        population[i,30:32]=rng.uniform(np.log(2),np.log(35),2)
        population[i,[7,9,11,19,21,23]]=rng.uniform(.65,.99,6)
        population[i,26:28]=rng.uniform(.2,3,2)
    differential_evolution(objective,bounds,init=population,maxiter=18 if '--cuts' in sys.argv else 50,tol=0,polish=False,seed=7100+index,updating='immediate')
    v=np.array(best[1]);score=-objective(v)
    for amount in [.025,.012,.006,.003]:
        for sweep in range(2):
            for d in rng.permutation(len(v)):
                for sign in [-1,1]:
                    candidate=v.copy();candidate[d]=np.clip(v[d]+sign*amount*(hi[d]-lo[d]),lo[d],hi[d])
                    score2=-objective(candidate)
                    if score2>score:score,v=score2,candidate
    score,v,quality=best
    params=decode(np.array(v),base)
    results.append(dict(index=f['index'],iou=round(quality[0],4),boundaryF1=round(quality[1],4),cutIou=round(quality[2],4),previousIou=previous.get('previousIou',round(old_iou,4)),previousBoundaryF1=previous.get('previousBoundaryF1',round(old_bf,4)),params=params))
    print(f"{f['index']}: IoU {old_iou:.3f} -> {quality[0]:.3f}; boundary {old_bf:.3f} -> {quality[1]:.3f}",flush=True)
    objective_text='50% silhouette IoU + 25% boundary F1 + 25% incision-space IoU' if '--cuts' in sys.argv else '65% silhouette IoU + 35% boundary F1'
    data=dict(method='Generation schedules fitted with differential evolution and coordinate refinement; 460x260 raster, 20 pixels per axis unit. Objective '+objective_text+' (boundary tolerance: 3 pixels). Asymmetry allowed for source comparison. Twelve E/C operations; no target outline substitution.',fits=results)
    (ROOT/'tmp/brady-refined.json').write_text(json.dumps(data),encoding='utf-8')
worker.terminate()
destination=ROOT/('data/brady-fits.mjs' if '--accept' in sys.argv else 'tmp/brady-fits-candidate.mjs')
destination.write_text('export const BRADY_FITS = '+json.dumps(data,separators=(',',':'))+';\n',encoding='utf-8')
