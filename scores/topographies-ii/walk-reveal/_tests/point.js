const path = require('path')
const { loadDomThenTest } = require(path.resolve('.', 'bin/js/tape-setup'))

loadDomThenTest('topographies ii points', '_site/scores/topographies-ii/walk-reveal/index.html', (t, window) => {
    const { west, east, north, south, northWest, southEast } = window

    const point = { x: 5, y: 5 }

    t.deepEquals(west(point), { x: 4, y: 5 })
    t.deepEquals(east(point), { x: 6, y: 5 })
    t.deepEquals(north(point), { x: 5, y: 4 })
    t.deepEquals(south(point), { x: 5, y: 6 })

    t.deepEquals(northWest(point), { x: 4, y: 4 })
    t.deepEquals(southEast(point), { x: 6, y: 6 })

    t.deepEquals(point, { x: 5, y: 5 }, 'point calculations should not mutate original point')

    t.end()
})
