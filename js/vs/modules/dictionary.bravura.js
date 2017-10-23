---
layout: compress-js
---
VS.dictionary = VS.dictionary || {};

VS.dictionary.Bravura = (function() {
    var dict = {};

    dict.accidentals = {
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

    dict.articulations = {
        "x":    "\ue0a9",   // x notehead
        ">":    "\uf475",   // or "\uf476",
        ".":    "\uf477",   // or "\uf478",
        "-":    "\uf479",   // or "\uf47a",
        "tie": "\ue550",
        "l.v.": "\ue552",    // or "\ue551"
        "bartok": "\ue630"
    };

    dict.durations = {};
    // TODO can break down into noteheads, stemmed notes, flags (w/, w/o stems), etc. when more to add

    dict.durations.stemless = (function() {
        var _dot = "\u2009\uf477"; // &thinsp; + Bravura dot

        return {
            "0.2":  "\uf48d",        // TODO using sixteenth flag, for ad;sr only
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
    })();

    dict.dynamics = {
        "n":    "\ue526",
        "ppp":  "\ue52a",
        "pp":   "\ue52b",
        "p":    "\ue520",
        "mp":   "\ue52c",
        "mf":   "\ue52d",
        "f":    "\ue522",
        "ff":   "\ue52f",
        "fff":  "\ue530",
        "<":    "\ue53e",
        ">":    "\ue53f"
        // "<>":   "\ue540" // hairpin
    };

    return dict;
})();
