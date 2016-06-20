var Utils = require('./utils.js');
var MovingObject = require('./moving_object');

var SmallOrb = function (game) {
  this.color = "#FF0066";
  this.radius = 10;
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
    //
    // this.pos[0] = mousePosX;
    // this.pos[1] = mousePosY;
};

SmallOrb.prototype.setVel = function (moves) {
  var that = this;
  if (moves.length < 1) {
    this.vel = [0, 0];
  } else {

    var maxLoops = moves.length - 1;
    var counter = 0;

    (function next() {
        if (counter++ > maxLoops) return;

        setTimeout(function() {
            that.pos[0] = moves[counter][0];
            that.pos[1] = moves[counter][1];
            next();
        }, 15);
    })();

    // moves.forEach(function (move, index) {
    //   setTimeout(function () {
    //       that.pos[0] = (move[0] + this.pos[0]) / 2.5;
    //       that.pos[1] = (move[1] + this.pos[1]) / 2.5;
    //   }, 15 * (index + 1));
    //
    //   setTimeout(function () {
    //     // debugger
    //     that.pos[0] = (move[0] + this.pos[0]) / 2;
    //     that.pos[1] = (move[1] + this.pos[1]) / 2;
    //   }, 15 * (index + 1));
    //
    //   setTimeout(function () {
    //     // debugger
    //     that.pos[0] = (move[0] + this.pos[0]) / 1.75;
    //     that.pos[1] = (move[1] + this.pos[1]) / 1.75;
    //   }, 15 * (index + 1));
    //
    //   setTimeout(function () {
    //     // debugger
    //     that.pos[0] = (move[0] + this.pos[0]) / 1.25;
    //     that.pos[1] = (move[1] + this.pos[1]) / 1.25;
    //   }, 15 * (index + 1));
    //
    //   setTimeout(function () {
    //     // debugger
        // that.pos[0] = move[0];
        // that.pos[1] = move[1];
    //   }, 15 * (index + 1));

    // });

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
