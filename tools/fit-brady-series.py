"""Approximate the digitized silhouettes using the unchanged E/C engine.

Deterministic coordinate search, silhouette IoU, no claim of botanical inference.
Requires numpy/opencv; run extraction first. App uses only the saved nine fits.
"""
from pathlib import Path
import json, subprocess
import cv2
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
reference=json.loads((ROOT/'tmp/brady-reference.json').read_text())
worker=subprocess.Popen(['node','tools/brady-fit-worker.mjs'],cwd=ROOT,stdin=subprocess.PIPE,stdout=subprocess.PIPE,text=True,encoding='utf-8')
def raster(contours):
    image=np.zeros((160,224),np.uint8)
    cs=[np.rint((np.array(c)+[12,2])*8).astype(np.int32) for c in contours]
    cv2.fillPoly(image,cs,1)
    return image.astype(bool)
def evaluate(v,target):
    worker.stdin.write(json.dumps(list(v))+'\n');worker.stdin.flush()
    result=json.loads(worker.stdout.readline())
    contour=[[list(p.values())[:2] for p in result['surfaces'][0]]]
    generated=raster(contour)
    iou=np.count_nonzero(generated&target)/max(1,np.count_nonzero(generated|target))
    return iou,result
bounds=np.array([[40,145],[.2,1.3],[.08,1.065],[.06,.5],[.05,1.5],[.05,1.32],[.6,12],[.25,2],[.25,1.6],[.1,.98],[.4,14],[20,100]])
initial=np.array([65.872,1,1,.123,.8,1,3,1.6,1.4,.606,.738,52.159])
rng=np.random.default_rng(2026)
fits=[]
for form in reference['forms']:
    target=raster(form['contours'])
    best=(-1,None,None)
    starts=[initial, fits[-1]['vector'] if fits else initial]
    starts += [bounds[:,0]+rng.random(12)*(bounds[:,1]-bounds[:,0]) for _ in range(3)]
    for seed in starts:
        v=np.array(seed,dtype=float);score,res=evaluate(v,target)
        for amount in [.15,.075,.035,.015]:
            for sweep in range(2):
                for d in rng.permutation(12):
                    for sign in [-1,1]:
                        candidate=v.copy();candidate[d]=np.clip(v[d]+sign*amount*(bounds[d,1]-bounds[d,0]),*bounds[d])
                        new_score,new_res=evaluate(candidate,target)
                        if new_score>score:
                            score,res,v=new_score,new_res,candidate
        if score>best[0]:best=(score,res,v)
    score,res,v=best
    fits.append(dict(index=form['index'],iou=round(score,4),vector=v.tolist(),params=res['params']))
    print(form['index'],round(score,4),flush=True)
worker.terminate()
data={'method':'Deterministic coordinate search, 160x224 binary silhouette IoU, symmetric E/C engine, 3 shoot + 3 blade cycles. Approximate fits, not recovered biological parameters.','fits':fits}
(ROOT/'data/brady-fits.mjs').write_text('export const BRADY_FITS = '+json.dumps(data,separators=(',',':'))+';\n',encoding='utf-8')
