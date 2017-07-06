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
// Lives "class"
// ---------------------------------------------

function Lives(hunt) {
    this.hunt = hunt;
    this.count = 3;
	this.height = 20;     
    this.x = 8;
    this.y = hunt.canvas.height - this.height - 54;
	this.image = this.hunt.createImage("images/sittingduck.png", 60, 56);

    this.removeLife = function () {
        this.count--;                
        if(this.count < 1) {
            return false;
        } 
        else {
            return true;
        }
    }

	this.drawLives = function (context) {
		for(var i = 0; i < this.count; i++) {
 			context.drawImage(this.image, this.x + 40*i, this.y, 33, 31);			
		}
	};

}