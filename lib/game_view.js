var Game = require('./game');

var GameView = function (canvas, ctx, gameOverModal, gameOverModalWindow) {
  this.canvas = canvas;
  this.game = new Game(canvas, gameOverModal, gameOverModalWindow);
  this.ctx = ctx;
  this.moving = false;
  this.gameOverModal = gameOverModal;
  this.gameOverModalWindow = gameOverModalWindow;
};

// GameView.prototype.refresh = function (canvas) {
//   this.canvas.addEventListener("focus", this.start.bind(this), false);
// };

GameView.prototype.start = function (canvas) {
  var that = this;
  this.canvas.addEventListener("mousedown", this.clickOrb.bind(this), false);
  this.canvas.addEventListener("mousemove", this.moveOrb.bind(this), false);
  this.canvas.addEventListener("mouseup", this.unClickOrb.bind(this), false);

  window.addEventListener("keydown", this.spaceDown.bind(this), false);

  this.lastTime = 0;

  var aniFramVal = requestAnimationFrame(this.animate.bind(this));
  this.gameOverModal.addEventListener('click',
    function () {
      // var gameOverModal = document.getElementsByClassName('modal-background-game-over');
      // var gameOverModalWindow = document.getElementsByClassName('modal-window-game-over');
      window.cancelAnimationFrame(aniFramVal);
      that.gameOverModalWindow.classList.toggle("disappear");
      that.gameOverModal.classList.toggle("disappear");
      // new GameView(canvas, ctx, gameOverModal[0], gameOverModalWindow[0]);
    }, false);

  this.gameOverModalWindow.addEventListener('click',
    function () {
      // var gameOverModal = document.getElementsByClassName('modal-background-game-over');
      // var gameOverModalWindow = document.getElementsByClassName('modal-window-game-over');
      window.cancelAnimationFrame(aniFramVal);
      that.gameOverModal.classList.toggle("disappear");
      that.gameOverModalWindow.classList.toggle("disappear");
      // new GameView(canvas, ctx, gameOverModal[0], gameOverModalWindow[0]);
    }, false);
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

      if (orb.clicked) {
        orb.setVel(orb.moves);

        orb.clicked = false;
      }
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
  this.game.draw(this.canvas, this.ctx);
  this.lastTime = time;

  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
