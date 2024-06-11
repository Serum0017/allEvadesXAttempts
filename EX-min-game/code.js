// block will look like create obstacle with shape, simulate, effect and then with an option for some code inside like the forever block that will push a tickFunction
// there will be 1 workspace and variables will be shared.

// create obstacle function with shape, simulate, effect indicies, and then data
// wrapping in T will add a tickFunction, this is optional. Every entity can only have 1 tick function.
// E(0,[0],[3],{x:200,y:500,r:30,tpx:50,tpy:100,path:[[0,0,1],[100,100,2],[100,0,3]],currentPoint:0,tf:(e)=>{/*there will be apis for each shape, simulate, and effect to change params, e.g. a set x block or some other things like changeShape that can compile to a function*/}});
// E(1,[],[0],{x:500,y:1000,w:100,h:150})
// E(1,[1],[0],{x:500,y:1000,w:100,h:50,rotateSpeed:0.01,pivotX:450,pivotY:800});
// E(2,[1],[2],{points:[[100,100],[200,100],[150,175]],x:150,y:150,rotateSpeed:-0.008,pivotX:200,pivotY:200,bounciness:1,decay:0.99});

E(1,[],[0,1,2,3],{x:200,y:200,w:500,h:1200,bounciness:1,decay:0.99})

// in the tickFunction, we should have a setProperty block that's a dynamic dropdown. It should get all of the current properties of an object and allow you to change their values to anything of the same type. Complex data structures should be automatically filtered out, see next line 
// for structs like arrays and objects, there should be special methods for working with them like addPoint, changePoint of index (index) (x/y dropdown) to (number or variable)
// oh and we can decide on what props need to be included by default by running the init functions and iterating through all keys. Stuff might break, which will need fixes, but that should be faster than manually specifying keys for everything