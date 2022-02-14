"use strict";
var gl;
var wasm_memory;
var js_objects = [null];
const decoder = new TextDecoder();
import { config } from './config.mjs';
var wasmOutputFilePath = "";

const initialize = async () => {
	try {
    
    wasmOutputFilePath = config.wasmOutputFilePath;

    function setupCanvas() {
      let canvas = document.getElementById("webgl_canvas");
      gl = canvas.getContext("webgl");
      if (!gl) {
        displayErrorMessage("Failed to get a WebGL context for the canvas")
        return;
      }
    }
    
    var importObject = {
      env: {
        setupCanvas: setupCanvas,
    
        attachShader: function (program, shader) {
          gl.attachShader(js_objects[program], js_objects[shader]);
        },
        bindBuffer: function (target, id) {
          gl.bindBuffer(target, js_objects[id]);
        },
        bufferDataF32: function (target, data_ptr, data_length, usage) {
          const data = new Float32Array(wasm_memory.buffer, data_ptr, data_length);
          gl.bufferData(target, data, usage);
        },
        bufferDataU16: function (target, data_ptr, data_length, usage) {
          const data = new Uint16Array(wasm_memory.buffer, data_ptr, data_length);
          gl.bufferData(target, data, usage);
        },
        clear: function (mask) {
          gl.clear(mask)
        },
        clearColor: function (r, g, b, a) {
          gl.clearColor(r, g, b, a);
        },
        compileShader: function (shader) {
          gl.compileShader(js_objects[shader]);
        },
        createBuffer: function () {
          return js_objects.push(gl.createBuffer()) - 1;
        },
        createProgram: function () {
          return js_objects.push(gl.createProgram()) - 1;
        },
        createShader: function (shader_type) {
          return js_objects.push(gl.createShader(shader_type)) - 1;
        },
        drawElements: function (mode, count, type, offset) {
          gl.drawElements(mode, count, type, offset);
        },
        enableVertexAttribArray: function (index) {
          gl.enableVertexAttribArray(index)
        },
        getAttribLocation: function (program, pointer, length) {
          const string_data = new Uint8Array(wasm_memory.buffer, pointer, length);
          const string = decoder.decode(string_data);
          return gl.getAttribLocation(js_objects[program], string);
        },
        linkProgram: function (program) {
          gl.linkProgram(js_objects[program]);
        },
        shaderSource: function (shader, pointer, length) {
          const string_data = new Uint8Array(wasm_memory.buffer, pointer, length);
          const string = decoder.decode(string_data);
          gl.shaderSource(js_objects[shader], string);
        },
        useProgram: function (program) {
          gl.useProgram(js_objects[program]);
        },
        vertexAttribPointer: function (index, size, type, normalized, stride, offset) {
          gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
        },
      }
    };

    fetch(wasmOutputFilePath)
    .then(async response => {
        if (!response.ok) {
          if (response.status == '404'){
            throw new Error('WASM file not found <br/> Path : ' + wasmOutputFilePath);
          }
        }
        else{
          const isWASM = response.headers.get('content-type')?.includes('application/wasm');
          if (!isWASM){
            throw new Error('File specified is not a valid web assembly file <br/> Path : ' + mod_path);
          }
          else {
            WebAssembly.instantiateStreaming(response, importObject)
            .then(results => {
              wasm_memory = results.instance.exports.memory;
              results.instance.exports.start();
            });
          }
        }
    })
    .catch(error => {
      displayErrorMessage(error);
    });

  } catch(error) { 
    displayErrorMessage(error);
	}
}

function displayErrorMessage(err){
  var errorMsgDisplay = err;
  if (err.stack) {
    errorMsgDisplay = err.stack;
  }

  viewMsg.style.fontFamily = 'Calibri';
  viewMsg.style.color = 'red';
  viewMsg.style.fontSize = '12pt';
  viewMsg.innerHTML = '<span style="text-decoration: underline; font-weight:bold">Error : </span><br/>' + `${errorMsgDisplay} \n`;

}


window.addEventListener('DOMContentLoaded', initialize)