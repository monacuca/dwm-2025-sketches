// By A. B. Fominaya 
// Adapted from Golan Levin's tutorial on GCODE from DWM course, 
// modified to generate Letters From My Mother by Vera Molnar
let bDoExportGCode = true; 
let gcodeData = [];
let marks = [];
const pxToMm = 25.4 / 96; // (25.4 mm/in) / (96 px/in)

function setup() {
  createCanvas(1056, 816); // 4" x 6"
  noLoop();
}

// Create Letters From My Mother by Vera Molnar
function makeMarks() {
  let nLines = 30; 
  let nSpikes = 150;
  let hCrazyFactor = 10;
  let wCrazyFactor = 10;
  let crazySpikesAfter = nSpikes;
  let nSkip = 20;
  
   for (let i=0; i<nLines; i++) {
    let y0 = map(i, 0, nLines-1, 50, height-50);
    let currentMark = [];
    for (let j=0; j< nSpikes; j++) {
      let x0 = map(j, 0, nSpikes-1, 50, width-50); 
      let x0_offset = random(8, 10);
      let y0_offset = random(5,12);
      if (j > crazySpikesAfter){
        x0_offset = x0_offset - random(0,1)*hCrazyFactor;
        y0_offset = y0_offset + random(0,1)*wCrazyFactor;
      }
      if (!(i == 0 && j < nSkip)){
      currentMark.push(createVector(x0 - x0_offset, y0 + y0_offset));
       x0_offset = random(8, 10);
       y0_offset = random(5, 12);
      if (j > crazySpikesAfter){
        x0_offset = x0_offset + random(0,1)*hCrazyFactor;
        y0_offset = y0_offset - random(0,1)*wCrazyFactor;
      }

      currentMark.push(createVector(x0 + x0_offset, y0 - y0_offset));
      }
    }
    marks.push(currentMark);
  }
}
//-----------------------
function draw(){
  strokeWeight(1);
  stroke(0);
  noFill();
  makeMarks();
  const feedRate = 5000; // mm/min
  const zHi = 25; 
  const zLo = 10; 
  
  if (bDoExportGCode){
    gcodeData = [];
    gcodeData.push("$H"); // Home the plotter - this is specific to Bantam
    gcodeData.push("G21"); // Tell the plotter to use millimeters
    gcodeData.push("G90"); // Use absolute coordinates, not relative
    gcodeData.push("G1 F" + feedRate); // Let's use a feed rate of 5000 mm/min
  }

  // Draw each of the stored marks
  for (let j=0; j<marks.length; j++){
    if (bDoExportGCode){
      gcodeData.push("(mark " + j + " )"); // add a GCode comment
      gcodeData.push("G1 Z" + zHi); // start with pen raised.
    }
    beginShape();
    for (let i=0; i<marks[j].length; i++){
      let px = marks[j][i].x;
      let py = marks[j][i].y; 
      let gx = nf(px * pxToMm,1,4); 
      let gy = nf((height-py) * pxToMm,1,4); 
      if (i==0){
        // Travel to the first point with the pen raised
        gcodeData.push("G1 X" + gx + " Y" + gy + " Z" + zHi);
      }
      gcodeData.push("G1 X" + gx + " Y" + gy + " Z" + zLo*random(0.75,1.25));
      vertex(px,py); 
    }
    gcodeData.push("G1 Z" + zHi); // raise pen at end
    endShape(); 
  }

  if (bDoExportGCode){
    // End exporting, if doing so
    gcodeData.push("$H"); // Re-home the plotter
    gcodeData.push("M2"); // End the GCode program
    let gcodeFilename = "gcode_recording_" + frameCount + ".gcode.txt";
    saveStrings (gcodeData, gcodeFilename);
    bDoExportGCode = false;
  }
  
  // Note: the currently active mark is not exported
  stroke(255,0,0, 80); 
}