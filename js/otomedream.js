//variables
var NUM_SAMPLES = 256;
var adjustvalue = 0;
var SOUND_1 = '../media/muscledance.mp4';
var SOUND_2 = '../media/magesong.mp4';
var SOUND_3 = '../media/crazyforyou.mp4';
var audioElement;
var analyserNode;
var zoomin = false;
var heartsx = {};
var ctrlX = 10;
var ctrlY = 10;
var vectorx = 2.0;
var vectory = 8.5;
var speed = 1.1;
var textinput = "Welcome Babe of the Bishies";
var heartsy = {};
var arraycount =0;
var canvas,ctx, maxRadius,circleRadius,percent,barcolor;
var videoElement,w,h;
var invert = false, tintRainbow=true,noise=false,lines=false,brighten=false,makestar=false, bars=true, snow=false, waves = false, curves = false, waveform = false;
var heart;

$(document).ready(function() {
    "use strict";

    init();
});

function init(){

    // set up canvas stuff
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext("2d");
    
    
    //video element for the video
    videoElement = document.querySelector('video');
    w = videoElement.clientWidth;
    h = videoElement.clientHeight;
    HTMLCanvasElement.width = w;
    HTMLCanvasElement.height = h;
    
    //variables
    maxRadius=10;
    
    // get reference to <audio> element on page
    audioElement = document.querySelector('audio');
    
    // call our helper function and get an analyser node
    analyserNode = createWebAudioContextWithAnalyserNode(audioElement);
    
    // get sound track <select> and Full Screen button working
    setupUI();
    
    // start animation loop
    update();
}


function createWebAudioContextWithAnalyserNode(audioElement) {
    var audioCtx, analyserNode, sourceNode;
    // create new AudioContext
    audioCtx = new (window.AudioContext)
    
    audioCtx.crossOrigin = "anonymous";
    audioCtx.resume();
    
    // create an analyser node
    analyserNode = audioCtx.createAnalyser();
    
    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = NUM_SAMPLES;
    
    // this is where we hook up the <audio> element to the analyserNode
    sourceNode = audioCtx.createMediaElementSource(audioElement); 
    sourceNode.connect(analyserNode);
    
    // here we connect to the destination i.e. speakers
    analyserNode.connect(audioCtx.destination);
    return analyserNode;
}

function setupUI(){
    
    //heart image
    heart= document.getElementById("heart");
    
    //setting up buttons and things
    document.querySelector("#trackSelect").onchange = function(e){
        playStream(audioElement,e.target.value);
        document.getElementById("video").src=e.target.value;
    };
    
    document.querySelector("#slider1").onchange =function(e){
        document.querySelector("#sliderResults").innerHTML = e.target.value;  
        maxRadius = e.target.value;
    };
            
    document.querySelector("#myCheckboxInvert").onchange = function(e){
        if(e.target.checked){
            invert = true;
        }  
        else { invert = false;}
    };
    
    document.querySelector("#myCheckboxNoise").onchange = function(e){
        if(e.target.checked){
            noise = true;
        }  
        else { noise = false;}
    };
    
    document.querySelector("#myCheckboxLine").onchange = function(e){
        if(e.target.checked){
            lines = true;
        }  
        else { lines = false; }
    };
    
    document.querySelector("#waveform").onchange = function(e){
        if(e.target.checked){
            waveform = true;
        }  
        else { waveform = false; }
    };
    
    document.querySelector("#zoomin").onchange = function(e){
        if(e.target.checked){
            zoomin = true;
        }  
        else { zoomin = false; }
    };
    
    document.querySelector("#wave").onchange = function(e){
        if(e.target.checked){
            waves = true;
        }  
        else { waves = false; }
    };
    
    document.querySelector("#zoominslider").onchange =function(e){
        if(zoomin){
            ctx.scale(e.target.value,e.target.value);
        }
    };  
    
    document.querySelector("#bars").onchange = function(e){
        if(e.target.checked){
            bars=true;
        }
        else { bars=false; }
    };
    
    document.querySelector("#snow").onchange = function(e){
        if(e.target.checked){
            snow=true;
        }
        else { snow=false; }
    };
    
    document.querySelector("#curves").onchange = function(e){
        if(e.target.checked){
            curves=true;
        }
        else { curves=false; }
    };
    
    document.querySelector("#tintrainbow").onchange = function(e){
        if(e.target.checked){
            tintRainbow=true;
        }
        else { tintRainbow=false; }
    };
    
    document.querySelector("#text").onchange = function(e){
        textinput = e.target.value;
    };
}

