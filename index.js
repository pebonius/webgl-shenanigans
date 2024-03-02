const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

function main() {
  // check if webgl is working
  if (gl === null) {
    alert("webgl not working, probably your browser's fault :)");
    return;
  }

  // source code for vertex shader
  const vertexShaderSource = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

  // source code for fragment shader
  const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(
                sin(gl_FragCoord.x / 100.0),
                cos(gl_FragCoord.y / 100.0),
                sin(-gl_FragCoord.x / 100.0),
                0.0
            );
        }
    `;

  // before attaching shaders gotta createShader, add shaderSource, compileShader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  // createProgram, and then attachShader for both shaders, linkProgram, useProgram
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  // vertices of the triangle
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

  // what is positionBuffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // what does this do
  const positionAttributeLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // clear to solid color :)
  clearCanvas();

  // what is this magic
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

const clearCanvas = () => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
};

main();
