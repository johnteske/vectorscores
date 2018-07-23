---
layout: compress-js
---

var main = d3.select('.main'),
    wrapper = main.append('g'),
    topo = wrapper.append('g'),
    // width = 480,
    tileWidthHalf = 24,
    tileHeightHalf = tileWidthHalf * 0.5,
    heightScale = {
        revealed: 2.5,
        hidden: 1
    },
    score = {
        width: 8 // currently used in creation, not display
    },
    walker = {
        index: -1,
        lastDir: ''
    },
    revealFactor = 62,
    nearbyRevealFactor = 38,
    transitionTime = 600,
    nEvents = 100;

var layout = {
    width: 400,
    height: 300,
    scale: 1,
    margin: {}
};
var debug = +VS.getQueryString('debug') === 1;

{% include_relative _utils.js %}
{% include_relative _symbol-sets.js %}
{% include_relative _score.js %}

var topography =  generateValues();
score.range = getScoreRange(topography);
var topoData = createScoreFragment(topography);

/**
 * Debug symbol offsets
 */
if (debug) {
    heightScale.revealed = 0;
    heightScale.hidden = 0;

    wrapper.append('g')
        .selectAll('.plus')
        .data(topoData)
        .enter()
        .append('path')
        .attr('stroke', 'red')
        .attr('stroke-width', 1)
        .attr('d', function(d, i) {
            var c = indexToCoordinates(i),
                px = (c.x - c.y) * tileWidthHalf,
                py = (c.x + c.y) * tileHeightHalf;

            return 'M' + px + ' ' + (py - 5) +
                ' L' + px + ' ' + (py + 5) +
                ' M' + (px - 5) + ' ' + py +
                ' L' + (px + 5) + ' ' + py;
        });
}

/**
 * Render score directly from row-major order data
 */
topo.selectAll('text')
    .data(topoData)
    .enter()
    .append('text')
    .attr('x', function(d, i) {
        var c = indexToCoordinates(i);
        return (c.x - c.y) * tileWidthHalf;
    })
    .each(function(d) {
        var symbolIndex = d.heightIndex + 4;
        var symbolKey = getStringByIndex(symbolIndex);
        var offsets = symbolSet.offsets[symbolKey];

        d3.select(this).text(symbolSet.strings[symbolKey])
            .attr('dx', offsets.x + 'em')
            .attr('dy', offsets.y + 'em');
    })
    .call(revealSymbols, 0);

function getStringByIndex(index) {
    if (index > (symbolSet.scale.length - 1)) {
        return 'max';
    } else if (index < 0) {
        return 'min';
    } else {
        return symbolSet.scale[index];
    }
}

/**
 * Reveal
 */
