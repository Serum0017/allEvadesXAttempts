// entity struct: {x, y, image}
const entities = [];

// sparse array containing functions for entities of the same array index. Filled with [fn1, fn2, ...] b/c there can be multiple forever loops per function
const tickFunctions = [];

// I = init entities.
// yes, this is a redundant part of every file
function I(e) {
    e.id = entities.length;
    entities.push(e);
    tickFunctions[e.id] = [];
}

// entities are enclosed in curlies for scope
{
    // this first part will be redundant code for all entities
    const e = {x: 187, y: 256, angle: 0/*id is array index. All of these params are auto generated btw*/ /*image: Functions.generateImage*/};
    I(e);// init entity. Has to be a short name bc filesize
    
    let customVariable = 5;

    function some_function(){
        // do some stuff...
    }

    // ok so as it turns out we're not limited by space. 30k lines of code is like a megabyte and i would be suprised if anyone gets to 10k
    // so, we care about speed a lot more than mem. This means that everything should be compiled by blockly instead of calling functions for everything.

    // Old
    // F.turn_degrees_cw(e, 15);
    // F.move_steps(e, 10);
    // 
    // F.forever(() => {
    //     some_function();
    //     customVariable = customVariable + 1;
    // })

    // New
    e.angle += 15 * Math.PI / 180;
    e.x += Math.cos(e.angle) * 10;
    e.y += Math.sin(e.angle) * 10;

    tickFunctions[e.id].push(() => {
        // it's bound so we can do all the same things in here as outside
        // functional programming ftw
        customVariable = customVariable + 1;

        e.angle += 1 * Math.PI / 180;
        e.x += Math.cos(e.angle) * 1;
        e.y += Math.sin(e.angle) * 1;
    })
}

{
    const e = {x: 1064, y: 372, angle: 0 /*image: Functions.generateImage*/};
    I(e);
    
    let customVariable = 5;

    function some_function(){
        // do some stuff...
    }

    e.angle += Math.random() * 360 * Math.PI / 180;
    e.x += Math.cos(e.angle) * 10;
    e.y += Math.sin(e.angle) * 10;

    tickFunctions[e.id].push(() => {
        customVariable = customVariable + 1;

        e.angle -= 0.87632748 * Math.PI / 180;
        e.x += Math.cos(e.angle) * 1;
        e.y += Math.sin(e.angle) * 1;
    })
}

export default {entities, tickFunctions};