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

    for (var i = 0; i < 3; i++) {
        score.push({
            duration: 3,
            globjects: [VS.getItem(descending)],
            pitch: [
                [
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
                [
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
                [
                    {
                        time: 0,
                        classes: [0, 3, 7],
                        modifier: "v"
                    }
                ],
            ][i],
            tempo: 60
        });
    }

    /**
     *
     */
    var ascending = globjects.filter(function(g) {
        return g.contour === "ascending";
    });

    score.push({
        duration: 6,
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
    });

    /**
     * march
     * TODO select multiple (will need to pass all score events as array)
     */
    var allGlobjects = globjects.concat(retrogradeGlobjects);

    for (i = 0; i < 3; i++) {
        score.push({
            duration: 3,
            globjects: [VS.getItem(allGlobjects)],
            pitch: [
                [
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
                [
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
                [
                    {
                        time: 0,
                        classes: [0, 3, 7],
                        modifier: ""
                    }
                ],
            ][i],
            tempo: 120
        });
    }

    return score;
})([]);
