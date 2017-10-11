/**
 * Player object
 * @param name
 * @constructor
 */
function Player(name) {
    this.name = name;

    this.pawnCount = 0;
}

/**
 * Get Player's name
 * @returns string
 */
Player.prototype.getName = function() {
    return this.name;
}

/**
 * Get count of "living" pawns
 * @returns number
 */
Player.prototype.getPawnCount = function() {
    return this.pawnCount;
}

/**
 * Increase "living" pawns count
 * @returns Player
 */
Player.prototype.increasePawnCount = function() {
    this.pawnCount++;
    return this;
}

/**
 * Decrease "living" pawns count
 * @returns Player
 */
Player.prototype.decreasePawnCount = function() {
    this.pawnCount--;
    return this;
}

module.exports = Player;