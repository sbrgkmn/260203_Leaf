# 260203_Leaf

A dependency-free leaf development study based on Sabri Gokmen's *Metamorphic Leaves* (Leonardo 53(5), 2020, figures 3-7). Sixteen editable recipes share one growth engine. Black surfaces and white branches show every E/C operation, starting at **01 / Expansion**.

## Run locally

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. No installation or build is required.

## Development model

The framework is separated from surface refinement so repeated boundary subdivision does not accidentally create new primary shoots.

1. **Establish shoots.** Choose a connected blade or separate leaflets, and a radial or bilateral arrangement. Shoot count, reach, angle, attachment interval, and spacing establish the primary axes. Structural E introduces shoots; C controls their separation.
2. **Develop blades.** Local E/C displacement broadens each blade around its retained axes. Primary tips, bases, and major sinuses remain anchored. Compound leaves retain separate surfaces. Fern recipes progressively introduce secondary pinnae along the primary shoots.
3. **Refine margins.** E inserts local outward points and C inserts inward points. Their signed intensities can reverse these directions. Existing points are retained while later subdivision adds smaller features; primary axes are unchanged.

Every stage has matching **position / intensity / rotation** controls for E and C. E/C intensities range from -1.5 to +1.5. During blade and margin development, negative E pulls inward and negative C pushes away from the local axis. Structural E sets shoot reach; its sign seeds the opposite mirrored side, with the same bilateral result. A zero structural E produces no surface. Structural C retains a small width at full separation so the stalk framework remains visible.

## Orchestration controls

- **Base / middle / tip length:** an interpolated profile controlling primary shoot lengths. On a radial leaf, base refers to the outer, lower rays and tip to the upper rays near the central shoot.
- **Spacing bias:** distributes attachments along the axis or rays across the fan. One is uniform.
- **Rotation change toward tip:** progressively changes primary shoot angle.
- **Attachment and hierarchy:** stem height, last attachment or central ray length, initial leaflet width, and secondary pairs for compound leaves.
- **Cycle schedule:** stages 2 and 3 multiply intensity by `decay^(cycle - 1)`. A retention of 0.5 halves each successive displacement.
- **Affected region:** grow all margins, upper shoots, lower shoots, or points near shoot tips. Stage-specific base/middle/tip multipliers vary displacement strength spatially.
- **Minimum detail length:** stops subdivision of small edges. Zero cycles skips a stage. Skipping structure initializes its configured framework before the first displayed local operation.

The drawing's smoothing is independent of development. Display-scale simplification keeps rounding effective as point density increases. White axes/branches and polar points can be toggled independently.

## Comparison and exports

**Compare with the paper** opens the selected leaf's published Figure 7 silhouette beside the live reconstruction, followed by its published E/C series. Reference crops come from the user-supplied PDF; see `references/README.md`. Figure 6 skips some computation steps, so published and generated columns do not correspond one-to-one.

**View all 16 leaf sequences** opens the atlas. Each leaf occupies one row, and every generated E/C operation has a column. Green dividers begin blade development; ochre dividers begin margin refinement. All steps in a row share one scale. Labels and final forms remain visible when scrolling. Click any form to edit that leaf and step; use **Fit all columns** for an overview.

Exports include the selected form as PNG or SVG, a PNG sheet of the selected sequence, and the entire atlas as vector SVG. Edits remain separate for each leaf during the page session. **Reset this leaf** restores only the selected recipe; reloading restores all defaults.

## Code

- `growth.mjs`: framework, local surface development, role restrictions, cycle schedules, and bounded subdivision.
- `leaf.mjs`: shared geometry helpers, smoothing, and SVG rendering.
- `presets.mjs`: compact named recipes and paper interpretations. `polar(position, intensity, rotation)` and `stage(cycles, E, C, decay, minimumLength)` keep settings concise.
- `app.mjs`: controls, per-leaf settings, playback, paper comparison, and exports.
- `atlas.mjs`: comparison table and standalone atlas SVG.

## Validation and limits

```sh
node --test leaf.test.mjs
```

Checks cover all sixteen complete E-first sequences, bilateral symmetry, non-crossing contours, fixed primary axes, compound leaflet separation and broadening, signed displacement, all six local controls, regional growth, spatial profiles, cycle decay, secondary hierarchy, stage skipping, bounded extreme settings, and complete SVG atlas exports.

The engine reduces local displacement if it would fold or invert a surface, and reports this in the editor. Extremely dense hierarchies reserve a fixed detail budget, with at most 4,096 displayed control points. A structural arrangement that would fold stops with an explanation. These are planar geometric studies: separate leaflets can overlap under extreme settings, and the model does not simulate tissue or branch collisions in 3D.

The recipes are approximate reconstructions, not recovered paper parameters. Their explicit three-stage organization and retained shoot framework extend the published method. Shape similarity still depends on visual review; passing geometric tests does not establish a match to the paper. See `docs/paper-rule-reading.md` for the calibration approach and remaining differences.
