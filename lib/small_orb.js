var Utils = require('./utils.js');
var MovingObject = require('./moving_object');

var SmallOrb = function (game) {
  this.color = "#FFEC8B";
  this.radius = 10;
  this.game = game;
  this.vel = Utils.randomVec(5);
  this.pos = [400, 400];
  this.clicked = false;
  this.life = 100;

  var that = this;

  window.setTimeout( function() { that.vel = [0, 0]; }, 500);
};

Utils.inherits(SmallOrb, MovingObject);

// SmallOrb.prototype.draw = function(ctx){
//   ctx.beginPath();
//   ctx.arc(this.pos[0], this.pos[1], this.RADIUS, 0, Math.PI * 2);
//   ctx.fillStyle = this.COLOR;
//   ctx.fill();
// };

SmallOrb.prototype.power = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

SmallOrb.prototype.includesPos = function (mousePosX, mousePosY, ctx) {
  var dx = mousePosX - this.pos[0];
  var dy = mousePosY - this.pos[1];

  if (Math.sqrt((dx * dx) + (dy * dy)) < this.radius){
    return true;
  } else {
    return false;
  }
};

SmallOrb.prototype.mouseMove = function (mousePosX, mousePosY) {
  if (this.clicked) {
    this.pos[0] = mousePosX;
    this.pos[1] = mousePosY;
  }
};

 


module.exports = SmallOrb;
