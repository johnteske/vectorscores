/**
 * Beamed groups of notes (U+E220–U+E23F)
 * Only long stem glyphs selected
 * TODO standardize and integrate in Bravura dictionary as dict.durations.stemmed
 */
var stemmed = {
    " ": " ",
    ".": "\ue1e7", // dot
    "-": "\ue1f8", // beam, single
    "=": "\ue1fa", // beam, double
    "0.25": "\ue1d9", // sixteenth, with flag
    "=0.25": "\ue1f5", // sixteenth, leading beam
    "0.5": "\ue1d7", // eighth, with flag
    "-0.5": "\ue1f3", // eighth, leading beam
    "1": "\ue1f1", // quarter
    // "[": "\ue201",
    "trip": "\ue202",
    // "]": "\ue203"
    "r0.5": "\ue4e6",
};

var rhythms = [
    // 4/4
    // "1, ,1, ,r0.5, ,0.5, ,1,-,-0.5",
    "1, ,1, ,r0.5, ,0.5, ,1,-,-0.5", "1, ,1,-,-0.5, ,1,=,=0.25,=,=0.25,=,=0.25, ,1,-,-0.5",
    "1, ,1, ,r0.5,., ,0.25,1,.,-,=0.25", /* "1, ,1,.,-,=0.25, ,1,-,-0.5,-,-0.5,trip, ,1,.,-,=0.25", */
    "1,-,-0.5, ,1,-,-0.5,=,=0.25, ,1,=,=0.25,-,-0.5, ,1,-,-0.5", "1,-,-0.5, ,1, ,r0.5, ,0.5, ,1",
    // 2/4
    "1, ,1,-,-0.5",
    // "1, ,1,-,-0.5,-,-0.5,trip"
    "1,=,=0.25,=,=0.25,=,=0.25, ,1",
    /* "1,-,-0.5,-,-0.5,trip, ,1", */ "1,-,-0.5, ,1"
];
