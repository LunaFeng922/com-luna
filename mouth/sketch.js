//BGM
let songs = [
  { name: "龙文 - 谭晶 & 小虫", file: "龙文 - 谭晶 & 小虫.MP3" },
  { name: "阿楚姑娘 - 袁娅维", file: "阿楚姑娘 - 袁娅维.MP3" },
  { name: "Take It Easy - Tia Ray", file: "Take It Easy - Tia Ray.MP3" },
  { name: "慕容雪 - 薛凯琪", file: "慕容雪 - 薛凯琪.MP3" },
  { name: "Ruler of My Heart - C!naH", file: "Ruler of My Heart - C!naH.MP3" },
  { name: "Gravity - John Mayer", file: "Gravity - John Mayer.MP3" },
  {
    name: "Black Sorrow - PARK BEYOND HOON",
    file: "Black Sorrow - PARK BEYOND HOON.MP3",
  },
  { name: "Pagodes - Claude Debussy", file: "Pagodes - Claude Debussy.MP3" },
  { name: "Pray For Me - The Weekend", file: "Pray For Me - The Weekend.MP3" },
];
let bgmEffectChain;
let effectSelector_bgm;
let currentEffect_bgm;
let effects_bgm = {};
let bgmAnalyzer;
let playerStartTime = 0;
let playerPausePosition = 0;

let players = [];
let currentIndex = 0;
let isPlaying = false;
let loaded = false;

let kitLoaded = false;

const kit = new Tone.Players(
  {
    kick: "505/kick.mp3",
    snare: "505/snare.mp3",
    hh: "505/hh.mp3",
    hho: "505/hho.mp3",
  },
  {
    onload: () => {
      console.log("Drum samples loaded");
      kitLoaded = true;

      Object.values(kit.players).forEach((player) => {
        player.fadeIn = 0;
        player.fadeOut = 0;
        player.retrigger = true;
      });

      const now = Tone.now();
      kit
        .player("kick")
        .start(now)
        .stop(now + 0.001);
      kit
        .player("snare")
        .start(now)
        .stop(now + 0.001);
      kit
        .player("hh")
        .start(now)
        .stop(now + 0.001);
      kit
        .player("hho")
        .start(now)
        .stop(now + 0.001);
      kit.player("kick").volume.value = -6;
      kit.player("snare").volume.value = -6;
      kit.player("hh").volume.value = -6;
      kit.player("hho").volume.value = -6;
    },
  }
).toDestination();

kit.onerror = (error) => {
  console.error("Error loading drum samples:", error);
};

//
let lipImg;

// mic input + speech rec
let mic, micPitchShift, micAnalyzer;
let recognizedText = "";
let recognition;

// effects
let effectSelector_mic;
let effectSelector_key;
let currentEffect_voice;
let currentEffect_synth;
let effects_mic = {};
let effects_key = {};

//volume
let volumeSlider;
let bgmVolumeSlider;
let micVolumeSlider;

//synth 1 & synth2
let synth1, synth2, analyzer1, analyzer2;
let synth1Selector, synth2Selector;

//chord or arpeggio
let chordButton, arpeggioButton;
let playStyle = "chord";
let arpeggioStyleSelector;

//rootenote & octave
let rootNote = 48;
let rootNoteSelector;

//scale
let scaleSelector;
let scaleNotes = [];
let scalePresets = {
  0: { notes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], name: "Chromatic" },
  1: { notes: [0, 2, 4, 7, 9], name: "Major" },
  2: { notes: [0, 3, 5, 7, 10], name: "Minor" },
  3: { notes: [0, 3, 5, 6, 7, 10], name: "Blues" },
  4: { notes: [0, 2, 5, 7, 10], name: "Egypt" },
  5: { notes: [0, 2, 3, 7, 8], name: "Hirajoshi" },
  6: { notes: [0, 2, 5, 7, 9], name: "Yo" },
  7: { notes: [0, 1, 3, 7, 8], name: "Balinese" },
};
let currentScale = 1;
let currentKey = null;
let currentNote = null;

