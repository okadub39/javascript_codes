let canvas,context,canvasRect;
let index,sx,sy,pos;
let mouseDown = false;
const left = new Array(4);
const right =  new Array(4);

const question = [
    ["Like A Rolling Stone","Bob Dylan"],
    ["(I Can't Get No) Satisfaction","The Rolling Stones"],
    ["Imagine","John Lennon"],
    ["What's Going On","Marvin Gaye"],
    ["Respect","Aretha Franklin"],
    ["Good Vibrations","The Beach Boys"],
    ["Johnny B. Goode","Chuck Berry"],
    ["Hey Jude","The Beatles"],
    ["Smells Like Teen Spirit","Nirvana"],
    ["What'd I Say","Ray Charles"],
    ["My Generation","The Who"],
    ["A Change Is Gonna Come","Sam Cooke"],
    ["London Calling","The Clash"],
    ["Purple Haze","The Jimi Hendrix Experience"],
    ["Hound Dog","Elvis Presley"],
    ["Born To Run","Bruce Springsteen"],
    ["Be My Baby","The Ronettes"],
    ["People Get Ready","The Impressions"],
    ["(Sittin' on) the Dock of the Bay","Otis Redding"],
    ["Layla","Derek and the Dominos"]
];
const init = () => {
    console.log("test");
    canvas = document.getElementById("sheet");
    context = canvas.getContext("2d");
    canvasRect = canvas.getBoundingClientRect();
    startQuestion();
}
const startQuestion = () => {
    index = 0;
    for (let i = question.length-1; i>0; i--) {
        const j = Math.floor(Math.random()*i);
        [question[i],question[j]]=[question[j],question[i]];
    }
    setQuestion();
}

const setQuestion = () => {
    for(let i = 0; i<4; i++) {
        left[i] = {
            "id":i,"text":question[index+i][0],"right":-1
        };
        right[i] = {
            "id":i,"text":question[index+i][1]
        };
    }
    for (let i=3; i>0;i--){
        const j = Math.floor(Math.random()*i);
        [left[i],left[j]] =  [left[j],left[i]];
        const k = Math.floor(Math.random()*i);
        [right[i],right[k]] = [right[k],right[i]];
    }
    document.getElementById("next").disabled = true;
    drawQuestion();
}

const drawQuestion = (color = "#000000") => {
    console.log(color);
    context.clearRect(0,0,canvas.width,canvas.height);
    cnt = 0;
    for (let i = 0; i < 4; i++) {
        drawText(left[i].text,280,60*i+60,"right","#000000");
        drawText(right[i].text,520,60*i+60,"left","#000000");
        drawPoint(300,60*i+60,color);
        drawPoint(500,60*i+60,color)
        if(left[i].right > -1){
            drawLine(300,60*i+60,500,60*left[i].right+60,color);
            if(left[i].id == right[left[i].right].id) cnt++;
        }
    }
    console.log(cnt);
}

const checkAnswer = () => {
    console.log(cnt);
    if(cnt == 4) {
        console.log("正解");
        drawQuestion("#00CC00");
        document.getElementById("next").disabled = false;
        drawText("◯ OK",400,20,"center","#ff0000");
        index += 4;
        if (question.length - index < 4){
            document.getElementById("next").disabled = true;
            drawText("end",400,350,"center","#0000FF");
        }
    } else {
        drawQuestion("#ff0000");
        drawText("× NG",400,20,"center","#0000ff");
    }
}

const startDraw = event => {
    const x =event.clientX - canvasRect.left;
    const y =event.clientY - canvasRect.top;
    for (let i=0; i < 4; i++){
        const d = ((300 - x )** 2 + (60 * i + 60 - y)**2) ** 0.5;
        if (d < 20) {
            [sx,sy,pos] = [300,60*i+60,i];
            left[i].right = -1;
            mouseDown = true;
            break;
        }
    }
}

const draw = event => {
    if(mouseDown) {
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        drawQuestion();
        drawLine(sx,sy,x,y,"#9999cc");
        drawPoint(x,y,"#9999cc");
    }
}

const endDraw = event => {
    if(mouseDown) {
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        for (let i=0; i < 4; i++){
            const d = ((500 - x )** 2 + (60 * i + 60 - y)**2) ** 0.5;
            if (d < 20) {
                left[pos].right = i;
                drawQuestion();
                mouseDown = false;
                break;
            }
        }
    }
}

const drawText = (text,x,y,align,color) => {
    context.fillStyle = color;
    context.font = "14px sans-serif";
    context.textAlign = align;
    context.textBaseline = "middle";
    context.fillText(text,x,y);
}

const drawPoint = (x,y,color) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x,y,10,0,Math.PI*2);
    context.fill();
}

const drawLine = (x1,y1,x2,y2,color) => {
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
}