function revealSymbols(selection, dur) {
    selection.transition().duration(dur)
        .attr('y', function(d, i) {
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
        .style('opacity', function(d) {
            if (d.revealed > 0) {
                d.revealed--;
            }
            return debug ? 1 : (d.revealed / revealFactor);
        });
}

function moveWalker(duration) {
    var c = indexToCoordinates(walker.index);
    var notWalked = [];
    var available = [];
    var dir = '';

    function checkNearby(x, y, dir) {
        if (x > -1 && x < score.width && y > -1 && y < score.width) {
            if (!topoData[coordinatesToIndex(x, y)].walked) {
                notWalked.push(dir);
            } else {
                available.push(dir);
            }
        }
    }

    checkNearby(c.x, c.y - 1, 'top');
    checkNearby(c.x + 1, c.y, 'right');
    checkNearby(c.x, c.y + 1, 'bottom');
    checkNearby(c.x - 1, c.y, 'left');

    checkNearby(c.x - 1, c.y - 1, 'topLeft');
    checkNearby(c.x + 1, c.y + 1, 'bottomRight');

    /**
     * Make two moves in the same direction, if possible, or
     * move to a position not yet walked on, or
     * move to any available position
     */
    if (notWalked.indexOf(walker.lastDir) !== -1 || available.indexOf(walker.lastDir) !== -1) {
        // console.log('last');
        dir = walker.lastDir;
        walker.lastDir = '';
    } else if (notWalked.length) {
        dir = VS.getItem(notWalked);
        walker.lastDir = dir;
    } else {
        dir = VS.getItem(available);
        walker.lastDir = dir;
    }

    topoData[walker.index].walker = false;

    switch (dir) {
    case 'top':
        walker.index = coordinatesToIndex(c.x, c.y - 1);
        break;
    case 'right':
        walker.index = coordinatesToIndex(c.x + 1, c.y);
        break;
    case 'bottom':
        walker.index = coordinatesToIndex(c.x, c.y + 1);
        break;
    case 'left':
        walker.index = coordinatesToIndex(c.x - 1, c.y);
        break;
    case 'topLeft':
        walker.index = coordinatesToIndex(c.x - 1, c.y - 1);
        break;
    case 'bottomRight':
        walker.index = coordinatesToIndex(c.x + 1, c.y + 1);
        break;
    default:
        break;
    }

    topoData[walker.index].walker = true;
    topoData[walker.index].walked = true;
    topoData[walker.index].revealed = revealFactor;

    revealNearby(duration);
}

function revealNearby(duration) {
    // Chance nearby symbols will be revealed
    var chance = 0.2;

    var revealedIndices = [walker.index];

    function setRevealed(x, y) {
        if (Math.random() < chance && x > -1 && x < score.width && y > -1 && y < score.width) {
            topoData[coordinatesToIndex(x, y)].revealed = Math.min(topoData[coordinatesToIndex(x, y)].revealed + nearbyRevealFactor, revealFactor);
        }
    }

    var c = indexToCoordinates(walker.index);

    setRevealed(c.x, c.y - 1); // top
    setRevealed(c.x + 1, c.y); // right
    setRevealed(c.x, c.y + 1); // bottom
    setRevealed(c.x - 1, c.y); // left

    setRevealed(c.x - 1, c.y - 1); // top left
    setRevealed(c.x + 1, c.y + 1); // bottom right

    // Update map
    topo.selectAll('text').call(revealSymbols, duration || transitionTime);
}

function forgetAll(duration) {
    topo.selectAll('text')
    .each(function(d) {
        d.revealed = 0;
    })
    .call(revealSymbols, duration || transitionTime);
}

/**
 * Populate score
 */
VS.score.preroll = transitionTime;

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
(function() {
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
}());

var makeToggler = function(toggle) {
    return function(duration) {
        toggleInstructions(duration, toggle);
        forgetAll(duration);
    };
};

/**
 * Fade instructions in and out
 */
var instructionEventList = [
    {
        duration: 0,
        action: makeToggler(false)
    },
    {
        duration: 3600,
        action: makeToggler(true)
    },
    {
        duration: 3600,
        action: makeToggler(false)
    }
];

var walkEventList = [];
for (var i = 0; i < nEvents; i++) {
    walkEventList.push({
        duration: randDuration(),
        action: moveWalker
    });
}

var finalEventList = [
    {
        duration: 6000,
        action: function(duration) {
            forgetAll(duration || 6000);
        }
    },
    {
        duration: 0,
        action: function() {}
    }
];

var eventList = [].concat(instructionEventList, walkEventList, finalEventList)
    .map(function(bar, i, list) {
        bar.time = list.slice(0, i).reduce(function(sum, bar2) {
            return sum += bar2.duration;
        }, 0);
        return bar;
    });

eventList.forEach(function(bar) {
    VS.score.add(bar.time, bar.action);
});

/**
 * Instructions
 */
var instructions = wrapper.append('text')
    .attr('class', 'instructions')
    .attr('text-anchor', 'middle')
    .attr('y', 220)
    .attr('opacity', 0)
    .text('explore the unknown, try to remember the past');

function toggleInstructions(duration, toggle) {
    instructions.transition().duration(duration || transitionTime)
        .attr('opacity', toggle ? 1 : 0);
}

/**
 * Controls
 */
VS.control.hooks.add('step', function() {
    var pointer = VS.score.getPointer();
    eventList[pointer].action(150);
});

VS.control.hooks.add('stop', forgetAll);

/**
 * Resize
 */
function resize() {
    var main = d3.select('main');

    var w = parseInt(main.style('width'), 10);
    var h = parseInt(main.style('height'), 10);

    var scaleX = VS.clamp(w / layout.width, 0.25, 2);
    var scaleY = VS.clamp(h / layout.height, 0.25, 2);

    layout.scale = Math.min(scaleX, scaleY);

    layout.margin.left = w * 0.5;
    layout.margin.top = (h * 0.5) - ((layout.height * 0.25) * layout.scale);

    wrapper.attr('transform', 'translate(' + layout.margin.left + ',' + layout.margin.top + ') scale(' + layout.scale + ',' + layout.scale + ')');
}

d3.select(window).on('resize', resize);

d3.select(window).on('load', resize);
