const path = require('path')
const test = require(path.resolve('.', 'bin/js/node_modules/tape'))
const JSDOM = require(path.resolve('.', 'bin/js/node_modules/jsdom')).JSDOM
const fs = require('fs')
const html = fs.readFileSync(path.resolve('.', '_site/scores/tutorial/index.html'), 'utf8')
const DOM = new JSDOM(html)
global.window = DOM.window
global.document = DOM.window.document

const VS = require(path.resolve('.', '_site/assets/js/vectorscores.js'))
const sampleSize = 1 // 5000000

const reportDistribution = function({ expected, actual }) {
    console.log('sample size:\t', sampleSize)
    console.log('expected:\t', expected)
    console.log('actual:\t', actual)
}

// TODO this would need very large sample size to be useful
test.skip('VS#getRandExcl', t => {
    const max = 1
    let results = []

    for (let i = 0; i < sampleSize; i++) {
        results.push(VS.getRandExcl(0, max))
    }

    const equalsMax = results.filter((v) => {
        return v === max
    })

    t.equal(equalsMax.length, 0, `not include max in sample size of ${sampleSize}`)

    t.end()
})

test('VS#getItem', { skip: sampleSize < 999 }, t => {
    const items = ['a', 'b', 'c', 'd', 'e']
    const weights = [0, 0, 0, 0, 0]
    let results = []

    for (let i = 0; i < sampleSize; i++) {
        results.push(VS.getItem(items))
    }

    const isAnItem = results.filter((v) => {
        return items.indexOf(v) !== -1
    })

    t.equal(isAnItem.length, results.length, 'return only items in list')

    t.test('VS#getItem distribution', t2 => {
        let weighting = results.reduce((acc, val) => {
            acc[items.indexOf(val)]++
            return acc
        }, weights).map(v => {
            return v / sampleSize
        })

        const probability = 1 / items.length

        reportDistribution({
            expected: weights.map(() => probability),
            actual: weighting
        })

        t2.end()
    })

    t.end()
})

test('VS#getWeightedItem', { skip: sampleSize < 999 }, t => {
    const items = ['a', 'b', 'c', 'd', 'e']
    const weights = [0.5, 0.25, 0.125, 0.0625, 0.0625]
    let results = []

    for (let i = 0; i < sampleSize; i++) {
        results.push(VS.getWeightedItem(items, weights))
    }

    const isAnItem = results.filter((v) => {
        return items.indexOf(v) !== -1
    })

    t.equal(isAnItem.length, results.length, 'return only items in list')

    t.test('VS#getWeightedItem distribution', t2 => {
        let weighting = results.reduce((acc, val) => {
            acc[items.indexOf(val)]++
            return acc
        }, [0, 0, 0, 0, 0]).map(v => {
            return v / sampleSize
        })

        reportDistribution({
            expected: weights,
            actual: weighting
        })

        t2.end()
    })

    t.end()
})

// TODO use JSDOM to test modal interaction, run as an integration test elsewhere
test.only('VS#getQueryString', t => {
    const url = 'http://localhost:4000/vectorscores/scores/adsr/?parts=4&showall=0'

    t.equal(VS.getQueryString('parts', url), '4', 'return value as string given query parameter that exists in url')
    t.equal(VS.getQueryString('foo', url), null, 'return null given query parameter that does not exist in url')

    t.end()
})

test('VS#makeQueryString', t => {
    t.equal(VS.makeQueryString({ a: '1' }), 'a=1', 'return query string')
    t.equal(VS.makeQueryString({ a: '1', b: '2' }), 'a=1&b=2', 'return query string joined by \'&\'')

    t.end()
})

test('VS#clamp', t => {
    t.equal(VS.clamp(11, 0, 5), 5, 'return max when value is greater than max')
    t.equal(VS.clamp(-11, 0, 5), 0, 'return min when value is less than min')
    t.equal(VS.clamp(2.5, 0, 5), 2.5, 'return value when value is between min and max')

    t.end()
})

test('VS#normalize', t => {
    const min = -5
    const max = 5

    t.equal(VS.normalize(5, min, max), 1, 'return 1 when value is max')
    t.equal(VS.normalize(0, min, max), 0.5, 'return 0.5 when value is midpoint between min and max')
    t.equal(VS.normalize(-5, min, max), 0, 'return 0 when value is min')

    t.end()
})

test('VS#constant', t => {
    const value = 5
    const c = VS.constant(value)

    t.equal(typeof c, 'function', 'be type \'function\'')
    t.equal(c(), value, 'return same value initialized with')

    t.end()
})

test('VS#mod', t => {
    t.equal(VS.mod(6, 12), 6, 'return 6 when 6 mod 12')
    t.equal(VS.mod(13, 12), 1, 'return 1 when 13 mod 12')

    t.end()
})
