
/**
 * Entry point
 */
window.onload = function() {

    var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

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
        game.scaleRatio = window.devicePixelRatio / 3;

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

        //create game over text
        texts.tooBad = game.add.text(game.world.centerX, game.world.centerY, 'Too Bad', { font: '32px bold arial' });
        texts.tooBad.anchor.setTo(0.5, 0.5);
        texts.tooBad.visible = false;

        //create score indicator
        texts.score = game.add.text(5, 5);

        //create start button
        groups.startBtnGroup = game.add.group();
        buttons.startBtn = groups.startBtnGroup.add(new Phaser.Button(game, game.world.centerX-40, game.world.centerY+100, 'btn', startGame, this, 0, 1, 2));
        texts.startBtnLabel = groups.startBtnGroup.add(new Phaser.Text(game, game.world.centerX-15, game.world.centerY+102, 'Start', { font: '14px bold arial' }));

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

                //start with 5 units
                for(var i = 0; i < 5; i++)
                    createUnit();

                status.init = false;
            }
            else {
                //grow bubble
                if(status.currentBubble) {
                    if(!status.currentBubble.grow())
                        popBubble();
                }

                //game end condition
                if(groups.units.length > 50)
                    endGame();
            }
        }
    }

    function render() {
        texts.score.text = 'Score: ' + status.score;
    }

    function startGame() {
        //init units
        var units = game.add.group();
        units.enableBody = true;
        units.physicsBodyType = Phaser.Physics.P2JS;
        groups.units = units;

        game.stage.backgroundColor = '#72ADFF';

        sprites.logo.visible = false;
        texts.tooBad.visible = false;
        groups.startBtnGroup.setAll('visible', false);

        status.score = 0;
        status.isRunning = true;
        status.init = true;

        timers.unitTimer = game.time.events.loop(Phaser.Timer.SECOND * .5, createUnit);
    }

    function endGame() {
        status.isRunning = false;
        game.stage.backgroundColor = '#FF7B59';
        groups.units.destroy(true);
        texts.tooBad.visible = true;
        groups.startBtnGroup.setAll('visible', true);

        game.time.events.remove(timers.unitTimer);
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
        if(status.currentBubble) {
            status.score += status.currentBubble.pop(groups.units);
            delete status.currentBubble;
        }
    }
};