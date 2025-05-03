let clickCounter = 0;
let requiredClicks = 12;
let n=0;

function setup() {
  noCursor();
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  dj = loadImage("dj.png");
}

function draw() {
  background(0);
  
  n=0.05*clickCounter;

  push();
  imageMode(CENTER);
  translate(width/2,height/3);
  rotate(frameCount*n);
  image(dj,0,0,width/6.5,width/6.5);
  pop();

  push();
  textFont("Doto");
  stroke(255, 80 + 50 * sin(frameCount * 0.05));
  fill(255, 80 + 50 * sin(frameCount * 0.05));
  strokeWeight(5);
  textSize(windowWidth / 30);
  textAlign(CENTER, CENTER);
  text(
    "Almost there... approaching the DJ Mixer...",
    windowWidth / 2,
    windowHeight - 400
  );
  text("Click To Accelerate", windowWidth / 2, windowHeight - 300);
  text("FM 92.2", mouseX, mouseY);
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
