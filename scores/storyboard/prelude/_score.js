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
            // flag
            selection.append("text")
                .attr("class", "chord-flag")
                .attr("text-anchor", "start")
                .attr("x", x + 3.125)
                .attr("y", y(0) - 24)
                .text("\uf48d");

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
            spacing = cardWidth * 0.25;

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
        .width(cardWidth)
        .height(cardWidth);

    selection.call(lineCloud, { n: args.n });

    // test styling
    selection.selectAll(".line-cloud-path")
        .attr("stroke", "grey")
        .attr("fill", "none");
}

VS.score.preroll = 3000;

var cardList = [
    // TODO start without card, cue into start
    {
        duration: 0,
        dynamics: [],
        pcSet: [],
        content: []
    },
    //
    {
        duration: 1,
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
        duration: 13,
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
        duration: 2,
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
        duration: 17,
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
        duration: 1,
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
        duration: 24,
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
    {
        duration: 103,
        dynamics: [
            { time: 0, value: "n" },
            { time: 0.25, value: "<" },
            { time: 0.75, value: ">" },
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
                args: { n: 10 }
            }
        ]
    },
    {
        duration: 1,
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
        duration: 136,
        dynamics: [
            { time: 0, value: "n" },
            { time: 0.25, value: "<" },
            { time: 0.5, value: ">" },
            { time: 1, value: "n" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                type: lines,
                args: { n: 10 }
            }
        ]
    },
    {
        duration: 1,
        dynamics: [
            { time: 0, value: "ff" }
        ],
        pcSet: [0, 1, 4, 6],
        // pcSet: [0, 1, 3, 7]
        content: [
            {
                type: chord,
                args: { n: 1 }
            }
        ]
    },
    {
        duration: 182,
        dynamics: [
            { time: 0, value: "mp" },
            { time: 0.5, value: ">" },
            { time: 1, value: "n" }
        ],
        pcSet: [0, 1, 4, 6],
        // pcSet: [0, 1, 3, 7]
        content: [
            {
                type: lines,
                args: { n: 10 }
            }
        ]
    }
];
