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
// Duck "class"
// ---------------------------------------------

function Duck(hunt, size, speed, scoresWhenShot) {
    this.hunt = hunt;
    this.size = size;
    this.speed = speed;
    this.scores = scoresWhenShot;

    this.x = this.hunt.canvas.width - 82;
    this.y = Math.random() * 200;
    this.deltaY = (this.y - Math.random() * 200) / (this.hunt.canvas.width / speed);
    if (this.deltaY < 0) {
        this.deltaY = 0;
    }

    this.hit = false;
    this.readyToRemove = false;
    this.minX = -46;

    this.lastChanged = new Date().getTime();
    this.imageIndex = 0;

    this.images = [];

    // push images to the array
    this.images.push(this.hunt.createImage("images/duck1.png", 80, 91));
    this.images.push(this.hunt.createImage("images/duck2.png", 80, 91));
    this.images.push(this.hunt.createImage("images/duck3.png", 80, 91));

    this.drawDuck = function (context) {

        if (!this.hit) {

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
        else {
            var now = new Date().getTime();
            if ((now - this.lastChanged) < 500) {
                // Paint scores.
                var yCenter = this.y + this.getSize()[1]/2;

                context.fillStyle = "white"; 
                context.font="20px Verdana";
                context.fillText(this.scores, this.x, yCenter);
            }
            else {
                this.readyToRemove = true;
            }
        }
    };

    this.canBeRemoved = function () {
        if(this.readyToRemove) {
            return true;
        }
        else return this.x < this.minX; // Outside canvas.
    };

    this.outsideCanvas = function () {
         return this.x < this.minX; // Outside canvas.
    };

    this.getSize = function () {
        var xSize = this.size;
        var ySize = 91 / 80 * xSize;
        return [xSize, ySize];
    };

    this.isHitByShot = function (gunX, gunY, gunSize) {
        var duckCenterX = this.x + this.getSize()[0] / 2;
        var duckCenterY = this.y + this.getSize()[1] / 2;

        if (gunX > (duckCenterX - gunSize) && gunX < (duckCenterX + gunSize)) {
            if (gunY > (duckCenterY - gunSize) && gunY < (duckCenterY + gunSize)) {
                this.hit = true;
                this.lastChanged = new Date().getTime();                
                return true;
            }
        }

    };
}
