function makeCards(nCards) {
    for (var i = 0; i < nCards; i++) {
        var thisCard,
            lastCard = cardList[i - 1];
        do {
            var newCard = Math.floor(Math.random() * cardChoices.length);
        } while (cardChoices[newCard] == lastCard); // do not repeat cards
        cardList.push(cardChoices[newCard]);
    }
}
makeCards(12);
