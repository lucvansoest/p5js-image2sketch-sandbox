let img;
let dotSize = 8;
let spacing = 8;

function preload() {
  img = loadImage('obama.jpg');
}

function setup() {
  createCanvas(800, 800);
  background(255);
  noStroke();
  fill(0);
  
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
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      
      let brightness = (r + g + b) / 3;
      
      // Map dot size directly to brightness
      let size = map(brightness, 0, 255, dotSize, 0);
      
      if (size > 0) {
        let jitterAmount = 2;
        let jitterX = random(-jitterAmount, jitterAmount);
        let jitterY = random(-jitterAmount, jitterAmount);
        circle(x + jitterX, y + jitterY, size);
      }
    }
  }
  
  noLoop();
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('dotted-image', 'png');
  }
}