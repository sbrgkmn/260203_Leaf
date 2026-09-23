"""Execute the original geometry scripts with a minimal, deterministic Rhino shim."""
import json, math, sys, types, hashlib, gzip
from pathlib import Path

rs=types.ModuleType('rhinoscriptsyntax')
rs.VectorCreate=lambda a,b:[x-y for x,y in zip(a,b)]
rs.VectorScale=lambda v,s:[x*s for x in v]
rs.PointAdd=lambda a,b:[x+y for x,y in zip(a,b)]
rs.Distance=lambda a,b:math.sqrt(sum((x-y)**2 for x,y in zip(a,b)))
rs.VectorUnitize=lambda v:rs.VectorScale(v,1/(rs.Distance(v,[0,0,0]) or 1))
def rotate(v,degrees,axis):
    t=math.radians(degrees)*(1 if axis[2]>0 else -1)
    return [v[0]*math.cos(t)-v[1]*math.sin(t),v[0]*math.sin(t)+v[1]*math.cos(t),v[2]]
rs.VectorRotate=rotate
rs.AddPoint=lambda p:list(p)
rs.AddLine=lambda a,b:[list(a),list(b)]
rs.CurveDomain=lambda line:[0,rs.Distance(*line)]
rs.EvaluateCurve=lambda line,t:rs.PointAdd(line[0],rs.VectorScale(rs.VectorCreate(line[1],line[0]),t/rs.Distance(*line)))
rs.AddPolyline=lambda points:[list(p) for p in points]
rs.AddMesh=lambda *args:None
sys.modules['rhinoscriptsyntax']=rs

if __name__=='__main__':
    raw=json.loads(Path('tmp/rhino-pass/oracle-inputs.json').read_text())
    fixtures=[]
    for key,inputs in raw.items():
        code=Path('tmp/rhino-pass/extracted',key+'.py').read_text(encoding='utf-8')
        frames=[]
        for shoots,blades in reversed(list(zip(inputs['gen_CON'],inputs['gen_EXP']))):
            env={k:(v if k in ['Con_Pol','Con_Int','Ex_Pol','Ex_Int','base_pt'] else v[0]) for k,v in inputs.items()}
            env.update(gen_CON=int(shoots),gen_EXP=int(blades))
            exec(compile(code,key,'exec'),env)
            points=env['Points'];indices={id(p):i for i,p in enumerate(points)}
            # Points and neighbor links check the recursion independently of the JS port.
            records=[[*p.loc[:2],int(p.pol)*2-1,*p.origin[:2],indices.get(id(p.left),-1),indices.get(id(p.right),-1)] for p in points]
            frames.append(dict(limits=[shoots,blades],points=records,
                veins=[[a[:2],b[:2]] for a,b in env['Veins']],
                # Save all actual curve samples for the final drawing check.
                blade=[[p[:2] for p in line] for line in env['Blade']] if (shoots,blades)==(inputs['gen_CON'][0],inputs['gen_EXP'][0]) else None))
        fixtures.append(dict(sourceKey=key,scriptHash=hashlib.sha256(code.encode()).hexdigest(),frames=frames))
        print(key,len(frames),len(frames[-1]['points']))
    Path('test/fixtures').mkdir(parents=True,exist_ok=True)
    Path('test/fixtures/grasshopper.json.gz').write_bytes(gzip.compress(json.dumps(fixtures,separators=(',',':')).encode(),mtime=0))
