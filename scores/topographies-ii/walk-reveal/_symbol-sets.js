var symbols = {},
    symbolOffsets = {},
    symbolScale = [];

switch (Math.floor(VS.getRandExcl(0, 4))) {
    case 1:
        symbols = Object.assign(VS.dictionary.Bravura.accidentals, VS.dictionary.Bravura.articulations);
        symbolOffsets = {
            ".": { x: -0.0625, y: 0.0625 },
            ">": { x: -0.1625, y: 0.125 },
            "-": { x: -0.1625, y: 0.03125 },
            //
            "-2": { x: -0.2, y: 0 }, // double flat
            "-1.5": { x: -0.225, y: 0 }, // three-quarter flat (backwards, forwards)
            "-1": { x: -0.1, y: 0 }, // flat
            "-0.5": { x: -0.1325, y: 0 }, // quarter flat (backwards)
            "0": { x: -0.0875, y: 0 }, // natural
        };
        symbolScale = ["-2", "-1.5", "-1", "-0.5", "0", "-", ">", "."];
        break;
    case 2:
        symbols = Object.assign(VS.dictionary.Bravura.accidentals);
        symbolOffsets = {
            "-2": { x: -0.2, y: 0 }, // double flat
            "-1.5": { x: -0.225, y: 0 }, // three-quarter flat (backwards, forwards)
            "-1": { x: -0.1, y: 0 }, // flat
            "-0.5": { x: -0.1325, y: 0 }, // quarter flat (backwards)
            "0": { x: -0.0875, y: 0 }, // natural
            "0.5": { x: -0.09, y: -0.025 }, // quarter sharp (single vertical stroke)
            "1": { x: -0.125, y: 0 }, // sharp
            "1.5": { x: -0.1625, y: 0 }, // three-quarter sharp (three vertical strokes)
            "2": { x: -0.125, y: 0 }  // double sharp
        };
        symbolScale = ["-2", "-1.5", "-1", "-0.5", "0", "0.5", "1", "1.5"];
        break;
    default:
        symbols = Object.assign(VS.dictionary.Bravura.durations.stemless, VS.dictionary.Bravura.articulations);
        symbolOffsets = {
            "0.25": { x: -0.025, y: -0.35 },
            "0.5": { x: -0.025, y: -0.25 },
            "1": { x: -0.175, y: 0 },
            "2":  { x: -0.175, y: 0 },
            //
            ".": { x: -0.0625, y: 0.0625 },
            ">": { x: -0.1625, y: 0.125 },
            "-": { x: -0.1625, y: 0.03125 },
        };
        symbolScale = ["-", "-", ">", ".", 2, 1, 0.5, 0.25];
}
