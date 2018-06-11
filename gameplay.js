//========================================================================================================================
// game play logic
//========================================================================================================================
$(document).ready(function() {

  $('#deal').click(function() {
    // $('#bankers-cards .card-images').remove();
    // $('#bankers-cards .card-images').remove();
    $('.card-images').remove();
    $('#banker-points').text('');
    $('#player-points').text('');
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
    displayPlayerPoints(playerPoints);
    displayBankerPoints( parseInt( bankerCard[0].slice(0,-1) ) );

    appendBankerCards(bankerCard[0]);
    for (var i=0; i<playerCard.length; i++) {
      appendPlayerCards(playerCard[i]);
    };

    $('#bankers-cards').fadeIn(1000);
    $('#players-cards').fadeIn(1000, function() {
      //========================================================================================================================
      // check for blackjack first
      //========================================================================================================================
      if (playerPoints[3] === true) {
          alert("You got blackjack!");
          console.log("Player wins");
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
    appendPlayerCards(newCard);
    //========================================================================================================================
    // calculate points of card
    //========================================================================================================================
    playerPoints = calculatePlayersPointsWithMultipleCards(playerCard);
    // playerPoints will hold an array of 2 calculated values (depending on whether got ace or not)
    displayPlayerPoints(playerPoints);

    var burst = checkIfPlayerBurst(playerPoints[0]);

    if (burst) {
        // alert("Burst");
        $('#betting-actions').fadeOut(1000, function() {
          $('.betting-action-buttons').hide();
        });
        console.log("Banker Wins");
    } else {
        if ( $('#stand').is(':visible') === false ) {
          $('#stand').fadeIn(1000);
        };
    };

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
        console.log("Banker blackjack");
    } else if (bankerPoints[0] === playerPoints[0]) {
        console.log("Draw");
    } else if (playerPoints[0] > bankerPoints[0] || bankerPoints > 21) {
        console.log("Player wins");
    } else {
        console.log("Banker wins");
    };
  });

});
