var chord = (function() {
    function makeChord(selection, args, x) {
        var range = [0, 1, 2, 3, 4, 5],
            rangeHalf = range.length * 0.5,
            notehead = args.sustain ? "\uf468" : "\uf46a";

        function y(d) {
            return (cardWidth * 0.5) + ((d - rangeHalf) * 10) + 5;
        }

        if (args.sustain) {
            // fermata
            selection.append("text")
                .attr("class", "chord-fermata")
                .attr("x", x)
                .attr("y", y(0))
                .attr("dy", -15)
                .text("\ue4c6");
        } else {
            // stem
            selection.append("line")
                .attr("stroke", "black")
                .attr("x1", x + 3.625)
                .attr("y1", y(5))
                .attr("x2", x + 3.625)
                .attr("y2", y(0) - 20);

            // accent
            selection.append("text")
                .attr("class", "chord-fermata")
                .attr("x", x)
                .attr("y", y(5))
                .attr("dy", 15)
                .text("\uf475");
        }

        // TODO 1.5 duration should have dots
        if (!args.sustain && args.duration !== 1.5) {
            // flag
            selection.append("text")
                .attr("class", "chord-flag")
                .attr("text-anchor", "start")
                .attr("x", x + 3.125)
                .attr("y", y(0) - 24)
                .text("\uf48d");
        }

        var text = selection.append("text")
            .attr("class", "chord");

        text.selectAll("tspan")
            .data(range)
            .enter()
            .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .text(notehead);
    }

    return function(selection, args) {
        var center = cardWidth * 0.5,
            spacing = cardWidth * 0.2;

        for (var i = 0; i < args.n; i++) {
            selection.call(makeChord, args, center + (i - ((args.n - 1) * 0.5)) * spacing);
        }
    };
})();

function lnp(selection) {
    var margin = 11;

    selection.append("text")
        .attr("class", "lnp")
        .attr("x", 0)
        .attr("y", cardWidth)
        .attr("dx", margin)
        .attr("dy", -margin)
        .text("\ue0f4");

    selection.append("line")
        .attr("stroke", "black")
        .attr("stroke-width", "2")
        .attr("x1", margin + 4)
        .attr("x2", cardWidth - margin)
        .attr("y1", cardWidth - margin - 2)
        .attr("y2", cardWidth - margin - 2);
}

/**
 * TODO pass in margin to prevent overlap with LNP
 */
function lines(selection, args) {
    var lineCloud = VS.lineCloud()
        .duration(args.duration || 1)
        .phrase(args.phrase || [{ pitch: 0, duration: 1 }, { pitch: 0, duration: 0 }])
        .curve(args.curve || d3.curveLinear)
        .width(cardWidth)
        .height(cardWidth - (args.bottomMargin || 0));

    selection.call(lineCloud, { n: args.n });

    // test styling
    selection.selectAll(".line-cloud-path")
        .attr("stroke", "grey")
        .attr("fill", "none");
}

function microMelodyPhrase() {
    var notes = [
        { pitch: 0, duration: 1 },
        { pitch: 0, duration: 0 }
    ];

    var dir = VS.getItem([-1, 1]);

    notes.push({ pitch: 2 * dir, duration: 1 });
    notes.push({ pitch: 2 * dir, duration: 0 });

    dir = dir === -1 ? 1 : -1;

    notes.push({ pitch: 2 * dir, duration: 1 });
    notes.push({ pitch: 2 * dir, duration: 0 });

    return notes;
}

function melodyPhrase() {
    var notes = [
        { pitch: 0, duration: 1 },
        { pitch: 0, duration: 0 }
    ];

    function addNote() {
        var dir = VS.getItem([-1, 1]);
        notes.push({ pitch: 2 * dir, duration: 1 });
        notes.push({ pitch: 2 * dir, duration: 0 });
    }

    for (var i = 0; i < 5; i++) {
        addNote();
    }

    return notes;
}

function microtonalPhrase() {
    var notes = [
        { pitch: 0, duration: 1 }
    ];

    function addNote() {
        var dir = VS.getItem([-1, 1]);
        notes.push({ pitch: dir, duration: 1 });
    }

    for (var i = 0; i < 5; i++) {
        addNote();
    }

    notes.push({ pitch: 0, duration: 0 });

    return notes;
}

VS.score.preroll = 3000;

var cardList = [
    // TODO start without card, cue into start
    {
        duration: 0,
        cue: true,
        dynamics: [],
        pcSet: [],
        content: []
    },
    //
    {
        duration: 2,
        cue: true,
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: chord,
                args: { n: 1 }
            }
        ]
    },
    {
        duration: 11,
        cue: true,
        dynamics: [
            { time: 0, value: "n" },
            { time: 0.5, value: "<"}
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: chord,
                args: { n: 1, sustain: true }
            }
        ]
    },
    {
        duration: 3,
        cue: true,
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: chord,
                args: { n: 2 }
            }
        ]
    },
    {
        duration: 16,
        cue: true,
        dynamics: [
            { time: 0, value: "n" },
            { time: 0.5, value: "<" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: chord,
                args: { n: 1, sustain: true }
            }
        ]
    },
    {
        duration: 2,
        cue: true,
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: chord,
                args: { n: 1, duration: 1.5 }
            }
        ]
    },
    {
        duration: 23,
        cue: true,
        dynamics: [
            { time: 0, value: "mp" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
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
        cue: true,
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
        cue: false,
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
        cue: false,
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
        cue: false,
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
        cue: true,
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: chord,
                args: { n: 2 }
            }
        ]
    },
    {
        duration: 56.5,
        cue: true,
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
        duration: 76.5 * (3/7),
        cue: false,
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
        duration: 76.5 * (4/7),
        cue: false,
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
        cue: true,
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 4, 6],
        // pcSet: [0, 1, 3, 7]
        content: [
            {
                type: chord,
                args: { n: 1, duration: 1.5 }
            }
        ]
    },
    {
        duration: 180 * (3/7),
        cue: true,
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
        duration: 180 * (4/7),
        cue: false,
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
