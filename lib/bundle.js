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
	var modal = document.getElementsByClassName('modal-background');
	var modalWindow = document.getElementsByClassName('modal-window');
	var gameOverModal = document.getElementsByClassName('modal-background-game-over');
	var gameOverModalWindow = document.getElementsByClassName('modal-window-game-over');
	var ctx = canvas.getContext('2d');
	var orbo = new GameView(canvas, ctx, gameOverModal[0], gameOverModalWindow[0]);
	
	
	modal[0].addEventListener('click',
	  function () {
	    modal[0].classList.add("disappear");
	    orbo.start();
	  }, false);
	
	gameOverModal[0].addEventListener('click',
	  function () {
	    gameOverModal[0].classList.toggle("disappear");
	    var orbo = new GameView(canvas, ctx, gameOverModal[0], gameOverModalWindow[0]);
	    orbo.start();
	  }, false);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	
	var GameView = function (canvas, ctx, gameOverModal, gameOverModalWindow) {
	  this.canvas = canvas;
	  this.game = new Game(canvas, gameOverModal, gameOverModalWindow);
	  this.ctx = ctx;
	  this.moving = false;
	  this.gameOverModal = gameOverModal;
	  this.gameOverModalWindow = gameOverModalWindow;
	};
	
	GameView.prototype.start = function (canvas) {
	  var that = this;
	  this.canvas.addEventListener("mousedown", this.clickOrb.bind(this), false);
	  this.canvas.addEventListener("mousemove", this.moveOrb.bind(this), false);
	  this.canvas.addEventListener("mouseup", this.unClickOrb.bind(this), false);
	
	  this.lastTime = 0;
	
	  var aniFramVal1 = requestAnimationFrame(this.animate.bind(this));
	
	
	
	  if (this.game.gameOver()){
	    cancelAnimationFrame(aniFramVal1);
	    this.game.removeDisappear();
	  }
	};
	
	
	GameView.prototype.spaceDown = function (e){
	  var game = this.game;
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
	
	  if (this.game.orb.includesPos(mousePos[0], mousePos[1])) {
	    this.game.makeOrbs(this.game);
	  } else {
	    this.game.toggleMoving(mousePos[0], mousePos[1], this.ctx);
	    this.moving = true;
	  }
	};
	
	GameView.prototype.moveOrb = function (e) {
	  var that = this;
	  var mousePos = this.getMouse(e);
	  if (this.moving) {
	      this.game.attemptMove(mousePos[0], mousePos[1]);
	  }
	};
	
	GameView.prototype.unClickOrb = function (e) {
	  var mousePos = this.getMouse(e);
	  if (this.moving) {
	    this.game.smallOrbs.forEach(function (orb) {
	
	      if (orb.clicked) {
	        orb.clicked = false;
	        orb.setVel(orb.moves);
	      }
	    });
	  }
	  this.moving = false;
	};
	
	GameView.prototype.animate = function (time){
	  var timeDelta = time - this.lastTime;
	
	  this.game.step(timeDelta);
	  this.game.draw(this.canvas, this.ctx, this.aniFramVal);
	  this.lastTime = time;
	
	
	  var aniFramVal = requestAnimationFrame(this.animate.bind(this));
	
	
	  if (this.game.gameOver()){
	    cancelAnimationFrame(aniFramVal);
	    this.game.removeDisappear();
	  }
	};
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var SmallOrb = __webpack_require__(5);
	var Orb = __webpack_require__(6);
	var OrbBars = __webpack_require__(7);
	var Enemy = __webpack_require__(8);
	
	var Game = function (gameOverModal, gameOverModalWindow) {
	  this.DIM_X = 800;
	  this.DIM_Y = 800;
	  this.img = new Image ();
	  this.img.src = './assets/Blue_gradient.gif';
	  this.orb = new Orb (this);
	  this.orbBars = new OrbBars(this.orb);
	  this.smallOrbs = [];
	  this.newOrbs = [];
	  this.enemies = [];
	  this.moves = [];
	  this.score = 0;
	  this.makeEnemies();
	  this.orbTimeRefill();
	  this.gameOverModal = gameOverModal;
	  this.gameOverModalWindow = gameOverModalWindow;
	};
	
	
	Game.prototype.draw = function(canvas, ctx, aniFramVal){
	  var that = this;
	    ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
	    ctx.drawImage(this.img, 0, 0, this.DIM_X, this.DIM_Y);
	
	    this.orbBars.drawOrbBar(ctx);
	    this.orbBars.drawLifeBar(ctx);
	    this.drawScore(ctx);
	    this.allObjects().forEach(function (object) {
	      object.draw(ctx);
	    });
	};
	
	Game.prototype.removeDisappear = function () {
	  this.gameOverModalWindow.classList.remove('disappear');
	  this.gameOverModal.classList.remove('disappear');
	};
	
	Game.prototype.drawScore = function (ctx) {
	  ctx.font = "48px serif";
	  ctx.fillText(this.score, 10, 50);
	} ;
	
	Game.prototype.moveObjects = function () {
	  this.movingObjects().forEach(function(object) {
	    object.move();
	  });
	};
	
	Game.prototype.makeOrbs = function (game) {
	  var that = this;
	  that.newOrbs = [];
	  var orbNumber = (this.orb.orbTime / 10).toFixed();
	  for (var i = 0; i < orbNumber; i++) {
	    that.newOrbs.push(new SmallOrb(game));
	  }
	
	  this.orb.orbTime = 0;
	  this.smallOrbs = that.newOrbs.concat(this.smallOrbs);
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
	
	        var obj1Life = obj1.life;
	        var obj2Life = obj2.life;
	
	        obj1.life -= obj2Life;
	        obj2.life -= obj1Life;
	
	        if ((obj1 instanceof SmallOrb && obj2 instanceof Enemy) ||
	        (obj2 instanceof SmallOrb && obj1 instanceof Enemy)) {
	          that.score += 100;
	        }
	      }
	
	    }
	  }
	  this.remove();
	};
	
	
	Game.prototype.remove = function () {
	  var that = this;
	
	  this.allObjects().forEach(function (object) {
	    if (object.life <= 0){
	      if (object instanceof Orb) {
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
	
	Game.prototype.gameOver = function () {
	  return this.orb.life <= 0;
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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(3);
	
	var Orb = function (game) {
	  this.pos = [400, 400];
	  this.radius = 40;
	  this.color = "#02928";
	  this.game = game;
	  this.life = 1000;
	  this.orbTime = 80;
	};
	
	Orb.prototype.includesPos = function (mousePosX, mousePosY, ctx) {
	  var dx = mousePosX - this.pos[0];
	  var dy = mousePosY - this.pos[1];
	  if (Math.sqrt((dx * dx) + (dy * dy)) < this.radius){
	    return true;
	  } else {
	    return false;
	  }
	};
	
	Orb.prototype.draw = function(ctx){
	  ctx.beginPath();
	  ctx.arc(this.pos[0], this.pos[1], this.radius, 0, Math.PI * 2);
	  ctx.shadowBlur = 15;
	  ctx.shadowColor = "rgb(0, 0, 0)";
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


/***/ },
/* 8 */
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map