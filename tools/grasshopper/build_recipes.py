import ast,json,hashlib
from pathlib import Path
from evaluate_graph import Graph

FILES=[('Buttercup','final--buttercup','Figure 4'),('Magnolia','final--magnolia','Figure 6a'),('Ginkgo','final--ginkgo','Figure 6b'),('Date palm','date_palm','Figure 6c'),('American ash','ash','Figure 6d'),('Holly','final--holly_new','Figure 6f'),('Maple','maple_new','Figure 6e'),('Larkspur','final--LAKSPUR','Figure 6g'),('Saw palmetto','final--sabal','Figure 6h'),('Fig','fig','Figure 6i'),('Fern','final--fern','Figure 6j'),('White oak','oak','Figure 5'),('Red oak','red oak','Figure 6k'),('Walnut','final--walnut','Figure 6l'),('Ground ivy','ground_ıvy','Figure 6m'),('Sycamore','sycamore','Figure 6n')]

def number(node,env):
    # Evaluate only small numeric parameter expressions parsed from the source.
    allowed=(ast.Expression,ast.Constant,ast.Name,ast.Load,ast.IfExp,ast.UnaryOp,ast.Not,ast.USub,ast.Compare,ast.Eq,ast.NotEq,ast.Gt,ast.Lt,ast.GtE,ast.LtE,ast.BoolOp,ast.And,ast.Or,ast.BinOp,ast.Add,ast.Sub,ast.Mult,ast.Div)
    assert all(isinstance(n,allowed) for n in ast.walk(node)),ast.dump(node)
    return eval(compile(ast.Expression(node),'<parameter>','eval'),{'__builtins__':{}},env)

def convert(name,key,reference):
    path=Path('tmp/rhino-pass/extracted')/(key+'.ghx')
    inputs,code=Graph(path).python_inputs();tree=ast.parse(code)
    functions={n.name:n for n in tree.body if isinstance(n,ast.FunctionDef)}
    scalar={k:v[0] for k,v in inputs.items() if k not in ['gen_CON','gen_EXP','Con_Pol','Con_Int','Ex_Pol','Ex_Int']}
    con=functions['CON'];ex=functions['EXP']
    assignments={n.targets[0].id:n.value for n in con.body if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name)}
    eval_expr=assignments['eval_Pt'].args[1].orelse
    stem_expr=next(n.value.args[1].orelse for n in con.body if isinstance(n,ast.Assign) and isinstance(n.value,ast.Call) and isinstance(n.value.func,ast.Attribute) and n.value.func.attr=='VectorScale')
    condition=functions['Leaf'].body[1].test.values[0]
    def tolerance(phase,pol):
        env={**scalar,'PHASE':phase,'pol':pol}
        node=condition
        while isinstance(node,ast.IfExp):node=node.body if number(node.test,env) else node.orelse
        return number(node.comparators[0],env) if isinstance(node,ast.Compare) else None
    def lower(expr):
        for n in ast.walk(expr):
            if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id=='max':return number(n.args[0],{})
        return None
    stages=[]
    for phase,prefix in [(False,'Con'),(True,'Ex')]:
        env={**scalar,'PHASE':phase,'g':3}
        stages.append(dict(cycles=max(inputs['gen_EXP' if phase else 'gen_CON'])/2,
            positions=inputs[prefix+'_Pol'],intensities=inputs[prefix+'_Int'],rotation=scalar['Rotation_2' if phase else 'Rotation'],
            expansion=dict(position=1,intensity=1),contraction=dict(position=1,intensity=1),
            minExpansionLength=tolerance(phase,True),minContractionLength=tolerance(phase,False),
            stemPosition=number(eval_expr,env),stemIntensity=number(stem_expr,env),firstStemIntensity=number(stem_expr,{**env,'g':1})))
    extext=ast.unparse(ex);context=ast.unparse(con)
    roundtext=ast.unparse(functions['RoundEdges'])
    variant=dict(firstRotationFull='if g != 0 else 1' in extext,
        vectorMode='axis' if 'axis.getV()' in extext else 'tipDistance' if 'B.getDist()' in extext else 'edge',
        contractionPositionMin=lower(assignments['pol']),contractionIntensityMin=lower(assignments['int']),
        contractionLRIntensity='R_int' in ast.unparse(assignments['int']),connectOrigins='Veins.append' in extext,
        veinFollowsRounding='subdivide' in scalar,
        veinAtControlPoint=not any(isinstance(n,ast.Call) and isinstance(n.func,ast.Attribute) and n.func.attr=='getInterpolatedLoc' for n in ast.walk(tree)))
    source=key.replace('final--','final/')+'.gh'
    inputs['base_pt']=[0,0,0]
    seed=next(n.value.args[1].elts[0] for n in tree.body if isinstance(n,ast.Assign) and isinstance(n.targets[0],ast.Name) and n.targets[0].id=='C_pt')
    recipe=dict(name=name,seedHalfWidth=number(seed,{}),trajectory='base' if scalar['CON_DIR'] else 'tip',stages=stages,
        bladeContinue=scalar['EX_DIR'],positiveWeight=scalar['w_ex'],negativeWeight=scalar['w_con'],
        rounding=scalar.get('subdivide','AddPolyline' in roundtext),roundPosition=scalar.get('subdiv_pos',.5),
        leftRightPosition=scalar.get('LR_pol',.5),leftRightIntensity=scalar.get('LR_int',.5),
        variant=variant,reference=reference,source=source,sourceKey=key,
        observation='Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.',
        recipe='Ported from '+source+'. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.',
        scriptHash=hashlib.sha256(code.encode()).hexdigest(),sourceFrames=list(reversed(list(zip(inputs['gen_CON'],inputs['gen_EXP'])))))
    return recipe,inputs

if __name__=='__main__':
    recipes=[];raw={}
    for name,key,reference in FILES:
        recipe,inputs=convert(name,key,reference);recipes.append(recipe);raw[key]=inputs
        print(name,recipe['variant'],[(s['stemPosition'],s['stemIntensity'],s['firstStemIntensity'],s['minExpansionLength'],s['minContractionLength']) for s in recipe['stages']])
    Path('data').mkdir(exist_ok=True)
    Path('data/grasshopper-recipes.mjs').write_text('// Extracted from the user-provided Grasshopper archives; do not hand-fit these values.\nexport const GRASSHOPPER_RECIPES = '+json.dumps(recipes,indent=2,ensure_ascii=False)+';\n',encoding='utf-8')
    Path('tmp/rhino-pass/oracle-inputs.json').write_text(json.dumps(raw,indent=2),encoding='utf-8')
