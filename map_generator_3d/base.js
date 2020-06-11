var width,height;
var scene,camera,renderer;
var mapData = {"width":40,"height":30,"color":["#0033cc","#0099ff","#009966","#339900","#336600","#cc9900","#996600","#993300"],"map":[2,2,2,2,2,3,4,5,5,5,5,5,5,5,5,4,4,4,3,3,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,4,4,4,2,2,2,2,2,3,4,5,5,5,5,5,5,5,5,4,4,4,3,3,3,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,4,4,4,2,2,2,2,2,3,4,4,5,5,5,5,5,5,5,4,4,4,3,3,3,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,4,4,4,3,2,2,2,2,3,3,4,4,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,5,5,5,5,4,4,4,4,3,3,3,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,3,3,2,2,2,2,3,3,3,3,3,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,5,5,5,4,3,3,2,2,2,2,2,2,2,3,3,3,4,4,4,4,4,3,3,3,3,3,2,2,2,2,2,2,2,2,3,3,3,4,4,4,5,5,5,4,4,3,2,2,1,1,2,2,2,3,3,3,3,4,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,3,3,4,4,4,5,5,5,5,4,3,2,2,1,1,1,2,2,2,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,4,4,5,5,5,5,4,3,2,2,1,1,2,2,2,2,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,3,3,3,3,5,5,5,5,4,3,2,2,2,2,2,2,2,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,3,3,3,5,5,5,5,4,3,3,2,2,2,2,2,2,3,3,3,2,2,2,2,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,5,5,4,3,3,2,2,2,2,2,3,3,3,2,2,2,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,3,3,3,3,3,3,3,3,2,2,2,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,1,1,1,2,2,2,4,4,4,4,4,4,4,3,3,3,3,3,3,3,2,2,1,1,1,0,0,0,1,1,2,2,2,3,3,3,2,2,2,2,1,1,1,1,2,2,3,3,3,4,4,4,4,4,4,4,4,3,3,3,2,2,1,1,1,1,1,1,1,1,2,3,3,3,3,3,3,2,2,2,1,1,1,1,1,2,2,3,3,4,4,4,4,4,4,4,4,4,3,3,2,2,1,1,1,1,1,1,1,2,3,3,4,4,4,3,3,3,2,2,1,1,1,1,1,2,2,2,3,3,4,4,5,5,5,4,4,4,4,3,2,2,2,1,1,1,1,2,2,3,3,4,4,4,4,4,3,3,2,2,1,1,1,1,1,2,2,2,3,3,4,5,5,5,5,5,4,4,4,3,3,2,2,2,2,2,2,2,3,3,4,4,4,4,4,4,3,3,2,2,1,1,1,1,1,1,2,2,3,3,4,5,5,5,5,5,4,4,4,3,3,2,2,2,2,2,2,3,3,3,4,4,4,4,4,4,3,3,2,2,1,1,1,1,1,1,2,2,3,3,4,5,5,5,5,5,4,4,4,3,3,3,2,2,3,3,3,3,3,4,4,4,5,4,4,4,3,3,2,2,1,1,1,1,1,1,2,2,3,3,4,5,5,5,5,5,5,4,4,4,3,3,3,3,3,3,3,3,4,4,4,5,5,5,4,4,3,3,3,2,1,1,1,1,1,1,2,3,3,4,4,5,5,5,5,5,5,4,4,4,3,3,3,3,3,4,4,4,4,4,5,5,5,5,4,4,4,3,3,2,2,1,1,1,1,1,3,3,3,4,4,5,5,5,5,5,5,5,4,4,4,3,3,4,4,4,4,4,4,5,5,5,5,5,4,4,4,4,3,3,2,2,2,2,2,2,3,3,4,4,4,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,4,4,4,4,4,4,4,3,3,3,2,2,2,2,4,4,4,4,4,4,5,5,5,5,4,4,4,4,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,3,3,5,4,4,4,4,4,4,4,4,4,4,3,3,3,3,3,3,3,3,4,4,4,4,4,4,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,5,4,4,4,4,3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,4,4,4,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4]};
var treasure = new Array(10);coin = 0;
var startTime,timer = null;

