// Extracted from the user-provided Grasshopper archives; do not hand-fit these values.
export const GRASSHOPPER_RECIPES = [
  {
    "name": "Buttercup",
    "seedHalfWidth": 0.1,
    "trajectory": "base",
    "stages": [
      {
        "cycles": 3.0,
        "positions": [
          0.123,
          0.5165732502937317,
          0.11350679397583008,
          0.5066757842616795,
          0.08076947563544737,
          0.5202884674072266,
          0.07269555330276489
        ],
        "intensities": [
          0.8621687293052673,
          0.9378069639205933,
          0.670550788918149,
          0.8744084944254261,
          0.6049906015396118,
          0.8437774181365967
        ],
        "rotation": 65.872,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.738,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.606,
        "firstStemIntensity": 0.606
      },
      {
        "cycles": 3.0,
        "positions": [
          0.2877224087715149,
          0.49304378032684326,
          0.3222665633124599,
          0.4740671310723787,
          0.2936587333679199,
          0.5069562196731567
        ],
        "intensities": [
          0.6097245216369629,
          0.7433628439903259,
          0.5604820593629223,
          0.7684207817331943,
          0.49056726694107056,
          0.666564404964447
        ],
        "rotation": 52.159,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 3.0,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.606,
        "firstStemIntensity": 0.606
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 1.6,
    "negativeWeight": 1.4,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 4",
    "source": "final/buttercup.gh",
    "sourceKey": "final--buttercup",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from final/buttercup.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "e729d559c16b76285f1fe94f28061080593d40f23ba918b64decf1186772e815",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        6.0,
        1.0
      ],
      [
        6.0,
        2.0
      ],
      [
        6.0,
        3.0
      ],
      [
        6.0,
        4.0
      ],
      [
        6.0,
        5.0
      ],
      [
        6.0,
        6.0
      ]
    ]
  },
  {
    "name": "Magnolia",
    "seedHalfWidth": 0.1,
    "trajectory": "tip",
    "stages": [
      {
        "cycles": 6.0,
        "positions": [
          0.13,
          0.025747239589691162,
          0.09347224235534668,
          0.06722383767782511,
          0.13790736494848987,
          0.11305604228164384,
          0.19024792159413256,
          0.1567787662843492,
          0.2666273424072754,
          0.18645041100387544,
          0.39040187018650785,
          0.20421576499938965,
          0.559299647808075
        ],
        "intensities": [
          0.07402455806732178,
          -0.35009765625,
          0.15495292258005297,
          -0.2916838881340317,
          0.2843514058885985,
          -0.210516930871257,
          0.470429662511598,
          -0.10970462569128914,
          0.6915839996474133,
          -0.013771548172273773,
          0.8539391756057739,
          -0.05328631401062012
        ],
        "rotation": 90.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.738,
        "minContractionLength": 1.5,
        "stemPosition": 0.8,
        "stemIntensity": 0.491,
        "firstStemIntensity": 0.8
      },
      {
        "cycles": 1.0,
        "positions": [
          0.13634812831878662,
          0.49304378032684326,
          0.30389107999303744,
          0.4740671310723787,
          0.2936587333679199,
          0.5069562196731567
        ],
        "intensities": [
          0.29445576667785645,
          0.19896596670150757,
          0.46956161844994815,
          0.23765441727178988,
          0.48312097787857056,
          0.2895853519439697
        ],
        "rotation": 52.159,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 2.0,
        "minContractionLength": 2.0,
        "stemPosition": 0.8,
        "stemIntensity": 0.491,
        "firstStemIntensity": 0.8
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 5.0,
    "negativeWeight": 2.0,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": null,
      "contractionIntensityMin": null,
      "contractionLRIntensity": false,
      "connectOrigins": true,
      "veinFollowsRounding": true,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6a",
    "source": "final/magnolia.gh",
    "sourceKey": "final--magnolia",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from final/magnolia.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "24d1ff4640ef5d76192ea4681fdcc3a8ede91ce26bf31e3b7a19292124a15948",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        9.0,
        0.0
      ],
      [
        10.0,
        0.0
      ],
      [
        11.0,
        0.0
      ],
      [
        12.0,
        0.0
      ],
      [
        12.0,
        1.0
      ],
      [
        12.0,
        2.0
      ]
    ]
  },
  {
    "name": "Ginkgo",
    "seedHalfWidth": 0.1,
    "trajectory": "base",
    "stages": [
      {
        "cycles": 15.0,
        "positions": [
          0.5,
          0.04724562168121338,
          0.062314510345458984,
          0.0754021942443923,
          0.05996772587185408,
          0.1004346757836822,
          0.05787636519779307,
          0.12138554637379946,
          0.056046557175431846,
          0.13727898483243242,
          0.05445526660461975,
          0.14747174386214798,
          0.053044689728275966,
          0.1520841594997635,
          0.0517320524143311,
          0.15212192187055817,
          0.050431978486710514,
          0.14907967855951754,
          0.049076715992820846,
          0.14438203917402687,
          0.04762370874651459,
          0.1390824524361976,
          0.04605239393733312,
          0.13384615399700273,
          0.044357140145890456,
          0.12905045799378168,
          0.04254088361202457,
          0.12488931087724553,
          0.04061078301796341,
          0.12144845724105835,
          0.03857564926147461
        ],
        "intensities": [
          1.7566765546798706,
          0.08011871576309204,
          1.5401975782177315,
          0.08046651025346814,
          1.4203885647862313,
          0.07989248535743136,
          1.3395403270175144,
          0.07818679233182119,
          1.2808375120218942,
          0.07508354429675848,
          1.2365129527003187,
          0.07027318358339377,
          1.2021568641625135,
          0.06348945526211659,
          1.1749201261462145,
          0.05477906581457885,
          1.1527737495574026,
          0.04494559327975492,
          1.1341454364152277,
          0.0355539356189421,
          1.117713043649212,
          0.027974252297716124,
          1.1022667450643904,
          0.022665244686538626,
          1.0865957949588583,
          0.019444094097206543,
          1.0693685512320532,
          0.01794017489095208,
          1.0489686727523804,
          0.01780414581298828
        ],
        "rotation": 6.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.517,
        "minContractionLength": null,
        "stemPosition": 0.9,
        "stemIntensity": 0.6,
        "firstStemIntensity": 0.6
      },
      {
        "cycles": 4.0,
        "positions": [
          0.0445103645324707,
          0.49304378032684326,
          0.040275460594682996,
          0.47530383440457497,
          0.040324567993040315,
          0.48201965707088407,
          0.04747772216796875,
          0.5069562196731567
        ],
        "intensities": [
          0.8931750655174255,
          0.0445103645324707,
          0.8899106496715357,
          0.04601922678130325,
          0.8864437441037204,
          0.04705624072913717,
          0.8902077078819275,
          0.0504450798034668
        ],
        "rotation": 8.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 5.0,
        "minContractionLength": null,
        "stemPosition": 0.9,
        "stemIntensity": 0.6,
        "firstStemIntensity": 0.6
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 1.0,
    "negativeWeight": 2.4,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6b",
    "source": "final/ginkgo.gh",
    "sourceKey": "final--ginkgo",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from final/ginkgo.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "4a777eb0001bf0b597cb902b8b5f0ac7721d305596c57db602e7a00f7f990b8f",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        9.0,
        0.0
      ],
      [
        10.0,
        0.0
      ],
      [
        11.0,
        0.0
      ],
      [
        12.0,
        0.0
      ],
      [
        13.0,
        0.0
      ],
      [
        14.0,
        0.0
      ],
      [
        15.0,
        0.0
      ],
      [
        16.0,
        0.0
      ],
      [
        17.0,
        0.0
      ],
      [
        18.0,
        0.0
      ],
      [
        19.0,
        0.0
      ],
      [
        20.0,
        0.0
      ],
      [
        21.0,
        0.0
      ],
      [
        22.0,
        0.0
      ],
      [
        23.0,
        0.0
      ],
      [
        24.0,
        0.0
      ],
      [
        25.0,
        0.0
      ],
      [
        26.0,
        0.0
      ],
      [
        27.0,
        0.0
      ],
      [
        28.0,
        0.0
      ],
      [
        29.0,
        0.0
      ],
      [
        30.0,
        0.0
      ],
      [
        30.0,
        1.0
      ],
      [
        30.0,
        2.0
      ],
      [
        30.0,
        3.0
      ],
      [
        30.0,
        4.0
      ],
      [
        30.0,
        5.0
      ],
      [
        30.0,
        6.0
      ],
      [
        30.0,
        7.0
      ],
      [
        30.0,
        8.0
      ]
    ]
  },
  {
    "name": "Date palm",
    "seedHalfWidth": 0.1,
    "trajectory": "tip",
    "stages": [
      {
        "cycles": 15.0,
        "positions": [
          0.15,
          0.5086953043937683,
          0.09124577045440674,
          0.5124786891276832,
          0.0893021725812912,
          0.5161001671717168,
          0.0866184813078356,
          0.5194077297120314,
          0.08389671477451728,
          0.5221730596049664,
          0.0820334415735061,
          0.5240930345300171,
          0.08187188705887627,
          0.5248530209881664,
          0.0839559215829479,
          0.5242627014915807,
          0.08845855044080708,
          0.5223646297971904,
          0.09527599723268762,
          0.5193955256082575,
          0.10416529301937442,
          0.5156519530452066,
          0.11484504785688729,
          0.5113910101087416,
          0.12704782627477873,
          0.5068010313899655,
          0.14054008767696624,
          0.5020097649636459,
          0.15512571338486808,
          0.4971012473106384,
          0.17064279317855835
        ],
        "intensities": [
          0.3181818127632141,
          0.9674974679946899,
          0.37614287060119345,
          0.9725665204087413,
          0.4313550066426053,
          0.9770851009810129,
          0.4836898521174275,
          0.9808604869787659,
          0.533127921407412,
          0.9836505775144285,
          0.5798021844095458,
          0.985185040017943,
          0.6240247163819533,
          0.9852290986373143,
          0.6662783994405282,
          0.9836863123541483,
          0.7071663786998557,
          0.9806769660220391,
          0.7473319893324072,
          0.9765102129838742,
          0.7873768286705554,
          0.9715641418649279,
          0.8278024859907683,
          0.9661737746625152,
          0.8689858332815846,
          0.9605848192912843,
          0.9111823615381,
          0.9549578709474054,
          0.9545454382896423,
          0.9493903517723083
        ],
        "rotation": 45.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.0,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.8,
        "firstStemIntensity": 0.8
      },
      {
        "cycles": 2.0,
        "positions": [
          0.06214529275894165,
          2.3606442212556296e-20,
          0.2411596179008484,
          0.05153489112854004
        ],
        "intensities": [
          0.03761059045791626,
          0.0,
          0.06926196813583374,
          0.0
        ],
        "rotation": 60.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.0,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.8,
        "firstStemIntensity": 0.8
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 4.2,
    "negativeWeight": 2.8,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6c",
    "source": "date_palm.gh",
    "sourceKey": "date_palm",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from date_palm.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "7c6fe62cadc810576a13b75d37c994772df9cd48a4872373c1b3b6a84d5e526f",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        9.0,
        0.0
      ],
      [
        10.0,
        0.0
      ],
      [
        11.0,
        0.0
      ],
      [
        12.0,
        0.0
      ],
      [
        13.0,
        0.0
      ],
      [
        14.0,
        0.0
      ],
      [
        15.0,
        0.0
      ],
      [
        16.0,
        0.0
      ],
      [
        17.0,
        0.0
      ],
      [
        18.0,
        0.0
      ],
      [
        19.0,
        0.0
      ],
      [
        20.0,
        0.0
      ],
      [
        21.0,
        0.0
      ],
      [
        22.0,
        0.0
      ],
      [
        23.0,
        0.0
      ],
      [
        24.0,
        0.0
      ],
      [
        25.0,
        0.0
      ],
      [
        26.0,
        0.0
      ],
      [
        27.0,
        0.0
      ],
      [
        28.0,
        0.0
      ],
      [
        29.0,
        0.0
      ],
      [
        30.0,
        0.0
      ],
      [
        30.0,
        1.0
      ],
      [
        30.0,
        2.0
      ],
      [
        30.0,
        3.0
      ],
      [
        30.0,
        4.0
      ]
    ]
  },
  {
    "name": "American ash",
    "seedHalfWidth": 0.1,
    "trajectory": "tip",
    "stages": [
      {
        "cycles": 3.0,
        "positions": [
          0.18,
          0.48142874240875244,
          0.24776732921600342,
          0.5021784805398753,
          0.33160815273358596,
          0.5100001692771912,
          0.41046762466430664
        ],
        "intensities": [
          0.35602736473083496,
          0.9713541269302368,
          0.5702423254805036,
          0.9693254964005529,
          0.6320726871490479,
          0.9409604072570801
        ],
        "rotation": 83.538,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.738,
        "minContractionLength": 2.0,
        "stemPosition": 0.8,
        "stemIntensity": 0.9,
        "firstStemIntensity": 0.9
      },
      {
        "cycles": 3.0,
        "positions": [
          0.23785752058029175,
          0.12573951482772827,
          0.23384271358644507,
          0.11567923977415649,
          0.26872628927230835,
          0.13167494535446167
        ],
        "intensities": [
          0.24232620000839233,
          -0.11634492874145508,
          0.5096957691286579,
          -0.11932690669178092,
          0.8154537677764893,
          -0.0221022367477417
        ],
        "rotation": 64.14,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.0,
        "minContractionLength": 1.0,
        "stemPosition": 0.8,
        "stemIntensity": 0.9,
        "firstStemIntensity": 0.9
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 14.2,
    "negativeWeight": 4.9,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": -1,
      "contractionIntensityMin": -1,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": true,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6d",
    "source": "ash.gh",
    "sourceKey": "ash",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from ash.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "20f961868db1fceca8aaf3dc20f1de22242d32e969195d1a354e722ffccbe130",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        6.0,
        1.0
      ],
      [
        6.0,
        2.0
      ],
      [
        6.0,
        3.0
      ],
      [
        6.0,
        4.0
      ],
      [
        6.0,
        5.0
      ],
      [
        6.0,
        6.0
      ]
    ]
  },
  {
    "name": "Holly",
    "seedHalfWidth": 0.1,
    "trajectory": "tip",
    "stages": [
      {
        "cycles": 6.0,
        "positions": [
          0.2,
          0.18081092834472656,
          0.1498439908027649,
          0.23418555073375824,
          0.1806474338417327,
          0.2872756635835324,
          0.24038602034300405,
          0.3210363526373922,
          0.3420647938247467,
          0.33109240380723315,
          0.4582910252828137,
          0.3282673954963684,
          0.5505393147468567
        ],
        "intensities": [
          0.2597101926803589,
          0.14377671480178833,
          0.4820498790613941,
          0.14593285216912136,
          0.6685290161696861,
          0.15981157833518328,
          0.7835791977020153,
          0.1725455401443692,
          0.8376497236190228,
          0.1625113516966582,
          0.8703854084014893,
          0.11528301239013672
        ],
        "rotation": 100.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 2.0,
        "minContractionLength": 1.5,
        "stemPosition": 0.8,
        "stemIntensity": 0.492,
        "firstStemIntensity": 0.7
      },
      {
        "cycles": 1.0,
        "positions": [
          0.2995941638946533,
          0.49304378032684326,
          0.3237076881692391,
          0.4740671310723787,
          0.2936587333679199,
          0.5069562196731567
        ],
        "intensities": [
          0.4353342056274414,
          0.4590427279472351,
          0.6430054697996401,
          0.27587174405749715,
          0.5439397692680359,
          0.2895853519439697
        ],
        "rotation": 86.811,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 2.5,
        "minContractionLength": 0.5,
        "stemPosition": 0.8,
        "stemIntensity": 0.492,
        "firstStemIntensity": 0.7
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 12.0,
    "negativeWeight": 2.0,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6f",
    "source": "final/holly_new.gh",
    "sourceKey": "final--holly_new",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from final/holly_new.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "eb9c39b0cd736b0b7f18255016a33e2043fdf1cddd41c41cfedd0eef70789cc8",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        9.0,
        0.0
      ],
      [
        10.0,
        0.0
      ],
      [
        11.0,
        0.0
      ],
      [
        12.0,
        0.0
      ],
      [
        12.0,
        1.0
      ],
      [
        12.0,
        2.0
      ]
    ]
  },
  {
    "name": "Maple",
    "seedHalfWidth": 0.1,
    "trajectory": "base",
    "stages": [
      {
        "cycles": 4.0,
        "positions": [
          0.35,
          0.5486202239990234,
          0.041543006896972656,
          0.5532503757335018,
          0.052622266208113846,
          0.5246419343032572,
          0.07916405916544318,
          0.4788110852241516,
          0.08308607339859009
        ],
        "intensities": [
          0.6320474743843079,
          0.3702701926231384,
          0.6434037168100599,
          0.3481834046581484,
          0.6271535257489167,
          0.3854872937967645,
          0.5244843363761902,
          0.33940237760543823
        ],
        "rotation": 50.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.0,
        "minContractionLength": null,
        "stemPosition": 1.0,
        "stemIntensity": 0.8,
        "firstStemIntensity": 0.8
      },
      {
        "cycles": 2.0,
        "positions": [
          0.5548529028892517,
          0.21107196807861328,
          0.4943034052848816,
          0.22071903944015503
        ],
        "intensities": [
          0.7146921157836914,
          0.45261943340301514,
          0.4943755269050598,
          0.4130427837371826
        ],
        "rotation": 80.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.3,
        "minContractionLength": null,
        "stemPosition": 0.5,
        "stemIntensity": 0.0,
        "firstStemIntensity": 0.0
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 10.0,
    "negativeWeight": 0.7,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "axis",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6e",
    "source": "maple_new.gh",
    "sourceKey": "maple_new",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from maple_new.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "c609ecd341b60c82507ba1ca84ecaf588f96228a44183da75bb06f6e6f2f9d67",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        8.0,
        1.0
      ],
      [
        8.0,
        2.0
      ],
      [
        8.0,
        3.0
      ],
      [
        8.0,
        4.0
      ]
    ]
  },
  {
    "name": "Larkspur",
    "seedHalfWidth": 0.1,
    "trajectory": "base",
    "stages": [
      {
        "cycles": 2.0,
        "positions": [
          0.553,
          0.5165732502937317,
          0.04301387071609497,
          0.5202884674072266,
          0.1802898645401001
        ],
        "intensities": [
          0.44015783071517944,
          0.9625023007392883,
          0.6645461320877075,
          0.8509008288383484
        ],
        "rotation": 70.282,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.738,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.826,
        "firstStemIntensity": 0.826
      },
      {
        "cycles": 2.0,
        "positions": [
          0.24023258686065674,
          0.49304378032684326,
          0.29217439889907837,
          0.5069562196731567
        ],
        "intensities": [
          0.5730313062667847,
          0.8000012636184692,
          0.48312097787857056,
          0.49257421493530273
        ],
        "rotation": 38.71,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.5,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.3,
        "firstStemIntensity": 0.3
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 1.0,
    "negativeWeight": 4.0,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": true,
      "vectorMode": "edge",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6g",
    "source": "final/LAKSPUR.gh",
    "sourceKey": "final--LAKSPUR",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from final/LAKSPUR.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "563642a259a3e891aec501b320c292353188c38e191474796c310d1061cad68f",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        4.0,
        1.0
      ],
      [
        4.0,
        2.0
      ],
      [
        4.0,
        3.0
      ],
      [
        4.0,
        4.0
      ]
    ]
  },
  {
    "name": "Saw palmetto",
    "seedHalfWidth": 0.05,
    "trajectory": "base",
    "stages": [
      {
        "cycles": 12.0,
        "positions": [
          0.343,
          0.4924625754356384,
          0.004429042339324951,
          0.49646846320032567,
          0.0034457248046650605,
          0.4996014020329394,
          0.002555197349306098,
          0.50174410673898,
          0.0017833419160543035,
          0.5028446425194145,
          0.0011542501020341699,
          0.5030474976286147,
          0.0006814618171449178,
          0.5028732438719082,
          0.00035971006016424344,
          0.5032206619388823,
          0.0001645318173020287,
          0.5049540917164015,
          6.123721020569554e-05,
          0.508458495202536,
          1.592353760077602e-05,
          0.5136597175449699,
          1.7466754821932331e-06,
          0.5202884674072266,
          0.0
        ],
        "intensities": [
          1.0,
          0.6478262543678284,
          0.9985887569689672,
          0.687268272971917,
          0.9964762026288819,
          0.7189654643566697,
          0.9927221286292154,
          0.7389278165603517,
          0.9870087824436007,
          0.7414031456423888,
          0.9793351641365096,
          0.7220304905689817,
          0.9698315278357242,
          0.6866542825147292,
          0.9586687356336876,
          0.6494910181126182,
          0.9460189418376009,
          0.6190262263988964,
          0.9320405134273724,
          0.5967241473616456,
          0.9168736386003654,
          0.5816287610608438,
          0.9006403684616089,
          0.5724637508392334
        ],
        "rotation": 12.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.738,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.8,
        "firstStemIntensity": 0.8
      },
      {
        "cycles": 1.0,
        "positions": [
          0.7002899646759033,
          0.880731999874115,
          0.3723485734067934,
          0.8165939001372636,
          0.2936587333679199,
          0.5069562196731567
        ],
        "intensities": [
          0.19969779253005981,
          -1.0,
          0.6177497226880685,
          -0.9768984040393061,
          0.48312097787857056,
          -1.0
        ],
        "rotation": 60.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.5,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.1,
        "firstStemIntensity": 0.1
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 8.0,
    "negativeWeight": 1.0,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": true,
      "vectorMode": "tipDistance",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6h",
    "source": "final/sabal.gh",
    "sourceKey": "final--sabal",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from final/sabal.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "d9d6724e333b98fe845bc87345b5b43dc4a5b729500f6b237a2ba1b642ae23da",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        9.0,
        0.0
      ],
      [
        10.0,
        0.0
      ],
      [
        11.0,
        0.0
      ],
      [
        12.0,
        0.0
      ],
      [
        13.0,
        0.0
      ],
      [
        14.0,
        0.0
      ],
      [
        15.0,
        0.0
      ],
      [
        16.0,
        0.0
      ],
      [
        17.0,
        0.0
      ],
      [
        18.0,
        0.0
      ],
      [
        19.0,
        0.0
      ],
      [
        20.0,
        0.0
      ],
      [
        21.0,
        0.0
      ],
      [
        22.0,
        0.0
      ],
      [
        23.0,
        0.0
      ],
      [
        24.0,
        0.0
      ],
      [
        24.0,
        1.0
      ],
      [
        24.0,
        2.0
      ]
    ]
  },
  {
    "name": "Fig",
    "seedHalfWidth": 0.1,
    "trajectory": "base",
    "stages": [
      {
        "cycles": 3.0,
        "positions": [
          0.247,
          0.5086953043937683,
          0.08041340112686157,
          0.5242627014915807,
          0.07536171697114243,
          0.4971012473106384,
          0.0
        ],
        "intensities": [
          0.5865451097488403,
          0.69561767578125,
          0.6332079481879279,
          0.6572840445503287,
          0.47328507900238037,
          0.6635618209838867
        ],
        "rotation": 64.895,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.0,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.503,
        "firstStemIntensity": 0.503
      },
      {
        "cycles": 4.0,
        "positions": [
          0.28475290536880493,
          0.07379591464996338,
          0.23124685529895567,
          0.12103141162371162,
          0.2139573510500451,
          0.1564911011909286,
          0.26694566011428833,
          0.1702597737312317
        ],
        "intensities": [
          0.33515143394470215,
          0.4300893545150757,
          0.539832482768893,
          0.2510760085604913,
          0.6836208062724647,
          0.19734520225927232,
          0.5911902189254761,
          0.2084355354309082
        ],
        "rotation": 85.879,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 2.404,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.091,
        "firstStemIntensity": 0.091
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 1.3,
    "negativeWeight": 1.0,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6i",
    "source": "fig.gh",
    "sourceKey": "fig",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from fig.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "866a88ceed434ce8ebe5b0b6535927a30ee811c7b2ea547ceb1c41d76f63335c",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        6.0,
        1.0
      ],
      [
        6.0,
        2.0
      ],
      [
        6.0,
        3.0
      ],
      [
        6.0,
        4.0
      ],
      [
        6.0,
        5.0
      ],
      [
        6.0,
        6.0
      ],
      [
        6.0,
        7.0
      ],
      [
        6.0,
        8.0
      ]
    ]
  },
  {
    "name": "Fern",
    "seedHalfWidth": 0.1,
    "trajectory": "tip",
    "stages": [
      {
        "cycles": 8.0,
        "positions": [
          0.18,
          0.48142874240875244,
          0.20178043842315674,
          0.48957354947830123,
          0.25085959954215814,
          0.4962571532828457,
          0.28653866998914224,
          0.5007875008801911,
          0.30643179838667356,
          0.5031599013165324,
          0.3119873247188753,
          0.5047989562589648,
          0.3121059135806012,
          0.5069768626507072,
          0.3187616019310585,
          0.5100001692771912,
          0.33827894926071167
        ],
        "intensities": [
          0.3145400285720825,
          0.9713541269302368,
          0.3114162248747016,
          0.9676895496646862,
          0.30972261839342347,
          0.9648404325580979,
          0.31033280579740863,
          0.9632639816640554,
          0.3135623370986374,
          0.9631089249454474,
          0.31811397659790863,
          0.9636841603575628,
          0.3225593718332227,
          0.9642069371410975,
          0.3264094591140747,
          0.9643917083740234
        ],
        "rotation": 100.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.2,
        "minContractionLength": 0.2,
        "stemPosition": 0.8,
        "stemIntensity": 0.9,
        "firstStemIntensity": 0.9
      },
      {
        "cycles": 6.0,
        "positions": [
          0.13649851083755493,
          0.12573951482772827,
          0.21492141217804747,
          0.11695224016381534,
          0.2490488359722861,
          0.11414294686506411,
          0.26219250918020964,
          0.11892093377653862,
          0.27647819415104236,
          0.12676096325610753,
          0.3056379556655884,
          0.13167494535446167
        ],
        "intensities": [
          0.36201781034469604,
          0.934718132019043,
          0.3539004417135058,
          0.9353119242633776,
          0.34029360635201616,
          0.9373483444576591,
          0.3259956407797872,
          0.9412267431380978,
          0.31664953975676724,
          0.9468825605520224,
          0.3145400881767273,
          0.9525222778320312
        ],
        "rotation": 75.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.05,
        "minContractionLength": 0.3,
        "stemPosition": 0.8,
        "stemIntensity": 0.9,
        "firstStemIntensity": 0.9
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 14.2,
    "negativeWeight": 4.9,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": -1,
      "contractionIntensityMin": -1,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": true,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6j",
    "source": "final/fern.gh",
    "sourceKey": "final--fern",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from final/fern.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "77cbd94de92c3036d32e22702ecc8295301ce9b5bf09c82a6accf76157356a70",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        9.0,
        0.0
      ],
      [
        10.0,
        0.0
      ],
      [
        11.0,
        0.0
      ],
      [
        12.0,
        0.0
      ],
      [
        13.0,
        0.0
      ],
      [
        14.0,
        0.0
      ],
      [
        15.0,
        0.0
      ],
      [
        16.0,
        0.0
      ],
      [
        16.0,
        1.0
      ],
      [
        16.0,
        2.0
      ],
      [
        16.0,
        3.0
      ],
      [
        16.0,
        4.0
      ],
      [
        16.0,
        5.0
      ],
      [
        16.0,
        6.0
      ],
      [
        16.0,
        7.0
      ],
      [
        16.0,
        8.0
      ],
      [
        16.0,
        9.0
      ],
      [
        16.0,
        10.0
      ],
      [
        16.0,
        11.0
      ],
      [
        16.0,
        12.0
      ]
    ]
  },
  {
    "name": "White oak",
    "seedHalfWidth": 0.1,
    "trajectory": "tip",
    "stages": [
      {
        "cycles": 4.0,
        "positions": [
          0.123,
          0.1318836808204651,
          0.1304348111152649,
          0.16926232595391943,
          0.1872485931851942,
          0.23268852239354387,
          0.2666683507864817,
          0.28098464012145996,
          0.27155953645706177
        ],
        "intensities": [
          0.18260610103607178,
          0.6538183093070984,
          0.31983553736187137,
          0.6354855554550162,
          0.5651089322640359,
          0.4952917029565377,
          0.663576066493988,
          0.39737337827682495
        ],
        "rotation": 65.872,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.517,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.279,
        "firstStemIntensity": 0.279
      },
      {
        "cycles": 2.0,
        "positions": [
          0.2877224087715149,
          0.49304378032684326,
          0.18977421522140503,
          0.5069562196731567
        ],
        "intensities": [
          0.7029696702957153,
          0.6192961931228638,
          0.48312097787857056,
          0.543320894241333
        ],
        "rotation": 65.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 2.5,
        "minContractionLength": null,
        "stemPosition": 1,
        "stemIntensity": 0.611,
        "firstStemIntensity": 0.611
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 1.0,
    "negativeWeight": 1.2,
    "rounding": false,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": true
    },
    "reference": "Figure 5",
    "source": "oak.gh",
    "sourceKey": "oak",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from oak.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "98676242f03b329700e5e912e6b08b66cfa487f661bf3109fd51807e0208c5bb",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        8.0,
        1.0
      ],
      [
        8.0,
        2.0
      ],
      [
        8.0,
        3.0
      ],
      [
        8.0,
        4.0
      ]
    ]
  },
  {
    "name": "Red oak",
    "seedHalfWidth": 0.1,
    "trajectory": "tip",
    "stages": [
      {
        "cycles": 4.0,
        "positions": [
          0.2,
          0.05911916494369507,
          0.18399977684020996,
          0.23460374571568404,
          0.2761381571413987,
          0.32413322122576704,
          0.38797231129590615,
          0.3282673954963684,
          0.3991876244544983
        ],
        "intensities": [
          0.23984968662261963,
          0.40212172269821167,
          0.4572096757074997,
          0.5458847389175816,
          0.7217690606903144,
          0.5673722983597436,
          0.6817220449447632,
          0.48048025369644165
        ],
        "rotation": 90.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.0,
        "minContractionLength": 1.0,
        "stemPosition": 0.9,
        "stemIntensity": 0.447,
        "firstStemIntensity": 0.5
      },
      {
        "cycles": 1.0,
        "positions": [
          0.5889856815338135,
          0.49304378032684326,
          0.4979928532732142,
          0.4740671310723787,
          0.24320030212402344,
          0.5069562196731567
        ],
        "intensities": [
          0.37909120321273804,
          0.6402814388275146,
          0.36576924483187323,
          0.5311618601214784,
          0.2297566533088684,
          0.7100603580474854
        ],
        "rotation": 135.206,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.5,
        "minContractionLength": 0.2,
        "stemPosition": 0.9,
        "stemIntensity": 0.21,
        "firstStemIntensity": 0.5
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 8.0,
    "negativeWeight": 1.0,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6k",
    "source": "red oak.gh",
    "sourceKey": "red oak",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from red oak.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "02262bb6d0336a0bd1d14659769b2d017c691eed25544bcd22ba127bf0e23a29",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        8.0,
        1.0
      ],
      [
        8.0,
        2.0
      ]
    ]
  },
  {
    "name": "Walnut",
    "seedHalfWidth": 0.1,
    "trajectory": "tip",
    "stages": [
      {
        "cycles": 8.0,
        "positions": [
          0.18,
          0.48142874240875244,
          0.19201308488845825,
          0.48957354947830123,
          0.22726789993662444,
          0.4962571532828457,
          0.31379132218941397,
          0.5007875008801911,
          0.44524994699692755,
          0.5031599013165324,
          0.6093193002144319,
          0.5047989562589648,
          0.7841589431608637,
          0.5069768626507072,
          0.9333934349603885,
          0.5100001692771912,
          1.0
        ],
        "intensities": [
          0.2624253034591675,
          0.9713541269302368,
          0.38763946974309815,
          0.9771690535114945,
          0.5225606105582747,
          0.9783426777236097,
          0.6681291844395643,
          0.9736813860401763,
          0.8237948500842477,
          0.9641752143311637,
          0.9859026089186511,
          0.9538015636745654,
          1.14724839629509,
          0.9458083923566665,
          1.3000006675720215,
          0.9409604072570801
        ],
        "rotation": 100.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.5,
        "minContractionLength": 0.5,
        "stemPosition": 0.8,
        "stemIntensity": 0.9,
        "firstStemIntensity": 0.9
      },
      {
        "cycles": 3.0,
        "positions": [
          0.10251164436340332,
          0.12573951482772827,
          0.1297210855471163,
          0.11567923977415649,
          0.1994195580482483,
          0.13167494535446167
        ],
        "intensities": [
          0.18405985832214355,
          -0.36573123931884766,
          0.4309255049481584,
          -0.15668188408006534,
          0.6854599714279175,
          -0.0221022367477417
        ],
        "rotation": 64.14,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.0,
        "minContractionLength": 1.0,
        "stemPosition": 0.8,
        "stemIntensity": 0.9,
        "firstStemIntensity": 0.9
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 14.2,
    "negativeWeight": 4.9,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": -1,
      "contractionIntensityMin": -1,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": true,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6l",
    "source": "final/walnut.gh",
    "sourceKey": "final--walnut",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from final/walnut.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "546453cce4a6db8371c6392dc130f6d5eb568fd281c4221d1077c4ee040482a8",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        9.0,
        0.0
      ],
      [
        10.0,
        0.0
      ],
      [
        11.0,
        0.0
      ],
      [
        12.0,
        0.0
      ],
      [
        13.0,
        0.0
      ],
      [
        14.0,
        0.0
      ],
      [
        15.0,
        0.0
      ],
      [
        16.0,
        0.0
      ],
      [
        16.0,
        1.0
      ],
      [
        16.0,
        2.0
      ],
      [
        16.0,
        3.0
      ],
      [
        16.0,
        4.0
      ],
      [
        16.0,
        5.0
      ],
      [
        16.0,
        6.0
      ]
    ]
  },
  {
    "name": "Ground ivy",
    "seedHalfWidth": 0.1,
    "trajectory": "base",
    "stages": [
      {
        "cycles": 7.0,
        "positions": [
          0.651,
          0.4924625754356384,
          0.004429042339324951,
          0.49914519138395536,
          0.00660585105915785,
          0.502590731092171,
          0.01705347037118263,
          0.5029573456798302,
          0.03329408616231931,
          0.5036136515159916,
          0.049328035010734184,
          0.50921372741491,
          0.06002312794262582,
          0.5202884674072266,
          0.06388610601425171
        ],
        "intensities": [
          0.9803327918052673,
          0.17431819438934326,
          0.9597502404266237,
          0.1589080958023555,
          0.9286681543793912,
          0.14973378141710708,
          0.8949426953198134,
          0.1521190654513045,
          0.862881246282408,
          0.16701179641485958,
          0.8342193302473333,
          0.1873136171440179,
          0.8094186782836914,
          0.20770972967147827
        ],
        "rotation": 23.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.738,
        "minContractionLength": null,
        "stemPosition": 0.9,
        "stemIntensity": 0.8,
        "firstStemIntensity": 0.8
      },
      {
        "cycles": 1.0,
        "positions": [
          0.7420291900634766,
          0.880731999874115,
          0.3774153419329994,
          0.8165939001372636,
          0.2936587333679199,
          0.5069562196731567
        ],
        "intensities": [
          0.9721587300300598,
          -1.0,
          0.730800397130976,
          -0.9768984040393061,
          0.48312097787857056,
          -1.0
        ],
        "rotation": 66.772,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 0.5,
        "minContractionLength": null,
        "stemPosition": 0.9,
        "stemIntensity": 0.028,
        "firstStemIntensity": 0.028
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 1.0,
    "negativeWeight": 1.0,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": true,
      "vectorMode": "tipDistance",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6m",
    "source": "ground_ıvy.gh",
    "sourceKey": "ground_ıvy",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from ground_ıvy.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "268bf14f0cee0245817615ebfe74dffcff77e84a9db03efede4143d2ecf0a54b",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        7.0,
        0.0
      ],
      [
        8.0,
        0.0
      ],
      [
        9.0,
        0.0
      ],
      [
        10.0,
        0.0
      ],
      [
        11.0,
        0.0
      ],
      [
        12.0,
        0.0
      ],
      [
        13.0,
        0.0
      ],
      [
        14.0,
        0.0
      ],
      [
        14.0,
        1.0
      ],
      [
        14.0,
        2.0
      ]
    ]
  },
  {
    "name": "Sycamore",
    "seedHalfWidth": 0.1,
    "trajectory": "base",
    "stages": [
      {
        "cycles": 3.0,
        "positions": [
          0.3,
          0.5904116630554199,
          0.2032930850982666,
          0.3824379347367593,
          0.0844729624536631,
          0.29582589864730835,
          0.01333397626876831
        ],
        "intensities": [
          0.566375732421875,
          0.4315318465232849,
          0.45642737824456564,
          0.2877038386590549,
          0.4205331802368164,
          0.29195237159729004
        ],
        "rotation": 60.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.0,
        "minContractionLength": null,
        "stemPosition": 1.0,
        "stemIntensity": 0.8,
        "firstStemIntensity": 0.8
      },
      {
        "cycles": 4.0,
        "positions": [
          0.4358900785446167,
          0.21107196807861328,
          0.38741688614277026,
          0.20881855103211444,
          0.3390196412612879,
          0.21616245898483621,
          0.47293221950531006,
          0.22071903944015503
        ],
        "intensities": [
          0.6386663317680359,
          0.21712958812713623,
          0.5488148023246158,
          0.280933473467472,
          0.5153028315701794,
          0.3367808961914944,
          0.4059392809867859,
          0.4130427837371826
        ],
        "rotation": 120.0,
        "expansion": {
          "position": 1,
          "intensity": 1
        },
        "contraction": {
          "position": 1,
          "intensity": 1
        },
        "minExpansionLength": 1.0,
        "minContractionLength": null,
        "stemPosition": 0.5,
        "stemIntensity": 0.0,
        "firstStemIntensity": 0.0
      }
    ],
    "bladeContinue": false,
    "positiveWeight": 10.0,
    "negativeWeight": 0.7,
    "rounding": true,
    "roundPosition": 0.5,
    "leftRightPosition": 0.5,
    "leftRightIntensity": 0.5,
    "variant": {
      "firstRotationFull": false,
      "vectorMode": "edge",
      "contractionPositionMin": 0,
      "contractionIntensityMin": 0,
      "contractionLRIntensity": true,
      "connectOrigins": true,
      "veinFollowsRounding": false,
      "veinAtControlPoint": false
    },
    "reference": "Figure 6n",
    "source": "sycamore.gh",
    "sourceKey": "sycamore",
    "observation": "Saved Grasshopper parameters, including the generation-dependent Graph Mapper schedules.",
    "recipe": "Ported from sycamore.gh. Original endpoint polarity, local phase changes, stem rules, and rational rounding are retained.",
    "scriptHash": "3e0094dc3220dd82a958168b0e83de5d0e69daf51a6bf480f81b020c5cd1fe16",
    "sourceFrames": [
      [
        1.0,
        0.0
      ],
      [
        2.0,
        0.0
      ],
      [
        3.0,
        0.0
      ],
      [
        4.0,
        0.0
      ],
      [
        5.0,
        0.0
      ],
      [
        6.0,
        0.0
      ],
      [
        6.0,
        1.0
      ],
      [
        6.0,
        2.0
      ],
      [
        6.0,
        3.0
      ],
      [
        6.0,
        4.0
      ],
      [
        6.0,
        5.0
      ],
      [
        6.0,
        6.0
      ],
      [
        6.0,
        7.0
      ],
      [
        6.0,
        8.0
      ]
    ]
  }
];
