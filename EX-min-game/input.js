// import scroll from './scroll.js';
// import Utils from './utils.js';
// const { SCROLL_PARAMS } = Utils;

// scrolling
window.dragging = false;
// let dragging = false;
let totalDist = 0;
let dragStartTime;

// input
const canvas = document.getElementById('canvas');
window.mouseX = -1;
window.mouseY = -1;
window.mouseDownFunctions = [];
window.mouseUpFunctions = [];
window.mouseOut = false;

window.onmousedown = () => {
    // scrolling
    dragging = true;
    totalDist = 0;
    dragStartTime = Date.now();

    for(let i = 0; i < window.mouseDownFunctions.length; i++){
        window.mouseDownFunctions[i]();
    }
}

window.onmousemove = (e) => {
    // input
    window.mouseX = ((e.pageX - window.canvasDimensions.x) / window.canvasDimensions.width) * canvas.width//Math.min(1, Math.max(0, ) ;
    window.mouseY = ((e.pageY - window.canvasDimensions.y) / window.canvasDimensions.height) * canvas.height;

    window.mouseOut = false;

    if(window.mouseX < 0){
        window.mouseX = 0;
        window.mouseOut = true;
    } else if(window.mouseX > canvas.width){
        window.mouseX = canvas.width;
        window.mouseOut = true;
    }

    if(window.mouseY < 0){
        window.mouseY = 0;
        window.mouseOut = true;
    } else if(window.mouseY > canvas.height){
        window.mouseY = canvas.height;
        window.mouseOut = true;
    }

    // // scrolling
    // if(dragging === false) return;

    // totalDist -= e.movementY * window.innerHeight;

    // if(totalDist > SCROLL_PARAMS.sensitivity){
    //     const scrollTime = (Date.now() - dragStartTime);
    //     const averageSpeed = totalDist / scrollTime;
    //     if(averageSpeed > SCROLL_PARAMS.minAvgSpeed && scrollTime < SCROLL_PARAMS.maxScrollTime){
    //         dragging = false;
    //         scroll();
    //     }
    // }
}

window.onmouseup = () => {
    // scrolling
    dragging = false;

    for(let i = 0; i < window.mouseUpFunctions.length; i++){
        window.mouseUpFunctions[i]();
    }
}

// window.onmouseout = () => {
//     // scrolling
//     dragging = false;

//     for(let i = 0; i < window.mouseUpFunctions.length; i++){
//         window.mouseUpFunctions[i]();
//     }
// }

// mobile
window.ontouchstart = (e) => {
    const touch = (e.touches || e.originalEvent.touches)[0];
    if(dragging === false) {
        window.mouseX = touch.pageX;
        window.mouseY = touch.pageY;
        for(let i = 0; i < window.mouseDownFunctions.length; i++){
            window.mouseDownFunctions[i]();
        }
        return;// ignore >1 touches
    }
    window.onmousedown();
    lastTouchY = touch.pageY;
}

let lastTouchY = 0;
window.ontouchmove = (e) => {
    const touch = (e.touches || e.originalEvent.touches)[0];
    window.onmousemove({pageX: touch.pageX, pageY: touch.pageY, movementY: touch.pageY - lastTouchY});
    lastTouchY = touch.pageY;
}

window.ontouchend = (e) => {
    if(dragging === false) {
        for(let i = 0; i < window.mouseUpFunctions.length; i++){
            window.mouseUpFunctions[i]();
        }
        return;// ignore >1 touches
    }
    window.onmouseup();
    lastTouchY = (e.touches || e.originalEvent.touches)[0].pageY;
}

window.ontouchcancel = (e) => {
    window.ontouchend();
}