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

The main editor now has six controls relative to the selected form: stalk/blade origin, branch spread, blade fullness, shoot cycle offset, blade cycle offset, and softer margins. Neutral values reproduce the saved form exactly. The full source settings remain under **Exact E/C rules**; editing them establishes a new anchor for the simple controls. **Reset this leaf** restores the original recipe.

**Published studies** retains the sixteen recovered definitions. **Variation lab** is an independent workspace with eight derived forms: narrow blade, soft oval, lobed spear, open lobed blade, rounded fan, divided fan, paired leaflets, and fine frond. These names describe generated forms, not verified botanical reconstructions. Start from any published recipe or use **Explore 9 nearby forms** to compare a deterministic spread/fullness grid at one scale. Selecting a candidate opens its complete development sequence. Laboratory edits do not modify the published studies. The atlas continues to show the sixteen published studies.

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
node --test leaf.test.mjs studio.test.mjs figure-chart.test.mjs
```

The tests compare all saved frames for all sixteen definitions against their original Python scripts executed with an independent point/vector shim. They check coordinates, polarity, origins, boundary order, veins, and rounded final boundary samples. Additional checks cover the first E origin, stem behavior, local blade transitions, source bounds, rounding, skipped phases, the 12,000-point safety limit, and atlas exports.

These are recovered **saved definitions**, not a claim that every file is the exact publication revision. In particular, `oak.gh` has rounding disabled. The Graph Mapper curves are evaluated from their stored control points; the tests validate the port given those extracted inputs, not Grasshopper's internal evaluation independently. See [source notes](docs/paper-rule-reading.md) and [extraction instructions](tools/grasshopper/README.md).
