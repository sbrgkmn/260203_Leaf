// Shared engine; Figure 7 order. These are interpretations, not recovered settings.
// polar(position, signed intensity, rotation in degrees)
const polar=(position,intensity,rotation)=>({position,intensity,rotation});
// stage(cycles, E, C, intensity retained per cycle, minimum detail length)
const stage=(cycles,expansion,contraction,decay=.65,minLength=.012)=>({
  cycles,expansion,contraction,decay,minLength,target:'all',profile:[1,1,1],
});

export const PRESETS = [
  {
    name: "Buttercup", trajectory: 'base',
    growth: {"family":"lobed","shoots":3,"width":1.12,"spread":112,"start":0.23,"end":0.8,"profile":[0.68,0.92,1],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(3, polar(0.5, 0.45, 20), polar(0.5, 0.8, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.85, 0), polar(0.5, 0.25, 0), 0.7, 0.012),
      stage(1, polar(0.5, 0.65, 0), polar(0.5, 0.55, 0), 0.55, 0.014)
    ],
    smoothing: 0.5, reference: "Figure 4",
    observation: "Primary shoots appear in a radial series before each shoot develops smaller lobes.",
    recipe: "Radial framework with 3 rays per side. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Magnolia", trajectory: 'tip',
    growth: {"family":"continuous","shoots":5,"width":0.23,"spread":12,"start":0.12,"end":0.77,"profile":[0.52,1,0.5],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(5, polar(0.5, 0.45, 20), polar(0.5, 0.04, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.1, 0), polar(0.5, 0.02, 0), 0.7, 0.012),
      stage(0, polar(0.5, 0, 0), polar(0.5, 0, 0), 0.55, 0.014)
    ],
    smoothing: 1, reference: "Figure 6a",
    observation: "The axial blade progressively fills with relatively little difference between E and C outlines.",
    recipe: "Axial framework with 5 shoot pairs. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Ginkgo", trajectory: 'base',
    growth: {"family":"continuous","shoots":14,"width":0.87,"spread":86,"start":0.3,"end":0.8,"profile":[0.96,1,1.02],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":0.86},
    stages: [
      stage(6, polar(0.5, 0.45, 20), polar(0.5, 0.01, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.12, 0), polar(0.5, -0.05, 0), 0.7, 0.012),
      stage(2, polar(0.5, 0.15, 0), polar(0.5, 0.05, 0), 0.55, 0.014)
    ],
    smoothing: 0.92, reference: "Figure 6b",
    observation: "Many closely spaced radial shoots widen into a fan with little division between adjacent rays.",
    recipe: "Radial framework with 14 rays per side. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Date palm", trajectory: 'tip',
    growth: {"family":"compound","shoots":14,"width":0.26,"spread":48,"start":0.13,"end":0.83,"profile":[0.7,1,0.6],"spacing":1,"tipRotation":0,"leafletWidth":0.14,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(14, polar(0.5, 0.45, 20), polar(0.5, 0.98, 0), 0.65, 0.012),
      stage(1, polar(0.5, 0.14, 0), polar(0.5, 0.04, 0), 0.7, 0.012),
      stage(0, polar(0.5, 0, 0), polar(0.5, 0, 0), 0.55, 0.014)
    ],
    smoothing: 0.12, reference: "Figure 6c",
    observation: "Repeated bilateral shoots remain narrow and strongly separated along the axis.",
    recipe: "Axial framework with 14 shoot pairs. Separate leaflets broaden around retained axes. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "American ash", trajectory: 'tip',
    growth: {"family":"compound","shoots":3,"width":0.36,"spread":24,"start":0.2,"end":0.72,"profile":[0.83,1,0.8],"spacing":1,"tipRotation":0,"leafletWidth":0.14,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(3, polar(0.5, 0.45, 20), polar(0.5, 0.99, 0), 0.65, 0.012),
      stage(3, polar(0.5, 1.05, 0), polar(0.5, -0.12, 0), 0.7, 0.012),
      stage(0, polar(0.5, 0.1, 0), polar(0.5, 0.1, 0), 0.55, 0.014)
    ],
    smoothing: 0.8, reference: "Figure 6d",
    observation: "A separated primary framework is followed by broadening of individual leaflets.",
    recipe: "Axial framework with 3 shoot pairs. Separate leaflets broaden around retained axes. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Holly", trajectory: 'tip',
    growth: {"family":"lobed","shoots":4,"width":0.27,"spread":18,"start":0.18,"end":0.75,"profile":[0.65,1,0.58],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(4, polar(0.5, 0.45, 20), polar(0.5, 0.24, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.38, 0), polar(0.5, 0.15, 0), 0.7, 0.012),
      stage(2, polar(0.5, 0.12, 0), polar(0.5, 0.15, 0), 0.55, 0.014)
    ],
    smoothing: 0.35, reference: "Figure 6f",
    observation: "An intact axial blade gains pointed teeth without separating into leaflets.",
    recipe: "Axial framework with 4 shoot pairs. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Maple", trajectory: 'base',
    growth: {"family":"lobed","shoots":2,"width":1.08,"spread":93,"start":0.22,"end":0.8,"profile":[0.64,0.73,0.94],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(2, polar(0.5, 0.45, 20), polar(0.5, 0.22, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.4, 0), polar(0.5, 0.2, 0), 0.7, 0.012),
      stage(2, polar(0.5, 0.4, 0), polar(0.5, 0.3, 0), 0.55, 0.014)
    ],
    smoothing: 0.2, reference: "Figure 6e",
    observation: "A few primary radial lobes establish the silhouette before secondary pointed divisions appear.",
    recipe: "Radial framework with 2 rays per side. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Larkspur", trajectory: 'base',
    growth: {"family":"lobed","shoots":3,"width":0.67,"spread":105,"start":0.4,"end":0.8,"profile":[0.7,0.88,1],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(3, polar(0.5, 0.45, 20), polar(0.5, 0.96, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.65, 0), polar(0.5, 0.45, 0), 0.7, 0.012),
      stage(1, polar(0.5, 1.05, 0), polar(0.5, 0.9, 0), 0.55, 0.014)
    ],
    smoothing: 0.45, reference: "Figure 6g",
    observation: "A radial framework develops into finely divided secondary and tertiary shoots.",
    recipe: "Radial framework with 3 rays per side. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Saw palmetto", trajectory: 'base',
    growth: {"family":"lobed","shoots":16,"width":1,"spread":155,"start":0.38,"end":0.8,"profile":[0.75,0.96,1],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(6, polar(0.5, 0.45, 20), polar(0.5, 0.89, 0), 0.65, 0.012),
      stage(1, polar(0.5, 0.1, 0), polar(0.5, 0.02, 0), 0.7, 0.012),
      stage(0, polar(0.5, 0, 0), polar(0.5, 0, 0), 0.55, 0.014)
    ],
    smoothing: 0.08, reference: "Figure 6h",
    observation: "Repeated radial shoots spread around a common center into a deeply divided fan.",
    recipe: "Radial framework with 16 rays per side. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Fig", trajectory: 'base',
    growth: {"family":"lobed","shoots":2,"width":1.03,"spread":100,"start":0.23,"end":0.8,"profile":[0.6,0.7,0.88],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(2, polar(0.5, 0.45, 20), polar(0.5, 0.57, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.8, 0), polar(0.5, -0.1, 0), 0.7, 0.012),
      stage(1, polar(0.5, 0.4, 0), polar(0.5, 0.3, 0), 0.55, 0.014)
    ],
    smoothing: 0.28, reference: "Figure 6i",
    observation: "Broad primary lobes form radially and acquire modest secondary detail.",
    recipe: "Radial framework with 2 rays per side. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Fern", trajectory: 'tip',
    growth: {"family":"compound","shoots":9,"width":0.33,"spread":24,"start":0.17,"end":0.86,"profile":[1,1,0.16],"spacing":1,"tipRotation":0,"leafletWidth":0.14,"secondaryPairs":5,"terminalScale":1},
    stages: [
      stage(9, polar(0.5, 0.45, 20), polar(0.5, 0.99, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.9, 0), polar(0.5, -0.2, 0), 0.7, 0.012),
      stage(2, polar(0.5, 0.2, 0), polar(0.5, 0.1, 0), 0.55, 0.014)
    ],
    smoothing: 0.6, reference: "Figure 6j",
    observation: "A bilateral framework is established first, then each lateral shoot is recursively divided.",
    recipe: "Axial framework with 9 shoot pairs. Separate leaflets broaden around retained axes. Secondary pinnae form along each primary shoot."
  },
  {
    name: "White oak", trajectory: 'tip',
    growth: {"family":"lobed","shoots":5,"width":0.29,"spread":28,"start":0.14,"end":0.78,"profile":[0.6,1,0.45],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(5, polar(0.5, 0.45, 20), polar(0.5, 0.78, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.4, 0), polar(0.5, 0.05, 0), 0.7, 0.012),
      stage(0, polar(0.5, 0.12, 0), polar(0.5, 0.06, 0), 0.55, 0.014)
    ],
    smoothing: 0.75, reference: "Figure 5",
    observation: "Shoots populate toward the tip while a continuous blade and rounded lobes remain visible.",
    recipe: "Axial framework with 5 shoot pairs. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Red oak", trajectory: 'tip',
    growth: {"family":"lobed","shoots":5,"width":0.28,"spread":27,"start":0.17,"end":0.78,"profile":[0.55,1,0.6],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(5, polar(0.5, 0.45, 20), polar(0.5, 0.56, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.45, 0), polar(0.5, 0.1, 0), 0.7, 0.012),
      stage(1, polar(0.5, 0.55, 0), polar(0.5, 0.35, 0), 0.55, 0.045)
    ],
    smoothing: 0.2, reference: "Figure 6k",
    observation: "Axial primary lobes acquire pointed secondary teeth through later E/C pairs.",
    recipe: "Axial framework with 5 shoot pairs. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Walnut", trajectory: 'tip',
    growth: {"family":"compound","shoots":6,"width":0.34,"spread":5,"start":0.16,"end":0.82,"profile":[1,1,0.55],"spacing":1,"tipRotation":25,"leafletWidth":0.14,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(6, polar(0.5, 0.45, 20), polar(0.5, 0.99, 0), 0.65, 0.012),
      stage(3, polar(0.5, 1.05, 0), polar(0.5, -0.12, 0), 0.7, 0.012),
      stage(0, polar(0.5, 0.1, 0), polar(0.5, 0.02, 0), 0.55, 0.014)
    ],
    smoothing: 0.95, reference: "Figure 6l",
    observation: "A strongly separated axial framework precedes the development of broad leaflets.",
    recipe: "Axial framework with 6 shoot pairs. Separate leaflets broaden around retained axes. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Ground ivy", trajectory: 'base',
    growth: {"family":"continuous","shoots":9,"width":0.75,"spread":155,"start":0.54,"end":0.8,"profile":[0.88,0.97,1],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":0.75},
    stages: [
      stage(6, polar(0.5, 0.45, 20), polar(0.5, 0.015, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.35, 0), polar(0.5, -0.12, 0), 0.7, 0.012),
      stage(2, polar(0.5, 0.35, 0), polar(0.5, 0.14, 0), 0.55, 0.014)
    ],
    smoothing: 1, reference: "Figure 6m",
    observation: "A compact radial head broadens while the long stem remains distinct.",
    recipe: "Radial framework with 9 rays per side. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  },
  {
    name: "Sycamore", trajectory: 'base',
    growth: {"family":"lobed","shoots":2,"width":1.04,"spread":98,"start":0.23,"end":0.8,"profile":[0.6,0.7,0.92],"spacing":1,"tipRotation":0,"leafletWidth":0.2,"secondaryPairs":0,"terminalScale":1},
    stages: [
      stage(2, polar(0.5, 0.45, 20), polar(0.5, 0.48, 0), 0.65, 0.012),
      stage(3, polar(0.5, 0.55, 0), polar(0.5, 0.06, 0), 0.7, 0.012),
      stage(1, polar(0.5, 0.45, 0), polar(0.5, 0.35, 0), 0.55, 0.014)
    ],
    smoothing: 0.08, reference: "Figure 6n",
    observation: "Broad radial lobes form first, followed by angular secondary subdivisions.",
    recipe: "Radial framework with 2 rays per side. Primary tips remain fixed while the connected blade develops. Later E/C cycles refine local margins with diminishing intensity."
  }
];
