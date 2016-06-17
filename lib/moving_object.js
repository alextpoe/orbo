var Utils = require('./utils');

var MovingObject = function (params) {
  this.pos = params.pos;
  this.vel = params.vel;
  this.radius = params.radius;
  this.color = params.color;
  this.game = params.game;
};

MovingObject.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
};

MovingObject.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
};


MovingObject.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Utils.dist(this.pos, otherObject.pos);
  return centerDist < (this.radius + otherObject.radius);
};


module.exports = MovingObject;
