var Game = require('./game');
// var CanvasState = require('./canvas_state');
var GameView = function (canvas, ctx) {
  this.canvas = canvas;
  this.game = new Game();
  this.ctx = ctx;
  this.moving = false;
};


GameView.prototype.start = function (canvas) {
  this.canvas.addEventListener("mousedown", this.clickOrb.bind(this), false);
  this.canvas.addEventListener("mousemove", this.moveOrb.bind(this), false);
  this.canvas.addEventListener("mouseup", this.unClickOrb.bind(this), false);
  window.addEventListener("keydown", this.spaceDown.bind(this), false);

  this.lastTime = 0;

  requestAnimationFrame(this.animate.bind(this));
};


GameView.prototype.spaceDown = function (e){
  var game = this.game;
  // debugger
  if (e.code === "Space"){
    this.game.makeOrbs(game);
  }
};

GameView.prototype.getMouse = function (e) {
  var canvasRect = this.canvas.getBoundingClientRect();
  mouseX = (e.clientX - canvasRect.left);
  mouseY = (e.clientY - canvasRect.top);

  return [mouseX, mouseY];
};

GameView.prototype.clickOrb = function (e) {
  var mousePos = this.getMouse(e);
  this.game.toggleMoving(mousePos[0], mousePos[1], this.ctx);
  this.moving = true;
};

GameView.prototype.moveOrb = function (e) {
  var mousePos = this.getMouse(e);
  if (this.moving) {
    this.game.attemptMove(mousePos[0], mousePos[1]);
  }
};

GameView.prototype.unClickOrb = function (e) {
  // debugger
  var mousePos = this.getMouse(e);
  if (this.moving) {
    this.game.smallOrbs.forEach(function (orb) {
      orb.clicked = false;
    });
  }
  this.moving = false;
  // this.game.toggleMoving(mousePos[0], mousePos[1]);
};

GameView.prototype.animate = function (time){
  var timeDelta = time - this.lastTime;
  // this.smallOrbs.forEach(function (orb) {
  //   orb.move();
  // });
  this.game.step(timeDelta);
  this.game.draw(this.ctx);
  this.lastTime = time;

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
