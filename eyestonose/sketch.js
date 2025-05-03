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
  background(0);
  imageMode(CENTER);

  push();
  strokeWeight(9);
  stroke(255);
  fill(255, 50);
  ellipse(width * 0.4, height * 0.3, width / 16);
  ellipse(width * 0.6, height * 0.3, width / 16);
  pop();

  push();
  image(body1, width * 0.3, (height * 4) / 5, width / 8, width / 6.5);
  strokeWeight(8);
  stroke(200, 0, 0);
  fill(255, 165, 0);
  triangle(
    width / 2,
    height * 0.8 - 60,
    width / 2 - 30,
    height * 0.8,
    width / 2 + 30,
    height * 0.8
  );
  image(body2, width * 0.7, (height * 4) / 5, width / 8, width / 6.5);

  pop();

  push();
  textFont("Doto");
  stroke(255, 80 + 50 * sin(frameCount * 0.05));
  fill(255, 80 + 50 * sin(frameCount * 0.05));
  strokeWeight(5);
  textSize(windowWidth / 30);
  textAlign(CENTER, CENTER);
  text("Going Downhill...", windowWidth / 2, windowHeight / 2 - 100);
  let offset = (frameCount * 0.2 * (clickCounter + 1)) % 20;
  text("ᐯ ᐯ ᐯ", windowWidth / 2, windowHeight * 0.49 + offset);
  text("Click To Accelerate", windowWidth / 2, windowHeight / 2 + 100);
  text("ᐯ", mouseX, mouseY);
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
