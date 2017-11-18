/* global game:true */
import Phaser from 'phaser'

export default class extends Phaser.State {
    create () {
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
}
