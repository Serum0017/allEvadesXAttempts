var container;
var camera, controls, scene, projector, renderer;
var objects = [], plane, sphere;
var composer, pass, composer2, pass2;
var mesh;
var clock = new THREE.Clock();
var lon = lat = 0, position = { x: 0, y: 0 }, isUserInteracting = false;
var keys = { up: false, left: false, right: false, down: false, forward: false, back: false };
var fov = nfov = 70;

var mCurrent = new THREE.Matrix4();
var mPrev = new THREE.Matrix4();
var tmpArray = new THREE.Matrix4();
var camTranslateSpeed = new THREE.Vector3();
var prevCamPos = new THREE.Vector3();

var mouse = new THREE.Vector2(),
offset = new THREE.Vector3(),
INTERSECTED, SELECTED;

var depthMaterial;
var meshMaterial = new THREE.MeshPhongMaterial( { color: 0x806040, specular: 0xffffff, specularity: 10, shading: THREE.FlatShading });
var meshMaterial2 = new THREE.MeshBasicMaterial( { color: 0xffffff, emissive: 0xffffff });
var sphereMaterial = new THREE.MeshNormalMaterial( { color: 0xff00ff, specular: 0x806040, specularity: 10, shading: THREE.SmoothShading });

var Params = function() {	
    this.speed = 5;
    this.blur = 1;
    this.fps = 60;
    this.animate = true;
};
var params = new Params();

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 3000 );
    camera.position.set( 10, 0, 0 );

    /*controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;*/
    controls = new THREE.OrbitControls( camera );
    controls.damping = 0.2;
    controls.keyPanSpeed = 700;

    scene = new THREE.Scene();

    scene.add( new THREE.AmbientLight( 0xb70000 ) );

    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 2000 );
    light.castShadow = true;

    light.shadowCameraNear = 200;
    light.shadowCameraFar = camera.far;
    light.shadowCameraFov = 50;

    light.shadowBias = -0.00022;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 500, -500, 2000 );
    light.castShadow = true;

    light.shadowCameraNear = 200;
    light.shadowCameraFar = camera.far;
    light.shadowCameraFov = 50;

    light.shadowBias = -0.00022;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    scene.add( light );

    sphere = new THREE.Mesh( new THREE.SphereGeometry( 1500, 30, 30 ), sphereMaterial );
    sphere.scale.x = -1;
    //scene.add( sphere );

    var s = 3;
    var g = new THREE.Geometry();
    var geometry = new THREE.BoxGeometry( 40, 40, 40 );
    //var geometry = new THREE.IcosahedronGeometry( 40, 1 );

    for ( var i = 0; i < 500; i ++ ) {

        var object = new THREE.Mesh( geometry, depthMaterial );//new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

        object.material.ambient = object.material.color;

        object.position.x = s * ( Math.random() * 1000 - 500 );
        object.position.y = s * ( Math.random() * 600 - 300 );
        object.position.z = s * ( Math.random() * 800 - 400 );

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = Math.random() * 2 + 1;
        object.scale.y = Math.random() * 2 + 1;
        object.scale.z = Math.random() * 2 + 1;

        object.updateMatrixWorld();
        //THREE.GeometryUtils.merge( g, object );
        g.merge( object.geometry, object.matrixWorld );

    }

    depthMaterial = new THREE.ShaderMaterial( {

        uniforms: {
            mNear: { type: 'f', value: camera.near },
            mFar: { type: 'f', value: camera.far },
            opacity: { type: 'f', value: 1 }
        },

        vertexShader: document.getElementById( 'vs-depthRender' ).textContent,
        fragmentShader: document.getElementById( 'fs-depthRender' ).textContent
    } );

    mesh = new THREE.Mesh( g, depthMaterial );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

    var s = 2;
    var g = new THREE.Geometry();
    var geometry = new THREE.IcosahedronGeometry( 2, 1 );

    for ( var i = 0; i < 1000; i ++ ) {

        var object = new THREE.Mesh( geometry, depthMaterial );//new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

        object.material.ambient = object.material.color;

        object.position.x = s * ( Math.random() * 1000 - 500 );
        object.position.y = s * ( Math.random() * 600 - 300 );
        object.position.z = s * ( Math.random() * 800 - 400 );

        object.updateMatrixWorld();
        g.merge( object.geometry, object.matrixWorld );

    }

    mesh2 = new THREE.Mesh( g, depthMaterial );
    scene.add( mesh2 );

    plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
    plane.visible = false;
    scene.add( plane );

    projector = new THREE.Projector();

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    document.body.appendChild( renderer.domElement );
    renderer.sortObjects = false;
    renderer.setClearColor( 0 );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    composer2 = new THREE.EffectComposer( renderer );
    composer2.addPass( new THREE.RenderPass( scene, camera ) );

    shader = {

        uniforms: {
            tDiffuse: { type: 't', value: null },
            tColor: { type: 't', value: null },
            resolution: { type: 'v2', value: new THREE.Vector2( 1, 1 ) },
            viewProjectionInverseMatrix: { type: 'm4', value: new THREE.Matrix4() },
            previousViewProjectionMatrix: { type: 'm4', value: new THREE.Matrix4() },
            velocityFactor: { type: 'f', value: 1 }
        },

        vertexShader: document.getElementById( 'vs-motionBlur' ).textContent,
        fragmentShader: document.getElementById( 'fs-motionBlur' ).textContent
    }

    pass = new THREE.ShaderPass( shader );
    pass.renderToScreen = true;
    composer.addPass( pass );

    container.appendChild( renderer.domElement );

    container.addEventListener( 'mousedown', onMouseDown, false );
    container.addEventListener( 'mousemove', onMouseMove, false );
    container.addEventListener( 'mouseup', onMouseUp, false );
    container.addEventListener( 'mousewheel', onMouseWheel, false );
    container.addEventListener( 'DOMMouseScroll', onMouseWheel, false);

    //

    window.addEventListener( 'resize', onWindowResize, false );
    onWindowResize();

    var gui = new dat.GUI();
    gui.add(params, 'speed', .1, 10 );
    gui.add(params, 'blur', .1, 10 );
    gui.add(params, 'fps', 1, 60 );
    gui.add(params, 'animate' );

}

