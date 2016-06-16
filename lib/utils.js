
var inherits = function(childClass, superClass){
  var Surrogate = function(){};
  Surrogate.prototype = superClass.prototype;
  childClass.prototype = new Surrogate();
  childClass.prototype.constructor = childClass;
};

function randomVec(len) {
  var x = Math.random()*len;
  x *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

  var y = Math.sqrt(len * len - x * x);
  y *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

  return [x, y];
}

function randomPos() {
  var x;
  var y;

  if (Math.random() * 100 < 25){
    x = 800;
    y = Math.random() * 800;
  } else if (Math.random() * 100 >= 25 && Math.random() *100 < 50){
    x = Math.random() * 800;
    y = 800;
  } else if (Math.random() * 100 >= 50 && Math.random() *100 < 75){
    x = 0;
    y = Math.random() * 800;
  } else if (Math.random() * 100 >= 75 && Math.random() *100 < 100){
    x = Math.random() * 800;
    y = 0;
  }

  return [x, y];
}

module.exports = {
  inherits: inherits,
  randomVec: randomVec,
  randomPos: randomPos
};
