
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

hunt.ducks = [];

hunt.gun;

hunt.mainHandlerInterval = 1000;
hunt.timeSinceMainHandler;

hunt.timeToNewDuckCreated = 0;
hunt.duckCreationInterval = 5000;

hunt.canvas;
hunt.context;

// ---------------------------------------------
// Duck "class"
// ---------------------------------------------

function Duck(size, speed, scoresWhenShot) {
	this.size = size;
	this.speed = speed;
	this.scores = scoresWhenShot;

	this.x = hunt.canvas.width - 82;
	this.y = Math.random() * 200;
	this.deltaY = (this.y - Math.random() * 200) / (hunt.canvas.width / speed);
	if (this.deltaY < 0) this.deltaY = 0;

	this.hit = false;

	this.minX = -40;

	this.lastChanged = new Date().getTime();
	this.imageIndex = 0;

	this.images = [];

	// push images to the array
	this.images.push(hunt.createImage("images/duck1.png", 80, 91));
	this.images.push(hunt.createImage("images/duck2.png", 80, 91));
	this.images.push(hunt.createImage("images/duck3.png", 80, 91));

	this.drawDuck = function (context) {

		if(this.hit) return;

		// Rotate duck picture in order to make it look like flying.
		var now = new Date().getTime();
		if ((now - this.lastChanged) > 400) {
			this.imageIndex++;
			if (this.imageIndex >= this.images.length) {
				this.imageIndex = 0;
			}

			this.lastChanged = new Date().getTime();
		}

		// Calculate new coordinates.
		this.x = this.x - speed;
		this.y = this.y - this.deltaY;

		// Calculate image size.
		var xSize = this.getSize()[0];
		var ySize = this.getSize()[1];

		// Paint the duck.
		if (this.x >= this.minX) {
			context.drawImage(this.images[this.imageIndex], 0, 0,
				this.images[this.imageIndex].width, this.images[this.imageIndex].height, this.x, this.y, xSize, ySize);
		}
	}

	this.outsideCanvas = function () {
		return this.x < this.minX;
	}

	this.getSize = function() {
		var xSize = this.size;
		var ySize = 91 / 80 * xSize;		
		return [xSize, ySize];
	}

	this.isHitByShot = function(gunX, gunY, gunSize) {
		var duckCenterX = this.x + this.getSize()[0]/2;
		var duckCenterY = this.y + this.getSize()[1]/2;

		if(gunX > (duckCenterX - gunSize) && gunX < (duckCenterX + gunSize)) 
		{
			if(gunY > (duckCenterY - gunSize) && gunY < (duckCenterY + gunSize)) {
				this.hit = true;
			 	return true;
			}
		}
		
	}

}

// ---------------------------------------------
// Gun "class"
// ---------------------------------------------

function Gun() {
	this.size = 20; // Gun shot size

	this.x = hunt.canvas.width / 2;
	this.y = hunt.canvas.height / 2;

	this.gunShotAudio = new Audio("sounds/gunshot.mp3");

	this.move = function (x, y) {
		this.x = x;
		this.y = y;
	}

	this.drawSight = function (context) {
		// Paint circle
		context.beginPath();
		context.strokeStyle="#808080";		
		context.arc(this.x, this.y, 30, 0, 2 * Math.PI);
		context.stroke();

		context.beginPath();
		context.strokeStyle="#CCFF33";						
		context.moveTo(this.x - 16, this.y);
		context.lineTo(this.x - 4, this.y);
		context.stroke();		
		context.moveTo(this.x + 16, this.y);
		context.lineTo(this.x + 4, this.y);
		context.stroke();				

		context.beginPath();
		context.moveTo(this.x, this.y - 16);
		context.lineTo(this.x, this.y - 4);
		context.stroke();	
		context.beginPath();			
		context.moveTo(this.x, this.y + 16);
		context.lineTo(this.x, this.y + 4);
		context.stroke();				

	}

	this.fire = function (ducks) {

		// Audio must be reloaded after playing, else old sound will block new from playing.
		this.gunShotAudio.play();
		this.gunShotAudio = new Audio("sounds/gunshot.mp3");

		// See if shot hit some duck.
		for(var i = 0; i < ducks.length; i++) {
			if(ducks[i].isHitByShot(this.x, this.y, this.size)) {
				console.log("HIT!!");
			}
		}

		return false;
	}

}


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
}

