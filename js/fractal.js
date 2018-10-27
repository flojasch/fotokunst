
var pix=[];
var iterations;
var dilatx=[];
var dilaty=[];
var angle=[];
var tx=[];
var ty=[];
var farb=[];
var eck=[];
var tnum=0;
var abbnum;
var showsquares=true;
var locked=false;
var xOffset, yOffset, txoff, tyoff;
var breite;
var xversch, yversch;
var maxiterSlider;
var saveButton, selact;
var lines;
var img1,img2;
var filenumber;

function preload(){
	lines=loadStrings('Baum.txt');
}

function setup()
{
  var c=createCanvas(1040,580);
  c.position(300, 50);
  c.drop(gotFile);
  pixelDensity(1);
  for (j = 0; j < width*height; j++)
     for(l=0;l<4;++l)
       if(l==0)
         pix[4*j+l]=0;
       else
         pix[4*j+l]=100;
  drawpix();
  maxiterSlider=createSlider(0, 50, 0);
  maxiterSlider.position(20, 100);
  var itertxt=createDiv('Wiederholungen');
  itertxt.position(20, 80);

  var radiotxt=createDiv('Wirkung des Mausrades:')
  radiotxt.position(20, 180);
  selact=createSelect();
  selact.position(20,210);
  selact.option('drehen');
  selact.option('vergrößern');
  selact.option('strecken');
  textAlign(CENTER);

  saveButton = createButton('Bild speichern');
  saveButton.position(20, 450);
  saveButton.mousePressed(Save);

  loadValues(lines);
  iterations=0;
  filenumber=0;
}

function Save(){
save('baumbild.jpg');
	}

function gotFile(file){
   if(filenumber==0){
     img1 = createImg(file.data);
     img1.hide();
     image(img1,0,0,width,height);
     filenumber=1;
   }
   if(filenumber==1){
	 img2 = createImg(file.data);
     img2.hide();
     image(img2,0,0,width,height);
     loadPixels();
     for (j = 0; j < 4*width*height; j++)
       pix[j]=pixels[j];
     image(img1,0,0,width,height);
     maxiter=1;
   }
     iterations=0;

}

function loadValues(lines){
  for (var i=0; i<lines.length; i++) {
    if (i==0) {
      breite=float(split(lines[i], ' '))[0];
      xversch=float(split(lines[i], ' '))[1];
      yversch=float(split(lines[i], ' '))[2];
      colorgrad=float(split(lines[i], ' '))[3];
    } else {
      angle[i-1] = float(split(lines[i], ' '))[0];
      dilatx[i-1] = float(split(lines[i], ' '))[1];
      dilaty[i-1] = float(split(lines[i], ' '))[2];
      tx[i-1] = float(split(lines[i], ' '))[3];
      ty[i-1] = float(split(lines[i], ' '))[4];
      farb[i-1] = float(split(lines[i], ' '))[5];
    }
  }
  abbnum=lines.length-1;

}


function addTransform() {
  abbnum += 1;
  tnum=abbnum-1;
  angle[tnum]=0;
  dilatx[tnum]=0.5;
  dilaty[tnum]=0.5;
  tx[tnum]=0;
  ty[tnum]=0;
  farb[tnum]=0;
  maxiter=1;
  reset();
}

function rmTransform() {
  if (abbnum>0) {
	angle[tnum]=angle[abbnum-1];
  dilatx[tnum]=dilatx[abbnum-1];
  dilaty[tnum]=dilaty[abbnum-1];
  tx[tnum]=tx[abbnum-1];
  ty[tnum]=ty[abbnum-1];
  farb[tnum]=farb[abbnum-1];
    abbnum -= 1;
  }
  reset();
}


function mouseWheel(event)
{

  var zoom = 1.05;
  if (event.delta < 0) {
    zoom = 0.95;
  }


  if (selact.value()=='vergrößern') {
    dilatx[tnum] *=zoom;
    dilaty[tnum] *=zoom;
  }
  else if (selact.value()=='strecken') {
    dilaty[tnum] *=zoom;
  }
  else if (selact.value()=='drehen') {
    angle[tnum]+=(zoom-1)*20;
  }
  else{
    dilatx[tnum] *=zoom;
    dilaty[tnum] *=zoom;
  }
  reset();
  return false;
}

function mousePressed() {
  if (0 < mouseX && mouseX < width && 0 < mouseY && mouseY <height) {
    xOffset = mouseX;
    yOffset = mouseY;
    txoff=tx[tnum];
    tyoff=ty[tnum];
    locked=true;
  }
}

function mouseDragged() {
  if (locked) {
    tx[tnum] = txoff+(mouseX-xOffset)*breite/width;
    ty[tnum] = tyoff-(mouseY-yOffset)*breite/width;
    reset();
  }
}

function mouseReleased() {
  if (locked) {
    locked=false;
    reset();
  }
}

function draw()
{
  var x, y, dist, disti, i;
  var maxiter=maxiterSlider.value();
  var j = height/2*width+width/2;


 if (!locked) {
	i=tnum;
    x=transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i])%width;
    y=transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i])/width;
    dist=(mouseX-x)*(mouseX-x)+(mouseY-y)*(mouseY-y);
    for (i=0; i < abbnum; i++) {
      x=transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i])%width;
      y=transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i])/width;
      disti=(mouseX-x)*(mouseX-x)+(mouseY-y)*(mouseY-y);
      if (disti < dist) {
        tnum=i;
        dist=disti;
      }
    }
  }

  if (iterations < maxiter || locked) {
    iterations++;
    abbildung();
  }

  drawpix();

}

function reset() {
  image(img2,0,0,width,height);
  loadPixels();
   for (j = 0; j < 4*width*height; j++)
    pix[j]=pixels[j];
  image(img1,0,0,width,height);
   iterations=0;
}

function drawpix() {
loadPixels();
	for (j = 0; j < width*height; j++) {
	  var color=pix[4*j+1]+pix[4*j+2]+pix[4*j+3];
        for(l=0;l<4;l++)
          if(color < 735)
            pixels[4*j+l]=pix[4*j+l];
		}
updatePixels();
}

function abbildung() {
  var j, hpix=[],l;
  for (j = 0; j < 4*width*height; j++)
    hpix[j]=pix[j];
  for (j = 0; j < width*height; j++) {
	  var color=hpix[4*j+1]+hpix[4*j+2]+hpix[4*j+3];
      for (var i=0; i<abbnum; i++)
        for(l=0;l<4;l++)
          if(color < 740)
            pix[4*transform(j, angle[i], dilatx[i], dilaty[i], tx[i], ty[i])+l]=hpix[4*j+l];

  }

}

function transform(j, winkel, streckx, strecky, xverschiebung, yverschiebung) {
  var x, y;
  var xh, yh, xhh;
  xh=(j%width*1.0/width-xversch)*breite;
  yh=((1-yversch)*height-j/width)*breite/width;
  xh=xh*streckx;
  yh=yh*strecky;

  xhh=xh;
  xh = xh*cos(PI/180*winkel) - yh*sin(PI/180*winkel);
  yh = yh*cos(PI/180*winkel) + xhh*sin(PI/180*winkel);

  xh+=xverschiebung;
  yh+=yverschiebung;

  x=floor(width*(xh/breite+xversch));
  y=floor(height*(1-yversch)-width*yh/breite);

  if (0 <= x && x < width && 0 <= y && y < height)
    return width*y+x;
  else
    return 0;
}
