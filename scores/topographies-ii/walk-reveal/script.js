---
layout: compress-js
---

var main = d3.select(".main"),
    wrapper = main.append("g"),
    topo = wrapper.append("g"),
    // width = 480,
    tileWidthHalf = 24,
    tileHeightHalf = tileWidthHalf * 0.5,
    heightScale = {
        revealed: 2.5,
        hidden: 1
    },
    topoData,
    score = {
        width: 8, // currently used in creation, not display
    },
    walker = {
        index: -1,
        lastDir: ""
    },
    revealFactor = 62,
    nearbyRevealFactor = 38,
    nEvents = 100;

var layout = {
    width: 400,
    height: 300,
    scale: 1,
    margin: {}
};
var debug = +VS.getQueryString("debug") === 1;

{% include_relative _symbol-sets.js %}
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
 * Debug symbol offsets
 */
if (debug) {
    heightScale.revealed = 0;
    heightScale.hidden = 0;

    wrapper.append("g")
        .selectAll(".plus")
        .data(topoData)
        .enter()
        .append("path")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("d", function(d, i) {
            var c = indexToCoordinates(i),
                px = (c.x - c.y) * tileWidthHalf,
                py = (c.x + c.y) * tileHeightHalf;

            return "M" + px + " " + (py - 5) +
                " L" + px + " " + (py + 5) +
                " M" + (px - 5) + " " + py +
                " L" + (px + 5) + " " + py;
        });
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
        var symbolIndex = d.heightIndex + 4,
            symbolKey;

        // if (d.height === score.range.max || symbolIndex > (symbolScale.length - 1)) {
        if (symbolIndex > (symbolScale.length - 1)) {
            symbolKey = "max";
        // else if (d.height === score.range.min || symbolIndex < 0) {
        } else if (symbolIndex < 0) {
            symbolKey = "min";
        } else {
            symbolKey = symbolScale[symbolIndex];
        }

        var offsets = symbolOffsets[symbolKey];

        d3.select(this).text(symbols[symbolKey])
            .attr("dx", offsets.x + "em")
            .attr("dy", offsets.y + "em");
    })
    .call(revealSymbols, 0);

/**
 * Reveal
 */
function revealSymbols(selection, dur) {
    selection.transition().duration(dur)
        .attr("y", function(d, i) {
            var c = indexToCoordinates(i),
                hScale = d.revealed ? heightScale.revealed : heightScale.hidden,
                scaledHeight;

            if (debug) {
                scaledHeight = 0;
            } else {
                scaledHeight = d.height * hScale;
            }

            return ((c.x + c.y) * tileHeightHalf) - scaledHeight;
        })
        .style("opacity", function(d) {
            if (d.revealed > 0) {
                d.revealed--;
            }
            return debug ? 1 : (d.revealed / revealFactor);
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
    topoData[walker.index].revealed = revealFactor;

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
            topoData[coordinatesToIndex(x, y)].revealed = Math.min(topoData[coordinatesToIndex(x, y)].revealed + nearbyRevealFactor, revealFactor);
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
    return 1200; // 600 + (Math.random() * 600);
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

    topoData[startIndex].revealed = revealFactor;
    topoData[walker.index].walker = true;
    topoData[walker.index].walked = true;

    topo.selectAll("text").call(revealSymbols, 600);
}, randDuration());

for (var i = 0; i < nEvents; i++) {
    addEvent(moveWalker, randDuration());
}

// final events
addEvent(function() {
    topo.selectAll("text")
        .each(function(d) {
            d.revealed = 0;
        })
        .call(revealSymbols, 6000);
}, 6000);

addEvent(VS.noop, 0);

/**
 *
 */
var instructions = wrapper.append("text")
    .attr("class", "instructions")
    .attr("text-anchor", "middle")
    .attr("y", 220)
    .attr("opacity", 1)
    .text("explore the unknown, try to remember the past");

VS.score.playCallback = function() {
    instructions.transition().duration(600)
        .attr("opacity", 0);
}

VS.score.stopCallback = function() {
    instructions.transition().duration(600)
        .attr("opacity", 1);
}

/**
 * Resize
 */
function resize() {
    var main = d3.select("main");

    var w = parseInt(main.style("width"), 10);
    var h = parseInt(main.style("height"), 10);

    var scaleX = VS.clamp(w / layout.width, 0.25, 2);
    var scaleY = VS.clamp(h / layout.height, 0.25, 2);

    layout.scale = Math.min(scaleX, scaleY);

    layout.margin.left = w * 0.5;
    layout.margin.top = (h * 0.5) - ((layout.height * 0.25) * layout.scale);

    wrapper.attr("transform", "translate(" + layout.margin.left + "," + layout.margin.top + ") scale(" + layout.scale + "," + layout.scale + ")");
}

d3.select(window).on("resize", resize);

d3.select(window).on("load", resize);
