import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import RAPIER, { HeightFieldFlags } from '@dimforge/rapier3d'
import { RapierPhysics } from 'three/examples/jsm/Addons.js'
import { gsap } from 'gsap-trial'
import { SplitText } from 'gsap-trial/SplitText'
import anime from 'animejs';

import { simulationVertexShader, simulationFragmentShader, renderVertexShader, renderFragmentShader } from "./shader.js"
import { alphaT, texture } from 'three/tsl'

// #region Hero Threejs

// await RAPIER.init() // This line is only needed if using the compat version
const gravity = new RAPIER.Vector3(0.0, 0.0, 0.0)
const world = new RAPIER.World(gravity)
// const dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = []
const dynamicBodies: [THREE.Object3D, RAPIER.RigidBody][] = []


const scene = new THREE.Scene()

const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 1;
scene.add(ambientLight);

const light1 = new THREE.DirectionalLight('#ffffff', 2);
light1.position.set(10, 10, 10)
// light1.angle = Math.PI / 3
// light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.blurSamples = 10
light1.shadow.radius = 5
scene.add(light1)

const light2 = light1.clone()
light2.position.set(10, -1, 10)
// scene.add(light2)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 0, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})



for (let i = 0; i < 50; i++) {


    // Ball Collider
    const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshStandardMaterial({ color: "#ff2222", roughness: 0, metalness: 0 }))
    sphereMesh.castShadow = true
    scene.add(sphereMesh)

    const sphereBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(i, i, 0).setCanSleep(false).setLinearDamping(4).setAngularDamping(1))
    const sphereShape = RAPIER.ColliderDesc.ball(1).setMass(1).setRestitution(0.5).setFriction(100)

    world.createCollider(sphereShape, sphereBody)
    dynamicBodies.push([sphereMesh, sphereBody])

}

const mouseBallBody = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(100, 100, 100))
const mouseBallShape = RAPIER.ColliderDesc.ball(3).setMass(1).setRestitution(15).setFriction(100)

world.createCollider(mouseBallShape, mouseBallBody)


// const stats = new Stats()
// document.body.appendChild(stats.dom)


const clock = new THREE.Clock()
let delta

var timeout: any;

window.document.addEventListener('mousemove', (event) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () { mouseBallBody.setTranslation(new RAPIER.Vector3(100, 100, 100), false);}, 10);

    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse

    vec.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        - (event.clientY / window.innerHeight) * 2 + 1,
        0.5,
    );

    vec.unproject(camera);

    vec.sub(camera.position).normalize();

    var distance = - camera.position.z / vec.z;

    pos.copy(camera.position).add(vec.multiplyScalar(distance));

    mouseBallBody.setTranslation(new RAPIER.Vector3(pos.x, pos.y, 0), true);


})

function animate() {
    requestAnimationFrame(animate)

    delta = clock.getDelta()
    world.timestep = Math.min(delta, 0.1)
    world.step()

    let multiplier = 0.2;
    dynamicBodies.forEach((b) => {
        b[1].applyImpulse(new RAPIER.Vector3(-b[0].position.x * multiplier, -b[0].position.y * multiplier, -b[0].position.z * multiplier), true)
    })

    for (let i = 0, n = dynamicBodies.length; i < n; i++) {
        dynamicBodies[i][0].position.copy(dynamicBodies[i][1].translation())
        dynamicBodies[i][0].quaternion.copy(dynamicBodies[i][1].rotation())
    }

    renderer.render(scene, camera)

    // stats.update()
}

animate()

// #endregion

// #region TextAnimation

let div = document.querySelector('#name');
div!.innerHTML = div!.textContent!.replace(/\S/g, "<span class='letter' style='display: inline-block'>$&</span>");

let div2 = document.querySelector('#role');
div2!.innerHTML = div2!.textContent!.replace(/\S/g, "<span class='letter' style='display: inline-block'>$&</span>");

let timeline = anime.timeline({
    loop: false,
    autoplay: true
});

timeline.add({
    duration: 1000,
    delay: (el, i) => 70 * i,
    endDelay: 500
})

timeline.add({
    targets: 'h1 .letter',
    scale: [4, 1],
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 1000,
    delay: (el, i) => 70 * i,
    endDelay: 500
})

