var pitchedPart = (function() {
    function getRandAndRemove(array) {
        var i = Math.floor(VS.getRandExcl(0, array.length));
        return array.splice(i, 1);
    }

    var part = [];

    /**
     * dirge
     */
    var descending = globjects.filter(function(g) {
        return g.contour === 'descending';
    });

    // A
    // mm 1    var stashedEvent = {};
    part.push({
        time: 0,
        duration: 46.67,
        globjects: getRandAndRemove(descending),
        pitch: [
            {
                time: 0,
                classes: [0]
            },
            {
                time: 1,
                classes: [0, 3]
            }
        ],
        phraseType: '',
        dynamics: [
            { time: 0, value: 'pp' },
            { time: 0.25, value: '<' },
            { time: 0.5, value: 'p' },
            { time: 0.75, value: '>' },
            { time: 1, value: 'pp' }
        ]
    });

    return part;
}());
