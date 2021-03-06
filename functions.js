//====================================================
// RESETING OF BUTTONS
//====================================================
function resetButtons() {
  $('#split').fadeOut(1000);
  $('#stand').fadeOut(1000);
  $('#hit').fadeOut(1000, function() {
    $('#deal').fadeIn(1000);
    $('#poker-chips-holder').fadeIn(1000);
  });
};

//====================================================
// CREATING A RANDOM DECK WITH 4 DECKS OF CARDS
//====================================================
function createDeck() {
  // creates a deck with 6 decks of cards randomly shuffled in
  var shuffledDeck = [];
  var holderDeck = [];

  for (var i=0; i<8; i++) {
    holderDeck.push.apply(holderDeck, deckOfCards.slice(0));
  };

  while(holderDeck.length > 0) {
    var randomNumber = Math.floor(Math.random() * holderDeck.length);
    shuffledDeck.push(holderDeck[randomNumber]);
    holderDeck.splice(randomNumber, 1);
  };

  return shuffledDeck;
};

function checkIfDeckNeedsToBeReshuffled(deck) {
  if (deck.length <= 52) {
    return true;
  };

  return false;
};

//====================================================
// RANDOMLY ASSIGN THE PLAYER 2 CARDS AND BANKER 1 CARD
//====================================================
function dealCards(deck) {
  // deals 2 cards to player and 1 card to banker
  var player = [];
  var banker = [];

  for(var i=1; i<=3; i++) {
    var randomNumber = Math.floor(Math.random() * deck.length);

    if (i%2 === 1) {
        cardCounter(deck[randomNumber]);
        player.push(deck[randomNumber]);
        deck.splice(randomNumber, 1);
        displayTrueCount(cardCount, deck);
        displayNumberOfCardsInDeck(deck);
    } else {
        cardCounter(deck[randomNumber]);
        banker.push(deck[randomNumber]);
        deck.splice(randomNumber, 1);
        displayTrueCount(cardCount, deck);
        displayNumberOfCardsInDeck(deck);
    };
  };

  return [player, banker];
};


//====================================================
// DRAW A RANDOM CARD
//====================================================
function drawACard(deck) {
  // draws a random card from the remaining deck
  var randomNumber = Math.floor(Math.random() * deck.length);
  var randomCard = deck[randomNumber];
  deck.splice(randomNumber, 1);

  return randomCard;
};


//====================================================
// ANIMATE PLAYERS CARDS
//====================================================
function appendPlayerCards(card, whichPlayer) {
  var folder = "images/";
  var extension = ".png";
  var cardImage = folder + card + extension;

  if (whichPlayer === 2) {
      $('#players-cards2').append("<img style='display:none;' src='" + cardImage + "' class='card-images'/>");

      $('#players-cards2 img').fadeIn(700);
  } else {
      $('#players-cards').append("<img style='display:none;' src='" + cardImage + "' class='card-images'/>");

      $('#players-cards img').fadeIn(700);
  };
};

//====================================================
// ANIMATE BANKERS CARDS
//====================================================
function appendBankerCards(card) {
  var folder = "images/";
  var extension = ".png";
  var cardImage = folder + card + extension;

  $('#bankers-cards').append("<img style='display:none;' src='" + cardImage + "' class='card-images' />");

  $('.card-images').fadeIn(700);
};

//====================================================
// CHECK FOR BLACKJACK
//====================================================
function checkForBlackJack(arrayOfCards) {
  var hasBlackJack = false;
  var points = 0;

  if (arrayOfCards.length !== 2) {
      return hasBlackJack
  };

  for (var i = 0; i < arrayOfCards.length; i++) {
    var number = parseInt( arrayOfCards[i].slice(0, -1) );

    switch (number) {
      case 1:
        points += 11;
        break;
      case 11:
      case 12:
      case 13:
        points += 10;
        break;
      default:
        points += number;
        break;
    };
  };

  if (points === 21) {
    hasBlackJack = true;
  };

  return hasBlackJack;
};

//====================================================
// MANIPULATE DOM TO INLCUDE SPACE FOR PLAYER 2 WHEN SPLIT
//====================================================
function appendPlayer2Block() {
  $('#player1').attr('class', 'col-6');
  $('#player1').clone().attr('id', 'player2').appendTo('#player-cards-holder');
  $('#player2 div').attr('id', 'players-cards2');
  $('#players-cards2 p').html("<p class='title'>Player 2: <span id='player-points-2'></span></p>");

  $('#players-cards2 p span').attr('id', 'player-points2');
}

