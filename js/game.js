/*
 * game.js  (funpage.html)  -  "Match the Makers" memory game
 *
 * Idea: 12 face-down cards hide 6 pairs of SAN'AH product pictures.
 * Click two cards: if the pictures are the same they stay open, if not they flip back.
 * Find all pairs in the fewest moves and the shortest time.
 *
 * Dynamic HTML used here: the cards are created by JavaScript (createElement),
 * and their look is changed while playing by adding/removing Bootstrap classes.
 */

// The pictures used for the pairs (all are real product pictures of the website)
var pictures = [
  { file: 'product1.jpg', name: 'Pottery' },
  { file: 'product2.jpg', name: 'Crochet toys' },
  { file: 'product3.jpg', name: 'Honey' },
  { file: 'abayaa.jpg',   name: 'Abaya' },
  { file: 'handmade2.jpg', name: 'Handmade craft' },
  { file: 'decor2.jpeg',  name: 'Home decor' }
];

var firstCard = null;     // the first card of the current attempt (or null)
var lockBoard = false;    // true while two wrong cards are shown, so the player cannot click
var moves = 0;            // number of attempts (two cards = 1 move)
var matchedPairs = 0;     // pairs found so far
var seconds = 0;          // elapsed time
var timer = null;         // holds the setInterval id of the clock
var bestMoves = null;     // best score of this visit to the page

// Fisher-Yates shuffle: walks from the end of the array and swaps each element
// with a random element before it, giving a fair random order.
function shuffle(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// Show a card face-up: hide the "?" side and show the picture
function reveal(card) {
  card.querySelector('.card-back').classList.add('d-none');
  card.querySelector('.card-front').classList.remove('d-none');
  card.classList.add('border-success', 'border-3');
}
// Turn a card face-down again
function hide(card) {
  card.querySelector('.card-back').classList.remove('d-none');
  card.querySelector('.card-front').classList.add('d-none');
  card.classList.remove('border-success', 'border-3');
}

// Called every time the player clicks a card
function flipCard(card) {
  if (lockBoard) return;                         // ignore clicks while checking a wrong pair
  if (card === firstCard) return;                // ignore a double click on the same card
  if (card.getAttribute('data-done') === '1') return; // ignore cards already matched

  if (timer === null) { startTimer(); }          // the clock starts with the first click
  reveal(card);

  if (firstCard === null) {                      // this was the FIRST card of the attempt
    firstCard = card;
    return;
  }

  // This is the SECOND card: count the move and compare the two pictures
  moves++;
  document.getElementById('moves').textContent = moves;

  if (firstCard.getAttribute('data-name') === card.getAttribute('data-name')) {
    // ----- MATCH: keep both cards open and mark them as finished -----
    firstCard.setAttribute('data-done', '1');
    card.setAttribute('data-done', '1');
    firstCard.classList.add('bg-success-subtle');
    card.classList.add('bg-success-subtle');
    matchedPairs++;
    firstCard = null;
    if (matchedPairs === pictures.length) { winGame(); }
  } else {
    // ----- NO MATCH: wait 800 ms so the player can see, then turn both back -----
    lockBoard = true;
    var a = firstCard, b = card;
    setTimeout(function () {
      hide(a);
      hide(b);
      firstCard = null;
      lockBoard = false;
    }, 800);
  }
}

// Clock: adds one second every 1000 ms and prints it as mm:ss
function startTimer() {
  timer = setInterval(function () {
    seconds++;
    var m = String(Math.floor(seconds / 60)).padStart(2, '0');
    var s = String(seconds % 60).padStart(2, '0');
    document.getElementById('time').textContent = m + ':' + s;
  }, 1000);
}

// All pairs found: stop the clock, update the best score, open the Bootstrap modal
function winGame() {
  clearInterval(timer);
  if (bestMoves === null || moves < bestMoves) { bestMoves = moves; }
  document.getElementById('best').textContent = bestMoves;
  document.getElementById('winText').textContent =
    'You found all pairs in ' + moves + ' moves and ' + seconds + ' seconds!';
  new bootstrap.Modal(document.getElementById('winModal')).show();
}

// Build a new board (also used by the "New game" button)
function newGame() {
  clearInterval(timer);
  timer = null; seconds = 0; moves = 0; matchedPairs = 0;
  firstCard = null; lockBoard = false;
  document.getElementById('moves').textContent = '0';
  document.getElementById('time').textContent = '00:00';

  var board = document.getElementById('board');
  board.innerHTML = '';                          // remove the old cards

  // Duplicate every picture (a pair) and shuffle the 12 cards
  var deck = shuffle(pictures.concat(pictures));

  deck.forEach(function (picture) {
    // Column that holds one card (responsive: 3 per row on phones, 4 on bigger screens)
    var col = document.createElement('div');
    col.className = 'col';

    // The card itself is a button so it works with keyboard too
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'btn p-0 w-100 border rounded overflow-hidden bg-white';
    card.setAttribute('data-name', picture.name);
    card.setAttribute('aria-label', 'Memory card');

    // Face-down side: a green block with a question mark
    var back = document.createElement('div');
    back.className = 'card-back ratio ratio-1x1 bg-success text-white';
    back.innerHTML = '<div class="d-flex align-items-center justify-content-center display-4 fw-bold">?</div>';

    // Face-up side: the product picture (hidden at the start)
    var front = document.createElement('div');
    front.className = 'card-front ratio ratio-1x1 d-none';
    front.innerHTML = '<img src="' + picture.file + '" alt="' + picture.name + '" class="object-fit-cover w-100 h-100">';

    card.appendChild(back);
    card.appendChild(front);
    card.addEventListener('click', function () { flipCard(card); });

    col.appendChild(card);
    board.appendChild(col);
  });
}

document.getElementById('newGame').addEventListener('click', newGame);
document.getElementById('playAgain').addEventListener('click', function () {
  bootstrap.Modal.getInstance(document.getElementById('winModal')).hide();
  newGame();
});
newGame(); // start the first game when the page loads
