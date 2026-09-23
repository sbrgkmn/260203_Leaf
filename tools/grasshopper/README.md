# Recovering the leaf definitions

Run these commands from the repository root in Windows PowerShell. Python 3 and the installed Rhino 8 `GH_IO.dll` are used only for extraction; the web app and tests do not require Rhino.

```powershell
New-Item -ItemType Directory -Force tmp/rhino-pass | Out-Null
& 'C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe' '/nologo' '/out:tmp\rhino-pass\InspectGh.exe' 'tools\grasshopper\InspectGh.cs'
python -X utf8 tools/grasshopper/extract_all.py 'C:\path\to\GENERATED'
python -X utf8 tools/grasshopper/build_recipes.py
python -X utf8 tools/grasshopper/oracle.py
node --test leaf.test.mjs
```

`extract_all.py` reads `.gh` archives and their `final` subfolder without running Grasshopper components. `graph.py` resolves component IDs and connections. `evaluate_graph.py` evaluates the connected numeric subset: sliders, toggles, domains, ranges, arithmetic, lists, and saved cubic Bézier Graph Mapper curves. Unsupported connected components raise an error. It is deliberately not a general Grasshopper interpreter.

`build_recipes.py` selects the sixteen studies and writes `data/grasshopper-recipes.mjs`. Values come from the connected inputs, not silhouette fitting. The embedded Python syntax supplies source-specific stem rules, limits, initial width, rotation/vector variants, and rounding options. Each recipe retains the relative archive name, script hash, and saved generation pairs.

`oracle.py` executes the extracted, user-supplied geometry scripts with a small in-memory replacement for the Rhino point/vector/drawing calls. It does not launch Rhino or change the original files. Only run it on trusted, inspected source files: it executes their Python. Its compressed test fixture contains every saved frame's points, neighbor links, origins and veins, plus final boundary samples. The fixture validates the JavaScript port independently; it does not independently validate our evaluation of the Grasshopper numeric graph or prove a match to the publication revision.

The selected archives are recorded in the generated recipes. Definitions in `final` are preferred where available; other studies use the matching root files, including `maple_new.gh`, `oak.gh`, and `red oak.gh`. Original binary archives stay outside the repository.
