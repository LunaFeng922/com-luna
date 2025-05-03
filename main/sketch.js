//click to start!
//imagine there'sa face hidden in your keyboard~
//play with 5/8;6/7;f/j;b to see what happens ^-^;
//try pressing multiple keys at the same time!

let scaleRatio;

//images
let face;
let lip1;

//sounds
const toyKeyboard = new SimplePlayer("Sounds/Toy keyboard.MP3").toDestination();
const trian = new SimplePlayer("Sounds/Triangle.WAV").toDestination();
const spring1 = new SimplePlayer("Sounds/Spring1.wav").toDestination();
const drum1 = new SimplePlayer("Sounds/Drum1.wav").toDestination();
const bungo = new SimplePlayer("Sounds/Bungo.WAV").toDestination();

let loaded = false;

//toykeyboard/eyes
let analyzer1 = new Tone.Waveform(512);
toyKeyboard.connect(analyzer1);

//toykeyboard/nose
let meter1 = new Tone.Meter();
meter1.normalRange = true;
meter1.channels = 1;
toyKeyboard.connect(meter1);

//triangle/eyebrow
let analyzer2 = new Tone.FFT(256);
trian.connect(analyzer2);

//spring/wrinkle
let analyzer3 = new Tone.FFT(256);
spring1.connect(analyzer3);

//bungo/lips
let meter2 = new Tone.Meter();
meter2.normalRange = true;
meter2.channels = 1;
bungo.connect(meter2);

//drum/cheek
let analyzer4 = new Tone.FFT(256);
drum1.connect(analyzer4);

let meter3 = new Tone.Meter();
meter3.normalRange = true;
meter3.channels = 1;
drum1.connect(meter3);

function preload() {
  face = loadImage("Face.png");
  nose = loadImage("nose.png");
  lip1 = loadImage("lip.png");
  body1 = loadImage("Body_1.png");
  body2 = loadImage("Body_2.png");
  hand1 = loadImage("hand1.png");
  hand2 = loadImage("hand2.png");
  cd = loadImage("lunaCD.png");
}

