var Game = require('./game');

var GameView = function (canvas, ctx, gameOverModal) {
  this.canvas = canvas;
  this.ctx = ctx;
  this.moving = false;
  this.game = null;
  this.gameOverModal = gameOverModal;
};

GameView.prototype.start = function (canvas) {
  this.game = new Game(this.gameOverModal);
  this.canvas.addEventListener("mousedown", this.clickOrb.bind(this), false);
  this.canvas.addEventListener("mousemove", this.moveOrb.bind(this), false);
  this.canvas.addEventListener("mouseup", this.unClickOrb.bind(this), false);
  this.lastTime = 0;

  var aniFramVal1 = requestAnimationFrame(this.animate.bind(this));

  if (this.game.gameOver()){
    this.game.removeDisappear();
    cancelAnimationFrame(aniFramVal1);
    this.game.removeDisappear();
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

  if (this.game.orb.includesPos(mousePos[0], mousePos[1])) {
    this.game.makeOrbs(this.game);
  } else {
    this.game.toggleMoving(mousePos[0], mousePos[1], this.ctx);
    this.moving = true;
  }
};

GameView.prototype.moveOrb = function (e) {
  var mousePos = this.getMouse(e);
  if (this.moving) {
      this.game.attemptMove(mousePos[0], mousePos[1]);
  }
};

GameView.prototype.unClickOrb = function (e) {
  var mousePos = this.getMouse(e);
  if (this.moving) {
    this.game.smallOrbs.forEach(function (orb) {
      if (orb.clicked) {
        orb.clicked = false;
        orb.setVel(orb.moves);
      }
    });
  }
  this.moving = false;
};

GameView.prototype.animate = function (time){
  var timeDelta = time - this.lastTime;

  this.game.step(timeDelta);
  this.game.draw(this.canvas, this.ctx, this.aniFramVal);
  this.lastTime = time;

  var aniFramVal = requestAnimationFrame(this.animate.bind(this));

  if (this.game.gameOver()){
    cancelAnimationFrame(aniFramVal);
    this.game.removeDisappear();
  }
};

module.exports = GameView;
