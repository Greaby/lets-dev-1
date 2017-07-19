import Phaser from 'phaser';
import config from '../config';
import {shuffle} from '../utils';

export default class extends Phaser.State {

	init() {
		this.level = 8;
		this.selectedTiles = [];
	}

	preload() {
		this.load.spritesheet("tiles", "assets/tiles.png", config.size, config.size);
	}

	create() {
		this.placeTiles();
	}

	render() {}

	placeTiles() {
		const size = config.size * config.scale;
		const [cols, rows] = [4,4];

		const leftSpace = (game.width - cols * size - (cols - 1) * config.spacing) / 2 + size / 2;
		const topSpace = (game.height - rows * size - (rows - 1) * config.spacing) / 2 + size / 2;

		let frames = config.playerFrames.slice(0, this.level);
		frames = frames.concat(frames);

		shuffle(frames);

		for (var i = 0; i < cols; i++) {
			for (var j = 0; j < rows; j++) {
				let tile = game.add.button(leftSpace + i * (size + config.spacing), topSpace + j * (size + config.spacing), "tiles", this.showTile, this);
				tile.anchor.setTo(0.5);
				tile.smoothed = false;
				tile.scale.x = config.scale;
				tile.scale.y = config.scale;
				tile.value = frames[j * cols + i];
			}
		}
	}

	showTile(target) {
		if(this.selectedTiles.length < 2 && this.selectedTiles.indexOf(target) === -1) {
			target.frame = target.value;
			this.selectedTiles.push(target);

			if(this.selectedTiles.length === 2) {
				game.time.events.add(Phaser.Timer.SECOND / 4, this.checkTiles, this);
			}
		}
	}

	checkTiles(target) {
		if(this.selectedTiles[0].value === this.selectedTiles[1].value) {
			this.selectedTiles[0].destroy();
			this.selectedTiles[1].destroy();
		} else {
			this.selectedTiles[0].frame = config.hiddenFrame;
			this.selectedTiles[1].frame = config.hiddenFrame;
		}
		this.selectedTiles = [];
	}


}