/**
 * Coordinate object
 * @param number
 * @param number
 * @constructor
 */
function Coordinate(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Get X coordinate
 * @returns number
 */
Coordinate.prototype.getX = function() {
    return this.x;
}

/**
 * Get Y coordinate
 * @returns number
 */
Coordinate.prototype.getY = function() {
    return this.y;
}

module.exports = Coordinate;