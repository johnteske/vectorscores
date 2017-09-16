var score = [];

(function() {
    var bars = [
        // <
        {
            duration: 3000,
            types: ["glob"],
            range: [0, 0],
            dynamics: "n",
            pitch: { set: [] }
        },
        // A
        {
            types: ["glob"],
            range: [1, 4],
            dynamics: "pp",
            pitch: { set: [0, 1, 2] }
        },
        {
            types: ["glob"],
            range: [1, 4],
            dynamics: "p",
            pitch: { set: [0, 1, 4] }
        },
        // B
        {
            types: ["glob", "chord"],
            range: [3, 7],
            dynamics: "mf",
            pitch: { set: [0, 1, 6] }
        },
        {
            types: ["glob", "chord"],
            range: [3, 7],
            dynamics: "mf",
            pitch: { set: [0, 2, 6] }
        },
        {
            types: ["glob", "chord"],
            range: [3, 7],
            dynamics: "mf",
            pitch: { set: [0, 1, 3] }
        },
        // C
        {
            types: ["glob"],
            range: [3, 13],
            dynamics: "mp",
            pitch: { set: [0, 1, 4] }
        },
        {
            types: ["rhythm"],
            range: [3, 13],
            dynamics: "p",
            pitch: { set: [0, 2, 5] }
        },
        {
            types: ["glob", "rhythm"],
            range: [3, 13],
            dynamics: "mp",
            pitch: { set: [0, 1, 5] }
        },
        // D
        {
            types: ["glob"],
            range: [12, 19],
            dynamics: "mf",
            pitch: { set: [0, 1, 3] }
        },
        {
            types: ["glob"],
            range: [12, 25],
            dynamics: "ff",
            pitch: { set: [0, 1, 4, 6] }
        },
        {
            types: ["glob"],
            range: [12, 25],
            dynamics: "f",
            pitch: { set: [0, 1, 4] }
        },
        // E
        {
            types: ["glob", "chord", "rhythm"],
            range: [12, 25],
            dynamics: "mf",
            pitch: { set: [0, 2, 6] }
        },
        {
            types: ["glob", "chord", "rhythm"],
            range: [12, 25],
            dynamics: "mp",
            pitch: { set: [0, 1, 6] }
        },
        {
            types: ["glob", "chord", "rhythm"],
            range: [12, 25],
            dynamics: "p",
            pitch: { set: [0, 2, 5] }
        },
        // F
        {
            types: ["glob", "chord"],
            range: [1, 25],
            dynamics: "pp",
            pitch: { set: [0, 1, 5] }
        },
        {
            types: ["glob", "rhythm"],
            range: [1, 4],
            dynamics: "ppp",
            pitch: { set: [0, 1, 3] }
        },
        // >
        {
            duration: 3000,
            types: ["glob"],
            range: [0, 0],
            dynamics: "n",
            pitch: { set: [] }
        }
    ];

    var globules0 = [],
        globules1 = [],
        globules2 = [];

    function randInt(min, max) {
        return Math.floor(VS.getRandExcl(min, max));
    }

    function createGlobules(globules, n) {
        globules = globules.slice(0, n);

        for (var i = 0; i < (n - globules.length); i++) {
            globules.push(VS.getItem([1, 2, 4]));
        }

        return globules;
    }

    var time = 0;
    var transpose = 12; // TODO fix pitch class module to transponse below 0

    for(var i = 0; i < bars.length; i++) {
        var bar = bars[i],
            range = bar.range;

        globules0 = createGlobules(globules0, randInt(range[0], range[1]));
        globules1 = createGlobules(globules1, randInt(range[0], range[1]));
        globules2 = createGlobules(globules2, randInt(range[0], range[1]));

        bar.pitch.transpose = transpose;

        score.push({
            globs: [
                {
                    type: VS.getItem(bar.types),
                    durations: globules0,
                },
                {
                    type: VS.getItem(bar.types),
                    durations: globules1,
                },
                {
                    type: VS.getItem(bar.types),
                    durations: globules2,
                }
            ],
            dynamics: bar.dynamics,
            pitch: bar.pitch
        });

        VS.score.add(time, update, [transitionTime.long, score[i]]);

        time += (bar.duration || globInterval);
        transpose += VS.getItem([-2, -1, 0, 1, 2]);
    }

    // final event
    VS.score.add(time, VS.noop);
}());
