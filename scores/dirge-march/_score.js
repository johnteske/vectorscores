/**
 * TODO proto globjects are combined into phrases, not directly used
 */
var score = (function(score) {
    // TODO stashing is a quick fix--create independent layers
    function clone(o) {
        return JSON.parse(JSON.stringify(o));
    }

    /**
     * dirge
     */
    var descending = globjects.filter(function(g) {
        return g.contour === "descending";
    });

    // A
    // mm 1
    var stashedEvent = {
        time: 0,
        duration: 46.67,
        globjects: [VS.getItem(descending)],
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
        percussion: {
            tempo: 0
        }
    };
    score.push(stashedEvent);

    // mm 2
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 16;
    stashedEvent.percussion = {
        tempo: 60,
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
    stashedEvent.duration = 46.67,
    stashedEvent.globjects = [VS.getItem(descending)],
    stashedEvent.pitch = [
        {
            time: 0,
            classes: [0, 3]
        },
        {
            time: 1,
            classes: [0, 3, 7]
        }
    ],
    stashedEvent.phraseType = "";
    score.push(stashedEvent);

    // mm 4
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 48;
    stashedEvent.percussion = {
        tempo: 60,
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
    stashedEvent.duration = 46.67,
    stashedEvent.globjects = [VS.getItem(descending)];
    stashedEvent.pitch = [
        {
            time: 0,
            classes: [0, 3, 7]
        }
    ];
    stashedEvent.phraseType = "descending";
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
    score.push({
        time: 144,
        duration: rest,
        globjects: [],
        pitch: [],
        phraseType: "rest",
        percussion: {
            tempo: 0
        }
    });

    /**
     *
     */
    var ascending = globjects.filter(function(g) {
        return g.contour === "ascending";
    });

    // mm 9
    stashedEvent = {
        time: 144 + rest,
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
        percussion: {
            tempo: 0
        }
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
        dynamics: [
            { time: 0, value: "mf" },
            { time: 0.5, value: "<" },
            { time: 1, value: "f" }
        ]
    };
    score.push(stashedEvent);

    var allGlobjects = globjects.concat(retrogradeGlobjects);

    // mm 11
    stashedEvent = {
        time: 240 + rest,
        duration: 24,
        globjects: [VS.getItem(allGlobjects)],
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
        percussion: {
            tempo: 120,
            dynamics: [
                { time: 0, value: "f" },
                { time: 0.25, value: "<" },
                { time: 0.5, value: "ff" },
                { time: 0.75, value: ">" },
                { time: 1, value: "ff" }
            ]
        }
    };
    score.push(stashedEvent);

    // mm 12
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 264 + rest;
    stashedEvent.duration = 24;
    stashedEvent.globjects = [VS.getItem(allGlobjects)];
    stashedEvent.pitch = [
        {
            time: 0,
            classes: [0, 3]
        },
        {
            time: 1,
            classes: [0, 3, 7]
        }
    ];
    stashedEvent.phraseType = "both";
    score.push(stashedEvent);

    // mm 13
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 272 + rest;
    stashedEvent.percussion = {
        tempo: 120,
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
    stashedEvent.duration = 24;
    stashedEvent.globjects = [VS.getItem(allGlobjects)];
    stashedEvent.pitch = [
        {
            time: 0,
            classes: [0, 3]
        },
        {
            time: 1,
            classes: [0, 3, 7]
        }
    ];
    stashedEvent.phraseType = "both";
    score.push(stashedEvent);

    // mm 15
    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 304;
    stashedEvent.percussion = {
        tempo: 0
    };
    score.push(stashedEvent);

    // mm 16
    score.push({
        time: 312 + rest,
        duration: 24,
        globjects: [VS.getItem(allGlobjects)],
        pitch: [
            {
                time: 0,
                classes: [0, 3, 7]
            }
        ],
        phraseType: "both",
        percussion: {
            tempo: 0
        }
    });

    return score;
})([]);