function init() {
    width      = window.innerWidth - 20;
    height     = window.innerHeight -40;
    scene      = new THREE.Scene();
    camera     = new THREE.PerspectiveCamera(50,width/height,1,1000);
    camera.rotation.order = "YXZ";
    renderer   = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(width,height);
    document.getElementById("renderArea").appendChild(renderer.domElement);
    var light  = new THREE.DirectionalLight("#ffffff");
    light.position.set(10,20,10);
    scene.add(light);
    var alight = new THREE.AmbientLight("#666666");
    scene.add(alight);
    initMap();
}

function loadMap(e) {
    var reader = new FileReader();
    reader.onload = function () {
        mapData= JSON.parse(reader.result);
        console.log(mapData);
        initMap();
        if(timer != null) clearInterval(timer);
        document.getElementById("start").disabled = false;
    };
    reader.readAsText(e.files[0]);
}

function initMap() {
    for (var i=scene.children.length-1; i>=0; i--) {
        var child = scene.children[i];
        if(child.type == "Mesh") {
            scene.remove(child);
            child.material.dispose();
            child.geometry.dispose();
        }
    }
    for (var y=0; y<8; y++) {
        var geometry = new THREE.Geometry();
        var material = new THREE.MeshPhongMaterial({color:mapData.color[y]});
        var block = new THREE.Mesh(new THREE.BoxGeometry(1,1,1));
        var index = 0;
        for (var z=0; z<mapData.height; z++) {
            for (var x=0; x<mapData.width; x++) {
                if(mapData.map[index]==y){
                    block.position.set(x,y,z);
                    geometry.mergeMesh(block);
                }
                index++;
            }
        }
        var mesh = new THREE.Mesh(geometry,material);
        scene.add(mesh);
    }
    camera.position.set(mapData.width/2,10,mapData.height/2);
    camera.rotation.set(-0.2,0,0);
    renderer.render(scene,camera);
}

function setTreasure(index) {
    var geometry = new THREE.CylinderGeometry(0.2,0.2,0.05,12);
    var material = new THREE.MeshPhongMaterial({color:"#FF9900",shininess:60});
    treasure[index] = new THREE.Mesh(geometry,material);
    treasure[index].name = "coin";
    treasure[index].rotation.set(0,0,Math.PI/2);

    var x = Math.floor(Math.random()*mapData.width);
    var z = Math.floor(Math.random()*mapData.height);
    var y = mapData.map[x+z*mapData.width]+0.8;
    treasure[index].position.set(x,y,z);
    scene.add(treasure[index]);
}

function game() {
    time=((Date.now()-startTime)/1000).toFixed(3);
    document.getElementById("time").innerHTML = time;
    document.getElementById("coin").innerHTML = coin;
    if(coin == 10){
        clearInterval(timer);
        document.getElementById("start").disabled = false;
        document.getElementById("time").innerHTML = "Clear!!";
    }
    for (var i=0; i<treasure.length; i++) treasure[i].rotation.y += 0.1;
    renderer.render(scene,camera);
}

function startGame() {
    initMap();
    for (var i=0; i<treasure.length; i++) setTreasure(i);
    coin = 0;
    document.getElementById("coin").innerHTML = coin;
    startTime = Date.now();
    timer = setInterval(game,20);
    document.getElementById("start").disabled=true;
}

document.onkeydown = function(e) {
    if((e.key == "ArrowLeft")||(e.key == "Left")) camera.rotation.y += 0.1;
    if((e.key == "ArrowRight")||(e.key == "Right")) camera.rotation.y -= 0.1;
    if((e.key == "ArrowUp")||(e.key == "Up")) camera.rotation.x += 0.1;
    if((e.key == "ArrowDown")||(e.key == "Down")) camera.rotation.x -= 0.1;
    if(e.key == "x") {
        camera.position.z -= Math.cos(camera.rotation.y);
        camera.position.x -= Math.sin(camera.rotation.y);
    } else if(e.key == "z") {
        camera.position.z += Math.cos(camera.rotation.y);
        camera.position.x += Math.sin(camera.rotation.y);
    }
}

function pick(event) {
    var mouse = new THREE.Vector2();
    var rect = event.target.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouse.x = mouse.x/width * 2 - 1;
    mouse.y = mouse.y/height * (-2) +1;

    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse,camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if((intersects.length > 0)&&(intersects[0].object.name == "coin")){
        intersects[0].object.visible = false;
        coin ++;
    }
}

