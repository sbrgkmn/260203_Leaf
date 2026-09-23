from pathlib import Path
import subprocess,json,hashlib,sys
from graph import read
source=Path(sys.argv[1]);output=Path('tmp/rhino-pass/extracted');output.mkdir(parents=True,exist_ok=True)
summary=[]
for file in list(source.glob('*.gh'))+list((source/'final').glob('*.gh')):
    name=('final--' if file.parent.name=='final' else '')+file.stem
    xml=output/(name+'.ghx')
    subprocess.run(['tmp/rhino-pass/InspectGh.exe',r'C:\Program Files\Rhino 8\Plug-ins\Grasshopper\GH_IO.dll',str(file),str(xml)],check=True,capture_output=True)
    graph=read(xml)
    (output/(name+'.json')).write_text(json.dumps(graph,indent=2),encoding='utf-8')
    codes=[n for n in graph if 'def Leaf(' in n.get('CodeInput','')]
    for n in codes:(output/(name+'.py')).write_text(n['CodeInput'],encoding='utf-8')
    summary.append({'file':name,'objects':len(graph),'leafScripts':len(codes),'codeHash':hashlib.sha256(codes[0]['CodeInput'].encode()).hexdigest()[:12] if codes else None})
print(json.dumps(summary,indent=2))
