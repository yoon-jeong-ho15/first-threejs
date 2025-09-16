import * as THREE from "three";

import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

let camera, controls, scene, renderer, effect;

let letters = [];
let plane;

const start = Date.now();

init();

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.x = -250;
  camera.position.y = 100;
  camera.position.z = 300;

  // Make camera look at the center of HELLO text
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0, 0, 0);

  const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
  pointLight1.position.set(500, 500, 500);
  scene.add(pointLight1);

  // const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
  // pointLight2.position.set(-500, -500, -500);
  // scene.add(pointLight2);

  // const cameraLight = new THREE.PointLight(0xffffff, 1, 0, 0);
  // cameraLight.position.set(-150, 100, -30); // 카메라 기준 상대 위치
  // //                         왼   위   뒤
  // camera.add(cameraLight);
  // scene.add(camera);

  // Load font and create 3D text
  const loader = new FontLoader();
  loader.load(
    "/node_modules/three/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      createHelloText(font);
    }
  );

  // plane = new THREE.Mesh(
  //   new THREE.PlaneGeometry(400, 400),
  //   new THREE.MeshBasicMaterial({ color: 0xe0e0e0 })
  // );
  // plane.position.y = -200;
  // plane.rotation.x = -Math.PI / 2;
  // scene.add(plane);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);

  effect = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true });
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.color = "white";
  effect.domElement.style.backgroundColor = "black";

  document.body.appendChild(effect.domElement);

  controls = new OrbitControls(camera, effect.domElement);
  // camera 인자 : 컨트롤이 조작할 카메라.
  // domElement 인자 : 마우스 이벤트를 감지할 요소.
  // render.domElement가 아닌 이유는 실제로 화면에 보여지는건 effect.domElement이기 때문이다.

  window.addEventListener("resize", onWindowResize);
}

function createHelloText(font) {
  const letterSpacing = 90;
  const startX = -250; // Center the word
  const letters_text = ["H", "E", "L", "L", "O"];

  letters_text.forEach((letter, index) => {
    const geometry = new TextGeometry(letter, {
      font: font,
      size: 80,
      height: 10,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelSegments: 5,
    });

    geometry.computeBoundingBox();
    const centerOffsetX =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    const centerOffsetY =
      -0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y);

    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color().setHSL(index / letters_text.length, 0.7, 0.6),
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Position each letter
    mesh.position.x = startX + index * letterSpacing + centerOffsetX;
    mesh.position.y = centerOffsetY;
    mesh.position.z = 0;

    // Add unique animation properties
    mesh.userData = {
      originalX: mesh.position.x,
      originalY: mesh.position.y,
      originalZ: mesh.position.z,
      floatSpeed: 0.0005 + Math.random() * 0.005,
      floatAmplitude: 5 + Math.random() * 20,
      floatOffset: Math.random() * Math.PI * 2,
      rotationSpeedX: (Math.random() - 0.5) * 0.001,
      rotationSpeedY: (Math.random() - 0.5) * 0.001,
      rotationSpeedZ: (Math.random() - 0.5) * 0.0006,
      driftSpeedX: (Math.random() - 0.5) * 0.0002,
      driftSpeedZ: (Math.random() - 0.5) * 0.0002,
      driftAmplitudeX: 3 + Math.random() * 7,
      driftAmplitudeZ: 3 + Math.random() * 7,
    };

    scene.add(mesh);
    letters.push(mesh);
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const timer = Date.now() - start;

  // Animate each letter independently
  letters.forEach((letter) => {
    const userData = letter.userData;

    // Floating animation with unique parameters for each letter
    letter.position.y =
      userData.originalY +
      Math.sin(timer * userData.floatSpeed + userData.floatOffset) *
        userData.floatAmplitude;

    // Gentle drift in X and Z axes
    letter.position.x =
      userData.originalX +
      Math.sin(timer * userData.driftSpeedX) * userData.driftAmplitudeX;
    letter.position.z =
      userData.originalZ +
      Math.cos(timer * userData.driftSpeedZ) * userData.driftAmplitudeZ;

    // Independent rotation for each letter
    letter.rotation.x += userData.rotationSpeedX;
    letter.rotation.y += userData.rotationSpeedY;
    letter.rotation.z += userData.rotationSpeedZ;
  });

  controls.update();

  effect.render(scene, camera);
}
