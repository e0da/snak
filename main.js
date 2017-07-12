'use strict'

// TODO player should have higher Z-index than goals

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {
  preload: preload, create: create, update: update, render: render})

const INITIAL_SIZE = 2
const MAX_GOALS    = 10

function preload() {
  window.ctx = this

  this.load.image('player', 'assets/Player.png')
  this.load.image('goal', 'assets/Light.png')
}

function create() {

  ctx.physics.startSystem(Phaser.Physics.ARCADE)
  ctx.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL

  initializeSprites()

  ctx.score     = 0
  ctx.highScore = getHighScore()

  ctx.scoreText     = game.add.text(0,          0, '0', {fill: '#00ff00'})
  ctx.highScoreText = game.add.text(game.width, 0, '0', {fill: '#00ff00'})
  ctx.highScoreText.anchor = new Phaser.Point(1, 0)

  var cursors = ctx.input.keyboard.createCursorKeys()
  ctx.controls = {
    up:       cursors.up,
    down:     cursors.down,
    left:     cursors.left,
    right:    cursors.right,
    spacebar: ctx.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
  }

  ctx.input.keyboard.addKeyCapture([
    Phaser.Keyboard.LEFT,
    Phaser.Keyboard.RIGHT,
    Phaser.Keyboard.UP,
    Phaser.Keyboard.DOWN,
    Phaser.Keyboard.SPACEBAR,
  ])
}

function getHighScore() {
  return localStorage.getItem('highScore') || 0
}

function initializeSprites() {
  ctx.player = new Player(INITIAL_SIZE)
  ctx.goals  = game.add.group()
  for (let i = 0; i < MAX_GOALS; i++) {
    let goal = ctx.goals.add(new Goal(0, 0).sprite)
    goal.kill()
  }
}

function update() {

  // Handle input
  ['left', 'right'].forEach(function (key) {
    if (ctx.controls[key].isDown) ctx.player[`${key}Key`]()
  }.bind(ctx))

  if (game.input.activePointer.isDown) {
    if (game.input.activePointer.position.x < game.width / 2) {
      ctx.player.leftKey()
    }
    else {
      ctx.player.rightKey()
    }
  }

  // DO STUFF! Main game logic
  sometimes(0.01, addRandomGoal)
  game.physics.arcade.overlap(ctx.player.head, ctx.goals, win)
  game.physics.arcade.overlap(ctx.player.head, ctx.player.tail, lose)

  ctx.score = ctx.player.length - INITIAL_SIZE
}

function win(_head, goal) {
  ctx.player.grow()
  goal.kill()
}

function lose(_head, tailSegment) {
  if (ctx.player.tail.children.indexOf(tailSegment) > 1) {
    updateHighScore()
    reset()
  }
}

function reset() {
  ctx.goals.destroy()
  ctx.player.tail.destroy()
  ctx.player.head.destroy()
  ctx.highScore = getHighScore()
  initializeSprites()
}

function updateHighScore() {
  ctx.highScore = Math.max(localStorage.getItem('highScore'), ctx.score)
  localStorage.setItem('highScore', ctx.highScore)
}

function sometimes(probability, callback) {
  if ((Math.random()) > (1 - probability)) {
    callback()
  }
}

function addRandomGoal() {
  let position = randomEmptyPosition()
  let goal = ctx.goals.getFirstDead(false, position.x, position.y)
  goal && goal.revive()
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

function render() {
  ctx.scoreText.setText(ctx.score)
  ctx.highScoreText.setText(ctx.highScore)

  if (window.DEBUG) {
    game.debug.bodyInfo(ctx.player.head)
    game.debug.body(ctx.player.head)
    for (let i = 0; i < ctx.player.tail.length; i++) {
      game.debug.body(ctx.player.tail.children[i])
    }
    for (let i = 0; i < ctx.goals.length; i++) {
      game.debug.body(ctx.goals.children[i])
    }
  }
}
