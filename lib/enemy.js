var Utils = require('./utils');
var MovingObject = require('./moving_object');

var Enemy = function () {
  this.color = "black";
  this.radius = 15;
  this.pos = Utils.randomPos();
  this.vel = this.findVec();

  this.life = 100;
};

Utils.inherits(Enemy, MovingObject);

Enemy.prototype.findVec = function () {

  var x = 400 - this.pos[0];
  var y = 400 - this.pos[1];

  var frac = x/y;

  if (x < 0 && y < 0) {
    x = -(frac);
    y = -1;
  } else if (y < 0){
    x = -(frac);
    y = -1;
  } else {
    x = frac;
    y = 1;
  }

  if (frac > 5 && x > 0){
    x = 5;
  } else if (frac < -5 && x < 0){
    x = -5;
  }

  return [x, y];
};

Enemy.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
};


module.exports = Enemy;