function setup() {
  noCursor();
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (loaded) {
    background(0, 50, 0);
    scaleRatio = min(width / 800, height / 800);

    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(-400, -400);
    textFont("Doto");
    fill(255, 80 + 50 * sin(frameCount * 0.05));
    strokeWeight(1);
    textSize(450);
    textAlign(CENTER, CENTER);
    text("LU  NA", 410, 200);
    text("PA  RK", 410, 800);
    pop();

    //trianglenose
    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(0, 300);
    strokeWeight(8);
    stroke(200, 0, 0);
    fill(255, 165, 0);
    scale(meter1.getValue() * 100 + 1);
    triangle(0, -60, -30, 0, 30, 0);
    pop();

    //Bs
    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(-1200, 100);
    let x = map(bungo.progress(), 0, 1, 0, 1000);
    textSize(200);
    fill(255);
    stroke(255);
    strokeWeight(10);
    text("B", x, 0);
    pop();

    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(800, 100);
    let x2 = map(bungo.progress(), 0, 1, 0, 1000);
    scale(-1, 1);
    textSize(200);
    fill(255);
    stroke(255);
    strokeWeight(10);
    text("B", x2 - 400, 0);
    pop();

    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(-400, -400);
    image(face, 0, 0, 800, 800);
    pop();

    //eyes
    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(-400, -400);
    let waveform = analyzer1.getValue();
    let points = floor(analyzer1.getValue().length / 36);
    beginShape();
    translate(300, 400);
    for (let i = 0; i < waveform.length; i += points) {
      let phi = radians(map(i, 0, waveform.length, 0, 360));
      let radius = map(waveform[i], -1, 1, 8, 800 / 16);
      let x = radius * cos(phi);
      let y = radius * sin(phi);
      noStroke();
      fill(0);
      curveVertex(x, y);
    }
    endShape();

    beginShape();
    translate(200, 0);
    for (let i = 0; i < waveform.length; i += points) {
      let phi = radians(map(i, 0, waveform.length, 0, 360));
      let radius = map(waveform[i], -1, 1, 8, 800 / 16);
      let x = radius * cos(phi);
      let y = radius * sin(phi);
      noStroke();
      fill(0);
      curveVertex(x, y);
    }
    endShape();
    pop();

    //nose;
    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(0, 100);
    strokeWeight(8);
    stroke(200, 0, 0);
    fill(255, 165, 0);
    scale(meter1.getValue() * 4 + 1);
    triangle(0, -60, -30, 0, 30, 0);
    pop();

    //eyebrow
    let trianfrq = map(
      constrain(analyzer2.getValue()[0], -127, 0),
      -127,
      0,
      0,
      100
    );
    //console.log(analyzer2.getValue());
    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(-100, -100);
    noStroke();
    fill(0);
    triangle(
      -60 - trianfrq * 0.5,
      5 * sin(-trianfrq),
      60 - trianfrq * 0.5,
      20 + 5 * sin(-trianfrq),
      10 * sin(-trianfrq),
      -20 - trianfrq
    );
    translate(200, 0);
    triangle(
      -60 + trianfrq * 0.5,
      20 + 5 * sin(-trianfrq),
      60 + trianfrq * 0.5,
      5 * sin(-trianfrq),
      10 * sin(trianfrq),
      -20 - trianfrq
    );
    pop();

    //wrinkle
    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(-20, -80);
    let springfrq = analyzer3.getValue();
    strokeWeight(5);
    stroke(0);
    noFill();
    beginShape();
    for (let i = 0; i < springfrq.length; i++) {
      let x1 = constrain(map(springfrq[i], -127, 0, -50, 50), 0, 10);
      let y1 = map(log(i), 0, log(springfrq.length), -50, 0);
      curveVertex(x1, y1);
    }
    endShape();
    translate(40, 0);
    beginShape();
    for (let i = 0; i < springfrq.length; i++) {
      let x2 = constrain(map(springfrq[i], -127, 0, -50, 50), 0, 10);
      let y2 = map(log(i), 0, log(springfrq.length), -50, 0);
      curveVertex(-x2, y2);
    }
    endShape();
    pop();

    //mouth
    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    let y = map(bungo.progress(), 0, 1, 0, 10);
    let angle = map(bungo.progress(), 0, 1, 0, -TWO_PI);
    translate(0, 200);
    rotate(angle);
    image(
      lip1,
      -50 - meter2.getValue() * 50,
      y,
      100 + meter2.getValue() * 100,
      100 + meter2.getValue() * 100
    );
    rotate(-PI);
    image(
      lip1,
      -50 - meter2.getValue() * 50,
      y,
      100 + meter2.getValue() * 100,
      100 + meter2.getValue() * 100
    );
    pop();

    //cheek
    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(-400, -400);
    let drumfrq = map(
      constrain(analyzer4.getValue()[0], -127, 0),
      -127,
      0,
      0,
      100
    );
    strokeWeight(8);
    stroke(150, 0, 0);
    fill(255, 0, 0);
    translate(280, 520);
    ellipse(0, -drumfrq, meter3.getValue() * 100 + 50);
    image(
      body1,
      -width / 4,
      -drumfrq - height / 10 + 10 * sin(frameCount * 0.05),
      width / 6,
      width / 6
    );
    translate(240, 0);
    ellipse(0, drumfrq, meter3.getValue() * 100 + 50);
    image(
      body2,
      width / 4 - width / 6,
      drumfrq - height / 10 - 10 * sin(frameCount * 0.05),
      width / 6,
      width / 6
    );
    pop();

    push();
    translate(width / 2, height / 2.5);
    scale(scaleRatio * 0.8);
    translate(-400, -400);
    strokeWeight(8);
    stroke(150, 0, 0);
    fill(255, 0, 0);
    translate(180, 700);
    ellipse(0, drumfrq, meter3.getValue() * 100 + 50);
    translate(440, 0);
    ellipse(0, -drumfrq, meter3.getValue() * 100 + 50);
    pop();
  } else {
    background(220);
    text("loading...", 20, 20);
  }

  let bgWaveform = analyzer1.getValue();

  push();
  stroke(255);
  strokeWeight(3);
  noFill();
  translate(width / 2, height / 2.5);
  scale(scaleRatio * 0.8);
  translate(-400, -400);
  // Start position (right hand)
  let startX = 500 + 100; // hand2 x position + half width
  let startY = 800 + 100; // hand2 y position + half height

  // End position (left hand)
  let endX = 100 + 100; // hand1 x position + half width
  let endY = 800 + 100; // hand1 y position + half height

  beginShape();
  for (let i = 0; i < bgWaveform.length; i++) {
    // Calculate position along the line between hands
    let t = i / bgWaveform.length;
    let x = lerp(startX, endX, t);
    let y = lerp(startY, endY, t);

    let angle = atan2(endY - startY, endX - startX) + PI / 2;
    let waveAmount = bgWaveform[i] * 200;
    x += cos(angle) * waveAmount;
    y += sin(angle) * waveAmount;

    curveVertex(x, y);
  }
  endShape();
  pop();

  push();
  translate(width / 2, height / 2.5);
  scale(scaleRatio * 0.8);
  translate(-400, -400);

  image(hand1, 100, 780 - 10 * sin(frameCount * 0.05), 200, 200);
  image(hand2, 500, 780 + 10 * sin(frameCount * 0.05), 200, 200);
  pop();

  push();
  translate(width / 2, height / 2.5);
  scale(scaleRatio * 0.8);
  translate(0, 500);
  if (toyKeyboard.state === "started") {
    rotate(frameCount * 0.03);
  }
  imageMode(CENTER);
  image(cd, 0, 0, 200, 200);
  imageMode(CORNER);
  pop();

  push();
  textFont("Doto");
  fill(255);
  stroke(255);
  strokeWeight(5);
  textSize(width / 20);
  textAlign(CENTER, CENTER);
  text("!GO!", mouseX, mouseY);
  pop();
}

