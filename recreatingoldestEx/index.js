const canv = document.getElementById("canvas");
const ctx = canv.getContext('2d');
canv.width  = window.innerWidth;
canv.height = window.innerHeight;

let player = {x: 0, y: 0, r: 25, xv: 0, yv: 0};
let arenaSize = 1000;
function run() {
    // render
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canv.width,canv.height);

    // border
    ctx.translate(canv.width/2-player.x, canv.height/2-player.y);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.roundRect(-arenaSize/2, -arenaSize/2, arenaSize, arenaSize, player.r);
    ctx.stroke();
    ctx.closePath();
    ctx.translate(player.x-canv.width/2, player.y-canv.height/2);

    ctx.shadowBlur = 10;
    ctx.shadowColor = 'white';
    // player
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(canv.width/2, canv.height/2, player.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.shadowBlur = 0;

    player.y += player.yv;
    player.x += player.xv;
    if(Math.abs(player.x) > arenaSize/2 - player.r){
        player.x = (arenaSize/2 - player.r) * Math.sign(player.x);
    }
    if(Math.abs(player.y) > arenaSize/2 - player.r){
        player.y = (arenaSize/2 - player.r) * Math.sign(player.y);
    }
    
    requestAnimationFrame(run);
}

run();

function resize() {
    canv.width  = window.innerWidth;
    canv.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

window.addEventListener("keydown", (e)=>{return handleKey(e, true)});
window.addEventListener("keyup", (e)=>{return handleKey(e, false)});

let input = {
    up: false,
    down: false,
    left: false,
    right: false
};
function handleKey(e, isDown) {
    if(e.repeat) return e.preventDefault();
    if(e.code === 'KeyW'){
        input.up = isDown;
    } else if(e.code === 'KeyA'){
        input.right = isDown;
    } else if(e.code === 'KeyS'){
        input.down = isDown;
    } else if(e.code === 'KeyD'){
        input.left = isDown;
    }

    player.xv = (input.left - input.right);
    player.yv = (input.down - input.up);
}