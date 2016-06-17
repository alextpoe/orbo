var OrbTimeBar = function (orb) {
  this.orb = orb;
  this.color = "red";
};

OrbTimeBar.prototype.getTime = function () {
  return this.orb.orbTime * 4;
};

OrbTimeBar.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  // debugger
  ctx.fillRect(240, 750, this.getTime(), 50);
};

module.exports = OrbTimeBar;
