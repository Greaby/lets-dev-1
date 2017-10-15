import Phaser from 'phaser'
import Config from '../config'

export default class extends Phaser.State {
    preload () {
        this.game.stage.backgroundColor = 0x2b2b2b
        this.game.scale.pageAlignHorizontally = true
        this.game.scale.pageAlignVertically = true
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

        this.load.spritesheet('tiles', 'assets/tiles.png', Config.size, Config.size)
        this.load.spritesheet('background', 'assets/background.png', 16, 16)
        this.load.spritesheet('explosion', 'assets/explosion.png', 96, 96)

        this.load.audio('hit', ['assets/hit.ogg'])
        this.load.audio('click', ['assets/click.ogg'])
        this.load.audio('success', ['assets/success.ogg'])
        this.load.audio('wrong', ['assets/wrong.ogg'])
        this.load.audio('creeper', ['assets/creeper.ogg'])
        this.load.audio('explosion', ['assets/explosion.ogg'])
        this.load.audio('zombie', ['assets/zombie.ogg'])
        this.load.audio('zombieDeath', ['assets/zombie_death.ogg'])
        this.load.audio('enderman', ['assets/enderman.ogg'])
        this.load.audio('endermanDeath', ['assets/enderman_death.ogg'])

        this.load.audio('beep', ['assets/beep.mp3'])
        this.load.audio('beep2', ['assets/beep2.mp3'])

        this.load.onLoadComplete.add(this.loadComplete, this)

        let text = this.add.text(this.world.centerX, this.world.centerY, 'loading', {font: '16px Arial', fill: '#dddddd', align: 'center'})
        text.anchor.setTo(0.5, 0.5)
    }

    loadComplete () {
        this.state.start('Game')
    }
}
