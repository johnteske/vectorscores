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

        _cards.push(thisCard); // console.log(thisCard);
    }
    return _cards;
}
cardList = makeCards(12);
