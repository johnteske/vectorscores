const path = require('path')
const { loadDomThenTest } = require(path.resolve('.', 'bin/js/tape-setup'))

loadDomThenTest.only('trashfire', '_site/scores/trashfire/index.html', (t, window) => {
    // const trashActions = ['add', 'remove', 'add', 'add', 'remove', 'add', 'add', 'add', 'empty']

    const { last, push } = window.TrashUtils

    const abcd = ['a', 'b', 'c', 'd']
    let d = last(abcd)
    t.equals(d, 'd', 'last function should return last element of array')
    d = 'e'
    t.deepEquals(abcd, ['a', 'b', 'c', 'd'], 'last function should not mutate source array')

    const abc = ['a', 'b', 'c']
    t.deepEquals(push(abc, 'd'), ['a', 'b', 'c', 'd'], 'push function should return a new array with an added item')
    t.deepEquals(abc, ['a', 'b', 'c'], 'push function should not mutate source array')

    const { addTrash, removeTrash, emptyTrash, copyTrash } = window

    const trashes1 = [[1, 2], [1, 2, 3]]
    const newTrashes1 = addTrash(trashes1, 4, d => d)
    t.deepEquals(newTrashes1, [[1, 2], [1, 2, 3], [1, 2, 3, 4]], 'addTrash should push a copy of the last bar with an element added')

    const trashes2 = [[1, 2], [1, 2, 3]]
    const newTrashes2 = removeTrash(trashes2)
    t.deepEquals(newTrashes2, [[1, 2], [1, 2, 3], [2, 3]], 'removeTrash should push a copy of the last bar with the first element removed')

    const trashes3 = [[1, 2], [1, 2, 3]]
    const newTrashes3 = emptyTrash(trashes3)
    t.deepEquals(newTrashes3, [[1, 2], [1, 2, 3], []], 'emptyTrash should push an empty array')

    const trashes4 = [[1, 2], [1, 2, 3]]
    const newTrashes4 = copyTrash(trashes4)
    t.deepEquals(newTrashes4, [[1, 2], [1, 2, 3], [1, 2, 3]], 'copyTrash should push a copy of the last bar')

    t.end()
})
