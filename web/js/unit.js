/**
 * Unit class
 *
 * extends sprite
 */
function Unit(game) {

    var x = game.rnd.integerInRange(5, 395),
        y = game.rnd.integerInRange(5, 195),
        level = game.rnd.integerInRange(0, 1);

    Phaser.Sprite.call(this, game, x, y, 'unit', level);

    this.level = level;
}

Unit.prototype = Object.create(Phaser.Sprite.prototype);
Unit.prototype.constructor = Unit;

Unit.prototype.init = function(collisionGroup) {
    this.body.setCollisionGroup(collisionGroup);
    this.body.setZeroDamping();
    this.body.velocity.x = this.game.rnd.integerInRange(300, 400) * (Math.round(this.game.rnd.frac()) || -1);
    this.body.velocity.y = this.game.rnd.integerInRange(300, 400) * (Math.round(this.game.rnd.frac()) || -1);
};