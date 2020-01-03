//
// Blackjack
// by Robert Buettner
//

//Card Variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 'Seven', 'Six', 'Five','Four', 'Three', 'Two'];

//html elements and initial display (DOM variables)
let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');

//Game Variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    drawScore = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];
    
//----------------------------------------------------------//


hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

//new game handler... Starting a new game
newGameButton.addEventListener('click', function(){
  //game status
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  
  
  //create and shuffle new deck
  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];
  
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  showStatus();
});

//Hit Button
hitButton.addEventListener('click', function(){
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

//Stay Button
stayButton.addEventListener('click', function(){
  gameOver=true;
  checkForEndOfGame();
  showStatus();
});

// create deck each time and store it
function createDeck(){
    //suits IDs limits to array length only (suitIdx)
    for (let suitIdx=0; suitIdx < suits.length; suitIdx++){   
      //Card value IDs (valueIdx)
      for (let valueIdx=0; valueIdx < values.length; valueIdx++){   
      //store all cards as objects
        let card = {  
          suit: suits[suitIdx],
          value: values[valueIdx]
      };
      deck.push(card)   //add suits and values to create deck of 52
    }
  }
  return deck;
}

//function to shuffle the deck
function shuffleDeck(deck){
  for (let i=0; i<deck.length; i++){
    let swapIdx= Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getCardString (card){
  return card.value + ' of ' + card.suit;
}

// Pick next card in array
function getNextCard(){   //shifts to next in array
  return deck.shift();
}

function getCardNumericValue(card){
  switch(card.value){
    case 'Ace': return 1;
    case 'Two': return 2;
    case 'Three': return 3;
    case 'Four': return 4;
    case 'Five': return 5;
    case 'Six': return 6;
    case 'Seven': return 7;
    case 'Eight': return 8;
    case 'Nine': return 9;
    default: return 10;
  }
}

function getScore(cardArray){
  let score = 0;
  let hasAce = false;
  for (let i=0; i<cardArray.length;i++){
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace'){
      hasAce = true;
    }
  }
  //ace can be 10 or1
  if (hasAce && score + 10 <= 21){
    return score +10;
  }
  return score;
}

function updateScores(){
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function checkForEndOfGame(){
  updateScores();
  
  if (gameOver){
    //dealer needs to draw cards
    while (playerScore <=21 && dealerScore <=16){
    dealerCards.push(getNextCard());
    updateScores();
      }
  }
  
  if (playerScore > 21){
    playerWon = false;
    gameOver = true;
    drawScore = false;
  }
  else if (dealerScore > 21 && playerScore <=21){
    playerWon = true;
    gameOver = true;
    drawScore = false;
  }
  else if (dealerScore===playerScore && playerScore <=21){
    playerWon = false;
    drawScore = true;
  }
  else if (dealerCards.length >=5 && dealerScore <= 21){
    playerWon = false;
    gameOver = true;
    drawScore = false;
  }
  else if (gameOver){
    if (playerScore > dealerScore){
    playerWon= true;
    drawScore = false;
    }
    else{
      playerWon = false;
    }
  }
  updateScores();

}

function showStatus(){
  if (!gameStarted){
    textArea.innerText = 'Welcome to Blackjack!';
    return;
  }
  
  let dealerCardString = '';
  for (let i=0; i <dealerCards.length; i++){
    dealerCardString += getCardString(dealerCards[i])+'\n';
  }
  
  let playerCardString = '';
  for (let i=0; i <playerCards.length; i++){
    playerCardString += getCardString(playerCards[i])+'\n';
  }
  
  updateScores();
  
  textArea.innerText = 
    'Dealer has:\n'+
    dealerCardString +
    '(score: '+ dealerScore+')\n\n' +
    
    'Player has:\n'+
    playerCardString +
    '(score: '+ playerScore+')\n\n';
  
  //check game state
  if (gameOver) {
    if (playerWon){
      textArea.innerText +="YOU WIN! \nCongratulations!";
    }
    else if(drawScore){
      textArea.innerText += "It's a Draw! \nYou didn't win, but you didn't lose either. Better luck next time..";
    }
    else{
      textArea.innerText += "Dealer Wins! \nBetter luck next time..";
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
    newGameButton.innerText ="Play again?"
  }
} 


