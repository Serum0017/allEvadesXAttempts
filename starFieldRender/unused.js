// post processing
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0;
bloomPass.strength = 0.5;
bloomPass.radius = 0;

const composer = new EffectComposer( renderer );
composer.addPass( new RenderPass(scene, camera) );
composer.addPass( bloomPass );

// Imports 
import { Reflector } from 'three/addons/objects/Reflector.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Fog
scene.fog = new THREE.Fog( 0xcccccc, 20, 25 );