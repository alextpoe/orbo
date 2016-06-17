var Orb = function (game) {
  this.pos = [400, 400];
  this.radius = 40;
  this.color = "#BBFFFF";
  this.game = game;
  this.life = 1000;
  this.orbTime = 80;
};

Orb.prototype.draw = function(ctx){
  ctx.beginPath();
  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
  ctx.fillStyle = this.color;
  ctx.fill();
};

module.exports = Orb;