//play mode - number of keys
let playModeSelector;
let numKeys = 8;
let playKeys = ["1", "2", "3", "4", "5", "6", "7", "8"];

//nullsets for key-circles
let circleSpacing = 60;
let circleRadius = 12;
let circles = [];

// Effect chains
let synth1EffectChain, synth2EffectChain, micEffectChain;

function preload() {
  lipImg = loadImage("lip.png");
  lipImg_2 = loadImage("lip_2.png");
  leftHandImg = loadImage("leftHand.PNG");
  rightHandImg = loadImage("rightHand.PNG");
  for (let s of songs) {
    let player = new Tone.Player(s.file);
    players.push(player);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  Tone.loaded().then(() => {
    loaded = true;
  });

  Tone.start();

  // Initialize effect chains
  synth1EffectChain = new Tone.Gain(1).toDestination();
  synth2EffectChain = new Tone.Gain(1).toDestination();
  micEffectChain = new Tone.Gain(1).toDestination();

  //synth
  synth1 = new Tone.MonoSynth({
    oscillator: { type: "triangle" },
  }).connect(synth1EffectChain);

  synth2 = new Tone.MonoSynth({
    oscillator: { type: "square" },
  }).connect(synth2EffectChain);

  analyzer1 = new Tone.Analyser("waveform", 1024);
  analyzer2 = new Tone.Analyser("waveform", 1024);

  synth1.connect(analyzer1);
  synth2.connect(analyzer2);

  synth1Selector = createSelect();
  synth1Selector.position(width - 200, 15);
  synth1Selector.option("triangle");
  synth1Selector.option("square");
  synth1Selector.option("sine");
  synth1Selector.option("sawtooth");
  synth1Selector.selected("triangle");
  synth1Selector.changed(function () {
    synth1.oscillator.type = synth1Selector.value();
  });

  synth2Selector = createSelect();
  synth2Selector.position(width - 100, 15);
  synth2Selector.option("triangle");
  synth2Selector.option("square");
  synth2Selector.option("sine");
  synth2Selector.option("sawtooth");
  synth2Selector.selected("square");
  synth2Selector.changed(function () {
    synth2.oscillator.type = synth2Selector.value();
  });

  //volume - synth
  volumeSlider = createSlider(0, 1, 0.5, 0.01);
  volumeSlider.position(20, 105);
  volumeSlider.style("width", "100px");

  // volume - bgm
  bgmVolumeSlider = createSlider(-30, 0, -10, 1);
  bgmVolumeSlider.position(20, height - 120);
  bgmVolumeSlider.style("width", "100px");

  // volume - mic
  micVolumeSlider = createSlider(-20, 20, 6, 1);
  micVolumeSlider.position(20, 135);
  micVolumeSlider.style("width", "100px");

  //scale
  scaleSelector = createSelect();
  scaleSelector.position(20, 15);
  for (let key in scalePresets) {
    scaleSelector.option(scalePresets[key].name, key);
  }
  scaleSelector.selected(currentScale);
  scaleSelector.changed(function () {
    currentScale = int(scaleSelector.value());
    generateScale();
    initializeCircles();
  });

  //playmode - num of keys
  playModeSelector = createSelect();
  playModeSelector.position(20, 75);
  playModeSelector.option("Simple - 5 keys");
  playModeSelector.option("Standard - 8 keys");
  playModeSelector.option("Explore - 12 keys");
  playModeSelector.selected("Standard - 8 keys");
  playModeSelector.changed(changePlayMode);

  //rootnote - octave
  rootNoteSelector = createSelect();
  rootNoteSelector.position(20, 45);
  for (let i = 24; i <= 84; i += 12) {
    let noteName = Tone.Frequency(i, "midi").toNote();
    rootNoteSelector.option(noteName, i);
  }
  rootNoteSelector.selected(rootNote);
  rootNoteSelector.changed(function () {
    updateRootNote(int(rootNoteSelector.value()));
  });

  //chord or arpeggio
  monoButton = createButton("Mono Mode");
  monoButton.position(width - 108, 45);
  monoButton.mousePressed(function () {
    playStyle = "mono";
    monoButton.style("background-color", "#66ccff");
    chordButton.style("background-color", "#ffffff");
    arpeggioButton.style("background-color", "#ffffff");
  });

  chordButton = createButton("Chord Mode");
  chordButton.position(width - 110, 75);
  chordButton.mousePressed(function () {
    playStyle = "chord";
    chordButton.style("background-color", "#66ccff");
    monoButton.style("background-color", "#ffffff");
    arpeggioButton.style("background-color", "#ffffff");
  });

  arpeggioButton = createButton("Arpeggio Mode");
  arpeggioButton.position(width - 128, 105);
  arpeggioButton.mousePressed(function () {
    playStyle = "arpeggio";
    chordButton.style("background-color", "#ffffff");
    monoButton.style("background-color", "#ffffff");
    arpeggioButton.style("background-color", "#66ccff");
  });

  chordButton.style("background-color", "#66ccff");

  //arpeggio style
  arpeggioStyleSelector = createSelect();
  arpeggioStyleSelector.position(width - 105, 135);
  arpeggioStyleSelector.option("up");
  arpeggioStyleSelector.option("down");
  arpeggioStyleSelector.option("up-down");
  arpeggioStyleSelector.option("down-up");
  arpeggioStyleSelector.option("alter-up");
  arpeggioStyleSelector.option("alter-down");
  arpeggioStyleSelector.option("random");
  arpeggioStyleSelector.option("ran-walk");
  arpeggioStyleSelector.option("ran-once");
  arpeggioStyleSelector.selected("up");

  //soundeffects_key
  effects_key = {
    None_synth: null,
    Chorus_synth: new Tone.Chorus(4, 2.5, 0.5).start(),
    Phaser_synth: new Tone.Phaser({
      frequency: 15,
      octaves: 5,
      baseFrequency: 1000,
    }),
    PingPongDelay_synth: new Tone.PingPongDelay("2n", 0.2),
    BitCrusher_synth: new Tone.BitCrusher(4),
  };

  effectSelector_key = createSelect();
  effectSelector_key.position(width - 175, 165);

  for (let key in effects_key) {
    effectSelector_key.option(key, key);
  }

  effectSelector_key.selected("None_synth");
  effectSelector_key.changed(applyEffect_key);

  //soundeffects_mic
  effects_mic = {
    None_mic: null,
    Chorus_mic: new Tone.Chorus(4, 2.5, 0.5).start(),
    Phaser_mic: new Tone.Phaser({
      frequency: 15,
      octaves: 5,
      baseFrequency: 1000,
    }),
    PingPongDelay_mic: new Tone.PingPongDelay("2n", 0.2),
    BitCrusher_mic: new Tone.BitCrusher(4),
  };

  effectSelector_mic = createSelect();
  effectSelector_mic.position(width - 340, 165);

  for (let key in effects_mic) {
    effectSelector_mic.option(key, key);
  }

  effectSelector_mic.selected("None_mic");
  effectSelector_mic.changed(applyEffect_mic);

  //effects_bgm
  bgmEffectChain = new Tone.Gain(1).toDestination();
  bgmAnalyzer = new Tone.Analyser("waveform", 1024);
  bgmEffectChain.connect(bgmAnalyzer);

  Tone.Transport.bpm.value = 120;
  Tone.Transport.loop = false;

  players.forEach((player, index) => {
    player.loop = true;
    player.connect(bgmEffectChain);
    if (index === currentIndex) {
      player.sync().start(0);
    } else {
      player.unsync().stop();
    }
  });

  effects_bgm = {
    None_bgm: null,
    Chorus_bgm: new Tone.Chorus(4, 2.5, 0.5).start(),
    Phaser_bgm: new Tone.Phaser({
      frequency: 15,
      octaves: 5,
      baseFrequency: 1000,
    }),
    PingPongDelay_bgm: new Tone.PingPongDelay("4n", 0.2),
    Reverb_bgm: new Tone.Reverb(2).toDestination(),
  };

  effectSelector_bgm = createSelect();
  effectSelector_bgm.position(width - 340, 195);
  for (let key in effects_bgm) {
    effectSelector_bgm.option(key);
  }
  effectSelector_bgm.selected("None_bgm");
  effectSelector_bgm.changed(applyEffect_bgm);

  //mic input
  mic = new Tone.UserMedia();
  mic
    .open()
    .then(() => {
      console.log("Microphone is open.");
      mic.volume.value = 6;
    })
    .catch((e) => {
      console.error("Microphone access denied.", e);
    });

  micPitchShift = new Tone.PitchShift(0);
  micAnalyzer = new Tone.Waveform(1024);

  // Connect mic to pitch shift, then to effect chain
  mic.connect(micPitchShift);
  micPitchShift.connect(micEffectChain);
  micPitchShift.connect(micAnalyzer);

  startSpeechRecognition();

  updateUIPositions();

  generateScale();

  initializeCircles();
}

function draw() {
  background(0);

  circleRadius = width / 50;

  let vol = volumeSlider.value();
  synth1.volume.value = map(vol, 0, 1, -30, 0);
  synth2.volume.value = map(vol, 0, 1, -30, 0);

  players[currentIndex].volume.value = bgmVolumeSlider.value();
  if (mic) mic.volume.value = micVolumeSlider.value();

  let waveform1 = analyzer1.getValue();
  let waveform2 = analyzer2.getValue();

  //centershape - now affected by effects
  push();
  strokeWeight(2);
  noFill();
  stroke(255);
  beginShape();
  for (let i = 0; i < waveform1.length; i++) {
    let x = map(waveform1[i], -1, 1, 0, width);
    let y = map(waveform2[i], -1, 1, (height * 2) / 3, 0);
    vertex(x, y);
  }
  endShape();
  pop();

  function getRMS(waveform) {
    let sum = 0;
    for (let i = 0; i < waveform.length; i++) {
      sum += waveform[i] * waveform[i];
    }
    return Math.sqrt(sum / waveform.length);
  }
  let rms1 = getRMS(waveform1);
  let rms2 = getRMS(waveform2);

  let openness = map(rms1 + rms2, 0, 0.4, 0, 150);

  //hand besides center shape
  imageMode(CENTER);
  image(
    leftHandImg,
    width / 2 - width / 38 - openness,
    height / 3,
    width / 10,
    width / 10
  );
  image(
    rightHandImg,
    width / 2 + width / 38 + openness,
    height / 3,
    width / 10,
    width / 10
  );

  //key-circles
  push();
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];
    if (circle.isPressed) {
      strokeWeight(2);
      stroke(255);
      fill(255);
    } else {
      strokeWeight(2);
      stroke(255);
      if (circle.isSharp) {
        fill(255, 255, 200, 120);
      } else {
        fill(100, 200, 255, 50);
      }
    }
    ellipse(circle.x, circle.y, circleRadius * 2, circleRadius * 2);
    pop();

    //text-instructions
    push();
    let fontMap_synth = {
      None_synth: "Space Mono",
      Chorus_synth: "DM Serif Text",
      Phaser_synth: "Doto",
      PingPongDelay_synth: "Knewave",
      BitCrusher_synth: "Rubik Iso",
    };
    let selectedEffect_synth = effectSelector_key.value();
    textFont(fontMap_synth[selectedEffect_synth]);

    fill(255);
    strokeWeight(1);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(circle.key, circle.x, circle.y + circleRadius + 15);
    text(circle.note, circle.x, circle.y - circleRadius - 15);
  }
  pop();

  //speech recognition
  push();
  if (recognizedText) {
    let fontMap_mic = {
      None_mic: "Space Mono",
      Chorus_mic: "DM Serif Text",
      Phaser_mic: "Doto",
      PingPongDelay_mic: "Knewave",
      BitCrusher_mic: "Rubik Iso",
    };
    let selectedEffect_mic = effectSelector_mic.value();
    textFont(fontMap_mic[selectedEffect_mic]);
    fill(255);
    textSize(width / 25);
    textAlign(CENTER, CENTER);
    text(recognizedText, width / 2 - 10, (height * 2) / 3 + 40);
  }
  pop();

  //micWaveform - now affected by effects
  let micWaveform = micAnalyzer.getValue();
  push();
  noFill();
  stroke(255);
  strokeWeight(2);
  beginShape();
  let yOffset = (height * 2) / 3 + 40;
  for (let i = 0; i < micWaveform.length; i++) {
    let x = map(i, 0, micWaveform.length - 1, width / 6, (width * 5) / 6);
    let y = yOffset + micWaveform[i] * 30;
    vertex(x, y);
  }
  endShape();
  pop();

  //lips above & below the waveform
  let micValues = micAnalyzer.getValue();
  let rms = 0;
  for (let i = 0; i < micValues.length; i++) {
    rms += micValues[i] * micValues[i];
  }
  rms = Math.sqrt(rms / micValues.length);

  let lipGap = map(rms, 0, 0.3, 0, height / 6);
  lipGap = constrain(lipGap, 0, height / 6);

  imageMode(CENTER);
  image(
    lipImg,
    width / 2,
    (height * 2) / 3 + 40 + width / 20 + lipGap + width / 50,
    width / 10,
    width / 10
  );
  image(
    lipImg_2,
    width / 2,
    (height * 2) / 3 + 40 - width / 20 - lipGap - width / 50,
    width / 10,
    width / 10
  );

  push();
  strokeWeight(1);
  textAlign(RIGHT, CENTER);
  textSize(height / 45);
  stroke(255);
  fill(255);
  textFont("Doto");
  text("Gate", width - 10, height - 120);
  text("Observation Deck", width - 10, height - 75);
  text("Breath Training", width - 10, height - 30);
  pop();

  push();
  textSize(height / 45);
  fill(255);
  strokeWeight(1);
  stroke(255);
  textFont("Doto");
  if (!loaded) {
    text("loading...", 20, height - 15);
    return;
  }

  let currentSong = songs[currentIndex];
  textAlign(LEFT, CENTER);
  text(`Now Playing: ${currentSong.name}`, 20, height - 75);
  text(isPlaying ? "●" : "ᐅ", 20, height - 30);
  pop();

  if (loaded && players[currentIndex]) {
    let bgmWaveform = bgmAnalyzer.getValue();
    push();
    noFill();
    stroke(255);
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < bgmWaveform.length; i++) {
      let x = map(i, 0, bgmWaveform.length, 60, 200);
      let y = map(bgmWaveform[i], -1, 1, height - 10, height - 50);
      vertex(x, y);
    }
    endShape();
    pop();
  }

  push();
  fill(255);
  textAlign(CENTER, CENTER);
  text("a", width / 5, height * 0.8);
  text("s", (width * 2) / 5, height * 0.8);
  text("d", (width * 3) / 5, height * 0.8);
  text("f", (width * 4) / 5, height * 0.8);
  if (keyIsPressed && key == "a") {
    circle(width / 5, height * 0.8, 30);
  }
  if (keyIsPressed && key == "s") {
    circle((width * 2) / 5, height * 0.8, 30);
  }
  if (keyIsPressed && key == "d") {
    circle((width * 3) / 5, height * 0.8, 30);
  }
  if (keyIsPressed && key == "f") {
    circle((width * 4) / 5, height * 0.8, 30);
  }
  pop();
}

