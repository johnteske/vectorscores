/**
 * WIP
 * list of height, revealed, explored data at each point in walk
 * first event is initial topoData,
 *
 * TODO set nearby revealed after creating newFrame
 */
// TODO is also last event as opposed to forgetAll()?
var walkEvents = [
    {
        walkerIndex: 32, // TODO starting index
        direction: '',
        topography: topography.map(function(d) {
            return {
                height: d,
                revealed: 0,
                explored: false
            };
        })
    }
];

// NOTE index starts at 1
for (var index = 1; index < 20; index++) {
    walkEvents.push(moveWalkerIndex(walkEvents[index - 1]));
}
console.log(walkEvents);

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
            frame.topography[index].revealed = revealFactor;
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
