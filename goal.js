'use strict'

class Goal {
  constructor(position) {
    this.sprite = game.add.sprite(position.x, position.y, 'goal')
    game.physics.arcade.enable(this.sprite)
    this.sprite.anchor.setTo(0.5, 0.5)
  }
}