function playStream(audioElement = "",path = ""){
    if(audioElement == "")
        {
            audioElement = document.querySelector('audio');
        }
    
    audioElement.src = path;
    audioElement.crossOrigin = "anonymous";
    audioElement.play();
    audioElement.volume = 1.0;
    document.querySelector('#status').innerHTML = "Movie Path: " + path;
    
    //play according video
    document.getElementById("video").src=path;
}

function update() { 
    // this schedules a call to the update() method in 1/60 seconds
    requestAnimationFrame(update);
    
    // create a new array of 8-bit integers (0-255)
    var data = new Uint8Array(NUM_SAMPLES/2); 
    
    // populate the array with the frequency data
    if(waveform) {analyserNode.getByteTimeDomainData(data); }
    
    else {analyserNode.getByteFrequencyData(data);}
    
    //clearing and setting settings for the audio visualizer part
    ctx.clearRect(0,0,1100,800);  
    var barWidth = 8;
    var barSpacing = 1;
    var barHeight = 400;
    var topSpacing = 700;
    var snowradius = 10;
    barcolor = makeColor(170,170,255,0.4);
    
    //onmousedown function so when you click, a heart appears
    canvas.onmousedown = doMouseDown;
    
    //manipulate the pixels to project cool things
    manipulatePixels();
    
    //filling the text
    ctx.font = "35px Georgia";
    ctx.fillText(textinput,canvas.width/3.2, canvas.height/4);
    
    //drawing the hearts on screen
    for(var i = 0; i < arraycount;i++)
        {
            ctx.drawImage(heart,heartsx[i],heartsy[i],90,90);
        }
    
    //waves
    if(waves)
    {
        ctx.save();
        ctx.strokeStyle = "rgb(100,100,255)";
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(0,900);
        for(var i=0;i<data.length;i++)
        {
            ctx.lineTo(0+i*10,-data[i]*1+900);     
        }
        ctx.stroke();
        ctx.restore();
    }
    
    //the curves
    if(curves)
        {
            ctrlX += speed * vectorx;
            ctrlY += speed * vectory;

            if(ctrlX >= canvas.width || ctrlX <=0){
                vectorx *=-1;
                ctrlX += speed * vectorx;
            }
            if(ctrlY >= canvas.height || ctrlY <=0){
                vectory *=-1;
                ctrlY += speed * vectory;
            }
            drawCurves();
        }
        
    //snow and bar effects
    if(snow || bars)
    {
        for(var i=0; i<data.length; i++) { 
            if(snow)
            {
                //making a random number
                var randomxvalueattopofscreen = Math.floor(Math.random() *canvas.width);
                
                var randomxvalueattopofscreen2 = Math.floor(Math.random() *canvas.width);
                
                //soft snow 
                percent = data[i]/255;
                circleRadius = percent*maxRadius;
                ctx.beginPath();
                ctx.fillStyle = makeColor(230,230,255,.20-percent/20.0);
                ctx.arc(randomxvalueattopofscreen, randomxvalueattopofscreen2+i, circleRadius*1.5,0,2*Math.PI, false);
                ctx.fill();
                ctx.closePath();

                //one color
                ctx.beginPath();
                ctx.fillStyle = makeColor(255,255,255,.5-percent/5.0);
                ctx.arc(randomxvalueattopofscreen,randomxvalueattopofscreen2+i,circleRadius *.50,0,2*Math.PI,false);
                ctx.fill();
                ctx.closePath();
                
            }
            
            //bars
            if(bars)
            {
                //making different bars on top and bottom
                ctx.fillStyle = barcolor;
                ctx.fillRect(i*(barWidth+barSpacing),topSpacing + 255
                                -data[i], barWidth,barHeight);
                ctx.fillRect(-i*(barWidth+barSpacing)+canvas.width,topSpacing + 255
                                -data[i], barWidth,barHeight);
                ctx.fillRect(i*(barWidth+barSpacing),-topSpacing + 255
                                +data[i], barWidth,barHeight);
                ctx.fillRect(-i*(barWidth+barSpacing)+canvas.width,-topSpacing + 255
                                +data[i], barWidth,barHeight);
                
            }          
        }
    }
    
    //rainbow tinted
    if(tintRainbow){
        ctx.save();
            var gradient = ctx.createLinearGradient(0,0,0,canvas.height);
            gradient.addColorStop(0,"red");
            gradient.addColorStop(0.2,"yellow");
            gradient.addColorStop(0.4,"green");
            gradient.addColorStop(0.6,"blue");
            gradient.addColorStop(1,"purple");
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.2;
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.restore();
    }
} 


