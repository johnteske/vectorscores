var cardList = [
    {
        duration: 2,
        cue: 2,
        type: "bar",
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        transpose: 0,
        content: [
            {
                type: chord,
                args: { n: 1, timeSig: "2/4" }
            }
        ]
    },
    {
        duration: 11,
        cue: 2,
        type: "card",
        dynamics: [
            { time: 0, value: "n" },
            { time: 0.5, value: "<"}
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        transpose: 0,
        content: [
            {
                type: chord,
                args: { n: 1, sustain: true }
            }
        ]
    },
    {
        duration: 3,
        cue: 3,
        type: "bar",
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        transpose: 0,
        content: [
            {
                type: chord,
                args: { n: 2, timeSig: "3/4" }
            }
        ]
    },
    {
        duration: 16,
        cue: 3,
        type: "card",
        dynamics: [
            { time: 0, value: "n" },
            { time: 0.5, value: "<" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        transpose: 0,
        content: [
            {
                type: chord,
                args: { n: 1, sustain: true }
            }
        ]
    },
    {
        duration: 2,
        cue: 2,
        type: "bar",
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        transpose: 0,
        content: [
            {
                type: chord,
                args: { n: 1, duration: 1.5, timeSig: "2/4" }
            }
        ]
    },
    {
        duration: 23,
        cue: 2,
        type: "card",
        dynamics: [
            { time: 0, value: "mp" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        transpose: 0,
        content: [
            {
                type: chord,
                args: { n: 1, sustain: true }
            }
        ]
    },
    /**
     * A
     */
    {
        duration: 25.75,
        cue: 3,
        type: "card",
        dynamics: [
            { time: 0, value: "n" },
            { time: 0.5, value: "<" },
            { time: 1, value: "p" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: lnp,
                args: {}
            },
            {
                type: lines,
                args: {
                    n: 6,
                    duration: 1,
                    bottomMargin: 25
                }
            }
        ]
    },
    {
        duration: 25.75,
        cue: 1,
        type: "card",
        dynamics: [
            { time: 0, value: "p" },
            { time: 0.5, value: "<" },
            { time: 1, value: "mf" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: lnp,
                args: {}
            },
            {
                type: lines,
                args: {
                    n: 18,
                    duration: 3,
                    bottomMargin: 25
                }
            }
        ]
    },
    {
        duration: 25.75,
        cue: 1,
        type: "card",
        dynamics: [
            { time: 0, value: "mf" },
            { time: 0.5, value: ">" },
            { time: 1, value: "p" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: lnp,
                args: {}
            },
            {
                type: lines,
                args: {
                    n: 18,
                    duration: 9,
                    phrase: microMelodyPhrase,
                    bottomMargin: 25
                }
            }
        ]
    },
    {
        duration: 25.75,
        cue: 1,
        type: "card",
        dynamics: [
            { time: 0, value: "p" },
            { time: 0.5, value: ">" },
            { time: 1, value: "n" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: lnp,
                args: {}
            },
            {
                type: lines,
                args: {
                    n: 18,
                    duration: 9,
                    phrase: melodyPhrase,
                    bottomMargin: 25
                }
            }
        ]
    },
    /**
     * B
     */
    {
        duration: 3,
        cue: 3,
        type: "bar",
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        transpose: 0,
        content: [
            {
                type: chord,
                args: { n: 2, timeSig: "3/4" }
            }
        ]
    },
    {
        duration: 56.5,
        cue: 3,
        type: "card",
        dynamics: [
            { time: 0, value: "n" },
            { time: 0.5, value: "<" },
            { time: 1, value: "mf" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: lines,
                args: {
                    n: 6,
                    duration: 1
                }
            }
        ]
    },
    {
        duration: 76.5 * (3 / 7),
        cue: 1,
        type: "card",
        dynamics: [
            { time: 0, value: "mf" },
            { time: 0.5, value: ">" },
            { time: 1, value: "p" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: lines,
                args: {
                    n: 18,
                    duration: 9,
                    phrase: microMelodyPhrase
                }
            }
        ]
    },
    {
        duration: 76.5 * (4 / 7),
        cue: 1,
        type: "card",
        dynamics: [
            { time: 0, value: "p" },
            { time: 0.5, value: ">" },
            { time: 1, value: "n" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: lines,
                args: {
                    n: 18,
                    duration: 15,
                    phrase: microtonalPhrase,
                    curve: d3.curveCardinal.tension(0)
                }
            }
        ]
    },
    /**
     * C
     */
    {
        duration: 2,
        cue: 2,
        type: "bar",
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 4, 6],
        transpose: 0,
        // pcSet: [0, 1, 3, 7]
        content: [
            {
                type: chord,
                args: { n: 1, duration: 1.5, timeSig: "2/4" }
            }
        ]
    },
    {
        duration: 180 * (3 / 7),
        cue: 2,
        type: "card",
        timbre: "glassy",
        dynamics: [
            { time: 0, value: "mp" },
            { time: 0.5, value: ">" },
            { time: 1, value: "pp" }
        ],
        pcSet: [0, 1, 4, 6],
        // pcSet: [0, 1, 3, 7]
        content: [
            {
                type: lines,
                args: {
                    n: 12,
                    duration: 6,
                    phrase: microtonalPhrase,
                    curve: d3.curveCardinal.tension(0)
                }
            }
        ]
    },
    {
        duration: 180 * (4 / 7),
        cue: 1,
        type: "card",
        timbre: "glassy",
        dynamics: [
            { time: 0, value: "pp" },
            { time: 0.5, value: ">" },
            { time: 1, value: "n" }
        ],
        pcSet: [0, 1, 4, 6],
        // pcSet: [0, 1, 3, 7]
        content: [
            {
                type: lines,
                args: {
                    n: 6,
                    duration: 1
                }
            }
        ]
    }
];
