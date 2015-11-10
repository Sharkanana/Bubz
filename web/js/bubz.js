
/**
 * Entry point
 */
window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    var texts = {},
        buttons = {},
        groups = {},
        sprites = {},
        timers = {},
        status = {
            isRunning: false,
            init: false,
            score: 0,
            level: 0
        };

    function preload () {
        game.load.image('logo', 'img/bubz-logo.png');
        game.load.image('bubble', 'img/bubble.png');
        game.load.spritesheet('btn', 'img/button.png', 80, 20);
        game.load.spritesheet('unit', 'img/unit.png', 27, 29);
    }

    function create () {

        //setup physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.restitution = 1;
        game.physics.p2.damping = 0;
        game.physics.p2.setImpactEvents(true);

        game.stage.backgroundColor = '#72ADFF';

        //create logo
        sprites.logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        sprites.logo.anchor.setTo(0.5, 0.5);

        //create score indicator
        texts.score = game.add.text(5, 5);

        //create start button
        groups.startBtnGroup = game.add.group();
        buttons.startBtn = groups.startBtnGroup.add(new Phaser.Button(game, 360, 400, 'btn', startGame, this, 0, 1, 2));
        texts.startBtnLabel = groups.startBtnGroup.add(new Phaser.Text(game, 385, 402, 'Start', { font: '14px bold arial' }));

        //init units
        var units = game.add.group();
        units.enableBody = true;
        units.physicsBodyType = Phaser.Physics.P2JS;
        groups.units = units;

        //setup collision groups
        groups.unitsCollisionGroup = game.physics.p2.createCollisionGroup();

        //reset bounds collision group
        game.physics.p2.updateBoundsCollisionGroup();

        //input
        game.input.onDown.add(createBubble, this);
        game.input.onUp.add(popBubble, this);
    }

    function update() {
        if(status.isRunning) {

            //initialize units
            if(status.init) {

                //start with 20 units
                for(var i = 0; i < 5; i++)
                    createUnit();

                status.init = false;
            }
            else {
                if(status.currentBubble) {
                    var bub = status.currentBubble;

                    if(bub.scale.y > 5) {
                        popBubble();
                    }
                    else {
                        bub.scale.x += .1;
                        bub.scale.y += .1;
                    }
                }
            }
        }
    }

    function render() {
        texts.score.text = 'Score: ' + status.score;
    }

    function startGame() {
        sprites.logo.visible = false;
        groups.startBtnGroup.setAll('visible', false);

        status.score = 0;
        status.isRunning = true;
        status.init = true;

        timers.unitTimer = game.time.events.loop(Phaser.Timer.SECOND *.5, createUnit);
    }

    function createUnit() {
        groups.units.add(new Unit(game)).init(groups.unitsCollisionGroup);
    }

    function createBubble(pointer, evt) {
        if(!status.isRunning)
            return;

        status.currentBubble = new Bubble(game, evt.layerX, evt.layerY);
    }

    function popBubble(pointer, evt) {
        var bub = status.currentBubble;
        if(bub) {

            var unitsHit = [];
            groups.units.forEach(function(unit) {
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

            //right now, 10 points for each unit killed
            status.score += score * 10;

            bub.destroy();
            delete status.currentBubble;
        }
    }
};