//========================================================================================================================
// game play logic
//========================================================================================================================
$(document).ready(function() {

  $('#deal').click(function() {
    //========================================================================================================================
    // shuffle a new deck of 4 cards
    //========================================================================================================================
    newDeck = createDeck();

    //========================================================================================================================
    // deal the cards. currently 1 player 1 banker
    //========================================================================================================================
    var cardsDealt = dealCards(newDeck);

    //========================================================================================================================
    // assign the cards to player and banker
    //========================================================================================================================
    playerCard = cardsDealt[0];
    bankerCard = cardsDealt[1];

    //========================================================================================================================
    // calculate the state of the cards that the players get
    //========================================================================================================================
    playerPoints = calculatePlayersPointsWith2Cards(playerCard);
    // player points returns an array of 4 objects [points, points with ace, can split?, blackjack?]

    $('#bankers-cards').text(bankerCard);
    $('#players-cards').text(playerCard);

    $('#bankers-cards').fadeIn(1000);
    $('#players-cards').fadeIn(1000, function() {
      //========================================================================================================================
      // check for blackjack first
      //========================================================================================================================
      if (playerPoints[3] === true) {
          alert("You got blackjack!");
      } else {
          // proceed to check if player can split
          if (playerPoints[2] === true) {
              $('#split').show();
          };

          if (playerPoints[0] > 11) {
              $('#stand').show();
          };

          $('#hit').show();
          $('#betting-actions').fadeIn(1000);
      };
    });

  });

  // $('#betting-actions').on('click', '#hit', function() {
  $('#hit').click(function() {
    //========================================================================================================================
    // draw a card first
    //========================================================================================================================
    var newCard = drawACard(newDeck);
    playerCard.push(newCard);

    //========================================================================================================================
    // calculate points of card
    //========================================================================================================================
    playerPoints = calculatePlayersPointsWithMultipleCards(playerCard);
    var burst = checkIfPlayerBurst(playerPoints[0]);

    if (burst) {
        alert("Burst");
        $('#betting-actions').fadeOut(1000, function() {
          $('.betting-action-buttons').hide();
        });
    } else {
        if ( $('#stand').is(':visible') === false ) {
          $('#stand').fadeIn(1000);
        };
    };

    $('#players-cards').text(playerCard);
  });

  // $('#betting-actions').on('click', '#stand', function() {
  $('#stand').click(function() {

    $('#betting-actions').fadeOut(1000, function() {
      $('.betting-action-buttons').hide();
    });

    //========================================================================================================================
    // player stands, time for banker to draw
    //========================================================================================================================
    var bankerPoints = bankerMove(bankerCard, newDeck);
    // console.log("banker = " + bankerPoints);

    //========================================================================================================================
    // evaluate player win or banker win
    //========================================================================================================================
    if (bankerPoints[1]) {
        console.log("Player points: " + playerPoints);
        console.log("Banker points: " + bankerPoints);
        console.log("Player cards: " + playerCard);
        console.log("Banker cards: " + bankerCard);
        console.log("Banker blackjack");
    } else if (playerPoints[0] > bankerPoints || bankerPoints > 21) {
        console.log("Player points: " + playerPoints);
        console.log("Banker points: " + bankerPoints);
        console.log("Player cards: " + playerCard);
        console.log("Banker cards: " + bankerCard);
        console.log("Player wins");
    } else {
        console.log("Player points: " + playerPoints);
        console.log("Banker points: " + bankerPoints);
        console.log("Player cards: " + playerCard);
        console.log("Banker cards: " + bankerCard);
        console.log("Banker wins");
    };
  });

});
