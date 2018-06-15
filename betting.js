function displayAsDollars(amount) {
  var arr = amount.toString().split('').reverse();
  var holder = [];

  for (var i = 0; i < arr.length; i++) {

    if (i !== 0) {
        if (i % 3 === 0) {
            holder.push(',');
        };
    };

    holder.push(arr[i]);
  };
  return holder.reverse().join('');
};

function deductBankroll() {
  bankroll -= betAmount;
  $('#player-bankroll-amount').text( displayAsDollars(bankroll) );
};

function playerBlackJackWinnings() {
  var winnings = betAmount * 2.5;
  bankroll += winnings;
  $('#player-bankroll-amount').text( displayAsDollars(bankroll) );
};

function playerNormalWinnings() {
  var winnings = betAmount * 2;
  bankroll += winnings;
  $('#player-bankroll-amount').text( displayAsDollars(bankroll) );
}

function playerDraw() {
  bankroll += betAmount;
}

function playerSplit() {
  bankroll -= betAmount;
  $('#player-bankroll-amount').text( displayAsDollars(bankroll) );
};
