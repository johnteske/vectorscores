cardTypes = {
    "A": {
        numberOfNotes: [1, 5], // low limit, high limit
        dynamics: ["pp", "p", "mp"],
        spread: {x: 0, y: 0}, // single note
        pcSet: [0, 1, 3]
    },
    "B": {
        numberOfNotes: [1, 10],
        dynamics: ["p", "mp"],
        spread: {x: 0, y: 25}, // chord, cluster
        pcSet: [0, 1, 4]
    },
    "C": {
        numberOfNotes: [6, 15],
        dynamics: ["mp", "mf"],
        spread: {x: 50, y: 0}, // rhythm
        pcSet: [0, 1, 5]
    },
    "D": {
        numberOfNotes: [11, 20],
        dynamics: ["mf", "f"],
        spread: {x: 50, y: 25}, // rect cloud
        pcSet: [0, 2, 5]
    },
    "E": {
        numberOfNotes: [16, 25],
        dynamics: ["f", "ff", "fff"],
        spread: {x: 35, y: 35}, // cloud
        pcSet: [0, 2, 6]
    }
};

function makeCards(nCards) {
    var _cards = [];
    for (var i = 0; i < nCards; i++) {
        var thisCard = {},
            thisCardType,
            prevCard = _cards[i - 1] || { time: 0 };

        // set unique type
        do {
            thisCard.type = VS.getItem(Object.keys(cardTypes)); // TODO what is the support of Object.keys?
        } while (thisCard.type === prevCard.type);

        thisCardType = cardTypes[thisCard.type];

        // set card start time
        thisCard.time = prevCard.time + VS.getRandExcl(5000, 8000);
        // thisCard.duration // could also/instead set duration for each card

        thisCard.nNotes = d3.range(Math.floor(VS.getRandExcl(
            thisCardType.numberOfNotes[0], thisCardType.numberOfNotes[1]
        )));

        thisCard.spread = thisCardType.spread;

        thisCard.dynamic = VS.getItem(thisCardType.dynamics);

        thisCard.pcSet = thisCardType.pcSet;

        _cards.push(thisCard); // console.log(thisCard);
    }
    return _cards;
}
cardList = makeCards(12);
