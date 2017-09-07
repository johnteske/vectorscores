/**
 * TODO proto globjects are combined into phrases, not directly used
 */
var score = (function(score) {
    /**
     * dirge
     */
    var descending = globjects.filter(function(g) {
        return g.contour === "descending";
    });

    function clone(o) {
        return JSON.parse(JSON.stringify(o));
    }

    // TODO stashing is a quick fix--create independent layers
    var stashedEvent = {
        time: 0,
        duration: 46.67,
        globjects: [VS.getItem(descending)],
        pitch: [
            {
                time: 0,
                classes: [0],
                modifier: "-"
            },
            {
                time: 1,
                classes: [0, 3],
                modifier: ""
            }
        ],
        tempo: 0
    };
    score.push(stashedEvent);

    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 16;
    stashedEvent.tempo = 60;
    score.push(stashedEvent);

    score.push({
        time: 46.667,
        duration: 46.67,
        globjects: [VS.getItem(descending)],
        pitch: [
            {
                time: 0,
                classes: [0, 3],
                modifier: "-"
            },
            {
                time: 1,
                classes: [0, 3, 7],
                modifier: ""
            }
        ],
        tempo: 60
    });

    stashedEvent = {
        time: 85.333,
        duration: 46.67,
        globjects: [VS.getItem(descending)],
        pitch: [
            {
                time: 0,
                classes: [0, 3, 7],
                modifier: "v"
            }
        ],
        tempo: 60
    };
    score.push(stashedEvent);

    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 112;
    stashedEvent.tempo = 0;
    score.push(stashedEvent);

    /**
     *
     */
    var ascending = globjects.filter(function(g) {
        return g.contour === "ascending";
    });

    stashedEvent = {
        time: 144,
        duration: 96,
        globjects: [VS.getItem(ascending)],
        pitch: [
            {
                time: 0,
                classes: [5],
                modifier: "^"
            },
            {
                time: 0.5,
                classes: [5, 9],
                modifier: "^"
            },
            {
                time: 1,
                classes: [5, 9, 0],
                modifier: ""
            }
        ],
        tempo: 0
    };
    score.push(stashedEvent);

    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 208;
    stashedEvent.tempo = 120;
    score.push(stashedEvent);

    /**
     * march
     * TODO select multiple (will need to pass all score events as array)
     */
    var allGlobjects = globjects.concat(retrogradeGlobjects);

    score.push({
        time: 240,
        duration: 24,
        globjects: [VS.getItem(allGlobjects)],
        pitch: [
            {
                time: 0,
                classes: [0],
                modifier: "<"
            },
            {
                time: 1,
                classes: [0, 3],
                modifier: ""
            }
        ],
        tempo: 120
    });

    score.push({
        time: 264,
        duration: 24,
        globjects: [VS.getItem(allGlobjects)],
        pitch: [
            {
                time: 0,
                classes: [0, 3],
                modifier: "<"
            },
            {
                time: 1,
                classes: [0, 3, 7],
                modifier: ""
            }
        ],
        tempo: 120
    });

    stashedEvent = {
        time: 288,
        duration: 24,
        globjects: [VS.getItem(allGlobjects)],
        pitch: [
            {
                time: 0,
                classes: [0, 3],
                modifier: "<"
            },
            {
                time: 1,
                classes: [0, 3, 7],
                modifier: ""
            }
        ],
        tempo: 120
    };
    score.push(stashedEvent);

    stashedEvent = clone(stashedEvent);
    stashedEvent.time = 304;
    stashedEvent.tempo = 0;
    score.push(stashedEvent);

    score.push({
        time: 312,
        duration: 24,
        globjects: [VS.getItem(allGlobjects)],
        pitch: [
            {
                time: 0,
                classes: [0, 3, 7],
                modifier: ""
            }
        ],
        tempo: 0
    });

    return score;
})([]);
