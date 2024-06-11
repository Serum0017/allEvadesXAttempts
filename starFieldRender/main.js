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

function createText(text, x,y,z, col1=0xFF0000, col2=0x00FF00){
	let saved = [];
	for(let i = 0; i < 2; i++){
		const box = new THREE.Box3();

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

		let boundingBox = box.copy( mesh.geometry.boundingBox ).applyMatrix4( mesh.matrixWorld );
		let width = boundingBox.max.x - boundingBox.min.x;
		let height = boundingBox.max.y - boundingBox.min.y;
		let depth = 0//boundingBox.max.z - boundingBox.min.z;
		if(i === 0) depth *= 0.001/3;
		else depth *= 0.0009/3;

		// console.log(width, height, depth); // all good values but it doesn't appaear for some reason? TODO: fix

		if(i === 0) saved = [-height/2+x, y, z+width/2];
		mesh.position.set(...saved);

		if(i === 0) mesh.scale.z = 0.001/3;
		else mesh.scale.z = 0.0009/3;
		scene.add( mesh );
	}
}

// const loader = new THREE.TextureLoader();
// let textures = []; let dusts = [];
// for(let i = 0; i <= 600; i++){
// 	let str = i.toString();
// 	while(str.length < 5) str = '0' + str;
// 	textures.push(loader.load(`./textures/Dust  tex making/Dust  tex making_${str}.png`));
// }

// camera.position.z = 100;
// camera.position.x = 50;
// camera.lookAt(new THREE.Vector3(0,0,0));
camera.position.z = 5;
// new OrbitControls( camera, renderer.domElement );

const tunnelRadius = 3;//22//42
const tunnelThickness = 0.15;
const outerStarsRadius = 4;

// const maxDist = Math.sqrt((tunnelRadius+tunnelThickness)**2+tunnelThickness**2);
// const minDist = Math.sqrt((tunnelRadius-tunnelThickness)**2);

for(let i = 0; i < 345; i++){
	// generate a line of stars that intersects the plane
	// const angle1 = Math.random() * Math.PI * 2;
	// const angle2 = angle1 + (Math.random()-0.5)*2 * Math.PI / 6;
	// const zRotation = (Math.random()-0.5)*2 * Math.PI * 2;// rotation from a straight line going through the donut on the x,y plane to some point around the torus
	// const zRadius = Math.sqrt(Math.random()) * tunnelThickness;

	// generateStarLine(randomTorusPosition(), (...p) => {addStarsWithinRadius(...p); addDustsWithinRadius(...p);});
	generateStarLine(randomTorusPosition(), addStarsWithinRadius);

	// const innerPosition = {
	// 	x: Math.cos(angle1) * (tunnelRadius - tunnelThickness * Math.cos(zRotation)),
	// 	y: Math.sin(angle1) * (tunnelRadius - tunnelThickness * Math.cos(zRotation)),
	// 	z: Math.sin(zRotation) * tunnelThickness
	// };
	// const outerPosition = {
	// 	x: Math.cos(angle2) * (tunnelRadius + tunnelThickness * Math.cos(zRotation)),
	// 	y: Math.sin(angle2) * (tunnelRadius + tunnelThickness * Math.cos(zRotation)),
	// 	z: -Math.sin(zRotation) * tunnelThickness
	// };
	// const dist = Math.sqrt((innerPosition.x-outerPosition.x)**2+(innerPosition.y-outerPosition.y)**2+(innerPosition.z-outerPosition.z)**2);
	// const cAngle1 = Math.random() * Math.PI * 2;
	// const cAngle2 = Math.random() * Math.PI * 2;
	// const controlPoint1 = {
	// 	x: (outerPosition.x + innerPosition.x) / 2 + Math.cos(cAngle1) * Math.cos(cAngle2) * dist/3,
	// 	y: (outerPosition.y + innerPosition.y) / 2 + Math.sin(cAngle1) * Math.cos(cAngle2) * dist/3,
	// 	z: (outerPosition.z + innerPosition.z) / 2 + Math.sin(cAngle2) * dist/3,
	// }
	// const controlPoint2 = {
	// 	x: (outerPosition.x + innerPosition.x) / 2 - Math.cos(cAngle1) * Math.cos(cAngle2) * dist/3,
	// 	y: (outerPosition.y + innerPosition.y) / 2 - Math.sin(cAngle1) * Math.cos(cAngle2) * dist/3,
	// 	z: (outerPosition.z + innerPosition.z) / 2 - Math.sin(cAngle2) * dist/3,
	// }

	// function position(t/*0-1*/) {
	// 	return [
	// 		/*x:*/ cubicBezier(innerPosition.x, outerPosition.x, controlPoint1.x, controlPoint2.x, t),
	// 		/*y:*/ cubicBezier(innerPosition.y, outerPosition.y, controlPoint1.y, controlPoint2.y, t),
	// 		/*z:*/ cubicBezier(innerPosition.z, outerPosition.z, controlPoint1.z, controlPoint2.z, t),
	// 	];
	// }

	// for(let t = 0; t < 1; t += 1 / dist){
	// 	addStarsWithinRadius(...position(t), 1);
	// }
}

