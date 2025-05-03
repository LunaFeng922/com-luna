let clickCounter = 0;
let requiredClicks = 8;

function setup() {
  noCursor();
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  dj = loadImage("dj.png");
}

function draw() {
  background(0);
  imageMode(CENTER);

  push();
  strokeWeight(9);
  stroke(255);
  fill(255,50);
  ellipse(width * 0.4, height * 0.3, width / 16);
  ellipse(width * 0.6, height * 0.3, width / 16);
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
      "http://lunafeng922.github.io/com-luna/mouth/index.html"
    );
    window.close();
  }
}
