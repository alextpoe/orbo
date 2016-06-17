/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var GameView = __webpack_require__(1);
	
	var canvas = document.getElementById('canvas');
	
	var ctx = canvas.getContext('2d');
	
	var orbo = new GameView(canvas, ctx);
	
	orbo.start();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	// var CanvasState = require('./canvas_state');
	var GameView = function (canvas, ctx) {
	  this.canvas = canvas;
	  this.game = new Game();
	  this.ctx = ctx;
	  this.moving = false;
	};
	
	
	GameView.prototype.start = function (canvas) {
	  this.canvas.addEventListener("mousedown", this.clickOrb.bind(this), false);
	  this.canvas.addEventListener("mousemove", this.moveOrb.bind(this), false);
	  this.canvas.addEventListener("mouseup", this.unClickOrb.bind(this), false);
	  window.addEventListener("keydown", this.spaceDown.bind(this), false);
	
	  this.lastTime = 0;
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	
	GameView.prototype.spaceDown = function (e){
	  var game = this.game;
	  // debugger
	  if (e.code === "Space"){
	    this.game.makeOrbs(game);
	  }
	};
	
	GameView.prototype.getMouse = function (e) {
	  var canvasRect = this.canvas.getBoundingClientRect();
	  mouseX = (e.clientX - canvasRect.left);
	  mouseY = (e.clientY - canvasRect.top);
	
	  return [mouseX, mouseY];
	};
	
	GameView.prototype.clickOrb = function (e) {
	  var mousePos = this.getMouse(e);
	  this.game.toggleMoving(mousePos[0], mousePos[1], this.ctx);
	  this.moving = true;
	};
	
	GameView.prototype.moveOrb = function (e) {
	  var mousePos = this.getMouse(e);
	  if (this.moving) {
	    this.game.attemptMove(mousePos[0], mousePos[1]);
	  }
	};
	
	GameView.prototype.unClickOrb = function (e) {
	  // debugger
	  var mousePos = this.getMouse(e);
	  if (this.moving) {
	    this.game.smallOrbs.forEach(function (orb) {
	
	      if (orb.clicked) {
	        orb.setVel(orb.moves);
	
	        orb.clicked = false;
	      }
	    });
	  }
	  this.moving = false;
	  // this.game.toggleMoving(mousePos[0], mousePos[1]);
	};
	
	GameView.prototype.animate = function (time){
	  var timeDelta = time - this.lastTime;
	  // this.smallOrbs.forEach(function (orb) {
	  //   orb.move();
	  // });
	  this.game.step(timeDelta);
	  this.game.draw(this.ctx);
	  this.lastTime = time;
	
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var SmallOrb = __webpack_require__(5);
	var Orb = __webpack_require__(6);
	var OrbBars = __webpack_require__(8);
	var Enemy = __webpack_require__(7);
	
	var Game = function () {
	  this.DIM_X = 800;
	  this.DIM_Y = 800;
	  this.orb = new Orb (this);
	  this.orbBars = new OrbBars(this.orb);
	  this.smallOrbs = [];
	  this.newOrbs = [];
	  this.enemies = [];
	  this.moves = [];
	  this.makeEnemies();
	  this.orbTimeRefill();
	};
	
	
	Game.prototype.draw = function(ctx){
	  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	  this.orbBars.drawOrbBar(ctx);
	  this.orbBars.drawLifeBar(ctx);
	  this.allObjects().forEach(function (object) {
	    object.draw(ctx);
	  });
	};
	
	Game.prototype.moveObjects = function () {
	  this.movingObjects().forEach(function(object) {
	    object.move();
	  });
	};
	
	Game.prototype.makeOrbs = function (game) {
	  var that = this;
	  that.newOrbs = [];
	  // debugger
	  var orbNumber = (this.orb.orbTime / 10).toFixed();
	  for (var i = 0; i < orbNumber; i++) {
	    that.newOrbs.push(new SmallOrb(game));
	  }
	
	  this.orb.orbTime = 0;
	  this.smallOrbs = that.newOrbs.concat(this.smallOrbs);
	  // debugger
	};
	
	Game.prototype.makeEnemies = function () {
	  var that = this;
	  setInterval(function () {
	    that.enemies.push(new Enemy());
	  }, 1500);
	};
	
	Game.prototype.toggleMoving = function (mousePosX, mousePosY, ctx, orbClicked){
	  this.smallOrbs.forEach(function (orb) {
	    if (orb.includesPos(mousePosX, mousePosY, ctx)) {
	      orb.clicked = true;
	    }
	  });
	};
	
	Game.prototype.attemptMove = function (mousePosX, mousePosY) {
	  this.smallOrbs.forEach(function (orb) {
	    if(orb.clicked){
	      orb.mouseMove(mousePosX, mousePosY);
	    }
	  });
	};
	
	Game.prototype.initMove = function () {
	  this.newOrbs.forEach(function(orb) {
	    orb.move();
	  });
	
	};
	
	Game.prototype.step = function () {
	  this.moveObjects();
	  this.checkCollisions();
	};
	
	Game.prototype.allObjects = function () {
	
	  return this.smallOrbs.concat(this.orb).concat(this.enemies);
	};
	
	Game.prototype.movingObjects = function () {
	  return this.smallOrbs.concat(this.enemies);
	};
	
	Game.prototype.checkCollisions = function () {
	  var that = this;
	  var allObjects = this.allObjects();
	  for (i = 0; i < allObjects.length; i++) {
	    for (j = i + 1; j < allObjects.length; j++) {
	      var obj1 = allObjects[i];
	      var obj2 = allObjects[j];
	
	      if (obj1.isCollidedWith(obj2) &&
	          !(obj1 instanceof Enemy && obj2 instanceof Enemy) &&
	          (obj1 instanceof Enemy || obj2 instanceof Enemy)) {
	
	        // debugger
	        var obj1Life = obj1.life;
	        var obj2Life = obj2.life;
	
	        obj1.life -= obj2Life;
	        obj2.life -= obj1Life;
	      }
	    }
	  }
	  this.remove();
	};
	
	Game.prototype.reduceLife = function (obj1, obj2) {
	  var obj1Life = obj1.life;
	  var obj2Life = obj2.life;
	
	  obj1.life -= obj2Life;
	  obj2.life -= obj1Life;
	
	  this.remove();
	};
	
	Game.prototype.remove = function () {
	  var that = this;
	  // debugger
	  this.allObjects().forEach(function (object) {
	    if (object.life <= 0){
	      if (object instanceof Orb) {
	        throw "Game Over";
	      } else if (object instanceof SmallOrb){
	        that.smallOrbs.splice(that.smallOrbs.indexOf(object), 1);
	      } else if (object instanceof Enemy) {
	        that.enemies.splice(that.enemies.indexOf(object), 1);
	      }
	    }
	  });
	};
	
	Game.prototype.orbTimeRefill = function () {
	  var that = this;
	  setInterval(function () {
	
	    if (that.orb.orbTime < 80){
	      that.orb.orbTime += 0.5;
	    }
	  }, 150);
	};
	
	
	
	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports) {

	
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
	
	function dist (pos1, pos2) {
	  return Math.sqrt(
	    Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	  );
	}
	
	module.exports = {
	  inherits: inherits,
	  randomVec: randomVec,
	  randomPos: randomPos,
	  dist: dist
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(3);
	
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	
	var SmallOrb = function (game) {
	  this.color = "#FFEC8B";
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
	
	    this.moves.push([mousePosX, mousePosY]);
	
	    this.pos[0] = mousePosX;
	    this.pos[1] = mousePosY;
	};
	
	SmallOrb.prototype.setVel = function (moves) {
	  var last = moves.length - 1;
	  var lastPos = moves[last];
	  var secondLastPos = moves[last - 1];
	
	  var velx = (lastPos[0] - secondLastPos[0])/4;
	  var vely = (lastPos[1] - secondLastPos[1])/4;
	
	  this.vel = [velx, vely];
	};
	 
	
	
	module.exports = SmallOrb;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(3);
	
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
	
	
	Orb.prototype.isCollidedWith = function (otherObject) {
	  var centerDist = Utils.dist(this.pos, otherObject.pos);
	  return centerDist < (this.radius + otherObject.radius);
	};
	
	module.exports = Orb;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	
	var Enemy = function () {
	  this.color = "black";
	  this.radius = 15;
	  this.pos = Utils.randomPos();
	  this.vel = this.findVec();
	
	  this.life = 100;
	};
	
	Utils.inherits(Enemy, MovingObject);
	
	Enemy.prototype.findVec = function () {
	
	  var x = 400 - this.pos[0];
	  var y = 400 - this.pos[1];
	
	  var frac = x/y;
	
	  if (x < 0 && y < 0) {
	    x = -(frac);
	    y = -1;
	  } else if (y < 0){
	    x = -(frac);
	    y = -1;
	  } else {
	    x = frac;
	    y = 1;
	  }
	
	  return [x, y];
	};
	
	Enemy.prototype.draw = function (ctx) {
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
	  ctx.fillStyle = this.color;
	  ctx.fill();
	};
	
	
	module.exports = Enemy;


/***/ },
/* 8 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map