function startSpeechRecognition() {
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = function (event) {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      recognizedText = currentTranscript;
    };

    recognition.onerror = function (event) {
      //console.log("Speech Recognition Error:", event.error);
    };

    recognition.onend = function () {
      //console.log("Speech Recognition ended. Restarting...");
      recognition.start();
    };

    recognition.start();
    //console.log("Speech Recognition Started.");
  } else {
    //console.error("Speech Recognition not supported.");
  }
}

//rootnote & octave
function updateRootNote(newRoot) {
  rootNote = constrain(newRoot, 24, 84);
  rootNoteSelector.selected(rootNote);
  generateScale();
  initializeCircles();

  let semitoneOffset = rootNote - 48;
  micPitchShift.pitch = semitoneOffset;
}

//key-trigger notes - mono/chords/arpeggio
function keyPressed() {
  if (kitLoaded) {
    const now = Tone.now();
    if (key === "a" || key === "a") {
      kit.player("kick").start(now);
    }
    if (key === "s" || key === "S") {
      kit.player("snare").start(now);
    }
    if (key === "d" || key === "D") {
      kit.player("hh").start(now);
    }
    if (key === "f" || key === "F") {
      kit.player("hho").start(now);
    }
  }

  let index = playKeys.indexOf(key);
  if (index !== -1 && index < scaleNotes.length) {
    let freq1 = new Tone.Frequency(scaleNotes[index], "midi");
    let freq2 = new Tone.Frequency(scaleNotes[index + 2], "midi");
    let freq3 = new Tone.Frequency(scaleNotes[index + 4], "midi");

    if (playStyle === "mono") {
      synth1.triggerAttackRelease(freq1, "8n");
      synth2.triggerAttackRelease(freq1, "8n");
    }
    if (playStyle === "chord") {
      synth1.triggerAttackRelease(freq1, "8n");
      synth2.triggerAttackRelease(freq2, "8n");
    } else if (playStyle === "arpeggio") {
      let notes = [freq1, freq2, freq3];
      let style = arpeggioStyleSelector.value();

      if (style === "Down") {
        notes.reverse();
      } else if (style === "Up-Down") {
        notes = notes.concat([...notes].reverse().slice(1));
      } else if (style === "Down-Up") {
        notes = [...notes].reverse().concat(notes.slice(1));
      } else if (style === "Alternate-Up") {
        notes = [notes[0], notes[2], notes[1]]; // Alternate between 1st and 3rd
      } else if (style === "Alternate-Down") {
        notes = [notes[2], notes[0], notes[1]]; // Alternate between 3rd and 1st
      } else if (style === "Random") {
        notes = shuffle([...notes]);
      } else if (style === "Random-Walk") {
        let shuffledNotes = shuffle([...notes]);
        notes = [shuffledNotes[0], shuffledNotes[1], shuffledNotes[2]];
      } else if (style === "Random-Once") {
        notes = [notes[0], notes[1], notes[2]]; // Keep the notes in original order and pick randomly once
        notes = shuffle(notes);
      }

      notes.forEach(function (note, i) {
        setTimeout(function () {
          let synth;
          if (i % 2 === 0) {
            synth = synth1;
          } else {
            synth = synth2;
          }
          synth.triggerAttackRelease(note, "8n");
        }, i * 100);
      }); // Play the notes in the array alternately using synth1 and synth2
    }

    currentKey = key;
    currentNote = freq1.toNote();
    circles[index].isPressed = true;
  }

  //rootnote & octave
  if (key === "z" || key === "Z") {
    updateRootNote(rootNote - 12); // octave down
    return;
  } else if (key === "x" || key === "X") {
    updateRootNote(rootNote + 12); // octave up
    return;
  }

  if (key === " ") {
    let fs = fullscreen();
    fullscreen(!fs);
  }

  if (!loaded) return;

  if (key === "," || keyCode === 188) {
    switchSong(-1);
  } else if (key === "." || keyCode === 190) {
    switchSong(1);
  } else if (key === "r" || key === "R") {
    restartSong();
  }
}

