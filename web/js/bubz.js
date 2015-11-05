
/**
 * Entry point
 */
window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    var texts = {},
        buttons = {},
        groups = {},
        sprites = {};

    function preload () {
        game.load.image('logo', 'img/bubz-logo.png');
        game.load.spritesheet('btn', 'img/button.png', 80, 20);
    }

    function create () {
        game.stage.backgroundColor = '#72ADFF';

        sprites.logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        sprites.logo.anchor.setTo(0.5, 0.5);

        texts.score = game.add.text(5, 5, 'Score: ');

        groups.startBtnGroup = game.add.group();
        buttons.startBtn = groups.startBtnGroup.add(new Phaser.Button(game, 360, 400, 'btn', startGame, this, 0, 1, 2));
        texts.startBtnLabel = groups.startBtnGroup.add(new Phaser.Text(game, 385, 402, 'Start', { font: '14px bold arial' }));
    }

    function update() {



    }

    function render() {

    }

    function startGame() {
        sprites.logo.visible = false;
        groups.startBtnGroup.setAll('visible', false);
    }
};