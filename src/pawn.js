/**
 * Pawn object
 * @param Player player
 * @param string role pawn || queen
 * @constructor
 */
function Pawn(player, role) {
    this.player = player;
    this.maxStep = 1;
    this.role = role || 'pawn';
}
/**
 * Get the owner
 * @returns Player
 */
Pawn.prototype.getPlayer = function() {
    return this.player;
}

/**
 * Get the max steps this Pawn can perform
 * @returns integer
 */
Pawn.prototype.getMaxStep = function() {
    return this.maxStep;
}

/**
 * Set the max steps this Pawn can perform
 * @param maxStep
 * @returns Pawn
 */
Pawn.prototype.setMaxStep = function(maxStep) {
    this.maxStep = maxStep;
    return this;
}
/**
 * Get role
 * @returns string pawn || queen
 */
Pawn.prototype.getRole = function() {
    return this.role;
}

/**
 * Set role
 * @param string pawn || queen
 * @returns Pawn
 */
Pawn.prototype.setRole = function(role) {
    this.role = role;
    return this;
}

module.exports = Pawn;