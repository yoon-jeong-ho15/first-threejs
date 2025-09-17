import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pointLight = new THREE.PointLight(0xffffff, 2, 0, 0);
pointLight.position.set(100, 100, 100);
scene.add(pointLight);

const cameraLight = new THREE.PointLight(0xffffff, 0.5, 0, 0);
cameraLight.position.set(0, 0, 0);
camera.add(cameraLight);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.Color(0x1a1a1a);

const spheres = [];

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

const materials = [
  new THREE.MeshPhysicalMaterial({ color: 0xff0000 }),
  new THREE.MeshPhysicalMaterial({ color: 0x00ff00 }),
  new THREE.MeshPhysicalMaterial({ color: 0x0000ff }),
  new THREE.MeshPhysicalMaterial({ color: 0xffff00 }),
  new THREE.MeshPhysicalMaterial({ color: 0xff00ff }),
];

const positions = [
  { x: -4, y: 0, z: 0 },
  { x: -2, y: 0, z: 0 },
  { x: 0, y: 0, z: 0 },
  { x: 2, y: 0, z: 0 },
  { x: 4, y: 0, z: 0 },
];

for (let i = 0; i < 5; i++) {
  const sphere = new THREE.Mesh(sphereGeometry, materials[i]);
  sphere.position.set(positions[i].x, positions[i].y, positions[i].z);
  scene.add(sphere);
  spheres.push(sphere);
}

camera.position.z = 8;

function animate() {
  requestAnimationFrame(animate);

  spheres.forEach((sphere, index) => {
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    sphere.position.y = Math.sin(Date.now() * 0.001 + index) * 0.5;
  });

  // controls.update();

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
