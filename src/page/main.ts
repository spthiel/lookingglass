// @ts-expect-error WebXR doesn't have type declaration.
import {LookingGlassConfig, LookingGlassWebXRPolyfill} from "@lookingglass/webxr";
import * as THREE from "three";
import {FontLoader} from "three/addons";
import {TextGeometry} from "three/addons/geometries/TextGeometry.js";

const config = LookingGlassConfig;
config.targetY = 0;
config.targetZ = 0;
config.targetDiam = 3;
config.fovy = (40 * Math.PI) / 180;
config.calibration;
new LookingGlassWebXRPolyfill();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();

async function setupCanvas() {
    window.open = () => undefined;
    await navigator.xr.isSessionSupported("immersive-vr");
    const session = await navigator.xr.requestSession("immersive-vr", {requiredFeatures: ["local-floor"]});
    await renderer.xr.setSession(session);
    const canvas: HTMLCanvasElement = config.lkgCanvas;
    document.body.appendChild(canvas);
    await canvas.requestFullscreen();
}

setTimeout(() => setupCanvas(), 1000);

renderer.xr.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});

camera.position.z = 1;
const loader = new FontLoader();
loader.load("./helvetiker_regular.typeface.json", function (font) {
    const size = 0.1;

    const geometry = new TextGeometry("Hello three.js!", {
        font: font,
        size: size,
        depth: size,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0,
    });

    geometry.computeBoundingBox();

    const text = new THREE.Mesh(geometry, material);
    const centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    console.log("Added text");
    text.position.set(centerOffset, 0, 0);
    scene.add(text);
});

function animate() {
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// @ts-expect-error testing
window.electronAPI.onTest(console.log);