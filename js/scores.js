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
// Scores "class"
// ---------------------------------------------

function Scores(hunt) {
    this.hunt = hunt;
    this.scores = 0;
	this.height = 12;     
    this.x = 0;
    this.y = hunt.canvas.height - this.height;

	this.drawScores = function (context) {
        context.fillStyle="white";
        context.font="20px Verdana";
        context.fillText("SCORES: " + this.scores, this.x + 8, this.y);        
	};

}
