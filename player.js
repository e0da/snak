'use strict'

class Player {

  get TURN_SPEED()         { return 3 }
  get SPEED()              { return -200 /* y-axis is negative; so is speed */ }
  get SEGMENT_DISTANCE()   { return 50 }
  get CENTER()             { return { x: game.width/2, y: game.height/2 } }
  get DEGREES_PER_RADIAN() { return 57.2958 }

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
    this.head.body.rotation += this.TURN_SPEED * direction
  }

  updateHeadSprite(player) {
    return function() {
      player.updateVelocityVector(this)
      player.updateTail()
    }
  }

  grow() {
    let prev = this.tail.length === 0 ? this.head
                                      : this.tail.children[this.tail.length-1]
    this.tail.add(this.createSegment(prev))
  }

  createSegment(prev) {
    let position = prev ? prev.position.clone() : this.CENTER
    let sprite = game.add.sprite(position.x, position.y, 'player')
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
          > this.SEGMENT_DISTANCE) {
        this.updateVelocityVector(sprites[i])
      }
      prev = sprites[i]
    }
  }

  updateVelocityVector(sprite) {
    // rotation matrix
    // [xp,yp] = [xcost-ysint,xsint+ycost]
    // ...but x is always 0 so [-ysint,ycost]
    let rotationRadians = sprite.body.rotation / this.DEGREES_PER_RADIAN
    sprite.body.velocity.x = -this.SPEED * Math.sin(rotationRadians)
    sprite.body.velocity.y =  this.SPEED * Math.cos(rotationRadians)
  }
}
