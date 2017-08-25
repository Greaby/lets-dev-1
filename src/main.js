import 'pixi';
import 'p2';
import Phaser from 'phaser';
import GameState from './states/Game';
import GameOverState from './states/GameOver';
import BootState from './states/Boot';
import config from './config';
import {testLocalStorage} from "./utils";

class Game extends Phaser.Game {
    constructor() {
        super(config.width, config.height);

        this.score = 0;
        this.best = 0;

        this.localStorageAvailable = testLocalStorage();

        if(this.localStorageAvailable)
            this.best = localStorage.getItem("best") || 0;

        this.state.add("GameOver", GameOverState, false);
        this.state.add("Game", GameState, false);
        this.state.add("Boot", BootState, true);
    }
}

window.game = new Game();
