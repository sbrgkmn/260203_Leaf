# 260203_Leaf

A dependency-free browser study of Sabri Gokmen's *Metamorphic Leaves*. Sixteen saved Grasshopper definitions drive one recursive JavaScript engine. Black surfaces and white axes show every E/C operation, starting at **01 / Expansion**. The editor includes paper comparisons, playback, a sixteen-row development atlas, and PNG/SVG exports.

## Run

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. No build, Rhino installation, or dependencies are needed to use the app.

## Original rules, compact implementation

E places its origin along the current vein axis, then adds a scaled, rotated boundary vector. Its angle is usually `rotation × (1 − position)`. C interpolates along each boundary edge and displaces that point toward the incoming origin. Negative endpoints use a separate stem position and strength. Polarity stays positive for E and negative for C.

Radial or linear continuation determines which shoot descendants develop and which rest. Each terminating shoot edge starts blade recursion locally. During blade recursion, endpoint polarity selects continuing edges. Position and intensity vary by generation using the recovered Graph Mapper schedules. Small differences between the archived scripts are configuration fields, not separate species algorithms.

The original clamps are retained: E uses values from 0 to 1; some definitions allow negative C. Negative C moves away from the incoming origin. There is no artificial global outward/inward deformation or collision backoff. Separate rational Bézier weights round positive and negative poles without altering recursion. Extreme edits can produce intersecting boundaries, as in the original rules.

## Controls

The main editor now has six controls relative to the selected form: stalk/blade origin, branch spread, blade fullness, shoot cycle offset, blade cycle offset, and softer margins. Neutral values reproduce the saved form exactly. The full source settings remain under **Development settings**; editing them establishes a new anchor for the simple controls. **Reset this leaf** restores the original recipe.

**Published studies** retains the sixteen recovered definitions. **Variation lab** has sixteen symmetric E/C studies numbered 17–32. Replacements at 18, 25, 26, 27 and 30 explore an elliptic Magnolia blade, soft Ivy scallops, slender Maple lobes, a simplified Buttercup with a sharp terminal apex, and fine Walnut leaflets. The other studies and their numbers remain stable. Each identifies its source and recipe settings; the 3x3 neighboring-form grid remains available. The earlier botanical target recipes and compound engine remain in `experimental.mjs` and `compound.mjs` for research, but are not the default lab samples.

Four explanatory tabs add interactive, exportable SVG plates:

- **E/C geometry:** six position/orientation/intensity panels, signed contraction, and radial versus linear continuation with an edge-length cutoff. A controlled axis-vector recipe highlights the continuing edges after the first pair; parallel linear branches taper by a constant 3/4 ratio. Both trajectories use identical numeric settings. C direction comes from an inherited origin; it has no independent rotation slider in the recovered engine.
- **Worked buttercup:** the twelve saved operations in two rows, previous-boundary overlays, inherited axes, newly inserted poles, a step inspector, and the actual generation schedules. Outline/fill and rounding toggles separate construction from drawing.
- **Blade surfaces:** four upper-tip/lower-node combinations on one five-lobed Buttercup scaffold: C/C rounded/rounded, E/C sharp/rounded, C/E rounded/sharp, and E/E sharp/sharp. Treatment is uniform within each pole class. C/E spans rounded lobes between exact lower anchors to show a fuller, Ground ivy-like margin. The labels describe surface treatments; all cases share the same E/C/E/C growth sequence, construction points and axes. Outline/fill views, a four-step development plate and SVG exports expose the difference.
- **Embryo x onto:** twelve symmetric serial forms by default, each with twelve genuine E/C operations. Nine authored Buttercup parameter anchors progress from fullness through branching and division to simpler terminal forms. The organic [Brady Figure 4](https://www.natureinstitute.org/ronald-h-brady/form-and-cause-in-goethes-morphology) silhouettes inform the structural progression; they are available in a folded reference section. Intermediate forms interpolate parameters and regenerate through E/C. Controls include 8/9/12 columns, division strength, spread, relative drawing size, a transition inspector, zoom and SVG export. [Methods and limitations](docs/brady-series.md).

`diagrams.mjs` contains the pure constructions and SVG plates; `learning.mjs` manages their independent controls. The original growth engine and saved recipes are unchanged. Arrow keys, Home and End navigate all seven tabs.

**Development chart** arranges all sixteen leaves in rows inspired by Figure 6, following its fourteen-row order and adding Buttercup and White oak. Choose 12, 16, or 20 frames per row, zoom, or export the entire figure as SVG or PNG. Alternating E/C column headers align with complete recursive cycles; captions contain integer computation indices. Silhouette comparison skips similar cycles while retaining the first and final cycle. When a sequence is too short, a chart-only recipe adds alternating shoot and blade cycles and gradually reduces length cutoffs to permit further branching and differentiation. These forms can diverge from the saved studies; no interpolated drawings are used. The source recipes stay unchanged. A fixed scale applies within each row, and the existing recursion safety limit still applies to edited recipes.

The exact controls remain available:

White oak opens with boundary smoothing enabled, as requested. Reset retains that drawing choice. Its recursion, control points, and branches remain identical to the recovered source; the archive still records the original unsmoothed setting.

- **First E / blade origin:** position on the initial axis, controlling the initial branching origin and influencing stalk length.
- **Shoot trajectory, E/C cycles, E rotation:** main development controls. Half a cycle ends at E.
- **Vary saved E/C schedules:** position/intensity multipliers, stem rules, stopping lengths, and the numeric generation values. A multiplier of 1 preserves the saved curve. Extended cycles hold the last value of each operation separately.
- **Drawing:** original rounding toggle, positive/negative pole weights, white branches, polar points, and continuing/resting edge overlays.
- **View all 16 leaf sequences:** complete rows at a fixed scale per leaf. Edits persist until reload; reset restores the saved definition.

## Source and verification

`data/grasshopper-recipes.mjs` is the complete recovered archive. The app loads `data/leaf-recipes.mjs`: shared defaults and sparse overrides replace repetition, with all unused schedule tails retained as continuation data. `recipe.mjs` expands this representation exactly, including the original generation pairs. Run `node tools/compact-recipes.mjs` after regenerating the archive.

`growth.mjs` implements recursion and separates drawing through `drawLeaf`; `blade.mjs` implements rational rounding. `generator.mjs` caches growth independently of rounding/display settings and shares identical frame geometry without removing sequence steps. `variations.mjs` defines reversible controls and the derived forms. `leaf.mjs` draws the filled boundary. The original `.gh` files are not modified or required at runtime.

```sh
node --test leaf.test.mjs studio.test.mjs figure-chart.test.mjs experimental.test.mjs diagrams.test.mjs margin-study.test.mjs blade-configurations.test.mjs trajectory-study.test.mjs
```

The tests compare all saved frames for all sixteen definitions against their original Python scripts executed with an independent point/vector shim. They check coordinates, polarity, origins, boundary order, veins, and rounded final boundary samples. Additional checks cover the first E origin, stem behavior, local blade transitions, source bounds, rounding, skipped phases, the 12,000-point safety limit, and atlas exports.

These are recovered **saved definitions**, not a claim that every file is the exact publication revision. In particular, `oak.gh` has rounding disabled. The Graph Mapper curves are evaluated from their stored control points; the tests validate the port given those extracted inputs, not Grasshopper's internal evaluation independently. See [source notes](docs/paper-rule-reading.md) and [extraction instructions](tools/grasshopper/README.md).
