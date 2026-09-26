"""Digitize Figure 4 for comparison; run explicitly, never during app startup.

Requires requests, numpy and opencv-python. Landmarks are manual registrations,
not biological measurements. Ordering follows Brady's caption.
"""
from pathlib import Path
import json
import cv2
import numpy as np
import requests

ROOT = Path(__file__).resolve().parents[1]
URL = 'https://images.squarespace-cdn.com/content/v1/5d41f82684370e0001f5df35/1614201430511-HM796XXXKFTA7JBKLAEX/image-asset.png'
source = ROOT / 'tmp/brady-figure4.png'
if not source.exists():
    response = requests.get(URL, timeout=30)
    response.raise_for_status()
    source.parent.mkdir(exist_ok=True)
    source.write_bytes(response.content)
im = cv2.imread(str(source), cv2.IMREAD_GRAYSCALE)
_, mask = cv2.threshold(im, 100, 255, cv2.THRESH_BINARY_INV)
_, labels, stats, _ = cv2.connectedComponentsWithStats(mask)
registrations = [
    (8, (578,1404), (585,1268)), (7, (349,1240), (367,1046)),
    (5, (299,962), (287,751)), (2, (420,603), (426,234)),
    (1, (692,266), (755,45)), (3, (958,577), (1014,358)),
    (4, (1045,883), (1071,715)), (6, (970,1212), (1027,1018)),
    (9, (800,1435), (822,1291)),
]
forms = []
for number, (component, root, tip) in enumerate(registrations, 1):
    binary = np.uint8(labels == component)*255
    contours, hierarchy = cv2.findContours(binary, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    root, tip = np.array(root), np.array(tip)
    up = (tip-root)/np.linalg.norm(tip-root)
    right = np.array([-up[1],up[0]])
    raw = [(cv2.approxPolyDP(c, .65, True).reshape(-1,2)-root) for c in contours if cv2.contourArea(c)>3]
    aligned = [np.column_stack((c@right,c@up)) for c in raw]
    all_points = np.concatenate(aligned)
    bottom = all_points[:,1].min()
    height = np.linalg.norm(tip-root)-bottom
    normalized = [np.column_stack((c[:,0], c[:,1]-bottom))*10/height for c in aligned]
    forms.append(dict(index=number, component=component, sourceRoot=root.tolist(), sourceTip=tip.tolist(),
                      pixelHeight=round(float(height),3), contours=[np.round(c,4).tolist() for c in normalized]))
largest = max(f['pixelHeight'] for f in forms)
for f in forms:
    f['relativeSize'] = round(f['pixelHeight']/largest,5)
data = dict(source='https://www.natureinstitute.org/ronald-h-brady/form-and-cause-in-goethes-morphology',
            image=URL, figure=4, species='Ranunculus acris',
            method='Threshold 100/255; contour simplification 0.65 source pixels; manual stem-axis registration; holes retained; axis height normalized to 10.',
            forms=forms)
(ROOT/'data/brady-reference.mjs').write_text('// Digitized reference outlines; see tools/extract-brady-series.py.\nexport const BRADY_REFERENCE = '+json.dumps(data,separators=(',',':'))+';\n',encoding='utf-8')
(ROOT/'tmp/brady-reference.json').write_text(json.dumps(data),encoding='utf-8')
print('Extracted',len(forms),'reference leaves.')
