import { drawScene } from "./drawScene.js";
import { initBuffers } from "./initBuffers.js";

const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");
const fragmentShaderInput = document.getElementById("fragShader");
const runButton = document.getElementById("runShaders");

function getVertexShaderSource() {
  return `attribute vec4 aVertexPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }`;
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
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initShaderProgram(vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        program
      )}`
    );
    return null;
  }

  return program;
}

function runShaders() {
  if (gl === null) {
    alert("webgl not working, probably your browser's fault :)");
    return;
  }

  const vertexShaderSource = getVertexShaderSource();
  const fragmentShaderSource = getFragmentShaderSource();

  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const shaderProgram = initShaderProgram(vertexShader, fragmentShader);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };

  clearCanvas();

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  // Draw the scene
  drawScene(gl, programInfo, buffers);
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
