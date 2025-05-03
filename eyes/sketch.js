let showStartPage = true;

let synth1 = new Tone.Synth().toDestination();
let synth2 = new Tone.Synth().toDestination();
let synth3 = new Tone.Synth().toDestination();
let synth4 = new Tone.Synth().toDestination();

let pentatonic_1 = [0, 2, 4, 7, 9]; // Major
let pentatonic_2 = [0, 3, 5, 7, 10]; // Minor
let pentatonic_3 = [0, 3, 5, 6, 7, 10]; // Blues
let pentatonic_4 = [0, 2, 5, 7, 10]; // Egypt
let pentatonic_5 = [0, 2, 3, 7, 8]; // Hirajoshi
let pentatonic_6 = [0, 2, 5, 7, 9]; // Yo
let pentatonic_7 = [0, 1, 3, 7, 8]; // Balinese

let root = 60;
let octave = 0;
let scale = pentatonic_1;

let lastNote1 = null;
let lastNote2 = null;
let lastNote3 = null;
let lastNote4 = null;

let synth1Enabled = true;
let synth2Enabled = true;
let synth3Enabled = true;
let synth4Enabled = true;

let showLine_1 = true;
let showLine_2 = true;
let showLine_3 = true;
let showLine_4 = true;

let n = 40;
let a = 0;

let senario = "1_Major";

let scene;

let col;

let r, g, b;

let s; //special for text color in some senario;

let images = {};

function preload() {
  images["1"] = loadImage("1.png");
  images["2"] = loadImage("2.png");
  images["3"] = loadImage("3.png");
  images["4"] = loadImage("4.png");
  images["5"] = loadImage("5.png");
  images["6"] = loadImage("6.png");
  images["7"] = loadImage("7.png");
  scene = images["1"];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  col = color(0);
  r = 0;
  g = 0;
  b = 0;
  s = color(255);
}

function draw() {
  background(col, 255);
  col = color(r * (1 + octave), g * (1 + octave), b * (1 + octave));

  push();
  fill(255, 255 - octave * 125, 200 - octave * 125, a);
  noStroke();
  ellipse(mouseX, mouseY, 2.5 * n + sin(frameCount * 0.05));
  ellipse(mouseX, mouseY, 3 * n + 10 * abs(sin(frameCount * 0.05)));
  pop();

  if (showStartPage) {
    a = 80;
    textFont("Doto");
    textAlign(CENTER, CENTER);
    textSize(50 + 3 * abs(sin(frameCount * 0.05)));
    fill(255);
    text("Click to Start", width / 2, height * 0.4);
    textSize(20);
    fill(255, 255 - octave * 125, 255 - octave * 125);
    text("·Press 1-7 to switch senario", width / 2, height * 0.47);
    text(
      "·Press z/x to switch octave (z = down; x = up)",
      width / 2,
      height * 0.52
    );
    text("·Press a/s/d/f to (de)activate strings", width / 2, height * 0.57);
    text(
      "·Press n/m to de/increase vision (intervals)",
      width / 2,
      height * 0.62
    );
    return;
  }

  push();
  if (scene) {
    image(scene, 0, 0, windowWidth, (windowHeight * 5) / 6);
  }
  pop();

  push();
  strokeWeight(0.5);
  stroke(255, 255 - octave * 125, 200 - octave * 125);
  line(0, (windowHeight * 5) / 6, width, (windowHeight * 5) / 6);
  pop();

  push();
  strokeWeight(4);
  textFont("Doto");
  textAlign(LEFT, CENTER);
  textSize(height / 45);
  fill(s);
  text("·Press 1-7 to switch senario", 10, (height * 5) / 6 + height / 30);
  text(
    "·Press z/x to switch octave (z = down; x = up)",
    10,
    (height * 5) / 6 + (height * 2) / 30
  );
  text(
    "·Press a/s/d/f to (de)activate strings",
    10,
    (height * 5) / 6 + (height * 3) / 30
  );
  text(
    "·Press n/m to de/increase vision (intervals)",
    10,
    (height * 5) / 6 + (height * 4) / 30
  );
  pop();

  push();
  strokeWeight(1);
  textAlign(RIGHT, CENTER);
  textSize(height / 45);
  fill(s);
  textFont("Doto");
  text("Octave: " + octave, width - 10, 30);
  text(senario, width - 10, 30 + height / 30);
  pop();

  push();
  strokeWeight(1);
  textAlign(RIGHT, CENTER);
  textSize(height / 45);
  fill(s);
  textFont("Doto");
  text("Gate", width - 10, height-120);
  text("Breath Training", width - 10,height-75);
  text("DJ Mixer", width - 10, height-30);
  pop();

  push();
  strokeWeight(3);
  if (showLine_1 && mouseY < (windowHeight * 5) / 6) {
    stroke(255, 255 - octave * 125, 200 - octave * 125, random(90, 100));
    line(0, mouseY, width, mouseY);
    a = 80;
  }
  if (showLine_2) {
    stroke(255, 255 - octave * 125, 200 - octave * 125, random(90, 100));
    line(mouseX, 0, mouseX, (windowHeight * 5) / 6);
    a = 80;
  }
  if (showLine_3) {
    stroke(255, 255 - octave * 125, 200 - octave * 125, random(50, 60));
    line(mouseX - n, 0, mouseX - n, (windowHeight * 5) / 6);
    a = 80;
  }
  if (showLine_4) {
    stroke(255, 255 - octave * 125, 200 - octave * 125, random(50, 60));
    line(mouseX + n, 0, mouseX + n, (windowHeight * 5) / 6);
    a = 80;
  }
  pop();

  if (
    showLine_1 == false &&
    showLine_2 == false &&
    showLine_3 == false &&
    showLine_4 == false
  ) {
    a = 0;
  }
}

