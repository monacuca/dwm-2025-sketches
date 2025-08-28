// By ABF, adapted loosely from PEmbroider sample code :-)
import processing.svg.*;
import processing.pdf.*;
import processing.embroider.*;
import java.util.concurrent.ThreadLocalRandom;
import java.lang.Float;
PEmbroiderGraphics E;


void setup() {
  noLoop(); 
  size (1075, 850);
  pixelDensity(1); // needed for Processing 4.4+

  E = new PEmbroiderGraphics(this, width, height);
  String outputFilePath = sketchPath("letters.pes");
  E.setPath(outputFilePath); 

  E.beginDraw(); 
  beginRecord(SVG, "out/letters.svg");
  E.clear();
  E.noFill(); 
  
 
  //-----------------------
  int nLines = 30; 
  int nSpikes = 150;
  float hCrazyFactor = 10;
  float wCrazyFactor = 10;
  int crazySpikesAfter = nSpikes;
  int nSkip = 20;

  // ----------------------
  E.strokeSpacing(2.0);
  E.setStitch(5, 35, 0.0);
  E.PARALLEL_RESAMPLING_OFFSET_FACTOR = 0.33;
  
  E.strokeMode(PEmbroiderGraphics.PERPENDICULAR); 
  
  E.beginRepeatEnd(2);
  E.strokeWeight(1); 
  
  for (int i=0; i<nLines; i++) {
    E.beginShape();
    float y0 = map(i, 0, nLines-1, 50, height-50);
    for (int j=0; j< nSpikes; j++) {
      float x0 = map(j, 0, nSpikes-1, 50, width-50); 
      float x0_offset = random(8, 10);
      float y0_offset = random(5,12);
      if (j > crazySpikesAfter){
        x0_offset = x0_offset - random(0,1)*hCrazyFactor;
        y0_offset = y0_offset + random(0,1)*wCrazyFactor;
      }
      if (!(i == 0 && j < nSkip)){
      E.vertex(x0 - x0_offset, y0 + y0_offset);
       x0_offset = random(8, 10);
       y0_offset = random(5, 12);
      if (j > crazySpikesAfter){
        x0_offset = x0_offset + random(0,1)*hCrazyFactor;
        y0_offset = y0_offset - random(0,1)*wCrazyFactor;
      }
      E.vertex(x0 + x0_offset, y0 - y0_offset);
      }
    }
    E.endShape();
  }
  
  E.endRepeatEnd();

  //-----------------------
  E.optimize();
  E.visualize(false,false,false);
  E.endDraw(); // Write out PES file
  endRecord();
  save("letters.png"); // For images
}
