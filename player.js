'use strict'

class Player {

  get turnSpeed()       { return 3 }
  get speed()           { return 200 }
  get segmentDistance() { return 50 }
  get center()          { return { x: game.width/2, y: game.height/2 } }

  constructor() {
    this.head        = this.createSegment()
    this.tail        = game.add.group()
    this.head.update = this.updateHeadSprite(this)
  }

  leftKey() {
    this.turn(-1)
  }

  rightKey() {
    this.turn(1)
  }

  turn(direction) {
    this.head.body.rotation += this.turnSpeed * direction
  }

  updateHeadSprite(player) {
    return function() {
      this.body.velocity = player.velocityVector(this)
      player.updateTail()
    }
  }

  grow() {
    let prev = this.tail.length === 0 ? this.head
                                      : this.tail.children[this.tail.length-1]
    this.tail.add(this.createSegment(prev))
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
    let prev = this.head
    let sprites = this.tail.children
    for (let i = 0; i < sprites.length; i++) {
      // N.B. I don't get why game.physics.arcade.angleBetween doesn't work
      // like I expect it to, so straight math for the rotation.
      sprites[i].rotation =
        -Math.atan2(sprites[i].position.x - prev.position.x,
                    sprites[i].position.y - prev.position.y)
      if (game.physics.arcade.distanceBetween(sprites[i], prev)
          > this.segmentDistance) {
        sprites[i].body.velocity = this.velocityVector(sprites[i])
      }
      prev = sprites[i]
    }
  }

  velocityVector(sprite) {
    return Phaser.Point.rotate(
      new Phaser.Point(0, -this.speed), 0, 0, sprite.body.rotation, true)
  }
}
