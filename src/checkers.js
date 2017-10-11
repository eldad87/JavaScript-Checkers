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

    var board = {}; // Will hold all pawns by their coordinate

    /**
     * Reset our board, wipe all Pawns
     */
    this.resetBoard = function() {
        board = {};
    }

    /**
     * Get board with all Pawns
     * @returns {{}}
     */
    this.getBoard = function() {
        return board;
    }

    /**
     * Add a new pawn for a given player
     * @param pawn
     * @param coordinate
     * @returns {*}
     */
    this.addPawn = function(pawn, coordinate) {
        if(!this.isHabitableCoordinate(coordinate)) {
            return false;
        }

        if(undefined === board[coordinate.getX()]) {
            board[coordinate.getX()] = {};
        }
        board[coordinate.getX()][coordinate.getY()] = pawn;

        pawn.getPlayer().increasePawnCount();

        return this;
    }

    /**
     * Remove a pawn by coordinate
     * @param coordinate
     * @returns {*}
     */
    this.removePawn = function(coordinate) {
        var pawn = this.getPawnByCoordinate(coordinate);
        if(!pawn) {
            return false;
        }
        pawn.getPlayer().decreasePawnCount();

        delete board[coordinate.getX()][coordinate.getY()];
        return this;
    }

    /**
     * Switch turn, set the Other player
     */
    this.turnToggle = function() {
        this.currentPlayerTurn = (this.currentPlayerTurn == this.playerOne) ?
            this.playerTwo : this.playerOne;
    }

    /**
     * Get Pawn by location
     * @param coordinate
     * @returns Pawn|false
     */
    this.getPawnByCoordinate = function(coordinate) {
        var board = this.getBoard();
        if(undefined === board[coordinate.getX()] || undefined === board[coordinate.getX()][coordinate.getY()]) {
            return false;
        }
        return board[coordinate.getX()][coordinate.getY()];
    }

    /**
     * Check if we can place a Pawn on a given coordinate
     *  - It must be free
     *  - On odd rows, pawns can land only on odd cols and vise versa.
     * @param coordinate
     * @returns {boolean}
     */
    this.isHabitableCoordinate = function(coordinate) {
        if(this.getPawnByCoordinate(coordinate)) {
            return false; // There is a pawn in our coordinate
        }

        return coordinate.getX() % 2 === coordinate.getY() % 2;
    }

    /**
     * Get a list of coordinates that occupied in a given path
     * @param Coordinate startCoordinate
     * @param Coordinate destCoordinate
     * @returns Array<Coordinate>
     */
    this.getOccupiedCoordinatesByPath = function(startCoordinate, destCoordinate) {

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
    }

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
}

module.exports = Checkers;