function keyReleased() {
  let index = playKeys.indexOf(key);
  if (index !== -1 && index < circles.length) {
    circles[index].isPressed = false;
  }
  currentKey = null;
  currentNote = null;
}

//scale & octave
function generateScale() {
  scaleNotes = [];
  let scale = scalePresets[currentScale].notes;
  let octaveOffset = 0;
  let noteIndex = 0;
  while (scaleNotes.length < numKeys + 5) {
    let note = rootNote + scale[noteIndex % scale.length] + octaveOffset * 12;
    scaleNotes.push(note);
    noteIndex++;
    if (noteIndex % scale.length === 0) octaveOffset++;
  }
}

//circle-pos
function initializeCircles() {
  circles = [];
  //x-pos decided by semitone differeneces
  let lastX = (-10 * width) / 600;
  for (let i = 0; i < numKeys; i++) {
    let semitoneDifference = i > 0 ? scaleNotes[i] - scaleNotes[i - 1] : 0;
    let adjustedSpacing =
      (circleSpacing * (1 + semitoneDifference / 12) * width) / 600;
    let x = lastX + adjustedSpacing;
    let y = (130 * height) / 400 - 200 * sin((x / width) * PI);

    let midiNote = scaleNotes[i];
    let note = Tone.Frequency(midiNote, "midi").toNote();
    let key = playKeys[i];

    //y-pos decided by whether is sharp or not
    let isSharp = note.includes("#");
    //if (isSharp) y -= 30;

    circles.push({ x, y, key, note, isPressed: false, isSharp });
    lastX = x;
  }
}