//====================================================
// UPDATE DOM TO UPDATE CARDS AND IMAGES WHEN SPLIT
//====================================================
function updatePlayerBlocks(arrayOfCards) {
  var holderArray = arrayOfCards.slice(0);

  player1Card = [ holderArray[0] ];
  player2Card = [ holderArray[1] ];

  $('#players-cards img').remove();
  $('#players-cards2 img').remove();

  appendPlayerCards(player1Card[0], 1);
  appendPlayerCards(player2Card[0], 2);
};

function drawCardForSplitCase() {
  var randomCard1 = drawACard(newDeck);
  var randomCard2 = drawACard(newDeck);

  // update card counter for player 1
  cardCounter(randomCard1);

  // update card counter for player 2
  cardCounter(randomCard2);

  // update true count and deck size
  displayTrueCount(cardCount, newDeck);
  displayNumberOfCardsInDeck(newDeck);

  player1Card.push(randomCard1);
  appendPlayerCards(randomCard1, 1);
  displayPlayerPoints(player1Card, 1);

  player2Card.push(randomCard2);
  appendPlayerCards(randomCard2, 2);
  displayPlayerPoints(player2Card, 2);
}

//====================================================
// REMOVE DOM ELEMENT FOR PLAYER 2 WHEN SPLIT ROUND ENDS
//====================================================
function removePlayer2Block() {
  $('#player2').remove();
  $('#player1').attr('class', 'col');
  player2Card = null;
  whichPlayersTurn = false;
  $('#player-turn-indicator').text("");
};

//===========================================================================
// game functions
//===========================================================================


//====================================================
// CHECK IF PLAYER CAN SPLIT HIS CARDS
//====================================================
function playerCanSplit(arrayOfCards) {
  var canSplit = false;

  var cardOne = parseInt( arrayOfCards[0].slice(0, -1) )
  var cardTwo = parseInt( arrayOfCards[1].slice(0, -1) )

  if (cardOne === cardTwo) {
    canSplit = true;
  };

  return canSplit;
};


//====================================================
// CALCULATE POINTS
//====================================================
function calculatePoints(arrayOfCards) {
  var softAcePoints = 0;
  var hardAcePoints = 0;
  var hasAce = false;

  for (var i = 0; i < arrayOfCards.length; i++) {
    var number = parseInt( arrayOfCards[i].slice(0, -1) );

    switch (number) {
      case 11:
      case 12:
      case 13:
        softAcePoints += 10;
        hardAcePoints += 10;
        break;

      case 1:
        // calculate hand value with ace
        // basically if user will never have 2 aces that are valued at 11. so after the first one, the subsequent ones will always count for 1 point
        if (hasAce === false) {
            softAcePoints += 11;
            hasAce = true;
        } else {
            softAcePoints += 1;
        };
        hardAcePoints += 1;
        break;

      default:
        softAcePoints += number;
        hardAcePoints += number;
    };
  };

  if (hasAce) {
    // if the user has an ace
    if (softAcePoints > 21) {
      // and if we take ace at 11 the user burst
      // means we can only take ace as 1, which will be
      // hard ace value
      softAcePoints = hardAcePoints;
      hasAce = false;
    };
  };

  return [softAcePoints, hardAcePoints, hasAce];
};



//====================================================
// UPDATE DOM TO DISPLAY POINTS
//====================================================
function displayPlayerPoints(arrayOfPlayerCards, whichPlayer) {
  var points = calculatePoints(arrayOfPlayerCards);

  if (points[2]) {
      // means the player has an Ace
      if (points[0] > points[1]) {
        var text = points[0] + " or " + points[1]

        if (whichPlayer === 2) {
            $('#player-points2').text(text);
        } else {
            $('#player-points').text(text);
        };
      } else {
          if (whichPlayer === 2) {
              $('#player-points2').text(points[0]);
          } else {
              $('#player-points').text(points[0]);
          };
      };
  } else {
      if (whichPlayer === 2) {
          $('#player-points2').text(points[0]);
      } else {
          $('#player-points').text(points[0]);
      };
  };
};


//====================================================
// UPDATE DOM TO DISPLAY POINTS
//====================================================
function displayBankerPoints(arrayOfBankerCards) {
  var points = calculatePoints(arrayOfBankerCards);

  if (points[2]) {
      // means the banker has an Ace
      if (points[0] > points[1]) {
        var text = points[0] + " or " + points[1]
        $('#banker-points').text(text);
      } else {
        $('#banker-points').text(points[0]);
      };
  } else {
      $('#banker-points').text(points[0]);
  };
};