// outer stars
for(let i = 0; i < 1000; i++){
	const angle1 = Math.random() * Math.PI * 2;
	const angle2 = Math.random() * Math.PI * 2;

	const pos = [
		Math.cos(angle1) * Math.sin(angle2) * outerStarsRadius,
		Math.sin(angle1) * Math.sin(angle2) * outerStarsRadius,
		Math.cos(angle2) * outerStarsRadius
	];

	addStar(...pos, /*rMult*/5);
}

// stars at the edge

function randomTorusPosition(){
	const angleAroundTorus = Math.random() * Math.PI * 2;
	const zRotation = Math.random() * Math.PI * 2;
	const radiusAroundShell = (Math.random()-0.5)*2 * tunnelThickness;

	return [
		Math.cos(angleAroundTorus) * (tunnelRadius + radiusAroundShell * Math.cos(zRotation)),
		Math.sin(angleAroundTorus) * (tunnelRadius + radiusAroundShell * Math.cos(zRotation)),
		Math.sin(zRotation) * tunnelThickness
	]
}

function generateStarLine(position, createFn=addStar, recursiveAmount=0){
	if(recursiveAmount > 3) return;
	let movementAngle1 = Math.random() * Math.PI * 2;
	let movementAngle2 = Math.random() * Math.PI * 2;

	// const distToMidpt = Math.sqrt((position[0]-torusMidpoint[0])**2+(position[1]-torusMidpoint[1])**2+(position[2])**2);
	// if(distToMidpt > tunnelThickness){
	// 	// if(Math.random() < 0.5) movementAngle1 += Math.PI;
	// 	// else movementAngle2 += Math.PI;
	// 	// position = randomTorusPosition();
	// 	movementAngle1 += (noise.perlin2(Math.random()*10, Math.random()*10) + 0.2)*12;
	// 	movementAngle2 += (noise.perlin2(Math.random()*10, Math.random()*10) + 0.2)*12;
	// }

	// let offsetJumps = [];
	// offsetJumps.push(interpolate(12,18,Math.random()));
	// if(Math.random() < 0.2) offsetJumps.push(interpolate(0,6,Math.random()));
	// if(Math.random() < 0.2) offsetJumps.push(interpolate(24,30,Math.random()));
	// offsetJumps = offsetJumps.map(p => Math.round(p));
	for(let j = 0; j < 10+20*Math.random(); j++){
		// for some reason perlin noise has an average of about -0.2
		movementAngle1 += (noise.perlin2(j/0.287+0.754, 0.2137) + 0.2) * 1;//*2/3
		movementAngle2 += (noise.perlin2(0.7132, j/0.287+0.478) + 0.2) * 1;

		// if(offsetJumps.includes(j) === true){
		// 	movementAngle1 += (noise.perlin2(Math.random()*10, Math.random()*10) + 0.2)*12;
		// 	movementAngle2 += (noise.perlin2(Math.random()*10, Math.random()*10) + 0.2)*12;
		// }
		
		const fac = (Math.abs((noise.perlin2(j/0.327+0.439, 0.73684) + 0.2)) + Math.random() / 10) / 17;
		position[0] += Math.cos(movementAngle1) * Math.cos(movementAngle2) * fac;
		position[1] += Math.sin(movementAngle1) * Math.cos(movementAngle2) * fac;
		position[2] += Math.sin(movementAngle2) * fac;
		// TODO: warp back inside bounds if outside. Can detect if outside by a dist check

		const angleToMid = Math.atan2(position[1], position[0]);
		const torusMidpoint = [
			Math.cos(angleToMid) * tunnelRadius,
			Math.sin(angleToMid) * tunnelRadius,
			0
		];
		// addStar(...torusMidpoint);
		const distToMidpt = Math.sqrt((position[0]-torusMidpoint[0])**2+(position[1]-torusMidpoint[1])**2+(position[2])**2);
		if(distToMidpt > tunnelThickness){
			// if(Math.random() < 0.5) movementAngle1 += Math.PI;
			// else movementAngle2 += Math.PI;
			// position = randomTorusPosition();
			movementAngle1 += (noise.perlin2(Math.random()*10, Math.random()*10) + 0.2)*12;
			movementAngle2 += (noise.perlin2(Math.random()*10, Math.random()*10) + 0.2)*12;
		}

		createFn(...position);// subNoise
		// addStarsWithinRadius(...position, 0.01);

		if(Math.random() < 0.032) {
			generateStarLine(structuredClone(position), createFn, recursiveAmount+1);
		}
	}
}

