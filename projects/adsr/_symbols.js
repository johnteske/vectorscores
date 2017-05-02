var pitchDict = {
    "-2":   "\ue264", // double flat
    "-1.5": "\ue281", // three-quarter flat (backwards, forwards)
    "-1":   "\ue260", // flat
    "-0.5": "\ue280", // quarter flat (backwards)
    "0":    "\ue261", // natural
    "0.5":  "\ue282", // quarter sharp (single vertical stroke)
    "1":    "\ue262", // sharp
    "1.5":  "\ue283", // three-quarter sharp (three vertical strokes)
    "2":    "\ue263"  // double sharp
};

// a little cartoonish--but consistent
var _dot = "\u2009\uf477"; // &thinsp; + Bravura dot
var durDict = {
    // noteheads and flags (no stems)
    "0":    "\ue0a9",        // x
    // "0.2":  "\uea57",        // small 5 (test, will be replaced)
    "0.2":  "\uf48d",        // using sixteenth flag
    "0.25": "\uf48d",        // sixteenth flag
    "0.5":  "\uf48b",        // eighth flag
    "0.75": "\uf48b" + _dot, // , dot
    "1":    "\uf46a",        // quarter notehead
    "1.5":  "\uf46a" + _dot, // , dot
    "2":    "\uf469",        // half notehead
    "3":    "\uf469" + _dot, // , dot
    "4":    "\uf468",        // whole note
    "6":    "\uf468" + _dot, // , dot
    "8":    "\uf467"         // double whole note
};

var artDict = {
    ">":    "\uf475",
    // ">":    "\uf476",
    ".":    "\uf477",
    // ".":    "\uf478",
    "-":    "\uf479",
    // "-":    "\uf47a",
    "tie": "\ue550",
    // "l.v.": "\ue551", // longer
    "l.v.": "\ue552", // longerer
    "bartok": "\ue630"
};
