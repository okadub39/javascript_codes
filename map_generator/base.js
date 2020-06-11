var permutation = new Array(256);
var p = new Array(512);
var canvas,context;
var z;
var mapData;

function initNoise() {
    for (var i=0; i < 256; i++) permutation[i] = i;
    for (var i=255; i>0; i--) {
        var j = Math.floor(Math.random()*i);
        var temp = permutation[i];
        permutation[i]=permutation[j];
        permutation[j]=temp;
    }
    p = permutation.concat(permutation);
}

function noise(x,y,z) {
    var xi = Math.floor(x);
    var yi = Math.floor(y);
    var zi = Math.floor(z);
    var xf = x - xi;
    var yf = y - yi;
    var zf = z - zi;
    xi &=255;
    yi &=255;
    zi &=255;
    var u  = fade(xf);
    var v  = fade(yf);
    var w  = fade(zf);
    var A  = p[xi]+yi;
    var AA = p[A]+zi;
    var AB = p[A+1]+zi;
    var B  = p[xi+1]+yi;
    var BA = p[B]+zi;
    var BB = p[B+1] + zi;

    var a,b,a1,b1;
    a1 = lerp(u,grad(p[AA],xf,yf,zf),grad(p[BA],xf-1,yf,zf));
    b1 = lerp(u,grad(p[AB],xf,yf-1,zf),grad(p[BB],xf-1,yf-1,zf));
    a  = lerp(v,a1,b1);
    a1 = lerp(u,grad(p[AA+1],xf,yf,zf-1),grad(p[BA+1],xf-1,yf,zf-1));
    b1 = lerp(u,grad(p[AB+1],xf,yf-1,zf-1),grad(p[BB+1],xf-1,yf-1,zf-1));
    b  = lerp(v,a1,b1);
    return lerp(w,a,b);
}

function fade(t) {
    return t * t * t * (t *(t * 6 - 15) +10);
}

function lerp(t,a,b) {
    return a + t * (b - a);
}

function grad(hash,x,y,z) {
    var h = hash & 15;
    var u = y;
    if(h < 8) u = x;
    var v = z;
    if(h < 4) {
        v = y;
    } else if((h==12)||(h==14)) {
        v = x;
    }
    if(((h&1)==0)&&((h&2)==0)){
        return u + v;
    } else if((h&1)==0){
        return u -v;
    } else if((h&2)==0){
        return -u + v;
    } else {
        return -u - v;
    }
}

function init(){
    initNoise();
    canvas = document.getElementById("map");
    context = canvas.getContext("2d");
    newMap();
}

function newMap() {
    z=Math.random()*10;
    draw();
}

function draw() {

    var size = 10;
    if(document.getElementById("size_20").checked) size = 20;
    if(document.getElementById("size_40").checked) size = 40;
    var color = [];
    for (var i = 0; i < 8; i++) {
        color[i] = document.getElementById("color_"+i).value;
    }

    var map = [];
    var index = 0;
    for (var y=0; y<canvas.height; y+=size) {
        for(var x=0; x<canvas.width; x+=size) {

            var h = Math.floor((noise(x/(size*10),y/(size*10),z)+1)*4);
            map[index]=h;
            index++;
            context.fillStyle = color[h];
            context.strokeStyle = "#999999";
            context.beginPath();
            context.rect(x,y,size,size);
            context.fill();
            context.stroke;
        }
    }
    mapData = {
        "width":canvas.width/size,
        "height":canvas.height/size,
        "color":color,
        "map":map
    };
}

function saveMap() {
    mapDataString = JSON.stringify(mapData);
    var blob = new Blob([mapDataString],{type:"text/plain"});
    var filename = window.prompt("ファイル名を入力してください。","map.json");
    if(filename != null) {
        if(window.navigator.msSaveBlob){
            window.navigator.msSaveBlob(blob,filename);
        } else {
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }
}




