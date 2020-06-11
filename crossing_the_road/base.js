var player,message;
var y,dir,speed = 2;
var status = "move";
var life = 3;
var timer;

function init(){
    player = document.getElementById("player");
    message = document.getElementById("message");
}

function startGame() {
    y=0;
    dir=0;
    player.innerHTML = "&#x1f40a;"
    status = "move";
    message.innerText = "start!";
    timer = setInterval(update,20);
    document.getElementById("start").blur();
    document.getElementById("start").disabled = true;
}

function update() {
    y += dir * speed;
    if(y < 0) y = 0;
    player.style.top = y + "px";
    if(y > 350) status = "clear";
    for (var i = 0; i < 5; i++){
        if(collide("car"+i)) status = "dead";
    }
    document.getElementById("life").innerHTML = "";
    for (var j = 0; j < life; j++) {
        document.getElementById("life").innerHTML += "&#x1f40a;"
    }
    if(status == "dead") {
        player.innerHTML = "&#x1f4a5";
        clearInterval(timer);
        life--;
        if(life == -1) {
            message.innerText = "Game Over!";
            status = "end";
        } else {
            message.innerText = "MISS!";
            setTimeout(startGame,2000);
        }
    } else if (status == "clear") {
        message.innerText = "Clear!";
        status = "end";
    }
    if(status == "end") {
        clearInterval(timer);
        document.getElementById("start").disabled = false;
        life = 3;
    }
}

function collide(targetId){
    var style = window.getComputedStyle(player);
    var x = Number(style.left.replace("px",""));
    var w = Number(style.width.replace("px",""));
    var h = Number(style.height.replace("px",""));

    var target = document.getElementById(targetId);
    style = window.getComputedStyle(target);
    var targetX = Number(style.left.replace("px",""));
    var targetY = Number(style.top.replace("px",""));
    var targetW = Number(style.width.replace("px",""));
    var targetH = Number(style.height.replace("px",""));

    var ret = false;
    if((targetX < x + w/2)&&(x + w/2 < targetX + targetW)&&(targetY < y + h/2)&&(y + h/2 < targetY + targetH)) {
        ret = true;
    }
    return ret;
}

document.onkeydown = function(e) {
    if((e.key == "ArrowUp")||(e.key == "Up")) {
        dir = -1;
    } else if ((e.key =="ArrowDown")||(e.key == "Down")){
        dir = 1;
    }
}

document.onkeyup = function(e) {
    if((e.key == "ArrowUp")||(e.key == "Up")||(e.key == "ArrowDown")||(e.key == "Down")) {
        dir = 0;
    }
}
