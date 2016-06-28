var Utils = require('./utils.js');
var MovingObject = require('./moving_object');

var SmallOrb = function (game) {
  this.color = "#C843D3";
  this.radius = 20;
  this.game = game;
  this.vel = Utils.randomVec(5);
  this.pos = [400, 400];
  this.clicked = false;
  this.life = 200;
  this.moves = [];
  var that = this;

  window.setTimeout( function() { that.vel = [0, 0]; }, 500);
};

Utils.inherits(SmallOrb, MovingObject);

SmallOrb.prototype.draw = function (ctx) {
  if (this.clicked) {
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#D3434E";
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

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
    this.moves.push([mousePosX, mousePosY]);
};

SmallOrb.prototype.setVel = function (moves) {
  var that = this;
  if (moves.length < 1) {
    this.vel = [0, 0];
  } else {

    var maxLoops = moves.length - 1;
    var counter = 0;

    (function delayedMove() {
        if (counter++ >= maxLoops) return;

        setTimeout(function() {
            that.pos[0] = moves[counter][0];
            that.pos[1] = moves[counter][1];
            delayedMove();
        }, 15);
    })();

    var last = moves.length - 1;
    var lastPos = moves[last];
    var secondLastPos = moves[last - 1];

    var velx = (lastPos[0] - secondLastPos[0]);
    var vely = (lastPos[1] - secondLastPos[1]);
    this.vel = [velx, vely];
    this.moves = [];
  }
};
 


module.exports = SmallOrb;
