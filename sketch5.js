let img;
let strokeLength = 8;
let spacing = 8;
let angleVariation = 0;

function preload() {
  img = loadImage('obama.jpg');
}

function setup() {
  createCanvas(800, 800);
  background(255);
  stroke(0);
  strokeWeight(1);
  noFill();

  angleVariation = PI/8;
  
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
  
  for (let x = spacing; x < img.width - spacing; x += spacing) {
    for (let y = spacing; y < img.height - spacing; y += spacing) {
      // Calculate gradient
      let gradX = getGradientX(x, y);
      let gradY = getGradientY(x, y);
      
      // Get brightness
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let brightness = (r + g + b) / 3;
      
      // Convert brightness to probability
      let probability = 1 - brightness / 255;
      
      if (random() < probability) {
        // Calculate base angle from gradient
        let angle = atan2(gradY, gradX);
        
        // Add some randomness to the angle
        angle += random(-angleVariation, angleVariation);
        
        // Calculate stroke length based on brightness
        let len = map(brightness, 0, 255, strokeLength, strokeLength/2);
        
        // Add some randomness to position
        let jitterAmount = spacing/4;
        let jitterX = random(-jitterAmount, jitterAmount);
        let jitterY = random(-jitterAmount, jitterAmount);
        
        // Calculate end points
        let x1 = x + jitterX + cos(angle) * len/2;
        let y1 = y + jitterY + sin(angle) * len/2;
        let x2 = x + jitterX - cos(angle) * len/2;
        let y2 = y + jitterY - sin(angle) * len/2;
        
        line(x1, y1, x2, y2);
      }
    }
  }
  
  noLoop();
}

// Calculate x gradient at a point
function getGradientX(x, y) {
  let index = (x + y * img.width) * 4;
  let right = brightness(
    img.pixels[index + 4],
    img.pixels[index + 5],
    img.pixels[index + 6]
  );
  let left = brightness(
    img.pixels[index - 4],
    img.pixels[index - 3],
    img.pixels[index - 2]
  );
  return right - left;
}

// Calculate y gradient at a point
function getGradientY(x, y) {
  let index = (x + y * img.width) * 4;
  let below = brightness(
    img.pixels[index + (img.width * 4)],
    img.pixels[index + (img.width * 4) + 1],
    img.pixels[index + (img.width * 4) + 2]
  );
  let above = brightness(
    img.pixels[index - (img.width * 4)],
    img.pixels[index - (img.width * 4) + 1],
    img.pixels[index - (img.width * 4) + 2]
  );
  return below - above;
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('sketch-image', 'png');
  }
}