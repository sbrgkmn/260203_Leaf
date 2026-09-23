"""Read saved numeric GH connections; does not execute components or embedded scripts."""
from pathlib import Path
import xml.etree.ElementTree as ET
from functools import lru_cache
import json,sys,ast,hashlib
from graph import read,items,parameters,sources

def persisted(xml):
    if not xml:return []
    values=[]
    for entry in ET.fromstring(xml).findall('.//chunk[@name="Item"]/items/item'):
        if entry.get('type_name')=='gh_interval1d':values.append([float(entry.findtext('A')),float(entry.findtext('B'))])
        elif entry.get('type_name')=='gh_bool':values.append(entry.text=='true')
        elif entry.get('type_name') in ['gh_int32','gh_double','gh_single']:values.append(float(entry.text))
    return values

def bezier(cp,t):
    return (1-t)**3*cp[0]+3*(1-t)**2*t*cp[1]+3*(1-t)*t*t*cp[2]+t**3*cp[3]
def mapped(graph,x):
    domain=items(graph.find('./chunks/chunk[@name="Domain"]'))
    record=graph.find('./chunks/chunk[@name="Graph"]');d=items(record)
    if d['container_name']!='Bezier':raise ValueError('Unsupported mapper '+d['container_name'])
    xp=[float(i.text) for i in record.findall('./items/item[@name="cpx"]')]
    yp=[float(i.text) for i in record.findall('./items/item[@name="cpy"]')]
    u=(x-float(domain['x0']))/(float(domain['x1'])-float(domain['x0']))
    lo,hi=0.,1.
    for _ in range(60):
        mid=(lo+hi)/2
        if bezier(xp,mid)<u:lo=mid
        else:hi=mid
    return float(domain['y0'])+bezier(yp,(lo+hi)/2)*(float(domain['y1'])-float(domain['y0']))

class Graph:
    def __init__(self,path):
        self.nodes=read(path);self.ids={};self.chunks={}
        for n in self.nodes:
            self.ids[n['id']]=n
            for output in n['outputs']:self.ids[output]=n
        for c in ET.parse(path).findall('.//chunk[@name="DefinitionObjects"]/chunks/chunk/chunks/chunk[@name="Container"]'):
            self.chunks[items(c)['InstanceGuid']]=c
    def input(self,p):
        return sum([self.value(s) for s in p['sources']],[]) if p['sources'] else persisted(p['persistent'])
    @lru_cache(None)
    def value(self,guid):
        n=self.ids[guid];name=n['name']
        if 'slider' in n:return [float(n['slider']['Value'])]
        if 'ToggleValue' in n:return [n['ToggleValue']=='true']
        if name=='Graph Mapper':
            graph=self.chunks[n['id']].find('./chunks/chunk[@name="LocalGraph"]')
            return [mapped(graph,x) for source in n['sources'] for x in self.value(source)]
        inputs=[self.input(p) for p in n['inputs']]
        if name in ['Addition','Subtraction','Multiplication','Division','Maximum','Minimum']:
            a,b=inputs
            op={'Addition':lambda a,b:a+b,'Subtraction':lambda a,b:a-b,'Multiplication':lambda a,b:a*b,'Division':lambda a,b:a/b,'Maximum':max,'Minimum':min}[name]
            return [op(a[min(i,len(a)-1)],b[min(i,len(b)-1)]) for i in range(max(len(a),len(b)))]
        if name=='Range':
            (a,b),steps=inputs[0][0],int(round(inputs[1][0]))
            if steps<1:return [a]
            return [a+(b-a)*i/steps for i in range(steps+1)]
        if name=='Series':
            start,step,count=[v[0] for v in inputs]
            return [start+step*i for i in range(int(round(count)))]
        if name=='Reverse List':return list(reversed(inputs[0]))
        if name=='Duplicate Data':
            data,count=inputs[:2];count=int(round(count[0]));order=inputs[2][0] if inputs[2] else True
            return data*count if order else [v for v in data for _ in range(count)]
        if name=='Merge':return sum(inputs,[])
        if name=='Weave':
            pattern=[int(v) for v in inputs[0]];streams=inputs[1:];result=[];indices=[0]*len(streams)
            while any(i<len(s) for i,s in zip(indices,streams)):
                previous=len(result)
                for index in pattern:
                    if indices[index]<len(streams[index]):result.append(streams[index][indices[index]]);indices[index]+=1
                if len(result)==previous:raise ValueError('Unreachable weave stream')
            return result
        if name=='Panel' and not n['sources']:return [float(v) for v in n.get('UserText','').split()]
        if n['sources']:return sum([self.value(s) for s in n['sources']],[])
        raise ValueError('Unsupported connected node '+str((n['index'],name,guid)))
    def python_inputs(self):
        script=next(n for n in self.nodes if 'def Leaf(' in n.get('CodeInput',''))
        values={p['name']:self.input(p) for p in script['inputs'] if p['name']!='base_pt'}
        return values,script['CodeInput']

if __name__=='__main__':
    records={}
    for file in Path('tmp/rhino-pass/extracted').glob('*.ghx'):
        try:
            values,code=Graph(file).python_inputs();records[file.stem]=values
            print(file.stem,'steps',max(values['gen_CON']),max(values['gen_EXP']),'E0',values['Con_Pol'][0],'parameters',len(values))
        except Exception as e:print('ERROR',file.stem,str(e))
    Path('tmp/rhino-pass/parameters.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