function mouseClicked() {
  if (loaded) {
    // CD的位置
    let centerX = width / 2;
    let centerY = height / 2.5 + 500 * scaleRatio * 0.8;
    let cdRadius = 100 * scaleRatio * 0.8;

    let dx = mouseX - centerX;
    let dy = mouseY - centerY;

    if (dx * dx + dy * dy < cdRadius * cdRadius) {
      if (toyKeyboard.state === "started") {
        toyKeyboard.stop();
      } else {
        toyKeyboard.start();
      }
    }
  }
}

function mousePressed() {
  //toeyes
  if (
    (mouseX > width * 0.37 &&
      mouseX < width * 0.46 &&
      mouseY > height * 0.37 &&
      mouseY < height * 0.42) ||
    (mouseX > width * 0.53 &&
      mouseX < width * 0.6 &&
      mouseY > height * 0.37 &&
      mouseY < height * 0.42)
  ) {
    let newWindow = window.open(
      "http://lunafeng922.github.io/com-luna/maintoeyes/index.html"
    );
    window.close();
  }

  //tonose
  if (
    mouseX > width * 0.48 &&
    mouseX < width * 0.52 &&
    mouseY > height * 0.45 &&
    mouseY < height * 0.49
  ) {
    let newWindow = window.open(
      "http://lunafeng922.github.io/com-luna/maintonose/index.html"
    );
    window.close();
  }
  //tomouth
  if (
    mouseX > width * 0.45 &&
    mouseX < width * 0.55 &&
    mouseY > height * 0.55 &&
    mouseY < height * 0.6
  ) {
    let newWindow = window.open(
      "http://lunafeng922.github.io/com-luna/maintomouth/index.html"
    );
    window.close();
  }
}

function keyTyped() {
  if (loaded) {
    if (key == "5" || key == "8") {
      trian.start();
    } else if (key == "6" || key == "7") {
      spring1.start();
    } else if (key == "f" || key == "j") {
      drum1.start();
    } else if (key == "b") {
      bungo.start();
    }
  }
}

Tone.loaded().then(function () {
  loaded = true;
});

function keyPressed() {
  if (key === " ") {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
