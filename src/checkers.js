var Pawn = require('./pawn');
var Player = require('./player');
var Coordinate = require('./coordinate');


/**
 * Checkers Object
 * @param Player playerOne
 * @param Player playerTwo
 * @constructor
 */
function Checkers(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.currentPlayerTurn = playerOne;
    this.firstTurnPlayer = playerOne;
    this.boardSize = 8;
    this.maxPawnsPerPlayer = 12;
    this.board = {}; // Will hold all pawns by their coordinate
}

/**
 * Reset our board, wipe all Pawns
 */
Checkers.prototype.resetBoard = function() {
    this.board = {};
};

/**
 * Get board with all Pawns
 * @returns {{}}
 */
Checkers.prototype.getBoard = function() {
    return this.board;
};

/**
 * Add a new pawn for a given player
 * @param pawn
 * @param coordinate
 * @returns {*}
 */
Checkers.prototype.addPawn = function(pawn, coordinate) {
    if(!this.isHabitableCoordinate(coordinate)) {
        return false;
    }

    if(undefined === board[coordinate.getX()]) {
        board[coordinate.getX()] = {};
    }
    board[coordinate.getX()][coordinate.getY()] = pawn;

    pawn.getPlayer().increasePawnCount();

    return this;
};

/**
 * Remove a pawn by coordinate
 * @param coordinate
 * @returns {*}
 */
Checkers.prototype.removePawn = function(coordinate) {
    var pawn = this.getPawnByCoordinate(coordinate);
    if(!pawn) {
        return false;
    }
    pawn.getPlayer().decreasePawnCount();

    delete board[coordinate.getX()][coordinate.getY()];
    return this;
};

/**
 * Switch turn, set the Other player
 */
Checkers.prototype.turnToggle = function() {
    this.currentPlayerTurn = (this.currentPlayerTurn == this.playerOne) ?
        this.playerTwo : this.playerOne;
};

/**
 * Get Pawn by location
 * @param coordinate
 * @returns Pawn|false
 */
Checkers.prototype.getPawnByCoordinate = function(coordinate) {
    var board = this.getBoard();
    if(undefined === board[coordinate.getX()] || undefined === board[coordinate.getX()][coordinate.getY()]) {
        return false;
    }
    return board[coordinate.getX()][coordinate.getY()];
};

/**
 * Check if we can place a Pawn on a given coordinate
 *  - It must be free
 *  - On odd rows, pawns can land only on odd cols and vise versa.
 * @param coordinate
 * @returns {boolean}
 */
Checkers.prototype.isHabitableCoordinate = function(coordinate) {
    if(this.getPawnByCoordinate(coordinate)) {
        return false; // There is a pawn in our coordinate
    }

    return coordinate.getX() % 2 === coordinate.getY() % 2;
};

/**
 * Get a list of coordinates that occupied in a given path
 * @param Coordinate startCoordinate
 * @param Coordinate destCoordinate
 * @returns Array<Coordinate>
 */
Checkers.prototype.getOccupiedCoordinatesByPath = function(startCoordinate, destCoordinate) {

    // Create interpolator, we will use it on each step
    //  It will generate the next coordinate in the Pawn's path
    var xInterpolator = 1;
    var yInterpolator = 1;
    if(startCoordinate.getX() > destCoordinate.getX()) {
        xInterpolator = -1;
    }
    if(startCoordinate.getY() > destCoordinate.getY()) {
        yInterpolator = -1;
    }

    var distance = Math.abs(startCoordinate.getX() - destCoordinate.getX());

    // Lets create our coordinates, and check if there any Pawns along it
    var coordinatesWithPawns = [];
    var currCoordinate;
    var pawnAtPath;
    for(var i = 0; i <= distance; i++) {
        currCoordinate = new Coordinate(
            startCoordinate.getX() + (i * xInterpolator),
            startCoordinate.getY() + (i * yInterpolator)
        );
        pawnAtPath = this.getPawnByCoordinate(currCoordinate);
        if(pawnAtPath) {
            coordinatesWithPawns.push(currCoordinate);
        }
    }
    return coordinatesWithPawns;
};

