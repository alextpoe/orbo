var Enemy = function (game) {
  this.COLOR = "brown";
  this.radius = 15;
  this.game = game;
  this.vel = findVec();
  this.pos = Utils.randomPos();

  this.life = 200;
};


Enemy.prototype.findVec = function () {

};

Enemy.prototype.makePos = function () {

};
