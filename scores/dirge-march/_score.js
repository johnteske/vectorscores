/**
 * TODO proto globjects are combined into phrases, not directly used
 */
var score = (function(score) {
    // TODO stashing is a quick fix--create independent layers
    function clone(o) {
        return JSON.parse(JSON.stringify(o));
    }

    function getUniqueGlobject(array) {
        var i = Math.floor(VS.getRandExcl(0, array.length));
        return array.splice(i, 1);
    }

    /**
     * dirge
     */
    var descending = globjects.filter(function(g) {
        return g.contour === "descending";
    });

    // A
    // mm 1
    var stashedEvent = {}
    stashedEvent.time = 0;
    stashedEvent.pitched = {
        duration: 46.67,
        globjects: getUniqueGlobject(descending),
        pitch: [
            {
                time: 0,
                classes: [0]
            },
            {
                time: 1,
                classes: [0, 3]
            }
        ],
        phraseType: "",
        dynamics: [
            { time: 0, value: "pp" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: "p" },
            { time: 0.75, value: ">" },
            { time: 1, value: "pp" }
        ]
    };
    stashedEvent.percussion = {
        tempo: 0
    };
    score.push(stashedEvent);

    // mm 2
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 16;
    stashedEvent.percussion = {
        tempo: 60,
        rhythmRange: [0, 1],
        dynamics: [
            { time: 0, value: "n" },
            { time: 0.5, value: "<" },
            { time: 1, value: "ppp" }
        ]
    };
    score.push(stashedEvent);

    // mm 3
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 46.667;
    stashedEvent.pitched =  {
        duration: 46.67,
        globjects: getUniqueGlobject(descending),
        pitch: [
            {
                time: 0,
                classes: [0, 3]
            },
            {
                time: 1,
                classes: [0, 3, 7]
            }
        ],
        phraseType: "",
        dynamics: [
            { time: 0, value: "p" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: "pp" },
            { time: 0.75, value: ">" },
            { time: 1, value: "p" }
        ]
    };
    score.push(stashedEvent);

    // mm 4
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 48;
    stashedEvent.percussion = {
        tempo: 60,
        rhythmRange: [0, 3],
        dynamics: [
            { time: 0, value: "ppp" },
            { time: 0.5, value: "<" },
            { time: 1, value: "p" }
        ]
    };
    score.push(stashedEvent);

    // mm 5
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 80;
    stashedEvent.percussion = {
        tempo: 60,
        rhythmRange: [0, 4],
        dynamics: [
            { time: 0, value: "p" },
            { time: 0.5, value: "<" },
            { time: 1, value: "mf" }
        ]
    };
    score.push(stashedEvent);

    // mm 6
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 85.333,
    stashedEvent.pitched =  {
        duration: 46.67,
        globjects: getUniqueGlobject(descending),
        pitch: [
            {
                time: 0,
                classes: [0, 3, 7]
            }
        ],
        phraseType: "descending",
        dynamics: [
            { time: 0, value: "mp" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: "mf" },
            { time: 0.75, value: ">" },
            { time: 1, value: "pp" }
        ]
    };
    score.push(stashedEvent);

    // B
    // mm 7
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 112;
    stashedEvent.percussion = {
        tempo: 0
    };
    score.push(stashedEvent);

    // mm 8
    var rest = 3;
    stashedEvent = {}
    stashedEvent.time = 144;
    stashedEvent.pitched = {
        duration: rest,
        globjects: [],
        pitch: [],
        phraseType: "rest"
    };
    stashedEvent.percussion = {
        tempo: 0
    };
    score.push(stashedEvent);

    /**
     *
     */
    var ascending = globjects.filter(function(g) {
        return g.contour === "ascending";
    });

    // mm 9
    stashedEvent = {};
    stashedEvent.time = 144 + rest;
    stashedEvent.pitched = {
        duration: 96,
        globjects: [VS.getItem(ascending)],
        pitch: [
            {
                time: 0,
                classes: [5]
            },
            {
                time: 0.5,
                classes: [5, 9]
            },
            {
                time: 1,
                classes: [5, 9, 0]
            }
        ],
        phraseType: "ascending",
        dynamics: [
            { time: 0, value: "n" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: "p" },
            { time: 0.75, value: ">" },
            { time: 1, value: "n" }
        ]
    };
    stashedEvent.percussion = {
        tempo: 0
    };
    score.push(stashedEvent);

    /**
     * march
     * TODO select multiple (will need to pass all score events as array)
     */

    // C
    // mm 10
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 208;
    stashedEvent.percussion = {
        tempo: 120,
        rhythmRange: [5, 8],
        dynamics: [
            { time: 0, value: "mf" },
            { time: 0.5, value: "<" },
            { time: 1, value: "f" }
        ]
    };
    score.push(stashedEvent);

    var allGlobjects = globjects.concat(retrogradeGlobjects);

    // mm 11
    stashedEvent = {};
    stashedEvent.time = 240 + rest;
    stashedEvent.pitched = {
        duration: 24,
        globjects: getUniqueGlobject(allGlobjects),
        pitch: [
            {
                time: 0,
                classes: [0]
            },
            {
                time: 1,
                classes: [0, 3]
            }
        ],
        phraseType: "both",
        dynamics: [
            { time: 0, value: "mf" },
            { time: 0.5, value: ">" },
            { time: 1, value: "p" }
        ]
    };
    stashedEvent.percussion = {
        tempo: 120,
        rhythmRange: [5, 10],
        dynamics: [
            { time: 0, value: "f" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: "ff" },
            { time: 0.75, value: ">" },
            { time: 1, value: "ff" }
        ]
    };
    score.push(stashedEvent);

    // mm 12
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 264 + rest;
    stashedEvent.pitched =  {
        duration: 24,
        globjects: getUniqueGlobject(allGlobjects),
        pitch: [
            {
                time: 0,
                classes: [0, 3]
            },
            {
                time: 1,
                classes: [0, 3, 7]
            }
        ],
        phraseType: "both",
        dynamics: [
            { time: 0, value: "f" },
            { time: 0.5, value: ">" },
            { time: 1, value: "mp" }
        ]
    };
    score.push(stashedEvent);

    // mm 13
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 272 + rest;
    stashedEvent.percussion = {
        tempo: 120,
        rhythmRange: [0, 10],
        dynamics: [
            { time: 0, value: "f" },
            { time: 0.5, value: ">" },
            { time: 1, value: "mf" }
        ]
    };
    score.push(stashedEvent);

    // mm 14
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 288 + rest;
    stashedEvent.pitched =  {
        duration: 24,
        globjects: getUniqueGlobject(allGlobjects),
        pitch: [
            {
                time: 0,
                classes: [0, 3]
            },
            {
                time: 1,
                classes: [0, 3, 7]
            }
        ],
        phraseType: "both",
        dynamics: [
            { time: 0, value: "f" },
            { time: 0.5, value: ">" },
            { time: 1, value: "mf" }
        ]
    };
    score.push(stashedEvent);

    // mm 15
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 304;
    stashedEvent.percussion = {
        tempo: 0
    };
    score.push(stashedEvent);

    // mm 16
    stashedEvent = {};
    stashedEvent.time = 312 + rest;
    stashedEvent.pitched = {
        duration: 24,
        globjects: getUniqueGlobject(allGlobjects),
        pitch: [
            {
                time: 0,
                classes: [0, 3, 7]
            }
        ],
        phraseType: "both",
        dynamics: [
            { time: 0, value: "mf" },
            { time: 0.5, value: ">" },
            { time: 1, value: "n" }
        ]
    };
    stashedEvent.percussion = {
        tempo: 0
    };
    score.push(stashedEvent);

    return score;
})([]);
