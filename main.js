'use strict'

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
  preload: preload, create: create, update: update})

function preload() {
  this.load.image('player', 'assets/Player.png')
}

function create() {
  this.physics.startSystem(Phaser.Physics.ARCADE)
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

  this.player = new Player()

  for (let i = 0; i < 20; i++) {
    this.player.grow()
  }

  var cursors = this.input.keyboard.createCursorKeys()
  this.controls = {
    up:       cursors.up,
    down:     cursors.down,
    left:     cursors.left,
    right:    cursors.right,
    spacebar: this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
  }

  this.input.keyboard.addKeyCapture([
    Phaser.Keyboard.LEFT,
    Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.UP,
    Phaser.Keyboard.DOWN,
    Phaser.Keyboard.SPACEBAR,
  ])
}

function update() {
  // this.physics.arcade.collide(players, food, shootRock)

  ['left', 'right'].forEach(function (key) {
    if (this.controls[key].isDown) this.player[`${key}Key`]()
  }.bind(this))

  renderDebugText(this.player)()
}

function round(num) {
  let precision = 10
  return Math.floor(num * precision) / precision
}

function renderDebugText(player) {
  let debug = document.querySelector('#debug')
  return function () {
    let velx  = round(player.sprite.body.velocity.x)
    let vely  = round(player.sprite.body.velocity.x)
    let rot   = round(player.sprite.body.rotation)
    let speed = round(player.sprite.body.speed)
    let posx  = round(player.sprite.position.x)
    let posy  = round(player.sprite.position.y)

    let tvelx  = round(player.tail[0].body.velocity.x)
    let tvely  = round(player.tail[0].body.velocity.x)
    let trot   = round(player.tail[0].body.rotation)
    let tspeed = round(player.tail[0].body.speed)
    let tposx  = round(player.tail[0].position.x)
    let tposy  = round(player.tail[0].position.y)

    return debug.innerHTML =
    `Speed: ${speed}
     Position: ${posx},${posy}
     Rotation: ${rot}
     Velocity vector: ${velx},${vely}
     Tail Speed: ${tspeed}
     Tail Position: ${tposx},${tposy}
     Tail Rotation: ${trot}
     Tail Velocity vector: ${tvelx},${tvely}
    `
  }
}
