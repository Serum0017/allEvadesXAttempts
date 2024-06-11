let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext('2d');

const width = 1920;
const height = 1080;
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
resize([canvas]);