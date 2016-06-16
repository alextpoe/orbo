var GameView = require('./game_view');

var canvas = document.getElementById('canvas');

var ctx = canvas.getContext('2d');

var orbo = new GameView(canvas, ctx);

orbo.start();