//====================================================
// CHECK IF PLAYER BURSTS
//====================================================
function checkIfBurst(arrayOfCards) {
  var burst = false;
  var points = calculatePoints(arrayOfCards);

  if (points[0] > 21) {
    burst = true;
  };

  return burst;
};


//====================================================
// BANKER TURN SEQUENCE
//====================================================

//====================================================
// REFLECT WIN OR LOSE
//====================================================
function comparePoints(playerPoints, bankerPoints) {
  switch(true) {
    case (playerPoints === bankerPoints):
      playerDraw();
      return "Draw";

    case (playerPoints > bankerPoints):
      playerNormalWinnings();
      return "Player Wins";

    case (bankerPoints > playerPoints && bankerPoints <= 21):
      return "Banker Wins";

    default:
      playerNormalWinnings();
      return "Player Wins";
  };
};

function checkBankerWinOrLose() {
  var bankerPoints = calculatePoints(bankerCard);
  var bankerHasBlackJack = checkForBlackJack(bankerCard);

  if (whichPlayersTurn !== false) {
      if (bankerHasBlackJack) {
          $('#game-result').text("Banker Blackjack");
          setTimeout(function() {
            $('#overlay').fadeIn(500);
            resetButtons();
          }, 1000);
      } else {
          //====================================================
          // GRAB THE POINTS OF PLAYERS 1 AND 2
          //====================================================
          if (typeof player1Card !== 'string') {
              var player1Points = calculatePoints(player1Card);
              var result1 = comparePoints(player1Points[0], bankerPoints[0]);
          } else {
              if (player1Card === "Player 1 Blackjack") {
                  var result1 = player1Card;
              } else {
                  var result1 = "Banker Wins";
              };
          };

          if (typeof player2Card !== 'string') {
              var player2Points = calculatePoints(player2Card);
              var result2 = comparePoints(player2Points[0], bankerPoints[0]);
          } else {
              if (player2Card === "Player 2 Blackjack") {
                  var result2 = player2Card;
              } else {
                  var result2 = "Banker Wins";
              };
          };

          $('#game-result').text(result1 + " | " + result2);
          setTimeout(function() {
            $('#overlay').fadeIn(500);
            resetButtons();
          }, 1000);
      };
  } else {
      //====================================================
      // ONLY ONE PLAYER
      //====================================================
      if (bankerHasBlackJack) {
          $('#game-result').text("Banker Has Blackjack");
          setTimeout(function() {
            $('#overlay').fadeIn(500);
            resetButtons();
          }, 1000);
      } else {
          var playerPoints = calculatePoints(player1Card);
          var result = comparePoints(playerPoints[0], bankerPoints[0]);
          $('#game-result').text(result);
          setTimeout(function() {
            $('#overlay').fadeIn(500);
            resetButtons();
          }, 1000);
      };
  };
};


function animateDrawingOfCards(arrayOfCards, deck) {
  $('#split').fadeOut(1000);
  $('#stand').fadeOut(1000);
  $('#hit').fadeOut(1000);

  var bankerIsDrawingCards = setInterval(function() {

      //====================================
      // BANKER DRAW A RANDOM CARD
      //====================================
      var randomCard = drawACard(deck);
      arrayOfCards.push(randomCard);

      // update card count
      cardCounter(randomCard);
      displayTrueCount(cardCount, newDeck);
      displayNumberOfCardsInDeck(newDeck);

      //====================================
      // ANIMATE ACCORDINGLY
      //====================================
      appendBankerCards(randomCard);
      displayBankerPoints(arrayOfCards);
      var points = calculatePoints(arrayOfCards);

      //====================================
      // CHECK IF SUFFICIENT
      //====================================
      if (points[2]) {
          // check for blackjack first
          if (arrayOfCards.length === 2) {
              var bankerHasBlackJack = checkForBlackJack(arrayOfCards);
              if (bankerHasBlackJack) {
                  clearTimeout(bankerIsDrawingCards);
                  checkBankerWinOrLose();
                  // return true;
              };
          };

          if (points[0] >= 16) {
              // this part will never trigger if ace is taken as 1
              // because we set points[2], which is has ace to false
              // and if softace is 16
              // dont need to do anything
              clearTimeout(bankerIsDrawingCards);
              checkBankerWinOrLose();
              // return points;
          }

      } else {
          // if banker has no ace or if ace is taken as 1 
          if (points[0] >= 17) {
              // can stand on hard 17
              // dont need do anything
              clearTimeout(bankerIsDrawingCards);
              checkBankerWinOrLose();
              // return points;
          };
      };

  }, 750);
};