// #endregion

// #region fluid Sim

// @ts-ignore
// var scene2: THREE.Scene;
// var simScene: THREE.Scene;
// var camera2:THREE.Camera;
// document.addEventListener("DOMContentLoaded", () => {
    //@ts-ignore
    const scene2 = new THREE.Scene();
    const simScene = new THREE.Scene();


    const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
// });


// @ts-ignore
const renderer2 = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
});

renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer2.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer2.domElement);

const mouse = new THREE.Vector2();
let frame = 0;

const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;

const options = {
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    stencilBuffer: false,
    depthBuffer: false,
};


let rtA = new THREE.WebGLRenderTarget(width, height, options);
let rtB = new THREE.WebGLRenderTarget(width, height, options);

const simMaterial = new THREE.ShaderMaterial({
    uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: new THREE.Vector2(width, height) },
        time: { value: 0 },
        frame: { value: 0 },
    },
    vertexShader: simulationVertexShader,
    fragmentShader: simulationFragmentShader,
});


const renderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        textureA: { value: null },
        textureB: { value: null },
    },
    vertexShader: renderVertexShader,
    fragmentShader: renderFragmentShader,
    transparent: true,
});




const plane = new THREE.PlaneGeometry(2, 2);
const simQuad = new THREE.Mesh(plane, simMaterial);
const renderQuad = new THREE.Mesh(plane, renderMaterial);

//@ts-ignore
simScene.add(simQuad);
scene2.add(renderQuad);

const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d', { alpha: true });

ctx!.fillStyle = '#fb7427';
ctx!.fillRect(0, 0, width, height)


const fontSize = Math.round(250 * window.devicePixelRatio);
ctx!.fillStyle = '#fef4b8';
ctx!.font = `bold ${fontSize}px Test Roboto`;
ctx!.textAlign = "center";
ctx!.textBaseline = "middle";
ctx!.textRendering = 'geometricPrecision';
ctx!.imageSmoothingEnabled = true;
ctx!.imageSmoothingQuality = 'high';
ctx!.fillText('softhorizon', width / 2, height / 2);

const textTexture = new THREE.CanvasTexture(canvas);
textTexture.minFilter = THREE.LinearFilter;
textTexture.magFilter = THREE.LinearFilter;
textTexture.format = THREE.RGBAFormat;


window.addEventListener('resize', () => {
    const newWidth = window.innerWidth * window.devicePixelRatio;
    const newHeight = window.innerHeight * window.devicePixelRatio;

    renderer2.setSize(window.innerWidth, window.innerHeight);
    rtA.setSize(newWidth, newHeight);
    rtB.setSize(newWidth, newHeight);
    simMaterial.uniforms.resolution.value.set(newWidth, newHeight);

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx!.fillStyle = '#fb7427';
    ctx?.fillRect(0, 0, newWidth, newHeight);

    const newFontSizze = Math.round(250 * window.devicePixelRatio);
    ctx!.fillStyle = '#fef4b8';
    ctx!.font = `bold ${newFontSizze}px Test Roboto`;
    ctx!.textAlign = "center";
    ctx!.textBaseline = "middle";
    ctx!.fillText('softhorizon', newWidth / 2, newHeight / 2);

    textTexture.needsUpdate = true;

})


renderer2.domElement.addEventListener('mousemove',(e)=>{
    mouse.x = e.clientX * window.devicePixelRatio;
    mouse.y = (window.innerHeight - e.clientX) * window.devicePixelRatio;
})


renderer2.domElement.addEventListener("mouseleave",()=>{
    mouse.set(0,0);
})


const animate2 = ()=>{
    simMaterial.uniforms.frame.value = frame++;
    simMaterial.uniforms.time.value = performance.now()/100;

    simMaterial.uniforms.textureA.value = rtA.texture;
    renderer2.render(simScene,camera2);

    renderMaterial.uniforms.textureA.value = rtB.texture;
    renderMaterial.uniforms.textureB.value = textTexture;
    renderer2.setRenderTarget(null);
    renderer2.render(scene2,camera2);

    const temp = rtA;
    rtA = rtB;
    rtB = temp;

    requestAnimationFrame(animate2);

    animate2();
};


// endregion

