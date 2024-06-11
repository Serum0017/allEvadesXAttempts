let canvas = document.getElementsByTagName('canvas')[0];
const scaleMult = 2;
const divisor = 320 * scaleMult;
const width = 1920 * scaleMult;
const height = 1080 * scaleMult;
resize([canvas]);

let ctx = canvas.getContext('2d');

let image = ctx.createImageData(canvas.width, canvas.height);
let data = image.data;

let h = 0;

let fn = 'simplex';
let xOffset = 0;
let yOffset = 0;

function drawFrame() {
  // Cache width and height values for the canvas.
  // let cWidth = canvas.width;
  // let cHeight = canvas.height;

  // let noisefn = noise.simplex3 /*noise.perlin3;*/
  let value, cell;
  // for (let x = 0; x < cWidth; x++) {
  //   for (let y = 0; y < cHeight; y++) {
  //       value = (noisefn((x+xOffset) / divisor, (y+yOffset) / divisor, h) * 2 + 5) % 0.59 < 0.134 ? 255 : 0;
  //       cell = (x + y * cWidth) * 4;
  //       data[cell] = data[cell + 1] = data[cell + 2] = value;
  //       data[cell + 3] = 255;
  //   }
  // }
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      value = (Math.abs(noise.simplex2(x / 1200, y / 1200))) * (Math.abs(noise.simplex2(x / 500 + Math.random(), y / 500 + Math.random()))) * 256;
  
      cell = (x + y * canvas.width) * 4;
      // data[cell] = data[cell + 1] = 
      data[cell + 2] = (value) / 3;
      // data[cell] += Math.max(0, (25 - value) * 8);
      data[cell + 3] = 255; // alpha.
    }
  }

  // convulsion kernel
  

  ctx.fillColor = 'black';
  ctx.fillRect(0, 0, 100, 100);
  ctx.putImageData(image, 0, 0);

  h += 0.0024/3;
  xOffset += 0.08/3;
  yOffset += 0.08/3;
  // requestAnimationFrame(drawFrame);
}

document.onclick = function() {
  // Swap noise function on click.
  fn = fn === 'simplex' ? 'perlin' : 'simplex';
};

requestAnimationFrame(drawFrame);

function resize(elements) {
  for (const element of elements) {
      if (element.width !== width) {
          element.width = width;
          element.style.width = `${width}px`;
      }
      if (element.height !== height) {
          element.height = height;
          element.style.height = `${height}px`;
      }
      let scaleMult = element?._scaleMult ?? 1;
      element.style.transform = `scale(${
          Math.min(window.innerWidth / width, window.innerHeight / height) *
          scaleMult
      })`;
      element.style.left = `${(window.innerWidth - width) / 2}px`;
      element.style.top = `${(window.innerHeight - height) / 2}px`;
  }
  return Math.min(window.innerWidth / width, window.innerHeight / height);
};

window.onresize = () => {
  resize([canvas]);
}