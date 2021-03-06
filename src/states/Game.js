/* global game:true */
import Phaser from 'phaser'
import config from '../config'
import {shuffle, bestSquare} from '../utils'

export default class extends Phaser.State {
    init () {
        this.game.score = 0
        this.level = 1
        this.tiles = []
        this.selectedTiles = []
        this.time = config.time
    }

    preload () {}

    create () {
        const w = this.world.width + 50 * 2
        const h = this.world.height + 50 * 2

        this.world.setBounds(-50, -50, w, h)

        this.background = game.add.tileSprite(-50, -50, w, h, 'background')
        this.background.tileScale.x = 8
        this.background.tileScale.y = 8

        this.placeTiles()

        this.scoreText = game.add.text(game.width - 25, 80, this.game.score, {
            font: '80px badabb',
            fill: '#ffffff'
        })
        this.scoreText.padding.set(10, 10)
        this.scoreText.anchor.set(1, 0.5)

        this.timeText = game.add.text(30, game.height - 5, this.game.score, {
            font: '80px badabb',
            fill: '#ffffff',
            align: 'center'
        })
        this.timeText.padding.set(10, 10)
        this.timeText.anchor.set(0, 1)

        game.time.events.loop(Phaser.Timer.SECOND, this.decreaseTime, this)
    }

    render () {}

    update () {
        this.background.tilePosition.x += 0.08
        this.background.tilePosition.y += 0.09

        this.scoreText.text = this.game.score
        this.timeText.text = this.time
    }

    decreaseTime () {
        this.time--

        if (this.time <= 5) {
            game.sound.play('beep2', 0.2)
        } else if (this.time <= 10) {
            game.sound.play('beep', 0.2)
        }

        if (this.time <= 0) {
            this.resetLevel(1)
            game.state.start('GameOver')
        }
    }

    resetLevel (level) {
        this.tiles.map(function (tile) {
            if (tile.attackEvent) {
                game.time.events.remove(tile.attackEvent)
            }
            tile.destroy()
        })

        this.tiles = []
        this.selectedTiles = []

        this.level = level

        this.placeTiles()
    }