function mousePressed() {
  if (showStartPage) {
    showStartPage = false;
    r = 12;
    g = 24;
    b = 16;
  }
  //togate
  if (
    mouseX > width * 0.95 &&
    mouseX < width &&
    mouseY > height - 130 &&
    mouseY < height - 110
  ) {
    let newWindow = window.open(
      "http://lunafeng922.github.io/com-luna/main/index.html"
    );
    window.close();
  }

  //tonose
  if (
    mouseX > width * 0.85 &&
    mouseX < width &&
    mouseY > height - 85 &&
    mouseY < height - 65
  ) {
    let newWindow = window.open(
      "http://lunafeng922.github.io/com-luna/eyestonose/index.html"
    );
    window.close();
  }
  //tomouth
  if (
    mouseX > width * 0.90 &&
    mouseX < width &&
    mouseY > height - 40 &&
    mouseY < height-20
  ) {
    let newWindow = window.open(
      "http://lunafeng922.github.io/com-luna/eyestomouth/index.html"
    );
    window.close();
  }
}

function mouseMoved() {
  if (showStartPage) return;
  let pos1 =
    int(
      map(
        constrain(mouseY, 0, (windowHeight * 5) / 6),
        (windowHeight * 5) / 6,
        0,
        0,
        scale.length
      )
    ) % scale.length;
  let note1 = root + scale[pos1] + octave * 12;

  let pos2 = int(map(mouseX, 0, width, 0, scale.length)) % scale.length;
  let note2 = root + scale[pos2] + octave * 12;

  let pos3 = int(map(mouseX - n, 0, width, 0, scale.length)) % scale.length;
  let note3 = root + scale[pos3] + octave * 12;

  let pos4 = int(map(mouseX + n, 0, width, 0, scale.length)) % scale.length;
  let note4 = root + scale[pos4] + octave * 12;

  if (synth1Enabled && !isNaN(note1) && note1 !== lastNote1) {
    synth1.triggerAttackRelease(Tone.Frequency(note1, "midi"), "0.1");
    lastNote1 = note1;
  }
  if (synth2Enabled && !isNaN(note2) && note2 !== lastNote2) {
    synth2.triggerAttackRelease(Tone.Frequency(note2, "midi"), "0.1");
    lastNote2 = note2;
  }
  if (synth3Enabled && !isNaN(note3) && note3 !== lastNote3) {
    synth3.triggerAttackRelease(
      Tone.Frequency(note3, "midi"),
      "0.1",
      Tone.now(),
      0.5
    );
    lastNote3 = note3;
  }
  if (synth4Enabled && !isNaN(note4) && note4 !== lastNote4) {
    synth4.triggerAttackRelease(
      Tone.Frequency(note4, "midi"),
      "0.1",
      Tone.now(),
      0.5
    );
    lastNote4 = note4;
  }
}

function keyPressed() {
  if (key === "a") {
    synth1Enabled = !synth1Enabled;
    showLine_1 = !showLine_1;
  }
  if (key === "d") {
    synth2Enabled = !synth2Enabled;
    showLine_2 = !showLine_2;
  }
  if (key === "s") {
    synth3Enabled = !synth3Enabled;
    showLine_3 = !showLine_3;
  }
  if (key === "f") {
    synth4Enabled = !synth4Enabled;
    showLine_4 = !showLine_4;
  }

  if (key === "z" && octave > -1) {
    octave -= 1;
  }
  if (key === "x" && octave < 2) {
    octave += 1;
  }

  if (key === "1") {
    scale = pentatonic_1;
    senario = "1_Major";
    scene = images["1"];
    r = 12;
    g = 24;
    b = 16;
    s = color(255);
  }
  if (key === "2") {
    scale = pentatonic_2;
    senario = "2_Minor";
    scene = images["2"];
    r = 18;
    g = 22.5;
    b = 45;
    s = color(255);
  }
  if (key === "3") {
    scale = pentatonic_3;
    senario = "3_Blues";
    scene = images["3"];
    r = 30;
    g = 10;
    b = 50;
    s = color(255);
  }
  if (key === "4") {
    scale = pentatonic_4;
    senario = "4_Egypt";
    scene = images["4"];
    r = 100;
    g = 50;
    b = 0;
    s = color(255);
  }
  if (key === "5") {
    scale = pentatonic_5;
    senario = "5_Hairajoshi";
    scene = images["5"];
    r = 10;
    g = 90;
    b = 120;
    s = color(255);
  }
  if (key === "6") {
    scale = pentatonic_6;
    senario = "6_Yo";
    scene = images["6"];
    r = 200;
    g = 36;
    b = 100;
    s = color(255);
  }
  if (key === "7") {
    scale = pentatonic_7;
    senario = "7_Balinese";
    scene = images["7"];
    r = 240;
    g = 210;
    b = 130;
    s = color(100);
  }

  if (key === "m" && n < width / 3) {
    n = n + 5;
  }
  if (key === "n" && n > width / 20) {
    n = n - 5;
  }
  if (key === " ") {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