//playmode-num of keys
function changePlayMode() {
  let selected = playModeSelector.value();
  if (selected.includes("Simple")) {
    numKeys = 5;
    playKeys = ["1", "2", "3", "4", "5"];
    circleSpacing = 90;
  } else if (selected.includes("Standard")) {
    numKeys = 8;
    playKeys = ["1", "2", "3", "4", "5", "6", "7", "8"];
    circleSpacing = 60;
  } else if (selected.includes("Explore")) {
    numKeys = 12;
    playKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="];
    circleSpacing = 41;
  }
  generateScale();
  initializeCircles();
}

function applyEffect_mic() {
  let selected = effectSelector_mic.value();

  if (currentEffect_voice) {
    if (micPitchShift && micPitchShift.disconnect) micPitchShift.disconnect();
    if (currentEffect_voice && currentEffect_voice.disconnect)
      currentEffect_voice.disconnect();
  }

  currentEffect_voice = effects_mic[selected];

  if (mic && micPitchShift) {
    mic.disconnect();
    mic.connect(micPitchShift);
    micPitchShift.disconnect();

    if (currentEffect_voice) {
      micPitchShift.connect(currentEffect_voice);
      currentEffect_voice.toDestination();
      //currentEffect.connect(micPitchShift);
      //micPitchShift.toDestination();
      currentEffect_voice.connect(micAnalyzer);
      micPitchShift.connect(micAnalyzer);
    } else {
      micPitchShift.toDestination();
      micPitchShift.connect(micAnalyzer);
    }
  }
}

