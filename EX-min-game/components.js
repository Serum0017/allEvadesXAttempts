import './input.js';
import './SAT.js'; 

window.mouseDownFunctions.push(() => {
    if(player.dead === true){
        player.pos.x = window.spawnPosition.x;
        player.pos.y = window.spawnPosition.y;
        player.dead = false;
        player.forces.length = 0;
        window.onmouseup();
    }
})
SAT.Circle.prototype.rotate = function (angle) {
    this.pos.rotate(angle);
}

function create(shape, simulates, effects, params){
    const e = {
        sat: satMap[shape](params),
        simulate: [],
        effect: [],
        renderShape: renderShapeMap[shape],
        renderEffect: effects.map(e => renderEffectMap[e])
    };
    e.renderEffectTimer = 0;
    e.pos = e.sat.pos;
    for(let i = 0; i < simulates.length; i++){
        e.simulate.push(simulateMap[simulates[i]]);
        initSimulateMap[simulates[i]](e, params);
    }
    for(let i = 0; i < effects.length; i++){
        e.effect.push(effectMap[effects[i]]);
        initEffectMap[effects[i]](e, params);
    }
    if(params.tf !== undefined) e.simulate.push(params.tf);
    // TODO: init maps
    obstacles.push(e);
    // return e;
}
window.E = create;

let angle;
let res = new SAT.Response();
let collided = false;
function simulate(){
    // player simulation
    if(window.dragging === true && player.dead === false){
        angle = Math.atan2(window.mouseY - player.pos.y, window.mouseX - player.pos.x);
        player.pos.x += Math.cos(angle) * player.speed;
        player.pos.y += Math.sin(angle) * player.speed;
    }

    for(let i = 0; i < player.forces.length; i++){
        // [x, y, decay]
        player.pos.x += player.forces[i][0];
        player.pos.y += player.forces[i][1];
        player.forces[i][0] *= player.forces[i][2];
        player.forces[i][1] *= player.forces[i][2];
        if(Math.abs(player.forces[i][0]) < 0.01 && Math.abs(player.forces[i][1]) < 0.01){
            player.forces.splice(i,1);
            i--;
            continue;
        }
    }

    for(let i = 0; i < obstacles.length; i++){
        // collision (done before simulation because that is what last rendered frame sees)
        // TODO: bounding box check
        if(obstacles[i].sat.r !== undefined){
            collided = SAT.testCircleCircle(obstacles[i].sat, player.sat, res);
        } else {
            collided = SAT.testPolygonCircle(obstacles[i].sat, player.sat, res);
        }
        if(collided === true){
            for(let j = 0; j < obstacles[i].effect.length; j++){
                obstacles[i].effect[j](player, res, obstacles[i]);
            }
        }
        res.clear();// TODO: test if this is really needed

        // obstacle simulation
        for(let j = 0; j < obstacles[i].simulate.length; j++){
            obstacles[i].simulate[j](obstacles[i]);
        }
    }

    // bounding the player by the walls
    if(player.pos.x - player.sat.r < 0){
        player.pos.x = player.sat.r;
    } else if(player.pos.x + player.sat.r > canvas.width){
        player.pos.x = canvas.width - player.sat.r;
    }
    if(player.pos.y - player.sat.r < 0){
        player.pos.y = player.sat.r;
    } else if(player.pos.y + player.sat.r > canvas.height){
        player.pos.y = canvas.height - player.sat.r;
    }

    // (rendering happens in between)
}

// TODO: separate these off into different files
const satMap = [
    /*circle*/
    (p) => {
        // x,y,r
        return new SAT.Circle(new SAT.Vector(p.x, p.y), p.r);
    },
    /*rectangle*/
    (p) => {
        // x,y,w,h
        return new SAT.Box(new SAT.Vector(p.x, p.y), p.w, p.h).toPolygon();
    },
    /*polygon*/
    (p) => {
        // points: [[x,y], ...]
        const s = new SAT.Polygon(new SAT.Vector(), p.points.map(pt => new SAT.Vector(pt[0]-p.x, pt[1]-p.y)));
        s.pos.x = p.x;
        s.pos.y = p.y;
        return s;
    },
];

window.satMapI2N = [
    'circle',
    'rectangle',
    'polygon'
]

const TAU = Math.PI * 2;
const renderShapeMap = [
    /*circle*/
    (o) => {
        ctx.arc(o.pos.x, o.pos.y, o.sat.r, 0, TAU);
    },
    /*rectangle*/
    (o) => {
        // o.sat.calcPoints[0] is at 0,0 so we can drop that from the first two args
        if(o.hasRotated === true){
            renderShapeMap[2](o);
            return;
        }
        ctx.rect(o.pos.x, o.pos.y, o.sat.calcPoints[2].x - o.sat.calcPoints[0].x, o.sat.calcPoints[2].y - o.sat.calcPoints[0].y);
    },
    /*polygon*/
    (o) => {
        for(let i = 0; i < o.sat.points.length; i++){
            ctx.lineTo(o.pos.x + o.sat.points[i].x, o.pos.y + o.sat.points[i].y);
        }
    },
]

