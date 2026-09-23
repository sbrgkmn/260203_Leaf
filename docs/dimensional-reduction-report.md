# Dimensional reduction of the current leaf build

**Recommendation:** simplify the recipe representation and editing controls first. Preserve the generation schedules and discrete recursion rules. The analysis does not support replacing them with a few universal parameters while retaining the current results.

The application and generated forms were left unchanged. Experiments ran on cloned parameters in `tmp/dimensional-analysis`.

## Exact simplifications supported by the data

- **84 of 628 schedule values are unused** across the current 16 presets and 286 frames: 13.4%. Replacing these slots with an arbitrary value left every frame's control points, origins, veins, and surface coordinates byte-for-byte identical. These values can be separated from the active recipe, but should remain archived because extending cycles or changing thresholds may activate them.
- **13 configuration fields have the same value in every preset.** They include eight neutral schedule multipliers, centered left/right factors, the rounding midpoint, the blade continuation flag, and origin connectors. Shared defaults can replace repeated storage without losing information; retain overrides for future variants.
- **First and later stem strengths coincide in 26 of 32 stages.** Use one stem-strength field with a first-step override only where required. The position/intensity lower bounds also coincide in every preset and can share a source-range policy.
- **The blade continuation flag is redundant in the present recursion.** It is passed to C, but blade C determines its children from endpoint polarity independently of that flag. Toggling it preserved all tested geometry. The contraction left/right scaling flag is also inactive for these symmetric presets, though it matters if asymmetry is introduced.
- **14 consecutive frames repeat exactly the same geometry.** Cache their geometry while retaining the original step labels and sequence length. Magnolia's current blade phase inserts no new points; its two frames should remain available but need no additional growth calculation.

## Numerical reduction experiment

I aligned the E/C position and intensity schedules into 84 numeric features: 30 shoot generations and 12 blade generations, each with position and intensity. Shorter schedules hold their last E and C values separately. PCA used standardized columns; cycle counts, thresholds, stem settings, rounding, and categorical rules stayed fixed. Each reconstructed recipe was then run through every saved frame.

| PCA dimensions | Schedule variance retained | Leaves with changed branching in at least one frame |
|---|---:|---:|
| 3 | 76.9% | 14 / 16 |
| 6 | 94.2% | 12 / 16 |
| 10 | 98.9% | 8 / 16 |
| 15 | 100% | 0 / 16 |

“Changed branching” means a different point count or ordered boundary-point identity. Even unchanged branching can have displaced points. At 15 dimensions, all 16 sequences match within 1e-9 units, but this is expected for 16 centered samples; it is not evidence of a universal 15-parameter leaf model. These percentages depend on the schedule alignment and scaling and are not measures of visual similarity.

Small parameter errors can cross a length threshold and alter subsequent recursion. This explains why high retained input variance does not guarantee the same developmental sequence. Moreover, the source contains **111 distinct Bézier mapper shapes among 128 connected mappers**: most curves are not duplicates of a single growth law.

## Suggested next design

1. **Keep exact presets as baselines.** Use shared defaults, sparse stem overrides, and an active schedule plus archived continuation values. Verify all 286 frames after any refactor.
2. **Represent structural choices explicitly.** The presets occupy five combinations of radial/linear continuation, E-vector mode, and first-rotation policy. Preserve these discrete choices; continuous interpolation between recipes alone is insufficient.
3. **Offer fewer editing controls above those baselines:** stalk/blade origin, spread, blade fullness, development depth, and tip/indentation rounding. Define changes as offsets from the selected recipe so neutral settings reproduce it exactly. This simplifies editing, not the intrinsic dimensionality of all leaves.
4. **Separate growth from drawing.** Reuse the recursive geometry when only rounding weights or display options change. The current weights affect the rendered boundary and vein endpoints, not recursion.

The strongest improvement is an exact, compact recipe layer with a small editing interface. A low-dimensional approximation can be useful later for exploring new forms, but should not replace the accepted definitions.
