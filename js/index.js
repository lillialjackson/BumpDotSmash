//  var
var canvas;
var canvasContext;
var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

var mouseX = 0;
var mouseY = 0;

const brickWidth = 80;
const brickHeight = 20;
const brickGap = 2;
const brickCols = 10;
const brickRows = 14;


var brickGrid = new Array(brickCols * brickRows);
var bricksLeft = 0;


const paddleWidth = 100;
const paddleThickness = 10;
const paddleDistFromEdge = 50;
var paddleX = 400;

// mouse position
function updateMousePos (evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY -rect.top - root.scrollTop;
  paddleX = mouseX - paddleWidth/2;

}
//
// function handleMouseClick(evt) {
//   if(showingWinScreen) {
//     playerLeftScore = 0;
//     playerRightScore = 0;
//     showingWinScreen = false;
//   }
//

// randomly sets bricks true or false

// function brickReset() {
//   for (var i = 0; i < brickCols * brickRows; i++) {
//     if( Math.random() < 0.5){
//       brickGrid[i] = true;
//     } else {
//       brickGrid[i] = false;
//     }
//   }
// }

function brickReset() {
  bricksLeft = 0;
  var i;
  for (i = 0; i < 3 * brickCols; i++) {
    brickGrid[i] = false;
  }
  for (; i < brickCols * brickRows; i++) {
      brickGrid[i] = true;
      bricksLeft ++;
  }
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(updateAll, 1000/framesPerSecond);

 function updateAll() {
   moveEverything();
   drawEverything();
 }
  // canvas.addEventListener('click', handleMouseClick);
  //
  canvas.addEventListener('mousemove', updateMousePos);

  brickReset();
  ballReset();

}



// reset ball after score

function ballReset() {
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

// ball movement
function ballMove() {
  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;


  if(ballX < 0 && ballSpeedX < 0.0) { //left
    ballSpeedX *= -1;
  }
  if(ballX > canvas.width && ballSpeedX > 0.0) { //right
    ballSpeedX *= -1;
  }
  if(ballY < 0 && ballSpeedY < 0.0) { //top
    ballSpeedY *= -1;
  }
  if(ballY > canvas.height) { //bottom
    ballReset();
    brickReset();

  }

}

// Row COl check
function isBrickAtColRow(col, row) {
      if( col >= 0 && col < brickCols &&
          row >= 0 && row < brickRows){

      var brickIndexUndexCoord = rowColToArrayIndex(col, row);
      return brickGrid[brickIndexUndexCoord];
    } else {
      return false;
    }
}


// Brick Handling

function ballBrickHandling() {
  // ball coordinates
  var ballBrickCol = Math.floor(ballX / brickWidth);
  var ballBrickRow = Math.floor(ballY / brickHeight);
  var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
   if(ballBrickCol >= 0 && ballBrickCol < brickCols &&
     ballBrickRow >= 0 && ballBrickRow < brickRows) {
       if(isBrickAtColRow( ballBrickCol, ballBrickRow) ) {
       brickGrid[brickIndexUnderBall] = false;
       bricksLeft --;

       var prevBallX = ballX - ballSpeedX;
       var prevBallY = ballY - ballSpeedY;
       var prevBrickCol = Math.floor(prevBallX / brickWidth);
       var prevBrickRow = Math.floor(prevBallY / brickHeight);

       var bothTestsFailed = true;

       if (prevBrickCol != ballBrickCol ){ // edge case side
         if(isBrickAtColRow (prevBrickCol, ballBrickRow) == false) {
           ballSpeedX *= -1
           bothTestsFailed = false;
         }
       }
       if (prevBrickRow != ballBrickRow){ // edge case top bottom
         if(isBrickAtColRow (ballBrickCol, prevBrickRow) == false) {
         ballSpeedY *= -1;
         bothTestsFailed = false;
           }
         }
         if(bothTestsFailed) { //armpit case
           ballSpeedX *= -1;
           ballSpeedY *= -1;
         }

      }
     }
   }

// Paddle Handling

function ballPaddleHandling() {
  var paddleTopEdgeY = canvas.height - paddleDistFromEdge;
  var paddleBottomEdgeY = paddleTopEdgeY + paddleThickness;
  var paddleLeftEdgeX = paddleX;
  var paddleRightEdgeX = paddleLeftEdgeX + paddleWidth;
  if ( ballY > paddleTopEdgeY && //below top
       ballY < paddleBottomEdgeY && // above bottom
       ballX > paddleLeftEdgeX && // right of left
       ballX < paddleRightEdgeX) { //left of right
         ballSpeedY *= -1;

         var centerOfPaddleX = paddleX + paddleWidth/2;
         var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
         ballSpeedX = ballDistFromPaddleCenterX * 0.35;

         if(bricksLeft == 0) {
           brickReset();
         }
       }
     }

//  move paddles
function moveEverything() {
  ballMove();
  ballBrickHandling();
  ballPaddleHandling();
}

function rowColToArrayIndex(col,row) {
  return col + brickCols * row;
}

function drawBricks () {
  for (var eachRow = 0; eachRow < brickRows; eachRow++) {
    for( var eachCol = 0; eachCol < brickCols; eachCol++) {

        var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

        if(brickGrid[arrayIndex]){
        colorRect(brickWidth * eachCol, brickHeight * eachRow, brickWidth - brickGap, brickHeight - brickGap, 'blue');
        }
      }
    }
}

function drawEverything() {
  // background
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  // paddle
  colorRect(paddleX, canvas.height - paddleDistFromEdge, paddleWidth, paddleThickness, 'white');

  // ball
  colorCircle(ballX, ballY, 10, 'green');

  drawBricks();



}
// draw paddle, table
function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);

}
// draw ball
function colorCircle (centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

// text
function colorText (showWords, textX, textY, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);


}
