// TODO could the card types be an object of their own rather than
// setting their properties individually when creating cards?
function makeCards(nCards) {
    var _cards = [];
    for (var i = 0; i < nCards; i++) {
        var thisCard = {},
            prevCard = _cards[i - 1] || { time: 0 };

        // set unique type
        do {
            thisCard.type = VS.getItem(cardChoices);
        } while (thisCard.type == prevCard.type);

        // set card start time
        thisCard.time = prevCard.time + VS.getRandExcl(3000, 8000);
        // thisCard.duration // could also/instead set duration for each card

        thisCard.nNotes = d3.range(Math.floor({
            "A": VS.getRandExcl(1, 5),
            "B": VS.getRandExcl(1, 10),
            "C": VS.getRandExcl(6, 15),
            "D": VS.getRandExcl(11, 20),
            "E": VS.getRandExcl(16, 25)
        }[thisCard.type]));

        thisCard.spread = {
            "A": {x: 0, y: 0}, // single note
            "B": {x: 0, y: 25}, // chord, cluster
            "C": {x: 50, y: 0}, // rhythm
            "D": {x: 50, y: 25}, // rect cloud
            "E": {x: 35, y: 35} // cloud
        }[thisCard.type];

        thisCard.dynamic = {
            "A": VS.getItem(["pp", "p", "mp"]),
            "B": VS.getItem(["p", "mp"]),
            "C": VS.getItem(["mp", "mf"]),
            "D": VS.getItem(["mf", "f"]),
            "E": VS.getItem(["f", "ff", "fff"])
        }[thisCard.type];

        thisCard.pcSet = {
            "A": [0, 1, 3],
            "B": [0, 1, 4],
            "C": [0, 1, 5],
            "D": [0, 2, 5],
            "E": [0, 2, 6]
        }[thisCard.type];

        _cards.push(thisCard); // console.log(thisCard);
    }
    return _cards;
}
cardList = makeCards(12);
