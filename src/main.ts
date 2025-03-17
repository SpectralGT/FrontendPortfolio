import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import RAPIER from '@dimforge/rapier3d'
import { RapierPhysics } from 'three/examples/jsm/Addons.js'
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

const light1 = new THREE.DirectionalLight('#ffffff', 1);
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



for (let i = 0; i < 30; i++) {


    // Ball Collider
    const sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshStandardMaterial({ color: "#ff5555", roughness: 0, metalness: 0 }))
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


const stats = new Stats()
document.body.appendChild(stats.dom)


const clock = new THREE.Clock()
let delta

var timeout: any;

window.document.addEventListener('mousemove', (event) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () { mouseBallBody.setTranslation(new RAPIER.Vector3(100, 100, 100), false); console.log("mouse stopped") }, 10);

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
    console.log('mouse moved');


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

    stats.update()
}

animate()

// #endregion

// #region TextAnimation



// #endregion