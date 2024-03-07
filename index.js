const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");
const vertexShaderInput = document.getElementById("vertShader");
const fragmentShaderInput = document.getElementById("fragShader");
const runButton = document.getElementById("runShaders");

function runShaders() {
  // check if webgl is working
  if (gl === null) {
    alert("webgl not working, probably your browser's fault :)");
    return;
  }

  // source code for vertex shader
  const vertexShaderSource = vertexShaderInput.value;

  // source code for fragment shader
  const fragmentShaderSource = fragmentShaderInput.value;

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

runButton.onclick = () => {
  try {
    runShaders();
  } catch (error) {
    console.log(error);
  }
};
