# 260203_Leaf

A small HTML5 Canvas web app that visualizes a parametric Koch-like recursive curve, showing each recursion step side-by-side with construction overlays and live controls.

## Features
- Horizontal scroll of tiles for Step 0..N
- Parametric subdivision with position, intensity, and angle controls
- Construction markers: evaluation point and offset line
- Optional point display and deterministic jitter

## Getting Started
1. Start a local server in this folder:
   - `py -m http.server 8000`
2. Open `http://localhost:8000/` in your browser.

## Controls
- **Steps**: recursion depth
- **Position t**: insertion position along each segment
- **Intensity**: offset magnitude
- **Angle**: rotation of the offset direction
- **Show Points**: toggles vertex markers
- **Jitter**: toggles deterministic variation
- **Jitter Amount**: strength of jitter when enabled
