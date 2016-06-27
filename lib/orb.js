var Utils = require('./utils');

var Orb = function (game) {
  this.pos = [400, 400];
  this.radius = 60;
  this.color = "#692176";
  this.game = game;
  this.life = 1000;
  this.orbTime = 80;
};

Orb.prototype.includesPos = function (mousePosX, mousePosY, ctx) {
  var dx = mousePosX - this.pos[0];
  var dy = mousePosY - this.pos[1];
  if (Math.sqrt((dx * dx) + (dy * dy)) < this.radius){
    return true;
  } else {
    return false;
  }
};

Orb.prototype.draw = function(ctx){
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
  ctx.shadowBlur = 15;
  ctx.shadowColor = "rgb(0, 0, 0)";
  ctx.fillStyle = this.color;
  ctx.fill();
};


Orb.prototype.isCollidedWith = function (otherObject) {
  var centerDist = Utils.dist(this.pos, otherObject.pos);
  return centerDist < (this.radius + otherObject.radius);
};

module.exports = Orb;
