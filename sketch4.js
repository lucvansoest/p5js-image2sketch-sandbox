let img;
let strokeLength = 8; // Length of each stroke
let spacing = 8; // Space between strokes
let angleVariation = 0; // How much the stroke angle can vary

function preload() {
  img = loadImage('obama.jpg');
}

function setup() {
  createCanvas(800, 800);
  background(255);
  stroke(0);
  strokeWeight(1);
  noFill();

  angleVariation = PI/4; // How much the stroke angle can vary
  
  let aspectRatio = img.width / img.height;
  if (aspectRatio > 1) {
    img.resize(width, 0);
  } else {
    img.resize(0, height);
  }
}

function draw() {
  background(255);
  
  img.loadPixels();
  
  for (let x = 0; x < img.width; x += spacing) {
    for (let y = 0; y < img.height; y += spacing) {
      // Get pixel brightness
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let brightness = (r + g + b) / 3;
      
      // Convert brightness to probability
      let probability = 1 - brightness / 255;
      
      // Draw stroke based on probability
      if (random() < probability) {
        // Calculate stroke length based on brightness
        let len = map(brightness, 0, 255, strokeLength, strokeLength/2);
        
        // Add some randomness to stroke angle
        let angle = random(-angleVariation, angleVariation);
        
        // Calculate end points of the stroke
        let x1 = x + cos(angle) * len/2;
        let y1 = y + sin(angle) * len/2;
        let x2 = x - cos(angle) * len/2;
        let y2 = y - sin(angle) * len/2;
        
        line(x1, y1, x2, y2);
      }
    }
  }
  
  noLoop();
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('sketch-image', 'png');
  }
}