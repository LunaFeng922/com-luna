function setup() {
  noCursor();
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  ticket = loadImage("ticket.png");
}

function draw() {
  background(255, 240, 160, 60);

  push();
  imageMode(CENTER);
  translate(width / 2, height / 2);
  let scaleFactor = 1 + 0.02 * sin(frameCount * 0.05);
  let imgW = (windowWidth / 2) * scaleFactor;
  let imgH = (windowHeight / 3) * scaleFactor;
  image(ticket, 0, 0, imgW, imgH);
  rotate(-PI / 8);
  translate(0, -height / 10);
  image(ticket, 0, 0, imgW, imgH);
  pop();

  push();
  textFont("Doto");
  stroke(0,80 + 50 * sin(frameCount * 0.05));
  fill(0, 80 + 50 * sin(frameCount * 0.05));
  strokeWeight(5);
  textSize(windowWidth / 30);
  textAlign(CENTER, CENTER);
  text("Scan the ticket to enter!", windowWidth / 2, windowHeight - 200);
  pop();

  push();
  strokeWeight(8);
  stroke(150, 0, 0, 80 + 50 * sin(frameCount * 0.05));
  fill(255, 0, 0, 80 + 50 * sin(frameCount * 0.05));
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
  if (mouseX > width/3 && mouseX < width*2/3 && mouseY > height/3 && mouseY < height*2/3) {
      let newWindow = window.open('http://lunafeng922.github.io/com-luna/main/index.html');
      window.close();
  }
}