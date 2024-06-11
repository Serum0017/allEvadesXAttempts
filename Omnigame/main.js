// 1 file project? Why not
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// run code
import gameData from './code.js';
const {tickFunctions, entities} = gameData;

const TAU = Math.PI * 2;
function render(){
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let i = 0; i < entities.length; i++){
        // i'll just render them as circles before we get images working
        // (TODO: image support)
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(entities[i].x, entities[i].y, 30, 0, TAU);
        ctx.fill();
        ctx.closePath();
    }
}

function tick(){
    for(let i = 0; i < tickFunctions.length; i++){
        for(let j = 0; j < tickFunctions[i].length; j++){
            tickFunctions[i][j]();
        }
    }
}

// gameloop
(function run(){
    tick();
    render();

    requestAnimationFrame(run);
})();

// resizing canvas
function resize(){ 
    let scale = window.innerWidth / canvas.width;
    if(window.innerHeight / canvas.height < window.innerWidth / canvas.width){
        scale = window.innerHeight / canvas.height;
    }

    canvas.style.transform = `scale(${scale})`;
    canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
    canvas.style.top =  (window.innerHeight - canvas.height) / 2 +"px";
}

window.addEventListener("resize", resize);
resize();