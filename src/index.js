let bricks = [];
let rows = []
let redColor = 0;
let greenColor = 220;
let blueColor = 220;
let color = `rgb(${redColor}, ${greenColor}, ${blueColor})`
document.addEventListener("DOMContentLoaded", runner);

function runner(){
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  //paddle info
  let paddle = new Paddle(10, 75, color);
  //user controllers
  let rightPressed = false;
  let leftPressed = false;
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  //brick constructor: (x, y, width, height, padding, offsetTop, offsetLeft, status, color)
  let startingAmountOfBricks = 60;
  for(let i = 0; i < startingAmountOfBricks; i++){
    new Brick(0, 0, 33, 10, 10, 30, 30, 1, color);
    setColor();
  }
  //create game grid and add bricks
  let gridRowCount = canvas.height / (Brick.all[0].height + Brick.all[0].padding );//+ Brick.all[0].offsetTop
  let gridColumnCount = 10;
  let brickIndex = 0;

  for(let rowNumber = 0; rowNumber < (gridRowCount - 1); rowNumber++){
    rows[rowNumber] = []
    for(let columnNumber = 0; columnNumber < (gridColumnCount - 1); columnNumber++){
      if(brickIndex < (Brick.all.length - 1)){
        rows[rowNumber][columnNumber] = Brick.all[brickIndex];
        brickIndex++;
      }
      else{
        rows[rowNumber][columnNumber] = {};
      }
    }
  }

  console.log(rows);

  let brickSpeed = 1000;
  let bricksCanMove = true;


  //score variable
  let scoreBoard = new Scoreboard(0, 3);

  draw();

  function setColor(){
    if(greenColor > 0 && blueColor === 220){
      greenColor -= 5;
    }
    else if(blueColor === 220 && redColor < 220){
      redColor += 5;
    }
    else if(blueColor > 0 && redColor === 220){
      blueColor -= 5;
    }
    else if(redColor === 220 && greenColor < 220){
      greenColor += 5;
    }
    else if(redColor > 0 && greenColor === 220){
      redColor -= 5;
    }
    else if(greenColor === 220 && blueColor < 220){
      blueColor += 5;
    }
    color = `rgb(${redColor}, ${greenColor}, ${blueColor})`
  }

  function drawBricks() {
    //moves bricks
    if(bricksCanMove){
      let objToMove = {};
      for(let rowNumber = 0; rowNumber < (gridRowCount - 2); rowNumber++){
        if(rowNumber === 0){
          rows[rowNumber].unshift(new Brick(0, 0, 33, 10, 10, 30, 30, 1, color));
          setColor();
          objToMove = rows[rowNumber].pop();
        }
        else if(rowNumber === gridRowCount-3){
          if(rowNumber % 2 === 0){
            rows[rowNumber].unshift(objToMove);
            objToMove = rows[rowNumber].pop();
            if(objToMove instanceof Brick && objToMove.status === 1){
              alert("Game Over");
              document.location.reload();
            }
          }
          else{
            rows[rowNumber].push(objToMove);
            objToMove = rows[rowNumber].shift();
            if(objToMove instanceof Brick  && objToMove.status === 1){
              alert("Game Over");
              document.location.reload();
            }
          }
        }
        else if(rowNumber % 2 === 0){
          rows[rowNumber].unshift(objToMove);
          objToMove = rows[rowNumber].pop();
        }
        else{
          rows[rowNumber].push(objToMove);
          objToMove = rows[rowNumber].shift();
        }
      }
      bricksCanMove = false;

      setTimeout(()=> bricksCanMove = true, brickSpeed);

    }
    //draw bricks
    for(let rowNumber = 0; rowNumber < gridRowCount-1; rowNumber++) {
      for(let columnNumber = 0; columnNumber < gridColumnCount - 1; columnNumber++) {
        if(rows[rowNumber][columnNumber] instanceof Brick){
          if(rows[rowNumber][columnNumber].status === 1) {
            rows[rowNumber][columnNumber].updateX(columnNumber);
            rows[rowNumber][columnNumber].updateY(rowNumber);
            rows[rowNumber][columnNumber].draw(ctx);
          }
        }
      }
    }
  }


  //collision detection
  function collisionDetection() {

    Brick.all.forEach(brick => {
      if(brick.status === 1){
        Shot.all.forEach(shot =>{
          if(shot.x > brick.x && shot.x < brick.x+brick.width && shot.y > brick.y && shot.y < brick.y+brick.height) {
            shot.destroy();
            brick.status = 0;
            scoreBoard.score++;
            if(brickSpeed > 150){
              brickSpeed -= 10;
            }
            // else if(brickSpeed > 50){
            //   brickSpeed -= 1;
            // }
            else{
              brickSpeed = 150;
            }
          }
        })
      }
    })
    bricksLeft = Brick.all.reduce((acc, brick) => acc + brick.status, 0);
    console.log(bricksLeft)
    if(bricksLeft === 0) {
      alert("YOU WIN, CONGRATULATIONS!");
      document.location.reload();
    }

    }

  //frame draw
  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();

    // ball.draw(ctx);
    paddle.draw(ctx);
    Shot.all.forEach(shot => shot.draw(ctx));
    // shot.draw(ctx);
    scoreBoard.draw(ctx);
    collisionDetection();

    //Check that shot is within the canvas and move it
    Shot.all.forEach(shot => {
      if(shot.checkXBoundry()){};
      if(shot.checkYBoundry()){};
      shot.y -= shot.dy;
    });

    //check paddle within canvas, and check for user input
    if(rightPressed && paddle.x < canvas.width - paddle.width) {
      paddle.x += 7;
    }
    else if(leftPressed && paddle.x > 0) {
      paddle.x -= 7;
    }

    requestAnimationFrame(draw);
  }

  //event handlers
  function keyDownHandler(event){
    if(event.key === "Right" || event.key === "ArrowRight"){
      rightPressed = true;
    }
    else if(event.key === "left" || event.key === "ArrowLeft"){
      leftPressed = true;
    }
    else if(event.keyCode === 32 || event.key === "Space"){
      paddle.shoot();
    }
  }

  function keyUpHandler(event){
    if(event.key === "Right" || event.key === "ArrowRight"){
      rightPressed = false;
    }
    else if(event.key === "left" || event.key === "ArrowLeft"){
      leftPressed = false;
    }
  }

  function mouseMoveHandler(event){
    // let relativeX = event.clientX - canvas.offsetLeft;
    // if(relativeX > 0 && relativeX < canvas.width){
    //   paddle.x = relativeX - paddle.width / 2;
    // }
  }
}
