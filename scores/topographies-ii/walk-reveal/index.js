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

{% include_relative _utils.js %}
{% include_relative _point.js %}
{% include_relative _symbol-sets.js %}
{% include_relative _score.js %}
{% include_relative _text.js %}

var topography =  generateValues();
score.range = getScoreRange(topography);
var topoData = createScoreFragment(topography);

/**
 * Render score directly from row-major order data
 */
topo.selectAll('text')
    .data(topoData)
    .enter()
    .append('text')
    .attr('x', function(d, i) {
        var c = indexToPoint(i);
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
            var c = indexToPoint(i),
                hScale = d.revealed ? heightScale.revealed : heightScale.hidden,
                scaledHeight;

            scaledHeight = d.height * hScale;

            return ((c.x + c.y) * tileHeightHalf) - scaledHeight;
        })
        .style('opacity', function(d) {
            if (d.revealed > 0) {
                d.revealed--;
            }
            return d.revealed / revealFactor;
        });
}

function moveWalker(duration) {
    var c = indexToPoint(walker.index);
    var notWalked = [];
    var available = [];
    var dir = '';

    function checkNearby(point, dir) {
        var x = point.x;
        var y = point.y;
        if (x > -1 && x < score.width && y > -1 && y < score.width) {
            if (!topoData[pointToIndex(point)].walked) {
                notWalked.push(dir);
            } else {
                available.push(dir);
            }
        }
    }

    checkNearby(north(c), 'top');
    checkNearby(east(c), 'right');
    checkNearby(south(c), 'bottom');
    checkNearby(west(c), 'left');

    checkNearby(northWest(c), 'topLeft');
    checkNearby(southEast(c), 'bottomRight');

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
        walker.index = pointToIndex(north(c));
        break;
    case 'right':
        walker.index = pointToIndex(east(c));
        break;
    case 'bottom':
        walker.index = pointToIndex(south(c));
        break;
    case 'left':
        walker.index = pointToIndex(west(c));
        break;
    case 'topLeft':
        walker.index = pointToIndex(northWest(c));
        break;
    case 'bottomRight':
        walker.index = pointToIndex(southEast(c));
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

    function setRevealed(point) {
        var x = point.x;
        var y = point.y;
        if (Math.random() < chance && x > -1 && x < score.width && y > -1 && y < score.width) {
            topoData[pointToIndex(point)].revealed = Math.min(topoData[pointToIndex(point)].revealed + nearbyRevealFactor, revealFactor);
        }
    }

    var c = indexToPoint(walker.index);

    setRevealed(north(c));
    setRevealed(east(c));
    setRevealed(south(c));
    setRevealed(west(c));

    setRevealed(northWest(c));
    setRevealed(southEast(c));

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
 * Reveal a starting point, chosen from an extreme high or low
 */
(function() {
    var extremaIndices = topoData.reduce(function(indices, d, i) {
        ((d.height === score.range.min) || (d.height === score.range.max)) && indices.push(i);
        return indices;
    }, []);

    walker.index = VS.getItem(extremaIndices);

    topoData[walker.index].revealed = revealFactor;
    topoData[walker.index].walker = true;
    topoData[walker.index].walked = true;
}());

/**
 * Fade text in and out
 */
var textEventList = [
    {
        duration: 0,
        action: makeTextToggler(false)
    },
    {
        duration: 3600,
        action: makeTextToggler(true)
    },
    {
        duration: 3600,
        action: makeTextToggler(false)
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

var eventList = [].concat(textEventList, walkEventList, finalEventList)
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
