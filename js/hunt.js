/*jslint
    this
*/

/* Duck hunter v.1.0
 *
 * Copyright (c): Mikael Sundfors
 * Date: 1.7.2017
 *
 * The purpose of this application was mainly to learn a few new things on JavaScript.
 * Take in account this is just an exercise. There may be things that have a more
 * efficient or better implementations.
*/

"use strict";

/* namespace: if object ll exists, use it, otherwise create new empty object */
var hunt = hunt || {};

hunt.fps = 30; 				/* Animation update - frames per second */

hunt.running = false;
hunt.gameOver = false;

hunt.ducks = [];

hunt.gun;

hunt.scores;

hunt.lives;

hunt.mainHandlerInterval = 1000;
hunt.timeSinceMainHandler;

hunt.timeToNewDuckCreated = 0;
hunt.duckCreationInterval = 5000;

hunt.canvas;
hunt.context;

hunt.audioLoop = new Audio("sounds/music.mp3");

// ---------------------------------------------
// Base functionality
// ---------------------------------------------

// Image factory
hunt.createImage = function (src, w, h) {
	var img = new Image();
	img.src = src;
	img.width = w;
	img.height = h;
	return img;
};

hunt.getMousePos = function (canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};

hunt.startbuttonclickevent = function () {

	var elmt = document.getElementById("startbutton");
	elmt.style.display = "none";

	var elmt1 = document.getElementById("gameover");
	elmt1.style.display = "none";

	hunt.canvas.style.cursor = "none";

	if(hunt.gameOver) {
		hunt.gun = new Gun(hunt);
		hunt.shells	= new Shells(hunt);
		hunt.scores = new Scores(hunt)
		hunt.lives = new Lives(hunt);		
		hunt.gameOver = false;
	}

	hunt.running = true;
};

hunt.mouseClickEvent = function (evt) {
	if (hunt.running && !hunt.gameOver) {
		var mousePos = hunt.getMousePos(hunt.canvas, evt);

		if(hunt.shells.insideArea(mousePos.x, mousePos.y)) {
			// User is pointing on the shells.
			hunt.shells.reLoad();
		}
		else {
			if(hunt.shells.useShell()) {
				hunt.scores.addScores(hunt.gun.fire(hunt.ducks));
			}
		}
	}
};

hunt.mouseMoveEvent = function (evt) {
	if (hunt.running) {	
		var mousePos = hunt.getMousePos(hunt.canvas, evt);
		if(hunt.shells.insideArea(mousePos.x, mousePos.y)) {
			// User is pointing on the shells.
			hunt.canvas.style.cursor = "pointer";
		}
		else {
			// Move gun
			hunt.canvas.style.cursor = "none";		
			hunt.gun.move(mousePos.x, mousePos.y);
		}
	}

	if(hunt.gameOver) {
		hunt.canvas.style.cursor = "pointer";
	}
};

hunt.endGame = function () {
	hunt.gameOver = true;

	hunt.ducks.length = 0; // Remove all ducks.

	hunt.canvas.style.cursor = "pointer";	
};

/* Main() - call this function to start animation. */
hunt.main = function () {

	hunt.canvas = document.getElementById("hunt-canvas");
	hunt.context = hunt.canvas.getContext("2d");

	hunt.gun = new Gun(hunt);

	hunt.shells	= new Shells(hunt);

	hunt.scores = new Scores(hunt);

	hunt.lives = new Lives(hunt);

	hunt.canvas.addEventListener("mousemove", hunt.mouseMoveEvent, false);
	hunt.canvas.addEventListener("click", hunt.mouseClickEvent, false);

	// Avoid that double clicking selects the element.
	hunt.canvas.addEventListener("mousedown", function (e) { e.preventDefault(); }, false);

	/* Resize the canvas to fill browser window dynamically. */
	window.addEventListener("resize", resizeCanvas, false);

	function resizeCanvas() {
		// Make it visually fill the positioned parent
		hunt.canvas.style.width = "100%";
		hunt.canvas.style.height= "500px";
		// ...then set the internal size to match
		hunt.canvas.width = hunt.canvas.offsetWidth;
		hunt.canvas.height = hunt.canvas.offsetHeight;

	}

	resizeCanvas();

	hunt.timeSinceMainHandler = new Date().getTime();

	var elmt = document.getElementById("startbutton");
	elmt.addEventListener("click", hunt.startbuttonclickevent, false);

	hunt.audioLoop.loop = true;
	hunt.audioLoop.play();
};

hunt.paintGame = function (ducks, canvas, context) {

	/* Clear area */
	context.clearRect(0, 0, hunt.canvas.width, hunt.canvas.height);

	// Draw ducks
	if (hunt.ducks != null) {
		for (var i = 0; i < hunt.ducks.length; i++) {
			hunt.ducks[i].drawDuck(context);
		}
	}

	// Draw sight
	if(!hunt.gameOver) {
		hunt.gun.drawSight(hunt.context);
	}

	hunt.shells.drawShells(hunt.context);

	// Draw scores
	hunt.scores.drawScores(hunt.context);

	// Draw lives left in game.
	hunt.lives.drawLives(hunt.context);
};

hunt.mainHandler = function () {
	if ((new Date().getTime() - hunt.timeSinceMainHandler) > hunt.mainHandlerInterval) {
		hunt.timeSinceMainHandler = new Date().getTime();

		if (!hunt.gameOver) {
			// Create the ducks.
			if (new Date().getTime() > hunt.timeToNewDuckCreated) {

				var size = 80;
				var speed = 5;
				var scores = 100;

				switch (Math.round(Math.random() * 7)) {
					case 1:
						size = 20;
						speed = 1.2;
						scores = 85;
						break;					
					case 2:
						size = 30;
						speed = 1.8;
						scores = 70;
						break;
					case 3:
						size = 50;
						speed = 2.5;
						scores = 80;
						break;
					case 4:
						size = 70;
						speed = 4.5;
						scores = 100;
						break;
					case 5:
						size = 90;
						speed = 5.5;
						scores = 120;
						break;
					case 6:
						size = 120;
						speed = 8;
						scores = 500;
						break;
				}

				hunt.ducks.push(new Duck(hunt, size, speed, scores));


				hunt.timeToNewDuckCreated = new Date().getTime() + Math.random() * hunt.duckCreationInterval;
			}
		}

		// Decrease lives if a duck reashed outside canvas.
		for (var j = 0; j < hunt.ducks.length; j++) {
			if (hunt.ducks[j].outsideCanvas()) {
				if (!hunt.lives.removeLife()) {
					// Game over.
					var elmt1 = document.getElementById("gameover");
					elmt1.style.display = "block";
					var elmt2 = document.getElementById("startbutton");					
					elmt2.style.display = "block";					
					hunt.endGame();
				}
			}
		}


		// Remove objects outside of canvas and finished objects so memory can be released.
		for (var i = hunt.ducks.length - 1; i >= 0; i--) {

			if (hunt.ducks[i].canBeRemoved()) {
				hunt.ducks.splice(i, 1);
			}
		}

		// Make sure state is processed in shells.
		hunt.shells.process();

		console.log("Number of ducks: " + hunt.ducks.length);

	}



};


/* Callback for requestAnimationFrame() */
hunt.draw = function () {
	setTimeout(function () {
		if (hunt.running) {
			hunt.mainHandler();

			hunt.paintGame(hunt.ducks, hunt.canvas, hunt.context);
		}

		//
		requestAnimationFrame(hunt.draw);
	}, 1000 / hunt.fps);
};

requestAnimationFrame(hunt.draw);

