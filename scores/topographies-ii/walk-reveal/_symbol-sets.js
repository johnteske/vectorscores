var symbolSet = {};

switch (+VS.getQueryString('symbols') || VS.getRandIntIncl(1, 4)) {
    case 1:
        symbolSet.strings =
        symbols = Object.assign(VS.dictionary.Bravura.accidentals, VS.dictionary.Bravura.durations.stemless, {
            min: '\uE4E5', // quarter rest
            max: '\uE4C4' // short fermata
        });

        symbolSet.offsets = {
            min: { x: -0.125, y: 0 },
            '-1.5': { x: -0.225, y: 0 }, // three-quarter flat (backwards, forwards)
            '-1': { x: -0.1, y: 0 }, // flat
            '-0.5': { x: -0.1325, y: 0 }, // quarter flat (backwards)
            '0': { x: -0.0875, y: 0 }, // natural
            '2':  { x: -0.175, y: 0 },
            '1': { x: -0.175, y: 0 },
            '0.5': { x: -0.025, y: -0.25 },
            '0.25': { x: -0.025, y: -0.35 },
            max: { x: -0.3, y: 0.175 }
        };

        symbolSet.scale = ['-1.5', '-1', '-0.5', '0', '2', '1', '0.5', '0.25'];

        break;
    case 2:
        symbolSet.strings =
        symbols = Object.assign(VS.dictionary.Bravura.accidentals, {
            min: '\uE4C1', // long fermata, flipped
            under: '\uE4BA',
            over: '\uE4BB',
            max: '\uE4C4' // short fermata
        });

        symbolSet.offsets = {
            min: { x: -0.3, y: -0.16 },
            under: { x: -0.185, y: 0},
            over: { x: -0.185, y: 0},
            '0': { x: -0.0875, y: 0 }, // natural
            '0.5': { x: -0.09, y: -0.025 }, // quarter sharp (single vertical stroke)
            '1': { x: -0.125, y: 0 }, // sharp
            '1.5': { x: -0.1625, y: 0 }, // three-quarter sharp (three vertical strokes)
            max: { x: -0.3, y: 0.175 }
        };

        symbolSet.scale = ['under', 'under', 'over', 'over', '0', '0.5', '1', '1.5'];

        break;
    case 3:
        symbolSet.strings =
        symbols = Object.assign(VS.dictionary.Bravura.durations.stemless, {
            min: '\uE4C6', // long fermata
            graceAcc: '\uE560',
            graceApp: '\uE562',
            irrTremolo: '\uE22B',
            mordent: '\uE56C',
            max: '\uE537' // sfp
        });

        symbolSet.offsets = {
            min: { x: -0.3, y: 0.1625 },
            '8':  { x: -0.35, y: 0 },
            '4':  { x: -0.225, y: 0 },
            '2':  { x: -0.175, y: 0 },
            '1': { x: -0.175, y: 0 },
            irrTremolo: { x: 0, y: 0 },
            mordent: { x: -0.35, y: 0.125 },
            graceApp: { x: -0.1, y: 0 },
            graceAcc: { x: -0.1, y: 0 },
            max: { x: -0.4, y: 0.135 }
        };

        symbolSet.scale = [8, 4, 2, 1, 'irrTremolo', 'mordent', 'graceApp', 'graceAcc'];

        break;
    case 4:
    default:
        symbolSet.strings =
        symbols = Object.assign(VS.dictionary.Bravura.durations.stemless, VS.dictionary.Bravura.articulations, {
            min: '\uE4C1', // long fermata, flipped
            max: '\uE4C4' // short fermata
        });

        symbolSet.offsets = {
            min: { x: -0.3, y: -0.16 },
            '-': { x: -0.1625, y: 0.03125 },
            '>': { x: -0.1625, y: 0.125 },
            '.': { x: -0.0625, y: 0.0625 },
            '2':  { x: -0.175, y: 0 },
            '1': { x: -0.175, y: 0 },
            '0.5': { x: -0.025, y: -0.25 },
            '0.25': { x: -0.025, y: -0.35 },
            max: { x: -0.3, y: 0.175 }
        };

        symbolSet.scale = ['-', '-', '>', '.', 2, 1, 0.5, 0.25];
}