function onWindowResize() {

    var s = 1;
    composer.setSize( s * window.innerWidth, s * window.innerHeight );
    composer2.setSize( s * window.innerWidth, s * window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( s * window.innerWidth, s * window.innerHeight );
    pass.uniforms.resolution.value.set( s * window.innerWidth, s * window.innerHeight );

}

window.addEventListener( 'keydown', function( e ) {
    switch( e.keyCode ) {
        case 87: keys.forward = true; e.preventDefault(); break;
        case 65: keys.left = true; e.preventDefault(); break;
        case 68: keys.right = true; e.preventDefault(); break;
        case 83: keys.back = true; e.preventDefault(); break;
        case 32: keys.up = true; e.preventDefault(); break;
        case 88: keys.down = true; e.preventDefault(); break;

        case 69: {
            mesh.material.uniforms.useParallaxMapping.value = !mesh.material.uniforms.useParallaxMapping.value;
        }
    }
    
} )

window.addEventListener( 'keyup', function( e ) {
    switch( e.keyCode ) {
        case 87: keys.forward = false; e.preventDefault(); break;
        case 65: keys.left = false; e.preventDefault(); break;
        case 68: keys.right = false; e.preventDefault(); break;
        case 83: keys.back = false; e.preventDefault(); break;
        case 32: keys.up = false; e.preventDefault(); break;
        case 88: keys.down = false; e.preventDefault(); break;
    }
    e.preventDefault();
} )

function onMouseDown( event ) {

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

}

var mouse = { x: 0, y: 0 }
var projector;

function animate() {

    requestAnimationFrame( animate );

    render();
    
}

var animationSpeed = 10;
var lastTime = Date.now();
var projectionMatrixInverse = new THREE.Matrix4();

function render() {
    var t = Date.now();
    if( t - lastTime > ( 1000 / params.fps ) ) {

        pass.material.uniforms.velocityFactor.value = params.blur;
        animationSpeed = .001 * params.speed;

        if( params.animate ) {
            camera.position.z = 500 * Math.sin( animationSpeed * .11 * t );
            camera.position.x = 500 * Math.sin( animationSpeed * .111 * t );
            camera.position.y = 500 * Math.sin( animationSpeed * .121 * t );
        
            camera.rotation.x = animationSpeed * .1 * t;
            camera.rotation.y = animationSpeed * .11 * t;
            camera.rotation.z = animationSpeed * .12 * t;
        }

        camera.updateMatrix();
        camera.updateMatrixWorld();

        tmpArray.copy( camera.matrixWorldInverse );
        tmpArray.multiply( camera.projectionMatrix );
        mCurrent.getInverse( tmpArray );

        pass.material.uniforms.viewProjectionInverseMatrix.value.copy( mCurrent );
        pass.material.uniforms.previousViewProjectionMatrix.value.copy( mPrev );
        
        mesh.material = meshMaterial;
        mesh2.material = meshMaterial2;
        sphere.material = sphereMaterial;
        composer2.render();

        mesh.material = depthMaterial;
        mesh2.material = depthMaterial;
        sphere.material = depthMaterial;
        pass.material.uniforms.tColor.value = composer2.renderTarget2;
        composer.render();

        mPrev.copy( tmpArray );

        prevCamPos.copy( camera.position );

        lastTime = t;

    }
}