hunt.startbuttonclickevent = function () {

	var arr = document.getElementsByClassName("startbutton");
	arr[0].style.display = 'none';

	var cnvas = document.getElementById("hunt-canvas");
	cnvas.style.cursor = "none";

	hunt.running = true;
}

hunt.mouseClickEvent = function (evt) {
	var mousePos = hunt.getMousePos(hunt.canvas, evt);
	var message = 'Click: ' + mousePos.x + ',' + mousePos.y;

	hunt.gun.fire(hunt.ducks);

}

hunt.mouseMoveEvent = function (evt) {
	var mousePos = hunt.getMousePos(hunt.canvas, evt);
	var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;

	hunt.gun.move(mousePos.x, mousePos.y);
}

/* Main() - call this function to start animation. */
hunt.main = function main() {

	hunt.canvas = document.getElementById('hunt-canvas');
	hunt.context = hunt.canvas.getContext('2d');

	hunt.gun = new Gun();

	hunt.canvas.addEventListener('mousemove', hunt.mouseMoveEvent, false);
	hunt.canvas.addEventListener('click', hunt.mouseClickEvent, false);

	// Avoid that double clicking selects the element.
	hunt.canvas.addEventListener('mousedown', function(e){ e.preventDefault(); }, false);

	/* Resize the canvas to fill browser window dynamically. */
	window.addEventListener('resize', resizeCanvas, false);

	function resizeCanvas() {
		// Make it visually fill the positioned parent
		hunt.canvas.style.width = '100%';
		//  		canvas.style.height='100%';
		// ...then set the internal size to match
		hunt.canvas.width = hunt.canvas.offsetWidth;
		hunt.canvas.height = hunt.canvas.offsetHeight;

	}

	resizeCanvas();

	hunt.timeSinceMainHandler = new Date().getTime()

	var arr = document.getElementsByClassName("startbutton");
	arr[0].addEventListener('click', hunt.startbuttonclickevent, false);
}

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
	hunt.gun.drawSight(hunt.context);

}

hunt.mainHandler = function () {
	if ((new Date().getTime() - hunt.timeSinceMainHandler) > hunt.mainHandlerInterval) {
		hunt.timeSinceMainHandler = new Date().getTime();

		// Create the ducks.
		if (new Date().getTime() > hunt.timeToNewDuckCreated) {

			var size = 80;
			var speed = 5;
			var scores = 100;

			switch (Math.round(Math.random() * 7)) {
				case 2:
					size = 20;
					speed = 1;
					scores = 100;
					break;
				case 3:
					size = 60;
					speed = 2;
					scores = 80;
					break;
				case 4:
					size = 80;
					speed = 4.5;
					scores = 100;
					break;
				case 5:
					size = 80;
					speed = 5;
					scores = 120;
					break;
				case 6:
					size = 120;
					speed = 10;
					scores = 500;
					break;
			}

			hunt.ducks.push(new Duck(size, speed, scores));


			hunt.timeToNewDuckCreated = new Date().getTime() + Math.random() * hunt.duckCreationInterval;

		}

		// Remove objects outside of canvas so memory can be released.
		for (var i = hunt.ducks.length - 1; i >= 0; i--) {

			if (hunt.ducks[i].outsideCanvas()) {
				hunt.ducks.splice(i, 1);
			}
		}

		console.log("Number of ducks: " + hunt.ducks.length);

	}



}


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
}

requestAnimationFrame(hunt.draw);

