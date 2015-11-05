
/**
 * Entry point
 */
window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    var texts = {},
        buttons = {},
        groups = {},
        sprites = {},
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
        texts.score = game.add.text(5, 5, 'Score: ');

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
        groups.bubbleCollisionGroup = game.physics.p2.createCollisionGroup();

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
                for(var i = 0; i < 20; i++)
                    createUnit();

                status.init = false;
            }
            else {
                if(status.currentBubble) {
                    var bub = status.currentBubble;
                    bub.scale.x += .1;
                    bub.scale.y += .1;
                }
            }
        }
    }

    function startGame() {
        sprites.logo.visible = false;
        groups.startBtnGroup.setAll('visible', false);

        status.isRunning = true;
        status.init = true;
    }

    function createUnit() {
        var good = !!Math.round(game.rnd.frac());

        var unit = groups.units.create(
            game.rnd.integerInRange(5, 795),
            game.rnd.integerInRange(5, 595),
            'unit',
            good ? 0 : 1
        );

        unit.body.setCollisionGroup(groups.unitsCollisionGroup);
        unit.body.collides(groups.bubbleCollisionGroup);
        unit.body.setZeroDamping();
        unit.body.velocity.x = game.rnd.integerInRange(300, 400) * (Math.round(game.rnd.frac()) || -1);
        unit.body.velocity.y = game.rnd.integerInRange(300, 400) * (Math.round(game.rnd.frac()) || -1);
    }

    function createBubble(pointer, evt) {

        if(!status.isRunning)
            return;

        var x = evt.layerX,
            y = evt.layerY;

        var bub = game.add.sprite(x, y, 'bubble');
        game.physics.p2.enable(bub);
        bub.scale.x*=.1;
        bub.scale.y*=.1;

        bub.body.setCollisionGroup(groups.bubbleCollisionGroup);

        status.currentBubble = bub;
    }

    function popBubble(pointer, evt) {
        if(status.currentBubble) {

            status.currentBubble.body.collides(groups.unitsCollisionGroup, function(bubble, unit) {
                if(unit.sprite)
                    unit.sprite.destroy();
            });

            delete status.currentBubble;
        }
    }
};