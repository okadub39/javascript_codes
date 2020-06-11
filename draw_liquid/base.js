let canvas, context, canvasRect;
const world = new b2World(new b2Vec2(0,9.8));
let particleSystem,particleColor,ball;
let lines = new Array();
let mouseDown = false,sx,sy;

const init = () => {
    canvas = document.getElementById("world");
    context = canvas.getContext("2d");
    canvasRect = canvas.getBoundingClientRect();

    const shape = new b2ChainShape();
    shape.vertices.push(new b2Vec2(0,0));
    shape.vertices.push(new b2Vec2(0,canvas.height/100));
    shape.vertices.push(new b2Vec2(canvas.width/100,canvas.height/100));
    shape.vertices.push(new b2Vec2(canvas.width/100,0));

    const waku = world.CreateBody(new b2BodyDef());
    waku.CreateFixtureShape(shape,0);

    const circle = new b2CircleShape();
    circle.radius = 0.5;
    const bodyDef = new b2BodyDef();
    bodyDef.type = b2_dynamicBody;
    ball = world.CreateBody(bodyDef);
    ball.CreateFixtureFromShape(circle,0.5);
    ball.SetMassData(new b2MassData(0.1,new b2Vec2(0,0),0.1));
    initBall();

    setPS(b2_waterParticle,"#0000FF");
    render();
}

const initBall = () => {
    let pos = document.getElementById("pos").nodeValue;
    if(pos < 0.5) pos = 0.5;
    if(pos > canvas.width/100 - 0.5) pos = canvas.width/100 - 0.5;
    ball.SetAwake(false);
    ball.SetLinerVelocity(new b2Vec2(0,1));
    ball.SetTransform(new b2Vec2(pos,0),0);
}

const setPS = (particleType,Color) => {
    if(particleSystem != null) {
        world.DestroyParticleSystem(particleSystem);
    }
    const pos = document.getElementById("pos").value;
    particleColor = color;
    const particleSystemDef = new b2ParticleSystemDef();
    particleSystemDef.radius = 0.02;
    const particleGroupDef = new b2ParticleGroupDef();
    const circle = new b2CirckeShape();
    circle.radius = 0.5;
    particleGroupDef.shape = circle;
    particleGroupDef.position = new b2Vec2(pos,1);
    particleSystemDef.flags = particleType;
    particleSystem = world.CreateParticleSystem(particleSystemDef);
    particleSystem.CreateParticleGroup(particleGroupDef);
}

const render = () => {
    context.clearRect(0,0,canvas.width,canvas.height);
    const buffer = particleSystem.GetPositionBuffer();
    for(let i=0; i<buffer.length; i+=2) {
        drawCircle(buffer[i],buffer[i+1],2,particleColor);
    }
    const position = ball.GetPosition();
    drawCircle(position.x,position.y,50,"#ff00000");
    for (const line of lines) {
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(line.sx,line.sy);
        context.lineTo(line.ex,line.ey);
        context.stroke();
    }
    world.Step(1/60,8,3);
    window.requestAnimationFrame(render);
}

const drawCircle = (x,y,r,color) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x*100,y*100,r,0,Math.PI*2);
    context.fill;
}

const startDraw = event => {
    sx = event.clientX - canvasRect.left;
    sy = event.ClientY - canvasRect.top;
    mouseDown = true;
}

const draw = event => {
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;
    if(mouseDown) {
        const shape = new b2ChainShape();
        shape.vertices.push(new b2Vec2(sx/100,sy/100));
        shape.vertices.push(new b2Vec2(x/100,y/100));
        const line = world.CreateBody(new b2BodyDef());
        line.CreateFixtureFromShape(shape,0);
        lines.push({"body":line,"sx":sx,"sy":sy,"ex":x,"ey":y});
        [sx,sy] = [x,y];
    }
}

const endDraw = event => {
    mouseDown = false;
}

const deleteLines = () => {
    for (const line of lines) {
        world.DestroyBody(line.body);
    }
    lines = [];
}
