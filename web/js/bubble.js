/**
 * Bubble class
 *
 * extends sprite
 */
function Bubble(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'bubble');
    game.physics.p2.enable(this);
    game.add.existing(this);
}

Bubble.prototype = Object.create(Phaser.Sprite.prototype);
Bubble.prototype.constructor = Bubble;