/**
 * Promote a Pawn, make it a Queen if reached enemy's base final row
 * @param Coordinate currCoordinate
 * @returns boolean
 */
this.promoteIfNeeded = function(currCoordinate) {

    var pawn = this.getPawnByCoordinate(currCoordinate);

    // Find the farthest position, in which Pawns become a Queen.
    var xCoordinateForPromotion = 0;
    if(this.firstTurnPlayer === pawn.getPlayer()) {
        xCoordinateForPromotion = this.boardSize -1;
    }

    if(xCoordinateForPromotion !== currCoordinate.getX()) {
        return false;
    }

    pawn.setMaxStep(this.boardSize);
    pawn.setRole('queen');
    return true;
}

/**
 * Init the game
 *  Set Pawns in their location
 *  Define which player need to start first
 *
 * @param firstTurnPlayer
 */
Checkers.prototype.init = function(firstTurnPlayer) {
    this.resetBoard();

    // Define which of the players should start first
    if(undefined !== firstTurnPlayer) {
        // Set which of the players need to start
        if(firstTurnPlayer !== this.playerOne && firstTurnPlayer !== this.playerTwo) {
            throw new Error('Wrong firstTurnPlayer provided');
        }
        this.currentPlayerTurn = firstTurnPlayer;
    } else {
        // Choose randomly which player should start
        switch(Math.floor(Math.random() * 2)) {
            case 1:
                this.currentPlayerTurn = this.playerOne;
                break;
            default:
                this.currentPlayerTurn = this.playerTwo;
                break;
        }
    }
    this.firstTurnPlayer = this.currentPlayerTurn;

    // Lets calc how many rows and cols we should go over in order to add all pawns
    var pawnsPerRow = this.boardSize / 2; // 8 / 2 = 4
    var rowsNeeded = this.maxPawnsPerPlayer / pawnsPerRow; // 12 / 4 = 3

    // Add player's pawns
    // Start with playerOne
    for(var row = 0; row < rowsNeeded; row++) {
        for(var col = 0; col < this.boardSize; col++) {
            if(!this.isHabitableCoordinate(
                    new Coordinate(row, col)
                )) {
                continue;
            }

            this.addPawn(
                new Pawn(this.playerOne), new Coordinate(row, col)
            );
        }
    }

    //Lets do that again, this time for the 2nd player
    for(var row = this.boardSize -1;
        row > (this.boardSize -1 -rowsNeeded); row--) {
        for(var col = 0; col < this.boardSize; col++) {
            if(!this.isHabitableCoordinate(
                new Coordinate(row, col)
                )) {
                continue;
            }

            this.addPawn(
                new Pawn(this.playerTwo), new Coordinate(row, col)
            );
        }
    }
}

/**
 * Get current player by turn
 * @returns Player
 */
Checkers.prototype.getCurrentPlayer = function() {
    return this.currentPlayerTurn;
}

/**
 * Determinant if a game is won
 * @returns boolean
 */
Checkers.prototype.isGameWon = function() {
    return this.playerOne.getPawnCount() == 0 ||
        this.playerTwo.getPawnCount() == 0;
}

/**
 * Validate if a player can move a pawn
 * @param currCoordinate
 * @param destCoordinate
 */
