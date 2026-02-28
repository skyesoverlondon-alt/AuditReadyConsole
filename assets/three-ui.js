import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.162.0/build/three.module.min.js";
import { CSS3DRenderer, CSS3DObject } from "https://cdn.jsdelivr.net/npm/three@0.162.0/examples/jsm/renderers/CSS3DRenderer.js";

const host = document.getElementById("three-ui-layer");
const shell = document.querySelector(".shell");

if (host && shell) {
  // Remove shell from normal flow so CSS3DRenderer owns it.
  const placeholder = document.createElement("div");
  placeholder.style.display = "none";
  shell.parentNode.insertBefore(placeholder, shell);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
  camera.position.set(0, 0, 1100);

  const renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.pointerEvents = "auto";
  renderer.domElement.style.zIndex = "12";
  renderer.domElement.style.overflow = "visible";
  host.appendChild(renderer.domElement);

  const uiObject = new CSS3DObject(shell);
  uiObject.position.set(0, 0, 0);
  scene.add(uiObject);

  const clock = new THREE.Clock();
  let targetRotX = 0;
  let targetRotY = 0;

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  const onMouseMove = (e) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = nx * 0.08;
    targetRotX = ny * -0.06;
  };

  const animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    uiObject.rotation.x += (targetRotX - uiObject.rotation.x) * Math.min(1, delta * 6);
    uiObject.rotation.y += (targetRotY - uiObject.rotation.y) * Math.min(1, delta * 6);
    renderer.render(scene, camera);
  };

  window.addEventListener("resize", onResize);
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  onResize();
  animate();
}
