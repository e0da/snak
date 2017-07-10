'use strict'

class Player {

  get turnSpeed()       { return 3 }
  get speed()           { return 200 }
  get segmentDistance() { return 50 }
  get center()          { return { x: game.width/2, y: game.height/2 } }

  constructor() {
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
    game.physics.arcade.enable(sprite)
    sprite.body.collideWorldBounds = true
    sprite.anchor.setTo(0.5, 0.5)
    return sprite
  }

  updateTail() {
    let prev = this.sprite
    for (let i = 0; i < this.tail.length; i++) {
      // N.B. I don't get why game.physics.arcade.angleBetween doesn't work
      // like I expect it to, so straight math for the rotation.
      this.tail[i].rotation =
        -Math.atan2(this.tail[i].position.x - prev.position.x,
                    this.tail[i].position.y - prev.position.y)
      if (game.physics.arcade.distanceBetween(sprites[i], prev)
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
