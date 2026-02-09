# 260203_Leaf

A single-file HTML5 Canvas app for recursive leaf-like construction using alternating Expansion (E) and Contraction (C) rules, with staged control and axis-aware geometry metadata.

## Latest Version (Default)
This repository now uses the staged pipeline version as the default code version:
- Stage 1: Contraction Stage (patterned development: all, edge2, or edge4)
- Stage 2: Expansion Stage (optional, runs on all active edges when enabled)

## Core Behavior
- Recursion is generated automatically from min-edge thresholds, not a fixed slider step count.
- Stage 1 always terminates on a contraction step.
- Stage 2 (if enabled) continues from Stage 1 output and terminates on an expansion step.
- Neg-neg edge stopping is available and enabled by default in typical runs.
- Edge ID/group redistribution is preserved through EC cycles for patterned development.

## Data and Axis Structure
- Points carry:
  - polarity (+, -, or carry)
  - rule lineage (E, C, seed, carry)
  - axis assignment (pointAxis)
- Segments carry:
  - activity state
  - polarity side
  - orientation
  - group ID (used for edge2/edge4 patterned filtering)
  - axis ownership
- Axis graph metadata is tracked in meta.graph and axisState to keep child axis links attached to parent axis construction.

## Show Form (Current Implementation)
- Show Form is a dedicated visualization mode.
- It draws filled triangulation plus triangle edges, and hides other overlays/lines while active.
- Expansion uses explicit local triangles per expanded edge:
  - triangle 1: (axisOrigin, p0, pNew)
  - triangle 2: (axisOrigin, pNew, p1)
- Contraction keeps target-linked triangulation carried through steps for interior form continuity.

## Smoothing
- Boundary display supports quadratic 3-point smoothing (Smoothing slider).
- Smoothing is display-only and does not change recursive geometry generation.

## Layout
- Left side: step tiles (400x400, six per row).
- Right side:
  - final-step preview at top
  - controls stacked below

## Controls
### Contraction Stage
- Development mode: all, edge2, edge4
- Position
- Intensity
- Angle (0..90)
- Contract Position
- Contract Intensity
- Min Edge Length (>= 0.1)

### Expansion Stage
- Enable Expansion Stage (checkbox)
- Position
- Intensity
- Angle (0..90)
- Contract Position
- Contract Intensity
- Min Edge Length (>= 0.1)

### Display and Utility
- Show Form
- Show Axis
- Show Edge IDs
- Show Construction Points
- Show Construction Lines
- Show Polarity Points
- Stop Neg-Neg Edges
- Jitter / Jitter Amount
- Smoothing
- Export PNG Steps

## Known Issues
- Show Form triangulation still needs a fix in some edge cases.

## Getting Started
1. Start a local server in this folder:
   - py -m http.server 8000
2. Open http://localhost:8000/ in your browser.
