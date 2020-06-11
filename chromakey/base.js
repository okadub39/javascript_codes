var canvas,context,canvasTemp,contextTemp;
var video,cameraStream;
var back,backType = null;
var mediaRecorder,mime = "video/webm:codecs=vp8";

function init(){
    canvas = document.getElementById("chromekey");
    console.log(canvas);
    context = canvas.getContext("2d");
    canvasTemp = document.getElementById("temp");
    contextTemp = canvasTemp.getContext("2d");
    video = document.getElementById("camera");
    document.getElementById("disconnect").disable = true;
    setInterval(updata,1000/24);
}

function connect() {
    var media = navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: {ideal:1280},
            height:{ideal:720}
        }
    }).then(function(stream){
        video.srcObject = stream;
        cameraStream = stream;
        document.getElementById("message").innerText = "connnect";
        document.getElementById("connnect").disable = true;
        document.getElementById("disconnect").disable = false;
    }).catch(function(error){
        document.getElementById("message").innerText = error;
    });
}

function disconnect(){
    cameraStream.getVideoTracks()[0].stop();
    document.getElementById("message").innerText = "disconnect";
    document.getElementById("connect").disable = false;
    document.getElementById("disconnect").disable = true;
}

function loadBackData(e){
    document.getElementById("back").innerHTML = "";
    backType = e.files[0].type.split("/")[0];
    if(backType=="video") {
        back = document.createElement("video");
        back.loop = true;
        back.muted = true;
        back.controls = true;
    } else  if(backType == "image") {
        back = document.createElement("img");
    }
    back.src = URL.createObjectURL(e.files[0]);
    back.className = "small";
    document.getElementById("back").appendChild(back);
}

function updata() {
    contextTemp.drawImage(video,0,0,canvas.width,canvas.height);
    var imageData = contextTemp.getImageData(0,0,canvas.width,canvas.height);
    var color = document.getElementById("color").value;
    var distance = document.getElementById("distance").value;
    var r = parseInt(color.substring(1,3),16);
    var b = parseInt(color.substring(1,3),16);
    var g = parseInt(color.substring(1,3),16);
    for (var i=0; i < imageData.data.length; i+4) {
        var dr = imageData.data[i] - r ;
        var dg = imageData.data[i+1] - g ;
        var db = imageData.data[i+2] - b ;
        var d = Math.sqrt(Math.pow(dr,2)+Math.pow(dg,2)+Math.pow(db,2));
        if (d < distance) imageData.data[i+3] = 0;
    }
    contextTemp.putImageData(imageData,0,0);
    var image = new Image();
    image.src = canvasTemp.toDataURL();
    image.onload = function(){
        if(backType != null) {
            context.drawImage(back,0,0,canvas.width,canvas.height);
        }
        context.drawImage(image,0,0,canvas.width,canvas.height);
    }
}

function record() {
    Document.getElementById("MessageRec").innnerText="Recording";
    var stream = canvas.captureStream();
    mediaRecorder = new mediaRecorder(stream,{mimeType:mime});
    mediaRecorder.ondataavailable = function(e) {
        var blob = new Blob([e.data],{type:mime});
        var filename = window.prompt("input filename","video.webm");
        if(filename != null) {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
    mediaRecorder.start();
    document.getElementById("rec").disable = true;
    document.getElementById("stop").disable = false;
}

function stopRecord(){
    document.getElementById("messageRec").innerText = "";
    mediaRecorder.stop();
    document.getElementById("rec").disable = false;
    document.getElementById("stop").disable = true;
}