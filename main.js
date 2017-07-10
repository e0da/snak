'use strict'

// TODO player should have higher Z-index than goals

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
  preload: preload, create: create, update: update})

var initialSize = 2

function preload() {
  this.load.image('player', 'assets/Player.png')
  this.load.image('goal', 'assets/Light.png')
}

function create() {

  window.ctx = this

  this.physics.startSystem(Phaser.Physics.ARCADE)
  this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

  initializeSprites()

  this.text = game.add.text(0, 0, '0', {fill: '#00ff00'})

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

function initializeSprites() {
  ctx.player = new Player()
  ctx.goals  = game.add.group()
  for (let i = 0; i < initialSize; i++) {
    ctx.player.grow()
  }
}

function update() {

  ['left', 'right'].forEach(function (key) {
    if (this.controls[key].isDown) this.player[`${key}Key`]()
  }.bind(this))

  if (game.input.activePointer.isDown) {
    if (game.input.activePointer.position.x < game.width / 2) {
      this.player.leftKey()
    }
    else {
      this.player.rightKey()
    }
  }

  sometimes(0.01, addRandomGoal)
  game.physics.arcade.overlap(this.player.head, this.goals, win)
  game.physics.arcade.overlap(this.player.head, this.player.tail, lose)

  renderScore()
  // renderDebugText()
}

function win(_head, goal) {
  ctx.player.grow()
  goal.destroy()
}

function lose(_head, tailSegment) {
  if (ctx.player.tail.children.indexOf(tailSegment) > 1) {
    ctx.goals.destroy()
    ctx.player.tail.destroy()
    ctx.player.head.destroy()
    initializeSprites()
  }
}

function sometimes(probability, callback) {
  if ((Math.random()) > (1 - probability)) {
    callback()
  }
}

function addRandomGoal() {
  let position = randomEmptyPosition()
  ctx.goals.add(new Goal(randomEmptyPosition()).sprite)
}

// TODO Check whether it's empty :P
function randomEmptyPosition() {
  return new Phaser.Point(Math.floor(Math.random() * game.width),
                          Math.floor(Math.random() * game.height))
}

function round(num) {
  let precision = 10
  return Math.floor(num * precision) / precision
}

function renderScore() {
  ctx.text.setText(ctx.player.tail.length - initialSize)
}

function renderDebugText() {
  let debug = document.querySelector('#debug')

  let velx  = round(ctx.player.head.body.velocity.x)
  let vely  = round(ctx.player.head.body.velocity.x)
  let rot   = round(ctx.player.head.body.rotation)
  let speed = round(ctx.player.head.body.speed)
  let posx  = round(ctx.player.head.position.x)
  let posy  = round(ctx.player.head.position.y)

  return debug.innerHTML =
  `Speed: ${speed}
   Position: ${posx},${posy}
   Rotation: ${rot}
   Velocity vector: ${velx},${vely}
  `
}
