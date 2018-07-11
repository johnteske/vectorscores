const path = require('path')
const { test } = require(path.resolve('.', 'bin/js/tape-setup'))

test.only('trashfire', t => {

    const trashActions = ['a', 'r', 'a', 'a', 'r', 'a', 'a', 'a', 'e']
    console.log(trashActions)

    const last = array => array.slice(-1)[0] || []

    const addTrash = (acc) => {
        const lastTrashList = last(acc)
        const newTrashList = [].concat(lastTrashList, 't')
        acc.push(newTrashList)
        return acc
    }

    const removeTrash = (acc) => {
        const lastTrashList = last(acc)
        const newTrashList = lastTrashList.slice(1)
        acc.push(newTrashList)
        return acc
    }

    const emptyTrash = (acc) => {
        acc.push([])
        return acc
    }

    const trashes = trashActions.reduce((acc, action) => {
        const actions = {
            a: addTrash,
            r: removeTrash,
            e: emptyTrash
        }
        return actions[action](acc)
    }, [])

    console.log(trashes)

    const zipped = trashActions.map((d, i) => {
        return {
            action: d,
            trashes: trashes[i]
        }
    })

    console.log(zipped)

    t.end()
})
