var OrbBars = function (orb) {
  this.orb = orb;
};

OrbBars.prototype.getTime = function () {
  return this.orb.orbTime * 4;
};

OrbBars.prototype.drawOrbBar = function (ctx) {
  ctx.beginPath();
  ctx.fillStyle = "red";
  // debugger
  ctx.fillRect(240, 690, this.getTime(), 50);
};

OrbBars.prototype.getLife = function () {
  return this.orb.life * 0.32;
};

OrbBars.prototype.drawLifeBar = function (ctx) {
  ctx.beginPath();
  ctx.fillStyle = "blue";
  // debugger
  ctx.fillRect(240, 750, this.getLife(), 50);
};

module.exports = OrbBars;