Checkers.prototype.validateMove
    = function(currCoordinate, destCoordinate) {

    // Make sure that Pawn is going to "move"
    if(currCoordinate.getY() == destCoordinate.getY() ||
        currCoordinate.getX() == destCoordinate.getX()) {
        return false;
    }

    // Lets find if there is any pawn in current location;
    var pawn = this.getPawnByCoordinate(currCoordinate);
    if(!pawn) {
        return false;
    }

    // Next, lets check if the pawn is owned by the current player
    if(pawn.getPlayer() !== this.getCurrentPlayer()) {
        return false;
    }

    // Check if the destination is outside of the board's boundaries
    if(destCoordinate.getX() < 0 ||
        destCoordinate.getY() < 0 ||
        destCoordinate.getX() > this.boardSize -1 ||
        destCoordinate.getY() > this.boardSize -1) {
        return false;
    }

    // Check that our destination is habitable
    if(!this.isHabitableCoordinate(destCoordinate)) {
        return false;
    }

    // Check for Pawn's move direction
    // playerOne's x axis must increase
    // While playerTwo's x axis must decrease
    if(pawn.getRole !== 'queen') {
        if(pawn.getPlayer() == this.firstTurnPlayer) {
            if(currCoordinate.getX() > destCoordinate.getX()) {
                return false // Pawn is trying to move backward
            }
        } else if(currCoordinate.getX() < destCoordinate.getX()) {
            return false // Pawn is trying to move backward
        }
    }

    // Check for Pawns in our path
    var coordinatesWithPawns
        = this.getOccupiedCoordinatesByPath(
            currCoordinate, destCoordinate
    );
    // Our path CAN'T contain more then 2 Pawns
    // 1. ours and 2. the one we're going to eat
    if (coordinatesWithPawns.length > 2) {
        return false;
    }

    // Make sure that our destination is within our reach
    var maxStepsAllowed = pawn.getMaxStep();
    if (coordinatesWithPawns.length === 2) {
        // In case of an "eat" operation,
        // a simple pawn is allowed to have 1 more step
        maxStepsAllowed = Math.min(
            this.boardSize, maxStepsAllowed+1
        );

        // Find the 2nd Pawn in path
        // Make sure its not ours. We don't encourage cannibalism
        var pawnInPath;
        while(coordinatesWithPawns.length) {
            // Start from the last items -> first item.
            pawnInPath = this.getPawnByCoordinate(
                coordinatesWithPawns.pop()
            );
            if(pawnInPath === pawn) {
                continue;
            } else {
                break;
            }
        }

        if(pawnInPath.getPlayer() === pawn.getPlayer()) {
            return false;
        }
    }

    // Check that we moved in diagonal
    var xAxisSteps = Math.abs(
        destCoordinate.getX() - currCoordinate.getX()
    );
    var yAxisSteps = Math.abs(
        destCoordinate.getY() - currCoordinate.getY()
    );
    if(xAxisSteps !== yAxisSteps) {
        return false;
    }

    // Check for max distance
    if(xAxisSteps > maxStepsAllowed ||
        yAxisSteps > maxStepsAllowed) {
        return false;
    }

    return true;
}

/**
 * Move a Pawn from Coordinate X to Y
 *  If the Pawn Leap over other Pawn, it will get "eaten"
 *
 * @param Coordinate currCoordinate
 * @param Coordinate destCoordinate
 * @returns boolean
 */
Checkers.prototype.move = function(currCoordinate, destCoordinate) {
    if(!this.validateMove(currCoordinate, destCoordinate)) {
        return false;
    }

    var pawnsAtPath = this.getOccupiedCoordinatesByPath(
        currCoordinate, destCoordinate
    );
    // The 1st coordinate is occupied by our Pawn
    var pawn = this.getPawnByCoordinate(pawnsAtPath.shift());
    // Remove the coordinate for the next Pawn in list
    //  it been eaten
    var eatenPawnCoordinate = pawnsAtPath.shift();
    if(eatenPawnCoordinate) {
        this.removePawn(eatenPawnCoordinate);
    }

    // Move the pawn to its final destination
    this.addPawn(pawn, destCoordinate);
    // remove old coordinate
    this.removePawn(currCoordinate);
    // Promote if needed
    this.promoteIfNeeded(destCoordinate);

    this.turnToggle();

    return true;
}

module.exports = Checkers;