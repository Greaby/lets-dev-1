/* global game:true */
import Phaser from 'phaser'

export default class extends Phaser.State {
    create () {
        const w = this.world.width + 50 * 2
        const h = this.world.height + 50 * 2

        this.background = game.add.tileSprite(-50, -50, w, h, 'background')
        this.background.tileScale.x = 8
        this.background.tileScale.y = 8
        this.background.frame = Math.floor(Math.random() * 16 + 1)

        if (this.game.score > this.game.best) {
            this.game.best = this.game.score
        }

        if (this.game.localStorageAvailable) {
            localStorage.setItem('best', this.game.best)
        }

        let scoreText = game.add.text(game.width / 2, game.height / 2 - 40, 'Score : ' + this.game.score, {
            font: '100px badabb',
            fill: '#ffffff'
        })
        scoreText.padding.set(10, 10);
        scoreText.anchor.set(0.5, 0.5)

        let bestText = game.add.text(game.width / 2, game.height / 2 + 40, 'Meilleur score : ' + this.game.best, {
            font: '50px badabb',
            fill: '#ffffff'
        })
        bestText.padding.set(10, 10);
        bestText.anchor.set(0.5, 0.5)
    }

    render () {}

    update () {
        this.background.tilePosition.x += 0.08
        this.background.tilePosition.y += 0.09
    }
}