    placeTiles () {
        this.background.frame = Math.floor(Math.random() * 16 + 1)

        const size = config.size * config.scale
        const [cols, rows] = bestSquare(this.level * 2)

        const leftSpace = (game.width - cols * size - (cols - 1) * config.spacing) / 2 + size / 2
        const topSpace = (game.height - rows * size - (rows - 1) * config.spacing) / 2 + size / 2

        let frames = config.playerFrames.slice(0, this.level)
        frames = frames.concat(frames)

        while (cols * rows > frames.length) {
            frames.push(config.mobFrames[Math.floor(Math.random() * config.mobFrames.length)])
        }

        shuffle(frames)

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let tile = game.add.button(leftSpace + i * (size + config.spacing), topSpace + j * (size + config.spacing), 'tiles', this.showTile, this)
                tile.anchor.setTo(0.5)
                tile.smoothed = false
                tile.scale.x = config.scale
                tile.scale.y = config.scale
                tile.value = frames[j * cols + i]

                this.tiles.push(tile)
            }
        }
    }

    showTween (target) {
        this.flipTween(target, target.value)
    }

    hideTween (target) {
        this.flipTween(target, config.hiddenFrame)
    }

    flipTween (target, frame) {
        let backFlipTween = game.add.tween(target.scale).to({x: config.scale, y: config.scale}, 50, Phaser.Easing.Linear.None)

        let flipTween = game.add.tween(target.scale).to({x: 0, y: config.scale * 1.2}, 50, Phaser.Easing.Linear.None)
        flipTween.onComplete.add(function () {
            target.frame = frame
            backFlipTween.start()
        }, this)

        flipTween.start()
    }

    showTile (target) {
        if (this.selectedTiles.length < 2 && this.selectedTiles.indexOf(target) === -1) {
            game.sound.play('click')

            if (target.value === config.mobFrames[0]) {
                return this.creeper(target)
            }

            if (target.value === config.mobFrames[1]) {
                return this.zombie(target)
            }

            if (target.value === config.mobFrames[2]) {
                return this.enderman(target)
            }

            this.showTween(target)

            this.selectedTiles.push(target)

            if (this.selectedTiles.length === 2) {
                game.time.events.add(350, this.checkTiles, this)
            }
        }
    }

    checkTiles (target) {
        if (this.selectedTiles[0].value === this.selectedTiles[1].value) {
            game.sound.play('success', 0.3)

            this.selectedTiles[0].destroy()
            this.selectedTiles[1].destroy()

            if (this.tileLeft() === 0) {
                this.addTime(1 + this.level)
                this.addScore(this.level)
                this.resetLevel(this.level + 1)
            } else {
                this.addTime(2)
                this.addScore(1)
            }
        } else {
            game.sound.play('wrong', 0.3)
            this.hideTween(this.selectedTiles[0])
            this.hideTween(this.selectedTiles[1])
        }
        this.selectedTiles = []
    }

    creeper (target) {
        target.bringToTop()

        if (target.explode && !target.open) {
            this.explode(target)
        } else if (!target.open) {
            this.showTween(target)
            game.sound.play('creeper', 0.3)

            target.animation = game.add.tween(target.scale).to({x: config.scale * 1.3, y: config.scale * 1.3}, 80, Phaser.Easing.Bounce.InOut, true, 0, 8, true)
            target.open = true
            target.explode = true
            target.explodeEvent = game.time.events.add(Phaser.Timer.SECOND, this.explode, this, target)
        } else {
            this.hideTween(target)
            game.time.events.remove(target.explodeEvent)
            target.open = false

            target.animation.stop()
            target.scale.x = config.scale
            target.scale.y = config.scale
        }
    }

    explode (target) {
        this.damage(-5)
        target.destroy()

        game.sound.play('explosion', 0.3)
        let explosion = game.add.sprite(target.x, target.y, 'explosion')
        explosion.scale.x = 4
        explosion.scale.y = 4
        explosion.anchor.x = 0.5
        explosion.anchor.y = 0.5
        let explode = explosion.animations.add('explode')
        explode.killOnComplete = true
        explosion.animations.play('explode', 30)
    }

    zombie (target) {
        if (!target.open) {
            this.showTween(target)
            target.open = true
            target.attackEvent = game.time.events.loop(1500, this.damage, this, -3)
            target.life = 4 + Math.round(Math.random() * 4)
        } else {
            target.animation = game.add.tween(target).to({angle: '-5'}, 50, Phaser.Easing.Bounce.InOut, true, 0, 0, true)
            target.tint = '0xff0000'
            game.time.events.add(60, function (target) {
                target.tint = '0xffffff'
            }, this, target)
            target.life--

            if (target.life <= 0) {
                game.time.events.remove(target.attackEvent)
                game.sound.play('zombieDeath', 0.3)
                target.destroy()
            } else {
                game.sound.play('zombie', 0.3)
            }
        }
    }

    enderman (target) {
        if (!target.open) {
            this.showTween(target)
            target.open = true
            target.attackEvent = game.time.events.loop(1500, this.damage, this, -3)
            target.life = 4 + Math.round(Math.random() * 4)
        } else {
            target.animation = game.add.tween(target).to({angle: '-5'}, 50, Phaser.Easing.Bounce.InOut, true, 0, 0, true)
            target.tint = '0xff0000'
            game.time.events.add(60, function (target) {
                target.tint = '0xffffff'
            }, this, target)
            target.life--

            if (target.life <= 0) {
                game.time.events.remove(target.attackEvent)
                game.sound.play('endermanDeath', 0.3)
                target.destroy()
            } else {
                game.sound.play('enderman', 0.3)

                let tiles = this.tiles.filter(function (tile) {
                    return tile.alive
                })

                let randomTile = tiles[Math.floor(Math.random() * tiles.length)]

                if (randomTile !== target) {
                    let tempX = target.x
                    let tempY = target.y

                    target.x = randomTile.x
                    target.y = randomTile.y

                    randomTile.x = tempX
                    randomTile.y = tempY
                }
            }
        }
    }

    damage (time) {
        this.addTime(time)
        game.sound.play('hit', 0.3)
        game.add.tween(game.camera).to({x: game.camera.x - 20}, 40, Phaser.Easing.Bounce.InOut, true, 0, 1, true)
    }

    tileLeft () {
        return this.tiles.filter(function (tile) {
            return tile.alive && config.mobFrames.indexOf(tile.value) === -1
        }).length
    }

    addTime (number) {
        this.time += number

        let text = game.add.text(95, game.height - 35, this.text, {
            font: '60px badabb',
            fill: (number) > 0 ? '#09c416' : '#f22121',
            align: 'center'
        })
        text.anchor.set(0, 1)
        text.angle = -5

        text.text = (number > 0) ? '+' + number : number

        let tween = game.add.tween(text).to({alpha: 0, y: game.height - 55}, Phaser.Timer.SECOND, 'Linear').start()
        tween.onComplete.add(function () {
            text.destroy()
        })
    }

    addScore (number) {
        this.game.score += number

        if (this.scoreText.animation) {
            this.scoreText.animation.stop()
        }

        this.scoreText.scale.x = 1
        this.scoreText.scale.y = 1

        this.scoreText.animation = game.add.tween(this.scoreText.scale).to({x: 1.3, y: 1.3}, 50, Phaser.Easing.Bounce.InOut, true, 0, 0, true)
    }
}
