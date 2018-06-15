function cardCounter(card) {
  var newCard = parseInt(card.slice(0,-1));

  switch(newCard) {
    case 1:
    case 10:
    case 11:
    case 12:
    case 13:
      cardCount -= 1;
      break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      cardCount += 1;
      break;
  };

  $('#card-count').text(cardCount);
};

function displayTrueCount(count, deck) {
  var currentDeck = deck.length
  var numberOfDecks = Math.round(currentDeck/52);
  var trueCount = Math.round(count/numberOfDecks);

  $('#true-count').text(trueCount);
};

function displayNumberOfCardsInDeck(deck) {
  $('#deck').text(deck.length);
};
