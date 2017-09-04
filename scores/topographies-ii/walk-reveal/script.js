---
layout: compress-js
---

var main = d3.select(".main"),
    topo = main.append("g"),
    // width = 480,
    tileWidthHalf = 24,
    tileHeightHalf = tileWidthHalf * 0.5,
    heightScale = {
        revealed: 5,
        hidden: 2.5
    },
    topoData,
    score = {
        width: 8, // currently used in creation, not display
    },
    walker = {
        index: -1,
        lastDir: ""
    },
    symbolOffsets = {
        // 0.25: { x: -0.025, y: -0.25 }, // TODO
        // 0.5: { x: -0.025, y: -0.25 },
        // 1: { x: -0.175, y: 0 },
        // 2:  { x: -0.175, y: 0 },
        ".": { x: -0.0625, y: 0.0625 },
        ">": { x: -0.1625, y: 0.125 },
        "-": { x: -0.1625, y: 0.03125 },
        //
        "-2": { x: -0.2, y: 0 }, // double flat
        "-1.5": { x: -0.225, y: 0 }, // three-quarter flat (backwards, forwards)
        "-1": { x: -0.1, y: 0 }, // flat
        "-0.5": { x: -0.1325, y: 0 }, // quarter flat (backwards)
        "0": { x: -0.0875, y: 0 }, // natural
        // "0.5":  "\ue282", // quarter sharp (single vertical stroke)
        // "1":    "\ue262", // sharp
        // "1.5":  "\ue283", // three-quarter sharp (three vertical strokes)
        // "2":    "\ue263"  // double sharp
    },
    symbolScale = ["-2", "-1.5", "-1", "-0.5", "0", "-", ">", "."]; // ["-", "-", ">", ".", 2, 1, 0.5, 0.25]

// var symbols = Object.assign(VS.dictionary.Bravura.durations.stemless, VS.dictionary.Bravura.articulations);
var symbols = Object.assign(VS.dictionary.Bravura.accidentals, VS.dictionary.Bravura.articulations);

main.style("width", 640 + "px")
    .style("height", 640 + "px");

{% include_relative _diamond-square.js %}
{% include_relative _score.js %}

score.range = getScoreRange(topoData);
topoData = createScoreFragment(topoData);

/**
 * x, y from i of row-major order
 */
function indexToCoordinates(i) {
    var y = Math.floor(i / score.width);
    var x = i - (y * score.width);

    return {
        x: x,
        y: y
    };
}

function coordinatesToIndex(x, y) {
    return (x & (score.width - 1)) + (y & (score.width - 1)) * score.width;
}

/**
 * Render score directly from row-major order data
 */
topo.selectAll("text")
    .data(topoData)
    .enter()
    .append("text")
    .attr("x", function(d, i) {
        var c = indexToCoordinates(i);
        return (c.x - c.y) * tileWidthHalf;
    })
    .each(function(d) {
        var selection = d3.select(this);
        var symbolIndex = d.heightIndex + 4;
        var symbolKey = symbolScale[symbolIndex];
        var offsets = symbolOffsets[symbolKey];

        selection.text(symbols[symbolKey])
            .attr("dx", offsets.x + "em")
            .attr("dy", offsets.y + "em");
    })
    .call(revealSymbols, 0);

topo.attr("transform", "translate(320,120)");

/**
 * Reveal
 */
function revealSymbols(selection, dur) {
    selection.transition().duration(dur)
        .attr("y", function(d, i) {
            var c = indexToCoordinates(i),
                hScale = d.revealed ? heightScale.revealed : heightScale.hidden;

            return ((c.x + c.y) * tileHeightHalf) - (d.height * hScale);
        })
        .style("fill", function() {
            var fill = "black";
            // if (d.walker) {
            //     fill = "blue";
            // } else if (d.walked) {
            //     fill = "red";
            // }
            return fill;
        })
        .style("opacity", function(d) {
            return d.revealed ? 1 : 0;
        });
}

