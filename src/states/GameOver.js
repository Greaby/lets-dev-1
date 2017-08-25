import Phaser from 'phaser';
import config from '../config';

export default class extends Phaser.State {

    create() {

        if(this.game.score > this.game.best)
            this.game.best = this.game.score;

        if(this.game.localStorageAvailable)
            localStorage.setItem("best", this.game.best);

        let scoreText = game.add.text(game.width / 2, game.height / 2 - 40, "Score : " + this.game.score, {
            font : "100px Arial",
            fill: "#ffffff",
            align: "center"
        });
        scoreText.anchor.set(0.5, 0.5);

        let bestText = game.add.text(game.width / 2, game.height / 2 + 40, "Meilleur score : " + this.game.best, {
            font : "50px Arial",
            fill: "#ffffff",
            align: "center"
        });
        bestText.anchor.set(0.5, 0.5);

    }

    render() {}

}
