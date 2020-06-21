let canvas,context;
let image = new Image();
let cells = new Array();
let imageData,newData;
let y,size,request;

const init = () => {
    canvas = document.getElementById("glass");
    context = canvas.getContext("2d");
    initCanvas();
}

const initCanvas = () => {
    context.fillstyle = "#000000";
    context.fillRect(0,0,canvas.width,canvas.height);
}

const loadImage = files => {
    if(files.length > 0) {
        image.src = URL.createObjectURL(files[0]);
        image.onload = () => drawImage();
    } else {
        image = new Image();
        initCanvas();
    }
}

const drawImage = () => {
    initCanvas();
    const [sw,sh] = [image.width,image.height];
    let [dx,dy,dw,dh] = [0,0,canvas.width,canvas.height];
    if(image.width > image.height) {
        dh = dw * sh /sw;
        dy = (canvas.height - dh)/2;
    } else {
        dw = canvas.height * sw / sh;
        dx = (canvas.width - dw) / 2;
    }
    context.drawImage(image,0,0,sw,sh,dx,dy,dw,dh);
}

const startStained = () => {
    document.getElementById("progress").style.display = "block";
    disableButtons(true);
    drawImage();
    imageData = context.getImageData(0,0,canvas.width,canvas.height);
    newData   = context.createImageData(imageData);
    cells = [];
    size  = 20;
    if(document.getElementById("l").checked) size = 40;
    if(document.getElementById("s").checked) size = 10;
    for (let i = 0; i<imageData.width/size; i++) {
        for (let j = 0; j<imageData.height/size; j++){
            const x = Math.floor(i*size + Math.random()*size/3*2);
            const y = Math.floor(j*size + Math.random()*size/3*2);
            cells.push({"x":x,"y":y});
        }
    }
    y = 0;
    stained();
}

const disableButtons = disabled => {
    const buttons = document.getElementsByTagName("input");
    for (const button of buttons) {
        button.disabled = disabled;
    }
}

const stained = () => {
    const w = imageData.width;
    const line = document.getElementById("line").checked;
    for (let x = 0; x<w; x++) {
        const index = (y*w+x)*4;
        let minDistance = w;
        let r,g,b,a;
        for (const cell of cells) {
            const dx = Math.abs(x-cell.x);
            const dy = Math.abs(y-cell.y);
            if((dx < size * 2)&&(dy < size*2)) {
                const cIndex = (cell.y * w + cell.x)*4;
                const d = (dx ** 2 + dy ** 2) ** 0.5;
                if(d<minDistance) {
                    r = imageData.data[cIndex];
                    g = imageData.data[cIndex + 1];
                    b = imageData.data[cIndex + 2];
                    a = imageData.data[cIndex + 3];
                    if(minDistance - d < size/10 + 1) {
                        if(line)[r,g,b] = [0,0,0];
                    }
                    minDistance = d;
                }
            }
        }
        newData.data[index] = r;
        newData.data[index+1] = g;
        newData.data[index+2] = b;
        newData.data[index+3] = a;
    }
    y++;
    if(y<imageData.height) {
        document.getElementById("progress").value = y;
        request = window.requestAnimationFrame(stained);
    } else {
        window.cancelAnimationFrame(request);
        context.putImageData(newData,0,0);
        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        context.strokeRect(0,0,canvas.width,canvas.height);
        document.getElementById("progress").style.display = "none";
        disableButtons(false);
    }
}

const saveImage = () => {
    const filename = window.prompt("ファイル名を入力してください","image.png");
    if(filename != null) {
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}



