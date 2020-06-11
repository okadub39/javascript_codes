let mapCanvas,mapContext;
let playCanvas,playContext;
const mapImage = new Image();
const blocks = new Array();
const blockSize = 50;
const ballRadius = 10;

let sx,sy,x,y,vx,vy;
let gAngle = Math.PI/2;
let startTime,timer;

const map = [
    "##### #########",
    "# S  #        #",
    "#   #   #  #  #",
    "#   #  #   #  #",
    "#     #   #   #",
    "#  #  #  #    #",
    "#  #  #  #    #",
    "#  # #######  #",
    "#          #GG#",
    "###############"
];

class Block {
    constructor(x,y,type,color){
        this.x = (x + 0.5) * blockSize;
        this.y = (y + 0.5) * blockSize;
        this.type = type;
        this.color = color;
        const[x1,y1] = [this.x - blockSize/2,this.y - blockSize/2];
        mapContext.strokeStyle = "black";
        mapContext.fillStyle = this.color;
        mapContext.fillRect(x1,y1,blockSize,blockSize);
        mapContext.strokeRect(x1,y1,blockSize,blockSize);
    }
}

const init = () => {
    mapCanvas = document.getElementById("map");
    mapContext = mapCanvas.getContext("2d");
    playCanvas = document.getElementById("play");
    playContext = playCanvas.getContext("2d");
    for (let i=0; i <map.length; i++) {
        for (let j=0; j<map[i].length; j++){
            const char = map[i].charAt(j);
            if(char=="#"){
                blocks.push(new Block(j,i,"normal","green"));
            } else if(char=="S") {
                sx = (j+0.5)*blockSize;
                sy = (i+0.5)*blockSize;
                [x,y] = [sx,sy];
            } else if(char == "G"){
                blocks.push(new Block(j,i,"goal","blue"));
            }
        }
    }
    console.log(mapImage);
    mapImage.src = mapCanvas.toDataURL();
    mapImage.onload = () => {draw();}
    document.addEventListener("keydown",rotate);
}

const startGame = () => {
    [x,y,vx,vy,gAngle] = [sx,sy,0,0,Math.PI/2];
    startTime = Date.now();
    if(timer != null) clearInterval(timer);
    timer = setInterval(update,100);
}

const update = () => {
    vx += Math.cos(gAngle);
    vy += Math.sin(gAngle);
    const speed = (vx ** 2 + vy **2) ** 0.5;
    if(speed >= ballRadius) {
        vx *= ballRadius / speed;
        vy *= ballRadius / speed;
    }
    x += vx;
    y += vy;

    let checkGoal = false;
    const [r1,r2] = [ballRadius,blockSize /2];
    for (const block of blocks) {
        const[dx,dy] = [x - block.x,y - block.y];
        if ((Math.abs(dy) < r1 + r2)&&(Math.abs(dx) <= r2 )) {
            vy *= -1;
            if(Math.abs(vy)>2) vy *=0.5;
            y = block.y + Math.sign(dy) * (r1+r2);
            if(block.type == "goal") checkGoal = true;
        }
        if ((Math.abs(dx) < r1 + r2)&&(Math.abs(dy) <= r2 )) {
            vx *= -1;
            if(Math.abs(vx)>2) vx *=0.5;
            x = block.x + Math.sign(dx) * (r1+r2);
            if(block.type == "goal") checkGoal = true;
        }
    }
    draw();
    const time = ((Date.now() - startTime)/1000).toFixed(1)
    document.getElementById("time").innerText = `TIME:${time}`;
    if(checkGoal){
        clearInterval(timer);
        timer = null;
        playContext.font = "bold 100px sans-serif";
        playContext.textAlign = "center";
        playContext.textBaseline = "middle";
        playContext.fillStyle = "red";
        playContext.fillText("GOOD!!",250,250);
    }
}

const draw = () => {
    const [cx,cy] = [playCanvas.width / 2,playCanvas.height/2];
    playContext.clearRect(0,0,playCanvas.width,playCanvas.height);
    playContext.save();
    playContext.translate(cx,cy);
    playContext.rotate(Math.PI/2 - gAngle);
    const w = playCanvas.width * Math.sqrt(2);
    playContext.drawImage(mapImage,x - w/2,y - w/2,w,w,-w/2,-w/2,w,w);
    playContext.restore();

    const r = ballRadius;
    playContext.fillStyle = "yellow";
    playContext.beginPath();
    playContext.arc(cx,cy,r,0,Math.PI*2);
    playContext.fill();
    playContext.fillStyle = "white";
    playContext.beginPath();
    playContext.arc(cx - r/3,cy - r/3, r/3,0,Math.PI*2);
    playContext.fill();
}

const rotate = event => {
    if(event.key == "ArrowRight") gAngle += 0.1;
    if(event.key == "ArrowLeft") gAngle -= 0.1;
}
