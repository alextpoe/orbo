/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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
	  this.smallOrbs = this.game.smallOrbs;
	  this.moving = false;
	};


	GameView.prototype.start = function (canvas) {
	  this.canvas.addEventListener("mousedown", this.clickOrb.bind(this), false);
	  this.canvas.addEventListener("mousemove", this.moveOrb.bind(this), false);
	  this.canvas.addEventListener("mouseup", this.unClickOrb.bind(this), false);

	  this.lastTime = 0;

	  requestAnimationFrame(this.animate.bind(this));
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
	  var mousePos = this.getMouse(e);
	  if (this.moving) {
	    this.smallOrbs.forEach(function (orb) {
	      orb.clicked = false;
	    });
	  }
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

	var Game = function () {
	  this.DIM_X = 800;
	  this.DIM_Y = 800;
	  this.orb = new Orb (this);
	  this.smallOrbs = [];
	  this.newOrbs = [];
	  this.makeOrbs(this);
	};


	Game.prototype.draw = function(ctx){
	  ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	  this.allObjects().forEach(function (object) {
	    object.draw(ctx);
	  });
	};

	Game.prototype.moveObjects = function () {
	  this.allObjects().forEach(function(object) {
	    object.move();
	  });
	};

	Game.prototype.makeOrbs = function (game) {
	  var that = this;
	  that.newOrbs = [];
	  var orbNumber = (this.orb.orbLife / 10).toFixed();
	  for (var i = 0; i < orbNumber; i++) {
	    that.newOrbs.push(new SmallOrb(game));
	  }

	  this.smallOrbs = that.newOrbs.concat(this.smallOrbs);
	};

	Game.prototype.toggleMoving = function (mousePosX, mousePosY, ctx, orbClicked){
	  // debugger
	  this.smallOrbs.forEach(function (orb) {
	    // if (orbClicked === true){
	    //   orb.clicked = false;
	    // } else
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
	  var init = true;

	  if (init) {
	    this.newOrbs.forEach(function(orb) {
	      orb.move();
	    });
	    init = false;
	  }

	};

	Game.prototype.allObjects = function () {
	  return this.smallOrbs.concat(this.orb);
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

	module.exports = {
	  inherits: inherits,
	  randomVec: randomVec,
	  randomPos: randomPos
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

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
	  // var initX = this.pos[0];
	  // var initY = this.pos[1];
	  // while (this.pos[0] - initX < 10) {
	    this.pos[0] += this.vel[0];
	    this.pos[1] += this.vel[1];
	  // }
	};


	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);

	var SmallOrb = function (game) {
	  this.COLOR = "blue";
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


/***/ },
/* 6 */
/***/ function(module, exports) {

	var Orb = function (game) {
	  this.pos = [400, 400];
	  this.radius = 40;
	  this.color = "blue";
	  this.game = game;
	  this.orbLife = 80;
	};

	Orb.prototype.draw = function(ctx){
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
	  ctx.fillStyle = this.color;
	  ctx.fill();
	};

	module.exports = Orb;


/***/ }
/******/ ]);