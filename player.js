'use strict'

class Player {

  get turnSpeed()       { return 3 }
  get speed()           { return 200 }
  get segmentDistance() { return 50 }
  get center()          { return { x: this.gameWidth/2, y: this.gameHeight/2 } }

  constructor(game, gameWidth, gameHeight) {
    this.game          = game
    this.gameWidth     = gameWidth
    this.gameHeight    = gameHeight
    this.sprite        = this.createSegment()
    this.tail          = []
    this.sprite.update = this.updateSprite(this)
  }

  leftKey() {
    this.turn(-1)
  }

  rightKey() {
    this.turn(1)
  }

  turn(direction) {
    this.sprite.body.rotation += this.turnSpeed * direction
  }

  updateSprite(player) {
    return function() {
      this.body.velocity = player.velocityVector(this)
      player.updateTail()
    }
  }

  grow() {
    let prev = this.tail.length === 0 ? this.sprite
                                      : this.tail[this.tail.length-1]
    this.tail[this.tail.length] = this.createSegment(prev)
  }

  createSegment(prev) {
    let location = prev ? prev.position.clone() : this.center
    let sprite = game.add.sprite(location.x, location.y, 'player')
    this.game.physics.arcade.enable(sprite)
    sprite.body.collideWorldBounds = true
    sprite.anchor.setTo(0.5, 0.5)
    return sprite
  }

  updateTail() {
    let prev = this.sprite
    for (let i = 0; i < this.tail.length; i++) {
      // N.B. I don't get why this.game.physics.arcade.angleBetween doesn't work
      // like I expect it to, so straight math for the rotation.
      this.tail[i].rotation =
        -Math.atan2(this.tail[i].position.x - prev.position.x,
                    this.tail[i].position.y - prev.position.y)
      if (this.game.physics.arcade.distanceBetween(this.tail[i], prev)
          > this.segmentDistance) {
        this.tail[i].body.velocity = this.velocityVector(this.tail[i])
      }
      prev = this.tail[i]
    }
  }

  velocityVector(sprite) {
    return Phaser.Point.rotate(
      new Phaser.Point(0, -this.speed), 0, 0, sprite.body.rotation, true)
  }
}
