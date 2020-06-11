var scene,camera,renderer;
var light,ambientLight;
var earth;
var mapTexture = null,bumpTexture = null;

function init() {
    var width = 800;
    var height = 500;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50,width/height,1,1000);
    camera.position.set(150,0,0);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width,height);
    document.getElementById("renderArea").appendChild(renderer.domElement);

    light = new THREE.DirectionalLight("#ffffff");
    light.position.set(200,100,0);
    scene.add(light);
    ambientLight = new THREE.AmbientLight("#333333");
    scene.add(ambientLight);

    var geometry = new THREE.SphereGeometry(50,64,64);
    var material = new THREE.MeshPhongMaterial({color:"#00ccff"});
    earth = new THREE.Mesh(geometry,material);
    earth.position.set(0,0,0);
    scene.add(earth);

    setInterval(update,100);
    setMaterial();
}

function loadTexture(e) {
    var url = URL.createObjectURL(e.files[0]);
    var loader = new THREE.TextureLoader();
    loader.load(url,function(texture) {
        mapTexture = texture;
        setMaterial();
    });
}

function loadBumpMap(e) {
    var url = URL.createObjectURL(e.files[0]);
    var loader = new THREE.TextureLoader();
    loader.load(url,function(texture) {
        bumpTexture = texture;
        setMaterial();
    });
}

function setMaterial() {
    console.log(mapTexture);
    if(mapTexture == null){
        console.log("test");
        var url = "http://drive.google.com/uc?export=view&id=1NBJYymDtb5NCE32mZyaIrDh5MjF24FGH";
        var loader = new THREE.TextureLoader();
        loader.load(url,function(texture) {
            mapTexture = texture;
        });
    }
    earth.material = new THREE.MeshPhongMaterial({
        color:"#ffffff",
        map: mapTexture,
        bumpTexture: bumpTexture,
        bumpScale:2
    });
}

function update() {
    var speed = document.getElementById("speed").value;
    document.getElementById("texambitSpeed").innerText="[" + speed + "]";
    earth.rotation.y += speed/100;
    var angle = document.getElementById("angle").value;
    document.getElementById("textAngle").innerText="["+angle+"°]";
    camera.position.x = 150 * Math.cos(angle * Math.PI/180);
    camera.position.y = 150 * Math.sin(angle * Math.PI/180);
    camera.lookAt(scene.position);

    var lColor = document.getElementById("lightColor").value;
    light.color.set(lColor);

    var lAngle = document.getElementById("lightAngle").value;
    document.getElementById("textAngle").innerText="["+lAngle+"°]";
    light.position.x = 200 * Math.sin(lAngle * Math.PI/180 + Math.PI/2);
    light.position.z = 200 * Math.cos(lAngle * Math.PI/180 + Math.PI/2);

    if (document.getElementById("ambientLight").checked) {
        ambientLight.intensity = 1;
    } else {
        ambientLight.intensity = 0;
    }
    var scale = document.getElementById("scale").value;
    document.getElementById("textScale").innerText="["+scale+"°]";
    earth.material.bumpScale = scale;
    renderer.render(scene,camera);
}

function reset() {
    mapTexture = null;
    bumpTexture = null;
    earth.material = new THREE.MeshPhongMaterial({color:"#00ccff"});
    document.getElementById("map").value="";
    document.getElementById("bump").value="";
    document.getElementById("scale").value=2;
    document.getElementById("speed").value=0.01;
    document.getElementById("angle").value=0;
    document.getElementById("lightColor").value="#ffffff";
    document.getElementById("lightAngle").value=0;
    document.getElementById("ambientLight").checked=true;
}
