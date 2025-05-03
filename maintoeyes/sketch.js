let clickCounter = 0;
let requiredClicks = 8;

function setup() {
  noCursor();
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  im1 = loadImage("1.jpg");
  im2 = loadImage("2.jpg");
  im3 = loadImage("3.jpg");
  im4 = loadImage("4.jpg");
  im5 = loadImage("5.jpg");
  im6 = loadImage("6.jpg");
  im7 = loadImage("7.jpg");
}

function draw() {
  background(0);

  push();
  tint(255, 127 + 127 * sin(frameCount * 0.05));
  if (clickCounter > 0) {
    image(im1, width / 9, height / 3.6, width / 9, width / 9);
  }
  if (clickCounter > 1) {
    image(im2, (width * 2) / 9, height / 3.6, width / 9, width / 9);
  }
  if (clickCounter > 2) {
    image(im3, (width * 3) / 9, height / 3.6, width / 9, width / 9);
  }
  if (clickCounter > 3) {
    image(im4, (width * 4) / 9, height / 3.6, width / 9, width / 9);
  }
  if (clickCounter > 4) {
    image(im5, (width * 5) / 9, height / 3.6, width / 9, width / 9);
  }
  if (clickCounter > 5) {
    image(im6, (width * 6) / 9, height / 3.6, width / 9, width / 9);
  }
  if (clickCounter > 6) {
    image(im7, (width * 7) / 9, height / 3.6, width / 9, width / 9);
  }
  pop();

  push();
  textFont("Doto");
  stroke(255, 80 + 50 * sin(frameCount * 0.05));
  fill(255, 80 + 50 * sin(frameCount * 0.05));
  strokeWeight(5);
  textSize(windowWidth / 30);
  textAlign(CENTER, CENTER);
  text(
    "Waiting to enter the observation deck...",
    windowWidth / 2,
    windowHeight - 400
  );
  text("Click To Accelerate", windowWidth / 2, windowHeight - 300);
  pop();

  push();
  strokeWeight(9);
  stroke(255, 90);
  fill(255, 50 * sin(frameCount * 0.05));
  ellipse(mouseX, mouseY, windowWidth / 10);
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
      "http://lunafeng922.github.io/com-luna/eyes/index.html"
    );
    window.close();
  }
}
