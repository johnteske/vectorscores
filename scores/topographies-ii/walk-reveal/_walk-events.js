/**
 * Reveal a starting point, chosen from an extreme high or low
 */
// function getScoreRange(data) {
//     return {
//         min: Math.min.apply(null, data),
//         max: Math.max.apply(null, data)
//     };
// }
// score.range = getScoreRange(topography);
// var startingIndex = (function() {
//     var extremaIndices = topography.reduce(function(indices, d, i) {
//         ((d.height === score.range.min) || (d.height === score.range.max)) && indices.push(i);
//         return indices;
//     }, []);

//     return VS.getItem(extremaIndices);
// }());

/**
 * list of height, revealed, explored data at each point in walk
 */
var emptyFrame = {
    walkerIndex: VS.getRandIntIncl(0, 63), // TODO starting index
    direction: '',
    topography: topography.map(function(d) {
        return {
            height: d,
            revealed: 0,
            explored: false
        };
    })
};

var walkEvents = [].concat(
    emptyFrame,
    walkFrames(),
    emptyFrame
);

function walkFrames() {
    var frames = [];

    for (var i = 0, lastFrame; i < nEvents; i++) {
        lastFrame = (i > 0) ? frames[i - 1] : emptyFrame;
        frames.push(moveWalkerIndex(lastFrame));
    }

    return frames;
}

function numberIsInBounds(n) {
    return (n > 0) && (n < score.width);
}
function pointIsInBounds(point) {
    return numberIsInBounds(point.x) && numberIsInBounds(point.y);
}

// TODO if all adjacent points are explored, perhaps move to the point with the lowest "reveal"
// as in, fulling the "trying to remember" instruction
function moveWalkerIndex(lastFrame) {

    var lastPoint = indexToPoint(lastFrame.walkerIndex);

    // TODO not an index but actually a 'tuple'--direction and index
    var adjacentIndices = ['north', 'south', 'east', 'west', 'northWest', 'southEast']
        .map(function(dir) {
            return {
                direction: dir,
                point: window[dir](lastPoint)
            };
        })
        .filter(function(d) {
            return pointIsInBounds(d.point);
        })
        .map(function(d) {
            return {
                direction: d.direction,
                index: pointToIndex(d.point)
            };
        });

    function revealAdjacentIndices(index, frame) {
        adjacentIndices.map(function(d) {
            return d.index;
        })
        .filter(function() {
            return Math.random() < 0.2;
        }).forEach(function(index) {
            frame.topography[index].revealed += nearbyRevealFactor;
        });

        return frame;
    }

    function createNewFrame(tuple) {
        var newFrame = {
            topography: lastFrame.topography.map(function(d) {
                // copy
                return {
                    height: d.height,
                    // decrement reveal, if not 0
                    revealed: d.revealed ? d.revealed - 1 : 0,
                    explored: d.explored
                };
            })
        };
        newFrame.walkerIndex = tuple.index;
        newFrame.direction = tuple.direction;
        newFrame.topography[tuple.index].explored = true;
        newFrame.topography[tuple.index].revealed = revealFactor;
        newFrame = revealAdjacentIndices(tuple.index, newFrame);
        return newFrame;
    }

    /**
     * Same direction
     */
    var sameDirIndices = adjacentIndices.filter(function(d) {
        return d.direction === lastFrame.direction;
    })
    .map(function(d) {
        return {
            direction: '',
            index: d.index
        };
    });

    if (sameDirIndices.length) {
        return createNewFrame(sameDirIndices[0]);
    }

    /**
     * Unexplored
     */
    var unexploredIndices = adjacentIndices.filter(function(d) {
        return !lastFrame.topography[d.index].explored;
    });

    if (unexploredIndices.length) {
        return createNewFrame(VS.getItem(unexploredIndices));
    }

    /**
     * Explored
     */
    var exploredIndices = adjacentIndices.filter(function(d) {
        return lastFrame.topography[d.index].explored;
    });

    if (exploredIndices.length) {
        return createNewFrame(VS.getItem(exploredIndices));
    }
}
