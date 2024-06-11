import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Initialize the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add a sphere
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 5;

// Shader
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float resolution;
    uniform float direction;
    uniform float blurAmount;

    void main() {
        vec2 texel = vec2(1.0 / resolution);
        vec4 color = texture2D(tDiffuse, vUv);
        
        for(int i = 0; i < 8; i++) {
            float angle = 0.785398 * float(i);
            vec2 offset = vec2(cos(angle), sin(angle)) * blurAmount * texel;
            color += texture2D(tDiffuse, vUv + offset);
        }
        
        gl_FragColor = color / 9.0; // Average the color
    }
`;

const blurAmount = 100.0; // Adjust this value to control the blur intensity

const blurShader = {
    uniforms: {
        'tDiffuse': { value: null },
        'resolution': { value: window.innerWidth },
        'direction': { value: 1.0 },
        'blurAmount': { value: blurAmount }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
};

// Initialize EffectComposer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const blurPass = new ShaderPass(blurShader);
composer.addPass(blurPass);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    composer.render(scene, camera);
}

animate();