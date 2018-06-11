//========================================================================================================================
// general functions
//========================================================================================================================

function createDeck() {
  // creates a deck with 6 decks of cards randomly shuffled in
  var shuffledDeck = [];
  var holderDeck = [];

  for (var i=0; i<4; i++) {
    holderDeck.push.apply(holderDeck, deckOfCards.slice(0));
  };

  while(holderDeck.length > 0) {
    var randomNumber = Math.floor(Math.random() * holderDeck.length);
    shuffledDeck.push(holderDeck[randomNumber]);
    holderDeck.splice(randomNumber, 1);
  };

  return shuffledDeck;
};


function dealCards(deck) {
  // deals 2 cards to player and 1 card to banker
  var player = [];
  var banker = [];

  for(var i=1; i<=3; i++) {
    var randomNumber = Math.floor(Math.random() * deck.length);

    if (i%2 === 1) {
        player.push(deck[randomNumber]);
        deck.splice(randomNumber, 1);
    } else {
        banker.push(deck[randomNumber]);
        deck.splice(randomNumber, 1);
    };
  };

  return [player, banker];
};

function drawACard(deck) {
  // draws a random card from the remaining deck
  var randomNumber = Math.floor(Math.random() * deck.length);
  var randomCard = deck[randomNumber];
  deck.splice(randomNumber, 1);

  return randomCard;
};

function appendPlayerCards(card) {
  var folder = "images/";
  var extension = ".png";
  var cardImage = folder + card + extension;

  $('#players-cards').append("<img style='display:none;' src='" + cardImage + "' class='card-images'/>");

  $('.card-images').fadeIn(700);
};

function appendBankerCards(card) {
  var folder = "images/";
  var extension = ".png";
  var cardImage = folder + card + extension;

  $('#bankers-cards').append("<img style='display:none;' src='" + cardImage + "' class='card-images' />");

  $('.card-images').fadeIn(700);
};

function displayPlayerPoints(playerPointArray) {
  if (playerPointArray[1]) {
      if (playerPointArray[0] === playerPointArray[1]) {
          $('#player-points').text(playerPointArray[0]);
      } else {
          $('#player-points').text(playerPointArray[0] + " or " + playerPointArray[1]);
      };

  } else {
      $('#player-points').text(playerPointArray[0])
  };
};

function displayBankerPoints(bankerPoints) {
  $('#banker-points').text(bankerPoints);
}

function updateBankerPoints(bankerPointsArray) {
  if (bankerPointsArray[1]) {
      if (bankerPointsArray[0] === bankerPointsArray[1]) {
          $('#banker-points').text(bankerPointsArray[0]);
      } else {
          $('#banker-points').text(bankerPointsArray[0] + " or " + bankerPointsArray[1]);
      };

  } else {
      $('#banker-points').text(bankerPointsArray[0])
  };
};

//========================================================================================================================
// player functions
//========================================================================================================================

function calculatePlayersPointsWith2Cards(player) {
  // calculates the inital score of the player with 2 cards and returns if player can split/has blackjack
  var points = 0;
  var otherPoints = 0;
  var split = false;
  var blackJack = false;

  for (var i=0; i<player.length; i++) {
    var card = parseInt( player[i].slice(0,-1) );

    switch(card) {
      case 1:
        points += 11;
        otherPoints += 1;
        break;
      case 11:
      case 12:
      case 13:
        points += 10;
        otherPoints += 10;
        break;

      default:
        points += card;
        otherPoints += card;
    };
  };

  if (parseInt( player[0].slice(0,-1) ) === parseInt( player[1].slice(0,-1) )) {
      split = true;
  };

  if (points === 21 && otherPoints === 11) {
    blackJack = true;
  };

  if (points === otherPoints) {
    otherPoints = false;
  };

  return [points, otherPoints, split, blackJack];
};


function calculatePlayersPointsWithMultipleCards(player) {
  // calculates the score of the players cards from 3 cards and above
  var points = 0;
  var otherPoints = 0;
  var hasAce = false;

  for (var i=0; i<player.length; i++) {
    var card = parseInt( player[i].slice(0,-1) );

    switch(card) {
      case 1:
        if (hasAce === false) {
            points += 11;
            hasAce = true;
        } else {
            points += 1;
        }
        otherPoints += 1;
        break;
      case 11:
      case 12:
      case 13:
        points += 10;
        otherPoints += 10;
        break;

      default:
        points += card;
        otherPoints += card;
    };
  };

  if (points === otherPoints) {
    otherPoints = false;
  };

  if (points > 21 && hasAce === true) {
    points = otherPoints;
  };

  return [points, otherPoints];
};

function checkIfPlayerBurst(points) {
  if (points > 21) {
    return true;
  };

  return false;
}

//========================================================================================================================
// banker functions
//========================================================================================================================

function evaluateBankersHand(bankersCards) {
  var holderValue = 0;
  var otherHolderValue = 0;
  var hasAce = false;
  var isSoft = false;
  var blackJack = false;

  for (var i=0; i<bankersCards.length; i++) {
    var cardValue = parseInt( bankersCards[i].slice(0,-1) );

    switch(cardValue) {
      case 11:
      case 12:
      case 13:
        holderValue += 10;
        otherHolderValue += 10;
        break;

      case 1:
        if (hasAce === false) {
            holderValue += 11;
            hasAce = true;
            isSoft = true;
        } else {
            holderValue += 1;
        }
        otherHolderValue += 1;
        break;

      default:
        holderValue += cardValue;
        otherHolderValue += cardValue;
        break;
    };
  };

  if (bankersCards.length === 2) {
      if (holderValue === 21) {
          return [holderValue, otherHolderValue, isSoft, blackJack];
      };
  };

  if (holderValue > otherHolderValue) {
    holderValue = otherHolderValue;
    isSoft = false;
  };

  if (holderValue === otherHolderValue) {
    otherHolderValue = false;
  };

  return [holderValue, otherHolderValue, isSoft, blackJack];
};

function bankerMove(bankersCards, deck) {

  var bankerPoints = 0;
  var blackjack = false;
  var noHard17 = true;
  var noSoft16 = true;

  while (noHard17 && noSoft16) {
    //========================================================================================================================
    // draw a card
    //========================================================================================================================
    var randomCard = drawACard(deck);
    bankersCards.push(randomCard);
    appendBankerCards(randomCard);

    //========================================================================================================================
    // evaluate score
    //========================================================================================================================
    var hasSufficientPoints = evaluateBankersHand(bankersCards);
    updateBankerPoints(hasSufficientPoints);

    if (hasSufficientPoints[3]) {
      bankerPoints = hasSufficientPoints[0];
      blackjack = true;
      return [bankerPoints, blackjack];
    };

    if (hasSufficientPoints[2] && hasSufficientPoints[0] >= 16) {
      noSoft16 = false;
      bankerPoints = hasSufficientPoints[0];
    } else if (hasSufficientPoints[2] === false && hasSufficientPoints[0] >= 17) {
      noHard17 = false;
      bankerPoints = hasSufficientPoints[0];
    };
  };
  return [bankerPoints];
};
