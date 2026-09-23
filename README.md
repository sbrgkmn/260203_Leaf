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

- **First E / blade origin:** position on the initial axis, controlling the initial branching origin and influencing stalk length.
- **Shoot trajectory, E/C cycles, E rotation:** main development controls. Half a cycle ends at E.
- **Vary saved E/C schedules:** position/intensity multipliers, stem rules, stopping lengths, and the numeric generation values. A multiplier of 1 preserves the saved curve. Extended cycles hold the last value of each operation separately.
- **Drawing:** original rounding toggle, positive/negative pole weights, white branches, polar points, and continuing/resting edge overlays.
- **View all 16 leaf sequences:** complete rows at a fixed scale per leaf. Edits persist until reload; reset restores the saved definition.

## Source and verification

`data/grasshopper-recipes.mjs` contains the recovered parameters, source archive names, Python hashes, and original generation pairs. `growth.mjs` implements the recursion; `blade.mjs` implements rational rounding; `leaf.mjs` draws the filled boundary. The original `.gh` files are not modified or required at runtime.

```sh
node --test leaf.test.mjs
```

The tests compare all saved frames for all sixteen definitions against their original Python scripts executed with an independent point/vector shim. They check coordinates, polarity, origins, boundary order, veins, and rounded final boundary samples. Additional checks cover the first E origin, stem behavior, local blade transitions, source bounds, rounding, skipped phases, the 12,000-point safety limit, and atlas exports.

These are recovered **saved definitions**, not a claim that every file is the exact publication revision. In particular, `oak.gh` has rounding disabled. The Graph Mapper curves are evaluated from their stored control points; the tests validate the port given those extracted inputs, not Grasshopper's internal evaluation independently. See [source notes](docs/paper-rule-reading.md) and [extraction instructions](tools/grasshopper/README.md).