const initSimulateMap = [
    /*pathMove*/
    (o, init) => {
        // currentPoint, path: [[x,y,speed], ...], 
		o.currentPoint = Math.floor(init.currentPoint);
        
		o.path = init.path;// like [[x,y,speed], ...]

        o.pointOn = o.path[o.currentPoint];
        o.speed = o.pointOn[2];
        
        let nextPointIndex = o.currentPoint + 1;
        if (nextPointIndex >= o.path.length) nextPointIndex = 0;
        
        o.pointTo = o.path[nextPointIndex];
        let angle = Math.atan2(o.pointTo[1] - o.pointOn[1], o.pointTo[0] - o.pointOn[0]);
        o.xv = Math.cos(angle) * o.speed;
        o.yv = Math.sin(angle) * o.speed;

        o.timeRemain = Math.sqrt((o.pointOn[0] - o.pointTo[0])**2 + (o.pointOn[1] - o.pointTo[1])**2) / o.speed;
        
        // TODO: make this relative and not absolute, so point (0,0) and x:400,y:0 means the o would move starting from 400,0 instead of 0,0
        // const fractionalPointOffset = init.currentPoint - o.currentPoint;
        // if(fractionalPointOffset !== 0){
        //     o.timeRemain *= 1 - fractionalPointOffset;// 0.8 of the way there means timeRemain should be divided by 5
        //     o.pos.x = o.pointOn[0] * (1 - fractionalPointOffset) + fractionalPointOffset * o.pointTo[0];
        //     o.pos.y = o.pointOn[1] * (1 - fractionalPointOffset) + fractionalPointOffset * o.pointTo[1];
        // } else {
        //     o.pos.x = o.pointOn[0];
        //     o.pos.y = o.pointOn[1];
        // }
    },
    // /*rotate*/
    (o, init) => {
        // rotateSpeed, pivotX, pivotY
        o.rotateSpeed = init.rotateSpeed;
        o.pivotX = init.pivotX;
        o.pivotY = init.pivotY;
    }
]

const simulateMap = [
    /*pathMove*/
    (o) => {
        // TODO: make it dt consistent
        o.pos.x += o.xv //* timeStep;
        o.pos.y += o.yv //* timeStep;

        o.timeRemain--;
        if (o.timeRemain <= 0) {
            o.currentPoint++;
            if (o.currentPoint > o.path.length - 1) {
                o.currentPoint = 0;
            }
            
            o.pointOn = o.path[o.currentPoint];
            o.speed = o.pointOn[2];
    
            // snapping back to the point that we should be on
            // TODO: make sure this is pixel perfect and remaining time is not skipped
            o.pos.x += o.xv * o.timeRemain;
            o.pos.y += o.yv * o.timeRemain;
    
            let nextPointIndex = o.currentPoint + 1;
            if (nextPointIndex >= o.path.length) {
                nextPointIndex = 0;
            }
            
            o.pointTo = o.path[nextPointIndex];
    
            let angle = Math.atan2(o.pointTo[1] - o.pointOn[1], o.pointTo[0] - o.pointOn[0]);
            o.xv = Math.cos(angle) * o.speed;
            o.yv = Math.sin(angle) * o.speed;

            // distance / speed
            o.timeRemain = Math.sqrt((o.pointOn[0] - o.pointTo[0])**2 + (o.pointOn[1] - o.pointTo[1])**2) / o.speed;
        }
    },
    // /*rotate*/
    (o) => {
        if(o.sat.r !== undefined){
            o.pos.x -= o.pivotX;
            o.pos.y -= o.pivotY;
            o.sat.rotate(o.rotateSpeed);
            o.pos.x += o.pivotX;
            o.pos.y += o.pivotY;
        } else {
            o.sat.translate(o.pos.x-o.pivotX, o.pos.y-o.pivotY);
            o.sat.rotate(o.rotateSpeed);
            o.sat.translate(o.pivotX-o.pos.x, o.pivotY-o.pos.y);
        }
        
        o.hasRotated = true;
    }
]

window.simulateMapI2N = [
    'pathMove',
    'rotate'
]

const initEffectMap = [
    /*bound*/
    () => {},
    /*kill*/
    () => {},
    /*bounce*/
    (o, params) => {
        // bounciness, decay
        o.bounciness = params.bounciness;
        o.decay = params.decay;
    },
    /*stopForces*/
    () => {}
]

const effectMap = [
    /*bound*/
    (p, res) => {
        p.pos.x += res.overlapV.x;
        p.pos.y += res.overlapV.y;
    },
    /*kill*/
    (p) => {
        p.dead = true;
    },
    /*bounce*/
    (p, res, o) => {
        p.pos.x += res.overlapV.x;
        p.pos.y += res.overlapV.y;

        angle = Math.atan2(res.overlapV.y, res.overlapV.x);

        p.forces.push([Math.cos(angle) * o.bounciness, Math.sin(angle) * o.bounciness, o.decay]);
    },
    /*stopForces*/
    (p) => {
        p.forces.length = 0;
    }
]

window.effectMapI2N = [
    'bound',
    'kill',
    'bounce',
    'stopForces'
]

const renderEffectMap = [
    /*bound*/
    (o) => {
        ctx.fillStyle = window.colors.tile;
    },
    /*kill*/
    (o) => {
        ctx.fillStyle = '#c70000';
        ctx.strokeStyle = 'black';
        ctx.toStroke = true;
        ctx.lineWidth = 2;
    },
    /*bounce*/
    (o) => {
        ctx.fillStyle = 'blue';
    },
    /*stopForces*/
    (o) => {
        ctx.fillStyle = 'orange';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 6;
        ctx.globalAlpha = 0.1;
        ctx.toStroke = true;
    },
]

// an obstacle is an ECS
const obstacles = window.obstacles = [];

window.spawnPosition = {x: 100, y: 1500};
// a player is also an ecs
create(0/*circle*/, [], [], /*no simulate/ effects*/ {x: window.spawnPosition.x, y: window.spawnPosition.y, r: 24.5})
const player = window.player = obstacles.pop();
player.speed = 2;
player.dead = false;
player.forces = [];

export default { create, simulate, renderShapeMap, renderEffectMap };