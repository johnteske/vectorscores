/**
 * TODO display chord as number of pitch classes, not cluster, with sixteenth flag
 * TODO add accents
 */
function chord(selection, args) {
    var chords = [];

    for (var i = 0; i < args.n; i++) {
        chords.push("\ue123");
    }

    selection.append("text")
        .attr("class", "chord")
        .attr("x", cardWidth * 0.5)
        .attr("y", cardWidth * 0.5)
        .text(chords.join(" "));
}

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
 * TODO allow control over line type, density, etc.
 * TODO pass in margin to prevent overlap with LNP
 */
function lines(selection, args) {
    selection.selectAll(".line")
        .data(d3.range(args.n))
        .enter()
        .append("line")
        .attr("class", "line")
        .attr("stroke", "black")
        .each(function() {
            var line = d3.select(this),
                y = Math.random() * cardWidth;

            line.attr("x1", VS.getRandExcl(0, cardWidth * 0.5))
                .attr("x2", VS.getRandExcl(cardWidth * 0.5, cardWidth))
                .attr("y1", y)
                .attr("y2", y);
        });
}

cardList = [
    {
        duration: 14,
        dynamics: [
            { time: 0, value: "ff" },
            { time: 0.25, value: "n" },
            { time: 0.5, value: "<"}
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                renderer: chord,
                args: { n: 1 }
            }
        ]
    },
    {
        duration: 19,
        dynamics: [
            { time: 0, value: "ff" },
            { time: 0.5, value: "<" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                renderer: chord,
                args: { n: 2 }
            }
        ]
    },
    {
        duration: 25,
        dynamics: [
            { time: 0, value: "ff" },
            { time: 0.5, value: "mp" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                renderer: chord,
                args: { n: 1 }
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
                renderer: lnp,
                args: {}
            },
            {
                renderer: lines,
                args: { n: 10 }
            }
        ]
    },
    {
        duration: 137,
        dynamics: [
            { time: 0, value: "ff" },
            { time: 0.2, value: "n" },
            { time: 0.4, value: "<" },
            { time: 0.8, value: ">" },
            { time: 1, value: "n" }
        ],
        pcSet: [0, 1, 2, 4, 7, 8],
        content: [
            {
                renderer: chord,
                args: { n: 2 }
            },
            {
                renderer: lines,
                args: { n: 10 }
            }
        ]
    },
    {
        duration: 183,
        dynamics: [
            { time: 0, value: "ff" },
            { time: 0.25, value: "mp" },
            { time: 0.75, value: ">" },
            { time: 1, value: "n" }
        ],
        pcSet: [0, 1, 4, 6],
        // pcSet: [0, 1, 3, 7]
        content: [
            {
                renderer: chord,
                args: { n: 1 }
            },
            {
                renderer: lines,
                args: { n: 10 }
            }
        ]
    }
];
