function makeCards(nCards) {
    var _cards = [];
    for (var i = 0; i < nCards; i++) {
        var thisCard = {},
            prevCard = _cards[i - 1] || {};

        do {
            thisCard.type = VS.getItem(cardChoices);
        } while (thisCard.type == prevCard.type); // do not repeat cards

        _cards.push(thisCard);
    }
    return _cards;
}
cardList = makeCards(12);
