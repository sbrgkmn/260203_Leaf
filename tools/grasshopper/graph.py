from pathlib import Path
import xml.etree.ElementTree as ET
import sys,json
def items(e):
    return {i.get('name'):i.text for i in e.findall('./items/item')}
def sources(e):
    return [i.text for i in e.findall('./items/item[@name="Source"]')]
def parameters(c,kind):
    return c.findall(f'./chunks/chunk[@name="param_{kind}"]')+c.findall(f'./chunks/chunk[@name="ParameterData"]/chunks/chunk[@name="{kind.title()}Param"]')
def read(path):
    result=[]
    for obj in ET.parse(path).findall('.//chunk[@name="DefinitionObjects"]/chunks/chunk'):
        c=obj.find('./chunks/chunk[@name="Container"]')
        if c is None: continue
        d=items(c); n=dict(index=int(obj.get('index')),name=d.get('Name'),nick=d.get('NickName'),id=d.get('InstanceGuid'),sources=sources(c))
        n['inputs']=[dict(name=items(p).get('NickName') if d.get('Name')=='Python Script' else items(p).get('Name'),id=items(p).get('InstanceGuid'),sources=sources(p),persistent=ET.tostring(p.find('./chunks/chunk[@name="PersistentData"]'),encoding='unicode') if p.find('./chunks/chunk[@name="PersistentData"]') is not None else '') for p in parameters(c,'input')]
        n['outputs']=[items(p).get('InstanceGuid') for p in parameters(c,'output')]
        for k in ['CodeInput','UserText','ToggleValue','Expression','Value','Text']:
            if k in d:n[k]=d[k]
        slider=c.find('./chunks/chunk[@name="Slider"]')
        if slider is not None:n['slider']=items(slider)
        result.append(n)
    return result
if __name__=='__main__':
    graph=read(sys.argv[1])
    Path(sys.argv[1]+'.json').write_text(json.dumps(graph,indent=2),encoding='utf-8')
    for n in graph:
        if n['name'] in ['Group','Cluster']:continue
        print(n['index'],n['name'],n['nick'],n['id'],n.get('slider',{}).get('Value',''),n.get('ToggleValue',''),n.get('UserText',''))
        for p in n['inputs']:print('  IN',p['name'],','.join(p['sources']),p['persistent'][:100])
        if n['outputs']:print('  OUT',','.join(n['outputs']))
        if 'CodeInput' in n:Path(sys.argv[1]+'.py').write_text(n['CodeInput'],encoding='utf-8')