function moveWalker() {
    var c = indexToCoordinates(walker.index);
    var notWalked = [];
    var available = [];
    var dir = "";

    function checkNearby(x, y, dir) {
        if (x > -1 && x < score.width && y > -1 && y < score.width) {
            if (!topoData[coordinatesToIndex(x, y)].walked) {
                notWalked.push(dir);
            } else {
                available.push(dir);
            }
        }
    }

    checkNearby(c.x, c.y - 1, "top");
    checkNearby(c.x + 1, c.y, "right");
    checkNearby(c.x, c.y + 1, "bottom");
    checkNearby(c.x - 1, c.y, "left");

    checkNearby(c.x - 1, c.y - 1, "topLeft");
    checkNearby(c.x + 1, c.y + 1, "bottomRight");

    /**
     * Make two moves in the same direction, if possible, or
     * move to a position not yet walked on, or
     * move to any available position
     */
    if (notWalked.indexOf(walker.lastDir) !== -1 || available.indexOf(walker.lastDir) !== -1) {
        // console.log('last');
        dir = walker.lastDir;
        walker.lastDir = "";
    } else if (notWalked.length) {
        dir = VS.getItem(notWalked);
        walker.lastDir = dir;
    } else {
        dir = VS.getItem(available);
        walker.lastDir = dir;
    }

    topoData[walker.index].walker = false;

    switch (dir) {
    case "top":
        walker.index = coordinatesToIndex(c.x, c.y - 1);
        break;
    case "right":
        walker.index = coordinatesToIndex(c.x + 1, c.y);
        break;
    case "bottom":
        walker.index = coordinatesToIndex(c.x, c.y + 1);
        break;
    case "left":
        walker.index = coordinatesToIndex(c.x - 1, c.y);
        break;
    case "topLeft":
        walker.index = coordinatesToIndex(c.x - 1, c.y - 1);
        break;
    case "bottomRight":
        walker.index = coordinatesToIndex(c.x + 1, c.y + 1);
        break;
    default:
        break;
    }

    topoData[walker.index].walker = true;
    topoData[walker.index].walked = true;
    topoData[walker.index].revealed = true;

    revealNearby();
}

function revealNearby() {
    // Chance nearby symbols will be revealed
    var chance = 0.2;

    var revealedIndices = [walker.index];

    // for (var i = 0; i < topoData.length; i++) {
    //     if (topoData[i].revealed) {
    //         revealedIndices.push(i);
    //     }
    // }

    function setRevealed(x, y) {
        if (Math.random() < chance && x > -1 && x < score.width && y > -1 && y < score.width) {
            topoData[coordinatesToIndex(x, y)].revealed = true;
        }
    }

    // Reveal surrounding indices
    for (var i = 0; i < revealedIndices.length; i++) {
        var index = revealedIndices[i],
            c = indexToCoordinates(index);

        setRevealed(c.x, c.y - 1); // top
        setRevealed(c.x + 1, c.y); // right
        setRevealed(c.x, c.y + 1); // bottom
        setRevealed(c.x - 1, c.y); // left

        setRevealed(c.x - 1, c.y - 1); // top left
        setRevealed(c.x + 1, c.y + 1); // bottom right
    }

    // Update map
    topo.selectAll("text").call(revealSymbols, 600);
}

/**
 * Populate score
 */
VS.score.preroll = 1000;

var addEvent = (function() {
    var time = 0;

    return function(fn, duration) {
        VS.score.add(time, fn);
        time += duration;
    };
})();

function randDuration() {
    return 600 + (Math.random() * 600);
}
/**
 * Reveal a starting point
 */
addEvent(function() {
    var extremaIndices = [];

    for (var i = 0; i < topoData.length; i++) {
        var d = topoData[i];
        if (d.height === score.range.min || d.height === score.range.max) {
            extremaIndices.push(i);
        }
    }

    var startIndex = walker.index = VS.getItem(extremaIndices);

    topoData[startIndex].revealed = true;
    topoData[walker.index].walker = true;
    topoData[walker.index].walked = true;

    topo.selectAll("text").call(revealSymbols, 600);
}, randDuration());

for (var i = 0; i < 100; i++) {
    addEvent(moveWalker, randDuration());
}
