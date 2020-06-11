var canvas,context;
var image = new Image();
var rotation,gpsPos,link;

function init() {
    canvas = document.getElementById("image");
    context = canvas.getContext("2d");
}

function loadImage(e){
    rotation = 0;
    document.getElementById("orientation").innerText = "--";
    document.getElementById("lat").innerText = "--";
    document.getElementById("lng").innerText = "--";
    document.getElementById("googleMap").src = "";
    console.log("1");
    var reader = new FileReader();
    reader.onload = function(){
        console.log("2");
        var data = new Uint8Array(reader.result);
        var exifData = "",order = "";
        if(toHex(data[12])=="4D") order = "B";
        if(toHex(data[12])=="49") order = "L";
        console.log(data[12]);
        var test = toHex(data[12]);
        console.log(test);
        console.log(order);
        gpsPos = "";
        if(order != "") readTag(data,20,order);
        if(gpsPos != "") readTag(data,12+gpsPos,order);
        image.src = URL.createObjectURL(e.files[0]);
        image.onload = drawImage;
    }
    reader.readAsArrayBuffer(e.files[0]);
}

function drawImage() {
    console.log("3");
    if(document.getElementById("rotate").checked) {
        drawRotateImage(rotation);
    } else {
        drawRotateImage(0);
    }
}

function drawRotateImage(angle) {
    console.log("4");
    var w = canvas.width, h =canvas.height;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.save();
    context.translate(w/2,h/2);
    context.rotate(angle);

    var dx,dy,dw,dh;
    if(image.width > image.height) {
        dw = canvas.width;
        dh = dw * image.height/image.width;
        dx = - canvas.width/2;
        dy = (canvas.height - dh)/2 - canvas.height/2;
    } else {
        dw = canvas.height * image.width / image.height;
        dh = canvas.height;
        dx = (canvas.width - dw)/2 - canvas.width/2;
        dy = 0 - canvas.height/2;
    }
    context.drawImage(image,0,0,image.width,image.height,dx,dy,dw,dh);
    context.restore();
}

function readTag(data,pos,order) {
    console.log("test");
    var num = data[pos]*256 + data[pos+1];
    if(order == "L") num = data[pos+1]*256 + data[pos+1];
    var field,allow ="--",lat="--",lng="--";
    for (var i = 0; i<num; i++){
        field = readField(data,pos+2+i*12,order);
        if(field.tag == "0112") {
            if(field.short == 1) {
                allow  = "↑";
                rotation = 0;
            } else if(field.short == 3) {
                allow  = "↓";
                rotation = Math.PI;
            } else if(field.short == 6) {
                allow = "←";
                rotation = Math.PI/2;
            } else if (field.short == 8) {
                allow = "→";
                rotation = Math.PI/2*3;
            }
            document.getElementById("orientation").innerText = allow;
        }
        if(field.tag == "8825") gpsPos = field.offset;
        if(field.tag == "0002") {
            lat = toDegree(data,field.offset+12,order);
            link = "http://www.google.co.jp/maps?output=embed&q" + lat;
            document.getElementById("lat").innerText = lat;
        }
        if(field.tag == "0004") {
            lng = toDegree(data,field.offset+12,order);
            document.getElementById("googleMap").src = link + "," + lng;
            document.getElementById("lng").innerText = lng;
        }
    }
}

function readField(data,pos,order) {
    var tag,offset,short;
    if(order == "B"){
        tag = toHex(data[pos]) + toHex(data[pos+1]);
        offset = toHex(data[pos+8]) + toHex(data[pos+9]) + toHex(data[pos+10]) + toHex(data[pos+11]);
        short = toHex(data[pos+8]) + toHex(data[pos+9]);
    } else {
        tag = toHex(data[pos+1]) + toHex(data[pos]);
        offset = toHex(data[pos+11]) + toHex(data[pos+10]) + toHex(data[pos+9]) + toHex(data[pos+8]);
        short = toHex(data[pos+9]) + toHex(data[pos+8]);
    }
    return{"tag":tag,"offset":parseInt(offset,16),"short":parseInt(short,16)};
}

function toHex(n) {
    if(!n  === undefined){
        console.log(n);
        temp = n.toString(16);
        temp = temp.slice(-2);
        temp = temp.toUpperCase();
        temp = "00"+temp;
        return temp;
    }
}

function toDegree(data,pos,order) {
    var degree = 0,v1,v2;
    for (var i =0; i<3; i++) {
        if(order == "B") {
            v1 = toHex(data[pos+i*8]) + toHex(data[pos+1+i*8]) + toHex(data[pos+2+i*8]) + toHex(data[pos+3+i*8]);
            v2 = toHex(data[pos+4+i*8]) + toHex(data[pos+5+i*8]) + toHex(data[pos+6+i*8]) + toHex(data[pos+7+i*8]);
        } else {
            v1 = toHex(data[pos+3+i*8]) + toHex(data[pos+2+i*8]) + toHex(data[pos+1+i*8]) + toHex(data[pos+i*8]);
            v2 = toHex(data[pos+3+i*8]) + toHex(data[pos+2+i*8]) + toHex(data[pos+1+i*8]) + toHex(data[pos+i*8]);
        }
        degree += (parseInt(v1,16)/parseInt(v2,16))/ Math.pow(60,i);
    }
    return degree;
}
