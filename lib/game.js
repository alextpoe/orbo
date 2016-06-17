var Utils = require('./utils');
var MovingObject = require('./moving_object');
var SmallOrb = require('./small_orb');
var Orb = require('./orb');
var Enemy = require('./enemy');

var Game = function () {
  this.DIM_X = 800;
  this.DIM_Y = 800;
  this.orb = new Orb (this);
  this.smallOrbs = [];
  this.newOrbs = [];
  this.enemies = [];
  this.makeEnemies();
  this.makeOrbs(this);
};


Game.prototype.draw = function(ctx){
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.moveObjects = function () {
  this.movingObjects().forEach(function(object) {
    object.move();
  });
};

Game.prototype.makeOrbs = function (game) {
  var that = this;
  that.newOrbs = [];
  var orbNumber = (this.orb.orbTime / 10).toFixed();
  for (var i = 0; i < orbNumber; i++) {
    that.newOrbs.push(new SmallOrb(game));
  }

  this.smallOrbs = that.newOrbs.concat(this.smallOrbs);
};

Game.prototype.makeEnemies = function () {
  var that = this;
  setInterval(function () {
    that.enemies.push(new Enemy());
  }, 1500);
};

Game.prototype.toggleMoving = function (mousePosX, mousePosY, ctx, orbClicked){
  // debugger
  this.smallOrbs.forEach(function (orb) {
    // if (orbClicked === true){
    //   orb.clicked = false;
    // } else
    if (orb.includesPos(mousePosX, mousePosY, ctx)) {
      orb.clicked = true;
    }
  });
};

Game.prototype.attemptMove = function (mousePosX, mousePosY) {
  this.smallOrbs.forEach(function (orb) {
    if(orb.clicked){
      orb.mouseMove(mousePosX, mousePosY);
    }
  });
};

Game.prototype.initMove = function () {
  this.newOrbs.forEach(function(orb) {
    orb.move();
  });

};

Game.prototype.step = function () {
  this.moveObjects();
};

Game.prototype.allObjects = function () {
  return this.smallOrbs.concat(this.orb).concat(this.enemies);
};

Game.prototype.movingObjects = function () {
  return this.smallOrbs.concat(this.enemies);
};

Game.prototype.remove = function () {
  this.allObjects.forEach(function (object) {
    if (object.life <= 0){
      if (object instanceof Orb) {
        throw "Game Over";
      } else if (object instanceof SmallOrb){
        this.smallOrbs.splice(this.smallOrbs.indexOf(object), 1);
      } else if (object instanceof Enemy) {
        this.enemies.splice(this.enemies.indexOf(object), 1);
      }
    }
  });
};




module.exports = Game;
