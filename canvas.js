"use strict";
var frameCount = 0;
var HEARTRATE = 30;
var FRAMERATE = 60;
var FREQUENCY = 4;
var SPEED = 3;
var FLATLINETIME = 60; //seconds
var BEEPFREQUENCY = 650;

var alive = true;


window.onerror = function(msg, url, linenumber) {
  alert(
    "Error message: " + msg + "\nURL: " + url + "\nLine Number: " + linenumber
  );
  return true;
};


//sound

var a=new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em

function beep(vol, freq, duration){
  var v=a.createOscillator()
  var u=a.createGain()
  v.connect(u)
  v.frequency.value=freq
  v.type="sine"
  u.connect(a.destination)
  u.gain.value=vol*0.01
  v.start(a.currentTime)
  v.stop(a.currentTime+duration*0.001)
}

//flatline

function flatLine() {
    alive = false;
    setTimeout(function(){beep(10,BEEPFREQUENCY,FLATLINETIME * 1000)},2000)
}

// Initial Setup
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

var mouseDown;

// Event Listeners
addEventListener("click", function(event) {
    flatLine();
});

document.onkeypress = function (e) {
    flatLine();
};

//prevent left click
document.addEventListener(
  "contextmenu",
  function(e) {
    e.preventDefault();
  },
  false
);

addEventListener("resize", function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function distance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

var points;

function newPoint() {
    points.push({x: innerWidth + (FRAMERATE * SPEED), y: (innerHeight / 2 + Math.random() * 10 - 5)})
}

function init() {
  points = [];

  newPoint();
  
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;

  // if enough time has elapsed, draw the next frame

    //alert( elapsed + " " + fpsInterval);

    if (elapsed > fpsInterval || points[0].x > innerWidth) {
        
        //alert( elapsed + " drawn " + fpsInterval);
        //game loop
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#00ff00';

        ctx.clearRect(0,0,canvas.width,canvas.height)

        for (var i = 0; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
            points[i].x = points[i].x - SPEED;
        }

        ctx.stroke();

        if ((frameCount % FRAMERATE) % FREQUENCY == 0) {newPoint();}
        

        if (alive == true && frameCount % (FRAMERATE * 60 / HEARTRATE) == 0 && points[points.length-10] != undefined) {
            // drawn from right to left
            var offsets = [-10,10,-30,20,30,-(innerHeight/2),-(innerHeight/2/2),(innerHeight/2/2),(innerHeight/2),(innerHeight/2/3)]
            for (var i = 10; i > 0; i--) {
                points[points.length-i].y -= offsets[i];
            }
            
            setTimeout(function(){beep(10,BEEPFREQUENCY,100)},((1000/FRAMERATE) * 20))
        }

        if (points[5] != undefined && points[5].x < 0) {points.shift()}

        frameCount++;

        then = now - (elapsed % fpsInterval);


    }
}

init();
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    console.log(startTime);
    animate();
}

startAnimating(FRAMERATE);
