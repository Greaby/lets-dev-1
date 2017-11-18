/* global game:true */
import Phaser from 'phaser'

export default class extends Phaser.State {
    init () {}

    preload () {

    }

    create () {
        game.sound.play('background', 0.1, true)

        this.background = game.add.tileSprite(0, 0, this.world.width, this.world.height, 'background')
        this.background.tileScale.x = 8
        this.background.tileScale.y = 8
        this.background.frame = Math.floor(Math.random() * 16 + 1)

        let title = game.add.sprite(game.width / 2, 250, 'title')
        title.anchor.set(0.5)

        let start = game.add.button(game.width / 2, game.height / 2 + 100, 'play-btn', this.startGame, this, 0, 0, 1)
        start.anchor.set(0.5)

        let shadow = game.add.sprite(game.width / 2, game.height - 25, 'team')
        shadow.anchor.set(0.5, 1)
        shadow.tint = 0x000000
        shadow.alpha = 0.6
        shadow.height = 30

        let perso = game.add.sprite(game.width / 2, game.height - 20, 'team')
        perso.anchor.set(0.5, 1)
    }

    update () {
        this.background.tilePosition.x += 0.08
        this.background.tilePosition.y += 0.09
    }

    startGame () {
        game.state.start('Game')
    }
}
