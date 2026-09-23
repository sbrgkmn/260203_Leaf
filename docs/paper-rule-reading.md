# Published series and recovered rules

Reference: Sabri Gokmen, *Metamorphic Leaves*, Leonardo 53(5), 2020, pp. 522–528. Figures 4 and 5 show buttercup and oak development; Figure 6 shows fourteen further sequences; Figure 7 supplies the sixteen final forms. The published series sometimes omit intermediate operations.

## What the source files changed

The earlier reconstruction used constant edge-normal displacements, a global blade activation, and an additional curvature operation. The supplied Python and Grasshopper definitions instead establish:

1. E uses a point on the current vein axis as its origin. Its rotated vector usually follows the current boundary edge, with axis-vector and tip-distance variants in some files.
2. The first E position is a separately prepended value in several parameter graphs. Later values follow the saved generation curves, so a constant rule loses important differences in stalk length, spacing, taper, and branching.
3. C treats a negative endpoint with a separate stem rule; some sources override the first C strength. Its recursive origin is the evaluated point before displacement.
4. Each shoot edge enters blade recursion as it terminates. This happens inside the depth-first traversal, not as a global activation after every shoot subtree finishes.
5. Rotation, length thresholds, left/right parameter complements, fixed E/C polarities, and mutable vein origins all affect subsequent growth.
6. Rational Bézier weights for positive and negative points control the displayed tips and indentations. Several compound studies have a rounding toggle; the saved oak script draws straight segments.

## Evidence and remaining differences

The app uses sixteen matching definitions from the supplied `GENERATED` directory, preferring its `final` folder where available. Relative source filenames and hashes are retained in the data. Numeric sliders, connections, and Bézier Graph Mapper control points were read from the archives rather than inferred from pictures.

The independent Python fixtures reproduce all saved generation pairs. JavaScript control-point coordinates agree within 1e-9 units; tests also check polarity, origins, neighbor order, veins, and rounded boundary samples. This establishes parity with those scripts for the extracted inputs. It does not establish that the saved files are the exact revisions used for the paper, or independently verify Grasshopper's Graph Mapper implementation.

Visual comparison shows substantially closer fan, lobed, and compound branching. Remaining differences include some outline proportions, fine divisions, and the oak rounding state. The black fill is a rendering of the source boundary, while the paper uses outline drawings. Source crossings or enclosed gaps are retained rather than silently corrected. The paper comparison panel remains available for assessing development as well as final form.