function addStarsWithinRadius(x,y,z,r=0.01){
	for(let i = 0; i < Math.floor(Math.abs(noise.perlin3(x/0.287+0.754, y/0.458+0.2137,z/0.328+0.1981) + 0.2)*2*3+1); i++){
		addStar(x+(Math.random()-0.5)*r,y+(Math.random()-0.5)*r,z+(Math.random()-0.5)*r);
	}
}

function addStar(x,y,z,rMult=1){
	// rMult *= 1.56; // for the thumb
	const geometry = new THREE.SphereGeometry( Math.random() * 0.001 * rMult );
	const material = new THREE.MeshBasicMaterial( { color: starColors[Math.floor(Math.random() * starColors.length)]} );
	const mesh = new THREE.Mesh( geometry, material );
	mesh.position.set(x,y,z);
	// mesh.position.x = (Math.random()-0.5)*2 * 1000; // mesh.position.y = (Math.random()-0.5)*2 * 1000; // mesh.position.z = (Math.random()-0.5)*2 * 1000;
	scene.add( mesh );
	// console.log(mesh.position);
	return mesh;
}

// function addDustsWithinRadius(x,y,z,r=0.01){
// 	if(Math.random() > 0.2) return;
// 	for(let i = 0; i < Math.floor(Math.abs(noise.perlin3(x/0.237+0.854, y/0.408+0.2317,z/0.378+0.7981) + 0.2)*18+1); i++){
// 		addDust(x+(Math.random()-0.5)*r,y+(Math.random()-0.5)*r,z+(Math.random()-0.5)*r);
// 	}
// }

// function addDust(x,y,z){
// 	const geometry = new THREE.PlaneGeometry( 0.062, 0.062 );
// 	const tex = textures.randomElement();
// 	const material = new THREE.MeshBasicMaterial( { color: 0x9eb6d3, alphaMap: tex, map: tex, transparent: true, opacity: 0.06, depthTest: false, depthWrite: false } );
// 	const mesh = new THREE.Mesh( geometry, material );
// 	mesh.position.set(
// 		x,
// 		y,
// 		z,
// 	);

// 	mesh.rotation.x = -Math.PI / 2;
// 	mesh.rotation.y = Math.PI-Math.atan2(mesh.position.y, mesh.position.x);
// 	mesh.rotation.z = Math.PI / 2;

// 	scene.add( mesh );
// 	dusts.push(mesh);
// 	return mesh;
// }

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
let imgBlobs = [];
let toCapture = false; let filesLen = 0;
// let noise95, noise176;
// let animStarted = false;
// let syncOffset = 4;
// window.onkeydown = () => {
// 	if(animStarted === true) return;
// 	animStarted = true;

