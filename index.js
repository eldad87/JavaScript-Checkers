var Checkers = require('./src/checkers');
var Player = require('./src/player');
var Coordinate = require('./src/coordinate');

/****************************
 * Initialize the games
 * @type {Player}
 ****************************/

var playerOne = new Player('first');
var playerTwo = new Player('second');
var checkers = new Checkers(playerOne, playerTwo);
checkers.init(playerOne);
console.log("Current player: " + checkers.getCurrentPlayer().getName()); // first

/****************************
 * Try to perform some invalid moves
 ****************************/
console.log('-----------------------------------');
console.log(' Try to perform some invalid moves');
console.log('-----------------------------------');

// Move into an occupied coordinate
var moveRes = checkers.move(new Coordinate(0, 0), new Coordinate(1, 1));
console.log('Move into an occupied coordinate: ' + moveRes); // false

// Move other player's pawn
moveRes = checkers.move(new Coordinate(7, 7), new Coordinate(6, 6));
console.log('Move other player\'s pawn: ' + moveRes); // false

// Move forward - while a Pawn can only move in diagonal
vmoveRes = checkers.move(new Coordinate(2, 2), new Coordinate(3, 2));
console.log('Move forward while you can move ONLY in diagonal: ' + moveRes); // false

/****************************
 * Move + Eat
 ****************************/
console.log('-----------------------------------');
console.log(' Try to perform Move/Eat operations');
console.log('-----------------------------------');
// first player - Move diagonal
moveRes = checkers.move(new Coordinate(2, 2), new Coordinate(3, 3));
console.log('Move first\'s player Pawn diagonal 2,2 -> 3,3: ' + moveRes); // true

// second player - Move diagonal
moveRes = checkers.move(new Coordinate(5, 5), new Coordinate(4, 4));
console.log('Move second\'s player Pawn diagonal 5,5 -> 4,4:: ' + moveRes); // true

// first player - Move diagonal into an occupied position by the other player's pawn
moveRes = checkers.move(new Coordinate(3, 3), new Coordinate(4, 4));
console.log('Move first\'s player Pawn diagonal into an occupied position 3,3 -> 4,4: ' + moveRes); // false

// first player - Move diagonal && eat other player's pawn
moveRes = checkers.move(new Coordinate(3, 3), new Coordinate(5, 5));
console.log('Move first\'s player Pawn diagonal, will eat Pawn in 4,4 3,3 -> 5,5: ' + moveRes); // true

console.log('-----------------------------------');
console.log(' Pawns count');
console.log('-----------------------------------');
// second player need to have 1 less (11) Pawns
console.log('Current pawns count for first player: ' + checkers.playerOne.getPawnCount());
console.log('Current pawns count for second player: ' + checkers.playerTwo.getPawnCount());

console.log('-----------------------------------');
console.log(' Board status');
console.log('-----------------------------------');
// Lets print the Board and see where our Pawns
var board = checkers.getBoard();
for (var row in board) {
    for (var col in board[row]) {
        var pawn = board[row][col];
        console.log("Row: " + row + ", Col: " + col + ", Player: " + pawn.getPlayer().getName());
    }
}