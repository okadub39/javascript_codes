let scene,camera,renderer;
const [width,height]=[600,400];
let flag;
let flagColor = "#ffffff";
let flagTexture = null;
const [sizeW,sizeH,segW,segH] = [30,20,30,20];

const init = () =>  {
    scene  = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60,width/height,1,1000);
    camera.position.set(0,0,40);
    camera.lookAt(new THREE.Vector3(0,0.0));
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(width,height);
    document.getElementById("renderArea").appendChild(renderer.domElement);
    const light = new THREE.DirectionalLight("#FFFFFF");
    light.position.set(10,50,100);
    scene.add(light);
    const ambientLight = new THREE.AmbientLight("#999999");
    scene.add(ambientLight);
    let geometry = new THREE.CylinderGeometry(0.5,0.5,40,16,1);
    let material = new THREE.MeshPhongMaterial({
        color:"#ffcc99",
        specular: "#999999",
        shininess: 30
    });
    const pole = new THREE.Mesh(geometry,material);
    pole.position.set(-15,-10,0);
    scene.add(pole);
    geometry = new THREE.PlaneGeometry(sizeW,sizeH,segW,segH);
    material = new THREE.MeshLambertMaterial({
        color:flagColor,
        side:THREE.DoubleSide
    });
    flag = new THREE.Mesh(geometry,material);
    scene.add(flag);
    update();
}

const initFlag = () => {
    flagColor = "#ffffff";
    document.getElementById("color").value = flagColor;
    flagTexture = null;
    document.getElementById("texture").value = "";
    setMaterial();
    document.getElementById("angle").value = 0;
    setCamera();
    document.getElementById("h").value = 0.5;
    document.getElementById("v").value = 0.3;
    document.getElementById("w").value = 0.2;
    document.getElementById("s").value = 0.5;
}

const setColor = () => {
    flagColor = document.getElementById("color").value;
    setMaterial();
}

const setMaterial = () => {
    console.log(flagColor);
    flag.material = new THREE.MeshLambertMaterial({
        color: flagColor,
        map: flagTexture,
        side: THREE.DoubleSide
    });
}

const loadTexture = files => {
    if(files.length > 0) {
        const url = URL.createObjectURL(files[0]);
        const loader = new THREE.TextureLoader();
        loader.load(url,texture => {
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            flagTexture = texture;
            setMaterial();
        });
    } else {
        flagTexture = null;
        setMaterial();
    }
}

const setCamera = () => {
    const angle = document.getElementById("angle").value;
    document.getElementById("textAngle").innerText = `[${angle}°]`;
    camera.position.x = 40 * Math.sin(angle * Math.PI/180);
    camera.position.z = 40 * Math.cos(angle * Math.PI/180);
    camera.lookAt(new THREE.Vector3(0,0,0));
}

const update = () => {
    const h = document.getElementById("h").value;
    const v = document.getElementById("v").value;
    const w = document.getElementById("w").value;
    const s = document.getElementById("s").value;

    for (let y=0; y<segH+1; y++) {
        for (let x=0; x<segW+1; x++) {
            const index = x + y * (segW+1);
            const vertex = flag.geometry.vertices[index];
            const time = Date.now() * s / 50;
            vertex.z = Math.sin(h * x + v * y - time) * w * x / 4;
        }
    }
    flag.geometry.verticesNeedUpdate = true;
    renderer.render(scene,camera);
    window.requestAnimationFrame(update);
}
