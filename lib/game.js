var Utils = require('./utils');
var MovingObject = require('./moving_object');
var SmallOrb = require('./small_orb');
var Orb = require('./orb');
var OrbTimeBar = require('./orb_time_bar');
var Enemy = require('./enemy');

var Game = function () {
  this.DIM_X = 800;
  this.DIM_Y = 800;
  this.orb = new Orb (this);
  this.orbTimeBar = new OrbTimeBar(this.orb);
  this.smallOrbs = [];
  this.newOrbs = [];
  this.enemies = [];
  this.makeEnemies();
  this.orbTimeRefill();
};


Game.prototype.draw = function(ctx){
  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.orbTimeBar.draw(ctx);
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
  // debugger
  var orbNumber = (this.orb.orbTime / 10).toFixed();
  for (var i = 0; i < orbNumber; i++) {
    that.newOrbs.push(new SmallOrb(game));
  }

  this.orb.orbTime = 0;
  this.smallOrbs = that.newOrbs.concat(this.smallOrbs);
  // debugger
};

Game.prototype.makeEnemies = function () {
  var that = this;
  setInterval(function () {
    that.enemies.push(new Enemy());
  }, 1500);
};

Game.prototype.toggleMoving = function (mousePosX, mousePosY, ctx, orbClicked){
  this.smallOrbs.forEach(function (orb) {
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
  this.checkCollisions();
};

Game.prototype.allObjects = function () {

  return this.smallOrbs.concat(this.orb).concat(this.enemies);
};

Game.prototype.movingObjects = function () {
  return this.smallOrbs.concat(this.enemies);
};

Game.prototype.checkCollisions = function () {
  var that = this;
  var allObjects = this.allObjects();
  for (i = 0; i < allObjects.length; i++) {
    for (j = i + 1; j < allObjects.length; j++) {
      var obj1 = allObjects[i];
      var obj2 = allObjects[j];

      if (obj1.isCollidedWith(obj2) &&
          !(obj1 instanceof Enemy && obj2 instanceof Enemy) &&
          (obj1 instanceof Enemy || obj2 instanceof Enemy)) {

        // debugger
        var obj1Life = obj1.life;
        var obj2Life = obj2.life;

        obj1.life -= obj2Life;
        obj2.life -= obj1Life;
      }
    }
  }
  this.remove();
};

Game.prototype.reduceLife = function (obj1, obj2) {
  var obj1Life = obj1.life;
  var obj2Life = obj2.life;

  obj1.life -= obj2Life;
  obj2.life -= obj1Life;

  this.remove();
};

Game.prototype.remove = function () {
  var that = this;
  // debugger
  this.allObjects().forEach(function (object) {
    if (object.life <= 0){
      if (object instanceof Orb) {
        throw "Game Over";
      } else if (object instanceof SmallOrb){
        that.smallOrbs.splice(that.smallOrbs.indexOf(object), 1);
      } else if (object instanceof Enemy) {
        that.enemies.splice(that.enemies.indexOf(object), 1);
      }
    }
  });
};

Game.prototype.orbTimeRefill = function () {
  var that = this;
  setInterval(function () {

    if (that.orb.orbTime < 80){
      that.orb.orbTime += 0.5;
    }
  }, 150);
};



module.exports = Game;
