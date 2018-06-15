//========================================================================================================================
// game play logic
//========================================================================================================================
$(document).ready(function() {
  //========================================================================================================================
  // shuffle a new deck of 4 cards
  //========================================================================================================================
  newDeck = createDeck();
  $('#deck').text(newDeck.length);

  $('#rules').click(function() {
    $('#rules-block').fadeIn(750);
  });

  $('#close-rules-block').click(function() {
    $('#rules-block').fadeOut(750);
  })

  $('#clear-bet').click(function() {
    betAmount = 0;
    $('#player-bet-amount').text(betAmount);
  });

  $('.poker-chip').click(function() {
    var amount = $(this).children().attr('id');
    var dollar = parseInt(amount.slice(1, amount.length));

    betAmount += dollar;
    $('#player-bet-amount').text( displayAsDollars(betAmount) );
  });


// **********************************START OF DEAL EVENT*************************************************************
  $('#deal').click(function() {
    removePlayer2Block();
    // sets whichPlayersTurn to null and player2Card to null
    // also resets the dom element if there was a split


    $('.card-images').remove();
    $('#banker-points').text('');
    $('#player-points').text('');
    $('#poker-chips-holder').fadeOut(500);
    $('#overlay').fadeOut(500);
    deductBankroll();

    //========================================================================================================================
    // check if need to reshuffle deck
    //========================================================================================================================
    var needToReshuffle = checkIfDeckNeedsToBeReshuffled(newDeck);
    if (needToReshuffle) {
      newDeck = createDeck();
      alert("Deck has been resetted");
    };

    //========================================================================================================================
    // deal the cards
    //========================================================================================================================
    var cardsDealt = dealCards(newDeck);

    //========================================================================================================================
    // assign the cards to player and banker
    //========================================================================================================================
    player1Card = cardsDealt[0];
    bankerCard = cardsDealt[1];

    $('#deal').fadeOut(1000, function() {

      //=====================================================================
      // UPDATE SCORE AND IMAGES
      //=====================================================================
      appendBankerCards(bankerCard);
      for (var i = 0; i < player1Card.length; i++) {
        appendPlayerCards(player1Card[i], 1);
      };
      displayBankerPoints(bankerCard);
      displayPlayerPoints(player1Card, 1);

      //=====================================================================
      // CHECK PLAYER SCORE AND IF PLAYER HAS BLACKJACK
      //=====================================================================
      var playerHasBlackJack = checkForBlackJack(player1Card);
      var canSplit = playerCanSplit(player1Card);
      var playerPoints = calculatePoints(player1Card);

      //=====================================================================
      // UPDATE BUTTONS ACCORDINGLY
      //=====================================================================
      if (playerHasBlackJack) {
          playerBlackJackWinnings();
          $('#game-result').text("Player Blackjack");
          $('#overlay').fadeIn(500);
          $('#deal').fadeIn(1000);
      } else {
          if (canSplit) {
              $('#hit').fadeIn(1000);
              if (playerPoints[0] > 11) {
                  $('#stand').fadeIn(1000);
              };
              $('#stand').fadeIn(1000);
              $('#split').fadeIn(1000);
          } else {
              $('#hit').fadeIn(1000);
              if (playerPoints[0] > 11) {
                  $('#stand').fadeIn(1000);
              };
          };
      };

    });
  });
// **********************************END OF DEAL EVENT*************************************************************


// **********************************START OF HIT EVENT*************************************************************
  $('#hit').click(function() {
    //====================================================
    // MUST EVALUATE IF WE HAVE A SPLIT SITUATION FIRST
    //====================================================

    if (whichPlayersTurn) {
        //====================================================
        // DRAW A CARD
        //====================================================
        var newCard = drawACard(newDeck);
        cardCounter(newCard);
        displayTrueCount(cardCount, newDeck);
        displayNumberOfCardsInDeck(newDeck);
        eval("player" + whichPlayersTurn + "Card").push(newCard);
        appendPlayerCards(newCard, whichPlayersTurn);

        //====================================================
        // CALCULATE POINTS
        //====================================================
        displayPlayerPoints(eval("player" + whichPlayersTurn + "Card"), whichPlayersTurn);
        var playerPoints = calculatePoints(eval("player" + whichPlayersTurn + "Card"));
        var burst = checkIfBurst(eval("player" + whichPlayersTurn + "Card"));

        //====================================================
        // ANIMATE ACCORDINGLY
        //====================================================
        if (burst) {
            if (whichPlayersTurn === 1) {
                player1Card = "Player 1 Burst";
                whichPlayersTurn = 2;
                $('#player-turn-indicator').fadeOut(500, function() {
                  $('#player-turn-indicator').text("Player " + whichPlayersTurn + "'s turn").fadeIn(500);
                })
            } else {
                if (player1Card === "Player 1 Burst") {
                    // $('#game-result').hide().text('Player 1 & 2 Lose').fadeIn(500);
                    $('#game-result').text("Player 1 & 2 Lose");
                    $('#overlay').fadeIn(500);
                    resetButtons();
                } else {
                    player2Card = "Player 2 Burst";
                    animateDrawingOfCards(bankerCard, newDeck);
                    checkBankerWinOrLose();
                }
            };

        } else {
            if ( $('#stand').is(':visible') === false && playerPoints[0] > 11 ) {
              $('#stand').fadeIn(1000);
            };
        };
    } else {
    //====================================================
    // NO SPLIT SITUATION
    //====================================================

        //====================================================
        // DRAW A CARD
        //====================================================
        var newCard = drawACard(newDeck);
        cardCounter(newCard);
        displayTrueCount(cardCount, newDeck);
        displayNumberOfCardsInDeck(newDeck);
        player1Card.push(newCard);
        appendPlayerCards(newCard, 1);

        //====================================================
        // CALCULATE POINTS
        //====================================================
        displayPlayerPoints(player1Card, 1);
        var playerPoints = calculatePoints(player1Card);
        var burst = checkIfBurst(player1Card);

        //====================================================
        // ANIMATE ACCORDINGLY
        //====================================================
        if (burst) {
            resetButtons();
            $('#game-result').text("Banker Wins");
            $('#overlay').fadeIn(500);
        } else {
            if ( $('#stand').is(':visible') === false && playerPoints[0] > 11 ) {
              $('#stand').fadeIn(1000);
            };
        };
    };
  });
// **********************************END OF HIT EVENT*************************************************************


// **********************************START OF STAND EVENT*************************************************************

  $('#stand').click(function() {
    //====================================================
    // MUST CHECK FOR WHICH PLAYERS TURN FIRST
    //====================================================
    if (whichPlayersTurn) {
        if (whichPlayersTurn === 1) {
            //====================================================
            // IF ITS PLAYER ONE
            //====================================================

            //====================================================
            // CHECK IF PLAYER 2 HAS BLACKJACK FIRST
            //====================================================
            var player2HasBlackJack = checkForBlackJack(player2Card);

            if (player2HasBlackJack) {
                //====================================================
                // PLAYER 2 HAS BLACKJACK
                //====================================================
                player2Card = "Player 2 Blackjack";
                playerBlackJackWinnings();
                animateDrawingOfCards(bankerCard, newDeck);
            } else {

                //====================================================
                // SET PLAYER TO PLAYER 2 AND UPDATE PLAYER INDICATOR
                //====================================================
                whichPlayersTurn = 2;
                $('#player-turn-indicator').fadeOut(500, function() {
                  $('#player-turn-indicator').text("Player " + whichPlayersTurn + "'s turn").fadeIn(500);
                })

                //====================================================
                // HIDE THE STAND BUTTON IF NOT ENOUGH POINTS
                //====================================================
                var player2Points = calculatePoints(player2Card)
                if (player2Points[0] < 12) {
                  $('#stand').fadeOut(1000);
                };

            };

        } else {
            //====================================================
            // PLAYER 2 IS DONE, CAN RUN BANKER DRAW
            //====================================================
            animateDrawingOfCards(bankerCard, newDeck);
        }
    //====================================================
    // NO SPLIT SCENARIO
    //====================================================
    } else {
        animateDrawingOfCards(bankerCard, newDeck);
    };
  });
// **********************************END OF STAND EVENT*************************************************************





// **********************************START OF STAND EVENT*************************************************************
  $('#split').click(function() {
    //====================================================
    // UPDATE DOM
    //====================================================
    playerSplit();
    appendPlayer2Block();
    updatePlayerBlocks(player1Card);
    drawCardForSplitCase();

    //====================================================
    // CHECK IF PLAYER 1 BLACKJACK
    //====================================================
    var player1BlackJack = checkForBlackJack(player1Card);

    //====================================================
    // IF PLAYER 1 BLACKJACK
    //====================================================
    if (player1BlackJack) {
        playerBlackJackWinnings();
        $('#game-result').hide().text('Player 1 Blackjack').fadeIn(500);
        player1Card = "Player 1 Blackjack";

        //====================================================
        // CHECK IF PLAYER 2 BLACKJACK
        //====================================================
        var player2BlackJack = checkForBlackJack(player2Card);

        if (player2BlackJack) {
            playerBlackJackWinnings();
            $('#game-result').text("Player 1 & 2 Blackjack");
            $('#overlay').fadeIn(500);
            resetButtons();
        } else {

            whichPlayersTurn = 2;

            //====================================================
            // UPDATE BUTTONS AND PLAYER INDICATOR
            //====================================================
            $('#split').fadeOut(1000);
            $('#player-turn-indicator').fadeOut(500, function() {
              $('#player-turn-indicator').text("Player " + whichPlayersTurn + "'s turn").fadeIn(500);
            })

            //====================================================
            // HIDE STAND IF INSUFFICIENT POINTS
            //====================================================
            var player2Points = calculatePoints(player2Card)
            if (player2Points[0] < 12) {
              $('#stand').fadeOut(1000);
            };
        };

    //====================================================
    // PLAYER 1 NO BLACKJACK
    //====================================================
    } else {
        whichPlayersTurn = 1;

        //====================================================
        // UPDATE BUTTONS AND PLAYER INDICATOR
        //====================================================
        $('#split').fadeOut(1000);
        $('#player-turn-indicator').fadeOut(500, function() {
          $('#player-turn-indicator').text("Player " + whichPlayersTurn + "'s turn").fadeIn(500);
        })

        //====================================================
        // HIDE STAND IF INSUFFICIENT POINTS
        //====================================================
        var player1Points = calculatePoints(player1Card)
        if (player1Points[0] < 12) {
          $('#stand').fadeOut(1000);
        };
    };
  });
// **********************************END OF STAND EVENT*************************************************************


});
