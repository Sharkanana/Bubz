
/**
 * Entry point
 */
window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

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
        game.load.spritesheet('btn', 'img/button.png', 80, 20);
        game.load.spritesheet('unit', 'img/unit.png', 27, 29);
    }

    function create () {

        game.physics.startSystem(Phaser.Physics.ARCADE);

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
        units.physicsBodyType = Phaser.Physics.ARCADE;
        groups.units = units;
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

            }
        }
    }

    function render() {

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

        unit.body.bounce.set(1);
        unit.body.collideWorldBounds = true;
        unit.body.velocity.x = game.rnd.integerInRange(-200, 200);
        unit.body.velocity.y = game.rnd.integerInRange(-200, 200);
    }
};