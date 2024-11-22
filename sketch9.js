let capture;
let strokeLength = 6;
let spacing = 6;
let angleVariation = 0;
let isCapturing = true;

function setup() {

  angleVariation = PI/8;

  createCanvas(640, 480);
  // Initialize webcam capture
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide(); // Hide the original video feed
  background(255);
  stroke(0);
  strokeWeight(1);
  noFill();
}

function draw() {
  if (isCapturing) {
    background(255);
    
    // Load the current frame
    capture.loadPixels();
    
    for (let x = spacing; x < capture.width - spacing; x += spacing) {
      for (let y = spacing; y < capture.height - spacing; y += spacing) {
        // Calculate gradient
        let gradX = getGradientX(x, y);
        let gradY = getGradientY(x, y);
        
        // Get brightness
        let index = (x + y * capture.width) * 4;
        let r = capture.pixels[index];
        let g = capture.pixels[index + 1];
        let b = capture.pixels[index + 2];
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
          
          // Vary stroke weight based on brightness
          let weight = map(brightness, 0, 255, 2, 0.5);
          strokeWeight(weight);
          
          // Draw curved stroke
          beginShape();
          let steps = 4;
          for(let i = 0; i <= steps; i++) {
            let t = i/steps;
            let cx = lerp(x1, x2, t);
            let cy = lerp(y1, y2, t);
            // Add some perpendicular displacement
            let perpX = sin(angle) * random(-1, 1);
            let perpY = -cos(angle) * random(-1, 1);
            vertex(cx + perpX, cy + perpY);
          }
          endShape();
        }
      }
    }
  }
}

// Calculate x gradient at a point
function getGradientX(x, y) {
  let index = (x + y * capture.width) * 4;
  let right = brightness(
    capture.pixels[index + 4],
    capture.pixels[index + 5],
    capture.pixels[index + 6]
  );
  let left = brightness(
    capture.pixels[index - 4],
    capture.pixels[index - 3],
    capture.pixels[index - 2]
  );
  return right - left;
}

// Calculate y gradient at a point
function getGradientY(x, y) {  // Corrected function name
  let index = (x + y * capture.width) * 4;
  let below = brightness(
    capture.pixels[index + (capture.width * 4)],
    capture.pixels[index + (capture.width * 4) + 1],
    capture.pixels[index + (capture.width * 4) + 2]
  );
  let above = brightness(
    capture.pixels[index - (capture.width * 4)],
    capture.pixels[index - (capture.width * 4) + 1],
    capture.pixels[index - (capture.width * 4) + 2]
  );
  return below - above;
}

// Add controls to pause/play and save
function keyPressed() {
  if (key === ' ') {
    // Space bar toggles capture
    isCapturing = !isCapturing;
  } else if (key === 's' || key === 'S') {
    // S key saves the canvas
    saveCanvas('webcam-sketch', 'png');
  }
}