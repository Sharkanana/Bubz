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

Bubble.prototype.grow = function() {
    var bub = this;

    if(bub.scale.y > 5) {
        return false;
    }
    else {
        bub.scale.x += .1;
        bub.scale.y += .1;
        return true;
    }
};

Bubble.prototype.pop = function(units) {
    var bub = this,
        unitsHit = [];

    units.forEach(function(unit) {
        if(Phaser.Math.distance(unit.x, unit.y, bub.x, bub.y) <= bub.width / 2) {
            unitsHit.push(unit);
        }
    });

    var score = 0;
    for(var i = 0; i < unitsHit.length; i++) {
        var unit = unitsHit[i];

        //destroy
        if(unit.level === 0) {
            score++;
            unit.destroy();
        }
        else {
            unit.level--;
            unit.frame = unit.level;
        }
    }

    bub.destroy();

    //right now, 10 points for each unit killed
    return score * 10;
};