import Phaser from 'phaser';
import Config from "../config";

export default class extends Phaser.State {

	preload() {
		this.game.stage.backgroundColor = 0x2b2b2b;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		this.load.spritesheet("tiles", "assets/tiles.png", Config.size, Config.size);
		this.load.spritesheet("background", "assets/background.png", 128, 128);

		this.load.onLoadComplete.add(this.loadComplete, this);

		let text = this.add.text(this.world.centerX, this.world.centerY, "loading", {font: "16px Arial", fill: "#dddddd", align: "center"});
		text.anchor.setTo(0.5, 0.5);
	}

	loadComplete() {
		this.state.start("Game");
	}

}