import 'pixi';
import 'p2';
import Phaser from 'phaser';
import GameState from './states/Game';
import config from './config';

class Game extends Phaser.Game {
	constructor() {
		super(config.width, config.height);
		this.state.add("Game", GameState, true);
	}
}

window.game = new Game();