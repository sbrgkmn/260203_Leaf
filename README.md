# 260203_Leaf

A small HTML5 Canvas web app that visualizes a parametric recursive curve with alternating expansion and contraction, showing each recursion step side-by-side with construction overlays and live controls.

## Features
- Horizontal scroll of tiles for Step 1..N with the initial axis shown on every step
- Alternating expansion/contraction recursion with independent controls
- Construction overlays (evaluation points, offset links, contraction target links)
- Polarity visualization for expansion (red) and contraction (green) points
- Deterministic jitter option
- Export per-step PNGs (640x640)

## Getting Started
1. Start a local server in this folder:
   - `py -m http.server 8000`
2. Open `http://localhost:8000/` in your browser.

## Controls
- **Steps**: recursion depth
- **Position t**: expansion insertion position along each segment
- **Intensity**: expansion offset magnitude
- **Angle**: rotation of the expansion offset direction
- **Contraction Position tc**: contraction insertion position
- **Contraction Intensity**: pull strength toward targets
- **Show Construction Points**: toggles black evaluation points
- **Show Construction Lines**: toggles dashed construction links
- **Show Polarity Points**: toggles red/green polarity markers
- **Jitter**: toggles deterministic variation
- **Jitter Amount**: strength of jitter when enabled
- **Export PNG Steps**: downloads each step as a 640×640 PNG
