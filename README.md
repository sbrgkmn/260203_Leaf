# 260203_Leaf

Recursive leaf-form generator built in a single `index.html` canvas app.

<img width="1115" height="875" alt="Screenshot 2026-02-12 at 13 25 23" src="https://github.com/user-attachments/assets/00c1be43-fe76-4226-801a-f880561f7755" />

## Live Demo
https://sbrgkmn.github.io/260203_Leaf/

## Project Overview
- Generates staged EC (Expansion/Contraction) development on a symmetric leaf axis.
- Uses axis-aware point/segment state for recursive construction.
- Includes filled `showForm` triangulation to visualize emerging form.
- Exports step snapshots as PNG.

## Controls
### Contraction Stage
- Development mode (`all`, `edge2`, `edge4`)
- Position
- Intensity
- Angle
- Contract Position
- Contract Intensity
- Min Edge Length

### Expansion Stage
- Apply Expansion Stage
- Position
- Intensity
- Angle
- Contract Position
- Contract Intensity
- Min Edge Length

### Display and Utility
- Show Form
- Form Opacity
- Show Construction Lines
- Show Polarity Points
- Jitter / Jitter Amount
- Smoothing
- Export PNG Steps

## Local Run
1. `cd /Users/sabrigokmen/Desktop/vibecoding/260203_Leaf`
2. `python3 -m http.server 8000`
3. Open `http://localhost:8000/`

## Deployment
- GitHub Pages deploys automatically from `main` via `.github/workflows/deploy-pages.yml`.
