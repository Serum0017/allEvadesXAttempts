function createText(text, x,y,z, col1=0xFF0000, col2=0x00FF00){
	let saved = [];
	for(let i = 0; i < 2; i++){
		// const box = new THREE.Box3();

		let params = {};
		if(i === 0){
			params = {
				font: font,
				size: 0.03/3,
				depth: 0.1,
				curveSegments: 10,
				// bevelEnabled: false,
				// bevelThickness: 0.01,
				// bevelSize: 0.01,
				// bevelOffset: 0,
				// bevelSegments: 5
			}
		} else {
			params = {
				font: font,
				size: 0.03/3,
				depth: 0.1,
				curveSegments: 10,
				bevelEnabled: true,
				bevelThickness: 0.0023/3,
				bevelSize: 0.0023/3,
				bevelOffset: 0,
				bevelSegments: 5
			}
		}
		const geometry = new TextGeometry( text, params );

		const material = new THREE.MeshBasicMaterial( { color: i === 0 ? col1 : col2 } );
		const mesh = new THREE.Mesh( geometry, material );

		mesh.geometry.computeBoundingBox();

		mesh.rotation.x = -Math.PI / 2;
		mesh.rotation.y = Math.PI-Math.atan2(y, x);
		mesh.rotation.z = Math.PI / 2;

		// let boundingBox = box.copy( mesh.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );
		// let width = 0//boundingBox.max.x - boundingBox.min.x;
		// let height = 0//boundingBox.max.y - boundingBox.min.y;
		// let depth = 0//boundingBox.max.z - boundingBox.min.z;
		// if(i === 0) depth *= 0.001/3;
		// else depth *= 0.0009/3;

		// console.log(width, height, depth); // all good values but it doesn't appaear for some reason? TODO: fix

		if(i === 0) saved = [x, y, z];
		mesh.position.set(...saved);

		if(i === 0) mesh.scale.z = 0.001/3;
		else mesh.scale.z = 0.0009/3;
		scene.add( mesh );
	}
}

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// const path = './space skybox.jpg';
// const texturemesh = new THREE.meshTextureLoader().load( new Array(6).fill(path) );

// const texture = new THREE.TextureLoader().load( "./space skybox.jpg" );
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set( 4, 4 );

const scene = new THREE.Scene();
// scene.background = texture;
const camera = window.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.0001, 10000 );

const renderer = window.renderer = new THREE.WebGLRenderer(/*{antialias: true}*/);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const canvas = renderer.domElement;

const ambientLight = new THREE.AmbientLight( 0x000000, 0.5 );
scene.add( ambientLight );

const light1 = new THREE.PointLight( 0xffffff, 1, 0 );
light1.position.set( 0, 200, 0 );
scene.add( light1 );

const light2 = new THREE.PointLight( 0xffffff, 1, 0 );
light2.position.set( 100, 200, 100 );
scene.add( light2 );

const light3 = new THREE.PointLight( 0xffffff, 1, 0 );
light3.position.set( - 100, - 200, - 100 );
scene.add( light3 );

// fonts
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
const loader = new FontLoader();

let font = null;
loader.load( './FranklinGothicHeavy.json', function ( f ) {
	font = f;
} );

camera.position.z = 5;
window.camera = camera;
new OrbitControls( camera, renderer.domElement );


import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 3;
bloomPass.strength = 0.8;
bloomPass.radius = 0;

const composer = new EffectComposer( renderer );
composer.addPass( new RenderPass(scene, camera) );
composer.addPass( bloomPass );

let dt = 1.8/1000;
let t = 0;
let tick = 0;
let toCapture = false;
let fileData = [];

function animate() {
	requestAnimationFrame( animate );

	// const nextCameraPos = cameraPositions[tick % 10000];//nextCameraPosQueue.shift();
	// camera.position.set(...nextCameraPos/*...cameraPos(t)*/);
	// // nextCameraPosQueue.push(cameraPos(t));
	// t += dt;
	// tick++;
	// // console.log(tick);
	// let lastRotation = camera.rotation.clone();
	// camera.lookAt(...cameraPositions[(tick+100) % 10000]);
	// camera.rotation.x = interpolateDirection(lastRotation.x, camera.rotation.x, 0.006);
	// camera.rotation.y = interpolateDirection(lastRotation.y, camera.rotation.y, 0.006);
	// camera.rotation.z = interpolateDirection(lastRotation.z, camera.rotation.z, 0.006);

	// camera.rotation.x = -Math.PI / 2;
	// camera.rotation.y = Math.PI-Math.atan2(camera.position.y, camera.position.x);
	// camera.rotation.z = Math.PI / 2;

	// for(let i = 0; i < dusts.length; i++){
	// 	dusts[i].lookAt(camera.position);
	// }
	
	composer.render( scene, camera );

	if(toCapture === true){
        toCapture = false;
		canvas.toBlob((blob) => {fileData = blob});
        console.log('captured!');
	}
}

setTimeout(() => {
    // createText('Play now!', 0,0,0, 0x1fad64, 0x1b9456);
    createText('https://omnipotent.site', 0,0,0, 0x383838, 0x0d0d0d);
}, 2000)

animate();

window.capture = () => {
    toCapture = true;
}

window.downloadFiles = () => {
	// if(confirm('Would you like to download ' + imgBlobs.length + ' files?') !== true) return;
	// Initialize a new JSZip instance
	let zip = new JSZip();

	// Define the files to be added to the zip
	let files = [{name: 'textRender.png', content: fileData}];

	// Add files to the zip
	files.forEach(function(file) {
		zip.file(file.name, file.content);
	});

	// Generate the zip file and trigger the download
	zip.generateAsync({ type: "blob" })
		.then(function(content) {
			// Use FileSaver to save the zip file
			saveAs(content, "textRender.zip");
		});
}