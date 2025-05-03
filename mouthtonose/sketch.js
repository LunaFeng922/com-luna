let clickCounter = 0;
let requiredClicks = 4;

function setup() {
  noCursor();
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  body1 = loadImage("body1.png");
  body2 = loadImage("body2.png");
  dj = loadImage("dj.png");
}

function draw() {
  background(0);
  imageMode(CENTER);

  push();
  image(body1, width * 0.3, height * 0.3, width / 8, width / 6.5);
  strokeWeight(8);
  stroke(200, 0, 0);
  fill(255, 165, 0);
  triangle(
    width / 2,
    height * 0.3 - 60,
    width / 2 - 30,
    height * 0.3,
    width / 2 + 30,
    height * 0.3
  );
  image(body2, width * 0.7, height * 0.3, width / 8, width / 6.5);
  pop();

  push();
  translate(width / 2, (height * 4) / 5);
  image(dj, 0, 0, width / 6.5, width / 6.5);
  pop();

  push();
  textFont("Doto");
  stroke(255, 80 + 50 * sin(frameCount * 0.05));
  fill(255, 80 + 50 * sin(frameCount * 0.05));
  strokeWeight(5);
  textSize(windowWidth / 30);
  textAlign(CENTER, CENTER);
  text("Going Uphill...", windowWidth / 2, windowHeight / 2 - 100);
  let offset = (frameCount * 0.2 * (clickCounter + 1)) % 20;
  text("ᐱ ᐱ ᐱ", windowWidth / 2, windowHeight * 0.51 - offset);
  text("Click To Accelerate", windowWidth / 2, windowHeight / 2 + 100);
  text("ᐱ", mouseX, mouseY);
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
