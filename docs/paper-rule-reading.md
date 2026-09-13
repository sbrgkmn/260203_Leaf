# Reading the published leaf series

Source: Sabri Gokmen, *Metamorphic Leaves*, Leonardo 53(5), 2020, pp. 522-528. Figures 4 and 5 show buttercup and oak development; Figure 6 shows fourteen selected series; Figure 7 supplies sixteen final forms. Some Figure 6 operations are omitted in the published layout.

## Developmental reconstruction

The previous implementation compared final silhouettes too heavily and let boundary points become new primary branches. This pass separates the retained branching framework from blade and margin growth. The paper's two stages of primary shoot establishment and later differentiation inform the design; the app splits differentiation into two explicit stages for control. This is an extension, not a recovery of the original algorithm.

The four calibration families are:

| Family | Evidence in the paper | Implemented recipe | What to compare |
| --- | --- | --- | --- |
| Magnolia | Figure 6a retains a connected axial blade, with relatively small changes between E and C. | Five axial shoot pairs, shallow structural C, a smooth blade, and no margin stage. | Continuous outline, broadest region near the middle, retained central axis. |
| White oak | Figure 5 populates shoots toward the tip before further differentiation. | Five axial pairs with a tapered length profile, distinct major sinuses, and local blade growth. | Lobe order and position before surface broadening; tip/base anchors remain fixed. |
| Buttercup | Figure 4 establishes radial shoots before they acquire smaller subdivisions. | Three rays per side plus a central shoot; strong early separation, then blade and margin stages. | Primary rays form before secondary detail. The current smaller lobes remain more regular than the paper. |
| Walnut | Figure 6l establishes an almost bare axial framework before broad leaflets fill it. | Six shoot pairs with an angle increasing toward the tip; strong early C followed by local broadening and mild negative C. | Separate leaflet count, attachment spacing, and broadening around unchanged primary axes. |

## Other families

- **Ginkgo:** many radial rays, little separation, and a shorter central ray create the fan. The published notch and basal curvature remain approximate.
- **Date palm:** many narrow bilateral leaflets and strong early separation retain the feather-like framework.
- **American ash:** fewer separated primary pairs develop broad individual leaflets.
- **Holly:** moderate sinuses retain a connected blade, followed by localized margin growth.
- **Maple:** a few radial lobes establish a broad connected form before finer teeth appear.
- **Larkspur:** strong radial separation and local margin subdivision produce a deeply divided form. Its secondary branch organization remains simplified.
- **Saw palmetto:** a wide fan and many deeply separated rays produce the radiating silhouette.
- **Fig:** a few broad radial lobes receive restrained secondary differentiation.
- **Fern:** bilateral primary axes acquire secondary pinnae progressively in the blade stage. This explicit hierarchy distinguishes it from a single row of broadened leaflets.
- **Red oak:** axial primary lobes receive a limited pointed margin stage.
- **Ground ivy:** a compact, nearly circular radial head sits above a long stem.
- **Sycamore:** broad radial lobes retain angular secondary divisions.

## How to calibrate further

Use the published images in **Compare with the paper** while checking three milestones: the end of shoot establishment, the end of blade growth, and the final margin step. Fix shoot count, attachment positions, length profile, and angles first. Then adjust the E/C balance and cycle decay for blades. Add margin cycles only after the large-scale structure agrees.

Preserve the distinction between observations and proposed rules. Negative intensity is a user-requested extension; the paper does not establish that signed values were used. The current structural E is a framework seeding operation whose opposite signs produce mirrored shoots. Later E/C operations apply signed local displacements to existing surfaces.

These settings were manually reviewed against the visible sequences and silhouettes. The previous raster-mask fitting is not used by the current engine. Matching a final silhouette alone can hide an incorrect branching pattern, and numerical geometry tests establish validity rather than botanical realism or source fidelity.

Primary tips, bases, and major sinuses are fixed through later stages. Fine margin points have a parent axis and an operation role, allowing C to preserve preceding E peaks. Rendering simplifies sub-pixel detail before rounding, so extra subdivision does not inadvertently cancel smoothing. Local fold/inversion checks reduce excessive displacements; a geometry budget bounds dense secondary branching. Cross-collision between separate leaflet surfaces is not simulated.
