//========================================================================================================================
// game play logic
//========================================================================================================================
$(document).ready(function() {

  $('#deal').click(function() {
    removePlayer2Block();
    $('.card-images').remove();
    $('#banker-points').text('');
    $('#player-points').text('');
    $('#game-result').hide()
    //========================================================================================================================
    // shuffle a new deck of 4 cards
    //========================================================================================================================
    newDeck = createDeck();

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
          $('#game-result').hide().text("Player Blackjack").fadeIn(500);
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

  $('#hit').click(function() {
    //====================================================
    // MUST EVALUATE IF WE HAVE A SPLIT SITUATION FIRST
    //====================================================

    if (whichPlayersTurn) {
        //====================================================
        // DRAW A CARD
        //====================================================
        var newCard = drawACard(newDeck);
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
                player1Card = "Burst";
                whichPlayersTurn = 2;
                $('#player-turn-indicator').fadeOut(500, function() {
                  $('#player-turn-indicator').text("Player " + whichPlayersTurn + "'s turn").fadeIn(500);
                })
            } else {
                if (player1Card === "Burst") {
                    $('#game-result').hide().text('Player 1 & 2 Lose').fadeIn(500);
                    resetButtons();
                } else {
                    $('#game-result').hide().text('Player 2 Burst').fadeIn(500);
                    player2Card = "Burst";
                    bankerDrawCards(bankerCard, newDeck);
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
            $('#game-result').hide().text('Banker Wins').fadeIn(500);
        } else {
            if ( $('#stand').is(':visible') === false && playerPoints[0] > 11 ) {
              $('#stand').fadeIn(1000);
            };
        };
    };
  });

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
                $('#game-result').hide().text('Player 2 Blackjack').fadeIn(500);
                player2Card = "BJ";
                bankerDrawCards(bankerCard, newDeck);
                checkBankerWinOrLose();
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
            bankerDrawCards(bankerCard, newDeck);
            checkBankerWinOrLose();
        }
    //====================================================
    // NO SPLIT SCENARIO
    //====================================================
    } else {
        bankerDrawCards(bankerCard, newDeck);
        checkBankerWinOrLose();
    };
  });

  $('#split').click(function() {
    //====================================================
    // UPDATE DOM
    //====================================================
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
        $('#game-result').hide().text('Player 1 Blackjack').fadeIn(500);
        player1Card = "BJ";

        //====================================================
        // CHECK IF PLAYER 2 BLACKJACK
        //====================================================
        var player2BlackJack = checkForBlackJack(player2Card);

        if (player2BlackJack) {
            $('#game-result').hide().text('Player 1 & 2 Blackjack').fadeIn(500);
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

});
