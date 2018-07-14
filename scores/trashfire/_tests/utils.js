const path = require('path')
const { loadDomThenTest } = require(path.resolve('.', 'bin/js/tape-setup'))

loadDomThenTest.only('trashfire', '_site/scores/trashfire/index.html', (t, window) => {

    const { last, push, buildArray } = window.TrashUtils

    const abcd = ['a', 'b', 'c', 'd']
    let d = last(abcd)
    t.equals(d, 'd', 'last function should return last element of array')
    d = 'e'
    t.deepEquals(abcd, ['a', 'b', 'c', 'd'], 'last function should not mutate source array')

    const abc = ['a', 'b', 'c']
    t.deepEquals(push(abc, 'd'), ['a', 'b', 'c', 'd'], 'push function should return a new array with an added item')
    t.deepEquals(abc, ['a', 'b', 'c'], 'push function should not mutate source array')

    const incremented0 = buildArray(5, Number)
    t.deepEquals(incremented0, [0, 1, 2, 3, 4], 'buildArray should create new array using callback')

    const incremented1 = buildArray(5, i => i + 1)
    t.deepEquals(incremented1, [1, 2, 3, 4, 5], 'buildArray should create new array using callback')

    t.end()
})
