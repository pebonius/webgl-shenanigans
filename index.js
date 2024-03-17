const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");
const vertexShaderInput = document.getElementById("vertShader");
const fragmentShaderInput = document.getElementById("fragShader");
const runButton = document.getElementById("runShaders");

function getVertexShaderSource() {
  return vertexShaderInput.value;
}

function getFragmentShaderSource() {
  return fragmentShaderInput.value;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function setupProgram(vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);
  return program;
}

function runShaders() {
  // check if webgl is working
  if (gl === null) {
    alert("webgl not working, probably your browser's fault :)");
    return;
  }

  const vertexShaderSource = getVertexShaderSource();
  const fragmentShaderSource = getFragmentShaderSource();

  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = setupProgram(vertexShader, fragmentShader);

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

clearCanvas();
