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
// Shells "class"
// ---------------------------------------------

function Shells(hunt) {
    this.hunt = hunt;
	this.height = 132;     
    this.y = hunt.canvas.height - this.height;
    this.imageIndex = 0;
	this.images = [];
    this.loadStarted = new Date().getTime();

	this.reLoadAudioStart = new Audio("sounds/click1.mp3");
	this.reLoadAudioEnd = new Audio("sounds/click2.mp3");    

    // push images to the array
    this.images.push(this.hunt.createImage("images/shells1.png", 100, 208)); // Loaded with two shoots.
    this.images.push(this.hunt.createImage("images/shells2.png", 100, 208)); // Loaded with one shoot.
    this.images.push(this.hunt.createImage("images/shells3.png", 100, 208)); // Empty.
    this.images.push(this.hunt.createImage("images/shells4.png", 100, 208)); // Loading, one shot in pipes.
    this.images.push(this.hunt.createImage("images/shells5.png", 100, 208)); // Loading, two shots in pipes.   

    this.useShell = function () {
        if(this.imageIndex === 0) {
            this.imageIndex = 1;
            return true;
        }
        else if(this.imageIndex === 1) {
            this.imageIndex = 2;            
            return true;            
        }
        else if(this.imageIndex === 2) { 
            return false;
        }        
        else if(this.imageIndex > 2) {
		    console.log("Logic error in game!");            
            return false;
        }
    };

    this.reLoad = function () {
		this.reLoadAudioStart.play();

        this.loadStarted = new Date().getTime();

        if(this.imageIndex === 1) {
            this.imageIndex = 3;            
        }        
        else if(this.imageIndex === 2) {
            this.imageIndex = 4;
        }
    };

    this.isLoaded = function () {
        return this.imageIndex === 0 || this.imageIndex === 1;
    };

    this.process = function () {
        if(this.imageIndex === 3 || this.imageIndex === 4) {
            var now = new Date().getTime();
            if ((now - this.loadStarted) > 1300) {
		        this.reLoadAudioEnd.play();                
                this.imageIndex = 0;
            }
        }
    };

    this.insideArea = function(x, y) {
        if(x > this.hunt.canvas.width / 2 - this.images[this.imageIndex].width / 4 
            && x < this.hunt.canvas.width / 2 + this.images[this.imageIndex].width / 2) 
        {
            if(y > hunt.canvas.height - this.height && y < hunt.canvas.height) {
                return true;
            }
        }
        return false;
    };

	this.drawShells = function (context) {

        var xSize = 62.5;
        var ySize = 130;

        var xCoord = this.hunt.canvas.width / 2 - this.images[this.imageIndex].width / 4;

        context.drawImage(this.images[this.imageIndex], 0, 0,
            this.images[this.imageIndex].width, this.images[this.imageIndex].height, xCoord, this.y, xSize, ySize);
	};

}