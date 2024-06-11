window.onload = () => {
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }
}

Array.prototype.last = function() {
	return this[this.length-1];
}

Array.prototype.randomElement = function(){
    return this[Math.floor(Math.random() * this.length)];
}

function interpolate(start, end, t){
    return (1-t) * start + t*end;
}

function cubicBezier(p0, p1, p2, p3, t){
    return p0 * (-1*t**3+3*t**2-3*t+1) +
        p1 * (3*t**3 - 6*t**2 + 3*t) +
        p2 * (-3*t**3 + 3*t**2) +
        p3 * (t**3);
}

const starColors = [
    0xCCCCCC,
    0xDDDDDD,
    0xEEEEEE
	// 0xb1addb,
	// 0xfdcda5,
	// 0xfff0eb,
	// 0xc0cce7,
	// 0x7e9fd4
];

function shortAngleDist(a0,a1) {
    const max = Math.PI*2;
    const da = (a1 - a0) % max;
    return 2*da % max - da;
}

function interpolateDirection(a0,a1,t) {
    return a0 + shortAngleDist(a0,a1)*t;
}