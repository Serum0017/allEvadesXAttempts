// 1 file project? Why not
const canvas = window.canvas = document.getElementById('canvas');
const ctx = window.ctx = canvas.getContext('2d');

import stuff from './components.js';
const { simulate } = stuff;

// run code
import './code.js';

window.defaultColors = {
    tile: '#0d0d0d',// the stroke and outside of arena
    background: '#383838',// the fillcolor
}

window.colors = {
    tile: window.defaultColors.tile,
    background: window.defaultColors.background,
}

const tileSize = 50;
let opaqIndex, len, j = false;
function render(os, cols){
    ctx.fillStyle = cols.background;
    ctx.fillRect(0,0,canvas.width, canvas.height);

    // render tiles
    ctx.strokeStyle = cols.tile;
    ctx.lineWidth = 2;

    for (let x = 0; x < canvas.width + ctx.lineWidth + tileSize; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.closePath();
    }

    for (let y = 0; y < canvas.height + ctx.lineWidth + tileSize; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        ctx.closePath();
    }

    // render obstacles
    for(let i = 0; i < os.length; i++){
        len = os[i].effect.length;
        if(len === 1){
            j = 0;
            ctx.toFill = true;
            ctx.toStroke = false;
            ctx.beginPath();
            os[i].renderShape(os[i]);
            os[i].renderEffect[j](os[i]);
            if(ctx.toFill === true) ctx.fill();
            if(ctx.toStroke === true) ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1;
        } else {
            // so we want to fade between the effect renders. We render a previous one with 1 opacity and then raise the next one from 0-1 opacity, until the next one becomes the previous and the cycle repeats
            os[i].renderEffectTimer += 1/128;
            if(os[i].renderEffectTimer >= len) os[i].renderEffectTimer -= len;

            opaqIndex = Math.floor(os[i].renderEffectTimer);
            /*let fullIndex*/j = opaqIndex - 1;
            if(/*fullIndex*/j === -1) /*fullIndex*/j = len-1;
            // j = fullIndex;

            // render full index
            ctx.toFill = true;
            ctx.toStroke = false;
            ctx.beginPath();
            os[i].renderShape(os[i]);
            os[i].renderEffect[j](os[i]);
            ctx.globalAlpha = 1;
            if(ctx.toFill === true) ctx.fill();
            if(ctx.toStroke === true) ctx.stroke();
            ctx.closePath();

            // render opaq index
            j = opaqIndex;
            ctx.toFill = true;
            ctx.toStroke = false;
            ctx.beginPath();
            os[i].renderShape(os[i]);
            os[i].renderEffect[j](os[i]);
            ctx.globalAlpha = os[i].renderEffectTimer - opaqIndex;
            if(ctx.toFill === true) ctx.fill();
            if(ctx.toStroke === true) ctx.stroke();
            ctx.closePath();
        }
    }
    ctx.globalAlpha = 1;

    // render player
    ctx.fillStyle = player.dead === true ? 'red' : 'black';
    ctx.beginPath();
    player.renderShape(player);
    ctx.fill();
    ctx.closePath();

    // if(player.dead === true){
    //     ctx.fillStyle = 'white';
    //     ctx.fillText('Tap to respawn', canvas.width / 2, canvas.height - 85);
    // }
}

// gameloop
(function run(){
    simulate();
    render(obstacles, window.colors);

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

    ctx.font = '62px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    window.canvasDimensions = canvas.getBoundingClientRect();
}

window.addEventListener("resize", resize);
resize();