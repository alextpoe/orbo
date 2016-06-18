var GameView = require('./game_view');

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
    modalWindow[0].classList.add("disappear");

    orbo.start();
  }, false);

modalWindow[0].addEventListener('click',
  function () {
    modalWindow[0].classList.add("disappear");
    modal[0].classList.add("disappear");

    orbo.start();
  }, false);

gameOverModal[0].addEventListener('click',
  function () {
    // var gameOverModal = document.getElementsByClassName('modal-background-game-over');
    // var gameOverModalWindow = document.getElementsByClassName('modal-window-game-over');
    gameOverModal[0].classList.toggle("disappear");
    var orbo = new GameView(canvas, ctx, gameOverModal[0], gameOverModalWindow[0]);
    orbo.start();
  }, false);


gameOverModalWindow[0].addEventListener('click',
    function () {
      // var gameOverModal = document.getElementsByClassName('modal-background-game-over');
      // var gameOverModalWindow = document.getElementsByClassName('modal-window-game-over');
      gameOverModal[0].classList.toggle("disappear");
      var orbo = new GameView(canvas, ctx, gameOverModal[0], gameOverModalWindow[0]);
      orbo.start();
    }, false);