// 	toCapture = true;
// 	noise95 = cameraPositions[tick+95+syncOffset];//cameraPos(t+dt*95);
// 	createText('Play now!', noise95.x, noise95.y, noise95.z, 0x1fad64, 0x1b9456);
// 	noise176 = cameraPositions[tick+176+syncOffset];//cameraPos(t+dt*176);
// 	createText('https://omnipotent.site', noise176.x, noise176.y, noise176.z, 0x383838, 0x0d0d0d);
// }
	
// }, 3000);
function animate() {
	requestAnimationFrame( animate );

	const nextCameraPos = /*cameraPositions[tick % 10000];*/nextCameraPosQueue.shift();
	camera.position.set(...nextCameraPos/*...cameraPos(t)*/);
	nextCameraPosQueue.push(cameraPos(t));
	t += dt;
	tick++;
	// console.log(tick);
	let lastRotation = camera.rotation.clone();
	camera.lookAt(/*...cameraPositions[(tick+100) % 10000]*/nextCameraPosQueue.last());
	camera.rotation.x = interpolateDirection(lastRotation.x, camera.rotation.x, 0.006);
	camera.rotation.y = interpolateDirection(lastRotation.y, camera.rotation.y, 0.006);
	camera.rotation.z = interpolateDirection(lastRotation.z, camera.rotation.z, 0.006);

	camera.rotation.x = -Math.PI / 2;
	camera.rotation.y = Math.PI-Math.atan2(camera.position.y, camera.position.x);
	camera.rotation.z = Math.PI / 2;

	// for(let i = 0; i < dusts.length; i++){
	// 	dusts[i].lookAt(camera.position);
	// }
	
	composer.render( scene, camera );

	// if(toCapture === true && filesLen < 309){
	// 	filesLen++;
	// 	canvas.toBlob((blob) => imgBlobs.push(blob));
	// }
}

// clip length: 6s

let cameraOffset = {
	radius: 0,
	radiusMag: tunnelRadius/32 * 0.6 * 0.6,
	z: 0,
	zMag: tunnelRadius/12 * 0.6 * 0.6
}
function cameraPos(t){
	let rNoise = (noise.simplex2(t*3.5/2+.18273,0.4578)+0.15)*cameraOffset.zMag;
	let zNoise = (noise.simplex2(0.78342,t*3.5/2+5.2)+0.15)*cameraOffset.zMag;
	// console.log(noise, rNoise);
	cameraOffset.radius = interpolate(cameraOffset.radius, rNoise, 0.02);
	cameraOffset.z = interpolate(cameraOffset.z, zNoise, 0.02);
	return new THREE.Vector3(
		/*x:*/ Math.cos(t/6*2*Math.PI) * (tunnelRadius+cameraOffset.radius),
		/*y:*/ Math.sin(t/6*2*Math.PI) * (tunnelRadius+cameraOffset.radius),
		/*z:*/ cameraOffset.z//0//3
	)
}
// let cameraPositions = [];
// for(let i = 0; i < 10000; i++){
// 	cameraPositions[i] = cameraPos(t);
// 	t += dt;
// }
// t = 0;


let nextCameraPosQueue = [];
for(let i = 0; i < 10; i++){
	nextCameraPosQueue.push(cameraPos(t));
	t += dt;
}

// function cameraAngle(t){
// 	return 1 / Math.atan(t/6*2*Math.PI);
// }

animate();// TODO: motion blur and better bloom (should be 9 way like the ukb visual)

window.downloadFiles = () => {
	if(confirm('Would you like to download ' + imgBlobs.length + ' files?') !== true) return;
	// Initialize a new JSZip instance
	let zip = new JSZip();

	// Define the files to be added to the zip
	let files = [];
	for(let i = 0; i < imgBlobs.length; i++){
		files.push({
			name: `file${i}.png`,
			content: imgBlobs[i]
		})
	}

	// Add files to the zip
	files.forEach(function(file) {
		zip.file(file.name, file.content);
	});

	// Generate the zip file and trigger the download
	zip.generateAsync({ type: "blob" })
		.then(function(content) {
			// Use FileSaver to save the zip file
			saveAs(content, "files.zip");
		});
}