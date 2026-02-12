# 260203_Leaf

Recursive leaf-form generator built in a single `index.html` canvas app.

<img width="832" height="657" alt="Screenshot 2026-02-12 at 13 30 02" src="https://github.com/user-attachments/assets/f57febb0-5f1b-4b7f-9822-284239feb4dc" />

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
