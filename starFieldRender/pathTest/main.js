ctx.fillStyle = '#042d63'
ctx.fillRect(0,0,canvas.width,canvas.height);
for(let x = 0; x < canvas.width; x += canvas.width / 16){
  for(let y = 0; y < canvas.height; y += canvas.width / 9){
    let point = [x, y];
    let angle = Math.random() * Math.PI * 2;

    for(let i = 0; i < 100; i++){
      angle += noise.perlin2(Math.random(), Math.random()) + 0.2;

      point[0] += Math.cos(angle);
      point[1] += Math.sin(angle);

      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(point[0], point[1], 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  }
}