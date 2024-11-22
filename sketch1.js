let img;
let dotSize = 5; // Size of each dot
let spacing = 5; // Space between sampling points

function preload() {
  // Load your image here
  img = loadImage("obama.jpg");
}

function setup() {
  createCanvas(800, 800);
  background(255);
  noStroke();
  fill(0);

  // Resize image to fit canvas while maintaining aspect ratio
  let aspectRatio = img.width / img.height;
  if (aspectRatio > 1) {
    img.resize(width, 0);
  } else {
    img.resize(0, height);
  }
}

function draw() {
  background(255);

  // Load pixel data
  img.loadPixels();

  // Loop through the image with spacing
  for (let x = 0; x < img.width; x += spacing) {
    for (let y = 0; y < img.height; y += spacing) {
      // Get pixel brightness at current position
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];

      // Calculate brightness (0-255)
      let brightness = (r + g + b) / 3;

      // Convert brightness to probability (darker = higher probability)
      let probability = 1 - brightness / 255;

      // Draw dot based on probability
      if (random() < probability) {
        // Calculate dot size based on brightness
        let size = map(brightness, 0, 255, dotSize, dotSize / 2);
        circle(x, y, size);
      }
    }
  }

  // Stop the draw loop since we only need to do this once
  noLoop();
}

// Optionally, add this to allow saving the result
function keyPressed() {
  if (key === "s" || key === "S") {
    saveCanvas("dotted-image", "png");
  }
}
