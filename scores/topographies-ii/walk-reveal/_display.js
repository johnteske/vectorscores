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
        dir = walker.lastDir;
        walker.lastDir = '';
    } else if (notWalked.length) {
        dir = VS.getItem(notWalked);
        walker.lastDir = dir;
    } else {
        dir = VS.getItem(available);
        walker.lastDir = dir;
    }

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

    topoData[walker.index].walked = true;
    topoData[walker.index].revealed = revealFactor;

    revealNearby(duration);
}

function revealNearby(duration) {
    // Chance nearby symbols will be revealed
    var chance = 0.2;

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
