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

        _cards.push(thisCard);
    }
    return _cards;
}
cardList = makeCards(12);
