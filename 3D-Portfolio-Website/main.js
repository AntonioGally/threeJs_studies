import "./styles.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//* Para começar, é preciso de uma Scene, uma Camera e um Renderer
//* A Scene é como se fosse um container, e dentro dele haverá a camera e algo a ser renderizado

const scene = new THREE.Scene();
//Fild of View, Aspect Ratio, View Frustrum
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
//FullScreen canvas
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// renderer.render(scene, camera);

//* The {x,y,z} points that makeup a shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100); //! This is a big 3D Ring
const material = new THREE.MeshBasicMaterial({
  color: 0xff6347,
  wireframe: true,
}); //* The wrapping papaer for an object
const torus = new THREE.Mesh(geometry, material); //* Geometry + material

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

//Listening to Dom events and change the camera position
const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("./img/space.jpg");
scene.background = spaceTexture;

//Avatar
const antonioTexture = new THREE.TextureLoader().load("./img/eu1.jpeg");

const antonio = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ map: antonioTexture })
);

scene.add(antonio);

//Moon
const moonTexture = new THREE.TextureLoader().load("./img/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("./img/normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);

scene.add(moon);

moon.position.z = 20;
moon.position.x = -10;

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  antonio.rotation.y += 0.01;
  antonio.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

function animate() {
  //Update de UI using a infinit loop
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
