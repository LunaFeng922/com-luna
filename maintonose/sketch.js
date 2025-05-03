let clickCounter = 0;
let requiredClicks = 4;

function setup() {
  noCursor();
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  body1 = loadImage("body1.png");
  body2 = loadImage("body2.png");
}

function draw() {
  background(255, 240, 160);

  push();
  tint(255, 127 + 127 * sin(frameCount * 0.05));
  imageMode(CENTER);
  image(body1, width * 0.2, height / 3, width / 7, height / 4);
  image(body2, width * 0.8, height / 3, width / 7, height / 4);
  pop();

  push();
  strokeWeight(8);
  stroke(150, 0, 0, 50 + 50 * sin(frameCount * 0.05));
  fill(255, 0, 0, 50 + 50 * sin(frameCount * 0.05));
  if (clickCounter > 0) {
    ellipse(width * 0.3, height / 3, 50);
    ellipse(width * 0.7, height / 3, 50);
  }
  if (clickCounter > 1) {
    ellipse(width * 0.4, height / 3, 50);
    ellipse(width * 0.6, height / 3, 50);
  }
  if (clickCounter > 2) {
    ellipse(width * 0.5, height / 3, 50);
  }
  pop();

  push();
  textFont("Doto");
  stroke(0, 80 + 50 * sin(frameCount * 0.05));
  fill(0, 80 + 50 * sin(frameCount * 0.05));
  strokeWeight(5);
  textSize(windowWidth / 30);
  textAlign(CENTER, CENTER);
  text(
    "Queing for the Breath Training ...",
    windowWidth / 2,
    windowHeight - 400
  );
  text("Click To Accelerate", windowWidth / 2, windowHeight - 300);
  pop();

  push();
  strokeWeight(8);
  stroke(200, 0, 0);
  fill(255, 165, 0);
  triangle(
    mouseX,
    mouseY - 60 * (1 + 0.5 * clickCounter),
    mouseX - 30 * (1 + 0.5 * clickCounter),
    mouseY,
    mouseX + 30 * (1 + 0.5 * clickCounter),
    mouseY
  );
  pop();
}

function keyPressed() {
  if (key === " ") {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  clickCounter++;
  console.log("Clicks:", clickCounter);

  if (clickCounter >= requiredClicks) {
    let newWindow = window.open(
      "http://lunafeng922.github.io/com-luna/nose/index.html"
    );
    window.close();
  }
}
