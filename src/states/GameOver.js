/* global game:true */
import Phaser from 'phaser'

export default class extends Phaser.State {
    create () {
        this.background = game.add.tileSprite(0, 0, this.world.width, this.world.height, 'background')
        this.background.tileScale.x = 8
        this.background.tileScale.y = 8
        this.background.frame = Math.floor(Math.random() * 16 + 1)

        if (this.game.score > this.game.best) {
            this.game.best = this.game.score
        }

        if (this.game.localStorageAvailable) {
            localStorage.setItem('best', this.game.best)
        }

        let scoreText = game.add.text(game.width / 2, game.height / 2 - 80, 'Score : ' + this.game.score, {
            font: '100px badabb',
            fill: '#ffffff'
        })
        scoreText.padding.set(10, 10)
        scoreText.anchor.set(0.5, 0.5)

        let bestText = game.add.text(game.width / 2, game.height / 2, 'Meilleur score : ' + this.game.best, {
            font: '50px badabb',
            fill: '#ffffff'
        })
        bestText.padding.set(100, 100)
        bestText.anchor.set(0.5, 0.5)

        let replayBtn = game.add.button(game.width / 2, game.height / 2 + 150, 'replay-btn', this.restartGame, this, 1, 1, 0)
        replayBtn.anchor.set(0.5)
    }

    render () {}

    update () {
        this.background.tilePosition.x += 0.08
        this.background.tilePosition.y += 0.09
    }

    restartGame () {
        game.state.start('Game')
    }
}