function applyEffect_key() {
  let selected = effectSelector_key.value();

  if (currentEffect_synth) {
    if (synth1 && synth1.disconnect) synth1.disconnect();
    if (synth2 && synth2.disconnect) synth2.disconnect();
    if (currentEffect_synth && currentEffect_synth.disconnect)
      currentEffect_synth.disconnect();
  }

  //currentEffect_voice = effects_mic[selected];
  currentEffect_synth = effects_key[selected];

  if (synth1 && synth2) {
    synth1.disconnect();
    synth2.disconnect();

    if (currentEffect_synth) {
      synth1.connect(currentEffect_synth);
      synth2.connect(currentEffect_synth);
      currentEffect_synth.toDestination();
      currentEffect_synth.connect(analyzer1);
      currentEffect_synth.connect(analyzer2);
    } else {
      synth1.toDestination();
      synth2.toDestination();
    }

    synth1.connect(analyzer1);
    synth2.connect(analyzer2);
  }
}

function applyEffect_bgm() {
  let selected = effectSelector_bgm.value();

  if (currentEffect_bgm) {
    bgmEffectChain.disconnect();
    currentEffect_bgm.disconnect();
  }

  currentEffect_bgm = effects_bgm[selected];

  bgmEffectChain.disconnect();
  if (currentEffect_bgm) {
    bgmEffectChain.connect(currentEffect_bgm);
    currentEffect_bgm.connect(bgmAnalyzer);
    currentEffect_bgm.toDestination();
  } else {
    bgmEffectChain.connect(bgmAnalyzer);
    bgmEffectChain.toDestination();
  }

  players.forEach((player) => {
    player.disconnect();
    player.connect(bgmEffectChain);
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateUIPositions();
  initializeCircles();
}

function updateUIPositions() {
  scaleSelector.position(20, 15);
  rootNoteSelector.position(20, 45);
  playModeSelector.position(20, 75);
  volumeSlider.position(20, 105);
  micVolumeSlider.position(20, 135);
  bgmVolumeSlider.position(20, height - 120);

  synth1Selector.position(width - 200, 15);
  synth2Selector.position(width - 100, 15);

  monoButton.position(width - 350, 45);
  chordButton.position(width - 235, 45);
  arpeggioButton.position(width - 125, 45);
  arpeggioStyleSelector.position(width - 105, 75);
  effectSelector_mic.position(width - 340, 105);
  effectSelector_key.position(width - 175, 105);
  effectSelector_bgm.position(180, height - 120);
}

function mousePressed() {
  //run/stop bgm
  if (
    mouseX > 20 &&
    mouseX < 30 &&
    mouseY > height - 40 &&
    mouseY < height - 20
  ) {
    togglePlay();
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

  //toeyes
  if (
    mouseX > width * 0.85 &&
    mouseX < width &&
    mouseY > height - 85 &&
    mouseY < height - 65
  ) {
    let newWindow = window.open(
      "http://lunafeng922.github.io/com-luna/mouthtoeyes/index.html"
    );
    window.close();
  }
  //tonose
  if (
    mouseX > width * 0.9 &&
    mouseX < width &&
    mouseY > height - 40 &&
    mouseY < height - 20
  ) {
    let newWindow = window.open(
      "http://lunafeng922.github.io/com-luna/mouthtonose/index.html"
    );
    window.close();
  }
}

function switchSong(direction) {
  playerPausePosition = 0;
  Tone.Transport.stop();

  players[currentIndex].unsync().stop();

  currentIndex = (currentIndex + direction + songs.length) % songs.length;

  players[currentIndex].sync().start(0);

  if (isPlaying) {
    Tone.Transport.start();
  }
}

function togglePlay() {
  if (!loaded) return;

  if (isPlaying) {
    playerPausePosition = Tone.Transport.seconds;
    Tone.Transport.pause();
    isPlaying = false;
  } else {
    if (playerPausePosition > 0) {
      Tone.Transport.seconds = playerPausePosition;
    }
    Tone.Transport.start();
    isPlaying = true;
  }
}

function restartSong() {
  if (!loaded) return;

  playerPausePosition = 0;
  Tone.Transport.stop();
  Tone.Transport.seconds = 0;

  players[currentIndex].unsync().stop();
  players[currentIndex].sync().start(0);

  if (isPlaying) {
    Tone.Transport.start();
  }
}
