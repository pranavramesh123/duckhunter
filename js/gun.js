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

// ---------------------------------------------
// Gun "class"
// ---------------------------------------------

function Gun(hunt) {
	this.size = 20; // Gun shot size
    this.hunt = hunt;

	this.x = hunt.canvas.width / 2;
	this.y = hunt.canvas.height / 2;

	this.gunShotAudio = new Audio("sounds/gunshot.mp3");

	this.move = function (x, y) {
		this.x = x;
		this.y = y;
	};

	this.drawSight = function (context) {
		// Paint circle
		context.beginPath();
		context.strokeStyle = "#808080";
		context.arc(this.x, this.y, 30, 0, 2 * Math.PI);
		context.stroke();

		context.beginPath();
		context.strokeStyle = "#CCFF33";
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

	};

	this.fire = function (ducks) {
		var hitByShot = false;

		// Audio must be reloaded after playing, else old sound will block new from playing.
		this.gunShotAudio.play();
		this.gunShotAudio = new Audio("sounds/gunshot.mp3");

		// See if shot hit some duck.
		for (var i = 0; i < ducks.length; i++) {
			if (ducks[i].isHitByShot(this.x, this.y, this.size)) {
				hitByShot = true;
			}
		}

		return hitByShot;
	};

}