//manipulating the pixels to do cool things
function manipulatePixels(){
ctx.drawImage(videoElement,0,0,1100,800);
ctx.drawImage(videoElement,0,0,1100,800);

//get rgba pixel data of canvas
var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);  
imageData.crossorigin = "Anonymous";
    
//imagedata is a 8 bit typed array from 0-255 and has 4 values per pixel. 
var data = imageData.data;
var length = data.length;
var width = imageData.width;

//iterate through eachpixel and we step by 4 so we can manipulate 1 pixel per iteration
for(var i = 0; i< length; i+=4){
    
    //invert style
    if(invert){
        var red = data[i], green = data[i+1], blue = data[i+2];
        data[i] = 255-red; //red
        data[i+1] = 255 - green; //green
        data [i+2] = 255-blue; //blue
    }
    
    //noise style
    if(noise && Math.random() < .10){
        data[i] = data[i+1] = data[i+2] = 128;//grey
        //data[i+3] = 255; //this is alpha, you can see thru blackareas. 
    }
    
    //linestyle
    if(lines){
        var row = Math.floor(i/4/canvas.width);
        if(row % 50 == 0){
            //this row
            data[i] = data[i+1] = data[i+2] = data[i+3] = 255;

            //next row
            data[i+(width*4)] = 
            data[i+(width*4)+1] =
            data[i+(width*4)+2] = 
            data[i+(width*4)+3] = 255;
        }
    }
}

//put modified data back on the canvas
ctx.putImageData(imageData, 0,0);

}
    

// HELPER
function makeColor(red, green, blue, alpha){
        var color='rgba('+red+','+green+','+blue+', '+alpha+')';
        return color;
}

//get location of mouse where the heart will be placed
function doMouseDown(e){
    var mouse = getMouse(e);
    heartsx[arraycount] = mouse.x-40;
    heartsy[arraycount] = mouse.y-40;
    arraycount++;
}

//get mouse data
function getMouse(e){
    var mouse = {};
    mouse.x = e.pageX - e.target.offsetLeft;
    mouse.y = e.pageY - e.target.offsetTop;
    return mouse;
}

//draw the curves
function drawCurves() {
    
    //variables and setting up
    ctx.lineWidth="10";
    ctx.strokeStyle = 'rgba(200,200,255,0.6)';
    var ctrlXa = 50;
    var ctrlYa = 300;
    
    //drawing the curves
    ctx.beginPath();
    ctx.moveTo(canvas.width/4, 0);
    ctx.quadraticCurveTo(ctrlX, ctrlY, canvas.width/4, canvas.height);
    ctx.stroke();

    //drawing the next curve
    ctx.strokeStyle = 'rgba(70,255,200,0.6)';
    ctx.beginPath();
    ctx.moveTo(canvas.width/4*3, 0);
    ctx.bezierCurveTo(ctrlX, ctrlY, ctrlXa, ctrlYa, canvas.width/4*3, canvas.height);
    ctx.stroke();
}

function removeHearts(){
    arraycount = 0;
}


