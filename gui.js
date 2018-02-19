// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module !== 'undefined' ? Module : {};

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
/*
	This file is part of probreversi. See
	<https://github.com/epsdel1994/probreversi> for detail.
*/

"use strict";

var pbr_gui = {};

pbr_gui.setup = function(fwcyan){

    fwcyan.setColor(0);

    pbr_gui.board = fwcyan.plugin.ProbReversi.Board.create();
    pbr_gui.button_undo = fwcyan.Button.create("<", 1);
    pbr_gui.button_undo.select = function(){
        Module.cwrap('ems_undo', 'number', [])();
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };
    pbr_gui.button_redo = fwcyan.Button.create(">", 1);
    pbr_gui.button_redo.select = function(){
        Module.cwrap('ems_redo', 'number', [])();
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };
    pbr_gui.button_branch = fwcyan.Button.create("branch", 1);
    pbr_gui.button_branch.select = function(){
        Module.cwrap('ems_branch', 'number', [])();
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };
    pbr_gui.button_trunk = fwcyan.Button.create("trunk", 1);
    pbr_gui.button_trunk.select = function(){
        Module.cwrap('ems_trunk', 'number', [])();
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };
    pbr_gui.button_about = fwcyan.Button.create("About");
    pbr_gui.button_about.select = function(){
        window.open("https://github.com/epsdel1994/probreversi");
    };

    fwcyan.setMain(fwcyan.Popup.create(fwcyan.Template1.create([
        pbr_gui.board,
        pbr_gui.button_undo,
        pbr_gui.button_redo,
        pbr_gui.button_branch,
        pbr_gui.button_trunk,
        fwcyan.Button.create("", 0),
        fwcyan.Button.create("", 0),
        fwcyan.Button.create("", 0),
        pbr_gui.button_about,
    ])));

    var setup_res = Module.cwrap('ems_setup', 'number', ['number'])(0.8);

    pbr_gui.board.pointCell = function(e){
        Module.cwrap('ems_move', 'number', ['number', 'number'])(e.x, e.y);
        pbr_gui.update();
        pbr_gui.fwcyan.draw();
    };

    pbr_gui.update();
};

pbr_gui.update = function(){
    var buf = Module._malloc(256);
    Module.cwrap('ems_get_str', '', ['number'])(buf);
    var board = UTF8ToString(buf);
    Module._free(buf);
    pbr_gui.board.setBoard(board);

    var can_undo = Module.cwrap('ems_can_undo', 'number', [])();
    pbr_gui.button_undo.setScore(can_undo ? 1 : 0);
    var can_redo = Module.cwrap('ems_can_redo', 'number', [])();
    pbr_gui.button_redo.setScore(can_redo ? 1 : 0);
    var can_branch = Module.cwrap('ems_can_branch', 'number', [])();
    pbr_gui.button_branch.setScore(can_branch ? 1 : 0);
    var can_trunk = Module.cwrap('ems_can_trunk', 'number', [])();
    pbr_gui.button_trunk.setScore(can_trunk ? 1 : 0);
};

kurumicl.onload = function(canvas){
    pbr_gui.fwcyan = FWcyan(canvas, [ProbReversi]);
    pbr_gui.setup(pbr_gui.fwcyan);
};
kurumicl.onresize = function(){
    pbr_gui.fwcyan.resize();
    pbr_gui.fwcyan.draw();
};



// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

Module['arguments'] = [];
Module['thisProgram'] = './this.program';
Module['quit'] = function(status, toThrow) {
  throw toThrow;
};
Module['preRun'] = [];
Module['postRun'] = [];

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() thread proxied to worker. (with Emscripten -s PROXY_TO_WORKER=1) (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)

if (Module['ENVIRONMENT']) {
  if (Module['ENVIRONMENT'] === 'WEB') {
    ENVIRONMENT_IS_WEB = true;
  } else if (Module['ENVIRONMENT'] === 'WORKER') {
    ENVIRONMENT_IS_WORKER = true;
  } else if (Module['ENVIRONMENT'] === 'NODE') {
    ENVIRONMENT_IS_NODE = true;
  } else if (Module['ENVIRONMENT'] === 'SHELL') {
    ENVIRONMENT_IS_SHELL = true;
  } else {
    throw new Error('Module[\'ENVIRONMENT\'] value is not valid. must be one of: WEB|WORKER|NODE|SHELL.');
  }
} else {
  ENVIRONMENT_IS_WEB = typeof window === 'object';
  ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function' && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
  ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
}


if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  var nodeFS;
  var nodePath;

  Module['read'] = function shell_read(filename, binary) {
    var ret;
      if (!nodeFS) nodeFS = require('fs');
      if (!nodePath) nodePath = require('path');
      filename = nodePath['normalize'](filename);
      ret = nodeFS['readFileSync'](filename);
    return binary ? ret : ret.toString();
  };

  Module['readBinary'] = function readBinary(filename) {
    var ret = Module['read'](filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };

  if (process['argv'].length > 1) {
    Module['thisProgram'] = process['argv'][1].replace(/\\/g, '/');
  }

  Module['arguments'] = process['argv'].slice(2);

  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });
  // Currently node will swallow unhandled rejections, but this behavior is
  // deprecated, and in the future it will exit with error status.
  process['on']('unhandledRejection', function(reason, p) {
    Module['printErr']('node.js exiting due to unhandled promise rejection');
    process['exit'](1);
  });

  Module['inspect'] = function () { return '[Emscripten Module object]'; };
}
else if (ENVIRONMENT_IS_SHELL) {
  if (typeof read != 'undefined') {
    Module['read'] = function shell_read(f) {
      return read(f);
    };
  }

  Module['readBinary'] = function readBinary(f) {
    var data;
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof quit === 'function') {
    Module['quit'] = function(status, toThrow) {
      quit(status);
    }
  }
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function shell_read(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
  };

  if (ENVIRONMENT_IS_WORKER) {
    Module['readBinary'] = function readBinary(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(xhr.response);
    };
  }

  Module['readAsync'] = function readAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  Module['setWindowTitle'] = function(title) { document.title = title };
}
else {
  // Unreachable because SHELL is dependent on the others
  throw new Error('unknown runtime environment');
}

// console.log is checked first, as 'print' on the web will open a print dialogue
// printErr is preferable to console.warn (works better in shells)
// bind(console) is necessary to fix IE/Edge closed dev tools panel behavior.
Module['print'] = typeof console !== 'undefined' ? console.log.bind(console) : (typeof print !== 'undefined' ? print : null);
Module['printErr'] = typeof printErr !== 'undefined' ? printErr : ((typeof console !== 'undefined' && console.warn.bind(console)) || Module['print']);

// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Merge back in the overrides
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = undefined;



// {{PREAMBLE_ADDITIONS}}

var STACK_ALIGN = 16;

// stack management, and other functionality that is provided by the compiled code,
// should not be used before it is ready
stackSave = stackRestore = stackAlloc = setTempRet0 = getTempRet0 = function() {
  abort('cannot use the stack before compiled code is ready to run, and has provided stack access');
};

function staticAlloc(size) {
  assert(!staticSealed);
  var ret = STATICTOP;
  STATICTOP = (STATICTOP + size + 15) & -16;
  return ret;
}

function dynamicAlloc(size) {
  assert(DYNAMICTOP_PTR);
  var ret = HEAP32[DYNAMICTOP_PTR>>2];
  var end = (ret + size + 15) & -16;
  HEAP32[DYNAMICTOP_PTR>>2] = end;
  if (end >= TOTAL_MEMORY) {
    var success = enlargeMemory();
    if (!success) {
      HEAP32[DYNAMICTOP_PTR>>2] = ret;
      return 0;
    }
  }
  return ret;
}

function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
  var ret = size = Math.ceil(size / factor) * factor;
  return ret;
}

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length-1] === '*') {
        return 4; // A pointer
      } else if (type[0] === 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 === 0);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    Module.printErr(text);
  }
}



var jsCallStartIndex = 1;
var functionPointers = new Array(0);

// 'sig' parameter is only used on LLVM wasm backend
function addFunction(func, sig) {
  if (typeof sig === 'undefined') {
    Module.printErr('Warning: addFunction: Provide a wasm function signature ' +
                    'string as a second argument');
  }
  var base = 0;
  for (var i = base; i < base + 0; i++) {
    if (!functionPointers[i]) {
      functionPointers[i] = func;
      return jsCallStartIndex + i;
    }
  }
  throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
}

function removeFunction(index) {
  functionPointers[index-jsCallStartIndex] = null;
}

var funcWrappers = {};

function getFuncWrapper(func, sig) {
  if (!func) return; // on null pointer, return undefined
  assert(sig);
  if (!funcWrappers[sig]) {
    funcWrappers[sig] = {};
  }
  var sigCache = funcWrappers[sig];
  if (!sigCache[func]) {
    // optimize away arguments usage in common cases
    if (sig.length === 1) {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func);
      };
    } else if (sig.length === 2) {
      sigCache[func] = function dynCall_wrapper(arg) {
        return dynCall(sig, func, [arg]);
      };
    } else {
      // general case
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func, Array.prototype.slice.call(arguments));
      };
    }
  }
  return sigCache[func];
}


function makeBigInt(low, high, unsigned) {
  return unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0));
}

function dynCall(sig, ptr, args) {
  if (args && args.length) {
    assert(args.length == sig.length-1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
  } else {
    assert(sig.length == 1);
    assert(('dynCall_' + sig) in Module, 'bad function pointer type - no table for sig \'' + sig + '\'');
    return Module['dynCall_' + sig].call(null, ptr);
  }
}


function getCompilerSetting(name) {
  throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for getCompilerSetting or emscripten_get_compiler_setting to work';
}

var Runtime = {
  // FIXME backwards compatibility layer for ports. Support some Runtime.*
  //       for now, fix it there, then remove it from here. That way we
  //       can minimize any period of breakage.
  dynCall: dynCall, // for SDL2 port
  // helpful errors
  getTempRet0: function() { abort('getTempRet0() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
  staticAlloc: function() { abort('staticAlloc() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
  stackAlloc: function() { abort('stackAlloc() is now a top-level function, after removing the Runtime object. Remove "Runtime."') },
};

// The address globals begin at. Very low in memory, for code size and optimization opportunities.
// Above 0 is static memory, starting with globals.
// Then the stack.
// Then 'dynamic' memory for sbrk.
var GLOBAL_BASE = 8;



// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html



//========================================
// Runtime essentials
//========================================

var ABORT = 0; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
  return func;
}

var JSfuncs = {
  // Helpers for cwrap -- it can't refer to Runtime directly because it might
  // be renamed by closure, instead it calls JSfuncs['stackSave'].body to find
  // out what the minified function name is.
  'stackSave': function() {
    stackSave()
  },
  'stackRestore': function() {
    stackRestore()
  },
  // type conversion from js to c
  'arrayToC' : function(arr) {
    var ret = stackAlloc(arr.length);
    writeArrayToMemory(arr, ret);
    return ret;
  },
  'stringToC' : function(str) {
    var ret = 0;
    if (str !== null && str !== undefined && str !== 0) { // null string
      // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
      var len = (str.length << 2) + 1;
      ret = stackAlloc(len);
      stringToUTF8(str, ret, len);
    }
    return ret;
  }
};
// For fast lookup of conversion functions
var toC = {'string' : JSfuncs['stringToC'], 'array' : JSfuncs['arrayToC']};

// C calling interface.
function ccall (ident, returnType, argTypes, args, opts) {
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  assert(returnType !== 'array', 'Return type should not be "array".');
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  if (returnType === 'string') ret = Pointer_stringify(ret);
  if (stack !== 0) {
    stackRestore(stack);
  }
  return ret;
}

function cwrap (ident, returnType, argTypes) {
  argTypes = argTypes || [];
  var cfunc = getCFunc(ident);
  // When the function takes numbers and returns a number, we can just return
  // the original function
  var numericArgs = argTypes.every(function(type){ return type === 'number'});
  var numericRet = returnType !== 'string';
  if (numericRet && numericArgs) {
    return cfunc;
  }
  return function() {
    return ccall(ident, returnType, argTypes, arguments);
  }
}

/** @type {function(number, number, string, boolean=)} */
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}

/** @type {function(number, string, boolean=)} */
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for getValue: ' + type);
    }
  return null;
}

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
/** @type {function((TypedArray|Array<number>|number), string, number, number=)} */
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [typeof _malloc === 'function' ? _malloc : staticAlloc, stackAlloc, staticAlloc, dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var stop;
    ptr = ret;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)>>0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(/** @type {!Uint8Array} */ (slab), ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    assert(type, 'Must know what type to store in allocate!');

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}

// Allocate memory during any stage of startup - static memory early on, dynamic memory later, malloc when ready
function getMemory(size) {
  if (!staticSealed) return staticAlloc(size);
  if (!runtimeInitialized) return dynamicAlloc(size);
  return _malloc(size);
}

/** @type {function(number, number=)} */
function Pointer_stringify(ptr, length) {
  if (length === 0 || !ptr) return '';
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = 0;
  var t;
  var i = 0;
  while (1) {
    assert(ptr + i < TOTAL_MEMORY);
    t = HEAPU8[(((ptr)+(i))>>0)];
    hasUtf |= t;
    if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (hasUtf < 128) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  return UTF8ToString(ptr);
}

// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAP8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;
function UTF8ArrayToString(u8Array, idx) {
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  while (u8Array[endPtr]) ++endPtr;

  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var u0, u1, u2, u3, u4, u5;

    var str = '';
    while (1) {
      // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
      u0 = u8Array[idx++];
      if (!u0) return str;
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      u1 = u8Array[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      u2 = u8Array[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u3 = u8Array[idx++] & 63;
        if ((u0 & 0xF8) == 0xF0) {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3;
        } else {
          u4 = u8Array[idx++] & 63;
          if ((u0 & 0xFC) == 0xF8) {
            u0 = ((u0 & 3) << 24) | (u1 << 18) | (u2 << 12) | (u3 << 6) | u4;
          } else {
            u5 = u8Array[idx++] & 63;
            u0 = ((u0 & 1) << 30) | (u1 << 24) | (u2 << 18) | (u3 << 12) | (u4 << 6) | u5;
          }
        }
      }
      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function UTF8ToString(ptr) {
  return UTF8ArrayToString(HEAPU8,ptr);
}

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 0xC0 | (u >> 6);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 0xE0 | (u >> 12);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0x1FFFFF) {
      if (outIdx + 3 >= endIdx) break;
      outU8Array[outIdx++] = 0xF0 | (u >> 18);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0x3FFFFFF) {
      if (outIdx + 4 >= endIdx) break;
      outU8Array[outIdx++] = 0xF8 | (u >> 24);
      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 5 >= endIdx) break;
      outU8Array[outIdx++] = 0xFC | (u >> 30);
      outU8Array[outIdx++] = 0x80 | ((u >> 24) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) {
      ++len;
    } else if (u <= 0x7FF) {
      len += 2;
    } else if (u <= 0xFFFF) {
      len += 3;
    } else if (u <= 0x1FFFFF) {
      len += 4;
    } else if (u <= 0x3FFFFFF) {
      len += 5;
    } else {
      len += 6;
    }
  }
  return len;
}

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;
function UTF16ToString(ptr) {
  assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  while (HEAP16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var i = 0;

    var str = '';
    while (1) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0) return str;
      ++i;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)]=codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}

function UTF32ToString(ptr) {
  assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
  assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)]=codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}

// Allocate heap space for a JS string, and write it there.
// It is the responsibility of the caller to free() that memory.
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Allocate stack space for a JS string, and write it there.
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

function demangle(func) {
  warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
  return func;
}

function demangleAll(text) {
  var regex =
    /__Z[\w\d_]+/g;
  return text.replace(regex,
    function(x) {
      var y = demangle(x);
      return x === y ? x : (x + ' [' + y + ']');
    });
}

function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
    // so try that as a special-case.
    try {
      throw new Error(0);
    } catch(e) {
      err = e;
    }
    if (!err.stack) {
      return '(no stack trace available)';
    }
  }
  return err.stack.toString();
}

function stackTrace() {
  var js = jsStackTrace();
  if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
  return demangleAll(js);
}

// Memory management

var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;
var MIN_TOTAL_MEMORY = 16777216;

function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}

var HEAP,
/** @type {ArrayBuffer} */
  buffer,
/** @type {Int8Array} */
  HEAP8,
/** @type {Uint8Array} */
  HEAPU8,
/** @type {Int16Array} */
  HEAP16,
/** @type {Uint16Array} */
  HEAPU16,
/** @type {Int32Array} */
  HEAP32,
/** @type {Uint32Array} */
  HEAPU32,
/** @type {Float32Array} */
  HEAPF32,
/** @type {Float64Array} */
  HEAPF64;

function updateGlobalBuffer(buf) {
  Module['buffer'] = buffer = buf;
}

function updateGlobalBufferViews() {
  Module['HEAP8'] = HEAP8 = new Int8Array(buffer);
  Module['HEAP16'] = HEAP16 = new Int16Array(buffer);
  Module['HEAP32'] = HEAP32 = new Int32Array(buffer);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buffer);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buffer);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buffer);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buffer);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buffer);
}

var STATIC_BASE, STATICTOP, staticSealed; // static area
var STACK_BASE, STACKTOP, STACK_MAX; // stack area
var DYNAMIC_BASE, DYNAMICTOP_PTR; // dynamic area handled by sbrk

  STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
  staticSealed = false;


// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  assert((STACK_MAX & 3) == 0);
  HEAPU32[(STACK_MAX >> 2)-1] = 0x02135467;
  HEAPU32[(STACK_MAX >> 2)-2] = 0x89BACDFE;
}

function checkStackCookie() {
  if (HEAPU32[(STACK_MAX >> 2)-1] != 0x02135467 || HEAPU32[(STACK_MAX >> 2)-2] != 0x89BACDFE) {
    abort('Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x02135467, but received 0x' + HEAPU32[(STACK_MAX >> 2)-2].toString(16) + ' ' + HEAPU32[(STACK_MAX >> 2)-1].toString(16));
  }
  // Also test the global address 0 for integrity. This check is not compatible with SAFE_SPLIT_MEMORY though, since that mode already tests all address 0 accesses on its own.
  if (HEAP32[0] !== 0x63736d65 /* 'emsc' */) throw 'Runtime error: The application has corrupted its heap memory area (address zero)!';
}

function abortStackOverflow(allocSize) {
  abort('Stack overflow! Attempted to allocate ' + allocSize + ' bytes on the stack, but stack has only ' + (STACK_MAX - stackSave() + allocSize) + ' bytes available!');
}

function abortOnCannotGrowMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or (4) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
}


function enlargeMemory() {
  abortOnCannotGrowMemory();
}


var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
if (TOTAL_MEMORY < TOTAL_STACK) Module.printErr('TOTAL_MEMORY should be larger than TOTAL_STACK, was ' + TOTAL_MEMORY + '! (TOTAL_STACK=' + TOTAL_STACK + ')');

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined,
       'JS engine does not provide full typed array support');



// Use a provided buffer, if there is one, or else allocate a new one
if (Module['buffer']) {
  buffer = Module['buffer'];
  assert(buffer.byteLength === TOTAL_MEMORY, 'provided buffer should be ' + TOTAL_MEMORY + ' bytes, but it is ' + buffer.byteLength);
} else {
  // Use a WebAssembly memory where available
  {
    buffer = new ArrayBuffer(TOTAL_MEMORY);
  }
  assert(buffer.byteLength === TOTAL_MEMORY);
  Module['buffer'] = buffer;
}
updateGlobalBufferViews();


function getTotalMemory() {
  return TOTAL_MEMORY;
}

// Endianness check (note: assumes compiler arch was little-endian)
  HEAP32[0] = 0x63736d65; /* 'emsc' */
HEAP16[1] = 0x6373;
if (HEAPU8[2] !== 0x73 || HEAPU8[3] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Module['dynCall_v'](func);
      } else {
        Module['dynCall_vi'](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;
var runtimeExited = false;


function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  checkStackCookie();
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  checkStackCookie();
  callRuntimeCallbacks(__ATEXIT__);
  runtimeExited = true;
}

function postRun() {
  checkStackCookie();
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
/** @deprecated */
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var /** @type {number} */ lastChar, /** @type {number} */ end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}

function writeArrayToMemory(array, buffer) {
  assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
  HEAP8.set(array, buffer);
}

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    assert(str.charCodeAt(i) === str.charCodeAt(i)&0xff);
    HEAP8[((buffer++)>>0)]=str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)]=0;
}

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

assert(Math['imul'] && Math['fround'] && Math['clz32'] && Math['trunc'], 'this is a legacy browser, build with LEGACY_VM_SUPPORT');

var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_max = Math.max;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
  return id;
}

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval !== 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(function() {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            Module.printErr('still waiting on run dependencies:');
          }
          Module.printErr('dependency: ' + dep);
        }
        if (shown) {
          Module.printErr('(end of list)');
        }
      }, 10000);
    }
  } else {
    Module.printErr('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    Module.printErr('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data



var memoryInitializer = null;



var /* show errors on likely calls to FS when it was not included */ FS = {
  error: function() {
    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with  -s FORCE_FILESYSTEM=1');
  },
  init: function() { FS.error() },
  createDataFile: function() { FS.error() },
  createPreloadedFile: function() { FS.error() },
  createLazyFile: function() { FS.error() },
  open: function() { FS.error() },
  mkdev: function() { FS.error() },
  registerDevice: function() { FS.error() },
  analyzePath: function() { FS.error() },
  loadFilesFromDB: function() { FS.error() },

  ErrnoError: function ErrnoError() { FS.error() },
};
Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;



// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  return String.prototype.startsWith ?
      filename.startsWith(dataURIPrefix) :
      filename.indexOf(dataURIPrefix) === 0;
}





// === Body ===

var ASM_CONSTS = [];




STATIC_BASE = GLOBAL_BASE;

STATICTOP = STATIC_BASE + 4624;
/* global initializers */  __ATINIT__.push();


/* memory initializer */ allocate([0,0,0,0,0,0,0,0,255,255,255,255,1,0,0,0,255,255,255,255,1,0,0,0,255,255,255,255,1,0,0,0,255,255,255,255,1,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255,1,0,0,0,1,0,0,0,255,255,255,255,5,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,3,0,0,0,12,14,0,0,0,4,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,220,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,91,93,0,45,45,0,37,48,50,100,0,111,0,17,0,10,0,17,17,17,0,0,0,0,5,0,0,0,0,0,0,9,0,0,0,0,11,0,0,0,0,0,0,0,0,17,0,15,10,17,17,17,3,10,7,0,1,19,9,11,11,0,0,9,6,11,0,0,11,0,6,17,0,0,0,17,17,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,17,0,10,10,17,17,17,0,10,0,0,2,0,9,11,0,0,0,9,0,11,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,12,0,0,0,0,9,12,0,0,0,0,0,12,0,0,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,14,0,0,0,0,0,0,0,0,0,0,0,13,0,0,0,4,13,0,0,0,0,9,14,0,0,0,0,0,14,0,0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,0,15,0,0,0,0,9,16,0,0,0,0,0,16,0,0,16,0,0,18,0,0,0,18,18,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,0,0,0,18,18,18,0,0,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,0,0,0,0,10,0,0,0,0,10,0,0,0,0,9,11,0,0,0,0,0,11,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,12,0,0,0,0,9,12,0,0,0,0,0,12,0,0,12,0,0,45,43,32,32,32,48,88,48,120,0,40,110,117,108,108,41,0,45,48,88,43,48,88,32,48,88,45,48,120,43,48,120,32,48,120,0,105,110,102,0,73,78,70,0,110,97,110,0,78,65,78,0,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,46,0,84,33,34,25,13,1,2,3,17,75,28,12,16,4,11,29,18,30,39,104,110,111,112,113,98,32,5,6,15,19,20,21,26,8,22,7,40,36,23,24,9,10,14,27,31,37,35,131,130,125,38,42,43,60,61,62,63,67,71,74,77,88,89,90,91,92,93,94,95,96,97,99,100,101,102,103,105,106,107,108,114,115,116,121,122,123,124,0,73,108,108,101,103,97,108,32,98,121,116,101,32,115,101,113,117,101,110,99,101,0,68,111,109,97,105,110,32,101,114,114,111,114,0,82,101,115,117,108,116,32,110,111,116,32,114,101,112,114,101,115,101,110,116,97,98,108,101,0,78,111,116,32,97,32,116,116,121,0,80,101,114,109,105,115,115,105,111,110,32,100,101,110,105,101,100,0,79,112,101,114,97,116,105,111,110,32,110,111,116,32,112,101,114,109,105,116,116,101,100,0,78,111,32,115,117,99,104,32,102,105,108,101,32,111,114,32,100,105,114,101,99,116,111,114,121,0,78,111,32,115,117,99,104,32,112,114,111,99,101,115,115,0,70,105,108,101,32,101,120,105,115,116,115,0,86,97,108,117,101,32,116,111,111,32,108,97,114,103,101,32,102,111,114,32,100,97,116,97,32,116,121,112,101,0,78,111,32,115,112,97,99,101,32,108,101,102,116,32,111,110,32,100,101,118,105,99,101,0,79,117,116,32,111,102,32,109,101,109,111,114,121,0,82,101,115,111,117,114,99,101,32,98,117,115,121,0,73,110,116,101,114,114,117,112,116,101,100,32,115,121,115,116,101,109,32,99,97,108,108,0,82,101,115,111,117,114,99,101,32,116,101,109,112,111,114,97,114,105,108,121,32,117,110,97,118,97,105,108,97,98,108,101,0,73,110,118,97,108,105,100,32,115,101,101,107,0,67,114,111,115,115,45,100,101,118,105,99,101,32,108,105,110,107,0,82,101,97,100,45,111,110,108,121,32,102,105,108,101,32,115,121,115,116,101,109,0,68,105,114,101,99,116,111,114,121,32,110,111,116,32,101,109,112,116,121,0,67,111,110,110,101,99,116,105,111,110,32,114,101,115,101,116,32,98,121,32,112,101,101,114,0,79,112,101,114,97,116,105,111,110,32,116,105,109,101,100,32,111,117,116,0,67,111,110,110,101,99,116,105,111,110,32,114,101,102,117,115,101,100,0,72,111,115,116,32,105,115,32,100,111,119,110,0,72,111,115,116,32,105,115,32,117,110,114,101,97,99,104,97,98,108,101,0,65,100,100,114,101,115,115,32,105,110,32,117,115,101,0,66,114,111,107,101,110,32,112,105,112,101,0,73,47,79,32,101,114,114,111,114,0,78,111,32,115,117,99,104,32,100,101,118,105,99,101,32,111,114,32,97,100,100,114,101,115,115,0,66,108,111,99,107,32,100,101,118,105,99,101,32,114,101,113,117,105,114,101,100,0,78,111,32,115,117,99,104,32,100,101,118,105,99,101,0,78,111,116,32,97,32,100,105,114,101,99,116,111,114,121,0,73,115,32,97,32,100,105,114,101,99,116,111,114,121,0,84,101,120,116,32,102,105,108,101,32,98,117,115,121,0,69,120,101,99,32,102,111,114,109,97,116,32,101,114,114,111,114,0,73,110,118,97,108,105,100,32,97,114,103,117,109,101,110,116,0,65,114,103,117,109,101,110,116,32,108,105,115,116,32,116,111,111,32,108,111,110,103,0,83,121,109,98,111,108,105,99,32,108,105,110,107,32,108,111,111,112,0,70,105,108,101,110,97,109,101,32,116,111,111,32,108,111,110,103,0,84,111,111,32,109,97,110,121,32,111,112,101,110,32,102,105,108,101,115,32,105,110,32,115,121,115,116,101,109,0,78,111,32,102,105,108,101,32,100,101,115,99,114,105,112,116,111,114,115,32,97,118,97,105,108,97,98,108,101,0,66,97,100,32,102,105,108,101,32,100,101,115,99,114,105,112,116,111,114,0,78,111,32,99,104,105,108,100,32,112,114,111,99,101,115,115,0,66,97,100,32,97,100,100,114,101,115,115,0,70,105,108,101,32,116,111,111,32,108,97,114,103,101,0,84,111,111,32,109,97,110,121,32,108,105,110,107,115,0,78,111,32,108,111,99,107,115,32,97,118,97,105,108,97,98,108,101,0,82,101,115,111,117,114,99,101,32,100,101,97,100,108,111,99,107,32,119,111,117,108,100,32,111,99,99,117,114,0,83,116,97,116,101,32,110,111,116,32,114,101,99,111,118,101,114,97,98,108,101,0,80,114,101,118,105,111,117,115,32,111,119,110,101,114,32,100,105,101,100,0,79,112,101,114,97,116,105,111,110,32,99,97,110,99,101,108,101,100,0,70,117,110,99,116,105,111,110,32,110,111,116,32,105,109,112,108,101,109,101,110,116,101,100,0,78,111,32,109,101,115,115,97,103,101,32,111,102,32,100,101,115,105,114,101,100,32,116,121,112,101,0,73,100,101,110,116,105,102,105,101,114,32,114,101,109,111,118,101,100,0,68,101,118,105,99,101,32,110,111,116,32,97,32,115,116,114,101,97,109,0,78,111,32,100,97,116,97,32,97,118,97,105,108,97,98,108,101,0,68,101,118,105,99,101,32,116,105,109,101,111,117,116,0,79,117,116,32,111,102,32,115,116,114,101,97,109,115,32,114,101,115,111,117,114,99,101,115,0,76,105,110,107,32,104,97,115,32,98,101,101,110,32,115,101,118,101,114,101,100,0,80,114,111,116,111,99,111,108,32,101,114,114,111,114,0,66,97,100,32,109,101,115,115,97,103,101,0,70,105,108,101,32,100,101,115,99,114,105,112,116,111,114,32,105,110,32,98,97,100,32,115,116,97,116,101,0,78,111,116,32,97,32,115,111,99,107,101,116,0,68,101,115,116,105,110,97,116,105,111,110,32,97,100,100,114,101,115,115,32,114,101,113,117,105,114,101,100,0,77,101,115,115,97,103,101,32,116,111,111,32,108,97,114,103,101,0,80,114,111,116,111,99,111,108,32,119,114,111,110,103,32,116,121,112,101,32,102,111,114,32,115,111,99,107,101,116,0,80,114,111,116,111,99,111,108,32,110,111,116,32,97,118,97,105,108,97,98,108,101,0,80,114,111,116,111,99,111,108,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,83,111,99,107,101,116,32,116,121,112,101,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,78,111,116,32,115,117,112,112,111,114,116,101,100,0,80,114,111,116,111,99,111,108,32,102,97,109,105,108,121,32,110,111,116,32,115,117,112,112,111,114,116,101,100,0,65,100,100,114,101,115,115,32,102,97,109,105,108,121,32,110,111,116,32,115,117,112,112,111,114,116,101,100,32,98,121,32,112,114,111,116,111,99,111,108,0,65,100,100,114,101,115,115,32,110,111,116,32,97,118,97,105,108,97,98,108,101,0,78,101,116,119,111,114,107,32,105,115,32,100,111,119,110,0,78,101,116,119,111,114,107,32,117,110,114,101,97,99,104,97,98,108,101,0,67,111,110,110,101,99,116,105,111,110,32,114,101,115,101,116,32,98,121,32,110,101,116,119,111,114,107,0,67,111,110,110,101,99,116,105,111,110,32,97,98,111,114,116,101,100,0,78,111,32,98,117,102,102,101,114,32,115,112,97,99,101,32,97,118,97,105,108,97,98,108,101,0,83,111,99,107,101,116,32,105,115,32,99,111,110,110,101,99,116,101,100,0,83,111,99,107,101,116,32,110,111,116,32,99,111,110,110,101,99,116,101,100,0,67,97,110,110,111,116,32,115,101,110,100,32,97,102,116,101,114,32,115,111,99,107,101,116,32,115,104,117,116,100,111,119,110,0,79,112,101,114,97,116,105,111,110,32,97,108,114,101,97,100,121,32,105,110,32,112,114,111,103,114,101,115,115,0,79,112,101,114,97,116,105,111,110,32,105,110,32,112,114,111,103,114,101,115,115,0,83,116,97,108,101,32,102,105,108,101,32,104,97,110,100,108,101,0,82,101,109,111,116,101,32,73,47,79,32,101,114,114,111,114,0,81,117,111,116,97,32,101,120,99,101,101,100,101,100,0,78,111,32,109,101,100,105,117,109,32,102,111,117,110,100,0,87,114,111,110,103,32,109,101,100,105,117,109,32,116,121,112,101,0,78,111,32,101,114,114,111,114,32,105,110,102,111,114,109,97,116,105,111,110,0,0], "i8", ALLOC_NONE, GLOBAL_BASE);





/* no memory initializer */
var tempDoublePtr = STATICTOP; STATICTOP += 16;

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}

// {{PRE_LIBRARY}}


  function ___lock() {}

  
  var SYSCALLS={varargs:0,get:function (varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function () {
        var ret = Pointer_stringify(SYSCALLS.get());
        return ret;
      },get64:function () {
        var low = SYSCALLS.get(), high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      },getZero:function () {
        assert(SYSCALLS.get() === 0);
      }};function ___syscall140(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // llseek
      var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
      // NOTE: offset_high is unused - Emscripten's off_t is 32-bit
      var offset = offset_low;
      FS.llseek(stream, offset, whence);
      HEAP32[((result)>>2)]=stream.position;
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  
  function flush_NO_FILESYSTEM() {
      // flush anything remaining in the buffers during shutdown
      var fflush = Module["_fflush"];
      if (fflush) fflush(0);
      var printChar = ___syscall146.printChar;
      if (!printChar) return;
      var buffers = ___syscall146.buffers;
      if (buffers[1].length) printChar(1, 10);
      if (buffers[2].length) printChar(2, 10);
    }function ___syscall146(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // writev
      // hack to support printf in NO_FILESYSTEM
      var stream = SYSCALLS.get(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
      var ret = 0;
      if (!___syscall146.buffers) {
        ___syscall146.buffers = [null, [], []]; // 1 => stdout, 2 => stderr
        ___syscall146.printChar = function(stream, curr) {
          var buffer = ___syscall146.buffers[stream];
          assert(buffer);
          if (curr === 0 || curr === 10) {
            (stream === 1 ? Module['print'] : Module['printErr'])(UTF8ArrayToString(buffer, 0));
            buffer.length = 0;
          } else {
            buffer.push(curr);
          }
        };
      }
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[(((iov)+(i*8))>>2)];
        var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
        for (var j = 0; j < len; j++) {
          ___syscall146.printChar(stream, HEAPU8[ptr+j]);
        }
        ret += len;
      }
      return ret;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall54(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // ioctl
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall6(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // close
      var stream = SYSCALLS.getStreamFromFD();
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  
  
   
  
   
  
  var cttz_i8 = allocate([8,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,7,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,6,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,5,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0,4,0,1,0,2,0,1,0,3,0,1,0,2,0,1,0], "i8", ALLOC_STATIC);   

  function ___unlock() {}

   

  function _abort() {
      Module['abort']();
    }

   

   



   

  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 

   

  
  function ___setErrNo(value) {
      if (Module['___errno_location']) HEAP32[((Module['___errno_location']())>>2)]=value;
      else Module.printErr('failed to set errno from JS');
      return value;
    } 
DYNAMICTOP_PTR = staticAlloc(4);

STACK_BASE = STACKTOP = alignMemory(STATICTOP);

STACK_MAX = STACK_BASE + TOTAL_STACK;

DYNAMIC_BASE = alignMemory(STACK_MAX);

HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;

staticSealed = true; // seal the static portion of memory

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");

var ASSERTIONS = true;

/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      if (ASSERTIONS) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      }
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}



function nullFunc_ii(x) { Module["printErr"]("Invalid function pointer called with signature 'ii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function nullFunc_iiii(x) { Module["printErr"]("Invalid function pointer called with signature 'iiii'. Perhaps this is an invalid value (e.g. caused by calling a virtual method on a NULL pointer)? Or calling a function with an incorrect type, which will fail? (it is worth building your source files with -Werror (warnings are errors), as warnings can indicate undefined behavior which can cause this)");  Module["printErr"]("Build with ASSERTIONS=2 for more info.");abort(x) }

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    Module["setThrew"](1, 0);
  }
}

Module.asmGlobalArg = { "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array, "NaN": NaN, "Infinity": Infinity };

Module.asmLibraryArg = { "abort": abort, "assert": assert, "enlargeMemory": enlargeMemory, "getTotalMemory": getTotalMemory, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "abortStackOverflow": abortStackOverflow, "nullFunc_ii": nullFunc_ii, "nullFunc_iiii": nullFunc_iiii, "invoke_ii": invoke_ii, "invoke_iiii": invoke_iiii, "___lock": ___lock, "___setErrNo": ___setErrNo, "___syscall140": ___syscall140, "___syscall146": ___syscall146, "___syscall54": ___syscall54, "___syscall6": ___syscall6, "___unlock": ___unlock, "_abort": _abort, "_emscripten_memcpy_big": _emscripten_memcpy_big, "flush_NO_FILESYSTEM": flush_NO_FILESYSTEM, "DYNAMICTOP_PTR": DYNAMICTOP_PTR, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "cttz_i8": cttz_i8 };
// EMSCRIPTEN_START_ASM
var asm = (/** @suppress {uselessCode} */ function(global, env, buffer) {
'almost asm';


  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);

  var DYNAMICTOP_PTR=env.DYNAMICTOP_PTR|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;
  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;
  var cttz_i8=env.cttz_i8|0;

  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var nan = global.NaN, inf = global.Infinity;
  var tempInt = 0, tempBigInt = 0, tempBigIntS = 0, tempValue = 0, tempDouble = 0.0;
  var tempRet0 = 0;

  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var Math_min=global.Math.min;
  var Math_max=global.Math.max;
  var Math_clz32=global.Math.clz32;
  var abort=env.abort;
  var assert=env.assert;
  var enlargeMemory=env.enlargeMemory;
  var getTotalMemory=env.getTotalMemory;
  var abortOnCannotGrowMemory=env.abortOnCannotGrowMemory;
  var abortStackOverflow=env.abortStackOverflow;
  var nullFunc_ii=env.nullFunc_ii;
  var nullFunc_iiii=env.nullFunc_iiii;
  var invoke_ii=env.invoke_ii;
  var invoke_iiii=env.invoke_iiii;
  var ___lock=env.___lock;
  var ___setErrNo=env.___setErrNo;
  var ___syscall140=env.___syscall140;
  var ___syscall146=env.___syscall146;
  var ___syscall54=env.___syscall54;
  var ___syscall6=env.___syscall6;
  var ___unlock=env.___unlock;
  var _abort=env._abort;
  var _emscripten_memcpy_big=env._emscripten_memcpy_big;
  var flush_NO_FILESYSTEM=env.flush_NO_FILESYSTEM;
  var tempFloat = 0.0;

// EMSCRIPTEN_START_FUNCS

function stackAlloc(size) {
  size = size|0;
  var ret = 0;
  ret = STACKTOP;
  STACKTOP = (STACKTOP + size)|0;
  STACKTOP = (STACKTOP + 15)&-16;
  if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(size|0);

  return ret|0;
}
function stackSave() {
  return STACKTOP|0;
}
function stackRestore(top) {
  top = top|0;
  STACKTOP = top;
}
function establishStackSpace(stackBase, stackMax) {
  stackBase = stackBase|0;
  stackMax = stackMax|0;
  STACKTOP = stackBase;
  STACK_MAX = stackMax;
}

function setThrew(threw, value) {
  threw = threw|0;
  value = value|0;
  if ((__THREW__|0) == 0) {
    __THREW__ = threw;
    threwValue = value;
  }
}

function setTempRet0(value) {
  value = value|0;
  tempRet0 = value;
}
function getTempRet0() {
  return tempRet0|0;
}

function _board_create($0) {
 $0 = +$0;
 var $1 = 0.0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0;
 var $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0;
 var $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0;
 var $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0.0, $75 = 0, $76 = 0, $77 = 0;
 var $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0.0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0.0, $89 = 0.0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0;
 var $96 = 0.0, $97 = 0.0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $1 = $0;
 $7 = (_malloc(8)|0); //@line 19 "./board.c"
 $2 = $7; //@line 19 "./board.c"
 $8 = (_malloc(32)|0); //@line 20 "./board.c"
 $9 = $2; //@line 20 "./board.c"
 HEAP32[$9>>2] = $8; //@line 20 "./board.c"
 $10 = (_malloc(32)|0); //@line 21 "./board.c"
 $11 = $2; //@line 21 "./board.c"
 $12 = ((($11)) + 4|0); //@line 21 "./board.c"
 HEAP32[$12>>2] = $10; //@line 21 "./board.c"
 $3 = 0; //@line 22 "./board.c"
 while(1) {
  $13 = $3; //@line 22 "./board.c"
  $14 = ($13|0)<(8); //@line 22 "./board.c"
  if (!($14)) {
   break;
  }
  $15 = (_malloc(8)|0); //@line 23 "./board.c"
  $16 = $2; //@line 23 "./board.c"
  $17 = HEAP32[$16>>2]|0; //@line 23 "./board.c"
  $18 = $3; //@line 23 "./board.c"
  $19 = (($17) + ($18<<2)|0); //@line 23 "./board.c"
  HEAP32[$19>>2] = $15; //@line 23 "./board.c"
  $20 = (_malloc(64)|0); //@line 24 "./board.c"
  $21 = $2; //@line 24 "./board.c"
  $22 = ((($21)) + 4|0); //@line 24 "./board.c"
  $23 = HEAP32[$22>>2]|0; //@line 24 "./board.c"
  $24 = $3; //@line 24 "./board.c"
  $25 = (($23) + ($24<<2)|0); //@line 24 "./board.c"
  HEAP32[$25>>2] = $20; //@line 24 "./board.c"
  $4 = 0; //@line 25 "./board.c"
  while(1) {
   $26 = $4; //@line 25 "./board.c"
   $27 = ($26|0)<(8); //@line 25 "./board.c"
   if (!($27)) {
    break;
   }
   $28 = $2; //@line 26 "./board.c"
   $29 = HEAP32[$28>>2]|0; //@line 26 "./board.c"
   $30 = $3; //@line 26 "./board.c"
   $31 = (($29) + ($30<<2)|0); //@line 26 "./board.c"
   $32 = HEAP32[$31>>2]|0; //@line 26 "./board.c"
   $33 = $4; //@line 26 "./board.c"
   $34 = (($32) + ($33)|0); //@line 26 "./board.c"
   HEAP8[$34>>0] = 0; //@line 26 "./board.c"
   $35 = $4; //@line 25 "./board.c"
   $36 = (($35) + 1)|0; //@line 25 "./board.c"
   $4 = $36; //@line 25 "./board.c"
  }
  $37 = $3; //@line 22 "./board.c"
  $38 = (($37) + 1)|0; //@line 22 "./board.c"
  $3 = $38; //@line 22 "./board.c"
 }
 $5 = 0; //@line 30 "./board.c"
 while(1) {
  $39 = $5; //@line 30 "./board.c"
  $40 = ($39|0)<(8); //@line 30 "./board.c"
  if (!($40)) {
   break;
  }
  $6 = 0; //@line 31 "./board.c"
  while(1) {
   $41 = $6; //@line 31 "./board.c"
   $42 = ($41|0)<(8); //@line 31 "./board.c"
   if (!($42)) {
    break;
   }
   $43 = $2; //@line 32 "./board.c"
   $44 = HEAP32[$43>>2]|0; //@line 32 "./board.c"
   $45 = $5; //@line 32 "./board.c"
   $46 = (($44) + ($45<<2)|0); //@line 32 "./board.c"
   $47 = HEAP32[$46>>2]|0; //@line 32 "./board.c"
   $48 = $6; //@line 32 "./board.c"
   $49 = (($47) + ($48)|0); //@line 32 "./board.c"
   HEAP8[$49>>0] = 0; //@line 32 "./board.c"
   $50 = $6; //@line 31 "./board.c"
   $51 = (($50) + 1)|0; //@line 31 "./board.c"
   $6 = $51; //@line 31 "./board.c"
  }
  $52 = $5; //@line 30 "./board.c"
  $53 = (($52) + 1)|0; //@line 30 "./board.c"
  $5 = $53; //@line 30 "./board.c"
 }
 $54 = $2; //@line 36 "./board.c"
 $55 = HEAP32[$54>>2]|0; //@line 36 "./board.c"
 $56 = ((($55)) + 12|0); //@line 36 "./board.c"
 $57 = HEAP32[$56>>2]|0; //@line 36 "./board.c"
 $58 = ((($57)) + 3|0); //@line 36 "./board.c"
 HEAP8[$58>>0] = 1; //@line 36 "./board.c"
 $59 = $2; //@line 37 "./board.c"
 $60 = HEAP32[$59>>2]|0; //@line 37 "./board.c"
 $61 = ((($60)) + 16|0); //@line 37 "./board.c"
 $62 = HEAP32[$61>>2]|0; //@line 37 "./board.c"
 $63 = ((($62)) + 3|0); //@line 37 "./board.c"
 HEAP8[$63>>0] = 1; //@line 37 "./board.c"
 $64 = $2; //@line 38 "./board.c"
 $65 = HEAP32[$64>>2]|0; //@line 38 "./board.c"
 $66 = ((($65)) + 12|0); //@line 38 "./board.c"
 $67 = HEAP32[$66>>2]|0; //@line 38 "./board.c"
 $68 = ((($67)) + 4|0); //@line 38 "./board.c"
 HEAP8[$68>>0] = 1; //@line 38 "./board.c"
 $69 = $2; //@line 39 "./board.c"
 $70 = HEAP32[$69>>2]|0; //@line 39 "./board.c"
 $71 = ((($70)) + 16|0); //@line 39 "./board.c"
 $72 = HEAP32[$71>>2]|0; //@line 39 "./board.c"
 $73 = ((($72)) + 4|0); //@line 39 "./board.c"
 HEAP8[$73>>0] = 1; //@line 39 "./board.c"
 $74 = $1; //@line 41 "./board.c"
 $75 = $2; //@line 41 "./board.c"
 $76 = ((($75)) + 4|0); //@line 41 "./board.c"
 $77 = HEAP32[$76>>2]|0; //@line 41 "./board.c"
 $78 = ((($77)) + 12|0); //@line 41 "./board.c"
 $79 = HEAP32[$78>>2]|0; //@line 41 "./board.c"
 $80 = ((($79)) + 32|0); //@line 41 "./board.c"
 HEAPF64[$80>>3] = $74; //@line 41 "./board.c"
 $81 = $1; //@line 42 "./board.c"
 $82 = $2; //@line 42 "./board.c"
 $83 = ((($82)) + 4|0); //@line 42 "./board.c"
 $84 = HEAP32[$83>>2]|0; //@line 42 "./board.c"
 $85 = ((($84)) + 16|0); //@line 42 "./board.c"
 $86 = HEAP32[$85>>2]|0; //@line 42 "./board.c"
 $87 = ((($86)) + 24|0); //@line 42 "./board.c"
 HEAPF64[$87>>3] = $81; //@line 42 "./board.c"
 $88 = $1; //@line 43 "./board.c"
 $89 = 1.0 - $88; //@line 43 "./board.c"
 $90 = $2; //@line 43 "./board.c"
 $91 = ((($90)) + 4|0); //@line 43 "./board.c"
 $92 = HEAP32[$91>>2]|0; //@line 43 "./board.c"
 $93 = ((($92)) + 12|0); //@line 43 "./board.c"
 $94 = HEAP32[$93>>2]|0; //@line 43 "./board.c"
 $95 = ((($94)) + 24|0); //@line 43 "./board.c"
 HEAPF64[$95>>3] = $89; //@line 43 "./board.c"
 $96 = $1; //@line 44 "./board.c"
 $97 = 1.0 - $96; //@line 44 "./board.c"
 $98 = $2; //@line 44 "./board.c"
 $99 = ((($98)) + 4|0); //@line 44 "./board.c"
 $100 = HEAP32[$99>>2]|0; //@line 44 "./board.c"
 $101 = ((($100)) + 16|0); //@line 44 "./board.c"
 $102 = HEAP32[$101>>2]|0; //@line 44 "./board.c"
 $103 = ((($102)) + 32|0); //@line 44 "./board.c"
 HEAPF64[$103>>3] = $97; //@line 44 "./board.c"
 $104 = $2; //@line 46 "./board.c"
 STACKTOP = sp;return ($104|0); //@line 46 "./board.c"
}
function _board_delete($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = 0; //@line 51 "./board.c"
 while(1) {
  $3 = $2; //@line 51 "./board.c"
  $4 = ($3|0)<(8); //@line 51 "./board.c"
  $5 = $1;
  $6 = HEAP32[$5>>2]|0;
  if (!($4)) {
   break;
  }
  $7 = $2; //@line 52 "./board.c"
  $8 = (($6) + ($7<<2)|0); //@line 52 "./board.c"
  $9 = HEAP32[$8>>2]|0; //@line 52 "./board.c"
  _free($9); //@line 52 "./board.c"
  $10 = $1; //@line 53 "./board.c"
  $11 = ((($10)) + 4|0); //@line 53 "./board.c"
  $12 = HEAP32[$11>>2]|0; //@line 53 "./board.c"
  $13 = $2; //@line 53 "./board.c"
  $14 = (($12) + ($13<<2)|0); //@line 53 "./board.c"
  $15 = HEAP32[$14>>2]|0; //@line 53 "./board.c"
  _free($15); //@line 53 "./board.c"
  $16 = $2; //@line 51 "./board.c"
  $17 = (($16) + 1)|0; //@line 51 "./board.c"
  $2 = $17; //@line 51 "./board.c"
 }
 _free($6); //@line 55 "./board.c"
 $18 = $1; //@line 56 "./board.c"
 $19 = ((($18)) + 4|0); //@line 56 "./board.c"
 $20 = HEAP32[$19>>2]|0; //@line 56 "./board.c"
 _free($20); //@line 56 "./board.c"
 $21 = $1; //@line 57 "./board.c"
 _free($21); //@line 57 "./board.c"
 STACKTOP = sp;return; //@line 58 "./board.c"
}
function _pt_create() {
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = (_malloc(24)|0); //@line 62 "./board.c"
 $0 = $2; //@line 62 "./board.c"
 $3 = (_malloc(32)|0); //@line 63 "./board.c"
 $4 = $0; //@line 63 "./board.c"
 $5 = ((($4)) + 8|0); //@line 63 "./board.c"
 HEAP32[$5>>2] = $3; //@line 63 "./board.c"
 $6 = (_malloc(32)|0); //@line 64 "./board.c"
 $7 = $0; //@line 64 "./board.c"
 $8 = ((($7)) + 12|0); //@line 64 "./board.c"
 HEAP32[$8>>2] = $6; //@line 64 "./board.c"
 $9 = (_malloc(32)|0); //@line 65 "./board.c"
 $10 = $0; //@line 65 "./board.c"
 $11 = ((($10)) + 16|0); //@line 65 "./board.c"
 HEAP32[$11>>2] = $9; //@line 65 "./board.c"
 $1 = 0; //@line 66 "./board.c"
 while(1) {
  $12 = $1; //@line 66 "./board.c"
  $13 = ($12|0)<(8); //@line 66 "./board.c"
  if (!($13)) {
   break;
  }
  $14 = (_malloc(64)|0); //@line 67 "./board.c"
  $15 = $0; //@line 67 "./board.c"
  $16 = ((($15)) + 8|0); //@line 67 "./board.c"
  $17 = HEAP32[$16>>2]|0; //@line 67 "./board.c"
  $18 = $1; //@line 67 "./board.c"
  $19 = (($17) + ($18<<2)|0); //@line 67 "./board.c"
  HEAP32[$19>>2] = $14; //@line 67 "./board.c"
  $20 = (_malloc(64)|0); //@line 68 "./board.c"
  $21 = $0; //@line 68 "./board.c"
  $22 = ((($21)) + 12|0); //@line 68 "./board.c"
  $23 = HEAP32[$22>>2]|0; //@line 68 "./board.c"
  $24 = $1; //@line 68 "./board.c"
  $25 = (($23) + ($24<<2)|0); //@line 68 "./board.c"
  HEAP32[$25>>2] = $20; //@line 68 "./board.c"
  $26 = $1; //@line 66 "./board.c"
  $27 = (($26) + 1)|0; //@line 66 "./board.c"
  $1 = $27; //@line 66 "./board.c"
 }
 $28 = $0; //@line 70 "./board.c"
 STACKTOP = sp;return ($28|0); //@line 70 "./board.c"
}
function _pt_delete($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $3 = 0, $4 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = 0; //@line 75 "./board.c"
 while(1) {
  $3 = $2; //@line 75 "./board.c"
  $4 = ($3|0)<(8); //@line 75 "./board.c"
  $5 = $1;
  $6 = ((($5)) + 8|0);
  $7 = HEAP32[$6>>2]|0;
  if (!($4)) {
   break;
  }
  $8 = $2; //@line 76 "./board.c"
  $9 = (($7) + ($8<<2)|0); //@line 76 "./board.c"
  $10 = HEAP32[$9>>2]|0; //@line 76 "./board.c"
  _free($10); //@line 76 "./board.c"
  $11 = $1; //@line 77 "./board.c"
  $12 = ((($11)) + 12|0); //@line 77 "./board.c"
  $13 = HEAP32[$12>>2]|0; //@line 77 "./board.c"
  $14 = $2; //@line 77 "./board.c"
  $15 = (($13) + ($14<<2)|0); //@line 77 "./board.c"
  $16 = HEAP32[$15>>2]|0; //@line 77 "./board.c"
  _free($16); //@line 77 "./board.c"
  $17 = $2; //@line 75 "./board.c"
  $18 = (($17) + 1)|0; //@line 75 "./board.c"
  $2 = $18; //@line 75 "./board.c"
 }
 _free($7); //@line 79 "./board.c"
 $19 = $1; //@line 80 "./board.c"
 $20 = ((($19)) + 12|0); //@line 80 "./board.c"
 $21 = HEAP32[$20>>2]|0; //@line 80 "./board.c"
 _free($21); //@line 80 "./board.c"
 $22 = $1; //@line 81 "./board.c"
 $23 = ((($22)) + 16|0); //@line 81 "./board.c"
 $24 = HEAP32[$23>>2]|0; //@line 81 "./board.c"
 _free($24); //@line 81 "./board.c"
 $25 = $1; //@line 82 "./board.c"
 _free($25); //@line 82 "./board.c"
 STACKTOP = sp;return; //@line 83 "./board.c"
}
function _board_get_probtable($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0.0, $103 = 0.0, $104 = 0.0, $105 = 0.0, $106 = 0.0, $107 = 0.0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0.0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0.0, $125 = 0.0, $126 = 0.0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0.0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0.0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0.0, $174 = 0.0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0.0, $188 = 0.0, $189 = 0.0, $19 = 0;
 var $190 = 0.0, $191 = 0, $192 = 0, $193 = 0.0, $194 = 0.0, $195 = 0, $196 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0;
 var $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0;
 var $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0;
 var $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0.0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0.0, $85 = 0.0, $86 = 0, $87 = 0;
 var $88 = 0, $89 = 0, $9 = 0.0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $or$cond = 0, $or$cond3 = 0, $or$cond5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $4 = $0;
 $5 = $1;
 $6 = $2;
 $7 = $3;
 $17 = (_pt_create()|0); //@line 87 "./board.c"
 $8 = $17; //@line 87 "./board.c"
 $9 = 1.0; //@line 89 "./board.c"
 $10 = 0; //@line 90 "./board.c"
 while(1) {
  $18 = $10; //@line 90 "./board.c"
  $19 = ($18|0)<(8); //@line 90 "./board.c"
  if (!($19)) {
   break;
  }
  $11 = 0; //@line 91 "./board.c"
  while(1) {
   $20 = $11; //@line 91 "./board.c"
   $21 = ($20|0)<(8); //@line 91 "./board.c"
   if (!($21)) {
    break;
   }
   $22 = $8; //@line 92 "./board.c"
   $23 = ((($22)) + 8|0); //@line 92 "./board.c"
   $24 = HEAP32[$23>>2]|0; //@line 92 "./board.c"
   $25 = $10; //@line 92 "./board.c"
   $26 = (($24) + ($25<<2)|0); //@line 92 "./board.c"
   $27 = HEAP32[$26>>2]|0; //@line 92 "./board.c"
   $28 = $11; //@line 92 "./board.c"
   $29 = (($27) + ($28<<3)|0); //@line 92 "./board.c"
   HEAPF64[$29>>3] = 0.0; //@line 92 "./board.c"
   $30 = $8; //@line 93 "./board.c"
   $31 = ((($30)) + 12|0); //@line 93 "./board.c"
   $32 = HEAP32[$31>>2]|0; //@line 93 "./board.c"
   $33 = $10; //@line 93 "./board.c"
   $34 = (($32) + ($33<<2)|0); //@line 93 "./board.c"
   $35 = HEAP32[$34>>2]|0; //@line 93 "./board.c"
   $36 = $11; //@line 93 "./board.c"
   $37 = (($35) + ($36<<3)|0); //@line 93 "./board.c"
   HEAPF64[$37>>3] = 0.0; //@line 93 "./board.c"
   $38 = $11; //@line 91 "./board.c"
   $39 = (($38) + 1)|0; //@line 91 "./board.c"
   $11 = $39; //@line 91 "./board.c"
  }
  $12 = 1.0; //@line 96 "./board.c"
  $40 = $5; //@line 96 "./board.c"
  $14 = $40; //@line 96 "./board.c"
  $41 = $6; //@line 96 "./board.c"
  $15 = $41; //@line 96 "./board.c"
  $13 = 0; //@line 97 "./board.c"
  while(1) {
   $42 = $13; //@line 97 "./board.c"
   $43 = ($42|0)<(7); //@line 97 "./board.c"
   if (!($43)) {
    break;
   }
   $44 = $10; //@line 98 "./board.c"
   $45 = (8 + ($44<<2)|0); //@line 98 "./board.c"
   $46 = HEAP32[$45>>2]|0; //@line 98 "./board.c"
   $47 = $14; //@line 98 "./board.c"
   $48 = (($47) + ($46))|0; //@line 98 "./board.c"
   $14 = $48; //@line 98 "./board.c"
   $49 = $10; //@line 98 "./board.c"
   $50 = (40 + ($49<<2)|0); //@line 98 "./board.c"
   $51 = HEAP32[$50>>2]|0; //@line 98 "./board.c"
   $52 = $15; //@line 98 "./board.c"
   $53 = (($52) + ($51))|0; //@line 98 "./board.c"
   $15 = $53; //@line 98 "./board.c"
   $54 = $14; //@line 99 "./board.c"
   $55 = ($54|0)<(0); //@line 99 "./board.c"
   $56 = $14; //@line 99 "./board.c"
   $57 = ($56|0)>(7); //@line 99 "./board.c"
   $or$cond = $55 | $57; //@line 99 "./board.c"
   $58 = $15; //@line 99 "./board.c"
   $59 = ($58|0)<(0); //@line 99 "./board.c"
   $or$cond3 = $or$cond | $59; //@line 99 "./board.c"
   $60 = $15; //@line 99 "./board.c"
   $61 = ($60|0)>(7); //@line 99 "./board.c"
   $or$cond5 = $or$cond3 | $61; //@line 99 "./board.c"
   if ($or$cond5) {
    break;
   }
   $62 = $4; //@line 100 "./board.c"
   $63 = HEAP32[$62>>2]|0; //@line 100 "./board.c"
   $64 = $14; //@line 100 "./board.c"
   $65 = (($63) + ($64<<2)|0); //@line 100 "./board.c"
   $66 = HEAP32[$65>>2]|0; //@line 100 "./board.c"
   $67 = $15; //@line 100 "./board.c"
   $68 = (($66) + ($67)|0); //@line 100 "./board.c"
   $69 = HEAP8[$68>>0]|0; //@line 100 "./board.c"
   $70 = $69&1; //@line 100 "./board.c"
   $71 = $70&1; //@line 100 "./board.c"
   $72 = ($71|0)==(0); //@line 100 "./board.c"
   if ($72) {
    break;
   }
   $73 = $7; //@line 103 "./board.c"
   $74 = ($73|0)!=(0); //@line 103 "./board.c"
   $75 = $12;
   $76 = $4;
   $77 = ((($76)) + 4|0);
   $78 = HEAP32[$77>>2]|0;
   $79 = $14;
   $80 = (($78) + ($79<<2)|0);
   $81 = HEAP32[$80>>2]|0;
   $82 = $15;
   $83 = (($81) + ($82<<3)|0);
   $84 = +HEAPF64[$83>>3];
   if ($74) {
    $85 = $75 * $84; //@line 104 "./board.c"
    $86 = $8; //@line 104 "./board.c"
    $87 = ((($86)) + 8|0); //@line 104 "./board.c"
    $88 = HEAP32[$87>>2]|0; //@line 104 "./board.c"
    $89 = $10; //@line 104 "./board.c"
    $90 = (($88) + ($89<<2)|0); //@line 104 "./board.c"
    $91 = HEAP32[$90>>2]|0; //@line 104 "./board.c"
    $92 = $13; //@line 104 "./board.c"
    $93 = (($91) + ($92<<3)|0); //@line 104 "./board.c"
    HEAPF64[$93>>3] = $85; //@line 104 "./board.c"
    $94 = $4; //@line 105 "./board.c"
    $95 = ((($94)) + 4|0); //@line 105 "./board.c"
    $96 = HEAP32[$95>>2]|0; //@line 105 "./board.c"
    $97 = $14; //@line 105 "./board.c"
    $98 = (($96) + ($97<<2)|0); //@line 105 "./board.c"
    $99 = HEAP32[$98>>2]|0; //@line 105 "./board.c"
    $100 = $15; //@line 105 "./board.c"
    $101 = (($99) + ($100<<3)|0); //@line 105 "./board.c"
    $102 = +HEAPF64[$101>>3]; //@line 105 "./board.c"
    $103 = 1.0 - $102; //@line 105 "./board.c"
    $104 = $12; //@line 105 "./board.c"
    $105 = $104 * $103; //@line 105 "./board.c"
    $12 = $105; //@line 105 "./board.c"
   } else {
    $106 = 1.0 - $84; //@line 107 "./board.c"
    $107 = $75 * $106; //@line 107 "./board.c"
    $108 = $8; //@line 107 "./board.c"
    $109 = ((($108)) + 8|0); //@line 107 "./board.c"
    $110 = HEAP32[$109>>2]|0; //@line 107 "./board.c"
    $111 = $10; //@line 107 "./board.c"
    $112 = (($110) + ($111<<2)|0); //@line 107 "./board.c"
    $113 = HEAP32[$112>>2]|0; //@line 107 "./board.c"
    $114 = $13; //@line 107 "./board.c"
    $115 = (($113) + ($114<<3)|0); //@line 107 "./board.c"
    HEAPF64[$115>>3] = $107; //@line 107 "./board.c"
    $116 = $4; //@line 108 "./board.c"
    $117 = ((($116)) + 4|0); //@line 108 "./board.c"
    $118 = HEAP32[$117>>2]|0; //@line 108 "./board.c"
    $119 = $14; //@line 108 "./board.c"
    $120 = (($118) + ($119<<2)|0); //@line 108 "./board.c"
    $121 = HEAP32[$120>>2]|0; //@line 108 "./board.c"
    $122 = $15; //@line 108 "./board.c"
    $123 = (($121) + ($122<<3)|0); //@line 108 "./board.c"
    $124 = +HEAPF64[$123>>3]; //@line 108 "./board.c"
    $125 = $12; //@line 108 "./board.c"
    $126 = $125 * $124; //@line 108 "./board.c"
    $12 = $126; //@line 108 "./board.c"
   }
   $127 = $13; //@line 97 "./board.c"
   $128 = (($127) + 1)|0; //@line 97 "./board.c"
   $13 = $128; //@line 97 "./board.c"
  }
  $129 = $13; //@line 111 "./board.c"
  $130 = $8; //@line 111 "./board.c"
  $131 = ((($130)) + 16|0); //@line 111 "./board.c"
  $132 = HEAP32[$131>>2]|0; //@line 111 "./board.c"
  $133 = $10; //@line 111 "./board.c"
  $134 = (($132) + ($133<<2)|0); //@line 111 "./board.c"
  HEAP32[$134>>2] = $129; //@line 111 "./board.c"
  $135 = $12; //@line 112 "./board.c"
  $136 = $8; //@line 112 "./board.c"
  $137 = ((($136)) + 8|0); //@line 112 "./board.c"
  $138 = HEAP32[$137>>2]|0; //@line 112 "./board.c"
  $139 = $10; //@line 112 "./board.c"
  $140 = (($138) + ($139<<2)|0); //@line 112 "./board.c"
  $141 = HEAP32[$140>>2]|0; //@line 112 "./board.c"
  $142 = $13; //@line 112 "./board.c"
  $143 = (($141) + ($142<<3)|0); //@line 112 "./board.c"
  HEAPF64[$143>>3] = $135; //@line 112 "./board.c"
  $144 = $8; //@line 114 "./board.c"
  $145 = ((($144)) + 12|0); //@line 114 "./board.c"
  $146 = HEAP32[$145>>2]|0; //@line 114 "./board.c"
  $147 = $10; //@line 114 "./board.c"
  $148 = (($146) + ($147<<2)|0); //@line 114 "./board.c"
  $149 = HEAP32[$148>>2]|0; //@line 114 "./board.c"
  $150 = $13; //@line 114 "./board.c"
  $151 = (($149) + ($150<<3)|0); //@line 114 "./board.c"
  HEAPF64[$151>>3] = 0.0; //@line 114 "./board.c"
  $152 = $13; //@line 115 "./board.c"
  $16 = $152; //@line 115 "./board.c"
  while(1) {
   $153 = $16; //@line 115 "./board.c"
   $154 = ($153|0)>(0); //@line 115 "./board.c"
   $155 = $8;
   $156 = ((($155)) + 12|0);
   $157 = HEAP32[$156>>2]|0;
   $158 = $10;
   $159 = (($157) + ($158<<2)|0);
   $160 = HEAP32[$159>>2]|0;
   if (!($154)) {
    break;
   }
   $161 = $16; //@line 117 "./board.c"
   $162 = (($160) + ($161<<3)|0); //@line 117 "./board.c"
   $163 = +HEAPF64[$162>>3]; //@line 117 "./board.c"
   $164 = $8; //@line 117 "./board.c"
   $165 = ((($164)) + 8|0); //@line 117 "./board.c"
   $166 = HEAP32[$165>>2]|0; //@line 117 "./board.c"
   $167 = $10; //@line 117 "./board.c"
   $168 = (($166) + ($167<<2)|0); //@line 117 "./board.c"
   $169 = HEAP32[$168>>2]|0; //@line 117 "./board.c"
   $170 = $16; //@line 117 "./board.c"
   $171 = (($170) - 1)|0; //@line 117 "./board.c"
   $172 = (($169) + ($171<<3)|0); //@line 117 "./board.c"
   $173 = +HEAPF64[$172>>3]; //@line 117 "./board.c"
   $174 = $163 + $173; //@line 117 "./board.c"
   $175 = $8; //@line 116 "./board.c"
   $176 = ((($175)) + 12|0); //@line 116 "./board.c"
   $177 = HEAP32[$176>>2]|0; //@line 116 "./board.c"
   $178 = $10; //@line 116 "./board.c"
   $179 = (($177) + ($178<<2)|0); //@line 116 "./board.c"
   $180 = HEAP32[$179>>2]|0; //@line 116 "./board.c"
   $181 = $16; //@line 116 "./board.c"
   $182 = (($181) - 1)|0; //@line 116 "./board.c"
   $183 = (($180) + ($182<<3)|0); //@line 116 "./board.c"
   HEAPF64[$183>>3] = $174; //@line 117 "./board.c"
   $184 = $16; //@line 115 "./board.c"
   $185 = (($184) + -1)|0; //@line 115 "./board.c"
   $16 = $185; //@line 115 "./board.c"
  }
  $186 = ((($160)) + 8|0); //@line 119 "./board.c"
  $187 = +HEAPF64[$186>>3]; //@line 119 "./board.c"
  $188 = 1.0 - $187; //@line 119 "./board.c"
  $189 = $9; //@line 119 "./board.c"
  $190 = $189 * $188; //@line 119 "./board.c"
  $9 = $190; //@line 119 "./board.c"
  $191 = $10; //@line 90 "./board.c"
  $192 = (($191) + 1)|0; //@line 90 "./board.c"
  $10 = $192; //@line 90 "./board.c"
 }
 $193 = $9; //@line 121 "./board.c"
 $194 = 1.0 - $193; //@line 121 "./board.c"
 $195 = $8; //@line 121 "./board.c"
 HEAPF64[$195>>3] = $194; //@line 121 "./board.c"
 $196 = $8; //@line 123 "./board.c"
 STACKTOP = sp;return ($196|0); //@line 123 "./board.c"
}
function _bp_create() {
 var $0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $3 = 0, $4 = 0, $5 = 0;
 var $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $3 = (_malloc(32)|0); //@line 128 "./board.c"
 $0 = $3; //@line 128 "./board.c"
 $1 = 0; //@line 129 "./board.c"
 while(1) {
  $4 = $1; //@line 129 "./board.c"
  $5 = ($4|0)<(8); //@line 129 "./board.c"
  if (!($5)) {
   break;
  }
  $6 = (_malloc(32)|0); //@line 130 "./board.c"
  $7 = $0; //@line 130 "./board.c"
  $8 = $1; //@line 130 "./board.c"
  $9 = (($7) + ($8<<2)|0); //@line 130 "./board.c"
  HEAP32[$9>>2] = $6; //@line 130 "./board.c"
  $2 = 0; //@line 131 "./board.c"
  while(1) {
   $10 = $2; //@line 131 "./board.c"
   $11 = ($10|0)<(8); //@line 131 "./board.c"
   if (!($11)) {
    break;
   }
   $12 = (_malloc(8)|0); //@line 132 "./board.c"
   $13 = $0; //@line 132 "./board.c"
   $14 = $1; //@line 132 "./board.c"
   $15 = (($13) + ($14<<2)|0); //@line 132 "./board.c"
   $16 = HEAP32[$15>>2]|0; //@line 132 "./board.c"
   $17 = $2; //@line 132 "./board.c"
   $18 = (($16) + ($17<<2)|0); //@line 132 "./board.c"
   HEAP32[$18>>2] = $12; //@line 132 "./board.c"
   $19 = $2; //@line 131 "./board.c"
   $20 = (($19) + 1)|0; //@line 131 "./board.c"
   $2 = $20; //@line 131 "./board.c"
  }
  $21 = $1; //@line 129 "./board.c"
  $22 = (($21) + 1)|0; //@line 129 "./board.c"
  $1 = $22; //@line 129 "./board.c"
 }
 $23 = $0; //@line 136 "./board.c"
 STACKTOP = sp;return ($23|0); //@line 136 "./board.c"
}
function _bp_delete($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = 0; //@line 141 "./board.c"
 while(1) {
  $4 = $2; //@line 141 "./board.c"
  $5 = ($4|0)<(8); //@line 141 "./board.c"
  if (!($5)) {
   break;
  }
  $3 = 0; //@line 142 "./board.c"
  while(1) {
   $6 = $3; //@line 142 "./board.c"
   $7 = ($6|0)<(8); //@line 142 "./board.c"
   $8 = $1;
   $9 = $2;
   $10 = (($8) + ($9<<2)|0);
   $11 = HEAP32[$10>>2]|0;
   if (!($7)) {
    break;
   }
   $12 = $3; //@line 143 "./board.c"
   $13 = (($11) + ($12<<2)|0); //@line 143 "./board.c"
   $14 = HEAP32[$13>>2]|0; //@line 143 "./board.c"
   $15 = HEAP32[$14>>2]|0; //@line 143 "./board.c"
   _pt_delete($15); //@line 143 "./board.c"
   $16 = $1; //@line 144 "./board.c"
   $17 = $2; //@line 144 "./board.c"
   $18 = (($16) + ($17<<2)|0); //@line 144 "./board.c"
   $19 = HEAP32[$18>>2]|0; //@line 144 "./board.c"
   $20 = $3; //@line 144 "./board.c"
   $21 = (($19) + ($20<<2)|0); //@line 144 "./board.c"
   $22 = HEAP32[$21>>2]|0; //@line 144 "./board.c"
   $23 = ((($22)) + 4|0); //@line 144 "./board.c"
   $24 = HEAP32[$23>>2]|0; //@line 144 "./board.c"
   _pt_delete($24); //@line 144 "./board.c"
   $25 = $1; //@line 145 "./board.c"
   $26 = $2; //@line 145 "./board.c"
   $27 = (($25) + ($26<<2)|0); //@line 145 "./board.c"
   $28 = HEAP32[$27>>2]|0; //@line 145 "./board.c"
   $29 = $3; //@line 145 "./board.c"
   $30 = (($28) + ($29<<2)|0); //@line 145 "./board.c"
   $31 = HEAP32[$30>>2]|0; //@line 145 "./board.c"
   _free($31); //@line 145 "./board.c"
   $32 = $3; //@line 142 "./board.c"
   $33 = (($32) + 1)|0; //@line 142 "./board.c"
   $3 = $33; //@line 142 "./board.c"
  }
  _free($11); //@line 147 "./board.c"
  $34 = $2; //@line 141 "./board.c"
  $35 = (($34) + 1)|0; //@line 141 "./board.c"
  $2 = $35; //@line 141 "./board.c"
 }
 $36 = $1; //@line 149 "./board.c"
 _free($36); //@line 149 "./board.c"
 STACKTOP = sp;return; //@line 150 "./board.c"
}
function _board_get_prob($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $5 = (_bp_create()|0); //@line 154 "./board.c"
 $2 = $5; //@line 154 "./board.c"
 $3 = 0; //@line 155 "./board.c"
 while(1) {
  $6 = $3; //@line 155 "./board.c"
  $7 = ($6|0)<(8); //@line 155 "./board.c"
  if (!($7)) {
   break;
  }
  $4 = 0; //@line 156 "./board.c"
  while(1) {
   $8 = $4; //@line 156 "./board.c"
   $9 = ($8|0)<(8); //@line 156 "./board.c"
   if (!($9)) {
    break;
   }
   $10 = $1; //@line 157 "./board.c"
   $11 = $3; //@line 157 "./board.c"
   $12 = $4; //@line 157 "./board.c"
   $13 = (_board_get_probtable($10,$11,$12,1)|0); //@line 157 "./board.c"
   $14 = $2; //@line 157 "./board.c"
   $15 = $3; //@line 157 "./board.c"
   $16 = (($14) + ($15<<2)|0); //@line 157 "./board.c"
   $17 = HEAP32[$16>>2]|0; //@line 157 "./board.c"
   $18 = $4; //@line 157 "./board.c"
   $19 = (($17) + ($18<<2)|0); //@line 157 "./board.c"
   $20 = HEAP32[$19>>2]|0; //@line 157 "./board.c"
   HEAP32[$20>>2] = $13; //@line 157 "./board.c"
   $21 = $1; //@line 158 "./board.c"
   $22 = $3; //@line 158 "./board.c"
   $23 = $4; //@line 158 "./board.c"
   $24 = (_board_get_probtable($21,$22,$23,0)|0); //@line 158 "./board.c"
   $25 = $2; //@line 158 "./board.c"
   $26 = $3; //@line 158 "./board.c"
   $27 = (($25) + ($26<<2)|0); //@line 158 "./board.c"
   $28 = HEAP32[$27>>2]|0; //@line 158 "./board.c"
   $29 = $4; //@line 158 "./board.c"
   $30 = (($28) + ($29<<2)|0); //@line 158 "./board.c"
   $31 = HEAP32[$30>>2]|0; //@line 158 "./board.c"
   $32 = ((($31)) + 4|0); //@line 158 "./board.c"
   HEAP32[$32>>2] = $24; //@line 158 "./board.c"
   $33 = $4; //@line 156 "./board.c"
   $34 = (($33) + 1)|0; //@line 156 "./board.c"
   $4 = $34; //@line 156 "./board.c"
  }
  $35 = $3; //@line 155 "./board.c"
  $36 = (($35) + 1)|0; //@line 155 "./board.c"
  $3 = $36; //@line 155 "./board.c"
 }
 $37 = $2; //@line 161 "./board.c"
 STACKTOP = sp;return ($37|0); //@line 161 "./board.c"
}
function _board_get_movable($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = +$2;
 $3 = $3|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0.0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0.0, $24 = 0.0, $25 = 0.0, $26 = 0.0, $27 = 0, $28 = 0, $29 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0.0, $37 = 0.0, $38 = 0.0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0;
 var $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0.0, $60 = 0, $61 = 0, $62 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $4 = $0;
 $5 = $1;
 $6 = $2;
 $7 = $3;
 $8 = 0; //@line 166 "./board.c"
 while(1) {
  $10 = $8; //@line 166 "./board.c"
  $11 = ($10|0)<(8); //@line 166 "./board.c"
  if (!($11)) {
   break;
  }
  $9 = 0; //@line 167 "./board.c"
  while(1) {
   $12 = $9; //@line 167 "./board.c"
   $13 = ($12|0)<(8); //@line 167 "./board.c"
   if (!($13)) {
    break;
   }
   $14 = $6; //@line 168 "./board.c"
   $15 = $5; //@line 168 "./board.c"
   $16 = $8; //@line 168 "./board.c"
   $17 = (($15) + ($16<<2)|0); //@line 168 "./board.c"
   $18 = HEAP32[$17>>2]|0; //@line 168 "./board.c"
   $19 = $9; //@line 168 "./board.c"
   $20 = (($18) + ($19<<2)|0); //@line 168 "./board.c"
   $21 = HEAP32[$20>>2]|0; //@line 168 "./board.c"
   $22 = HEAP32[$21>>2]|0; //@line 168 "./board.c"
   $23 = +HEAPF64[$22>>3]; //@line 168 "./board.c"
   $24 = $14 * $23; //@line 168 "./board.c"
   $25 = $6; //@line 169 "./board.c"
   $26 = 1.0 - $25; //@line 169 "./board.c"
   $27 = $5; //@line 169 "./board.c"
   $28 = $8; //@line 169 "./board.c"
   $29 = (($27) + ($28<<2)|0); //@line 169 "./board.c"
   $30 = HEAP32[$29>>2]|0; //@line 169 "./board.c"
   $31 = $9; //@line 169 "./board.c"
   $32 = (($30) + ($31<<2)|0); //@line 169 "./board.c"
   $33 = HEAP32[$32>>2]|0; //@line 169 "./board.c"
   $34 = ((($33)) + 4|0); //@line 169 "./board.c"
   $35 = HEAP32[$34>>2]|0; //@line 169 "./board.c"
   $36 = +HEAPF64[$35>>3]; //@line 169 "./board.c"
   $37 = $26 * $36; //@line 169 "./board.c"
   $38 = $24 + $37; //@line 169 "./board.c"
   $39 = $38 > 0.5; //@line 169 "./board.c"
   if ($39) {
    $40 = $4; //@line 170 "./board.c"
    $41 = HEAP32[$40>>2]|0; //@line 170 "./board.c"
    $42 = $8; //@line 170 "./board.c"
    $43 = (($41) + ($42<<2)|0); //@line 170 "./board.c"
    $44 = HEAP32[$43>>2]|0; //@line 170 "./board.c"
    $45 = $9; //@line 170 "./board.c"
    $46 = (($44) + ($45)|0); //@line 170 "./board.c"
    $47 = HEAP8[$46>>0]|0; //@line 170 "./board.c"
    $48 = $47&1; //@line 170 "./board.c"
    $49 = $48&1; //@line 170 "./board.c"
    $50 = ($49|0)==(0); //@line 170 "./board.c"
    $58 = $50;
   } else {
    $58 = 0;
   }
   $51 = $7; //@line 168 "./board.c"
   $52 = $8; //@line 168 "./board.c"
   $53 = (($51) + ($52<<2)|0); //@line 168 "./board.c"
   $54 = HEAP32[$53>>2]|0; //@line 168 "./board.c"
   $55 = $9; //@line 168 "./board.c"
   $56 = (($54) + ($55)|0); //@line 168 "./board.c"
   $57 = $58&1; //@line 168 "./board.c"
   HEAP8[$56>>0] = $57; //@line 168 "./board.c"
   $59 = $9; //@line 167 "./board.c"
   $60 = (($59) + 1)|0; //@line 167 "./board.c"
   $9 = $60; //@line 167 "./board.c"
  }
  $61 = $8; //@line 166 "./board.c"
  $62 = (($61) + 1)|0; //@line 166 "./board.c"
  $8 = $62; //@line 166 "./board.c"
 }
 STACKTOP = sp;return; //@line 173 "./board.c"
}
function _board_move($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = +$3;
 $4 = $4|0;
 var $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0.0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0.0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0.0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0.0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0.0;
 var $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0.0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0;
 var $209 = 0, $21 = 0.0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0;
 var $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0.0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0;
 var $245 = 0.0, $246 = 0.0, $247 = 0.0, $248 = 0.0, $249 = 0.0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0.0, $260 = 0, $261 = 0, $262 = 0;
 var $263 = 0, $264 = 0.0, $265 = 0.0, $266 = 0.0, $267 = 0, $268 = 0, $269 = 0, $27 = 0.0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0.0, $280 = 0;
 var $281 = 0.0, $282 = 0.0, $283 = 0.0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0.0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0.0, $297 = 0.0, $298 = 0, $299 = 0;
 var $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0.0, $312 = 0.0, $313 = 0.0, $314 = 0.0, $315 = 0, $316 = 0, $317 = 0;
 var $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0.0, $33 = 0, $330 = 0.0, $331 = 0.0, $332 = 0, $333 = 0, $334 = 0, $335 = 0;
 var $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0.0, $350 = 0, $351 = 0, $352 = 0, $353 = 0;
 var $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0.0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0, $370 = 0, $371 = 0;
 var $372 = 0, $373 = 0, $374 = 0.0, $375 = 0.0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0, $389 = 0.0, $39 = 0;
 var $390 = 0.0, $391 = 0.0, $392 = 0.0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $399 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0, $405 = 0, $406 = 0, $407 = 0, $408 = 0.0;
 var $409 = 0.0, $41 = 0, $410 = 0.0, $411 = 0.0, $412 = 0, $413 = 0, $414 = 0, $415 = 0, $416 = 0, $417 = 0, $418 = 0, $419 = 0, $42 = 0, $420 = 0.0, $421 = 0.0, $422 = 0, $423 = 0, $424 = 0, $425 = 0, $426 = 0;
 var $427 = 0, $428 = 0, $429 = 0, $43 = 0, $430 = 0, $431 = 0, $432 = 0, $433 = 0, $434 = 0, $435 = 0, $436 = 0.0, $437 = 0, $438 = 0, $439 = 0, $44 = 0.0, $440 = 0, $441 = 0, $442 = 0, $443 = 0, $444 = 0;
 var $445 = 0, $446 = 0, $447 = 0, $448 = 0, $449 = 0, $45 = 0.0, $450 = 0, $451 = 0, $452 = 0.0, $453 = 0.0, $454 = 0.0, $455 = 0.0, $456 = 0, $457 = 0, $458 = 0, $459 = 0, $46 = 0.0, $460 = 0, $461 = 0, $462 = 0;
 var $463 = 0, $464 = 0, $465 = 0, $466 = 0, $467 = 0, $468 = 0, $469 = 0, $47 = 0.0, $470 = 0, $471 = 0, $472 = 0, $473 = 0, $474 = 0, $475 = 0, $476 = 0, $477 = 0, $478 = 0, $479 = 0, $48 = 0, $480 = 0;
 var $481 = 0, $482 = 0, $483 = 0, $484 = 0, $485 = 0, $486 = 0, $487 = 0, $488 = 0, $489 = 0, $49 = 0, $490 = 0, $491 = 0, $492 = 0, $493 = 0, $494 = 0, $495 = 0, $496 = 0, $497 = 0, $498 = 0, $499 = 0;
 var $5 = 0, $50 = 0, $500 = 0.0, $501 = 0, $502 = 0, $503 = 0, $504 = 0, $505 = 0, $506 = 0, $507 = 0, $508 = 0, $509 = 0, $51 = 0, $510 = 0.0, $511 = 0.0, $512 = 0.0, $513 = 0.0, $514 = 0.0, $515 = 0, $516 = 0;
 var $517 = 0, $518 = 0, $519 = 0, $52 = 0, $520 = 0, $521 = 0, $522 = 0, $523 = 0, $524 = 0, $525 = 0, $526 = 0, $527 = 0, $528 = 0, $529 = 0, $53 = 0, $530 = 0.0, $531 = 0.0, $532 = 0.0, $533 = 0, $534 = 0;
 var $535 = 0, $536 = 0, $537 = 0, $538 = 0, $539 = 0, $54 = 0, $540 = 0, $541 = 0, $542 = 0, $543 = 0, $544 = 0, $545 = 0, $546 = 0, $547 = 0, $548 = 0.0, $549 = 0.0, $55 = 0, $550 = 0.0, $551 = 0, $552 = 0;
 var $553 = 0, $554 = 0, $555 = 0, $556 = 0, $557 = 0, $558 = 0, $559 = 0, $56 = 0, $560 = 0, $561 = 0, $562 = 0, $563 = 0.0, $564 = 0.0, $565 = 0, $566 = 0, $567 = 0, $568 = 0, $569 = 0, $57 = 0.0, $570 = 0;
 var $571 = 0, $572 = 0, $573 = 0, $574 = 0, $575 = 0, $576 = 0, $577 = 0, $578 = 0, $579 = 0.0, $58 = 0.0, $580 = 0.0, $581 = 0.0, $582 = 0.0, $583 = 0, $584 = 0, $585 = 0, $586 = 0, $587 = 0, $588 = 0, $589 = 0;
 var $59 = 0.0, $590 = 0, $591 = 0, $592 = 0, $593 = 0, $594 = 0, $595 = 0, $596 = 0, $597 = 0, $598 = 0.0, $599 = 0.0, $6 = 0, $60 = 0.0, $600 = 0.0, $601 = 0.0, $602 = 0.0, $603 = 0, $604 = 0, $605 = 0, $606 = 0;
 var $607 = 0, $608 = 0, $609 = 0, $61 = 0, $610 = 0, $611 = 0, $612 = 0, $613 = 0, $614 = 0, $615 = 0, $616 = 0, $617 = 0, $618 = 0, $619 = 0, $62 = 0, $620 = 0, $621 = 0, $622 = 0, $623 = 0, $624 = 0;
 var $625 = 0, $626 = 0, $627 = 0, $628 = 0, $629 = 0, $63 = 0, $630 = 0, $631 = 0, $632 = 0.0, $633 = 0.0, $634 = 0.0, $635 = 0, $636 = 0, $637 = 0, $638 = 0, $639 = 0, $64 = 0, $640 = 0, $641 = 0, $642 = 0;
 var $643 = 0, $644 = 0, $645 = 0, $646 = 0, $647 = 0, $648 = 0, $649 = 0, $65 = 0, $650 = 0, $651 = 0, $652 = 0, $653 = 0, $654 = 0, $655 = 0, $656 = 0, $657 = 0, $658 = 0, $659 = 0, $66 = 0, $660 = 0;
 var $661 = 0, $662 = 0, $663 = 0, $664 = 0, $665 = 0, $666 = 0, $667 = 0, $668 = 0, $669 = 0.0, $67 = 0, $670 = 0, $671 = 0, $672 = 0, $673 = 0, $674 = 0, $675 = 0, $676 = 0, $677 = 0, $678 = 0.0, $679 = 0.0;
 var $68 = 0, $680 = 0, $681 = 0, $682 = 0, $683 = 0, $684 = 0, $685 = 0, $686 = 0, $687 = 0, $688 = 0, $689 = 0, $69 = 0, $690 = 0, $691 = 0, $692 = 0, $693 = 0, $694 = 0.0, $695 = 0.0, $696 = 0.0, $697 = 0.0;
 var $698 = 0, $699 = 0, $7 = 0, $70 = 0, $700 = 0, $701 = 0, $702 = 0, $703 = 0, $704 = 0, $705 = 0, $706 = 0, $707 = 0, $708 = 0, $709 = 0, $71 = 0, $710 = 0, $711 = 0, $712 = 0, $713 = 0, $714 = 0.0;
 var $715 = 0.0, $716 = 0.0, $717 = 0.0, $718 = 0, $719 = 0, $72 = 0, $720 = 0, $721 = 0, $722 = 0, $723 = 0, $724 = 0, $725 = 0, $726 = 0.0, $727 = 0.0, $728 = 0, $729 = 0, $73 = 0, $730 = 0, $731 = 0, $732 = 0;
 var $733 = 0, $734 = 0, $735 = 0, $736 = 0, $737 = 0, $738 = 0, $739 = 0, $74 = 0, $740 = 0, $741 = 0, $742 = 0, $743 = 0.0, $744 = 0, $745 = 0, $746 = 0, $747 = 0, $748 = 0, $749 = 0, $75 = 0, $750 = 0;
 var $751 = 0, $752 = 0, $753 = 0, $754 = 0, $755 = 0, $756 = 0, $757 = 0, $758 = 0, $759 = 0, $76 = 0, $760 = 0.0, $761 = 0.0, $762 = 0.0, $763 = 0.0, $764 = 0.0, $765 = 0.0, $766 = 0, $767 = 0, $768 = 0, $769 = 0;
 var $77 = 0, $770 = 0, $771 = 0, $772 = 0, $773 = 0, $774 = 0, $775 = 0, $776 = 0, $777 = 0, $778 = 0, $779 = 0, $78 = 0, $780 = 0, $781 = 0, $782 = 0, $783 = 0, $784 = 0, $785 = 0, $786 = 0, $787 = 0;
 var $788 = 0, $789 = 0, $79 = 0, $790 = 0, $791 = 0, $792 = 0, $793 = 0, $794 = 0, $795 = 0.0, $796 = 0.0, $797 = 0.0, $798 = 0, $799 = 0, $8 = 0, $80 = 0, $800 = 0, $801 = 0, $802 = 0, $803 = 0, $804 = 0;
 var $805 = 0, $806 = 0, $807 = 0, $808 = 0, $809 = 0, $81 = 0, $810 = 0, $811 = 0, $812 = 0, $813 = 0, $814 = 0.0, $815 = 0, $816 = 0, $817 = 0, $818 = 0, $819 = 0, $82 = 0, $820 = 0, $821 = 0, $822 = 0;
 var $823 = 0.0, $824 = 0.0, $825 = 0.0, $826 = 0.0, $827 = 0, $828 = 0, $829 = 0, $83 = 0, $830 = 0, $831 = 0, $832 = 0, $833 = 0, $834 = 0, $835 = 0.0, $836 = 0.0, $837 = 0.0, $838 = 0, $839 = 0, $84 = 0, $840 = 0;
 var $841 = 0, $842 = 0, $843 = 0, $844 = 0, $845 = 0, $846 = 0, $847 = 0, $848 = 0, $849 = 0, $85 = 0, $850 = 0, $851 = 0, $852 = 0, $853 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0.0, $90 = 0;
 var $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 160|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(160|0);
 $6 = $0;
 $7 = $1;
 $8 = $2;
 $9 = $3;
 $10 = $4;
 $35 = $9; //@line 177 "./board.c"
 $36 = $10; //@line 177 "./board.c"
 $37 = $7; //@line 177 "./board.c"
 $38 = (($36) + ($37<<2)|0); //@line 177 "./board.c"
 $39 = HEAP32[$38>>2]|0; //@line 177 "./board.c"
 $40 = $8; //@line 177 "./board.c"
 $41 = (($39) + ($40<<2)|0); //@line 177 "./board.c"
 $42 = HEAP32[$41>>2]|0; //@line 177 "./board.c"
 $43 = HEAP32[$42>>2]|0; //@line 177 "./board.c"
 $44 = +HEAPF64[$43>>3]; //@line 177 "./board.c"
 $45 = $35 * $44; //@line 177 "./board.c"
 $46 = $9; //@line 178 "./board.c"
 $47 = 1.0 - $46; //@line 178 "./board.c"
 $48 = $10; //@line 178 "./board.c"
 $49 = $7; //@line 178 "./board.c"
 $50 = (($48) + ($49<<2)|0); //@line 178 "./board.c"
 $51 = HEAP32[$50>>2]|0; //@line 178 "./board.c"
 $52 = $8; //@line 178 "./board.c"
 $53 = (($51) + ($52<<2)|0); //@line 178 "./board.c"
 $54 = HEAP32[$53>>2]|0; //@line 178 "./board.c"
 $55 = ((($54)) + 4|0); //@line 178 "./board.c"
 $56 = HEAP32[$55>>2]|0; //@line 178 "./board.c"
 $57 = +HEAPF64[$56>>3]; //@line 178 "./board.c"
 $58 = $47 * $57; //@line 178 "./board.c"
 $59 = $45 + $58; //@line 178 "./board.c"
 $11 = $59; //@line 177 "./board.c"
 $60 = $11; //@line 179 "./board.c"
 $61 = $60 <= 0.5; //@line 179 "./board.c"
 if (!($61)) {
  $62 = $6; //@line 179 "./board.c"
  $63 = HEAP32[$62>>2]|0; //@line 179 "./board.c"
  $64 = $7; //@line 179 "./board.c"
  $65 = (($63) + ($64<<2)|0); //@line 179 "./board.c"
  $66 = HEAP32[$65>>2]|0; //@line 179 "./board.c"
  $67 = $8; //@line 179 "./board.c"
  $68 = (($66) + ($67)|0); //@line 179 "./board.c"
  $69 = HEAP8[$68>>0]|0; //@line 179 "./board.c"
  $70 = $69&1; //@line 179 "./board.c"
  $71 = $70&1; //@line 179 "./board.c"
  $72 = ($71|0)==(1); //@line 179 "./board.c"
  if (!($72)) {
   $73 = (_board_create(0.0)|0); //@line 183 "./board.c"
   $12 = $73; //@line 183 "./board.c"
   $74 = (_board_create(0.0)|0); //@line 184 "./board.c"
   $13 = $74; //@line 184 "./board.c"
   $75 = (_board_create(0.0)|0); //@line 185 "./board.c"
   $14 = $75; //@line 185 "./board.c"
   $15 = 0; //@line 186 "./board.c"
   while(1) {
    $76 = $15; //@line 186 "./board.c"
    $77 = ($76|0)<(8); //@line 186 "./board.c"
    if (!($77)) {
     break;
    }
    $16 = 0; //@line 187 "./board.c"
    while(1) {
     $78 = $16; //@line 187 "./board.c"
     $79 = ($78|0)<(8); //@line 187 "./board.c"
     if (!($79)) {
      break;
     }
     $80 = $6; //@line 188 "./board.c"
     $81 = HEAP32[$80>>2]|0; //@line 188 "./board.c"
     $82 = $15; //@line 188 "./board.c"
     $83 = (($81) + ($82<<2)|0); //@line 188 "./board.c"
     $84 = HEAP32[$83>>2]|0; //@line 188 "./board.c"
     $85 = $16; //@line 188 "./board.c"
     $86 = (($84) + ($85)|0); //@line 188 "./board.c"
     $87 = HEAP8[$86>>0]|0; //@line 188 "./board.c"
     $88 = $87&1; //@line 188 "./board.c"
     $89 = $12; //@line 188 "./board.c"
     $90 = HEAP32[$89>>2]|0; //@line 188 "./board.c"
     $91 = $15; //@line 188 "./board.c"
     $92 = (($90) + ($91<<2)|0); //@line 188 "./board.c"
     $93 = HEAP32[$92>>2]|0; //@line 188 "./board.c"
     $94 = $16; //@line 188 "./board.c"
     $95 = (($93) + ($94)|0); //@line 188 "./board.c"
     $96 = $88&1; //@line 188 "./board.c"
     HEAP8[$95>>0] = $96; //@line 188 "./board.c"
     $97 = $6; //@line 189 "./board.c"
     $98 = HEAP32[$97>>2]|0; //@line 189 "./board.c"
     $99 = $15; //@line 189 "./board.c"
     $100 = (($98) + ($99<<2)|0); //@line 189 "./board.c"
     $101 = HEAP32[$100>>2]|0; //@line 189 "./board.c"
     $102 = $16; //@line 189 "./board.c"
     $103 = (($101) + ($102)|0); //@line 189 "./board.c"
     $104 = HEAP8[$103>>0]|0; //@line 189 "./board.c"
     $105 = $104&1; //@line 189 "./board.c"
     $106 = $13; //@line 189 "./board.c"
     $107 = HEAP32[$106>>2]|0; //@line 189 "./board.c"
     $108 = $15; //@line 189 "./board.c"
     $109 = (($107) + ($108<<2)|0); //@line 189 "./board.c"
     $110 = HEAP32[$109>>2]|0; //@line 189 "./board.c"
     $111 = $16; //@line 189 "./board.c"
     $112 = (($110) + ($111)|0); //@line 189 "./board.c"
     $113 = $105&1; //@line 189 "./board.c"
     HEAP8[$112>>0] = $113; //@line 189 "./board.c"
     $114 = $6; //@line 190 "./board.c"
     $115 = ((($114)) + 4|0); //@line 190 "./board.c"
     $116 = HEAP32[$115>>2]|0; //@line 190 "./board.c"
     $117 = $15; //@line 190 "./board.c"
     $118 = (($116) + ($117<<2)|0); //@line 190 "./board.c"
     $119 = HEAP32[$118>>2]|0; //@line 190 "./board.c"
     $120 = $16; //@line 190 "./board.c"
     $121 = (($119) + ($120<<3)|0); //@line 190 "./board.c"
     $122 = +HEAPF64[$121>>3]; //@line 190 "./board.c"
     $123 = $13; //@line 190 "./board.c"
     $124 = ((($123)) + 4|0); //@line 190 "./board.c"
     $125 = HEAP32[$124>>2]|0; //@line 190 "./board.c"
     $126 = $15; //@line 190 "./board.c"
     $127 = (($125) + ($126<<2)|0); //@line 190 "./board.c"
     $128 = HEAP32[$127>>2]|0; //@line 190 "./board.c"
     $129 = $16; //@line 190 "./board.c"
     $130 = (($128) + ($129<<3)|0); //@line 190 "./board.c"
     HEAPF64[$130>>3] = $122; //@line 190 "./board.c"
     $131 = $6; //@line 191 "./board.c"
     $132 = HEAP32[$131>>2]|0; //@line 191 "./board.c"
     $133 = $15; //@line 191 "./board.c"
     $134 = (($132) + ($133<<2)|0); //@line 191 "./board.c"
     $135 = HEAP32[$134>>2]|0; //@line 191 "./board.c"
     $136 = $16; //@line 191 "./board.c"
     $137 = (($135) + ($136)|0); //@line 191 "./board.c"
     $138 = HEAP8[$137>>0]|0; //@line 191 "./board.c"
     $139 = $138&1; //@line 191 "./board.c"
     $140 = $14; //@line 191 "./board.c"
     $141 = HEAP32[$140>>2]|0; //@line 191 "./board.c"
     $142 = $15; //@line 191 "./board.c"
     $143 = (($141) + ($142<<2)|0); //@line 191 "./board.c"
     $144 = HEAP32[$143>>2]|0; //@line 191 "./board.c"
     $145 = $16; //@line 191 "./board.c"
     $146 = (($144) + ($145)|0); //@line 191 "./board.c"
     $147 = $139&1; //@line 191 "./board.c"
     HEAP8[$146>>0] = $147; //@line 191 "./board.c"
     $148 = $6; //@line 192 "./board.c"
     $149 = ((($148)) + 4|0); //@line 192 "./board.c"
     $150 = HEAP32[$149>>2]|0; //@line 192 "./board.c"
     $151 = $15; //@line 192 "./board.c"
     $152 = (($150) + ($151<<2)|0); //@line 192 "./board.c"
     $153 = HEAP32[$152>>2]|0; //@line 192 "./board.c"
     $154 = $16; //@line 192 "./board.c"
     $155 = (($153) + ($154<<3)|0); //@line 192 "./board.c"
     $156 = +HEAPF64[$155>>3]; //@line 192 "./board.c"
     $157 = $14; //@line 192 "./board.c"
     $158 = ((($157)) + 4|0); //@line 192 "./board.c"
     $159 = HEAP32[$158>>2]|0; //@line 192 "./board.c"
     $160 = $15; //@line 192 "./board.c"
     $161 = (($159) + ($160<<2)|0); //@line 192 "./board.c"
     $162 = HEAP32[$161>>2]|0; //@line 192 "./board.c"
     $163 = $16; //@line 192 "./board.c"
     $164 = (($162) + ($163<<3)|0); //@line 192 "./board.c"
     HEAPF64[$164>>3] = $156; //@line 192 "./board.c"
     $165 = $16; //@line 187 "./board.c"
     $166 = (($165) + 1)|0; //@line 187 "./board.c"
     $16 = $166; //@line 187 "./board.c"
    }
    $167 = $15; //@line 186 "./board.c"
    $168 = (($167) + 1)|0; //@line 186 "./board.c"
    $15 = $168; //@line 186 "./board.c"
   }
   $169 = $12; //@line 196 "./board.c"
   $170 = HEAP32[$169>>2]|0; //@line 196 "./board.c"
   $171 = $7; //@line 196 "./board.c"
   $172 = (($170) + ($171<<2)|0); //@line 196 "./board.c"
   $173 = HEAP32[$172>>2]|0; //@line 196 "./board.c"
   $174 = $8; //@line 196 "./board.c"
   $175 = (($173) + ($174)|0); //@line 196 "./board.c"
   HEAP8[$175>>0] = 1; //@line 196 "./board.c"
   $176 = $13; //@line 197 "./board.c"
   $177 = HEAP32[$176>>2]|0; //@line 197 "./board.c"
   $178 = $7; //@line 197 "./board.c"
   $179 = (($177) + ($178<<2)|0); //@line 197 "./board.c"
   $180 = HEAP32[$179>>2]|0; //@line 197 "./board.c"
   $181 = $8; //@line 197 "./board.c"
   $182 = (($180) + ($181)|0); //@line 197 "./board.c"
   HEAP8[$182>>0] = 1; //@line 197 "./board.c"
   $183 = $14; //@line 198 "./board.c"
   $184 = HEAP32[$183>>2]|0; //@line 198 "./board.c"
   $185 = $7; //@line 198 "./board.c"
   $186 = (($184) + ($185<<2)|0); //@line 198 "./board.c"
   $187 = HEAP32[$186>>2]|0; //@line 198 "./board.c"
   $188 = $8; //@line 198 "./board.c"
   $189 = (($187) + ($188)|0); //@line 198 "./board.c"
   HEAP8[$189>>0] = 1; //@line 198 "./board.c"
   $190 = $13; //@line 199 "./board.c"
   $191 = ((($190)) + 4|0); //@line 199 "./board.c"
   $192 = HEAP32[$191>>2]|0; //@line 199 "./board.c"
   $193 = $7; //@line 199 "./board.c"
   $194 = (($192) + ($193<<2)|0); //@line 199 "./board.c"
   $195 = HEAP32[$194>>2]|0; //@line 199 "./board.c"
   $196 = $8; //@line 199 "./board.c"
   $197 = (($195) + ($196<<3)|0); //@line 199 "./board.c"
   HEAPF64[$197>>3] = 1.0; //@line 199 "./board.c"
   $198 = $14; //@line 200 "./board.c"
   $199 = ((($198)) + 4|0); //@line 200 "./board.c"
   $200 = HEAP32[$199>>2]|0; //@line 200 "./board.c"
   $201 = $7; //@line 200 "./board.c"
   $202 = (($200) + ($201<<2)|0); //@line 200 "./board.c"
   $203 = HEAP32[$202>>2]|0; //@line 200 "./board.c"
   $204 = $8; //@line 200 "./board.c"
   $205 = (($203) + ($204<<3)|0); //@line 200 "./board.c"
   HEAPF64[$205>>3] = 0.0; //@line 200 "./board.c"
   $17 = 0; //@line 202 "./board.c"
   while(1) {
    $206 = $17; //@line 202 "./board.c"
    $207 = ($206|0)<(8); //@line 202 "./board.c"
    if (!($207)) {
     break;
    }
    $208 = $10; //@line 204 "./board.c"
    $209 = $7; //@line 204 "./board.c"
    $210 = (($208) + ($209<<2)|0); //@line 204 "./board.c"
    $211 = HEAP32[$210>>2]|0; //@line 204 "./board.c"
    $212 = $8; //@line 204 "./board.c"
    $213 = (($211) + ($212<<2)|0); //@line 204 "./board.c"
    $214 = HEAP32[$213>>2]|0; //@line 204 "./board.c"
    $215 = HEAP32[$214>>2]|0; //@line 204 "./board.c"
    $216 = ((($215)) + 16|0); //@line 204 "./board.c"
    $217 = HEAP32[$216>>2]|0; //@line 204 "./board.c"
    $218 = $17; //@line 204 "./board.c"
    $219 = (($217) + ($218<<2)|0); //@line 204 "./board.c"
    $220 = HEAP32[$219>>2]|0; //@line 204 "./board.c"
    $221 = ($220|0)>(1); //@line 204 "./board.c"
    L15: do {
     if ($221) {
      $222 = $10; //@line 205 "./board.c"
      $223 = $7; //@line 205 "./board.c"
      $224 = (($222) + ($223<<2)|0); //@line 205 "./board.c"
      $225 = HEAP32[$224>>2]|0; //@line 205 "./board.c"
      $226 = $8; //@line 205 "./board.c"
      $227 = (($225) + ($226<<2)|0); //@line 205 "./board.c"
      $228 = HEAP32[$227>>2]|0; //@line 205 "./board.c"
      $229 = HEAP32[$228>>2]|0; //@line 205 "./board.c"
      $230 = ((($229)) + 12|0); //@line 205 "./board.c"
      $231 = HEAP32[$230>>2]|0; //@line 205 "./board.c"
      $232 = $17; //@line 205 "./board.c"
      $233 = (($231) + ($232<<2)|0); //@line 205 "./board.c"
      $234 = HEAP32[$233>>2]|0; //@line 205 "./board.c"
      $235 = ((($234)) + 8|0); //@line 205 "./board.c"
      $236 = +HEAPF64[$235>>3]; //@line 205 "./board.c"
      $237 = $10; //@line 205 "./board.c"
      $238 = $7; //@line 205 "./board.c"
      $239 = (($237) + ($238<<2)|0); //@line 205 "./board.c"
      $240 = HEAP32[$239>>2]|0; //@line 205 "./board.c"
      $241 = $8; //@line 205 "./board.c"
      $242 = (($240) + ($241<<2)|0); //@line 205 "./board.c"
      $243 = HEAP32[$242>>2]|0; //@line 205 "./board.c"
      $244 = HEAP32[$243>>2]|0; //@line 205 "./board.c"
      $245 = +HEAPF64[$244>>3]; //@line 205 "./board.c"
      $246 = $236 / $245; //@line 205 "./board.c"
      $20 = $246; //@line 205 "./board.c"
      $247 = $20; //@line 206 "./board.c"
      $248 = 1.0 - $247; //@line 206 "./board.c"
      $21 = $248; //@line 206 "./board.c"
      $249 = $20; //@line 207 "./board.c"
      $250 = $10; //@line 207 "./board.c"
      $251 = $7; //@line 207 "./board.c"
      $252 = (($250) + ($251<<2)|0); //@line 207 "./board.c"
      $253 = HEAP32[$252>>2]|0; //@line 207 "./board.c"
      $254 = $8; //@line 207 "./board.c"
      $255 = (($253) + ($254<<2)|0); //@line 207 "./board.c"
      $256 = HEAP32[$255>>2]|0; //@line 207 "./board.c"
      $257 = HEAP32[$256>>2]|0; //@line 207 "./board.c"
      $258 = ((($257)) + 12|0); //@line 207 "./board.c"
      $259 = HEAP32[$258>>2]|0; //@line 207 "./board.c"
      $260 = $17; //@line 207 "./board.c"
      $261 = (($259) + ($260<<2)|0); //@line 207 "./board.c"
      $262 = HEAP32[$261>>2]|0; //@line 207 "./board.c"
      $263 = ((($262)) + 8|0); //@line 207 "./board.c"
      $264 = +HEAPF64[$263>>3]; //@line 207 "./board.c"
      $265 = $249 / $264; //@line 207 "./board.c"
      $18 = $265; //@line 207 "./board.c"
      $266 = $21; //@line 208 "./board.c"
      $267 = $10; //@line 208 "./board.c"
      $268 = $7; //@line 208 "./board.c"
      $269 = (($267) + ($268<<2)|0); //@line 208 "./board.c"
      $270 = HEAP32[$269>>2]|0; //@line 208 "./board.c"
      $271 = $8; //@line 208 "./board.c"
      $272 = (($270) + ($271<<2)|0); //@line 208 "./board.c"
      $273 = HEAP32[$272>>2]|0; //@line 208 "./board.c"
      $274 = HEAP32[$273>>2]|0; //@line 208 "./board.c"
      $275 = ((($274)) + 12|0); //@line 208 "./board.c"
      $276 = HEAP32[$275>>2]|0; //@line 208 "./board.c"
      $277 = $17; //@line 208 "./board.c"
      $278 = (($276) + ($277<<2)|0); //@line 208 "./board.c"
      $279 = HEAP32[$278>>2]|0; //@line 208 "./board.c"
      $280 = ((($279)) + 8|0); //@line 208 "./board.c"
      $281 = +HEAPF64[$280>>3]; //@line 208 "./board.c"
      $282 = 1.0 - $281; //@line 208 "./board.c"
      $283 = $266 / $282; //@line 208 "./board.c"
      $19 = $283; //@line 208 "./board.c"
      $284 = $7; //@line 213 "./board.c"
      $22 = $284; //@line 213 "./board.c"
      $285 = $8; //@line 213 "./board.c"
      $23 = $285; //@line 213 "./board.c"
      $286 = $17; //@line 215 "./board.c"
      $287 = (8 + ($286<<2)|0); //@line 215 "./board.c"
      $288 = HEAP32[$287>>2]|0; //@line 215 "./board.c"
      $289 = $22; //@line 215 "./board.c"
      $290 = (($289) + ($288))|0; //@line 215 "./board.c"
      $22 = $290; //@line 215 "./board.c"
      $291 = $17; //@line 215 "./board.c"
      $292 = (40 + ($291<<2)|0); //@line 215 "./board.c"
      $293 = HEAP32[$292>>2]|0; //@line 215 "./board.c"
      $294 = $23; //@line 215 "./board.c"
      $295 = (($294) + ($293))|0; //@line 215 "./board.c"
      $23 = $295; //@line 215 "./board.c"
      $296 = $19; //@line 217 "./board.c"
      $297 = $296 * 1.0; //@line 217 "./board.c"
      $298 = $10; //@line 217 "./board.c"
      $299 = $7; //@line 217 "./board.c"
      $300 = (($298) + ($299<<2)|0); //@line 217 "./board.c"
      $301 = HEAP32[$300>>2]|0; //@line 217 "./board.c"
      $302 = $8; //@line 217 "./board.c"
      $303 = (($301) + ($302<<2)|0); //@line 217 "./board.c"
      $304 = HEAP32[$303>>2]|0; //@line 217 "./board.c"
      $305 = HEAP32[$304>>2]|0; //@line 217 "./board.c"
      $306 = ((($305)) + 8|0); //@line 217 "./board.c"
      $307 = HEAP32[$306>>2]|0; //@line 217 "./board.c"
      $308 = $17; //@line 217 "./board.c"
      $309 = (($307) + ($308<<2)|0); //@line 217 "./board.c"
      $310 = HEAP32[$309>>2]|0; //@line 217 "./board.c"
      $311 = +HEAPF64[$310>>3]; //@line 217 "./board.c"
      $312 = $297 * $311; //@line 217 "./board.c"
      $313 = $18; //@line 218 "./board.c"
      $314 = $313 * 1.0; //@line 218 "./board.c"
      $315 = $10; //@line 218 "./board.c"
      $316 = $7; //@line 218 "./board.c"
      $317 = (($315) + ($316<<2)|0); //@line 218 "./board.c"
      $318 = HEAP32[$317>>2]|0; //@line 218 "./board.c"
      $319 = $8; //@line 218 "./board.c"
      $320 = (($318) + ($319<<2)|0); //@line 218 "./board.c"
      $321 = HEAP32[$320>>2]|0; //@line 218 "./board.c"
      $322 = HEAP32[$321>>2]|0; //@line 218 "./board.c"
      $323 = ((($322)) + 12|0); //@line 218 "./board.c"
      $324 = HEAP32[$323>>2]|0; //@line 218 "./board.c"
      $325 = $17; //@line 218 "./board.c"
      $326 = (($324) + ($325<<2)|0); //@line 218 "./board.c"
      $327 = HEAP32[$326>>2]|0; //@line 218 "./board.c"
      $328 = ((($327)) + 8|0); //@line 218 "./board.c"
      $329 = +HEAPF64[$328>>3]; //@line 218 "./board.c"
      $330 = $314 * $329; //@line 218 "./board.c"
      $331 = $312 + $330; //@line 218 "./board.c"
      $332 = $13; //@line 216 "./board.c"
      $333 = ((($332)) + 4|0); //@line 216 "./board.c"
      $334 = HEAP32[$333>>2]|0; //@line 216 "./board.c"
      $335 = $22; //@line 216 "./board.c"
      $336 = (($334) + ($335<<2)|0); //@line 216 "./board.c"
      $337 = HEAP32[$336>>2]|0; //@line 216 "./board.c"
      $338 = $23; //@line 216 "./board.c"
      $339 = (($337) + ($338<<3)|0); //@line 216 "./board.c"
      HEAPF64[$339>>3] = $331; //@line 217 "./board.c"
      $24 = 1; //@line 220 "./board.c"
      while(1) {
       $340 = $24; //@line 220 "./board.c"
       $341 = $10; //@line 220 "./board.c"
       $342 = $7; //@line 220 "./board.c"
       $343 = (($341) + ($342<<2)|0); //@line 220 "./board.c"
       $344 = HEAP32[$343>>2]|0; //@line 220 "./board.c"
       $345 = $8; //@line 220 "./board.c"
       $346 = (($344) + ($345<<2)|0); //@line 220 "./board.c"
       $347 = HEAP32[$346>>2]|0; //@line 220 "./board.c"
       $348 = HEAP32[$347>>2]|0; //@line 220 "./board.c"
       $349 = ((($348)) + 16|0); //@line 220 "./board.c"
       $350 = HEAP32[$349>>2]|0; //@line 220 "./board.c"
       $351 = $17; //@line 220 "./board.c"
       $352 = (($350) + ($351<<2)|0); //@line 220 "./board.c"
       $353 = HEAP32[$352>>2]|0; //@line 220 "./board.c"
       $354 = ($340|0)<($353|0); //@line 220 "./board.c"
       if (!($354)) {
        break L15;
       }
       $355 = $17; //@line 221 "./board.c"
       $356 = (8 + ($355<<2)|0); //@line 221 "./board.c"
       $357 = HEAP32[$356>>2]|0; //@line 221 "./board.c"
       $358 = $22; //@line 221 "./board.c"
       $359 = (($358) + ($357))|0; //@line 221 "./board.c"
       $22 = $359; //@line 221 "./board.c"
       $360 = $17; //@line 221 "./board.c"
       $361 = (40 + ($360<<2)|0); //@line 221 "./board.c"
       $362 = HEAP32[$361>>2]|0; //@line 221 "./board.c"
       $363 = $23; //@line 221 "./board.c"
       $364 = (($363) + ($362))|0; //@line 221 "./board.c"
       $23 = $364; //@line 221 "./board.c"
       $365 = $19; //@line 223 "./board.c"
       $366 = $13; //@line 223 "./board.c"
       $367 = ((($366)) + 4|0); //@line 223 "./board.c"
       $368 = HEAP32[$367>>2]|0; //@line 223 "./board.c"
       $369 = $22; //@line 223 "./board.c"
       $370 = (($368) + ($369<<2)|0); //@line 223 "./board.c"
       $371 = HEAP32[$370>>2]|0; //@line 223 "./board.c"
       $372 = $23; //@line 223 "./board.c"
       $373 = (($371) + ($372<<3)|0); //@line 223 "./board.c"
       $374 = +HEAPF64[$373>>3]; //@line 223 "./board.c"
       $375 = $365 * $374; //@line 223 "./board.c"
       $376 = $10; //@line 224 "./board.c"
       $377 = $7; //@line 224 "./board.c"
       $378 = (($376) + ($377<<2)|0); //@line 224 "./board.c"
       $379 = HEAP32[$378>>2]|0; //@line 224 "./board.c"
       $380 = $8; //@line 224 "./board.c"
       $381 = (($379) + ($380<<2)|0); //@line 224 "./board.c"
       $382 = HEAP32[$381>>2]|0; //@line 224 "./board.c"
       $383 = HEAP32[$382>>2]|0; //@line 224 "./board.c"
       $384 = ((($383)) + 8|0); //@line 224 "./board.c"
       $385 = HEAP32[$384>>2]|0; //@line 224 "./board.c"
       $386 = $17; //@line 224 "./board.c"
       $387 = (($385) + ($386<<2)|0); //@line 224 "./board.c"
       $388 = HEAP32[$387>>2]|0; //@line 224 "./board.c"
       $389 = +HEAPF64[$388>>3]; //@line 224 "./board.c"
       $390 = $375 * $389; //@line 224 "./board.c"
       $391 = $18; //@line 225 "./board.c"
       $392 = $391 * 1.0; //@line 225 "./board.c"
       $393 = $10; //@line 225 "./board.c"
       $394 = $7; //@line 225 "./board.c"
       $395 = (($393) + ($394<<2)|0); //@line 225 "./board.c"
       $396 = HEAP32[$395>>2]|0; //@line 225 "./board.c"
       $397 = $8; //@line 225 "./board.c"
       $398 = (($396) + ($397<<2)|0); //@line 225 "./board.c"
       $399 = HEAP32[$398>>2]|0; //@line 225 "./board.c"
       $400 = HEAP32[$399>>2]|0; //@line 225 "./board.c"
       $401 = ((($400)) + 12|0); //@line 225 "./board.c"
       $402 = HEAP32[$401>>2]|0; //@line 225 "./board.c"
       $403 = $17; //@line 225 "./board.c"
       $404 = (($402) + ($403<<2)|0); //@line 225 "./board.c"
       $405 = HEAP32[$404>>2]|0; //@line 225 "./board.c"
       $406 = $24; //@line 225 "./board.c"
       $407 = (($405) + ($406<<3)|0); //@line 225 "./board.c"
       $408 = +HEAPF64[$407>>3]; //@line 225 "./board.c"
       $409 = $392 * $408; //@line 225 "./board.c"
       $410 = $390 + $409; //@line 225 "./board.c"
       $411 = $18; //@line 226 "./board.c"
       $412 = $13; //@line 226 "./board.c"
       $413 = ((($412)) + 4|0); //@line 226 "./board.c"
       $414 = HEAP32[$413>>2]|0; //@line 226 "./board.c"
       $415 = $22; //@line 226 "./board.c"
       $416 = (($414) + ($415<<2)|0); //@line 226 "./board.c"
       $417 = HEAP32[$416>>2]|0; //@line 226 "./board.c"
       $418 = $23; //@line 226 "./board.c"
       $419 = (($417) + ($418<<3)|0); //@line 226 "./board.c"
       $420 = +HEAPF64[$419>>3]; //@line 226 "./board.c"
       $421 = $411 * $420; //@line 226 "./board.c"
       $422 = $10; //@line 227 "./board.c"
       $423 = $7; //@line 227 "./board.c"
       $424 = (($422) + ($423<<2)|0); //@line 227 "./board.c"
       $425 = HEAP32[$424>>2]|0; //@line 227 "./board.c"
       $426 = $8; //@line 227 "./board.c"
       $427 = (($425) + ($426<<2)|0); //@line 227 "./board.c"
       $428 = HEAP32[$427>>2]|0; //@line 227 "./board.c"
       $429 = HEAP32[$428>>2]|0; //@line 227 "./board.c"
       $430 = ((($429)) + 12|0); //@line 227 "./board.c"
       $431 = HEAP32[$430>>2]|0; //@line 227 "./board.c"
       $432 = $17; //@line 227 "./board.c"
       $433 = (($431) + ($432<<2)|0); //@line 227 "./board.c"
       $434 = HEAP32[$433>>2]|0; //@line 227 "./board.c"
       $435 = ((($434)) + 8|0); //@line 227 "./board.c"
       $436 = +HEAPF64[$435>>3]; //@line 227 "./board.c"
       $437 = $10; //@line 228 "./board.c"
       $438 = $7; //@line 228 "./board.c"
       $439 = (($437) + ($438<<2)|0); //@line 228 "./board.c"
       $440 = HEAP32[$439>>2]|0; //@line 228 "./board.c"
       $441 = $8; //@line 228 "./board.c"
       $442 = (($440) + ($441<<2)|0); //@line 228 "./board.c"
       $443 = HEAP32[$442>>2]|0; //@line 228 "./board.c"
       $444 = HEAP32[$443>>2]|0; //@line 228 "./board.c"
       $445 = ((($444)) + 12|0); //@line 228 "./board.c"
       $446 = HEAP32[$445>>2]|0; //@line 228 "./board.c"
       $447 = $17; //@line 228 "./board.c"
       $448 = (($446) + ($447<<2)|0); //@line 228 "./board.c"
       $449 = HEAP32[$448>>2]|0; //@line 228 "./board.c"
       $450 = $24; //@line 228 "./board.c"
       $451 = (($449) + ($450<<3)|0); //@line 228 "./board.c"
       $452 = +HEAPF64[$451>>3]; //@line 228 "./board.c"
       $453 = $436 - $452; //@line 228 "./board.c"
       $454 = $421 * $453; //@line 227 "./board.c"
       $455 = $410 + $454; //@line 226 "./board.c"
       $456 = $13; //@line 222 "./board.c"
       $457 = ((($456)) + 4|0); //@line 222 "./board.c"
       $458 = HEAP32[$457>>2]|0; //@line 222 "./board.c"
       $459 = $22; //@line 222 "./board.c"
       $460 = (($458) + ($459<<2)|0); //@line 222 "./board.c"
       $461 = HEAP32[$460>>2]|0; //@line 222 "./board.c"
       $462 = $23; //@line 222 "./board.c"
       $463 = (($461) + ($462<<3)|0); //@line 222 "./board.c"
       HEAPF64[$463>>3] = $455; //@line 223 "./board.c"
       $464 = $24; //@line 220 "./board.c"
       $465 = (($464) + 1)|0; //@line 220 "./board.c"
       $24 = $465; //@line 220 "./board.c"
      }
     }
    } while(0);
    $466 = $17; //@line 202 "./board.c"
    $467 = (($466) + 1)|0; //@line 202 "./board.c"
    $17 = $467; //@line 202 "./board.c"
   }
   $25 = 0; //@line 232 "./board.c"
   while(1) {
    $468 = $25; //@line 232 "./board.c"
    $469 = ($468|0)<(8); //@line 232 "./board.c"
    if (!($469)) {
     break;
    }
    $470 = $10; //@line 234 "./board.c"
    $471 = $7; //@line 234 "./board.c"
    $472 = (($470) + ($471<<2)|0); //@line 234 "./board.c"
    $473 = HEAP32[$472>>2]|0; //@line 234 "./board.c"
    $474 = $8; //@line 234 "./board.c"
    $475 = (($473) + ($474<<2)|0); //@line 234 "./board.c"
    $476 = HEAP32[$475>>2]|0; //@line 234 "./board.c"
    $477 = ((($476)) + 4|0); //@line 234 "./board.c"
    $478 = HEAP32[$477>>2]|0; //@line 234 "./board.c"
    $479 = ((($478)) + 16|0); //@line 234 "./board.c"
    $480 = HEAP32[$479>>2]|0; //@line 234 "./board.c"
    $481 = $25; //@line 234 "./board.c"
    $482 = (($480) + ($481<<2)|0); //@line 234 "./board.c"
    $483 = HEAP32[$482>>2]|0; //@line 234 "./board.c"
    $484 = ($483|0)>(1); //@line 234 "./board.c"
    L25: do {
     if ($484) {
      $485 = $10; //@line 235 "./board.c"
      $486 = $7; //@line 235 "./board.c"
      $487 = (($485) + ($486<<2)|0); //@line 235 "./board.c"
      $488 = HEAP32[$487>>2]|0; //@line 235 "./board.c"
      $489 = $8; //@line 235 "./board.c"
      $490 = (($488) + ($489<<2)|0); //@line 235 "./board.c"
      $491 = HEAP32[$490>>2]|0; //@line 235 "./board.c"
      $492 = ((($491)) + 4|0); //@line 235 "./board.c"
      $493 = HEAP32[$492>>2]|0; //@line 235 "./board.c"
      $494 = ((($493)) + 12|0); //@line 235 "./board.c"
      $495 = HEAP32[$494>>2]|0; //@line 235 "./board.c"
      $496 = $25; //@line 235 "./board.c"
      $497 = (($495) + ($496<<2)|0); //@line 235 "./board.c"
      $498 = HEAP32[$497>>2]|0; //@line 235 "./board.c"
      $499 = ((($498)) + 8|0); //@line 235 "./board.c"
      $500 = +HEAPF64[$499>>3]; //@line 235 "./board.c"
      $501 = $10; //@line 235 "./board.c"
      $502 = $7; //@line 235 "./board.c"
      $503 = (($501) + ($502<<2)|0); //@line 235 "./board.c"
      $504 = HEAP32[$503>>2]|0; //@line 235 "./board.c"
      $505 = $8; //@line 235 "./board.c"
      $506 = (($504) + ($505<<2)|0); //@line 235 "./board.c"
      $507 = HEAP32[$506>>2]|0; //@line 235 "./board.c"
      $508 = ((($507)) + 4|0); //@line 235 "./board.c"
      $509 = HEAP32[$508>>2]|0; //@line 235 "./board.c"
      $510 = +HEAPF64[$509>>3]; //@line 235 "./board.c"
      $511 = $500 / $510; //@line 235 "./board.c"
      $28 = $511; //@line 235 "./board.c"
      $512 = $28; //@line 236 "./board.c"
      $513 = 1.0 - $512; //@line 236 "./board.c"
      $29 = $513; //@line 236 "./board.c"
      $514 = $28; //@line 237 "./board.c"
      $515 = $10; //@line 237 "./board.c"
      $516 = $7; //@line 237 "./board.c"
      $517 = (($515) + ($516<<2)|0); //@line 237 "./board.c"
      $518 = HEAP32[$517>>2]|0; //@line 237 "./board.c"
      $519 = $8; //@line 237 "./board.c"
      $520 = (($518) + ($519<<2)|0); //@line 237 "./board.c"
      $521 = HEAP32[$520>>2]|0; //@line 237 "./board.c"
      $522 = ((($521)) + 4|0); //@line 237 "./board.c"
      $523 = HEAP32[$522>>2]|0; //@line 237 "./board.c"
      $524 = ((($523)) + 12|0); //@line 237 "./board.c"
      $525 = HEAP32[$524>>2]|0; //@line 237 "./board.c"
      $526 = $25; //@line 237 "./board.c"
      $527 = (($525) + ($526<<2)|0); //@line 237 "./board.c"
      $528 = HEAP32[$527>>2]|0; //@line 237 "./board.c"
      $529 = ((($528)) + 8|0); //@line 237 "./board.c"
      $530 = +HEAPF64[$529>>3]; //@line 237 "./board.c"
      $531 = $514 / $530; //@line 237 "./board.c"
      $26 = $531; //@line 237 "./board.c"
      $532 = $29; //@line 238 "./board.c"
      $533 = $10; //@line 238 "./board.c"
      $534 = $7; //@line 238 "./board.c"
      $535 = (($533) + ($534<<2)|0); //@line 238 "./board.c"
      $536 = HEAP32[$535>>2]|0; //@line 238 "./board.c"
      $537 = $8; //@line 238 "./board.c"
      $538 = (($536) + ($537<<2)|0); //@line 238 "./board.c"
      $539 = HEAP32[$538>>2]|0; //@line 238 "./board.c"
      $540 = ((($539)) + 4|0); //@line 238 "./board.c"
      $541 = HEAP32[$540>>2]|0; //@line 238 "./board.c"
      $542 = ((($541)) + 12|0); //@line 238 "./board.c"
      $543 = HEAP32[$542>>2]|0; //@line 238 "./board.c"
      $544 = $25; //@line 238 "./board.c"
      $545 = (($543) + ($544<<2)|0); //@line 238 "./board.c"
      $546 = HEAP32[$545>>2]|0; //@line 238 "./board.c"
      $547 = ((($546)) + 8|0); //@line 238 "./board.c"
      $548 = +HEAPF64[$547>>3]; //@line 238 "./board.c"
      $549 = 1.0 - $548; //@line 238 "./board.c"
      $550 = $532 / $549; //@line 238 "./board.c"
      $27 = $550; //@line 238 "./board.c"
      $551 = $7; //@line 243 "./board.c"
      $30 = $551; //@line 243 "./board.c"
      $552 = $8; //@line 243 "./board.c"
      $31 = $552; //@line 243 "./board.c"
      $553 = $25; //@line 245 "./board.c"
      $554 = (8 + ($553<<2)|0); //@line 245 "./board.c"
      $555 = HEAP32[$554>>2]|0; //@line 245 "./board.c"
      $556 = $30; //@line 245 "./board.c"
      $557 = (($556) + ($555))|0; //@line 245 "./board.c"
      $30 = $557; //@line 245 "./board.c"
      $558 = $25; //@line 245 "./board.c"
      $559 = (40 + ($558<<2)|0); //@line 245 "./board.c"
      $560 = HEAP32[$559>>2]|0; //@line 245 "./board.c"
      $561 = $31; //@line 245 "./board.c"
      $562 = (($561) + ($560))|0; //@line 245 "./board.c"
      $31 = $562; //@line 245 "./board.c"
      $563 = $27; //@line 247 "./board.c"
      $564 = $563 * 0.0; //@line 247 "./board.c"
      $565 = $10; //@line 247 "./board.c"
      $566 = $7; //@line 247 "./board.c"
      $567 = (($565) + ($566<<2)|0); //@line 247 "./board.c"
      $568 = HEAP32[$567>>2]|0; //@line 247 "./board.c"
      $569 = $8; //@line 247 "./board.c"
      $570 = (($568) + ($569<<2)|0); //@line 247 "./board.c"
      $571 = HEAP32[$570>>2]|0; //@line 247 "./board.c"
      $572 = ((($571)) + 4|0); //@line 247 "./board.c"
      $573 = HEAP32[$572>>2]|0; //@line 247 "./board.c"
      $574 = ((($573)) + 8|0); //@line 247 "./board.c"
      $575 = HEAP32[$574>>2]|0; //@line 247 "./board.c"
      $576 = $25; //@line 247 "./board.c"
      $577 = (($575) + ($576<<2)|0); //@line 247 "./board.c"
      $578 = HEAP32[$577>>2]|0; //@line 247 "./board.c"
      $579 = +HEAPF64[$578>>3]; //@line 247 "./board.c"
      $580 = $564 * $579; //@line 247 "./board.c"
      $581 = $26; //@line 248 "./board.c"
      $582 = $581 * 0.0; //@line 248 "./board.c"
      $583 = $10; //@line 248 "./board.c"
      $584 = $7; //@line 248 "./board.c"
      $585 = (($583) + ($584<<2)|0); //@line 248 "./board.c"
      $586 = HEAP32[$585>>2]|0; //@line 248 "./board.c"
      $587 = $8; //@line 248 "./board.c"
      $588 = (($586) + ($587<<2)|0); //@line 248 "./board.c"
      $589 = HEAP32[$588>>2]|0; //@line 248 "./board.c"
      $590 = ((($589)) + 4|0); //@line 248 "./board.c"
      $591 = HEAP32[$590>>2]|0; //@line 248 "./board.c"
      $592 = ((($591)) + 12|0); //@line 248 "./board.c"
      $593 = HEAP32[$592>>2]|0; //@line 248 "./board.c"
      $594 = $25; //@line 248 "./board.c"
      $595 = (($593) + ($594<<2)|0); //@line 248 "./board.c"
      $596 = HEAP32[$595>>2]|0; //@line 248 "./board.c"
      $597 = ((($596)) + 8|0); //@line 248 "./board.c"
      $598 = +HEAPF64[$597>>3]; //@line 248 "./board.c"
      $599 = $582 * $598; //@line 248 "./board.c"
      $600 = $580 + $599; //@line 248 "./board.c"
      $601 = $27; //@line 249 "./board.c"
      $602 = $601 * 1.0; //@line 249 "./board.c"
      $603 = $10; //@line 249 "./board.c"
      $604 = $7; //@line 249 "./board.c"
      $605 = (($603) + ($604<<2)|0); //@line 249 "./board.c"
      $606 = HEAP32[$605>>2]|0; //@line 249 "./board.c"
      $607 = $8; //@line 249 "./board.c"
      $608 = (($606) + ($607<<2)|0); //@line 249 "./board.c"
      $609 = HEAP32[$608>>2]|0; //@line 249 "./board.c"
      $610 = ((($609)) + 4|0); //@line 249 "./board.c"
      $611 = HEAP32[$610>>2]|0; //@line 249 "./board.c"
      $612 = ((($611)) + 8|0); //@line 249 "./board.c"
      $613 = HEAP32[$612>>2]|0; //@line 249 "./board.c"
      $614 = $25; //@line 249 "./board.c"
      $615 = (($613) + ($614<<2)|0); //@line 249 "./board.c"
      $616 = HEAP32[$615>>2]|0; //@line 249 "./board.c"
      $617 = $10; //@line 250 "./board.c"
      $618 = $7; //@line 250 "./board.c"
      $619 = (($617) + ($618<<2)|0); //@line 250 "./board.c"
      $620 = HEAP32[$619>>2]|0; //@line 250 "./board.c"
      $621 = $8; //@line 250 "./board.c"
      $622 = (($620) + ($621<<2)|0); //@line 250 "./board.c"
      $623 = HEAP32[$622>>2]|0; //@line 250 "./board.c"
      $624 = ((($623)) + 4|0); //@line 250 "./board.c"
      $625 = HEAP32[$624>>2]|0; //@line 250 "./board.c"
      $626 = ((($625)) + 16|0); //@line 250 "./board.c"
      $627 = HEAP32[$626>>2]|0; //@line 250 "./board.c"
      $628 = $25; //@line 250 "./board.c"
      $629 = (($627) + ($628<<2)|0); //@line 250 "./board.c"
      $630 = HEAP32[$629>>2]|0; //@line 250 "./board.c"
      $631 = (($616) + ($630<<3)|0); //@line 249 "./board.c"
      $632 = +HEAPF64[$631>>3]; //@line 249 "./board.c"
      $633 = $602 * $632; //@line 249 "./board.c"
      $634 = $600 + $633; //@line 249 "./board.c"
      $635 = $14; //@line 246 "./board.c"
      $636 = ((($635)) + 4|0); //@line 246 "./board.c"
      $637 = HEAP32[$636>>2]|0; //@line 246 "./board.c"
      $638 = $30; //@line 246 "./board.c"
      $639 = (($637) + ($638<<2)|0); //@line 246 "./board.c"
      $640 = HEAP32[$639>>2]|0; //@line 246 "./board.c"
      $641 = $31; //@line 246 "./board.c"
      $642 = (($640) + ($641<<3)|0); //@line 246 "./board.c"
      HEAPF64[$642>>3] = $634; //@line 247 "./board.c"
      $32 = 1; //@line 252 "./board.c"
      while(1) {
       $643 = $32; //@line 252 "./board.c"
       $644 = $10; //@line 252 "./board.c"
       $645 = $7; //@line 252 "./board.c"
       $646 = (($644) + ($645<<2)|0); //@line 252 "./board.c"
       $647 = HEAP32[$646>>2]|0; //@line 252 "./board.c"
       $648 = $8; //@line 252 "./board.c"
       $649 = (($647) + ($648<<2)|0); //@line 252 "./board.c"
       $650 = HEAP32[$649>>2]|0; //@line 252 "./board.c"
       $651 = ((($650)) + 4|0); //@line 252 "./board.c"
       $652 = HEAP32[$651>>2]|0; //@line 252 "./board.c"
       $653 = ((($652)) + 16|0); //@line 252 "./board.c"
       $654 = HEAP32[$653>>2]|0; //@line 252 "./board.c"
       $655 = $25; //@line 252 "./board.c"
       $656 = (($654) + ($655<<2)|0); //@line 252 "./board.c"
       $657 = HEAP32[$656>>2]|0; //@line 252 "./board.c"
       $658 = ($643|0)<($657|0); //@line 252 "./board.c"
       if (!($658)) {
        break L25;
       }
       $659 = $25; //@line 253 "./board.c"
       $660 = (8 + ($659<<2)|0); //@line 253 "./board.c"
       $661 = HEAP32[$660>>2]|0; //@line 253 "./board.c"
       $662 = $30; //@line 253 "./board.c"
       $663 = (($662) + ($661))|0; //@line 253 "./board.c"
       $30 = $663; //@line 253 "./board.c"
       $664 = $25; //@line 253 "./board.c"
       $665 = (40 + ($664<<2)|0); //@line 253 "./board.c"
       $666 = HEAP32[$665>>2]|0; //@line 253 "./board.c"
       $667 = $31; //@line 253 "./board.c"
       $668 = (($667) + ($666))|0; //@line 253 "./board.c"
       $31 = $668; //@line 253 "./board.c"
       $669 = $27; //@line 255 "./board.c"
       $670 = $14; //@line 255 "./board.c"
       $671 = ((($670)) + 4|0); //@line 255 "./board.c"
       $672 = HEAP32[$671>>2]|0; //@line 255 "./board.c"
       $673 = $30; //@line 255 "./board.c"
       $674 = (($672) + ($673<<2)|0); //@line 255 "./board.c"
       $675 = HEAP32[$674>>2]|0; //@line 255 "./board.c"
       $676 = $31; //@line 255 "./board.c"
       $677 = (($675) + ($676<<3)|0); //@line 255 "./board.c"
       $678 = +HEAPF64[$677>>3]; //@line 255 "./board.c"
       $679 = $669 * $678; //@line 255 "./board.c"
       $680 = $10; //@line 256 "./board.c"
       $681 = $7; //@line 256 "./board.c"
       $682 = (($680) + ($681<<2)|0); //@line 256 "./board.c"
       $683 = HEAP32[$682>>2]|0; //@line 256 "./board.c"
       $684 = $8; //@line 256 "./board.c"
       $685 = (($683) + ($684<<2)|0); //@line 256 "./board.c"
       $686 = HEAP32[$685>>2]|0; //@line 256 "./board.c"
       $687 = ((($686)) + 4|0); //@line 256 "./board.c"
       $688 = HEAP32[$687>>2]|0; //@line 256 "./board.c"
       $689 = ((($688)) + 8|0); //@line 256 "./board.c"
       $690 = HEAP32[$689>>2]|0; //@line 256 "./board.c"
       $691 = $25; //@line 256 "./board.c"
       $692 = (($690) + ($691<<2)|0); //@line 256 "./board.c"
       $693 = HEAP32[$692>>2]|0; //@line 256 "./board.c"
       $694 = +HEAPF64[$693>>3]; //@line 256 "./board.c"
       $695 = $679 * $694; //@line 256 "./board.c"
       $696 = $26; //@line 257 "./board.c"
       $697 = $696 * 0.0; //@line 257 "./board.c"
       $698 = $10; //@line 257 "./board.c"
       $699 = $7; //@line 257 "./board.c"
       $700 = (($698) + ($699<<2)|0); //@line 257 "./board.c"
       $701 = HEAP32[$700>>2]|0; //@line 257 "./board.c"
       $702 = $8; //@line 257 "./board.c"
       $703 = (($701) + ($702<<2)|0); //@line 257 "./board.c"
       $704 = HEAP32[$703>>2]|0; //@line 257 "./board.c"
       $705 = ((($704)) + 4|0); //@line 257 "./board.c"
       $706 = HEAP32[$705>>2]|0; //@line 257 "./board.c"
       $707 = ((($706)) + 12|0); //@line 257 "./board.c"
       $708 = HEAP32[$707>>2]|0; //@line 257 "./board.c"
       $709 = $25; //@line 257 "./board.c"
       $710 = (($708) + ($709<<2)|0); //@line 257 "./board.c"
       $711 = HEAP32[$710>>2]|0; //@line 257 "./board.c"
       $712 = $32; //@line 257 "./board.c"
       $713 = (($711) + ($712<<3)|0); //@line 257 "./board.c"
       $714 = +HEAPF64[$713>>3]; //@line 257 "./board.c"
       $715 = $697 * $714; //@line 257 "./board.c"
       $716 = $695 + $715; //@line 257 "./board.c"
       $717 = $26; //@line 258 "./board.c"
       $718 = $14; //@line 258 "./board.c"
       $719 = ((($718)) + 4|0); //@line 258 "./board.c"
       $720 = HEAP32[$719>>2]|0; //@line 258 "./board.c"
       $721 = $30; //@line 258 "./board.c"
       $722 = (($720) + ($721<<2)|0); //@line 258 "./board.c"
       $723 = HEAP32[$722>>2]|0; //@line 258 "./board.c"
       $724 = $31; //@line 258 "./board.c"
       $725 = (($723) + ($724<<3)|0); //@line 258 "./board.c"
       $726 = +HEAPF64[$725>>3]; //@line 258 "./board.c"
       $727 = $717 * $726; //@line 258 "./board.c"
       $728 = $10; //@line 259 "./board.c"
       $729 = $7; //@line 259 "./board.c"
       $730 = (($728) + ($729<<2)|0); //@line 259 "./board.c"
       $731 = HEAP32[$730>>2]|0; //@line 259 "./board.c"
       $732 = $8; //@line 259 "./board.c"
       $733 = (($731) + ($732<<2)|0); //@line 259 "./board.c"
       $734 = HEAP32[$733>>2]|0; //@line 259 "./board.c"
       $735 = ((($734)) + 4|0); //@line 259 "./board.c"
       $736 = HEAP32[$735>>2]|0; //@line 259 "./board.c"
       $737 = ((($736)) + 12|0); //@line 259 "./board.c"
       $738 = HEAP32[$737>>2]|0; //@line 259 "./board.c"
       $739 = $25; //@line 259 "./board.c"
       $740 = (($738) + ($739<<2)|0); //@line 259 "./board.c"
       $741 = HEAP32[$740>>2]|0; //@line 259 "./board.c"
       $742 = ((($741)) + 8|0); //@line 259 "./board.c"
       $743 = +HEAPF64[$742>>3]; //@line 259 "./board.c"
       $744 = $10; //@line 260 "./board.c"
       $745 = $7; //@line 260 "./board.c"
       $746 = (($744) + ($745<<2)|0); //@line 260 "./board.c"
       $747 = HEAP32[$746>>2]|0; //@line 260 "./board.c"
       $748 = $8; //@line 260 "./board.c"
       $749 = (($747) + ($748<<2)|0); //@line 260 "./board.c"
       $750 = HEAP32[$749>>2]|0; //@line 260 "./board.c"
       $751 = ((($750)) + 4|0); //@line 260 "./board.c"
       $752 = HEAP32[$751>>2]|0; //@line 260 "./board.c"
       $753 = ((($752)) + 12|0); //@line 260 "./board.c"
       $754 = HEAP32[$753>>2]|0; //@line 260 "./board.c"
       $755 = $25; //@line 260 "./board.c"
       $756 = (($754) + ($755<<2)|0); //@line 260 "./board.c"
       $757 = HEAP32[$756>>2]|0; //@line 260 "./board.c"
       $758 = $32; //@line 260 "./board.c"
       $759 = (($757) + ($758<<3)|0); //@line 260 "./board.c"
       $760 = +HEAPF64[$759>>3]; //@line 260 "./board.c"
       $761 = $743 - $760; //@line 260 "./board.c"
       $762 = $727 * $761; //@line 259 "./board.c"
       $763 = $716 + $762; //@line 258 "./board.c"
       $764 = $27; //@line 261 "./board.c"
       $765 = $764 * 1.0; //@line 261 "./board.c"
       $766 = $10; //@line 261 "./board.c"
       $767 = $7; //@line 261 "./board.c"
       $768 = (($766) + ($767<<2)|0); //@line 261 "./board.c"
       $769 = HEAP32[$768>>2]|0; //@line 261 "./board.c"
       $770 = $8; //@line 261 "./board.c"
       $771 = (($769) + ($770<<2)|0); //@line 261 "./board.c"
       $772 = HEAP32[$771>>2]|0; //@line 261 "./board.c"
       $773 = ((($772)) + 4|0); //@line 261 "./board.c"
       $774 = HEAP32[$773>>2]|0; //@line 261 "./board.c"
       $775 = ((($774)) + 8|0); //@line 261 "./board.c"
       $776 = HEAP32[$775>>2]|0; //@line 261 "./board.c"
       $777 = $25; //@line 261 "./board.c"
       $778 = (($776) + ($777<<2)|0); //@line 261 "./board.c"
       $779 = HEAP32[$778>>2]|0; //@line 261 "./board.c"
       $780 = $10; //@line 262 "./board.c"
       $781 = $7; //@line 262 "./board.c"
       $782 = (($780) + ($781<<2)|0); //@line 262 "./board.c"
       $783 = HEAP32[$782>>2]|0; //@line 262 "./board.c"
       $784 = $8; //@line 262 "./board.c"
       $785 = (($783) + ($784<<2)|0); //@line 262 "./board.c"
       $786 = HEAP32[$785>>2]|0; //@line 262 "./board.c"
       $787 = ((($786)) + 4|0); //@line 262 "./board.c"
       $788 = HEAP32[$787>>2]|0; //@line 262 "./board.c"
       $789 = ((($788)) + 16|0); //@line 262 "./board.c"
       $790 = HEAP32[$789>>2]|0; //@line 262 "./board.c"
       $791 = $25; //@line 262 "./board.c"
       $792 = (($790) + ($791<<2)|0); //@line 262 "./board.c"
       $793 = HEAP32[$792>>2]|0; //@line 262 "./board.c"
       $794 = (($779) + ($793<<3)|0); //@line 261 "./board.c"
       $795 = +HEAPF64[$794>>3]; //@line 261 "./board.c"
       $796 = $765 * $795; //@line 261 "./board.c"
       $797 = $763 + $796; //@line 261 "./board.c"
       $798 = $14; //@line 254 "./board.c"
       $799 = ((($798)) + 4|0); //@line 254 "./board.c"
       $800 = HEAP32[$799>>2]|0; //@line 254 "./board.c"
       $801 = $30; //@line 254 "./board.c"
       $802 = (($800) + ($801<<2)|0); //@line 254 "./board.c"
       $803 = HEAP32[$802>>2]|0; //@line 254 "./board.c"
       $804 = $31; //@line 254 "./board.c"
       $805 = (($803) + ($804<<3)|0); //@line 254 "./board.c"
       HEAPF64[$805>>3] = $797; //@line 255 "./board.c"
       $806 = $32; //@line 252 "./board.c"
       $807 = (($806) + 1)|0; //@line 252 "./board.c"
       $32 = $807; //@line 252 "./board.c"
      }
     }
    } while(0);
    $808 = $25; //@line 232 "./board.c"
    $809 = (($808) + 1)|0; //@line 232 "./board.c"
    $25 = $809; //@line 232 "./board.c"
   }
   $33 = 0; //@line 266 "./board.c"
   while(1) {
    $810 = $33; //@line 266 "./board.c"
    $811 = ($810|0)<(8); //@line 266 "./board.c"
    if (!($811)) {
     break;
    }
    $34 = 0; //@line 267 "./board.c"
    while(1) {
     $812 = $34; //@line 267 "./board.c"
     $813 = ($812|0)<(8); //@line 267 "./board.c"
     if (!($813)) {
      break;
     }
     $814 = $9; //@line 268 "./board.c"
     $815 = $13; //@line 268 "./board.c"
     $816 = ((($815)) + 4|0); //@line 268 "./board.c"
     $817 = HEAP32[$816>>2]|0; //@line 268 "./board.c"
     $818 = $33; //@line 268 "./board.c"
     $819 = (($817) + ($818<<2)|0); //@line 268 "./board.c"
     $820 = HEAP32[$819>>2]|0; //@line 268 "./board.c"
     $821 = $34; //@line 268 "./board.c"
     $822 = (($820) + ($821<<3)|0); //@line 268 "./board.c"
     $823 = +HEAPF64[$822>>3]; //@line 268 "./board.c"
     $824 = $814 * $823; //@line 268 "./board.c"
     $825 = $9; //@line 269 "./board.c"
     $826 = 1.0 - $825; //@line 269 "./board.c"
     $827 = $14; //@line 269 "./board.c"
     $828 = ((($827)) + 4|0); //@line 269 "./board.c"
     $829 = HEAP32[$828>>2]|0; //@line 269 "./board.c"
     $830 = $33; //@line 269 "./board.c"
     $831 = (($829) + ($830<<2)|0); //@line 269 "./board.c"
     $832 = HEAP32[$831>>2]|0; //@line 269 "./board.c"
     $833 = $34; //@line 269 "./board.c"
     $834 = (($832) + ($833<<3)|0); //@line 269 "./board.c"
     $835 = +HEAPF64[$834>>3]; //@line 269 "./board.c"
     $836 = $826 * $835; //@line 269 "./board.c"
     $837 = $824 + $836; //@line 269 "./board.c"
     $838 = $12; //@line 268 "./board.c"
     $839 = ((($838)) + 4|0); //@line 268 "./board.c"
     $840 = HEAP32[$839>>2]|0; //@line 268 "./board.c"
     $841 = $33; //@line 268 "./board.c"
     $842 = (($840) + ($841<<2)|0); //@line 268 "./board.c"
     $843 = HEAP32[$842>>2]|0; //@line 268 "./board.c"
     $844 = $34; //@line 268 "./board.c"
     $845 = (($843) + ($844<<3)|0); //@line 268 "./board.c"
     HEAPF64[$845>>3] = $837; //@line 268 "./board.c"
     $846 = $34; //@line 267 "./board.c"
     $847 = (($846) + 1)|0; //@line 267 "./board.c"
     $34 = $847; //@line 267 "./board.c"
    }
    $848 = $33; //@line 266 "./board.c"
    $849 = (($848) + 1)|0; //@line 266 "./board.c"
    $33 = $849; //@line 266 "./board.c"
   }
   $850 = $13; //@line 273 "./board.c"
   _board_delete($850); //@line 273 "./board.c"
   $851 = $14; //@line 274 "./board.c"
   _board_delete($851); //@line 274 "./board.c"
   $852 = $12; //@line 276 "./board.c"
   $5 = $852; //@line 276 "./board.c"
   $853 = $5; //@line 277 "./board.c"
   STACKTOP = sp;return ($853|0); //@line 277 "./board.c"
  }
 }
 $5 = 0; //@line 180 "./board.c"
 $853 = $5; //@line 277 "./board.c"
 STACKTOP = sp;return ($853|0); //@line 277 "./board.c"
}
function _board_get($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$ = 0, $$$ = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0.0, $52 = 0.0, $53 = 0.0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0;
 var $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $7 = 0, $8 = 0, $9 = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, $vararg_buffer3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(48|0);
 $vararg_buffer3 = sp + 16|0;
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $3 = $0;
 $4 = $1;
 $5 = $2;
 $6 = 0; //@line 281 "./board.c"
 $7 = 0; //@line 282 "./board.c"
 while(1) {
  $10 = $7; //@line 282 "./board.c"
  $11 = ($10|0)<(8); //@line 282 "./board.c"
  if (!($11)) {
   break;
  }
  $8 = 0; //@line 283 "./board.c"
  while(1) {
   $12 = $8; //@line 283 "./board.c"
   $13 = ($12|0)<(8); //@line 283 "./board.c"
   if (!($13)) {
    break;
   }
   $14 = $3; //@line 284 "./board.c"
   $15 = HEAP32[$14>>2]|0; //@line 284 "./board.c"
   $16 = $7; //@line 284 "./board.c"
   $17 = (($15) + ($16<<2)|0); //@line 284 "./board.c"
   $18 = HEAP32[$17>>2]|0; //@line 284 "./board.c"
   $19 = $8; //@line 284 "./board.c"
   $20 = (($18) + ($19)|0); //@line 284 "./board.c"
   $21 = HEAP8[$20>>0]|0; //@line 284 "./board.c"
   $22 = $21&1; //@line 284 "./board.c"
   $23 = $22&1; //@line 284 "./board.c"
   $24 = ($23|0)==(0); //@line 284 "./board.c"
   do {
    if ($24) {
     $25 = $4; //@line 285 "./board.c"
     $26 = ($25|0)!=(0|0); //@line 285 "./board.c"
     if ($26) {
      $27 = $4; //@line 286 "./board.c"
      $28 = $7; //@line 286 "./board.c"
      $29 = (($27) + ($28<<2)|0); //@line 286 "./board.c"
      $30 = HEAP32[$29>>2]|0; //@line 286 "./board.c"
      $31 = $8; //@line 286 "./board.c"
      $32 = (($30) + ($31)|0); //@line 286 "./board.c"
      $33 = HEAP8[$32>>0]|0; //@line 286 "./board.c"
      $34 = $33&1; //@line 286 "./board.c"
      $35 = $34&1; //@line 286 "./board.c"
      $36 = ($35|0)==(1); //@line 286 "./board.c"
      if ($36) {
       $37 = $5; //@line 287 "./board.c"
       $38 = $6; //@line 287 "./board.c"
       $39 = (($37) + ($38)|0); //@line 287 "./board.c"
       (_sprintf($39,568,$vararg_buffer)|0); //@line 287 "./board.c"
       break;
      }
     }
     $40 = $5; //@line 289 "./board.c"
     $41 = $6; //@line 289 "./board.c"
     $42 = (($40) + ($41)|0); //@line 289 "./board.c"
     (_sprintf($42,571,$vararg_buffer1)|0); //@line 289 "./board.c"
    } else {
     $43 = $3; //@line 292 "./board.c"
     $44 = ((($43)) + 4|0); //@line 292 "./board.c"
     $45 = HEAP32[$44>>2]|0; //@line 292 "./board.c"
     $46 = $7; //@line 292 "./board.c"
     $47 = (($45) + ($46<<2)|0); //@line 292 "./board.c"
     $48 = HEAP32[$47>>2]|0; //@line 292 "./board.c"
     $49 = $8; //@line 292 "./board.c"
     $50 = (($48) + ($49<<3)|0); //@line 292 "./board.c"
     $51 = +HEAPF64[$50>>3]; //@line 292 "./board.c"
     $52 = $51 * 100.0; //@line 292 "./board.c"
     $53 = $52 + 0.5; //@line 292 "./board.c"
     $54 = (~~(($53))); //@line 292 "./board.c"
     $9 = $54; //@line 292 "./board.c"
     $55 = $9; //@line 293 "./board.c"
     $56 = ($55|0)>(99); //@line 293 "./board.c"
     $$ = $56 ? 99 : $54; //@line 293 "./board.c"
     $9 = $$;
     $57 = $9; //@line 294 "./board.c"
     $58 = ($57|0)<(0); //@line 294 "./board.c"
     $$$ = $58 ? 0 : $$; //@line 294 "./board.c"
     $9 = $$$;
     $59 = $5; //@line 295 "./board.c"
     $60 = $6; //@line 295 "./board.c"
     $61 = (($59) + ($60)|0); //@line 295 "./board.c"
     $62 = $9; //@line 295 "./board.c"
     HEAP32[$vararg_buffer3>>2] = $62; //@line 295 "./board.c"
     (_sprintf($61,574,$vararg_buffer3)|0); //@line 295 "./board.c"
    }
   } while(0);
   $63 = $6; //@line 297 "./board.c"
   $64 = (($63) + 2)|0; //@line 297 "./board.c"
   $6 = $64; //@line 297 "./board.c"
   $65 = $8; //@line 283 "./board.c"
   $66 = (($65) + 1)|0; //@line 283 "./board.c"
   $8 = $66; //@line 283 "./board.c"
  }
  $67 = $7; //@line 282 "./board.c"
  $68 = (($67) + 1)|0; //@line 282 "./board.c"
  $7 = $68; //@line 282 "./board.c"
 }
 STACKTOP = sp;return; //@line 300 "./board.c"
}
function _game_create($0) {
 $0 = +$0;
 var $1 = 0.0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0.0, $2 = 0, $20 = 0, $21 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $4 = (_malloc(18512)|0); //@line 20 "./game.c"
 $2 = $4; //@line 20 "./game.c"
 $5 = (_malloc(32)|0); //@line 21 "./game.c"
 $6 = $2; //@line 21 "./game.c"
 $7 = ((($6)) + 14404|0); //@line 21 "./game.c"
 HEAP32[$7>>2] = $5; //@line 21 "./game.c"
 $3 = 0; //@line 22 "./game.c"
 while(1) {
  $8 = $3; //@line 22 "./game.c"
  $9 = ($8|0)<(8); //@line 22 "./game.c"
  if (!($9)) {
   break;
  }
  $10 = (_malloc(8)|0); //@line 23 "./game.c"
  $11 = $2; //@line 23 "./game.c"
  $12 = ((($11)) + 14404|0); //@line 23 "./game.c"
  $13 = HEAP32[$12>>2]|0; //@line 23 "./game.c"
  $14 = $3; //@line 23 "./game.c"
  $15 = (($13) + ($14<<2)|0); //@line 23 "./game.c"
  HEAP32[$15>>2] = $10; //@line 23 "./game.c"
  $16 = $3; //@line 22 "./game.c"
  $17 = (($16) + 1)|0; //@line 22 "./game.c"
  $3 = $17; //@line 22 "./game.c"
 }
 $18 = $2; //@line 25 "./game.c"
 $19 = $1; //@line 25 "./game.c"
 _game_set_prob($18,$19); //@line 25 "./game.c"
 $20 = $2; //@line 26 "./game.c"
 _game_new($20); //@line 26 "./game.c"
 $21 = $2; //@line 27 "./game.c"
 STACKTOP = sp;return ($21|0); //@line 27 "./game.c"
}
function _game_set_prob($0,$1) {
 $0 = $0|0;
 $1 = +$1;
 var $2 = 0, $3 = 0.0, $4 = 0.0, $5 = 0, $6 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0;
 $3 = $1;
 $4 = $3; //@line 38 "./game.c"
 $5 = $2; //@line 38 "./game.c"
 $6 = ((($5)) + 18504|0); //@line 38 "./game.c"
 HEAPF64[$6>>3] = $4; //@line 38 "./game.c"
 STACKTOP = sp;return; //@line 39 "./game.c"
}
function _game_new($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0.0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1; //@line 89 "./game.c"
 $3 = ((($2)) + 18016|0); //@line 89 "./game.c"
 HEAP32[$3>>2] = 0; //@line 89 "./game.c"
 $4 = $1; //@line 90 "./game.c"
 $5 = ((($4)) + 18020|0); //@line 90 "./game.c"
 HEAP32[$5>>2] = -1; //@line 90 "./game.c"
 $6 = $1; //@line 91 "./game.c"
 $7 = ((($6)) + 18260|0); //@line 91 "./game.c"
 HEAP32[$7>>2] = -1; //@line 91 "./game.c"
 $8 = $1; //@line 92 "./game.c"
 $9 = ((($8)) + 18504|0); //@line 92 "./game.c"
 $10 = +HEAPF64[$9>>3]; //@line 92 "./game.c"
 $11 = (_board_create($10)|0); //@line 92 "./game.c"
 $12 = $1; //@line 92 "./game.c"
 HEAP32[$12>>2] = $11; //@line 92 "./game.c"
 $13 = $1; //@line 93 "./game.c"
 $14 = ((($13)) + 14408|0); //@line 93 "./game.c"
 HEAP8[$14>>0] = 1; //@line 93 "./game.c"
 $15 = $1; //@line 94 "./game.c"
 _game_update_history($15); //@line 94 "./game.c"
 $16 = $1; //@line 95 "./game.c"
 _game_update_probtable($16); //@line 95 "./game.c"
 STACKTOP = sp;return; //@line 96 "./game.c"
}
function _game_update_probtable($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0.0, $22 = 0.0, $23 = 0.0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0.0, $61 = 0.0, $62 = 0.0, $63 = 0;
 var $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $9 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1; //@line 43 "./game.c"
 $3 = ((($2)) + 18012|0); //@line 43 "./game.c"
 $4 = HEAP32[$3>>2]|0; //@line 43 "./game.c"
 _bp_delete($4); //@line 43 "./game.c"
 $5 = $1; //@line 44 "./game.c"
 $6 = HEAP32[$5>>2]|0; //@line 44 "./game.c"
 $7 = (_board_get_prob($6)|0); //@line 44 "./game.c"
 $8 = $1; //@line 44 "./game.c"
 $9 = ((($8)) + 18012|0); //@line 44 "./game.c"
 HEAP32[$9>>2] = $7; //@line 44 "./game.c"
 $10 = $1; //@line 45 "./game.c"
 $11 = HEAP32[$10>>2]|0; //@line 45 "./game.c"
 $12 = $1; //@line 45 "./game.c"
 $13 = ((($12)) + 18012|0); //@line 45 "./game.c"
 $14 = HEAP32[$13>>2]|0; //@line 45 "./game.c"
 $15 = $1; //@line 46 "./game.c"
 $16 = ((($15)) + 14408|0); //@line 46 "./game.c"
 $17 = HEAP8[$16>>0]|0; //@line 46 "./game.c"
 $18 = $17&1; //@line 46 "./game.c"
 $19 = $1;
 $20 = ((($19)) + 18504|0);
 $21 = +HEAPF64[$20>>3];
 $22 = 1.0 - $21; //@line 46 "./game.c"
 $23 = $18 ? $21 : $22; //@line 46 "./game.c"
 $24 = $1; //@line 46 "./game.c"
 $25 = ((($24)) + 14404|0); //@line 46 "./game.c"
 $26 = HEAP32[$25>>2]|0; //@line 46 "./game.c"
 _board_get_movable($11,$14,$23,$26); //@line 45 "./game.c"
 $27 = $1; //@line 48 "./game.c"
 $28 = ((($27)) + 14409|0); //@line 48 "./game.c"
 HEAP8[$28>>0] = 0; //@line 48 "./game.c"
 $29 = $1; //@line 49 "./game.c"
 $30 = (_game_can_move($29)|0); //@line 49 "./game.c"
 $31 = $30&1; //@line 49 "./game.c"
 $32 = ($31|0)==(0); //@line 49 "./game.c"
 if (!($32)) {
  STACKTOP = sp;return; //@line 61 "./game.c"
 }
 $33 = $1; //@line 50 "./game.c"
 $34 = ((($33)) + 14408|0); //@line 50 "./game.c"
 $35 = HEAP8[$34>>0]|0; //@line 50 "./game.c"
 $36 = $35&1; //@line 50 "./game.c"
 $37 = $36 ^ 1; //@line 50 "./game.c"
 $38 = $1; //@line 50 "./game.c"
 $39 = ((($38)) + 14408|0); //@line 50 "./game.c"
 $40 = $37&1; //@line 50 "./game.c"
 HEAP8[$39>>0] = $40; //@line 50 "./game.c"
 $41 = $1; //@line 51 "./game.c"
 $42 = HEAP32[$41>>2]|0; //@line 51 "./game.c"
 $43 = (_board_get_prob($42)|0); //@line 51 "./game.c"
 $44 = $1; //@line 51 "./game.c"
 $45 = ((($44)) + 18012|0); //@line 51 "./game.c"
 HEAP32[$45>>2] = $43; //@line 51 "./game.c"
 $46 = $1; //@line 52 "./game.c"
 $47 = ((($46)) + 18012|0); //@line 52 "./game.c"
 $48 = HEAP32[$47>>2]|0; //@line 52 "./game.c"
 _bp_delete($48); //@line 52 "./game.c"
 $49 = $1; //@line 53 "./game.c"
 $50 = HEAP32[$49>>2]|0; //@line 53 "./game.c"
 $51 = $1; //@line 53 "./game.c"
 $52 = ((($51)) + 18012|0); //@line 53 "./game.c"
 $53 = HEAP32[$52>>2]|0; //@line 53 "./game.c"
 $54 = $1; //@line 54 "./game.c"
 $55 = ((($54)) + 14408|0); //@line 54 "./game.c"
 $56 = HEAP8[$55>>0]|0; //@line 54 "./game.c"
 $57 = $56&1; //@line 54 "./game.c"
 $58 = $1;
 $59 = ((($58)) + 18504|0);
 $60 = +HEAPF64[$59>>3];
 $61 = 1.0 - $60; //@line 54 "./game.c"
 $62 = $57 ? $60 : $61; //@line 54 "./game.c"
 $63 = $1; //@line 55 "./game.c"
 $64 = ((($63)) + 14404|0); //@line 55 "./game.c"
 $65 = HEAP32[$64>>2]|0; //@line 55 "./game.c"
 _board_get_movable($50,$53,$62,$65); //@line 53 "./game.c"
 $66 = $1; //@line 56 "./game.c"
 $67 = (_game_can_move($66)|0); //@line 56 "./game.c"
 $68 = $67&1; //@line 56 "./game.c"
 $69 = ($68|0)==(0); //@line 56 "./game.c"
 if (!($69)) {
  STACKTOP = sp;return; //@line 61 "./game.c"
 }
 $70 = $1; //@line 57 "./game.c"
 $71 = ((($70)) + 14408|0); //@line 57 "./game.c"
 $72 = HEAP8[$71>>0]|0; //@line 57 "./game.c"
 $73 = $72&1; //@line 57 "./game.c"
 $74 = $73 ^ 1; //@line 57 "./game.c"
 $75 = $1; //@line 57 "./game.c"
 $76 = ((($75)) + 14408|0); //@line 57 "./game.c"
 $77 = $74&1; //@line 57 "./game.c"
 HEAP8[$76>>0] = $77; //@line 57 "./game.c"
 $78 = $1; //@line 58 "./game.c"
 $79 = ((($78)) + 14409|0); //@line 58 "./game.c"
 HEAP8[$79>>0] = 1; //@line 58 "./game.c"
 STACKTOP = sp;return; //@line 61 "./game.c"
}
function _game_can_move($0) {
 $0 = $0|0;
 var $$expand_i1_val = 0, $$expand_i1_val2 = 0, $$pre_trunc = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = sp + 12|0;
 $2 = $0;
 $3 = 0; //@line 106 "./game.c"
 L1: while(1) {
  $5 = $3; //@line 106 "./game.c"
  $6 = ($5|0)<(8); //@line 106 "./game.c"
  if (!($6)) {
   label = 9;
   break;
  }
  $4 = 0; //@line 107 "./game.c"
  while(1) {
   $7 = $4; //@line 107 "./game.c"
   $8 = ($7|0)<(8); //@line 107 "./game.c"
   if (!($8)) {
    break;
   }
   $9 = $2; //@line 108 "./game.c"
   $10 = ((($9)) + 14404|0); //@line 108 "./game.c"
   $11 = HEAP32[$10>>2]|0; //@line 108 "./game.c"
   $12 = $3; //@line 108 "./game.c"
   $13 = (($11) + ($12<<2)|0); //@line 108 "./game.c"
   $14 = HEAP32[$13>>2]|0; //@line 108 "./game.c"
   $15 = $4; //@line 108 "./game.c"
   $16 = (($14) + ($15)|0); //@line 108 "./game.c"
   $17 = HEAP8[$16>>0]|0; //@line 108 "./game.c"
   $18 = $17&1; //@line 108 "./game.c"
   $19 = $18&1; //@line 108 "./game.c"
   $20 = ($19|0)==(1); //@line 108 "./game.c"
   if ($20) {
    label = 6;
    break L1;
   }
   $21 = $4; //@line 107 "./game.c"
   $22 = (($21) + 1)|0; //@line 107 "./game.c"
   $4 = $22; //@line 107 "./game.c"
  }
  $23 = $3; //@line 106 "./game.c"
  $24 = (($23) + 1)|0; //@line 106 "./game.c"
  $3 = $24; //@line 106 "./game.c"
 }
 if ((label|0) == 6) {
  $$expand_i1_val = 1; //@line 109 "./game.c"
  HEAP8[$1>>0] = $$expand_i1_val; //@line 109 "./game.c"
  $$pre_trunc = HEAP8[$1>>0]|0; //@line 114 "./game.c"
  $25 = $$pre_trunc&1; //@line 114 "./game.c"
  STACKTOP = sp;return ($25|0); //@line 114 "./game.c"
 }
 else if ((label|0) == 9) {
  $$expand_i1_val2 = 0; //@line 113 "./game.c"
  HEAP8[$1>>0] = $$expand_i1_val2; //@line 113 "./game.c"
  $$pre_trunc = HEAP8[$1>>0]|0; //@line 114 "./game.c"
  $25 = $$pre_trunc&1; //@line 114 "./game.c"
  STACKTOP = sp;return ($25|0); //@line 114 "./game.c"
 }
 return (0)|0;
}
function _game_update_history($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0;
 var $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0;
 var $82 = 0, $83 = 0, $84 = 0, $85 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $3 = $1; //@line 65 "./game.c"
 $4 = ((($3)) + 18020|0); //@line 65 "./game.c"
 $5 = $1; //@line 65 "./game.c"
 $6 = ((($5)) + 18016|0); //@line 65 "./game.c"
 $7 = HEAP32[$6>>2]|0; //@line 65 "./game.c"
 $8 = (($4) + ($7<<2)|0); //@line 65 "./game.c"
 $9 = HEAP32[$8>>2]|0; //@line 65 "./game.c"
 $10 = (($9) + 1)|0; //@line 65 "./game.c"
 $2 = $10; //@line 65 "./game.c"
 while(1) {
  $11 = $2; //@line 66 "./game.c"
  $12 = $1; //@line 66 "./game.c"
  $13 = ((($12)) + 18260|0); //@line 66 "./game.c"
  $14 = $1; //@line 66 "./game.c"
  $15 = ((($14)) + 18016|0); //@line 66 "./game.c"
  $16 = HEAP32[$15>>2]|0; //@line 66 "./game.c"
  $17 = (($13) + ($16<<2)|0); //@line 66 "./game.c"
  $18 = HEAP32[$17>>2]|0; //@line 66 "./game.c"
  $19 = ($11|0)<=($18|0); //@line 66 "./game.c"
  $20 = $1;
  if (!($19)) {
   break;
  }
  $21 = ((($20)) + 4|0); //@line 67 "./game.c"
  $22 = $1; //@line 67 "./game.c"
  $23 = ((($22)) + 18016|0); //@line 67 "./game.c"
  $24 = HEAP32[$23>>2]|0; //@line 67 "./game.c"
  $25 = (($21) + (($24*240)|0)|0); //@line 67 "./game.c"
  $26 = $2; //@line 67 "./game.c"
  $27 = (($25) + ($26<<2)|0); //@line 67 "./game.c"
  $28 = HEAP32[$27>>2]|0; //@line 67 "./game.c"
  _board_delete($28); //@line 67 "./game.c"
  $29 = $2; //@line 66 "./game.c"
  $30 = (($29) + 1)|0; //@line 66 "./game.c"
  $2 = $30; //@line 66 "./game.c"
 }
 $31 = ((($20)) + 18020|0); //@line 70 "./game.c"
 $32 = $1; //@line 70 "./game.c"
 $33 = ((($32)) + 18016|0); //@line 70 "./game.c"
 $34 = HEAP32[$33>>2]|0; //@line 70 "./game.c"
 $35 = (($31) + ($34<<2)|0); //@line 70 "./game.c"
 $36 = HEAP32[$35>>2]|0; //@line 70 "./game.c"
 $37 = (($36) + 1)|0; //@line 70 "./game.c"
 HEAP32[$35>>2] = $37; //@line 70 "./game.c"
 $38 = $1; //@line 71 "./game.c"
 $39 = ((($38)) + 18020|0); //@line 71 "./game.c"
 $40 = $1; //@line 71 "./game.c"
 $41 = ((($40)) + 18016|0); //@line 71 "./game.c"
 $42 = HEAP32[$41>>2]|0; //@line 71 "./game.c"
 $43 = (($39) + ($42<<2)|0); //@line 71 "./game.c"
 $44 = HEAP32[$43>>2]|0; //@line 71 "./game.c"
 $45 = $1; //@line 71 "./game.c"
 $46 = ((($45)) + 18260|0); //@line 71 "./game.c"
 $47 = $1; //@line 71 "./game.c"
 $48 = ((($47)) + 18016|0); //@line 71 "./game.c"
 $49 = HEAP32[$48>>2]|0; //@line 71 "./game.c"
 $50 = (($46) + ($49<<2)|0); //@line 71 "./game.c"
 HEAP32[$50>>2] = $44; //@line 71 "./game.c"
 $51 = $1; //@line 73 "./game.c"
 $52 = HEAP32[$51>>2]|0; //@line 73 "./game.c"
 $53 = $1; //@line 72 "./game.c"
 $54 = ((($53)) + 4|0); //@line 72 "./game.c"
 $55 = $1; //@line 72 "./game.c"
 $56 = ((($55)) + 18016|0); //@line 72 "./game.c"
 $57 = HEAP32[$56>>2]|0; //@line 72 "./game.c"
 $58 = (($54) + (($57*240)|0)|0); //@line 72 "./game.c"
 $59 = $1; //@line 73 "./game.c"
 $60 = ((($59)) + 18020|0); //@line 73 "./game.c"
 $61 = $1; //@line 73 "./game.c"
 $62 = ((($61)) + 18016|0); //@line 73 "./game.c"
 $63 = HEAP32[$62>>2]|0; //@line 73 "./game.c"
 $64 = (($60) + ($63<<2)|0); //@line 73 "./game.c"
 $65 = HEAP32[$64>>2]|0; //@line 73 "./game.c"
 $66 = (($58) + ($65<<2)|0); //@line 72 "./game.c"
 HEAP32[$66>>2] = $52; //@line 73 "./game.c"
 $67 = $1; //@line 75 "./game.c"
 $68 = ((($67)) + 14408|0); //@line 75 "./game.c"
 $69 = HEAP8[$68>>0]|0; //@line 75 "./game.c"
 $70 = $69&1; //@line 75 "./game.c"
 $71 = $1; //@line 74 "./game.c"
 $72 = ((($71)) + 14410|0); //@line 74 "./game.c"
 $73 = $1; //@line 74 "./game.c"
 $74 = ((($73)) + 18016|0); //@line 74 "./game.c"
 $75 = HEAP32[$74>>2]|0; //@line 74 "./game.c"
 $76 = (($72) + (($75*60)|0)|0); //@line 74 "./game.c"
 $77 = $1; //@line 75 "./game.c"
 $78 = ((($77)) + 18020|0); //@line 75 "./game.c"
 $79 = $1; //@line 75 "./game.c"
 $80 = ((($79)) + 18016|0); //@line 75 "./game.c"
 $81 = HEAP32[$80>>2]|0; //@line 75 "./game.c"
 $82 = (($78) + ($81<<2)|0); //@line 75 "./game.c"
 $83 = HEAP32[$82>>2]|0; //@line 75 "./game.c"
 $84 = (($76) + ($83)|0); //@line 74 "./game.c"
 $85 = $70&1; //@line 75 "./game.c"
 HEAP8[$84>>0] = $85; //@line 75 "./game.c"
 STACKTOP = sp;return; //@line 76 "./game.c"
}
function _game_move($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$expand_i1_val = 0, $$expand_i1_val7 = 0, $$expand_i1_val9 = 0, $$pre_trunc = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0;
 var $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0.0, $38 = 0.0, $39 = 0.0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0;
 var $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond3 = 0, $or$cond5 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $3 = sp + 12|0;
 $4 = $0;
 $5 = $1;
 $6 = $2;
 $7 = $5; //@line 118 "./game.c"
 $8 = ($7|0)<(0); //@line 118 "./game.c"
 $9 = $5; //@line 118 "./game.c"
 $10 = ($9|0)>(7); //@line 118 "./game.c"
 $or$cond = $8 | $10; //@line 118 "./game.c"
 $11 = $6; //@line 118 "./game.c"
 $12 = ($11|0)<(0); //@line 118 "./game.c"
 $or$cond3 = $or$cond | $12; //@line 118 "./game.c"
 $13 = $6; //@line 118 "./game.c"
 $14 = ($13|0)>(7); //@line 118 "./game.c"
 $or$cond5 = $or$cond3 | $14; //@line 118 "./game.c"
 if ($or$cond5) {
  $$expand_i1_val = 0; //@line 118 "./game.c"
  HEAP8[$3>>0] = $$expand_i1_val; //@line 118 "./game.c"
  $$pre_trunc = HEAP8[$3>>0]|0; //@line 136 "./game.c"
  $55 = $$pre_trunc&1; //@line 136 "./game.c"
  STACKTOP = sp;return ($55|0); //@line 136 "./game.c"
 }
 $15 = $4; //@line 119 "./game.c"
 $16 = ((($15)) + 14404|0); //@line 119 "./game.c"
 $17 = HEAP32[$16>>2]|0; //@line 119 "./game.c"
 $18 = $5; //@line 119 "./game.c"
 $19 = (($17) + ($18<<2)|0); //@line 119 "./game.c"
 $20 = HEAP32[$19>>2]|0; //@line 119 "./game.c"
 $21 = $6; //@line 119 "./game.c"
 $22 = (($20) + ($21)|0); //@line 119 "./game.c"
 $23 = HEAP8[$22>>0]|0; //@line 119 "./game.c"
 $24 = $23&1; //@line 119 "./game.c"
 $25 = $24&1; //@line 119 "./game.c"
 $26 = ($25|0)==(0); //@line 119 "./game.c"
 if ($26) {
  $$expand_i1_val7 = 0; //@line 119 "./game.c"
  HEAP8[$3>>0] = $$expand_i1_val7; //@line 119 "./game.c"
  $$pre_trunc = HEAP8[$3>>0]|0; //@line 136 "./game.c"
  $55 = $$pre_trunc&1; //@line 136 "./game.c"
  STACKTOP = sp;return ($55|0); //@line 136 "./game.c"
 } else {
  $27 = $4; //@line 120 "./game.c"
  $28 = HEAP32[$27>>2]|0; //@line 120 "./game.c"
  $29 = $5; //@line 120 "./game.c"
  $30 = $6; //@line 120 "./game.c"
  $31 = $4; //@line 121 "./game.c"
  $32 = ((($31)) + 14408|0); //@line 121 "./game.c"
  $33 = HEAP8[$32>>0]|0; //@line 121 "./game.c"
  $34 = $33&1; //@line 121 "./game.c"
  $35 = $4;
  $36 = ((($35)) + 18504|0);
  $37 = +HEAPF64[$36>>3];
  $38 = 1.0 - $37; //@line 121 "./game.c"
  $39 = $34 ? $37 : $38; //@line 121 "./game.c"
  $40 = $4; //@line 121 "./game.c"
  $41 = ((($40)) + 18012|0); //@line 121 "./game.c"
  $42 = HEAP32[$41>>2]|0; //@line 121 "./game.c"
  $43 = (_board_move($28,$29,$30,$39,$42)|0); //@line 120 "./game.c"
  $44 = $4; //@line 120 "./game.c"
  HEAP32[$44>>2] = $43; //@line 120 "./game.c"
  $45 = $4; //@line 122 "./game.c"
  $46 = ((($45)) + 14408|0); //@line 122 "./game.c"
  $47 = HEAP8[$46>>0]|0; //@line 122 "./game.c"
  $48 = $47&1; //@line 122 "./game.c"
  $49 = $48 ^ 1; //@line 122 "./game.c"
  $50 = $4; //@line 122 "./game.c"
  $51 = ((($50)) + 14408|0); //@line 122 "./game.c"
  $52 = $49&1; //@line 122 "./game.c"
  HEAP8[$51>>0] = $52; //@line 122 "./game.c"
  $53 = $4; //@line 124 "./game.c"
  _game_update_probtable($53); //@line 124 "./game.c"
  $54 = $4; //@line 134 "./game.c"
  _game_update_history($54); //@line 134 "./game.c"
  $$expand_i1_val9 = 1; //@line 135 "./game.c"
  HEAP8[$3>>0] = $$expand_i1_val9; //@line 135 "./game.c"
  $$pre_trunc = HEAP8[$3>>0]|0; //@line 136 "./game.c"
  $55 = $$pre_trunc&1; //@line 136 "./game.c"
  STACKTOP = sp;return ($55|0); //@line 136 "./game.c"
 }
 return (0)|0;
}
function _game_can_undo($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1; //@line 140 "./game.c"
 $3 = ((($2)) + 18020|0); //@line 140 "./game.c"
 $4 = $1; //@line 140 "./game.c"
 $5 = ((($4)) + 18016|0); //@line 140 "./game.c"
 $6 = HEAP32[$5>>2]|0; //@line 140 "./game.c"
 $7 = (($3) + ($6<<2)|0); //@line 140 "./game.c"
 $8 = HEAP32[$7>>2]|0; //@line 140 "./game.c"
 $9 = ($8|0)!=(0); //@line 140 "./game.c"
 STACKTOP = sp;return ($9|0); //@line 140 "./game.c"
}
function _game_undo($0) {
 $0 = $0|0;
 var $$expand_i1_val = 0, $$expand_i1_val2 = 0, $$pre_trunc = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = sp + 4|0;
 $2 = $0;
 $3 = $2; //@line 145 "./game.c"
 $4 = ((($3)) + 18020|0); //@line 145 "./game.c"
 $5 = $2; //@line 145 "./game.c"
 $6 = ((($5)) + 18016|0); //@line 145 "./game.c"
 $7 = HEAP32[$6>>2]|0; //@line 145 "./game.c"
 $8 = (($4) + ($7<<2)|0); //@line 145 "./game.c"
 $9 = HEAP32[$8>>2]|0; //@line 145 "./game.c"
 $10 = ($9|0)==(0); //@line 145 "./game.c"
 if ($10) {
  $$expand_i1_val = 0; //@line 145 "./game.c"
  HEAP8[$1>>0] = $$expand_i1_val; //@line 145 "./game.c"
  $$pre_trunc = HEAP8[$1>>0]|0; //@line 153 "./game.c"
  $55 = $$pre_trunc&1; //@line 153 "./game.c"
  STACKTOP = sp;return ($55|0); //@line 153 "./game.c"
 } else {
  $11 = $2; //@line 146 "./game.c"
  $12 = ((($11)) + 18020|0); //@line 146 "./game.c"
  $13 = $2; //@line 146 "./game.c"
  $14 = ((($13)) + 18016|0); //@line 146 "./game.c"
  $15 = HEAP32[$14>>2]|0; //@line 146 "./game.c"
  $16 = (($12) + ($15<<2)|0); //@line 146 "./game.c"
  $17 = HEAP32[$16>>2]|0; //@line 146 "./game.c"
  $18 = (($17) - 1)|0; //@line 146 "./game.c"
  HEAP32[$16>>2] = $18; //@line 146 "./game.c"
  $19 = $2; //@line 147 "./game.c"
  $20 = ((($19)) + 4|0); //@line 147 "./game.c"
  $21 = $2; //@line 147 "./game.c"
  $22 = ((($21)) + 18016|0); //@line 147 "./game.c"
  $23 = HEAP32[$22>>2]|0; //@line 147 "./game.c"
  $24 = (($20) + (($23*240)|0)|0); //@line 147 "./game.c"
  $25 = $2; //@line 148 "./game.c"
  $26 = ((($25)) + 18020|0); //@line 148 "./game.c"
  $27 = $2; //@line 148 "./game.c"
  $28 = ((($27)) + 18016|0); //@line 148 "./game.c"
  $29 = HEAP32[$28>>2]|0; //@line 148 "./game.c"
  $30 = (($26) + ($29<<2)|0); //@line 148 "./game.c"
  $31 = HEAP32[$30>>2]|0; //@line 148 "./game.c"
  $32 = (($24) + ($31<<2)|0); //@line 147 "./game.c"
  $33 = HEAP32[$32>>2]|0; //@line 147 "./game.c"
  $34 = $2; //@line 147 "./game.c"
  HEAP32[$34>>2] = $33; //@line 147 "./game.c"
  $35 = $2; //@line 149 "./game.c"
  $36 = ((($35)) + 14410|0); //@line 149 "./game.c"
  $37 = $2; //@line 149 "./game.c"
  $38 = ((($37)) + 18016|0); //@line 149 "./game.c"
  $39 = HEAP32[$38>>2]|0; //@line 149 "./game.c"
  $40 = (($36) + (($39*60)|0)|0); //@line 149 "./game.c"
  $41 = $2; //@line 150 "./game.c"
  $42 = ((($41)) + 18020|0); //@line 150 "./game.c"
  $43 = $2; //@line 150 "./game.c"
  $44 = ((($43)) + 18016|0); //@line 150 "./game.c"
  $45 = HEAP32[$44>>2]|0; //@line 150 "./game.c"
  $46 = (($42) + ($45<<2)|0); //@line 150 "./game.c"
  $47 = HEAP32[$46>>2]|0; //@line 150 "./game.c"
  $48 = (($40) + ($47)|0); //@line 149 "./game.c"
  $49 = HEAP8[$48>>0]|0; //@line 149 "./game.c"
  $50 = $49&1; //@line 149 "./game.c"
  $51 = $2; //@line 149 "./game.c"
  $52 = ((($51)) + 14408|0); //@line 149 "./game.c"
  $53 = $50&1; //@line 149 "./game.c"
  HEAP8[$52>>0] = $53; //@line 149 "./game.c"
  $54 = $2; //@line 151 "./game.c"
  _game_update_probtable($54); //@line 151 "./game.c"
  $$expand_i1_val2 = 1; //@line 152 "./game.c"
  HEAP8[$1>>0] = $$expand_i1_val2; //@line 152 "./game.c"
  $$pre_trunc = HEAP8[$1>>0]|0; //@line 153 "./game.c"
  $55 = $$pre_trunc&1; //@line 153 "./game.c"
  STACKTOP = sp;return ($55|0); //@line 153 "./game.c"
 }
 return (0)|0;
}
function _game_can_redo($0) {
 $0 = $0|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = $1; //@line 157 "./game.c"
 $3 = ((($2)) + 18020|0); //@line 157 "./game.c"
 $4 = $1; //@line 157 "./game.c"
 $5 = ((($4)) + 18016|0); //@line 157 "./game.c"
 $6 = HEAP32[$5>>2]|0; //@line 157 "./game.c"
 $7 = (($3) + ($6<<2)|0); //@line 157 "./game.c"
 $8 = HEAP32[$7>>2]|0; //@line 157 "./game.c"
 $9 = $1; //@line 158 "./game.c"
 $10 = ((($9)) + 18260|0); //@line 158 "./game.c"
 $11 = $1; //@line 158 "./game.c"
 $12 = ((($11)) + 18016|0); //@line 158 "./game.c"
 $13 = HEAP32[$12>>2]|0; //@line 158 "./game.c"
 $14 = (($10) + ($13<<2)|0); //@line 158 "./game.c"
 $15 = HEAP32[$14>>2]|0; //@line 158 "./game.c"
 $16 = ($8|0)!=($15|0); //@line 158 "./game.c"
 STACKTOP = sp;return ($16|0); //@line 157 "./game.c"
}
function _game_redo($0) {
 $0 = $0|0;
 var $$expand_i1_val = 0, $$expand_i1_val2 = 0, $$pre_trunc = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0;
 var $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0;
 var $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0;
 var $61 = 0, $62 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = sp + 4|0;
 $2 = $0;
 $3 = $2; //@line 163 "./game.c"
 $4 = ((($3)) + 18020|0); //@line 163 "./game.c"
 $5 = $2; //@line 163 "./game.c"
 $6 = ((($5)) + 18016|0); //@line 163 "./game.c"
 $7 = HEAP32[$6>>2]|0; //@line 163 "./game.c"
 $8 = (($4) + ($7<<2)|0); //@line 163 "./game.c"
 $9 = HEAP32[$8>>2]|0; //@line 163 "./game.c"
 $10 = $2; //@line 164 "./game.c"
 $11 = ((($10)) + 18260|0); //@line 164 "./game.c"
 $12 = $2; //@line 164 "./game.c"
 $13 = ((($12)) + 18016|0); //@line 164 "./game.c"
 $14 = HEAP32[$13>>2]|0; //@line 164 "./game.c"
 $15 = (($11) + ($14<<2)|0); //@line 164 "./game.c"
 $16 = HEAP32[$15>>2]|0; //@line 164 "./game.c"
 $17 = ($9|0)==($16|0); //@line 164 "./game.c"
 if ($17) {
  $$expand_i1_val = 0; //@line 164 "./game.c"
  HEAP8[$1>>0] = $$expand_i1_val; //@line 164 "./game.c"
  $$pre_trunc = HEAP8[$1>>0]|0; //@line 172 "./game.c"
  $62 = $$pre_trunc&1; //@line 172 "./game.c"
  STACKTOP = sp;return ($62|0); //@line 172 "./game.c"
 } else {
  $18 = $2; //@line 165 "./game.c"
  $19 = ((($18)) + 18020|0); //@line 165 "./game.c"
  $20 = $2; //@line 165 "./game.c"
  $21 = ((($20)) + 18016|0); //@line 165 "./game.c"
  $22 = HEAP32[$21>>2]|0; //@line 165 "./game.c"
  $23 = (($19) + ($22<<2)|0); //@line 165 "./game.c"
  $24 = HEAP32[$23>>2]|0; //@line 165 "./game.c"
  $25 = (($24) + 1)|0; //@line 165 "./game.c"
  HEAP32[$23>>2] = $25; //@line 165 "./game.c"
  $26 = $2; //@line 166 "./game.c"
  $27 = ((($26)) + 4|0); //@line 166 "./game.c"
  $28 = $2; //@line 166 "./game.c"
  $29 = ((($28)) + 18016|0); //@line 166 "./game.c"
  $30 = HEAP32[$29>>2]|0; //@line 166 "./game.c"
  $31 = (($27) + (($30*240)|0)|0); //@line 166 "./game.c"
  $32 = $2; //@line 167 "./game.c"
  $33 = ((($32)) + 18020|0); //@line 167 "./game.c"
  $34 = $2; //@line 167 "./game.c"
  $35 = ((($34)) + 18016|0); //@line 167 "./game.c"
  $36 = HEAP32[$35>>2]|0; //@line 167 "./game.c"
  $37 = (($33) + ($36<<2)|0); //@line 167 "./game.c"
  $38 = HEAP32[$37>>2]|0; //@line 167 "./game.c"
  $39 = (($31) + ($38<<2)|0); //@line 166 "./game.c"
  $40 = HEAP32[$39>>2]|0; //@line 166 "./game.c"
  $41 = $2; //@line 166 "./game.c"
  HEAP32[$41>>2] = $40; //@line 166 "./game.c"
  $42 = $2; //@line 168 "./game.c"
  $43 = ((($42)) + 14410|0); //@line 168 "./game.c"
  $44 = $2; //@line 168 "./game.c"
  $45 = ((($44)) + 18016|0); //@line 168 "./game.c"
  $46 = HEAP32[$45>>2]|0; //@line 168 "./game.c"
  $47 = (($43) + (($46*60)|0)|0); //@line 168 "./game.c"
  $48 = $2; //@line 169 "./game.c"
  $49 = ((($48)) + 18020|0); //@line 169 "./game.c"
  $50 = $2; //@line 169 "./game.c"
  $51 = ((($50)) + 18016|0); //@line 169 "./game.c"
  $52 = HEAP32[$51>>2]|0; //@line 169 "./game.c"
  $53 = (($49) + ($52<<2)|0); //@line 169 "./game.c"
  $54 = HEAP32[$53>>2]|0; //@line 169 "./game.c"
  $55 = (($47) + ($54)|0); //@line 168 "./game.c"
  $56 = HEAP8[$55>>0]|0; //@line 168 "./game.c"
  $57 = $56&1; //@line 168 "./game.c"
  $58 = $2; //@line 168 "./game.c"
  $59 = ((($58)) + 14408|0); //@line 168 "./game.c"
  $60 = $57&1; //@line 168 "./game.c"
  HEAP8[$59>>0] = $60; //@line 168 "./game.c"
  $61 = $2; //@line 170 "./game.c"
  _game_update_probtable($61); //@line 170 "./game.c"
  $$expand_i1_val2 = 1; //@line 171 "./game.c"
  HEAP8[$1>>0] = $$expand_i1_val2; //@line 171 "./game.c"
  $$pre_trunc = HEAP8[$1>>0]|0; //@line 172 "./game.c"
  $62 = $$pre_trunc&1; //@line 172 "./game.c"
  STACKTOP = sp;return ($62|0); //@line 172 "./game.c"
 }
 return (0)|0;
}
function _game_can_branch($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 0; //@line 176 "./game.c"
}
function _game_branch($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 0; //@line 181 "./game.c"
}
function _game_can_trunk($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 0; //@line 186 "./game.c"
}
function _game_trunk($0) {
 $0 = $0|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 STACKTOP = sp;return 0; //@line 191 "./game.c"
}
function _game_str($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0.0, $27 = 0.0, $28 = 0.0;
 var $29 = 0.0, $3 = 0, $30 = 0.0, $31 = 0, $32 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $vararg_buffer = 0, $vararg_buffer1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $vararg_buffer1 = sp + 8|0;
 $vararg_buffer = sp;
 $2 = $0;
 $3 = $1;
 $4 = $2; //@line 196 "./game.c"
 $5 = HEAP32[$4>>2]|0; //@line 196 "./game.c"
 $6 = $2; //@line 196 "./game.c"
 $7 = ((($6)) + 14404|0); //@line 196 "./game.c"
 $8 = HEAP32[$7>>2]|0; //@line 196 "./game.c"
 $9 = $3; //@line 196 "./game.c"
 _board_get($5,$8,$9); //@line 196 "./game.c"
 $10 = $2; //@line 197 "./game.c"
 $11 = ((($10)) + 14409|0); //@line 197 "./game.c"
 $12 = HEAP8[$11>>0]|0; //@line 197 "./game.c"
 $13 = $12&1; //@line 197 "./game.c"
 $14 = $13&1; //@line 197 "./game.c"
 $15 = ($14|0)==(0); //@line 197 "./game.c"
 $16 = $3;
 if ($15) {
  $17 = ((($16)) + 128|0); //@line 198 "./game.c"
  HEAP8[$17>>0] = 112; //@line 198 "./game.c"
  $18 = $3; //@line 199 "./game.c"
  $19 = ((($18)) + 129|0); //@line 199 "./game.c"
  $20 = $2; //@line 199 "./game.c"
  $21 = ((($20)) + 14408|0); //@line 199 "./game.c"
  $22 = HEAP8[$21>>0]|0; //@line 199 "./game.c"
  $23 = $22&1; //@line 199 "./game.c"
  $24 = $2;
  $25 = ((($24)) + 18504|0);
  $26 = +HEAPF64[$25>>3];
  $27 = 1.0 - $26; //@line 200 "./game.c"
  $28 = $23 ? $26 : $27; //@line 199 "./game.c"
  $29 = $28 * 100.0; //@line 200 "./game.c"
  $30 = $29 + 0.5; //@line 200 "./game.c"
  $31 = (~~(($30))); //@line 199 "./game.c"
  HEAP32[$vararg_buffer>>2] = $31; //@line 199 "./game.c"
  (_sprintf($19,574,$vararg_buffer)|0); //@line 199 "./game.c"
  STACKTOP = sp;return; //@line 204 "./game.c"
 } else {
  $32 = ((($16)) + 129|0); //@line 202 "./game.c"
  (_sprintf($32,579,$vararg_buffer1)|0); //@line 202 "./game.c"
  STACKTOP = sp;return; //@line 204 "./game.c"
 }
}
function _ems_setup($0) {
 $0 = +$0;
 var $1 = 0, $2 = 0.0, $3 = 0.0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0;
 $3 = $2; //@line 10 "gui.c"
 $4 = (_game_create($3)|0); //@line 10 "gui.c"
 HEAP32[752] = $4; //@line 10 "gui.c"
 $5 = HEAP32[752]|0; //@line 11 "gui.c"
 $6 = ($5|0)==(0|0); //@line 11 "gui.c"
 if ($6) {
  $1 = 0; //@line 12 "gui.c"
 } else {
  $1 = 1; //@line 14 "gui.c"
 }
 $7 = $1; //@line 16 "gui.c"
 STACKTOP = sp;return ($7|0); //@line 16 "gui.c"
}
function _ems_move($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = $0;
 $3 = $1;
 $4 = HEAP32[752]|0; //@line 20 "gui.c"
 $5 = $3; //@line 20 "gui.c"
 $6 = $2; //@line 20 "gui.c"
 $7 = (_game_move($4,$5,$6)|0); //@line 20 "gui.c"
 $8 = $7 ? 1 : 0; //@line 20 "gui.c"
 STACKTOP = sp;return ($8|0); //@line 20 "gui.c"
}
function _ems_get_str($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = $0;
 $2 = HEAP32[752]|0; //@line 25 "gui.c"
 $3 = $1; //@line 25 "gui.c"
 _game_str($2,$3); //@line 25 "gui.c"
 STACKTOP = sp;return; //@line 26 "gui.c"
}
function _ems_can_undo() {
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[752]|0; //@line 30 "gui.c"
 $1 = (_game_can_undo($0)|0); //@line 30 "gui.c"
 $2 = $1 ? 1 : 0; //@line 30 "gui.c"
 return ($2|0); //@line 30 "gui.c"
}
function _ems_can_redo() {
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[752]|0; //@line 35 "gui.c"
 $1 = (_game_can_redo($0)|0); //@line 35 "gui.c"
 $2 = $1 ? 1 : 0; //@line 35 "gui.c"
 return ($2|0); //@line 35 "gui.c"
}
function _ems_can_branch() {
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[752]|0; //@line 40 "gui.c"
 $1 = (_game_can_branch($0)|0); //@line 40 "gui.c"
 $2 = $1 ? 1 : 0; //@line 40 "gui.c"
 return ($2|0); //@line 40 "gui.c"
}
function _ems_can_trunk() {
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[752]|0; //@line 45 "gui.c"
 $1 = (_game_can_trunk($0)|0); //@line 45 "gui.c"
 $2 = $1 ? 1 : 0; //@line 45 "gui.c"
 return ($2|0); //@line 45 "gui.c"
}
function _ems_undo() {
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[752]|0; //@line 50 "gui.c"
 $1 = (_game_undo($0)|0); //@line 50 "gui.c"
 $2 = $1 ? 1 : 0; //@line 50 "gui.c"
 return ($2|0); //@line 50 "gui.c"
}
function _ems_redo() {
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[752]|0; //@line 55 "gui.c"
 $1 = (_game_redo($0)|0); //@line 55 "gui.c"
 $2 = $1 ? 1 : 0; //@line 55 "gui.c"
 return ($2|0); //@line 55 "gui.c"
}
function _ems_branch() {
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[752]|0; //@line 60 "gui.c"
 $1 = (_game_branch($0)|0); //@line 60 "gui.c"
 $2 = $1 ? 1 : 0; //@line 60 "gui.c"
 return ($2|0); //@line 60 "gui.c"
}
function _ems_trunk() {
 var $0 = 0, $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = HEAP32[752]|0; //@line 65 "gui.c"
 $1 = (_game_trunk($0)|0); //@line 65 "gui.c"
 $2 = $1 ? 1 : 0; //@line 65 "gui.c"
 return ($2|0); //@line 65 "gui.c"
}
function _malloc($0) {
 $0 = $0|0;
 var $$$0192$i = 0, $$$0193$i = 0, $$$4236$i = 0, $$$4351$i = 0, $$$i = 0, $$0 = 0, $$0$i$i = 0, $$0$i$i$i = 0, $$0$i17$i = 0, $$0189$i = 0, $$0192$lcssa$i = 0, $$01926$i = 0, $$0193$lcssa$i = 0, $$01935$i = 0, $$0197 = 0, $$0199 = 0, $$0206$i$i = 0, $$0207$i$i = 0, $$0211$i$i = 0, $$0212$i$i = 0;
 var $$024367$i = 0, $$0287$i$i = 0, $$0288$i$i = 0, $$0289$i$i = 0, $$0295$i$i = 0, $$0296$i$i = 0, $$0342$i = 0, $$0344$i = 0, $$0345$i = 0, $$0347$i = 0, $$0353$i = 0, $$0358$i = 0, $$0359$$i = 0, $$0359$i = 0, $$0361$i = 0, $$0362$i = 0, $$0368$i = 0, $$1196$i = 0, $$1198$i = 0, $$124466$i = 0;
 var $$1291$i$i = 0, $$1293$i$i = 0, $$1343$i = 0, $$1348$i = 0, $$1363$i = 0, $$1370$i = 0, $$1374$i = 0, $$2234243136$i = 0, $$2247$ph$i = 0, $$2253$ph$i = 0, $$2355$i = 0, $$3$i = 0, $$3$i$i = 0, $$3$i203 = 0, $$3350$i = 0, $$3372$i = 0, $$4$lcssa$i = 0, $$4$ph$i = 0, $$414$i = 0, $$4236$i = 0;
 var $$4351$lcssa$i = 0, $$435113$i = 0, $$4357$$4$i = 0, $$4357$ph$i = 0, $$435712$i = 0, $$723947$i = 0, $$748$i = 0, $$pre = 0, $$pre$i = 0, $$pre$i$i = 0, $$pre$i18$i = 0, $$pre$i210 = 0, $$pre$i212 = 0, $$pre$phi$i$iZ2D = 0, $$pre$phi$i19$iZ2D = 0, $$pre$phi$i211Z2D = 0, $$pre$phi$iZ2D = 0, $$pre$phi11$i$iZ2D = 0, $$pre$phiZ2D = 0, $$pre10$i$i = 0;
 var $$sink1$i = 0, $$sink1$i$i = 0, $$sink14$i = 0, $$sink2$i = 0, $$sink2$i205 = 0, $$sink3$i = 0, $1 = 0, $10 = 0, $100 = 0, $1000 = 0, $1001 = 0, $1002 = 0, $1003 = 0, $1004 = 0, $1005 = 0, $1006 = 0, $1007 = 0, $1008 = 0, $1009 = 0, $101 = 0;
 var $1010 = 0, $1011 = 0, $1012 = 0, $1013 = 0, $1014 = 0, $1015 = 0, $1016 = 0, $1017 = 0, $1018 = 0, $1019 = 0, $102 = 0, $1020 = 0, $1021 = 0, $1022 = 0, $1023 = 0, $1024 = 0, $1025 = 0, $1026 = 0, $1027 = 0, $1028 = 0;
 var $1029 = 0, $103 = 0, $1030 = 0, $1031 = 0, $1032 = 0, $1033 = 0, $1034 = 0, $1035 = 0, $1036 = 0, $1037 = 0, $1038 = 0, $1039 = 0, $104 = 0, $1040 = 0, $1041 = 0, $1042 = 0, $1043 = 0, $1044 = 0, $1045 = 0, $1046 = 0;
 var $1047 = 0, $1048 = 0, $1049 = 0, $105 = 0, $1050 = 0, $1051 = 0, $1052 = 0, $1053 = 0, $1054 = 0, $1055 = 0, $1056 = 0, $1057 = 0, $1058 = 0, $1059 = 0, $106 = 0, $1060 = 0, $1061 = 0, $1062 = 0, $107 = 0, $108 = 0;
 var $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0;
 var $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0;
 var $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0;
 var $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0;
 var $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0;
 var $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0;
 var $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0;
 var $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0;
 var $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0;
 var $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0;
 var $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0;
 var $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0;
 var $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0;
 var $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0;
 var $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0, $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0;
 var $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0, $389 = 0, $39 = 0, $390 = 0, $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0;
 var $398 = 0, $399 = 0, $4 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0, $405 = 0, $406 = 0, $407 = 0, $408 = 0, $409 = 0, $41 = 0, $410 = 0, $411 = 0, $412 = 0, $413 = 0, $414 = 0;
 var $415 = 0, $416 = 0, $417 = 0, $418 = 0, $419 = 0, $42 = 0, $420 = 0, $421 = 0, $422 = 0, $423 = 0, $424 = 0, $425 = 0, $426 = 0, $427 = 0, $428 = 0, $429 = 0, $43 = 0, $430 = 0, $431 = 0, $432 = 0;
 var $433 = 0, $434 = 0, $435 = 0, $436 = 0, $437 = 0, $438 = 0, $439 = 0, $44 = 0, $440 = 0, $441 = 0, $442 = 0, $443 = 0, $444 = 0, $445 = 0, $446 = 0, $447 = 0, $448 = 0, $449 = 0, $45 = 0, $450 = 0;
 var $451 = 0, $452 = 0, $453 = 0, $454 = 0, $455 = 0, $456 = 0, $457 = 0, $458 = 0, $459 = 0, $46 = 0, $460 = 0, $461 = 0, $462 = 0, $463 = 0, $464 = 0, $465 = 0, $466 = 0, $467 = 0, $468 = 0, $469 = 0;
 var $47 = 0, $470 = 0, $471 = 0, $472 = 0, $473 = 0, $474 = 0, $475 = 0, $476 = 0, $477 = 0, $478 = 0, $479 = 0, $48 = 0, $480 = 0, $481 = 0, $482 = 0, $483 = 0, $484 = 0, $485 = 0, $486 = 0, $487 = 0;
 var $488 = 0, $489 = 0, $49 = 0, $490 = 0, $491 = 0, $492 = 0, $493 = 0, $494 = 0, $495 = 0, $496 = 0, $497 = 0, $498 = 0, $499 = 0, $5 = 0, $50 = 0, $500 = 0, $501 = 0, $502 = 0, $503 = 0, $504 = 0;
 var $505 = 0, $506 = 0, $507 = 0, $508 = 0, $509 = 0, $51 = 0, $510 = 0, $511 = 0, $512 = 0, $513 = 0, $514 = 0, $515 = 0, $516 = 0, $517 = 0, $518 = 0, $519 = 0, $52 = 0, $520 = 0, $521 = 0, $522 = 0;
 var $523 = 0, $524 = 0, $525 = 0, $526 = 0, $527 = 0, $528 = 0, $529 = 0, $53 = 0, $530 = 0, $531 = 0, $532 = 0, $533 = 0, $534 = 0, $535 = 0, $536 = 0, $537 = 0, $538 = 0, $539 = 0, $54 = 0, $540 = 0;
 var $541 = 0, $542 = 0, $543 = 0, $544 = 0, $545 = 0, $546 = 0, $547 = 0, $548 = 0, $549 = 0, $55 = 0, $550 = 0, $551 = 0, $552 = 0, $553 = 0, $554 = 0, $555 = 0, $556 = 0, $557 = 0, $558 = 0, $559 = 0;
 var $56 = 0, $560 = 0, $561 = 0, $562 = 0, $563 = 0, $564 = 0, $565 = 0, $566 = 0, $567 = 0, $568 = 0, $569 = 0, $57 = 0, $570 = 0, $571 = 0, $572 = 0, $573 = 0, $574 = 0, $575 = 0, $576 = 0, $577 = 0;
 var $578 = 0, $579 = 0, $58 = 0, $580 = 0, $581 = 0, $582 = 0, $583 = 0, $584 = 0, $585 = 0, $586 = 0, $587 = 0, $588 = 0, $589 = 0, $59 = 0, $590 = 0, $591 = 0, $592 = 0, $593 = 0, $594 = 0, $595 = 0;
 var $596 = 0, $597 = 0, $598 = 0, $599 = 0, $6 = 0, $60 = 0, $600 = 0, $601 = 0, $602 = 0, $603 = 0, $604 = 0, $605 = 0, $606 = 0, $607 = 0, $608 = 0, $609 = 0, $61 = 0, $610 = 0, $611 = 0, $612 = 0;
 var $613 = 0, $614 = 0, $615 = 0, $616 = 0, $617 = 0, $618 = 0, $619 = 0, $62 = 0, $620 = 0, $621 = 0, $622 = 0, $623 = 0, $624 = 0, $625 = 0, $626 = 0, $627 = 0, $628 = 0, $629 = 0, $63 = 0, $630 = 0;
 var $631 = 0, $632 = 0, $633 = 0, $634 = 0, $635 = 0, $636 = 0, $637 = 0, $638 = 0, $639 = 0, $64 = 0, $640 = 0, $641 = 0, $642 = 0, $643 = 0, $644 = 0, $645 = 0, $646 = 0, $647 = 0, $648 = 0, $649 = 0;
 var $65 = 0, $650 = 0, $651 = 0, $652 = 0, $653 = 0, $654 = 0, $655 = 0, $656 = 0, $657 = 0, $658 = 0, $659 = 0, $66 = 0, $660 = 0, $661 = 0, $662 = 0, $663 = 0, $664 = 0, $665 = 0, $666 = 0, $667 = 0;
 var $668 = 0, $669 = 0, $67 = 0, $670 = 0, $671 = 0, $672 = 0, $673 = 0, $674 = 0, $675 = 0, $676 = 0, $677 = 0, $678 = 0, $679 = 0, $68 = 0, $680 = 0, $681 = 0, $682 = 0, $683 = 0, $684 = 0, $685 = 0;
 var $686 = 0, $687 = 0, $688 = 0, $689 = 0, $69 = 0, $690 = 0, $691 = 0, $692 = 0, $693 = 0, $694 = 0, $695 = 0, $696 = 0, $697 = 0, $698 = 0, $699 = 0, $7 = 0, $70 = 0, $700 = 0, $701 = 0, $702 = 0;
 var $703 = 0, $704 = 0, $705 = 0, $706 = 0, $707 = 0, $708 = 0, $709 = 0, $71 = 0, $710 = 0, $711 = 0, $712 = 0, $713 = 0, $714 = 0, $715 = 0, $716 = 0, $717 = 0, $718 = 0, $719 = 0, $72 = 0, $720 = 0;
 var $721 = 0, $722 = 0, $723 = 0, $724 = 0, $725 = 0, $726 = 0, $727 = 0, $728 = 0, $729 = 0, $73 = 0, $730 = 0, $731 = 0, $732 = 0, $733 = 0, $734 = 0, $735 = 0, $736 = 0, $737 = 0, $738 = 0, $739 = 0;
 var $74 = 0, $740 = 0, $741 = 0, $742 = 0, $743 = 0, $744 = 0, $745 = 0, $746 = 0, $747 = 0, $748 = 0, $749 = 0, $75 = 0, $750 = 0, $751 = 0, $752 = 0, $753 = 0, $754 = 0, $755 = 0, $756 = 0, $757 = 0;
 var $758 = 0, $759 = 0, $76 = 0, $760 = 0, $761 = 0, $762 = 0, $763 = 0, $764 = 0, $765 = 0, $766 = 0, $767 = 0, $768 = 0, $769 = 0, $77 = 0, $770 = 0, $771 = 0, $772 = 0, $773 = 0, $774 = 0, $775 = 0;
 var $776 = 0, $777 = 0, $778 = 0, $779 = 0, $78 = 0, $780 = 0, $781 = 0, $782 = 0, $783 = 0, $784 = 0, $785 = 0, $786 = 0, $787 = 0, $788 = 0, $789 = 0, $79 = 0, $790 = 0, $791 = 0, $792 = 0, $793 = 0;
 var $794 = 0, $795 = 0, $796 = 0, $797 = 0, $798 = 0, $799 = 0, $8 = 0, $80 = 0, $800 = 0, $801 = 0, $802 = 0, $803 = 0, $804 = 0, $805 = 0, $806 = 0, $807 = 0, $808 = 0, $809 = 0, $81 = 0, $810 = 0;
 var $811 = 0, $812 = 0, $813 = 0, $814 = 0, $815 = 0, $816 = 0, $817 = 0, $818 = 0, $819 = 0, $82 = 0, $820 = 0, $821 = 0, $822 = 0, $823 = 0, $824 = 0, $825 = 0, $826 = 0, $827 = 0, $828 = 0, $829 = 0;
 var $83 = 0, $830 = 0, $831 = 0, $832 = 0, $833 = 0, $834 = 0, $835 = 0, $836 = 0, $837 = 0, $838 = 0, $839 = 0, $84 = 0, $840 = 0, $841 = 0, $842 = 0, $843 = 0, $844 = 0, $845 = 0, $846 = 0, $847 = 0;
 var $848 = 0, $849 = 0, $85 = 0, $850 = 0, $851 = 0, $852 = 0, $853 = 0, $854 = 0, $855 = 0, $856 = 0, $857 = 0, $858 = 0, $859 = 0, $86 = 0, $860 = 0, $861 = 0, $862 = 0, $863 = 0, $864 = 0, $865 = 0;
 var $866 = 0, $867 = 0, $868 = 0, $869 = 0, $87 = 0, $870 = 0, $871 = 0, $872 = 0, $873 = 0, $874 = 0, $875 = 0, $876 = 0, $877 = 0, $878 = 0, $879 = 0, $88 = 0, $880 = 0, $881 = 0, $882 = 0, $883 = 0;
 var $884 = 0, $885 = 0, $886 = 0, $887 = 0, $888 = 0, $889 = 0, $89 = 0, $890 = 0, $891 = 0, $892 = 0, $893 = 0, $894 = 0, $895 = 0, $896 = 0, $897 = 0, $898 = 0, $899 = 0, $9 = 0, $90 = 0, $900 = 0;
 var $901 = 0, $902 = 0, $903 = 0, $904 = 0, $905 = 0, $906 = 0, $907 = 0, $908 = 0, $909 = 0, $91 = 0, $910 = 0, $911 = 0, $912 = 0, $913 = 0, $914 = 0, $915 = 0, $916 = 0, $917 = 0, $918 = 0, $919 = 0;
 var $92 = 0, $920 = 0, $921 = 0, $922 = 0, $923 = 0, $924 = 0, $925 = 0, $926 = 0, $927 = 0, $928 = 0, $929 = 0, $93 = 0, $930 = 0, $931 = 0, $932 = 0, $933 = 0, $934 = 0, $935 = 0, $936 = 0, $937 = 0;
 var $938 = 0, $939 = 0, $94 = 0, $940 = 0, $941 = 0, $942 = 0, $943 = 0, $944 = 0, $945 = 0, $946 = 0, $947 = 0, $948 = 0, $949 = 0, $95 = 0, $950 = 0, $951 = 0, $952 = 0, $953 = 0, $954 = 0, $955 = 0;
 var $956 = 0, $957 = 0, $958 = 0, $959 = 0, $96 = 0, $960 = 0, $961 = 0, $962 = 0, $963 = 0, $964 = 0, $965 = 0, $966 = 0, $967 = 0, $968 = 0, $969 = 0, $97 = 0, $970 = 0, $971 = 0, $972 = 0, $973 = 0;
 var $974 = 0, $975 = 0, $976 = 0, $977 = 0, $978 = 0, $979 = 0, $98 = 0, $980 = 0, $981 = 0, $982 = 0, $983 = 0, $984 = 0, $985 = 0, $986 = 0, $987 = 0, $988 = 0, $989 = 0, $99 = 0, $990 = 0, $991 = 0;
 var $992 = 0, $993 = 0, $994 = 0, $995 = 0, $996 = 0, $997 = 0, $998 = 0, $999 = 0, $cond$i = 0, $cond$i$i = 0, $cond$i209 = 0, $not$$i = 0, $not$7$i = 0, $or$cond$i = 0, $or$cond$i214 = 0, $or$cond1$i = 0, $or$cond10$i = 0, $or$cond11$i = 0, $or$cond11$not$i = 0, $or$cond12$i = 0;
 var $or$cond2$i = 0, $or$cond2$i215 = 0, $or$cond49$i = 0, $or$cond5$i = 0, $or$cond50$i = 0, $or$cond7$i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $1 = sp;
 $2 = ($0>>>0)<(245);
 do {
  if ($2) {
   $3 = ($0>>>0)<(11);
   $4 = (($0) + 11)|0;
   $5 = $4 & -8;
   $6 = $3 ? 16 : $5;
   $7 = $6 >>> 3;
   $8 = HEAP32[753]|0;
   $9 = $8 >>> $7;
   $10 = $9 & 3;
   $11 = ($10|0)==(0);
   if (!($11)) {
    $12 = $9 & 1;
    $13 = $12 ^ 1;
    $14 = (($13) + ($7))|0;
    $15 = $14 << 1;
    $16 = (3052 + ($15<<2)|0);
    $17 = ((($16)) + 8|0);
    $18 = HEAP32[$17>>2]|0;
    $19 = ((($18)) + 8|0);
    $20 = HEAP32[$19>>2]|0;
    $21 = ($20|0)==($16|0);
    do {
     if ($21) {
      $22 = 1 << $14;
      $23 = $22 ^ -1;
      $24 = $8 & $23;
      HEAP32[753] = $24;
     } else {
      $25 = HEAP32[(3028)>>2]|0;
      $26 = ($25>>>0)>($20>>>0);
      if ($26) {
       _abort();
       // unreachable;
      }
      $27 = ((($20)) + 12|0);
      $28 = HEAP32[$27>>2]|0;
      $29 = ($28|0)==($18|0);
      if ($29) {
       HEAP32[$27>>2] = $16;
       HEAP32[$17>>2] = $20;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    } while(0);
    $30 = $14 << 3;
    $31 = $30 | 3;
    $32 = ((($18)) + 4|0);
    HEAP32[$32>>2] = $31;
    $33 = (($18) + ($30)|0);
    $34 = ((($33)) + 4|0);
    $35 = HEAP32[$34>>2]|0;
    $36 = $35 | 1;
    HEAP32[$34>>2] = $36;
    $$0 = $19;
    STACKTOP = sp;return ($$0|0);
   }
   $37 = HEAP32[(3020)>>2]|0;
   $38 = ($6>>>0)>($37>>>0);
   if ($38) {
    $39 = ($9|0)==(0);
    if (!($39)) {
     $40 = $9 << $7;
     $41 = 2 << $7;
     $42 = (0 - ($41))|0;
     $43 = $41 | $42;
     $44 = $40 & $43;
     $45 = (0 - ($44))|0;
     $46 = $44 & $45;
     $47 = (($46) + -1)|0;
     $48 = $47 >>> 12;
     $49 = $48 & 16;
     $50 = $47 >>> $49;
     $51 = $50 >>> 5;
     $52 = $51 & 8;
     $53 = $52 | $49;
     $54 = $50 >>> $52;
     $55 = $54 >>> 2;
     $56 = $55 & 4;
     $57 = $53 | $56;
     $58 = $54 >>> $56;
     $59 = $58 >>> 1;
     $60 = $59 & 2;
     $61 = $57 | $60;
     $62 = $58 >>> $60;
     $63 = $62 >>> 1;
     $64 = $63 & 1;
     $65 = $61 | $64;
     $66 = $62 >>> $64;
     $67 = (($65) + ($66))|0;
     $68 = $67 << 1;
     $69 = (3052 + ($68<<2)|0);
     $70 = ((($69)) + 8|0);
     $71 = HEAP32[$70>>2]|0;
     $72 = ((($71)) + 8|0);
     $73 = HEAP32[$72>>2]|0;
     $74 = ($73|0)==($69|0);
     do {
      if ($74) {
       $75 = 1 << $67;
       $76 = $75 ^ -1;
       $77 = $8 & $76;
       HEAP32[753] = $77;
       $98 = $77;
      } else {
       $78 = HEAP32[(3028)>>2]|0;
       $79 = ($78>>>0)>($73>>>0);
       if ($79) {
        _abort();
        // unreachable;
       }
       $80 = ((($73)) + 12|0);
       $81 = HEAP32[$80>>2]|0;
       $82 = ($81|0)==($71|0);
       if ($82) {
        HEAP32[$80>>2] = $69;
        HEAP32[$70>>2] = $73;
        $98 = $8;
        break;
       } else {
        _abort();
        // unreachable;
       }
      }
     } while(0);
     $83 = $67 << 3;
     $84 = (($83) - ($6))|0;
     $85 = $6 | 3;
     $86 = ((($71)) + 4|0);
     HEAP32[$86>>2] = $85;
     $87 = (($71) + ($6)|0);
     $88 = $84 | 1;
     $89 = ((($87)) + 4|0);
     HEAP32[$89>>2] = $88;
     $90 = (($71) + ($83)|0);
     HEAP32[$90>>2] = $84;
     $91 = ($37|0)==(0);
     if (!($91)) {
      $92 = HEAP32[(3032)>>2]|0;
      $93 = $37 >>> 3;
      $94 = $93 << 1;
      $95 = (3052 + ($94<<2)|0);
      $96 = 1 << $93;
      $97 = $98 & $96;
      $99 = ($97|0)==(0);
      if ($99) {
       $100 = $98 | $96;
       HEAP32[753] = $100;
       $$pre = ((($95)) + 8|0);
       $$0199 = $95;$$pre$phiZ2D = $$pre;
      } else {
       $101 = ((($95)) + 8|0);
       $102 = HEAP32[$101>>2]|0;
       $103 = HEAP32[(3028)>>2]|0;
       $104 = ($103>>>0)>($102>>>0);
       if ($104) {
        _abort();
        // unreachable;
       } else {
        $$0199 = $102;$$pre$phiZ2D = $101;
       }
      }
      HEAP32[$$pre$phiZ2D>>2] = $92;
      $105 = ((($$0199)) + 12|0);
      HEAP32[$105>>2] = $92;
      $106 = ((($92)) + 8|0);
      HEAP32[$106>>2] = $$0199;
      $107 = ((($92)) + 12|0);
      HEAP32[$107>>2] = $95;
     }
     HEAP32[(3020)>>2] = $84;
     HEAP32[(3032)>>2] = $87;
     $$0 = $72;
     STACKTOP = sp;return ($$0|0);
    }
    $108 = HEAP32[(3016)>>2]|0;
    $109 = ($108|0)==(0);
    if ($109) {
     $$0197 = $6;
    } else {
     $110 = (0 - ($108))|0;
     $111 = $108 & $110;
     $112 = (($111) + -1)|0;
     $113 = $112 >>> 12;
     $114 = $113 & 16;
     $115 = $112 >>> $114;
     $116 = $115 >>> 5;
     $117 = $116 & 8;
     $118 = $117 | $114;
     $119 = $115 >>> $117;
     $120 = $119 >>> 2;
     $121 = $120 & 4;
     $122 = $118 | $121;
     $123 = $119 >>> $121;
     $124 = $123 >>> 1;
     $125 = $124 & 2;
     $126 = $122 | $125;
     $127 = $123 >>> $125;
     $128 = $127 >>> 1;
     $129 = $128 & 1;
     $130 = $126 | $129;
     $131 = $127 >>> $129;
     $132 = (($130) + ($131))|0;
     $133 = (3316 + ($132<<2)|0);
     $134 = HEAP32[$133>>2]|0;
     $135 = ((($134)) + 4|0);
     $136 = HEAP32[$135>>2]|0;
     $137 = $136 & -8;
     $138 = (($137) - ($6))|0;
     $139 = ((($134)) + 16|0);
     $140 = HEAP32[$139>>2]|0;
     $141 = ($140|0)==(0|0);
     $$sink14$i = $141&1;
     $142 = (((($134)) + 16|0) + ($$sink14$i<<2)|0);
     $143 = HEAP32[$142>>2]|0;
     $144 = ($143|0)==(0|0);
     if ($144) {
      $$0192$lcssa$i = $134;$$0193$lcssa$i = $138;
     } else {
      $$01926$i = $134;$$01935$i = $138;$146 = $143;
      while(1) {
       $145 = ((($146)) + 4|0);
       $147 = HEAP32[$145>>2]|0;
       $148 = $147 & -8;
       $149 = (($148) - ($6))|0;
       $150 = ($149>>>0)<($$01935$i>>>0);
       $$$0193$i = $150 ? $149 : $$01935$i;
       $$$0192$i = $150 ? $146 : $$01926$i;
       $151 = ((($146)) + 16|0);
       $152 = HEAP32[$151>>2]|0;
       $153 = ($152|0)==(0|0);
       $$sink1$i = $153&1;
       $154 = (((($146)) + 16|0) + ($$sink1$i<<2)|0);
       $155 = HEAP32[$154>>2]|0;
       $156 = ($155|0)==(0|0);
       if ($156) {
        $$0192$lcssa$i = $$$0192$i;$$0193$lcssa$i = $$$0193$i;
        break;
       } else {
        $$01926$i = $$$0192$i;$$01935$i = $$$0193$i;$146 = $155;
       }
      }
     }
     $157 = HEAP32[(3028)>>2]|0;
     $158 = ($157>>>0)>($$0192$lcssa$i>>>0);
     if ($158) {
      _abort();
      // unreachable;
     }
     $159 = (($$0192$lcssa$i) + ($6)|0);
     $160 = ($159>>>0)>($$0192$lcssa$i>>>0);
     if (!($160)) {
      _abort();
      // unreachable;
     }
     $161 = ((($$0192$lcssa$i)) + 24|0);
     $162 = HEAP32[$161>>2]|0;
     $163 = ((($$0192$lcssa$i)) + 12|0);
     $164 = HEAP32[$163>>2]|0;
     $165 = ($164|0)==($$0192$lcssa$i|0);
     do {
      if ($165) {
       $175 = ((($$0192$lcssa$i)) + 20|0);
       $176 = HEAP32[$175>>2]|0;
       $177 = ($176|0)==(0|0);
       if ($177) {
        $178 = ((($$0192$lcssa$i)) + 16|0);
        $179 = HEAP32[$178>>2]|0;
        $180 = ($179|0)==(0|0);
        if ($180) {
         $$3$i = 0;
         break;
        } else {
         $$1196$i = $179;$$1198$i = $178;
        }
       } else {
        $$1196$i = $176;$$1198$i = $175;
       }
       while(1) {
        $181 = ((($$1196$i)) + 20|0);
        $182 = HEAP32[$181>>2]|0;
        $183 = ($182|0)==(0|0);
        if (!($183)) {
         $$1196$i = $182;$$1198$i = $181;
         continue;
        }
        $184 = ((($$1196$i)) + 16|0);
        $185 = HEAP32[$184>>2]|0;
        $186 = ($185|0)==(0|0);
        if ($186) {
         break;
        } else {
         $$1196$i = $185;$$1198$i = $184;
        }
       }
       $187 = ($157>>>0)>($$1198$i>>>0);
       if ($187) {
        _abort();
        // unreachable;
       } else {
        HEAP32[$$1198$i>>2] = 0;
        $$3$i = $$1196$i;
        break;
       }
      } else {
       $166 = ((($$0192$lcssa$i)) + 8|0);
       $167 = HEAP32[$166>>2]|0;
       $168 = ($157>>>0)>($167>>>0);
       if ($168) {
        _abort();
        // unreachable;
       }
       $169 = ((($167)) + 12|0);
       $170 = HEAP32[$169>>2]|0;
       $171 = ($170|0)==($$0192$lcssa$i|0);
       if (!($171)) {
        _abort();
        // unreachable;
       }
       $172 = ((($164)) + 8|0);
       $173 = HEAP32[$172>>2]|0;
       $174 = ($173|0)==($$0192$lcssa$i|0);
       if ($174) {
        HEAP32[$169>>2] = $164;
        HEAP32[$172>>2] = $167;
        $$3$i = $164;
        break;
       } else {
        _abort();
        // unreachable;
       }
      }
     } while(0);
     $188 = ($162|0)==(0|0);
     L73: do {
      if (!($188)) {
       $189 = ((($$0192$lcssa$i)) + 28|0);
       $190 = HEAP32[$189>>2]|0;
       $191 = (3316 + ($190<<2)|0);
       $192 = HEAP32[$191>>2]|0;
       $193 = ($$0192$lcssa$i|0)==($192|0);
       do {
        if ($193) {
         HEAP32[$191>>2] = $$3$i;
         $cond$i = ($$3$i|0)==(0|0);
         if ($cond$i) {
          $194 = 1 << $190;
          $195 = $194 ^ -1;
          $196 = $108 & $195;
          HEAP32[(3016)>>2] = $196;
          break L73;
         }
        } else {
         $197 = HEAP32[(3028)>>2]|0;
         $198 = ($197>>>0)>($162>>>0);
         if ($198) {
          _abort();
          // unreachable;
         } else {
          $199 = ((($162)) + 16|0);
          $200 = HEAP32[$199>>2]|0;
          $201 = ($200|0)!=($$0192$lcssa$i|0);
          $$sink2$i = $201&1;
          $202 = (((($162)) + 16|0) + ($$sink2$i<<2)|0);
          HEAP32[$202>>2] = $$3$i;
          $203 = ($$3$i|0)==(0|0);
          if ($203) {
           break L73;
          } else {
           break;
          }
         }
        }
       } while(0);
       $204 = HEAP32[(3028)>>2]|0;
       $205 = ($204>>>0)>($$3$i>>>0);
       if ($205) {
        _abort();
        // unreachable;
       }
       $206 = ((($$3$i)) + 24|0);
       HEAP32[$206>>2] = $162;
       $207 = ((($$0192$lcssa$i)) + 16|0);
       $208 = HEAP32[$207>>2]|0;
       $209 = ($208|0)==(0|0);
       do {
        if (!($209)) {
         $210 = ($204>>>0)>($208>>>0);
         if ($210) {
          _abort();
          // unreachable;
         } else {
          $211 = ((($$3$i)) + 16|0);
          HEAP32[$211>>2] = $208;
          $212 = ((($208)) + 24|0);
          HEAP32[$212>>2] = $$3$i;
          break;
         }
        }
       } while(0);
       $213 = ((($$0192$lcssa$i)) + 20|0);
       $214 = HEAP32[$213>>2]|0;
       $215 = ($214|0)==(0|0);
       if (!($215)) {
        $216 = HEAP32[(3028)>>2]|0;
        $217 = ($216>>>0)>($214>>>0);
        if ($217) {
         _abort();
         // unreachable;
        } else {
         $218 = ((($$3$i)) + 20|0);
         HEAP32[$218>>2] = $214;
         $219 = ((($214)) + 24|0);
         HEAP32[$219>>2] = $$3$i;
         break;
        }
       }
      }
     } while(0);
     $220 = ($$0193$lcssa$i>>>0)<(16);
     if ($220) {
      $221 = (($$0193$lcssa$i) + ($6))|0;
      $222 = $221 | 3;
      $223 = ((($$0192$lcssa$i)) + 4|0);
      HEAP32[$223>>2] = $222;
      $224 = (($$0192$lcssa$i) + ($221)|0);
      $225 = ((($224)) + 4|0);
      $226 = HEAP32[$225>>2]|0;
      $227 = $226 | 1;
      HEAP32[$225>>2] = $227;
     } else {
      $228 = $6 | 3;
      $229 = ((($$0192$lcssa$i)) + 4|0);
      HEAP32[$229>>2] = $228;
      $230 = $$0193$lcssa$i | 1;
      $231 = ((($159)) + 4|0);
      HEAP32[$231>>2] = $230;
      $232 = (($159) + ($$0193$lcssa$i)|0);
      HEAP32[$232>>2] = $$0193$lcssa$i;
      $233 = ($37|0)==(0);
      if (!($233)) {
       $234 = HEAP32[(3032)>>2]|0;
       $235 = $37 >>> 3;
       $236 = $235 << 1;
       $237 = (3052 + ($236<<2)|0);
       $238 = 1 << $235;
       $239 = $8 & $238;
       $240 = ($239|0)==(0);
       if ($240) {
        $241 = $8 | $238;
        HEAP32[753] = $241;
        $$pre$i = ((($237)) + 8|0);
        $$0189$i = $237;$$pre$phi$iZ2D = $$pre$i;
       } else {
        $242 = ((($237)) + 8|0);
        $243 = HEAP32[$242>>2]|0;
        $244 = HEAP32[(3028)>>2]|0;
        $245 = ($244>>>0)>($243>>>0);
        if ($245) {
         _abort();
         // unreachable;
        } else {
         $$0189$i = $243;$$pre$phi$iZ2D = $242;
        }
       }
       HEAP32[$$pre$phi$iZ2D>>2] = $234;
       $246 = ((($$0189$i)) + 12|0);
       HEAP32[$246>>2] = $234;
       $247 = ((($234)) + 8|0);
       HEAP32[$247>>2] = $$0189$i;
       $248 = ((($234)) + 12|0);
       HEAP32[$248>>2] = $237;
      }
      HEAP32[(3020)>>2] = $$0193$lcssa$i;
      HEAP32[(3032)>>2] = $159;
     }
     $249 = ((($$0192$lcssa$i)) + 8|0);
     $$0 = $249;
     STACKTOP = sp;return ($$0|0);
    }
   } else {
    $$0197 = $6;
   }
  } else {
   $250 = ($0>>>0)>(4294967231);
   if ($250) {
    $$0197 = -1;
   } else {
    $251 = (($0) + 11)|0;
    $252 = $251 & -8;
    $253 = HEAP32[(3016)>>2]|0;
    $254 = ($253|0)==(0);
    if ($254) {
     $$0197 = $252;
    } else {
     $255 = (0 - ($252))|0;
     $256 = $251 >>> 8;
     $257 = ($256|0)==(0);
     if ($257) {
      $$0358$i = 0;
     } else {
      $258 = ($252>>>0)>(16777215);
      if ($258) {
       $$0358$i = 31;
      } else {
       $259 = (($256) + 1048320)|0;
       $260 = $259 >>> 16;
       $261 = $260 & 8;
       $262 = $256 << $261;
       $263 = (($262) + 520192)|0;
       $264 = $263 >>> 16;
       $265 = $264 & 4;
       $266 = $265 | $261;
       $267 = $262 << $265;
       $268 = (($267) + 245760)|0;
       $269 = $268 >>> 16;
       $270 = $269 & 2;
       $271 = $266 | $270;
       $272 = (14 - ($271))|0;
       $273 = $267 << $270;
       $274 = $273 >>> 15;
       $275 = (($272) + ($274))|0;
       $276 = $275 << 1;
       $277 = (($275) + 7)|0;
       $278 = $252 >>> $277;
       $279 = $278 & 1;
       $280 = $279 | $276;
       $$0358$i = $280;
      }
     }
     $281 = (3316 + ($$0358$i<<2)|0);
     $282 = HEAP32[$281>>2]|0;
     $283 = ($282|0)==(0|0);
     L117: do {
      if ($283) {
       $$2355$i = 0;$$3$i203 = 0;$$3350$i = $255;
       label = 81;
      } else {
       $284 = ($$0358$i|0)==(31);
       $285 = $$0358$i >>> 1;
       $286 = (25 - ($285))|0;
       $287 = $284 ? 0 : $286;
       $288 = $252 << $287;
       $$0342$i = 0;$$0347$i = $255;$$0353$i = $282;$$0359$i = $288;$$0362$i = 0;
       while(1) {
        $289 = ((($$0353$i)) + 4|0);
        $290 = HEAP32[$289>>2]|0;
        $291 = $290 & -8;
        $292 = (($291) - ($252))|0;
        $293 = ($292>>>0)<($$0347$i>>>0);
        if ($293) {
         $294 = ($292|0)==(0);
         if ($294) {
          $$414$i = $$0353$i;$$435113$i = 0;$$435712$i = $$0353$i;
          label = 85;
          break L117;
         } else {
          $$1343$i = $$0353$i;$$1348$i = $292;
         }
        } else {
         $$1343$i = $$0342$i;$$1348$i = $$0347$i;
        }
        $295 = ((($$0353$i)) + 20|0);
        $296 = HEAP32[$295>>2]|0;
        $297 = $$0359$i >>> 31;
        $298 = (((($$0353$i)) + 16|0) + ($297<<2)|0);
        $299 = HEAP32[$298>>2]|0;
        $300 = ($296|0)==(0|0);
        $301 = ($296|0)==($299|0);
        $or$cond2$i = $300 | $301;
        $$1363$i = $or$cond2$i ? $$0362$i : $296;
        $302 = ($299|0)==(0|0);
        $not$7$i = $302 ^ 1;
        $303 = $not$7$i&1;
        $$0359$$i = $$0359$i << $303;
        if ($302) {
         $$2355$i = $$1363$i;$$3$i203 = $$1343$i;$$3350$i = $$1348$i;
         label = 81;
         break;
        } else {
         $$0342$i = $$1343$i;$$0347$i = $$1348$i;$$0353$i = $299;$$0359$i = $$0359$$i;$$0362$i = $$1363$i;
        }
       }
      }
     } while(0);
     if ((label|0) == 81) {
      $304 = ($$2355$i|0)==(0|0);
      $305 = ($$3$i203|0)==(0|0);
      $or$cond$i = $304 & $305;
      if ($or$cond$i) {
       $306 = 2 << $$0358$i;
       $307 = (0 - ($306))|0;
       $308 = $306 | $307;
       $309 = $253 & $308;
       $310 = ($309|0)==(0);
       if ($310) {
        $$0197 = $252;
        break;
       }
       $311 = (0 - ($309))|0;
       $312 = $309 & $311;
       $313 = (($312) + -1)|0;
       $314 = $313 >>> 12;
       $315 = $314 & 16;
       $316 = $313 >>> $315;
       $317 = $316 >>> 5;
       $318 = $317 & 8;
       $319 = $318 | $315;
       $320 = $316 >>> $318;
       $321 = $320 >>> 2;
       $322 = $321 & 4;
       $323 = $319 | $322;
       $324 = $320 >>> $322;
       $325 = $324 >>> 1;
       $326 = $325 & 2;
       $327 = $323 | $326;
       $328 = $324 >>> $326;
       $329 = $328 >>> 1;
       $330 = $329 & 1;
       $331 = $327 | $330;
       $332 = $328 >>> $330;
       $333 = (($331) + ($332))|0;
       $334 = (3316 + ($333<<2)|0);
       $335 = HEAP32[$334>>2]|0;
       $$4$ph$i = 0;$$4357$ph$i = $335;
      } else {
       $$4$ph$i = $$3$i203;$$4357$ph$i = $$2355$i;
      }
      $336 = ($$4357$ph$i|0)==(0|0);
      if ($336) {
       $$4$lcssa$i = $$4$ph$i;$$4351$lcssa$i = $$3350$i;
      } else {
       $$414$i = $$4$ph$i;$$435113$i = $$3350$i;$$435712$i = $$4357$ph$i;
       label = 85;
      }
     }
     if ((label|0) == 85) {
      while(1) {
       label = 0;
       $337 = ((($$435712$i)) + 4|0);
       $338 = HEAP32[$337>>2]|0;
       $339 = $338 & -8;
       $340 = (($339) - ($252))|0;
       $341 = ($340>>>0)<($$435113$i>>>0);
       $$$4351$i = $341 ? $340 : $$435113$i;
       $$4357$$4$i = $341 ? $$435712$i : $$414$i;
       $342 = ((($$435712$i)) + 16|0);
       $343 = HEAP32[$342>>2]|0;
       $344 = ($343|0)==(0|0);
       $$sink2$i205 = $344&1;
       $345 = (((($$435712$i)) + 16|0) + ($$sink2$i205<<2)|0);
       $346 = HEAP32[$345>>2]|0;
       $347 = ($346|0)==(0|0);
       if ($347) {
        $$4$lcssa$i = $$4357$$4$i;$$4351$lcssa$i = $$$4351$i;
        break;
       } else {
        $$414$i = $$4357$$4$i;$$435113$i = $$$4351$i;$$435712$i = $346;
        label = 85;
       }
      }
     }
     $348 = ($$4$lcssa$i|0)==(0|0);
     if ($348) {
      $$0197 = $252;
     } else {
      $349 = HEAP32[(3020)>>2]|0;
      $350 = (($349) - ($252))|0;
      $351 = ($$4351$lcssa$i>>>0)<($350>>>0);
      if ($351) {
       $352 = HEAP32[(3028)>>2]|0;
       $353 = ($352>>>0)>($$4$lcssa$i>>>0);
       if ($353) {
        _abort();
        // unreachable;
       }
       $354 = (($$4$lcssa$i) + ($252)|0);
       $355 = ($354>>>0)>($$4$lcssa$i>>>0);
       if (!($355)) {
        _abort();
        // unreachable;
       }
       $356 = ((($$4$lcssa$i)) + 24|0);
       $357 = HEAP32[$356>>2]|0;
       $358 = ((($$4$lcssa$i)) + 12|0);
       $359 = HEAP32[$358>>2]|0;
       $360 = ($359|0)==($$4$lcssa$i|0);
       do {
        if ($360) {
         $370 = ((($$4$lcssa$i)) + 20|0);
         $371 = HEAP32[$370>>2]|0;
         $372 = ($371|0)==(0|0);
         if ($372) {
          $373 = ((($$4$lcssa$i)) + 16|0);
          $374 = HEAP32[$373>>2]|0;
          $375 = ($374|0)==(0|0);
          if ($375) {
           $$3372$i = 0;
           break;
          } else {
           $$1370$i = $374;$$1374$i = $373;
          }
         } else {
          $$1370$i = $371;$$1374$i = $370;
         }
         while(1) {
          $376 = ((($$1370$i)) + 20|0);
          $377 = HEAP32[$376>>2]|0;
          $378 = ($377|0)==(0|0);
          if (!($378)) {
           $$1370$i = $377;$$1374$i = $376;
           continue;
          }
          $379 = ((($$1370$i)) + 16|0);
          $380 = HEAP32[$379>>2]|0;
          $381 = ($380|0)==(0|0);
          if ($381) {
           break;
          } else {
           $$1370$i = $380;$$1374$i = $379;
          }
         }
         $382 = ($352>>>0)>($$1374$i>>>0);
         if ($382) {
          _abort();
          // unreachable;
         } else {
          HEAP32[$$1374$i>>2] = 0;
          $$3372$i = $$1370$i;
          break;
         }
        } else {
         $361 = ((($$4$lcssa$i)) + 8|0);
         $362 = HEAP32[$361>>2]|0;
         $363 = ($352>>>0)>($362>>>0);
         if ($363) {
          _abort();
          // unreachable;
         }
         $364 = ((($362)) + 12|0);
         $365 = HEAP32[$364>>2]|0;
         $366 = ($365|0)==($$4$lcssa$i|0);
         if (!($366)) {
          _abort();
          // unreachable;
         }
         $367 = ((($359)) + 8|0);
         $368 = HEAP32[$367>>2]|0;
         $369 = ($368|0)==($$4$lcssa$i|0);
         if ($369) {
          HEAP32[$364>>2] = $359;
          HEAP32[$367>>2] = $362;
          $$3372$i = $359;
          break;
         } else {
          _abort();
          // unreachable;
         }
        }
       } while(0);
       $383 = ($357|0)==(0|0);
       L164: do {
        if ($383) {
         $475 = $253;
        } else {
         $384 = ((($$4$lcssa$i)) + 28|0);
         $385 = HEAP32[$384>>2]|0;
         $386 = (3316 + ($385<<2)|0);
         $387 = HEAP32[$386>>2]|0;
         $388 = ($$4$lcssa$i|0)==($387|0);
         do {
          if ($388) {
           HEAP32[$386>>2] = $$3372$i;
           $cond$i209 = ($$3372$i|0)==(0|0);
           if ($cond$i209) {
            $389 = 1 << $385;
            $390 = $389 ^ -1;
            $391 = $253 & $390;
            HEAP32[(3016)>>2] = $391;
            $475 = $391;
            break L164;
           }
          } else {
           $392 = HEAP32[(3028)>>2]|0;
           $393 = ($392>>>0)>($357>>>0);
           if ($393) {
            _abort();
            // unreachable;
           } else {
            $394 = ((($357)) + 16|0);
            $395 = HEAP32[$394>>2]|0;
            $396 = ($395|0)!=($$4$lcssa$i|0);
            $$sink3$i = $396&1;
            $397 = (((($357)) + 16|0) + ($$sink3$i<<2)|0);
            HEAP32[$397>>2] = $$3372$i;
            $398 = ($$3372$i|0)==(0|0);
            if ($398) {
             $475 = $253;
             break L164;
            } else {
             break;
            }
           }
          }
         } while(0);
         $399 = HEAP32[(3028)>>2]|0;
         $400 = ($399>>>0)>($$3372$i>>>0);
         if ($400) {
          _abort();
          // unreachable;
         }
         $401 = ((($$3372$i)) + 24|0);
         HEAP32[$401>>2] = $357;
         $402 = ((($$4$lcssa$i)) + 16|0);
         $403 = HEAP32[$402>>2]|0;
         $404 = ($403|0)==(0|0);
         do {
          if (!($404)) {
           $405 = ($399>>>0)>($403>>>0);
           if ($405) {
            _abort();
            // unreachable;
           } else {
            $406 = ((($$3372$i)) + 16|0);
            HEAP32[$406>>2] = $403;
            $407 = ((($403)) + 24|0);
            HEAP32[$407>>2] = $$3372$i;
            break;
           }
          }
         } while(0);
         $408 = ((($$4$lcssa$i)) + 20|0);
         $409 = HEAP32[$408>>2]|0;
         $410 = ($409|0)==(0|0);
         if ($410) {
          $475 = $253;
         } else {
          $411 = HEAP32[(3028)>>2]|0;
          $412 = ($411>>>0)>($409>>>0);
          if ($412) {
           _abort();
           // unreachable;
          } else {
           $413 = ((($$3372$i)) + 20|0);
           HEAP32[$413>>2] = $409;
           $414 = ((($409)) + 24|0);
           HEAP32[$414>>2] = $$3372$i;
           $475 = $253;
           break;
          }
         }
        }
       } while(0);
       $415 = ($$4351$lcssa$i>>>0)<(16);
       do {
        if ($415) {
         $416 = (($$4351$lcssa$i) + ($252))|0;
         $417 = $416 | 3;
         $418 = ((($$4$lcssa$i)) + 4|0);
         HEAP32[$418>>2] = $417;
         $419 = (($$4$lcssa$i) + ($416)|0);
         $420 = ((($419)) + 4|0);
         $421 = HEAP32[$420>>2]|0;
         $422 = $421 | 1;
         HEAP32[$420>>2] = $422;
        } else {
         $423 = $252 | 3;
         $424 = ((($$4$lcssa$i)) + 4|0);
         HEAP32[$424>>2] = $423;
         $425 = $$4351$lcssa$i | 1;
         $426 = ((($354)) + 4|0);
         HEAP32[$426>>2] = $425;
         $427 = (($354) + ($$4351$lcssa$i)|0);
         HEAP32[$427>>2] = $$4351$lcssa$i;
         $428 = $$4351$lcssa$i >>> 3;
         $429 = ($$4351$lcssa$i>>>0)<(256);
         if ($429) {
          $430 = $428 << 1;
          $431 = (3052 + ($430<<2)|0);
          $432 = HEAP32[753]|0;
          $433 = 1 << $428;
          $434 = $432 & $433;
          $435 = ($434|0)==(0);
          if ($435) {
           $436 = $432 | $433;
           HEAP32[753] = $436;
           $$pre$i210 = ((($431)) + 8|0);
           $$0368$i = $431;$$pre$phi$i211Z2D = $$pre$i210;
          } else {
           $437 = ((($431)) + 8|0);
           $438 = HEAP32[$437>>2]|0;
           $439 = HEAP32[(3028)>>2]|0;
           $440 = ($439>>>0)>($438>>>0);
           if ($440) {
            _abort();
            // unreachable;
           } else {
            $$0368$i = $438;$$pre$phi$i211Z2D = $437;
           }
          }
          HEAP32[$$pre$phi$i211Z2D>>2] = $354;
          $441 = ((($$0368$i)) + 12|0);
          HEAP32[$441>>2] = $354;
          $442 = ((($354)) + 8|0);
          HEAP32[$442>>2] = $$0368$i;
          $443 = ((($354)) + 12|0);
          HEAP32[$443>>2] = $431;
          break;
         }
         $444 = $$4351$lcssa$i >>> 8;
         $445 = ($444|0)==(0);
         if ($445) {
          $$0361$i = 0;
         } else {
          $446 = ($$4351$lcssa$i>>>0)>(16777215);
          if ($446) {
           $$0361$i = 31;
          } else {
           $447 = (($444) + 1048320)|0;
           $448 = $447 >>> 16;
           $449 = $448 & 8;
           $450 = $444 << $449;
           $451 = (($450) + 520192)|0;
           $452 = $451 >>> 16;
           $453 = $452 & 4;
           $454 = $453 | $449;
           $455 = $450 << $453;
           $456 = (($455) + 245760)|0;
           $457 = $456 >>> 16;
           $458 = $457 & 2;
           $459 = $454 | $458;
           $460 = (14 - ($459))|0;
           $461 = $455 << $458;
           $462 = $461 >>> 15;
           $463 = (($460) + ($462))|0;
           $464 = $463 << 1;
           $465 = (($463) + 7)|0;
           $466 = $$4351$lcssa$i >>> $465;
           $467 = $466 & 1;
           $468 = $467 | $464;
           $$0361$i = $468;
          }
         }
         $469 = (3316 + ($$0361$i<<2)|0);
         $470 = ((($354)) + 28|0);
         HEAP32[$470>>2] = $$0361$i;
         $471 = ((($354)) + 16|0);
         $472 = ((($471)) + 4|0);
         HEAP32[$472>>2] = 0;
         HEAP32[$471>>2] = 0;
         $473 = 1 << $$0361$i;
         $474 = $475 & $473;
         $476 = ($474|0)==(0);
         if ($476) {
          $477 = $475 | $473;
          HEAP32[(3016)>>2] = $477;
          HEAP32[$469>>2] = $354;
          $478 = ((($354)) + 24|0);
          HEAP32[$478>>2] = $469;
          $479 = ((($354)) + 12|0);
          HEAP32[$479>>2] = $354;
          $480 = ((($354)) + 8|0);
          HEAP32[$480>>2] = $354;
          break;
         }
         $481 = HEAP32[$469>>2]|0;
         $482 = ($$0361$i|0)==(31);
         $483 = $$0361$i >>> 1;
         $484 = (25 - ($483))|0;
         $485 = $482 ? 0 : $484;
         $486 = $$4351$lcssa$i << $485;
         $$0344$i = $486;$$0345$i = $481;
         while(1) {
          $487 = ((($$0345$i)) + 4|0);
          $488 = HEAP32[$487>>2]|0;
          $489 = $488 & -8;
          $490 = ($489|0)==($$4351$lcssa$i|0);
          if ($490) {
           label = 139;
           break;
          }
          $491 = $$0344$i >>> 31;
          $492 = (((($$0345$i)) + 16|0) + ($491<<2)|0);
          $493 = $$0344$i << 1;
          $494 = HEAP32[$492>>2]|0;
          $495 = ($494|0)==(0|0);
          if ($495) {
           label = 136;
           break;
          } else {
           $$0344$i = $493;$$0345$i = $494;
          }
         }
         if ((label|0) == 136) {
          $496 = HEAP32[(3028)>>2]|0;
          $497 = ($496>>>0)>($492>>>0);
          if ($497) {
           _abort();
           // unreachable;
          } else {
           HEAP32[$492>>2] = $354;
           $498 = ((($354)) + 24|0);
           HEAP32[$498>>2] = $$0345$i;
           $499 = ((($354)) + 12|0);
           HEAP32[$499>>2] = $354;
           $500 = ((($354)) + 8|0);
           HEAP32[$500>>2] = $354;
           break;
          }
         }
         else if ((label|0) == 139) {
          $501 = ((($$0345$i)) + 8|0);
          $502 = HEAP32[$501>>2]|0;
          $503 = HEAP32[(3028)>>2]|0;
          $504 = ($503>>>0)<=($$0345$i>>>0);
          $505 = ($503>>>0)<=($502>>>0);
          $506 = $505 & $504;
          if ($506) {
           $507 = ((($502)) + 12|0);
           HEAP32[$507>>2] = $354;
           HEAP32[$501>>2] = $354;
           $508 = ((($354)) + 8|0);
           HEAP32[$508>>2] = $502;
           $509 = ((($354)) + 12|0);
           HEAP32[$509>>2] = $$0345$i;
           $510 = ((($354)) + 24|0);
           HEAP32[$510>>2] = 0;
           break;
          } else {
           _abort();
           // unreachable;
          }
         }
        }
       } while(0);
       $511 = ((($$4$lcssa$i)) + 8|0);
       $$0 = $511;
       STACKTOP = sp;return ($$0|0);
      } else {
       $$0197 = $252;
      }
     }
    }
   }
  }
 } while(0);
 $512 = HEAP32[(3020)>>2]|0;
 $513 = ($512>>>0)<($$0197>>>0);
 if (!($513)) {
  $514 = (($512) - ($$0197))|0;
  $515 = HEAP32[(3032)>>2]|0;
  $516 = ($514>>>0)>(15);
  if ($516) {
   $517 = (($515) + ($$0197)|0);
   HEAP32[(3032)>>2] = $517;
   HEAP32[(3020)>>2] = $514;
   $518 = $514 | 1;
   $519 = ((($517)) + 4|0);
   HEAP32[$519>>2] = $518;
   $520 = (($515) + ($512)|0);
   HEAP32[$520>>2] = $514;
   $521 = $$0197 | 3;
   $522 = ((($515)) + 4|0);
   HEAP32[$522>>2] = $521;
  } else {
   HEAP32[(3020)>>2] = 0;
   HEAP32[(3032)>>2] = 0;
   $523 = $512 | 3;
   $524 = ((($515)) + 4|0);
   HEAP32[$524>>2] = $523;
   $525 = (($515) + ($512)|0);
   $526 = ((($525)) + 4|0);
   $527 = HEAP32[$526>>2]|0;
   $528 = $527 | 1;
   HEAP32[$526>>2] = $528;
  }
  $529 = ((($515)) + 8|0);
  $$0 = $529;
  STACKTOP = sp;return ($$0|0);
 }
 $530 = HEAP32[(3024)>>2]|0;
 $531 = ($530>>>0)>($$0197>>>0);
 if ($531) {
  $532 = (($530) - ($$0197))|0;
  HEAP32[(3024)>>2] = $532;
  $533 = HEAP32[(3036)>>2]|0;
  $534 = (($533) + ($$0197)|0);
  HEAP32[(3036)>>2] = $534;
  $535 = $532 | 1;
  $536 = ((($534)) + 4|0);
  HEAP32[$536>>2] = $535;
  $537 = $$0197 | 3;
  $538 = ((($533)) + 4|0);
  HEAP32[$538>>2] = $537;
  $539 = ((($533)) + 8|0);
  $$0 = $539;
  STACKTOP = sp;return ($$0|0);
 }
 $540 = HEAP32[871]|0;
 $541 = ($540|0)==(0);
 if ($541) {
  HEAP32[(3492)>>2] = 4096;
  HEAP32[(3488)>>2] = 4096;
  HEAP32[(3496)>>2] = -1;
  HEAP32[(3500)>>2] = -1;
  HEAP32[(3504)>>2] = 0;
  HEAP32[(3456)>>2] = 0;
  $542 = $1;
  $543 = $542 & -16;
  $544 = $543 ^ 1431655768;
  HEAP32[871] = $544;
  $548 = 4096;
 } else {
  $$pre$i212 = HEAP32[(3492)>>2]|0;
  $548 = $$pre$i212;
 }
 $545 = (($$0197) + 48)|0;
 $546 = (($$0197) + 47)|0;
 $547 = (($548) + ($546))|0;
 $549 = (0 - ($548))|0;
 $550 = $547 & $549;
 $551 = ($550>>>0)>($$0197>>>0);
 if (!($551)) {
  $$0 = 0;
  STACKTOP = sp;return ($$0|0);
 }
 $552 = HEAP32[(3452)>>2]|0;
 $553 = ($552|0)==(0);
 if (!($553)) {
  $554 = HEAP32[(3444)>>2]|0;
  $555 = (($554) + ($550))|0;
  $556 = ($555>>>0)<=($554>>>0);
  $557 = ($555>>>0)>($552>>>0);
  $or$cond1$i = $556 | $557;
  if ($or$cond1$i) {
   $$0 = 0;
   STACKTOP = sp;return ($$0|0);
  }
 }
 $558 = HEAP32[(3456)>>2]|0;
 $559 = $558 & 4;
 $560 = ($559|0)==(0);
 L244: do {
  if ($560) {
   $561 = HEAP32[(3036)>>2]|0;
   $562 = ($561|0)==(0|0);
   L246: do {
    if ($562) {
     label = 163;
    } else {
     $$0$i$i = (3460);
     while(1) {
      $563 = HEAP32[$$0$i$i>>2]|0;
      $564 = ($563>>>0)>($561>>>0);
      if (!($564)) {
       $565 = ((($$0$i$i)) + 4|0);
       $566 = HEAP32[$565>>2]|0;
       $567 = (($563) + ($566)|0);
       $568 = ($567>>>0)>($561>>>0);
       if ($568) {
        break;
       }
      }
      $569 = ((($$0$i$i)) + 8|0);
      $570 = HEAP32[$569>>2]|0;
      $571 = ($570|0)==(0|0);
      if ($571) {
       label = 163;
       break L246;
      } else {
       $$0$i$i = $570;
      }
     }
     $594 = (($547) - ($530))|0;
     $595 = $594 & $549;
     $596 = ($595>>>0)<(2147483647);
     if ($596) {
      $597 = (_sbrk(($595|0))|0);
      $598 = HEAP32[$$0$i$i>>2]|0;
      $599 = HEAP32[$565>>2]|0;
      $600 = (($598) + ($599)|0);
      $601 = ($597|0)==($600|0);
      if ($601) {
       $602 = ($597|0)==((-1)|0);
       if ($602) {
        $$2234243136$i = $595;
       } else {
        $$723947$i = $595;$$748$i = $597;
        label = 180;
        break L244;
       }
      } else {
       $$2247$ph$i = $597;$$2253$ph$i = $595;
       label = 171;
      }
     } else {
      $$2234243136$i = 0;
     }
    }
   } while(0);
   do {
    if ((label|0) == 163) {
     $572 = (_sbrk(0)|0);
     $573 = ($572|0)==((-1)|0);
     if ($573) {
      $$2234243136$i = 0;
     } else {
      $574 = $572;
      $575 = HEAP32[(3488)>>2]|0;
      $576 = (($575) + -1)|0;
      $577 = $576 & $574;
      $578 = ($577|0)==(0);
      $579 = (($576) + ($574))|0;
      $580 = (0 - ($575))|0;
      $581 = $579 & $580;
      $582 = (($581) - ($574))|0;
      $583 = $578 ? 0 : $582;
      $$$i = (($583) + ($550))|0;
      $584 = HEAP32[(3444)>>2]|0;
      $585 = (($$$i) + ($584))|0;
      $586 = ($$$i>>>0)>($$0197>>>0);
      $587 = ($$$i>>>0)<(2147483647);
      $or$cond$i214 = $586 & $587;
      if ($or$cond$i214) {
       $588 = HEAP32[(3452)>>2]|0;
       $589 = ($588|0)==(0);
       if (!($589)) {
        $590 = ($585>>>0)<=($584>>>0);
        $591 = ($585>>>0)>($588>>>0);
        $or$cond2$i215 = $590 | $591;
        if ($or$cond2$i215) {
         $$2234243136$i = 0;
         break;
        }
       }
       $592 = (_sbrk(($$$i|0))|0);
       $593 = ($592|0)==($572|0);
       if ($593) {
        $$723947$i = $$$i;$$748$i = $572;
        label = 180;
        break L244;
       } else {
        $$2247$ph$i = $592;$$2253$ph$i = $$$i;
        label = 171;
       }
      } else {
       $$2234243136$i = 0;
      }
     }
    }
   } while(0);
   do {
    if ((label|0) == 171) {
     $603 = (0 - ($$2253$ph$i))|0;
     $604 = ($$2247$ph$i|0)!=((-1)|0);
     $605 = ($$2253$ph$i>>>0)<(2147483647);
     $or$cond7$i = $605 & $604;
     $606 = ($545>>>0)>($$2253$ph$i>>>0);
     $or$cond10$i = $606 & $or$cond7$i;
     if (!($or$cond10$i)) {
      $616 = ($$2247$ph$i|0)==((-1)|0);
      if ($616) {
       $$2234243136$i = 0;
       break;
      } else {
       $$723947$i = $$2253$ph$i;$$748$i = $$2247$ph$i;
       label = 180;
       break L244;
      }
     }
     $607 = HEAP32[(3492)>>2]|0;
     $608 = (($546) - ($$2253$ph$i))|0;
     $609 = (($608) + ($607))|0;
     $610 = (0 - ($607))|0;
     $611 = $609 & $610;
     $612 = ($611>>>0)<(2147483647);
     if (!($612)) {
      $$723947$i = $$2253$ph$i;$$748$i = $$2247$ph$i;
      label = 180;
      break L244;
     }
     $613 = (_sbrk(($611|0))|0);
     $614 = ($613|0)==((-1)|0);
     if ($614) {
      (_sbrk(($603|0))|0);
      $$2234243136$i = 0;
      break;
     } else {
      $615 = (($611) + ($$2253$ph$i))|0;
      $$723947$i = $615;$$748$i = $$2247$ph$i;
      label = 180;
      break L244;
     }
    }
   } while(0);
   $617 = HEAP32[(3456)>>2]|0;
   $618 = $617 | 4;
   HEAP32[(3456)>>2] = $618;
   $$4236$i = $$2234243136$i;
   label = 178;
  } else {
   $$4236$i = 0;
   label = 178;
  }
 } while(0);
 if ((label|0) == 178) {
  $619 = ($550>>>0)<(2147483647);
  if ($619) {
   $620 = (_sbrk(($550|0))|0);
   $621 = (_sbrk(0)|0);
   $622 = ($620|0)!=((-1)|0);
   $623 = ($621|0)!=((-1)|0);
   $or$cond5$i = $622 & $623;
   $624 = ($620>>>0)<($621>>>0);
   $or$cond11$i = $624 & $or$cond5$i;
   $625 = $621;
   $626 = $620;
   $627 = (($625) - ($626))|0;
   $628 = (($$0197) + 40)|0;
   $629 = ($627>>>0)>($628>>>0);
   $$$4236$i = $629 ? $627 : $$4236$i;
   $or$cond11$not$i = $or$cond11$i ^ 1;
   $630 = ($620|0)==((-1)|0);
   $not$$i = $629 ^ 1;
   $631 = $630 | $not$$i;
   $or$cond49$i = $631 | $or$cond11$not$i;
   if (!($or$cond49$i)) {
    $$723947$i = $$$4236$i;$$748$i = $620;
    label = 180;
   }
  }
 }
 if ((label|0) == 180) {
  $632 = HEAP32[(3444)>>2]|0;
  $633 = (($632) + ($$723947$i))|0;
  HEAP32[(3444)>>2] = $633;
  $634 = HEAP32[(3448)>>2]|0;
  $635 = ($633>>>0)>($634>>>0);
  if ($635) {
   HEAP32[(3448)>>2] = $633;
  }
  $636 = HEAP32[(3036)>>2]|0;
  $637 = ($636|0)==(0|0);
  do {
   if ($637) {
    $638 = HEAP32[(3028)>>2]|0;
    $639 = ($638|0)==(0|0);
    $640 = ($$748$i>>>0)<($638>>>0);
    $or$cond12$i = $639 | $640;
    if ($or$cond12$i) {
     HEAP32[(3028)>>2] = $$748$i;
    }
    HEAP32[(3460)>>2] = $$748$i;
    HEAP32[(3464)>>2] = $$723947$i;
    HEAP32[(3472)>>2] = 0;
    $641 = HEAP32[871]|0;
    HEAP32[(3048)>>2] = $641;
    HEAP32[(3044)>>2] = -1;
    HEAP32[(3064)>>2] = (3052);
    HEAP32[(3060)>>2] = (3052);
    HEAP32[(3072)>>2] = (3060);
    HEAP32[(3068)>>2] = (3060);
    HEAP32[(3080)>>2] = (3068);
    HEAP32[(3076)>>2] = (3068);
    HEAP32[(3088)>>2] = (3076);
    HEAP32[(3084)>>2] = (3076);
    HEAP32[(3096)>>2] = (3084);
    HEAP32[(3092)>>2] = (3084);
    HEAP32[(3104)>>2] = (3092);
    HEAP32[(3100)>>2] = (3092);
    HEAP32[(3112)>>2] = (3100);
    HEAP32[(3108)>>2] = (3100);
    HEAP32[(3120)>>2] = (3108);
    HEAP32[(3116)>>2] = (3108);
    HEAP32[(3128)>>2] = (3116);
    HEAP32[(3124)>>2] = (3116);
    HEAP32[(3136)>>2] = (3124);
    HEAP32[(3132)>>2] = (3124);
    HEAP32[(3144)>>2] = (3132);
    HEAP32[(3140)>>2] = (3132);
    HEAP32[(3152)>>2] = (3140);
    HEAP32[(3148)>>2] = (3140);
    HEAP32[(3160)>>2] = (3148);
    HEAP32[(3156)>>2] = (3148);
    HEAP32[(3168)>>2] = (3156);
    HEAP32[(3164)>>2] = (3156);
    HEAP32[(3176)>>2] = (3164);
    HEAP32[(3172)>>2] = (3164);
    HEAP32[(3184)>>2] = (3172);
    HEAP32[(3180)>>2] = (3172);
    HEAP32[(3192)>>2] = (3180);
    HEAP32[(3188)>>2] = (3180);
    HEAP32[(3200)>>2] = (3188);
    HEAP32[(3196)>>2] = (3188);
    HEAP32[(3208)>>2] = (3196);
    HEAP32[(3204)>>2] = (3196);
    HEAP32[(3216)>>2] = (3204);
    HEAP32[(3212)>>2] = (3204);
    HEAP32[(3224)>>2] = (3212);
    HEAP32[(3220)>>2] = (3212);
    HEAP32[(3232)>>2] = (3220);
    HEAP32[(3228)>>2] = (3220);
    HEAP32[(3240)>>2] = (3228);
    HEAP32[(3236)>>2] = (3228);
    HEAP32[(3248)>>2] = (3236);
    HEAP32[(3244)>>2] = (3236);
    HEAP32[(3256)>>2] = (3244);
    HEAP32[(3252)>>2] = (3244);
    HEAP32[(3264)>>2] = (3252);
    HEAP32[(3260)>>2] = (3252);
    HEAP32[(3272)>>2] = (3260);
    HEAP32[(3268)>>2] = (3260);
    HEAP32[(3280)>>2] = (3268);
    HEAP32[(3276)>>2] = (3268);
    HEAP32[(3288)>>2] = (3276);
    HEAP32[(3284)>>2] = (3276);
    HEAP32[(3296)>>2] = (3284);
    HEAP32[(3292)>>2] = (3284);
    HEAP32[(3304)>>2] = (3292);
    HEAP32[(3300)>>2] = (3292);
    HEAP32[(3312)>>2] = (3300);
    HEAP32[(3308)>>2] = (3300);
    $642 = (($$723947$i) + -40)|0;
    $643 = ((($$748$i)) + 8|0);
    $644 = $643;
    $645 = $644 & 7;
    $646 = ($645|0)==(0);
    $647 = (0 - ($644))|0;
    $648 = $647 & 7;
    $649 = $646 ? 0 : $648;
    $650 = (($$748$i) + ($649)|0);
    $651 = (($642) - ($649))|0;
    HEAP32[(3036)>>2] = $650;
    HEAP32[(3024)>>2] = $651;
    $652 = $651 | 1;
    $653 = ((($650)) + 4|0);
    HEAP32[$653>>2] = $652;
    $654 = (($$748$i) + ($642)|0);
    $655 = ((($654)) + 4|0);
    HEAP32[$655>>2] = 40;
    $656 = HEAP32[(3500)>>2]|0;
    HEAP32[(3040)>>2] = $656;
   } else {
    $$024367$i = (3460);
    while(1) {
     $657 = HEAP32[$$024367$i>>2]|0;
     $658 = ((($$024367$i)) + 4|0);
     $659 = HEAP32[$658>>2]|0;
     $660 = (($657) + ($659)|0);
     $661 = ($$748$i|0)==($660|0);
     if ($661) {
      label = 188;
      break;
     }
     $662 = ((($$024367$i)) + 8|0);
     $663 = HEAP32[$662>>2]|0;
     $664 = ($663|0)==(0|0);
     if ($664) {
      break;
     } else {
      $$024367$i = $663;
     }
    }
    if ((label|0) == 188) {
     $665 = ((($$024367$i)) + 12|0);
     $666 = HEAP32[$665>>2]|0;
     $667 = $666 & 8;
     $668 = ($667|0)==(0);
     if ($668) {
      $669 = ($657>>>0)<=($636>>>0);
      $670 = ($$748$i>>>0)>($636>>>0);
      $or$cond50$i = $670 & $669;
      if ($or$cond50$i) {
       $671 = (($659) + ($$723947$i))|0;
       HEAP32[$658>>2] = $671;
       $672 = HEAP32[(3024)>>2]|0;
       $673 = (($672) + ($$723947$i))|0;
       $674 = ((($636)) + 8|0);
       $675 = $674;
       $676 = $675 & 7;
       $677 = ($676|0)==(0);
       $678 = (0 - ($675))|0;
       $679 = $678 & 7;
       $680 = $677 ? 0 : $679;
       $681 = (($636) + ($680)|0);
       $682 = (($673) - ($680))|0;
       HEAP32[(3036)>>2] = $681;
       HEAP32[(3024)>>2] = $682;
       $683 = $682 | 1;
       $684 = ((($681)) + 4|0);
       HEAP32[$684>>2] = $683;
       $685 = (($636) + ($673)|0);
       $686 = ((($685)) + 4|0);
       HEAP32[$686>>2] = 40;
       $687 = HEAP32[(3500)>>2]|0;
       HEAP32[(3040)>>2] = $687;
       break;
      }
     }
    }
    $688 = HEAP32[(3028)>>2]|0;
    $689 = ($$748$i>>>0)<($688>>>0);
    if ($689) {
     HEAP32[(3028)>>2] = $$748$i;
     $753 = $$748$i;
    } else {
     $753 = $688;
    }
    $690 = (($$748$i) + ($$723947$i)|0);
    $$124466$i = (3460);
    while(1) {
     $691 = HEAP32[$$124466$i>>2]|0;
     $692 = ($691|0)==($690|0);
     if ($692) {
      label = 196;
      break;
     }
     $693 = ((($$124466$i)) + 8|0);
     $694 = HEAP32[$693>>2]|0;
     $695 = ($694|0)==(0|0);
     if ($695) {
      $$0$i$i$i = (3460);
      break;
     } else {
      $$124466$i = $694;
     }
    }
    if ((label|0) == 196) {
     $696 = ((($$124466$i)) + 12|0);
     $697 = HEAP32[$696>>2]|0;
     $698 = $697 & 8;
     $699 = ($698|0)==(0);
     if ($699) {
      HEAP32[$$124466$i>>2] = $$748$i;
      $700 = ((($$124466$i)) + 4|0);
      $701 = HEAP32[$700>>2]|0;
      $702 = (($701) + ($$723947$i))|0;
      HEAP32[$700>>2] = $702;
      $703 = ((($$748$i)) + 8|0);
      $704 = $703;
      $705 = $704 & 7;
      $706 = ($705|0)==(0);
      $707 = (0 - ($704))|0;
      $708 = $707 & 7;
      $709 = $706 ? 0 : $708;
      $710 = (($$748$i) + ($709)|0);
      $711 = ((($690)) + 8|0);
      $712 = $711;
      $713 = $712 & 7;
      $714 = ($713|0)==(0);
      $715 = (0 - ($712))|0;
      $716 = $715 & 7;
      $717 = $714 ? 0 : $716;
      $718 = (($690) + ($717)|0);
      $719 = $718;
      $720 = $710;
      $721 = (($719) - ($720))|0;
      $722 = (($710) + ($$0197)|0);
      $723 = (($721) - ($$0197))|0;
      $724 = $$0197 | 3;
      $725 = ((($710)) + 4|0);
      HEAP32[$725>>2] = $724;
      $726 = ($636|0)==($718|0);
      do {
       if ($726) {
        $727 = HEAP32[(3024)>>2]|0;
        $728 = (($727) + ($723))|0;
        HEAP32[(3024)>>2] = $728;
        HEAP32[(3036)>>2] = $722;
        $729 = $728 | 1;
        $730 = ((($722)) + 4|0);
        HEAP32[$730>>2] = $729;
       } else {
        $731 = HEAP32[(3032)>>2]|0;
        $732 = ($731|0)==($718|0);
        if ($732) {
         $733 = HEAP32[(3020)>>2]|0;
         $734 = (($733) + ($723))|0;
         HEAP32[(3020)>>2] = $734;
         HEAP32[(3032)>>2] = $722;
         $735 = $734 | 1;
         $736 = ((($722)) + 4|0);
         HEAP32[$736>>2] = $735;
         $737 = (($722) + ($734)|0);
         HEAP32[$737>>2] = $734;
         break;
        }
        $738 = ((($718)) + 4|0);
        $739 = HEAP32[$738>>2]|0;
        $740 = $739 & 3;
        $741 = ($740|0)==(1);
        if ($741) {
         $742 = $739 & -8;
         $743 = $739 >>> 3;
         $744 = ($739>>>0)<(256);
         L311: do {
          if ($744) {
           $745 = ((($718)) + 8|0);
           $746 = HEAP32[$745>>2]|0;
           $747 = ((($718)) + 12|0);
           $748 = HEAP32[$747>>2]|0;
           $749 = $743 << 1;
           $750 = (3052 + ($749<<2)|0);
           $751 = ($746|0)==($750|0);
           do {
            if (!($751)) {
             $752 = ($753>>>0)>($746>>>0);
             if ($752) {
              _abort();
              // unreachable;
             }
             $754 = ((($746)) + 12|0);
             $755 = HEAP32[$754>>2]|0;
             $756 = ($755|0)==($718|0);
             if ($756) {
              break;
             }
             _abort();
             // unreachable;
            }
           } while(0);
           $757 = ($748|0)==($746|0);
           if ($757) {
            $758 = 1 << $743;
            $759 = $758 ^ -1;
            $760 = HEAP32[753]|0;
            $761 = $760 & $759;
            HEAP32[753] = $761;
            break;
           }
           $762 = ($748|0)==($750|0);
           do {
            if ($762) {
             $$pre10$i$i = ((($748)) + 8|0);
             $$pre$phi11$i$iZ2D = $$pre10$i$i;
            } else {
             $763 = ($753>>>0)>($748>>>0);
             if ($763) {
              _abort();
              // unreachable;
             }
             $764 = ((($748)) + 8|0);
             $765 = HEAP32[$764>>2]|0;
             $766 = ($765|0)==($718|0);
             if ($766) {
              $$pre$phi11$i$iZ2D = $764;
              break;
             }
             _abort();
             // unreachable;
            }
           } while(0);
           $767 = ((($746)) + 12|0);
           HEAP32[$767>>2] = $748;
           HEAP32[$$pre$phi11$i$iZ2D>>2] = $746;
          } else {
           $768 = ((($718)) + 24|0);
           $769 = HEAP32[$768>>2]|0;
           $770 = ((($718)) + 12|0);
           $771 = HEAP32[$770>>2]|0;
           $772 = ($771|0)==($718|0);
           do {
            if ($772) {
             $782 = ((($718)) + 16|0);
             $783 = ((($782)) + 4|0);
             $784 = HEAP32[$783>>2]|0;
             $785 = ($784|0)==(0|0);
             if ($785) {
              $786 = HEAP32[$782>>2]|0;
              $787 = ($786|0)==(0|0);
              if ($787) {
               $$3$i$i = 0;
               break;
              } else {
               $$1291$i$i = $786;$$1293$i$i = $782;
              }
             } else {
              $$1291$i$i = $784;$$1293$i$i = $783;
             }
             while(1) {
              $788 = ((($$1291$i$i)) + 20|0);
              $789 = HEAP32[$788>>2]|0;
              $790 = ($789|0)==(0|0);
              if (!($790)) {
               $$1291$i$i = $789;$$1293$i$i = $788;
               continue;
              }
              $791 = ((($$1291$i$i)) + 16|0);
              $792 = HEAP32[$791>>2]|0;
              $793 = ($792|0)==(0|0);
              if ($793) {
               break;
              } else {
               $$1291$i$i = $792;$$1293$i$i = $791;
              }
             }
             $794 = ($753>>>0)>($$1293$i$i>>>0);
             if ($794) {
              _abort();
              // unreachable;
             } else {
              HEAP32[$$1293$i$i>>2] = 0;
              $$3$i$i = $$1291$i$i;
              break;
             }
            } else {
             $773 = ((($718)) + 8|0);
             $774 = HEAP32[$773>>2]|0;
             $775 = ($753>>>0)>($774>>>0);
             if ($775) {
              _abort();
              // unreachable;
             }
             $776 = ((($774)) + 12|0);
             $777 = HEAP32[$776>>2]|0;
             $778 = ($777|0)==($718|0);
             if (!($778)) {
              _abort();
              // unreachable;
             }
             $779 = ((($771)) + 8|0);
             $780 = HEAP32[$779>>2]|0;
             $781 = ($780|0)==($718|0);
             if ($781) {
              HEAP32[$776>>2] = $771;
              HEAP32[$779>>2] = $774;
              $$3$i$i = $771;
              break;
             } else {
              _abort();
              // unreachable;
             }
            }
           } while(0);
           $795 = ($769|0)==(0|0);
           if ($795) {
            break;
           }
           $796 = ((($718)) + 28|0);
           $797 = HEAP32[$796>>2]|0;
           $798 = (3316 + ($797<<2)|0);
           $799 = HEAP32[$798>>2]|0;
           $800 = ($799|0)==($718|0);
           do {
            if ($800) {
             HEAP32[$798>>2] = $$3$i$i;
             $cond$i$i = ($$3$i$i|0)==(0|0);
             if (!($cond$i$i)) {
              break;
             }
             $801 = 1 << $797;
             $802 = $801 ^ -1;
             $803 = HEAP32[(3016)>>2]|0;
             $804 = $803 & $802;
             HEAP32[(3016)>>2] = $804;
             break L311;
            } else {
             $805 = HEAP32[(3028)>>2]|0;
             $806 = ($805>>>0)>($769>>>0);
             if ($806) {
              _abort();
              // unreachable;
             } else {
              $807 = ((($769)) + 16|0);
              $808 = HEAP32[$807>>2]|0;
              $809 = ($808|0)!=($718|0);
              $$sink1$i$i = $809&1;
              $810 = (((($769)) + 16|0) + ($$sink1$i$i<<2)|0);
              HEAP32[$810>>2] = $$3$i$i;
              $811 = ($$3$i$i|0)==(0|0);
              if ($811) {
               break L311;
              } else {
               break;
              }
             }
            }
           } while(0);
           $812 = HEAP32[(3028)>>2]|0;
           $813 = ($812>>>0)>($$3$i$i>>>0);
           if ($813) {
            _abort();
            // unreachable;
           }
           $814 = ((($$3$i$i)) + 24|0);
           HEAP32[$814>>2] = $769;
           $815 = ((($718)) + 16|0);
           $816 = HEAP32[$815>>2]|0;
           $817 = ($816|0)==(0|0);
           do {
            if (!($817)) {
             $818 = ($812>>>0)>($816>>>0);
             if ($818) {
              _abort();
              // unreachable;
             } else {
              $819 = ((($$3$i$i)) + 16|0);
              HEAP32[$819>>2] = $816;
              $820 = ((($816)) + 24|0);
              HEAP32[$820>>2] = $$3$i$i;
              break;
             }
            }
           } while(0);
           $821 = ((($815)) + 4|0);
           $822 = HEAP32[$821>>2]|0;
           $823 = ($822|0)==(0|0);
           if ($823) {
            break;
           }
           $824 = HEAP32[(3028)>>2]|0;
           $825 = ($824>>>0)>($822>>>0);
           if ($825) {
            _abort();
            // unreachable;
           } else {
            $826 = ((($$3$i$i)) + 20|0);
            HEAP32[$826>>2] = $822;
            $827 = ((($822)) + 24|0);
            HEAP32[$827>>2] = $$3$i$i;
            break;
           }
          }
         } while(0);
         $828 = (($718) + ($742)|0);
         $829 = (($742) + ($723))|0;
         $$0$i17$i = $828;$$0287$i$i = $829;
        } else {
         $$0$i17$i = $718;$$0287$i$i = $723;
        }
        $830 = ((($$0$i17$i)) + 4|0);
        $831 = HEAP32[$830>>2]|0;
        $832 = $831 & -2;
        HEAP32[$830>>2] = $832;
        $833 = $$0287$i$i | 1;
        $834 = ((($722)) + 4|0);
        HEAP32[$834>>2] = $833;
        $835 = (($722) + ($$0287$i$i)|0);
        HEAP32[$835>>2] = $$0287$i$i;
        $836 = $$0287$i$i >>> 3;
        $837 = ($$0287$i$i>>>0)<(256);
        if ($837) {
         $838 = $836 << 1;
         $839 = (3052 + ($838<<2)|0);
         $840 = HEAP32[753]|0;
         $841 = 1 << $836;
         $842 = $840 & $841;
         $843 = ($842|0)==(0);
         do {
          if ($843) {
           $844 = $840 | $841;
           HEAP32[753] = $844;
           $$pre$i18$i = ((($839)) + 8|0);
           $$0295$i$i = $839;$$pre$phi$i19$iZ2D = $$pre$i18$i;
          } else {
           $845 = ((($839)) + 8|0);
           $846 = HEAP32[$845>>2]|0;
           $847 = HEAP32[(3028)>>2]|0;
           $848 = ($847>>>0)>($846>>>0);
           if (!($848)) {
            $$0295$i$i = $846;$$pre$phi$i19$iZ2D = $845;
            break;
           }
           _abort();
           // unreachable;
          }
         } while(0);
         HEAP32[$$pre$phi$i19$iZ2D>>2] = $722;
         $849 = ((($$0295$i$i)) + 12|0);
         HEAP32[$849>>2] = $722;
         $850 = ((($722)) + 8|0);
         HEAP32[$850>>2] = $$0295$i$i;
         $851 = ((($722)) + 12|0);
         HEAP32[$851>>2] = $839;
         break;
        }
        $852 = $$0287$i$i >>> 8;
        $853 = ($852|0)==(0);
        do {
         if ($853) {
          $$0296$i$i = 0;
         } else {
          $854 = ($$0287$i$i>>>0)>(16777215);
          if ($854) {
           $$0296$i$i = 31;
           break;
          }
          $855 = (($852) + 1048320)|0;
          $856 = $855 >>> 16;
          $857 = $856 & 8;
          $858 = $852 << $857;
          $859 = (($858) + 520192)|0;
          $860 = $859 >>> 16;
          $861 = $860 & 4;
          $862 = $861 | $857;
          $863 = $858 << $861;
          $864 = (($863) + 245760)|0;
          $865 = $864 >>> 16;
          $866 = $865 & 2;
          $867 = $862 | $866;
          $868 = (14 - ($867))|0;
          $869 = $863 << $866;
          $870 = $869 >>> 15;
          $871 = (($868) + ($870))|0;
          $872 = $871 << 1;
          $873 = (($871) + 7)|0;
          $874 = $$0287$i$i >>> $873;
          $875 = $874 & 1;
          $876 = $875 | $872;
          $$0296$i$i = $876;
         }
        } while(0);
        $877 = (3316 + ($$0296$i$i<<2)|0);
        $878 = ((($722)) + 28|0);
        HEAP32[$878>>2] = $$0296$i$i;
        $879 = ((($722)) + 16|0);
        $880 = ((($879)) + 4|0);
        HEAP32[$880>>2] = 0;
        HEAP32[$879>>2] = 0;
        $881 = HEAP32[(3016)>>2]|0;
        $882 = 1 << $$0296$i$i;
        $883 = $881 & $882;
        $884 = ($883|0)==(0);
        if ($884) {
         $885 = $881 | $882;
         HEAP32[(3016)>>2] = $885;
         HEAP32[$877>>2] = $722;
         $886 = ((($722)) + 24|0);
         HEAP32[$886>>2] = $877;
         $887 = ((($722)) + 12|0);
         HEAP32[$887>>2] = $722;
         $888 = ((($722)) + 8|0);
         HEAP32[$888>>2] = $722;
         break;
        }
        $889 = HEAP32[$877>>2]|0;
        $890 = ($$0296$i$i|0)==(31);
        $891 = $$0296$i$i >>> 1;
        $892 = (25 - ($891))|0;
        $893 = $890 ? 0 : $892;
        $894 = $$0287$i$i << $893;
        $$0288$i$i = $894;$$0289$i$i = $889;
        while(1) {
         $895 = ((($$0289$i$i)) + 4|0);
         $896 = HEAP32[$895>>2]|0;
         $897 = $896 & -8;
         $898 = ($897|0)==($$0287$i$i|0);
         if ($898) {
          label = 263;
          break;
         }
         $899 = $$0288$i$i >>> 31;
         $900 = (((($$0289$i$i)) + 16|0) + ($899<<2)|0);
         $901 = $$0288$i$i << 1;
         $902 = HEAP32[$900>>2]|0;
         $903 = ($902|0)==(0|0);
         if ($903) {
          label = 260;
          break;
         } else {
          $$0288$i$i = $901;$$0289$i$i = $902;
         }
        }
        if ((label|0) == 260) {
         $904 = HEAP32[(3028)>>2]|0;
         $905 = ($904>>>0)>($900>>>0);
         if ($905) {
          _abort();
          // unreachable;
         } else {
          HEAP32[$900>>2] = $722;
          $906 = ((($722)) + 24|0);
          HEAP32[$906>>2] = $$0289$i$i;
          $907 = ((($722)) + 12|0);
          HEAP32[$907>>2] = $722;
          $908 = ((($722)) + 8|0);
          HEAP32[$908>>2] = $722;
          break;
         }
        }
        else if ((label|0) == 263) {
         $909 = ((($$0289$i$i)) + 8|0);
         $910 = HEAP32[$909>>2]|0;
         $911 = HEAP32[(3028)>>2]|0;
         $912 = ($911>>>0)<=($$0289$i$i>>>0);
         $913 = ($911>>>0)<=($910>>>0);
         $914 = $913 & $912;
         if ($914) {
          $915 = ((($910)) + 12|0);
          HEAP32[$915>>2] = $722;
          HEAP32[$909>>2] = $722;
          $916 = ((($722)) + 8|0);
          HEAP32[$916>>2] = $910;
          $917 = ((($722)) + 12|0);
          HEAP32[$917>>2] = $$0289$i$i;
          $918 = ((($722)) + 24|0);
          HEAP32[$918>>2] = 0;
          break;
         } else {
          _abort();
          // unreachable;
         }
        }
       }
      } while(0);
      $1051 = ((($710)) + 8|0);
      $$0 = $1051;
      STACKTOP = sp;return ($$0|0);
     } else {
      $$0$i$i$i = (3460);
     }
    }
    while(1) {
     $919 = HEAP32[$$0$i$i$i>>2]|0;
     $920 = ($919>>>0)>($636>>>0);
     if (!($920)) {
      $921 = ((($$0$i$i$i)) + 4|0);
      $922 = HEAP32[$921>>2]|0;
      $923 = (($919) + ($922)|0);
      $924 = ($923>>>0)>($636>>>0);
      if ($924) {
       break;
      }
     }
     $925 = ((($$0$i$i$i)) + 8|0);
     $926 = HEAP32[$925>>2]|0;
     $$0$i$i$i = $926;
    }
    $927 = ((($923)) + -47|0);
    $928 = ((($927)) + 8|0);
    $929 = $928;
    $930 = $929 & 7;
    $931 = ($930|0)==(0);
    $932 = (0 - ($929))|0;
    $933 = $932 & 7;
    $934 = $931 ? 0 : $933;
    $935 = (($927) + ($934)|0);
    $936 = ((($636)) + 16|0);
    $937 = ($935>>>0)<($936>>>0);
    $938 = $937 ? $636 : $935;
    $939 = ((($938)) + 8|0);
    $940 = ((($938)) + 24|0);
    $941 = (($$723947$i) + -40)|0;
    $942 = ((($$748$i)) + 8|0);
    $943 = $942;
    $944 = $943 & 7;
    $945 = ($944|0)==(0);
    $946 = (0 - ($943))|0;
    $947 = $946 & 7;
    $948 = $945 ? 0 : $947;
    $949 = (($$748$i) + ($948)|0);
    $950 = (($941) - ($948))|0;
    HEAP32[(3036)>>2] = $949;
    HEAP32[(3024)>>2] = $950;
    $951 = $950 | 1;
    $952 = ((($949)) + 4|0);
    HEAP32[$952>>2] = $951;
    $953 = (($$748$i) + ($941)|0);
    $954 = ((($953)) + 4|0);
    HEAP32[$954>>2] = 40;
    $955 = HEAP32[(3500)>>2]|0;
    HEAP32[(3040)>>2] = $955;
    $956 = ((($938)) + 4|0);
    HEAP32[$956>>2] = 27;
    ;HEAP32[$939>>2]=HEAP32[(3460)>>2]|0;HEAP32[$939+4>>2]=HEAP32[(3460)+4>>2]|0;HEAP32[$939+8>>2]=HEAP32[(3460)+8>>2]|0;HEAP32[$939+12>>2]=HEAP32[(3460)+12>>2]|0;
    HEAP32[(3460)>>2] = $$748$i;
    HEAP32[(3464)>>2] = $$723947$i;
    HEAP32[(3472)>>2] = 0;
    HEAP32[(3468)>>2] = $939;
    $958 = $940;
    while(1) {
     $957 = ((($958)) + 4|0);
     HEAP32[$957>>2] = 7;
     $959 = ((($958)) + 8|0);
     $960 = ($959>>>0)<($923>>>0);
     if ($960) {
      $958 = $957;
     } else {
      break;
     }
    }
    $961 = ($938|0)==($636|0);
    if (!($961)) {
     $962 = $938;
     $963 = $636;
     $964 = (($962) - ($963))|0;
     $965 = HEAP32[$956>>2]|0;
     $966 = $965 & -2;
     HEAP32[$956>>2] = $966;
     $967 = $964 | 1;
     $968 = ((($636)) + 4|0);
     HEAP32[$968>>2] = $967;
     HEAP32[$938>>2] = $964;
     $969 = $964 >>> 3;
     $970 = ($964>>>0)<(256);
     if ($970) {
      $971 = $969 << 1;
      $972 = (3052 + ($971<<2)|0);
      $973 = HEAP32[753]|0;
      $974 = 1 << $969;
      $975 = $973 & $974;
      $976 = ($975|0)==(0);
      if ($976) {
       $977 = $973 | $974;
       HEAP32[753] = $977;
       $$pre$i$i = ((($972)) + 8|0);
       $$0211$i$i = $972;$$pre$phi$i$iZ2D = $$pre$i$i;
      } else {
       $978 = ((($972)) + 8|0);
       $979 = HEAP32[$978>>2]|0;
       $980 = HEAP32[(3028)>>2]|0;
       $981 = ($980>>>0)>($979>>>0);
       if ($981) {
        _abort();
        // unreachable;
       } else {
        $$0211$i$i = $979;$$pre$phi$i$iZ2D = $978;
       }
      }
      HEAP32[$$pre$phi$i$iZ2D>>2] = $636;
      $982 = ((($$0211$i$i)) + 12|0);
      HEAP32[$982>>2] = $636;
      $983 = ((($636)) + 8|0);
      HEAP32[$983>>2] = $$0211$i$i;
      $984 = ((($636)) + 12|0);
      HEAP32[$984>>2] = $972;
      break;
     }
     $985 = $964 >>> 8;
     $986 = ($985|0)==(0);
     if ($986) {
      $$0212$i$i = 0;
     } else {
      $987 = ($964>>>0)>(16777215);
      if ($987) {
       $$0212$i$i = 31;
      } else {
       $988 = (($985) + 1048320)|0;
       $989 = $988 >>> 16;
       $990 = $989 & 8;
       $991 = $985 << $990;
       $992 = (($991) + 520192)|0;
       $993 = $992 >>> 16;
       $994 = $993 & 4;
       $995 = $994 | $990;
       $996 = $991 << $994;
       $997 = (($996) + 245760)|0;
       $998 = $997 >>> 16;
       $999 = $998 & 2;
       $1000 = $995 | $999;
       $1001 = (14 - ($1000))|0;
       $1002 = $996 << $999;
       $1003 = $1002 >>> 15;
       $1004 = (($1001) + ($1003))|0;
       $1005 = $1004 << 1;
       $1006 = (($1004) + 7)|0;
       $1007 = $964 >>> $1006;
       $1008 = $1007 & 1;
       $1009 = $1008 | $1005;
       $$0212$i$i = $1009;
      }
     }
     $1010 = (3316 + ($$0212$i$i<<2)|0);
     $1011 = ((($636)) + 28|0);
     HEAP32[$1011>>2] = $$0212$i$i;
     $1012 = ((($636)) + 20|0);
     HEAP32[$1012>>2] = 0;
     HEAP32[$936>>2] = 0;
     $1013 = HEAP32[(3016)>>2]|0;
     $1014 = 1 << $$0212$i$i;
     $1015 = $1013 & $1014;
     $1016 = ($1015|0)==(0);
     if ($1016) {
      $1017 = $1013 | $1014;
      HEAP32[(3016)>>2] = $1017;
      HEAP32[$1010>>2] = $636;
      $1018 = ((($636)) + 24|0);
      HEAP32[$1018>>2] = $1010;
      $1019 = ((($636)) + 12|0);
      HEAP32[$1019>>2] = $636;
      $1020 = ((($636)) + 8|0);
      HEAP32[$1020>>2] = $636;
      break;
     }
     $1021 = HEAP32[$1010>>2]|0;
     $1022 = ($$0212$i$i|0)==(31);
     $1023 = $$0212$i$i >>> 1;
     $1024 = (25 - ($1023))|0;
     $1025 = $1022 ? 0 : $1024;
     $1026 = $964 << $1025;
     $$0206$i$i = $1026;$$0207$i$i = $1021;
     while(1) {
      $1027 = ((($$0207$i$i)) + 4|0);
      $1028 = HEAP32[$1027>>2]|0;
      $1029 = $1028 & -8;
      $1030 = ($1029|0)==($964|0);
      if ($1030) {
       label = 289;
       break;
      }
      $1031 = $$0206$i$i >>> 31;
      $1032 = (((($$0207$i$i)) + 16|0) + ($1031<<2)|0);
      $1033 = $$0206$i$i << 1;
      $1034 = HEAP32[$1032>>2]|0;
      $1035 = ($1034|0)==(0|0);
      if ($1035) {
       label = 286;
       break;
      } else {
       $$0206$i$i = $1033;$$0207$i$i = $1034;
      }
     }
     if ((label|0) == 286) {
      $1036 = HEAP32[(3028)>>2]|0;
      $1037 = ($1036>>>0)>($1032>>>0);
      if ($1037) {
       _abort();
       // unreachable;
      } else {
       HEAP32[$1032>>2] = $636;
       $1038 = ((($636)) + 24|0);
       HEAP32[$1038>>2] = $$0207$i$i;
       $1039 = ((($636)) + 12|0);
       HEAP32[$1039>>2] = $636;
       $1040 = ((($636)) + 8|0);
       HEAP32[$1040>>2] = $636;
       break;
      }
     }
     else if ((label|0) == 289) {
      $1041 = ((($$0207$i$i)) + 8|0);
      $1042 = HEAP32[$1041>>2]|0;
      $1043 = HEAP32[(3028)>>2]|0;
      $1044 = ($1043>>>0)<=($$0207$i$i>>>0);
      $1045 = ($1043>>>0)<=($1042>>>0);
      $1046 = $1045 & $1044;
      if ($1046) {
       $1047 = ((($1042)) + 12|0);
       HEAP32[$1047>>2] = $636;
       HEAP32[$1041>>2] = $636;
       $1048 = ((($636)) + 8|0);
       HEAP32[$1048>>2] = $1042;
       $1049 = ((($636)) + 12|0);
       HEAP32[$1049>>2] = $$0207$i$i;
       $1050 = ((($636)) + 24|0);
       HEAP32[$1050>>2] = 0;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    }
   }
  } while(0);
  $1052 = HEAP32[(3024)>>2]|0;
  $1053 = ($1052>>>0)>($$0197>>>0);
  if ($1053) {
   $1054 = (($1052) - ($$0197))|0;
   HEAP32[(3024)>>2] = $1054;
   $1055 = HEAP32[(3036)>>2]|0;
   $1056 = (($1055) + ($$0197)|0);
   HEAP32[(3036)>>2] = $1056;
   $1057 = $1054 | 1;
   $1058 = ((($1056)) + 4|0);
   HEAP32[$1058>>2] = $1057;
   $1059 = $$0197 | 3;
   $1060 = ((($1055)) + 4|0);
   HEAP32[$1060>>2] = $1059;
   $1061 = ((($1055)) + 8|0);
   $$0 = $1061;
   STACKTOP = sp;return ($$0|0);
  }
 }
 $1062 = (___errno_location()|0);
 HEAP32[$1062>>2] = 12;
 $$0 = 0;
 STACKTOP = sp;return ($$0|0);
}
function _free($0) {
 $0 = $0|0;
 var $$0212$i = 0, $$0212$in$i = 0, $$0383 = 0, $$0384 = 0, $$0396 = 0, $$0403 = 0, $$1 = 0, $$1382 = 0, $$1387 = 0, $$1390 = 0, $$1398 = 0, $$1402 = 0, $$2 = 0, $$3 = 0, $$3400 = 0, $$pre = 0, $$pre$phi442Z2D = 0, $$pre$phi444Z2D = 0, $$pre$phiZ2D = 0, $$pre441 = 0;
 var $$pre443 = 0, $$sink3 = 0, $$sink5 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0;
 var $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0;
 var $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0;
 var $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0;
 var $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0;
 var $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0;
 var $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0;
 var $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0;
 var $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0;
 var $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0;
 var $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0;
 var $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0;
 var $312 = 0, $313 = 0, $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0;
 var $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0;
 var $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0;
 var $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0;
 var $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $cond421 = 0, $cond422 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($0|0)==(0|0);
 if ($1) {
  return;
 }
 $2 = ((($0)) + -8|0);
 $3 = HEAP32[(3028)>>2]|0;
 $4 = ($2>>>0)<($3>>>0);
 if ($4) {
  _abort();
  // unreachable;
 }
 $5 = ((($0)) + -4|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = $6 & 3;
 $8 = ($7|0)==(1);
 if ($8) {
  _abort();
  // unreachable;
 }
 $9 = $6 & -8;
 $10 = (($2) + ($9)|0);
 $11 = $6 & 1;
 $12 = ($11|0)==(0);
 L10: do {
  if ($12) {
   $13 = HEAP32[$2>>2]|0;
   $14 = ($7|0)==(0);
   if ($14) {
    return;
   }
   $15 = (0 - ($13))|0;
   $16 = (($2) + ($15)|0);
   $17 = (($13) + ($9))|0;
   $18 = ($16>>>0)<($3>>>0);
   if ($18) {
    _abort();
    // unreachable;
   }
   $19 = HEAP32[(3032)>>2]|0;
   $20 = ($19|0)==($16|0);
   if ($20) {
    $105 = ((($10)) + 4|0);
    $106 = HEAP32[$105>>2]|0;
    $107 = $106 & 3;
    $108 = ($107|0)==(3);
    if (!($108)) {
     $$1 = $16;$$1382 = $17;$114 = $16;
     break;
    }
    HEAP32[(3020)>>2] = $17;
    $109 = $106 & -2;
    HEAP32[$105>>2] = $109;
    $110 = $17 | 1;
    $111 = ((($16)) + 4|0);
    HEAP32[$111>>2] = $110;
    $112 = (($16) + ($17)|0);
    HEAP32[$112>>2] = $17;
    return;
   }
   $21 = $13 >>> 3;
   $22 = ($13>>>0)<(256);
   if ($22) {
    $23 = ((($16)) + 8|0);
    $24 = HEAP32[$23>>2]|0;
    $25 = ((($16)) + 12|0);
    $26 = HEAP32[$25>>2]|0;
    $27 = $21 << 1;
    $28 = (3052 + ($27<<2)|0);
    $29 = ($24|0)==($28|0);
    if (!($29)) {
     $30 = ($3>>>0)>($24>>>0);
     if ($30) {
      _abort();
      // unreachable;
     }
     $31 = ((($24)) + 12|0);
     $32 = HEAP32[$31>>2]|0;
     $33 = ($32|0)==($16|0);
     if (!($33)) {
      _abort();
      // unreachable;
     }
    }
    $34 = ($26|0)==($24|0);
    if ($34) {
     $35 = 1 << $21;
     $36 = $35 ^ -1;
     $37 = HEAP32[753]|0;
     $38 = $37 & $36;
     HEAP32[753] = $38;
     $$1 = $16;$$1382 = $17;$114 = $16;
     break;
    }
    $39 = ($26|0)==($28|0);
    if ($39) {
     $$pre443 = ((($26)) + 8|0);
     $$pre$phi444Z2D = $$pre443;
    } else {
     $40 = ($3>>>0)>($26>>>0);
     if ($40) {
      _abort();
      // unreachable;
     }
     $41 = ((($26)) + 8|0);
     $42 = HEAP32[$41>>2]|0;
     $43 = ($42|0)==($16|0);
     if ($43) {
      $$pre$phi444Z2D = $41;
     } else {
      _abort();
      // unreachable;
     }
    }
    $44 = ((($24)) + 12|0);
    HEAP32[$44>>2] = $26;
    HEAP32[$$pre$phi444Z2D>>2] = $24;
    $$1 = $16;$$1382 = $17;$114 = $16;
    break;
   }
   $45 = ((($16)) + 24|0);
   $46 = HEAP32[$45>>2]|0;
   $47 = ((($16)) + 12|0);
   $48 = HEAP32[$47>>2]|0;
   $49 = ($48|0)==($16|0);
   do {
    if ($49) {
     $59 = ((($16)) + 16|0);
     $60 = ((($59)) + 4|0);
     $61 = HEAP32[$60>>2]|0;
     $62 = ($61|0)==(0|0);
     if ($62) {
      $63 = HEAP32[$59>>2]|0;
      $64 = ($63|0)==(0|0);
      if ($64) {
       $$3 = 0;
       break;
      } else {
       $$1387 = $63;$$1390 = $59;
      }
     } else {
      $$1387 = $61;$$1390 = $60;
     }
     while(1) {
      $65 = ((($$1387)) + 20|0);
      $66 = HEAP32[$65>>2]|0;
      $67 = ($66|0)==(0|0);
      if (!($67)) {
       $$1387 = $66;$$1390 = $65;
       continue;
      }
      $68 = ((($$1387)) + 16|0);
      $69 = HEAP32[$68>>2]|0;
      $70 = ($69|0)==(0|0);
      if ($70) {
       break;
      } else {
       $$1387 = $69;$$1390 = $68;
      }
     }
     $71 = ($3>>>0)>($$1390>>>0);
     if ($71) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$$1390>>2] = 0;
      $$3 = $$1387;
      break;
     }
    } else {
     $50 = ((($16)) + 8|0);
     $51 = HEAP32[$50>>2]|0;
     $52 = ($3>>>0)>($51>>>0);
     if ($52) {
      _abort();
      // unreachable;
     }
     $53 = ((($51)) + 12|0);
     $54 = HEAP32[$53>>2]|0;
     $55 = ($54|0)==($16|0);
     if (!($55)) {
      _abort();
      // unreachable;
     }
     $56 = ((($48)) + 8|0);
     $57 = HEAP32[$56>>2]|0;
     $58 = ($57|0)==($16|0);
     if ($58) {
      HEAP32[$53>>2] = $48;
      HEAP32[$56>>2] = $51;
      $$3 = $48;
      break;
     } else {
      _abort();
      // unreachable;
     }
    }
   } while(0);
   $72 = ($46|0)==(0|0);
   if ($72) {
    $$1 = $16;$$1382 = $17;$114 = $16;
   } else {
    $73 = ((($16)) + 28|0);
    $74 = HEAP32[$73>>2]|0;
    $75 = (3316 + ($74<<2)|0);
    $76 = HEAP32[$75>>2]|0;
    $77 = ($76|0)==($16|0);
    do {
     if ($77) {
      HEAP32[$75>>2] = $$3;
      $cond421 = ($$3|0)==(0|0);
      if ($cond421) {
       $78 = 1 << $74;
       $79 = $78 ^ -1;
       $80 = HEAP32[(3016)>>2]|0;
       $81 = $80 & $79;
       HEAP32[(3016)>>2] = $81;
       $$1 = $16;$$1382 = $17;$114 = $16;
       break L10;
      }
     } else {
      $82 = HEAP32[(3028)>>2]|0;
      $83 = ($82>>>0)>($46>>>0);
      if ($83) {
       _abort();
       // unreachable;
      } else {
       $84 = ((($46)) + 16|0);
       $85 = HEAP32[$84>>2]|0;
       $86 = ($85|0)!=($16|0);
       $$sink3 = $86&1;
       $87 = (((($46)) + 16|0) + ($$sink3<<2)|0);
       HEAP32[$87>>2] = $$3;
       $88 = ($$3|0)==(0|0);
       if ($88) {
        $$1 = $16;$$1382 = $17;$114 = $16;
        break L10;
       } else {
        break;
       }
      }
     }
    } while(0);
    $89 = HEAP32[(3028)>>2]|0;
    $90 = ($89>>>0)>($$3>>>0);
    if ($90) {
     _abort();
     // unreachable;
    }
    $91 = ((($$3)) + 24|0);
    HEAP32[$91>>2] = $46;
    $92 = ((($16)) + 16|0);
    $93 = HEAP32[$92>>2]|0;
    $94 = ($93|0)==(0|0);
    do {
     if (!($94)) {
      $95 = ($89>>>0)>($93>>>0);
      if ($95) {
       _abort();
       // unreachable;
      } else {
       $96 = ((($$3)) + 16|0);
       HEAP32[$96>>2] = $93;
       $97 = ((($93)) + 24|0);
       HEAP32[$97>>2] = $$3;
       break;
      }
     }
    } while(0);
    $98 = ((($92)) + 4|0);
    $99 = HEAP32[$98>>2]|0;
    $100 = ($99|0)==(0|0);
    if ($100) {
     $$1 = $16;$$1382 = $17;$114 = $16;
    } else {
     $101 = HEAP32[(3028)>>2]|0;
     $102 = ($101>>>0)>($99>>>0);
     if ($102) {
      _abort();
      // unreachable;
     } else {
      $103 = ((($$3)) + 20|0);
      HEAP32[$103>>2] = $99;
      $104 = ((($99)) + 24|0);
      HEAP32[$104>>2] = $$3;
      $$1 = $16;$$1382 = $17;$114 = $16;
      break;
     }
    }
   }
  } else {
   $$1 = $2;$$1382 = $9;$114 = $2;
  }
 } while(0);
 $113 = ($114>>>0)<($10>>>0);
 if (!($113)) {
  _abort();
  // unreachable;
 }
 $115 = ((($10)) + 4|0);
 $116 = HEAP32[$115>>2]|0;
 $117 = $116 & 1;
 $118 = ($117|0)==(0);
 if ($118) {
  _abort();
  // unreachable;
 }
 $119 = $116 & 2;
 $120 = ($119|0)==(0);
 if ($120) {
  $121 = HEAP32[(3036)>>2]|0;
  $122 = ($121|0)==($10|0);
  if ($122) {
   $123 = HEAP32[(3024)>>2]|0;
   $124 = (($123) + ($$1382))|0;
   HEAP32[(3024)>>2] = $124;
   HEAP32[(3036)>>2] = $$1;
   $125 = $124 | 1;
   $126 = ((($$1)) + 4|0);
   HEAP32[$126>>2] = $125;
   $127 = HEAP32[(3032)>>2]|0;
   $128 = ($$1|0)==($127|0);
   if (!($128)) {
    return;
   }
   HEAP32[(3032)>>2] = 0;
   HEAP32[(3020)>>2] = 0;
   return;
  }
  $129 = HEAP32[(3032)>>2]|0;
  $130 = ($129|0)==($10|0);
  if ($130) {
   $131 = HEAP32[(3020)>>2]|0;
   $132 = (($131) + ($$1382))|0;
   HEAP32[(3020)>>2] = $132;
   HEAP32[(3032)>>2] = $114;
   $133 = $132 | 1;
   $134 = ((($$1)) + 4|0);
   HEAP32[$134>>2] = $133;
   $135 = (($114) + ($132)|0);
   HEAP32[$135>>2] = $132;
   return;
  }
  $136 = $116 & -8;
  $137 = (($136) + ($$1382))|0;
  $138 = $116 >>> 3;
  $139 = ($116>>>0)<(256);
  L108: do {
   if ($139) {
    $140 = ((($10)) + 8|0);
    $141 = HEAP32[$140>>2]|0;
    $142 = ((($10)) + 12|0);
    $143 = HEAP32[$142>>2]|0;
    $144 = $138 << 1;
    $145 = (3052 + ($144<<2)|0);
    $146 = ($141|0)==($145|0);
    if (!($146)) {
     $147 = HEAP32[(3028)>>2]|0;
     $148 = ($147>>>0)>($141>>>0);
     if ($148) {
      _abort();
      // unreachable;
     }
     $149 = ((($141)) + 12|0);
     $150 = HEAP32[$149>>2]|0;
     $151 = ($150|0)==($10|0);
     if (!($151)) {
      _abort();
      // unreachable;
     }
    }
    $152 = ($143|0)==($141|0);
    if ($152) {
     $153 = 1 << $138;
     $154 = $153 ^ -1;
     $155 = HEAP32[753]|0;
     $156 = $155 & $154;
     HEAP32[753] = $156;
     break;
    }
    $157 = ($143|0)==($145|0);
    if ($157) {
     $$pre441 = ((($143)) + 8|0);
     $$pre$phi442Z2D = $$pre441;
    } else {
     $158 = HEAP32[(3028)>>2]|0;
     $159 = ($158>>>0)>($143>>>0);
     if ($159) {
      _abort();
      // unreachable;
     }
     $160 = ((($143)) + 8|0);
     $161 = HEAP32[$160>>2]|0;
     $162 = ($161|0)==($10|0);
     if ($162) {
      $$pre$phi442Z2D = $160;
     } else {
      _abort();
      // unreachable;
     }
    }
    $163 = ((($141)) + 12|0);
    HEAP32[$163>>2] = $143;
    HEAP32[$$pre$phi442Z2D>>2] = $141;
   } else {
    $164 = ((($10)) + 24|0);
    $165 = HEAP32[$164>>2]|0;
    $166 = ((($10)) + 12|0);
    $167 = HEAP32[$166>>2]|0;
    $168 = ($167|0)==($10|0);
    do {
     if ($168) {
      $179 = ((($10)) + 16|0);
      $180 = ((($179)) + 4|0);
      $181 = HEAP32[$180>>2]|0;
      $182 = ($181|0)==(0|0);
      if ($182) {
       $183 = HEAP32[$179>>2]|0;
       $184 = ($183|0)==(0|0);
       if ($184) {
        $$3400 = 0;
        break;
       } else {
        $$1398 = $183;$$1402 = $179;
       }
      } else {
       $$1398 = $181;$$1402 = $180;
      }
      while(1) {
       $185 = ((($$1398)) + 20|0);
       $186 = HEAP32[$185>>2]|0;
       $187 = ($186|0)==(0|0);
       if (!($187)) {
        $$1398 = $186;$$1402 = $185;
        continue;
       }
       $188 = ((($$1398)) + 16|0);
       $189 = HEAP32[$188>>2]|0;
       $190 = ($189|0)==(0|0);
       if ($190) {
        break;
       } else {
        $$1398 = $189;$$1402 = $188;
       }
      }
      $191 = HEAP32[(3028)>>2]|0;
      $192 = ($191>>>0)>($$1402>>>0);
      if ($192) {
       _abort();
       // unreachable;
      } else {
       HEAP32[$$1402>>2] = 0;
       $$3400 = $$1398;
       break;
      }
     } else {
      $169 = ((($10)) + 8|0);
      $170 = HEAP32[$169>>2]|0;
      $171 = HEAP32[(3028)>>2]|0;
      $172 = ($171>>>0)>($170>>>0);
      if ($172) {
       _abort();
       // unreachable;
      }
      $173 = ((($170)) + 12|0);
      $174 = HEAP32[$173>>2]|0;
      $175 = ($174|0)==($10|0);
      if (!($175)) {
       _abort();
       // unreachable;
      }
      $176 = ((($167)) + 8|0);
      $177 = HEAP32[$176>>2]|0;
      $178 = ($177|0)==($10|0);
      if ($178) {
       HEAP32[$173>>2] = $167;
       HEAP32[$176>>2] = $170;
       $$3400 = $167;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    } while(0);
    $193 = ($165|0)==(0|0);
    if (!($193)) {
     $194 = ((($10)) + 28|0);
     $195 = HEAP32[$194>>2]|0;
     $196 = (3316 + ($195<<2)|0);
     $197 = HEAP32[$196>>2]|0;
     $198 = ($197|0)==($10|0);
     do {
      if ($198) {
       HEAP32[$196>>2] = $$3400;
       $cond422 = ($$3400|0)==(0|0);
       if ($cond422) {
        $199 = 1 << $195;
        $200 = $199 ^ -1;
        $201 = HEAP32[(3016)>>2]|0;
        $202 = $201 & $200;
        HEAP32[(3016)>>2] = $202;
        break L108;
       }
      } else {
       $203 = HEAP32[(3028)>>2]|0;
       $204 = ($203>>>0)>($165>>>0);
       if ($204) {
        _abort();
        // unreachable;
       } else {
        $205 = ((($165)) + 16|0);
        $206 = HEAP32[$205>>2]|0;
        $207 = ($206|0)!=($10|0);
        $$sink5 = $207&1;
        $208 = (((($165)) + 16|0) + ($$sink5<<2)|0);
        HEAP32[$208>>2] = $$3400;
        $209 = ($$3400|0)==(0|0);
        if ($209) {
         break L108;
        } else {
         break;
        }
       }
      }
     } while(0);
     $210 = HEAP32[(3028)>>2]|0;
     $211 = ($210>>>0)>($$3400>>>0);
     if ($211) {
      _abort();
      // unreachable;
     }
     $212 = ((($$3400)) + 24|0);
     HEAP32[$212>>2] = $165;
     $213 = ((($10)) + 16|0);
     $214 = HEAP32[$213>>2]|0;
     $215 = ($214|0)==(0|0);
     do {
      if (!($215)) {
       $216 = ($210>>>0)>($214>>>0);
       if ($216) {
        _abort();
        // unreachable;
       } else {
        $217 = ((($$3400)) + 16|0);
        HEAP32[$217>>2] = $214;
        $218 = ((($214)) + 24|0);
        HEAP32[$218>>2] = $$3400;
        break;
       }
      }
     } while(0);
     $219 = ((($213)) + 4|0);
     $220 = HEAP32[$219>>2]|0;
     $221 = ($220|0)==(0|0);
     if (!($221)) {
      $222 = HEAP32[(3028)>>2]|0;
      $223 = ($222>>>0)>($220>>>0);
      if ($223) {
       _abort();
       // unreachable;
      } else {
       $224 = ((($$3400)) + 20|0);
       HEAP32[$224>>2] = $220;
       $225 = ((($220)) + 24|0);
       HEAP32[$225>>2] = $$3400;
       break;
      }
     }
    }
   }
  } while(0);
  $226 = $137 | 1;
  $227 = ((($$1)) + 4|0);
  HEAP32[$227>>2] = $226;
  $228 = (($114) + ($137)|0);
  HEAP32[$228>>2] = $137;
  $229 = HEAP32[(3032)>>2]|0;
  $230 = ($$1|0)==($229|0);
  if ($230) {
   HEAP32[(3020)>>2] = $137;
   return;
  } else {
   $$2 = $137;
  }
 } else {
  $231 = $116 & -2;
  HEAP32[$115>>2] = $231;
  $232 = $$1382 | 1;
  $233 = ((($$1)) + 4|0);
  HEAP32[$233>>2] = $232;
  $234 = (($114) + ($$1382)|0);
  HEAP32[$234>>2] = $$1382;
  $$2 = $$1382;
 }
 $235 = $$2 >>> 3;
 $236 = ($$2>>>0)<(256);
 if ($236) {
  $237 = $235 << 1;
  $238 = (3052 + ($237<<2)|0);
  $239 = HEAP32[753]|0;
  $240 = 1 << $235;
  $241 = $239 & $240;
  $242 = ($241|0)==(0);
  if ($242) {
   $243 = $239 | $240;
   HEAP32[753] = $243;
   $$pre = ((($238)) + 8|0);
   $$0403 = $238;$$pre$phiZ2D = $$pre;
  } else {
   $244 = ((($238)) + 8|0);
   $245 = HEAP32[$244>>2]|0;
   $246 = HEAP32[(3028)>>2]|0;
   $247 = ($246>>>0)>($245>>>0);
   if ($247) {
    _abort();
    // unreachable;
   } else {
    $$0403 = $245;$$pre$phiZ2D = $244;
   }
  }
  HEAP32[$$pre$phiZ2D>>2] = $$1;
  $248 = ((($$0403)) + 12|0);
  HEAP32[$248>>2] = $$1;
  $249 = ((($$1)) + 8|0);
  HEAP32[$249>>2] = $$0403;
  $250 = ((($$1)) + 12|0);
  HEAP32[$250>>2] = $238;
  return;
 }
 $251 = $$2 >>> 8;
 $252 = ($251|0)==(0);
 if ($252) {
  $$0396 = 0;
 } else {
  $253 = ($$2>>>0)>(16777215);
  if ($253) {
   $$0396 = 31;
  } else {
   $254 = (($251) + 1048320)|0;
   $255 = $254 >>> 16;
   $256 = $255 & 8;
   $257 = $251 << $256;
   $258 = (($257) + 520192)|0;
   $259 = $258 >>> 16;
   $260 = $259 & 4;
   $261 = $260 | $256;
   $262 = $257 << $260;
   $263 = (($262) + 245760)|0;
   $264 = $263 >>> 16;
   $265 = $264 & 2;
   $266 = $261 | $265;
   $267 = (14 - ($266))|0;
   $268 = $262 << $265;
   $269 = $268 >>> 15;
   $270 = (($267) + ($269))|0;
   $271 = $270 << 1;
   $272 = (($270) + 7)|0;
   $273 = $$2 >>> $272;
   $274 = $273 & 1;
   $275 = $274 | $271;
   $$0396 = $275;
  }
 }
 $276 = (3316 + ($$0396<<2)|0);
 $277 = ((($$1)) + 28|0);
 HEAP32[$277>>2] = $$0396;
 $278 = ((($$1)) + 16|0);
 $279 = ((($$1)) + 20|0);
 HEAP32[$279>>2] = 0;
 HEAP32[$278>>2] = 0;
 $280 = HEAP32[(3016)>>2]|0;
 $281 = 1 << $$0396;
 $282 = $280 & $281;
 $283 = ($282|0)==(0);
 do {
  if ($283) {
   $284 = $280 | $281;
   HEAP32[(3016)>>2] = $284;
   HEAP32[$276>>2] = $$1;
   $285 = ((($$1)) + 24|0);
   HEAP32[$285>>2] = $276;
   $286 = ((($$1)) + 12|0);
   HEAP32[$286>>2] = $$1;
   $287 = ((($$1)) + 8|0);
   HEAP32[$287>>2] = $$1;
  } else {
   $288 = HEAP32[$276>>2]|0;
   $289 = ($$0396|0)==(31);
   $290 = $$0396 >>> 1;
   $291 = (25 - ($290))|0;
   $292 = $289 ? 0 : $291;
   $293 = $$2 << $292;
   $$0383 = $293;$$0384 = $288;
   while(1) {
    $294 = ((($$0384)) + 4|0);
    $295 = HEAP32[$294>>2]|0;
    $296 = $295 & -8;
    $297 = ($296|0)==($$2|0);
    if ($297) {
     label = 124;
     break;
    }
    $298 = $$0383 >>> 31;
    $299 = (((($$0384)) + 16|0) + ($298<<2)|0);
    $300 = $$0383 << 1;
    $301 = HEAP32[$299>>2]|0;
    $302 = ($301|0)==(0|0);
    if ($302) {
     label = 121;
     break;
    } else {
     $$0383 = $300;$$0384 = $301;
    }
   }
   if ((label|0) == 121) {
    $303 = HEAP32[(3028)>>2]|0;
    $304 = ($303>>>0)>($299>>>0);
    if ($304) {
     _abort();
     // unreachable;
    } else {
     HEAP32[$299>>2] = $$1;
     $305 = ((($$1)) + 24|0);
     HEAP32[$305>>2] = $$0384;
     $306 = ((($$1)) + 12|0);
     HEAP32[$306>>2] = $$1;
     $307 = ((($$1)) + 8|0);
     HEAP32[$307>>2] = $$1;
     break;
    }
   }
   else if ((label|0) == 124) {
    $308 = ((($$0384)) + 8|0);
    $309 = HEAP32[$308>>2]|0;
    $310 = HEAP32[(3028)>>2]|0;
    $311 = ($310>>>0)<=($$0384>>>0);
    $312 = ($310>>>0)<=($309>>>0);
    $313 = $312 & $311;
    if ($313) {
     $314 = ((($309)) + 12|0);
     HEAP32[$314>>2] = $$1;
     HEAP32[$308>>2] = $$1;
     $315 = ((($$1)) + 8|0);
     HEAP32[$315>>2] = $309;
     $316 = ((($$1)) + 12|0);
     HEAP32[$316>>2] = $$0384;
     $317 = ((($$1)) + 24|0);
     HEAP32[$317>>2] = 0;
     break;
    } else {
     _abort();
     // unreachable;
    }
   }
  }
 } while(0);
 $318 = HEAP32[(3044)>>2]|0;
 $319 = (($318) + -1)|0;
 HEAP32[(3044)>>2] = $319;
 $320 = ($319|0)==(0);
 if ($320) {
  $$0212$in$i = (3468);
 } else {
  return;
 }
 while(1) {
  $$0212$i = HEAP32[$$0212$in$i>>2]|0;
  $321 = ($$0212$i|0)==(0|0);
  $322 = ((($$0212$i)) + 8|0);
  if ($321) {
   break;
  } else {
   $$0212$in$i = $322;
  }
 }
 HEAP32[(3044)>>2] = -1;
 return;
}
function ___stdio_close($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $vararg_buffer = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $vararg_buffer = sp;
 $1 = ((($0)) + 60|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (_dummy($2)|0);
 HEAP32[$vararg_buffer>>2] = $3;
 $4 = (___syscall6(6,($vararg_buffer|0))|0);
 $5 = (___syscall_ret($4)|0);
 STACKTOP = sp;return ($5|0);
}
function ___stdio_write($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0 = 0, $$04756 = 0, $$04855 = 0, $$04954 = 0, $$051 = 0, $$1 = 0, $$150 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0;
 var $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0;
 var $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $vararg_buffer = 0, $vararg_buffer3 = 0, $vararg_ptr1 = 0, $vararg_ptr2 = 0;
 var $vararg_ptr6 = 0, $vararg_ptr7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 48|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(48|0);
 $vararg_buffer3 = sp + 16|0;
 $vararg_buffer = sp;
 $3 = sp + 32|0;
 $4 = ((($0)) + 28|0);
 $5 = HEAP32[$4>>2]|0;
 HEAP32[$3>>2] = $5;
 $6 = ((($3)) + 4|0);
 $7 = ((($0)) + 20|0);
 $8 = HEAP32[$7>>2]|0;
 $9 = (($8) - ($5))|0;
 HEAP32[$6>>2] = $9;
 $10 = ((($3)) + 8|0);
 HEAP32[$10>>2] = $1;
 $11 = ((($3)) + 12|0);
 HEAP32[$11>>2] = $2;
 $12 = (($9) + ($2))|0;
 $13 = ((($0)) + 60|0);
 $14 = HEAP32[$13>>2]|0;
 $15 = $3;
 HEAP32[$vararg_buffer>>2] = $14;
 $vararg_ptr1 = ((($vararg_buffer)) + 4|0);
 HEAP32[$vararg_ptr1>>2] = $15;
 $vararg_ptr2 = ((($vararg_buffer)) + 8|0);
 HEAP32[$vararg_ptr2>>2] = 2;
 $16 = (___syscall146(146,($vararg_buffer|0))|0);
 $17 = (___syscall_ret($16)|0);
 $18 = ($12|0)==($17|0);
 L1: do {
  if ($18) {
   label = 3;
  } else {
   $$04756 = 2;$$04855 = $12;$$04954 = $3;$27 = $17;
   while(1) {
    $26 = ($27|0)<(0);
    if ($26) {
     break;
    }
    $35 = (($$04855) - ($27))|0;
    $36 = ((($$04954)) + 4|0);
    $37 = HEAP32[$36>>2]|0;
    $38 = ($27>>>0)>($37>>>0);
    $39 = ((($$04954)) + 8|0);
    $$150 = $38 ? $39 : $$04954;
    $40 = $38 << 31 >> 31;
    $$1 = (($$04756) + ($40))|0;
    $41 = $38 ? $37 : 0;
    $$0 = (($27) - ($41))|0;
    $42 = HEAP32[$$150>>2]|0;
    $43 = (($42) + ($$0)|0);
    HEAP32[$$150>>2] = $43;
    $44 = ((($$150)) + 4|0);
    $45 = HEAP32[$44>>2]|0;
    $46 = (($45) - ($$0))|0;
    HEAP32[$44>>2] = $46;
    $47 = HEAP32[$13>>2]|0;
    $48 = $$150;
    HEAP32[$vararg_buffer3>>2] = $47;
    $vararg_ptr6 = ((($vararg_buffer3)) + 4|0);
    HEAP32[$vararg_ptr6>>2] = $48;
    $vararg_ptr7 = ((($vararg_buffer3)) + 8|0);
    HEAP32[$vararg_ptr7>>2] = $$1;
    $49 = (___syscall146(146,($vararg_buffer3|0))|0);
    $50 = (___syscall_ret($49)|0);
    $51 = ($35|0)==($50|0);
    if ($51) {
     label = 3;
     break L1;
    } else {
     $$04756 = $$1;$$04855 = $35;$$04954 = $$150;$27 = $50;
    }
   }
   $28 = ((($0)) + 16|0);
   HEAP32[$28>>2] = 0;
   HEAP32[$4>>2] = 0;
   HEAP32[$7>>2] = 0;
   $29 = HEAP32[$0>>2]|0;
   $30 = $29 | 32;
   HEAP32[$0>>2] = $30;
   $31 = ($$04756|0)==(2);
   if ($31) {
    $$051 = 0;
   } else {
    $32 = ((($$04954)) + 4|0);
    $33 = HEAP32[$32>>2]|0;
    $34 = (($2) - ($33))|0;
    $$051 = $34;
   }
  }
 } while(0);
 if ((label|0) == 3) {
  $19 = ((($0)) + 44|0);
  $20 = HEAP32[$19>>2]|0;
  $21 = ((($0)) + 48|0);
  $22 = HEAP32[$21>>2]|0;
  $23 = (($20) + ($22)|0);
  $24 = ((($0)) + 16|0);
  HEAP32[$24>>2] = $23;
  $25 = $20;
  HEAP32[$4>>2] = $25;
  HEAP32[$7>>2] = $25;
  $$051 = $2;
 }
 STACKTOP = sp;return ($$051|0);
}
function ___stdio_seek($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$pre = 0, $10 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $vararg_buffer = 0, $vararg_ptr1 = 0, $vararg_ptr2 = 0, $vararg_ptr3 = 0, $vararg_ptr4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $vararg_buffer = sp;
 $3 = sp + 20|0;
 $4 = ((($0)) + 60|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = $3;
 HEAP32[$vararg_buffer>>2] = $5;
 $vararg_ptr1 = ((($vararg_buffer)) + 4|0);
 HEAP32[$vararg_ptr1>>2] = 0;
 $vararg_ptr2 = ((($vararg_buffer)) + 8|0);
 HEAP32[$vararg_ptr2>>2] = $1;
 $vararg_ptr3 = ((($vararg_buffer)) + 12|0);
 HEAP32[$vararg_ptr3>>2] = $6;
 $vararg_ptr4 = ((($vararg_buffer)) + 16|0);
 HEAP32[$vararg_ptr4>>2] = $2;
 $7 = (___syscall140(140,($vararg_buffer|0))|0);
 $8 = (___syscall_ret($7)|0);
 $9 = ($8|0)<(0);
 if ($9) {
  HEAP32[$3>>2] = -1;
  $10 = -1;
 } else {
  $$pre = HEAP32[$3>>2]|0;
  $10 = $$pre;
 }
 STACKTOP = sp;return ($10|0);
}
function ___syscall_ret($0) {
 $0 = $0|0;
 var $$0 = 0, $1 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($0>>>0)>(4294963200);
 if ($1) {
  $2 = (0 - ($0))|0;
  $3 = (___errno_location()|0);
  HEAP32[$3>>2] = $2;
  $$0 = -1;
 } else {
  $$0 = $0;
 }
 return ($$0|0);
}
function ___errno_location() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (3572|0);
}
function _dummy($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return ($0|0);
}
function ___stdout_write($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $vararg_buffer = 0, $vararg_ptr1 = 0, $vararg_ptr2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 32|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(32|0);
 $vararg_buffer = sp;
 $3 = sp + 16|0;
 $4 = ((($0)) + 36|0);
 HEAP32[$4>>2] = 5;
 $5 = HEAP32[$0>>2]|0;
 $6 = $5 & 64;
 $7 = ($6|0)==(0);
 if ($7) {
  $8 = ((($0)) + 60|0);
  $9 = HEAP32[$8>>2]|0;
  $10 = $3;
  HEAP32[$vararg_buffer>>2] = $9;
  $vararg_ptr1 = ((($vararg_buffer)) + 4|0);
  HEAP32[$vararg_ptr1>>2] = 21523;
  $vararg_ptr2 = ((($vararg_buffer)) + 8|0);
  HEAP32[$vararg_ptr2>>2] = $10;
  $11 = (___syscall54(54,($vararg_buffer|0))|0);
  $12 = ($11|0)==(0);
  if (!($12)) {
   $13 = ((($0)) + 75|0);
   HEAP8[$13>>0] = -1;
  }
 }
 $14 = (___stdio_write($0,$1,$2)|0);
 STACKTOP = sp;return ($14|0);
}
function _pthread_self() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 return (200|0);
}
function _strcmp($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$011 = 0, $$0710 = 0, $$lcssa = 0, $$lcssa8 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond9 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 $2 = HEAP8[$0>>0]|0;
 $3 = HEAP8[$1>>0]|0;
 $4 = ($2<<24>>24)!=($3<<24>>24);
 $5 = ($2<<24>>24)==(0);
 $or$cond9 = $5 | $4;
 if ($or$cond9) {
  $$lcssa = $3;$$lcssa8 = $2;
 } else {
  $$011 = $1;$$0710 = $0;
  while(1) {
   $6 = ((($$0710)) + 1|0);
   $7 = ((($$011)) + 1|0);
   $8 = HEAP8[$6>>0]|0;
   $9 = HEAP8[$7>>0]|0;
   $10 = ($8<<24>>24)!=($9<<24>>24);
   $11 = ($8<<24>>24)==(0);
   $or$cond = $11 | $10;
   if ($or$cond) {
    $$lcssa = $9;$$lcssa8 = $8;
    break;
   } else {
    $$011 = $7;$$0710 = $6;
   }
  }
 }
 $12 = $$lcssa8&255;
 $13 = $$lcssa&255;
 $14 = (($12) - ($13))|0;
 return ($14|0);
}
function ___unlockfile($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return;
}
function ___lockfile($0) {
 $0 = $0|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 return 0;
}
function ___towrite($0) {
 $0 = $0|0;
 var $$0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0;
 var $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ((($0)) + 74|0);
 $2 = HEAP8[$1>>0]|0;
 $3 = $2 << 24 >> 24;
 $4 = (($3) + 255)|0;
 $5 = $4 | $3;
 $6 = $5&255;
 HEAP8[$1>>0] = $6;
 $7 = HEAP32[$0>>2]|0;
 $8 = $7 & 8;
 $9 = ($8|0)==(0);
 if ($9) {
  $11 = ((($0)) + 8|0);
  HEAP32[$11>>2] = 0;
  $12 = ((($0)) + 4|0);
  HEAP32[$12>>2] = 0;
  $13 = ((($0)) + 44|0);
  $14 = HEAP32[$13>>2]|0;
  $15 = ((($0)) + 28|0);
  HEAP32[$15>>2] = $14;
  $16 = ((($0)) + 20|0);
  HEAP32[$16>>2] = $14;
  $17 = $14;
  $18 = ((($0)) + 48|0);
  $19 = HEAP32[$18>>2]|0;
  $20 = (($17) + ($19)|0);
  $21 = ((($0)) + 16|0);
  HEAP32[$21>>2] = $20;
  $$0 = 0;
 } else {
  $10 = $7 | 32;
  HEAP32[$0>>2] = $10;
  $$0 = -1;
 }
 return ($$0|0);
}
function ___fwritex($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$038 = 0, $$042 = 0, $$1 = 0, $$139 = 0, $$141 = 0, $$143 = 0, $$pre = 0, $$pre47 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0;
 var $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ((($2)) + 16|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = ($4|0)==(0|0);
 if ($5) {
  $7 = (___towrite($2)|0);
  $8 = ($7|0)==(0);
  if ($8) {
   $$pre = HEAP32[$3>>2]|0;
   $12 = $$pre;
   label = 5;
  } else {
   $$1 = 0;
  }
 } else {
  $6 = $4;
  $12 = $6;
  label = 5;
 }
 L5: do {
  if ((label|0) == 5) {
   $9 = ((($2)) + 20|0);
   $10 = HEAP32[$9>>2]|0;
   $11 = (($12) - ($10))|0;
   $13 = ($11>>>0)<($1>>>0);
   $14 = $10;
   if ($13) {
    $15 = ((($2)) + 36|0);
    $16 = HEAP32[$15>>2]|0;
    $17 = (FUNCTION_TABLE_iiii[$16 & 7]($2,$0,$1)|0);
    $$1 = $17;
    break;
   }
   $18 = ((($2)) + 75|0);
   $19 = HEAP8[$18>>0]|0;
   $20 = ($19<<24>>24)>(-1);
   L10: do {
    if ($20) {
     $$038 = $1;
     while(1) {
      $21 = ($$038|0)==(0);
      if ($21) {
       $$139 = 0;$$141 = $0;$$143 = $1;$31 = $14;
       break L10;
      }
      $22 = (($$038) + -1)|0;
      $23 = (($0) + ($22)|0);
      $24 = HEAP8[$23>>0]|0;
      $25 = ($24<<24>>24)==(10);
      if ($25) {
       break;
      } else {
       $$038 = $22;
      }
     }
     $26 = ((($2)) + 36|0);
     $27 = HEAP32[$26>>2]|0;
     $28 = (FUNCTION_TABLE_iiii[$27 & 7]($2,$0,$$038)|0);
     $29 = ($28>>>0)<($$038>>>0);
     if ($29) {
      $$1 = $28;
      break L5;
     }
     $30 = (($0) + ($$038)|0);
     $$042 = (($1) - ($$038))|0;
     $$pre47 = HEAP32[$9>>2]|0;
     $$139 = $$038;$$141 = $30;$$143 = $$042;$31 = $$pre47;
    } else {
     $$139 = 0;$$141 = $0;$$143 = $1;$31 = $14;
    }
   } while(0);
   _memcpy(($31|0),($$141|0),($$143|0))|0;
   $32 = HEAP32[$9>>2]|0;
   $33 = (($32) + ($$143)|0);
   HEAP32[$9>>2] = $33;
   $34 = (($$139) + ($$143))|0;
   $$1 = $34;
  }
 } while(0);
 return ($$1|0);
}
function ___lctrans_impl($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$0 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = ($1|0)==(0|0);
 if ($2) {
  $$0 = 0;
 } else {
  $3 = HEAP32[$1>>2]|0;
  $4 = ((($1)) + 4|0);
  $5 = HEAP32[$4>>2]|0;
  $6 = (___mo_lookup($3,$5,$0)|0);
  $$0 = $6;
 }
 $7 = ($$0|0)!=(0|0);
 $8 = $7 ? $$0 : $0;
 return ($8|0);
}
function ___mo_lookup($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$ = 0, $$090 = 0, $$094 = 0, $$191 = 0, $$195 = 0, $$4 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0;
 var $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0;
 var $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0;
 var $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond102 = 0, $or$cond104 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = HEAP32[$0>>2]|0;
 $4 = (($3) + 1794895138)|0;
 $5 = ((($0)) + 8|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (_swapc($6,$4)|0);
 $8 = ((($0)) + 12|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = (_swapc($9,$4)|0);
 $11 = ((($0)) + 16|0);
 $12 = HEAP32[$11>>2]|0;
 $13 = (_swapc($12,$4)|0);
 $14 = $1 >>> 2;
 $15 = ($7>>>0)<($14>>>0);
 L1: do {
  if ($15) {
   $16 = $7 << 2;
   $17 = (($1) - ($16))|0;
   $18 = ($10>>>0)<($17>>>0);
   $19 = ($13>>>0)<($17>>>0);
   $or$cond = $18 & $19;
   if ($or$cond) {
    $20 = $13 | $10;
    $21 = $20 & 3;
    $22 = ($21|0)==(0);
    if ($22) {
     $23 = $10 >>> 2;
     $24 = $13 >>> 2;
     $$090 = 0;$$094 = $7;
     while(1) {
      $25 = $$094 >>> 1;
      $26 = (($$090) + ($25))|0;
      $27 = $26 << 1;
      $28 = (($27) + ($23))|0;
      $29 = (($0) + ($28<<2)|0);
      $30 = HEAP32[$29>>2]|0;
      $31 = (_swapc($30,$4)|0);
      $32 = (($28) + 1)|0;
      $33 = (($0) + ($32<<2)|0);
      $34 = HEAP32[$33>>2]|0;
      $35 = (_swapc($34,$4)|0);
      $36 = ($35>>>0)<($1>>>0);
      $37 = (($1) - ($35))|0;
      $38 = ($31>>>0)<($37>>>0);
      $or$cond102 = $36 & $38;
      if (!($or$cond102)) {
       $$4 = 0;
       break L1;
      }
      $39 = (($35) + ($31))|0;
      $40 = (($0) + ($39)|0);
      $41 = HEAP8[$40>>0]|0;
      $42 = ($41<<24>>24)==(0);
      if (!($42)) {
       $$4 = 0;
       break L1;
      }
      $43 = (($0) + ($35)|0);
      $44 = (_strcmp($2,$43)|0);
      $45 = ($44|0)==(0);
      if ($45) {
       break;
      }
      $62 = ($$094|0)==(1);
      $63 = ($44|0)<(0);
      $64 = (($$094) - ($25))|0;
      $$195 = $63 ? $25 : $64;
      $$191 = $63 ? $$090 : $26;
      if ($62) {
       $$4 = 0;
       break L1;
      } else {
       $$090 = $$191;$$094 = $$195;
      }
     }
     $46 = (($27) + ($24))|0;
     $47 = (($0) + ($46<<2)|0);
     $48 = HEAP32[$47>>2]|0;
     $49 = (_swapc($48,$4)|0);
     $50 = (($46) + 1)|0;
     $51 = (($0) + ($50<<2)|0);
     $52 = HEAP32[$51>>2]|0;
     $53 = (_swapc($52,$4)|0);
     $54 = ($53>>>0)<($1>>>0);
     $55 = (($1) - ($53))|0;
     $56 = ($49>>>0)<($55>>>0);
     $or$cond104 = $54 & $56;
     if ($or$cond104) {
      $57 = (($0) + ($53)|0);
      $58 = (($53) + ($49))|0;
      $59 = (($0) + ($58)|0);
      $60 = HEAP8[$59>>0]|0;
      $61 = ($60<<24>>24)==(0);
      $$ = $61 ? $57 : 0;
      $$4 = $$;
     } else {
      $$4 = 0;
     }
    } else {
     $$4 = 0;
    }
   } else {
    $$4 = 0;
   }
  } else {
   $$4 = 0;
  }
 } while(0);
 return ($$4|0);
}
function _swapc($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$ = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = ($1|0)==(0);
 $3 = (_llvm_bswap_i32(($0|0))|0);
 $$ = $2 ? $0 : $3;
 return ($$|0);
}
function _memchr($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0$lcssa = 0, $$035$lcssa = 0, $$035$lcssa65 = 0, $$03555 = 0, $$036$lcssa = 0, $$036$lcssa64 = 0, $$03654 = 0, $$046 = 0, $$137$lcssa = 0, $$13745 = 0, $$140 = 0, $$2 = 0, $$23839 = 0, $$3 = 0, $$lcssa = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0;
 var $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0;
 var $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, $or$cond53 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = $1 & 255;
 $4 = $0;
 $5 = $4 & 3;
 $6 = ($5|0)!=(0);
 $7 = ($2|0)!=(0);
 $or$cond53 = $7 & $6;
 L1: do {
  if ($or$cond53) {
   $8 = $1&255;
   $$03555 = $0;$$03654 = $2;
   while(1) {
    $9 = HEAP8[$$03555>>0]|0;
    $10 = ($9<<24>>24)==($8<<24>>24);
    if ($10) {
     $$035$lcssa65 = $$03555;$$036$lcssa64 = $$03654;
     label = 6;
     break L1;
    }
    $11 = ((($$03555)) + 1|0);
    $12 = (($$03654) + -1)|0;
    $13 = $11;
    $14 = $13 & 3;
    $15 = ($14|0)!=(0);
    $16 = ($12|0)!=(0);
    $or$cond = $16 & $15;
    if ($or$cond) {
     $$03555 = $11;$$03654 = $12;
    } else {
     $$035$lcssa = $11;$$036$lcssa = $12;$$lcssa = $16;
     label = 5;
     break;
    }
   }
  } else {
   $$035$lcssa = $0;$$036$lcssa = $2;$$lcssa = $7;
   label = 5;
  }
 } while(0);
 if ((label|0) == 5) {
  if ($$lcssa) {
   $$035$lcssa65 = $$035$lcssa;$$036$lcssa64 = $$036$lcssa;
   label = 6;
  } else {
   $$2 = $$035$lcssa;$$3 = 0;
  }
 }
 L8: do {
  if ((label|0) == 6) {
   $17 = HEAP8[$$035$lcssa65>>0]|0;
   $18 = $1&255;
   $19 = ($17<<24>>24)==($18<<24>>24);
   if ($19) {
    $$2 = $$035$lcssa65;$$3 = $$036$lcssa64;
   } else {
    $20 = Math_imul($3, 16843009)|0;
    $21 = ($$036$lcssa64>>>0)>(3);
    L11: do {
     if ($21) {
      $$046 = $$035$lcssa65;$$13745 = $$036$lcssa64;
      while(1) {
       $22 = HEAP32[$$046>>2]|0;
       $23 = $22 ^ $20;
       $24 = (($23) + -16843009)|0;
       $25 = $23 & -2139062144;
       $26 = $25 ^ -2139062144;
       $27 = $26 & $24;
       $28 = ($27|0)==(0);
       if (!($28)) {
        break;
       }
       $29 = ((($$046)) + 4|0);
       $30 = (($$13745) + -4)|0;
       $31 = ($30>>>0)>(3);
       if ($31) {
        $$046 = $29;$$13745 = $30;
       } else {
        $$0$lcssa = $29;$$137$lcssa = $30;
        label = 11;
        break L11;
       }
      }
      $$140 = $$046;$$23839 = $$13745;
     } else {
      $$0$lcssa = $$035$lcssa65;$$137$lcssa = $$036$lcssa64;
      label = 11;
     }
    } while(0);
    if ((label|0) == 11) {
     $32 = ($$137$lcssa|0)==(0);
     if ($32) {
      $$2 = $$0$lcssa;$$3 = 0;
      break;
     } else {
      $$140 = $$0$lcssa;$$23839 = $$137$lcssa;
     }
    }
    while(1) {
     $33 = HEAP8[$$140>>0]|0;
     $34 = ($33<<24>>24)==($18<<24>>24);
     if ($34) {
      $$2 = $$140;$$3 = $$23839;
      break L8;
     }
     $35 = ((($$140)) + 1|0);
     $36 = (($$23839) + -1)|0;
     $37 = ($36|0)==(0);
     if ($37) {
      $$2 = $35;$$3 = 0;
      break;
     } else {
      $$140 = $35;$$23839 = $36;
     }
    }
   }
  }
 } while(0);
 $38 = ($$3|0)!=(0);
 $39 = $38 ? $$2 : 0;
 return ($39|0);
}
function ___ofl_lock() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 ___lock((3576|0));
 return (3584|0);
}
function ___ofl_unlock() {
 var label = 0, sp = 0;
 sp = STACKTOP;
 ___unlock((3576|0));
 return;
}
function _fflush($0) {
 $0 = $0|0;
 var $$0 = 0, $$023 = 0, $$02325 = 0, $$02327 = 0, $$024$lcssa = 0, $$02426 = 0, $$1 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0;
 var $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $phitmp = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($0|0)==(0|0);
 do {
  if ($1) {
   $8 = HEAP32[49]|0;
   $9 = ($8|0)==(0|0);
   if ($9) {
    $29 = 0;
   } else {
    $10 = HEAP32[49]|0;
    $11 = (_fflush($10)|0);
    $29 = $11;
   }
   $12 = (___ofl_lock()|0);
   $$02325 = HEAP32[$12>>2]|0;
   $13 = ($$02325|0)==(0|0);
   if ($13) {
    $$024$lcssa = $29;
   } else {
    $$02327 = $$02325;$$02426 = $29;
    while(1) {
     $14 = ((($$02327)) + 76|0);
     $15 = HEAP32[$14>>2]|0;
     $16 = ($15|0)>(-1);
     if ($16) {
      $17 = (___lockfile($$02327)|0);
      $26 = $17;
     } else {
      $26 = 0;
     }
     $18 = ((($$02327)) + 20|0);
     $19 = HEAP32[$18>>2]|0;
     $20 = ((($$02327)) + 28|0);
     $21 = HEAP32[$20>>2]|0;
     $22 = ($19>>>0)>($21>>>0);
     if ($22) {
      $23 = (___fflush_unlocked($$02327)|0);
      $24 = $23 | $$02426;
      $$1 = $24;
     } else {
      $$1 = $$02426;
     }
     $25 = ($26|0)==(0);
     if (!($25)) {
      ___unlockfile($$02327);
     }
     $27 = ((($$02327)) + 56|0);
     $$023 = HEAP32[$27>>2]|0;
     $28 = ($$023|0)==(0|0);
     if ($28) {
      $$024$lcssa = $$1;
      break;
     } else {
      $$02327 = $$023;$$02426 = $$1;
     }
    }
   }
   ___ofl_unlock();
   $$0 = $$024$lcssa;
  } else {
   $2 = ((($0)) + 76|0);
   $3 = HEAP32[$2>>2]|0;
   $4 = ($3|0)>(-1);
   if (!($4)) {
    $5 = (___fflush_unlocked($0)|0);
    $$0 = $5;
    break;
   }
   $6 = (___lockfile($0)|0);
   $phitmp = ($6|0)==(0);
   $7 = (___fflush_unlocked($0)|0);
   if ($phitmp) {
    $$0 = $7;
   } else {
    ___unlockfile($0);
    $$0 = $7;
   }
  }
 } while(0);
 return ($$0|0);
}
function ___fflush_unlocked($0) {
 $0 = $0|0;
 var $$0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ((($0)) + 20|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = ((($0)) + 28|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = ($2>>>0)>($4>>>0);
 if ($5) {
  $6 = ((($0)) + 36|0);
  $7 = HEAP32[$6>>2]|0;
  (FUNCTION_TABLE_iiii[$7 & 7]($0,0,0)|0);
  $8 = HEAP32[$1>>2]|0;
  $9 = ($8|0)==(0|0);
  if ($9) {
   $$0 = -1;
  } else {
   label = 3;
  }
 } else {
  label = 3;
 }
 if ((label|0) == 3) {
  $10 = ((($0)) + 4|0);
  $11 = HEAP32[$10>>2]|0;
  $12 = ((($0)) + 8|0);
  $13 = HEAP32[$12>>2]|0;
  $14 = ($11>>>0)<($13>>>0);
  if ($14) {
   $15 = $11;
   $16 = $13;
   $17 = (($15) - ($16))|0;
   $18 = ((($0)) + 40|0);
   $19 = HEAP32[$18>>2]|0;
   (FUNCTION_TABLE_iiii[$19 & 7]($0,$17,1)|0);
  }
  $20 = ((($0)) + 16|0);
  HEAP32[$20>>2] = 0;
  HEAP32[$3>>2] = 0;
  HEAP32[$1>>2] = 0;
  HEAP32[$12>>2] = 0;
  HEAP32[$10>>2] = 0;
  $$0 = 0;
 }
 return ($$0|0);
}
function _vfprintf($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$ = 0, $$0 = 0, $$1 = 0, $$1$ = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0;
 var $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $5 = 0, $6 = 0, $7 = 0;
 var $8 = 0, $9 = 0, $vacopy_currentptr = 0, dest = 0, label = 0, sp = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 224|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(224|0);
 $3 = sp + 120|0;
 $4 = sp + 80|0;
 $5 = sp;
 $6 = sp + 136|0;
 dest=$4; stop=dest+40|0; do { HEAP32[dest>>2]=0|0; dest=dest+4|0; } while ((dest|0) < (stop|0));
 $vacopy_currentptr = HEAP32[$2>>2]|0;
 HEAP32[$3>>2] = $vacopy_currentptr;
 $7 = (_printf_core(0,$1,$3,$5,$4)|0);
 $8 = ($7|0)<(0);
 if ($8) {
  $$0 = -1;
 } else {
  $9 = ((($0)) + 76|0);
  $10 = HEAP32[$9>>2]|0;
  $11 = ($10|0)>(-1);
  if ($11) {
   $12 = (___lockfile($0)|0);
   $40 = $12;
  } else {
   $40 = 0;
  }
  $13 = HEAP32[$0>>2]|0;
  $14 = $13 & 32;
  $15 = ((($0)) + 74|0);
  $16 = HEAP8[$15>>0]|0;
  $17 = ($16<<24>>24)<(1);
  if ($17) {
   $18 = $13 & -33;
   HEAP32[$0>>2] = $18;
  }
  $19 = ((($0)) + 48|0);
  $20 = HEAP32[$19>>2]|0;
  $21 = ($20|0)==(0);
  if ($21) {
   $23 = ((($0)) + 44|0);
   $24 = HEAP32[$23>>2]|0;
   HEAP32[$23>>2] = $6;
   $25 = ((($0)) + 28|0);
   HEAP32[$25>>2] = $6;
   $26 = ((($0)) + 20|0);
   HEAP32[$26>>2] = $6;
   HEAP32[$19>>2] = 80;
   $27 = ((($6)) + 80|0);
   $28 = ((($0)) + 16|0);
   HEAP32[$28>>2] = $27;
   $29 = (_printf_core($0,$1,$3,$5,$4)|0);
   $30 = ($24|0)==(0|0);
   if ($30) {
    $$1 = $29;
   } else {
    $31 = ((($0)) + 36|0);
    $32 = HEAP32[$31>>2]|0;
    (FUNCTION_TABLE_iiii[$32 & 7]($0,0,0)|0);
    $33 = HEAP32[$26>>2]|0;
    $34 = ($33|0)==(0|0);
    $$ = $34 ? -1 : $29;
    HEAP32[$23>>2] = $24;
    HEAP32[$19>>2] = 0;
    HEAP32[$28>>2] = 0;
    HEAP32[$25>>2] = 0;
    HEAP32[$26>>2] = 0;
    $$1 = $$;
   }
  } else {
   $22 = (_printf_core($0,$1,$3,$5,$4)|0);
   $$1 = $22;
  }
  $35 = HEAP32[$0>>2]|0;
  $36 = $35 & 32;
  $37 = ($36|0)==(0);
  $$1$ = $37 ? $$1 : -1;
  $38 = $35 | $14;
  HEAP32[$0>>2] = $38;
  $39 = ($40|0)==(0);
  if (!($39)) {
   ___unlockfile($0);
  }
  $$0 = $$1$;
 }
 STACKTOP = sp;return ($$0|0);
}
function _printf_core($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $$ = 0, $$$ = 0, $$$0259 = 0, $$$0262 = 0, $$$0269 = 0, $$$4266 = 0, $$$5 = 0, $$0 = 0, $$0228 = 0, $$0228$ = 0, $$0229320 = 0, $$0232 = 0, $$0235 = 0, $$0237 = 0, $$0240$lcssa = 0, $$0240$lcssa357 = 0, $$0240319 = 0, $$0243 = 0, $$0247 = 0, $$0249$lcssa = 0;
 var $$0249307 = 0, $$0252 = 0, $$0253 = 0, $$0254 = 0, $$0254$$0254$ = 0, $$0259 = 0, $$0262$lcssa = 0, $$0262313 = 0, $$0269 = 0, $$0269$phi = 0, $$1 = 0, $$1230331 = 0, $$1233 = 0, $$1236 = 0, $$1238 = 0, $$1241330 = 0, $$1244318 = 0, $$1248 = 0, $$1250 = 0, $$1255 = 0;
 var $$1260 = 0, $$1263 = 0, $$1263$ = 0, $$1270 = 0, $$2 = 0, $$2234 = 0, $$2239 = 0, $$2242$lcssa = 0, $$2242306 = 0, $$2245 = 0, $$2251 = 0, $$2256 = 0, $$2256$ = 0, $$2256$$$2256 = 0, $$2261 = 0, $$2271 = 0, $$283$ = 0, $$290 = 0, $$291 = 0, $$3257 = 0;
 var $$3265 = 0, $$3272 = 0, $$3304 = 0, $$376 = 0, $$4258355 = 0, $$4266 = 0, $$5 = 0, $$6268 = 0, $$lcssa295 = 0, $$pre = 0, $$pre346 = 0, $$pre347 = 0, $$pre347$pre = 0, $$pre349 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0;
 var $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0;
 var $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0;
 var $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0;
 var $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0;
 var $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0;
 var $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0;
 var $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0;
 var $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0;
 var $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0;
 var $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0;
 var $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0;
 var $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0.0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0;
 var $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $35 = 0;
 var $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0;
 var $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0;
 var $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0;
 var $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $arglist_current = 0, $arglist_current2 = 0, $arglist_next = 0, $arglist_next3 = 0, $brmerge = 0, $brmerge312 = 0, $expanded = 0, $expanded10 = 0, $expanded11 = 0, $expanded13 = 0, $expanded14 = 0;
 var $expanded15 = 0, $expanded4 = 0, $expanded6 = 0, $expanded7 = 0, $expanded8 = 0, $isdigit = 0, $isdigit275 = 0, $isdigit277 = 0, $isdigittmp = 0, $isdigittmp$ = 0, $isdigittmp274 = 0, $isdigittmp276 = 0, $or$cond = 0, $or$cond280 = 0, $or$cond282 = 0, $or$cond285 = 0, $storemerge = 0, $storemerge278 = 0, $trunc = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 64|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(64|0);
 $5 = sp + 16|0;
 $6 = sp;
 $7 = sp + 24|0;
 $8 = sp + 8|0;
 $9 = sp + 20|0;
 HEAP32[$5>>2] = $1;
 $10 = ($0|0)!=(0|0);
 $11 = ((($7)) + 40|0);
 $12 = $11;
 $13 = ((($7)) + 39|0);
 $14 = ((($8)) + 4|0);
 $$0243 = 0;$$0247 = 0;$$0269 = 0;$21 = $1;
 L1: while(1) {
  $15 = ($$0247|0)>(-1);
  do {
   if ($15) {
    $16 = (2147483647 - ($$0247))|0;
    $17 = ($$0243|0)>($16|0);
    if ($17) {
     $18 = (___errno_location()|0);
     HEAP32[$18>>2] = 75;
     $$1248 = -1;
     break;
    } else {
     $19 = (($$0243) + ($$0247))|0;
     $$1248 = $19;
     break;
    }
   } else {
    $$1248 = $$0247;
   }
  } while(0);
  $20 = HEAP8[$21>>0]|0;
  $22 = ($20<<24>>24)==(0);
  if ($22) {
   label = 86;
   break;
  } else {
   $23 = $20;$25 = $21;
  }
  L9: while(1) {
   switch ($23<<24>>24) {
   case 37:  {
    $$0249307 = $25;$27 = $25;
    label = 9;
    break L9;
    break;
   }
   case 0:  {
    $$0249$lcssa = $25;$39 = $25;
    break L9;
    break;
   }
   default: {
   }
   }
   $24 = ((($25)) + 1|0);
   HEAP32[$5>>2] = $24;
   $$pre = HEAP8[$24>>0]|0;
   $23 = $$pre;$25 = $24;
  }
  L12: do {
   if ((label|0) == 9) {
    while(1) {
     label = 0;
     $26 = ((($27)) + 1|0);
     $28 = HEAP8[$26>>0]|0;
     $29 = ($28<<24>>24)==(37);
     if (!($29)) {
      $$0249$lcssa = $$0249307;$39 = $27;
      break L12;
     }
     $30 = ((($$0249307)) + 1|0);
     $31 = ((($27)) + 2|0);
     HEAP32[$5>>2] = $31;
     $32 = HEAP8[$31>>0]|0;
     $33 = ($32<<24>>24)==(37);
     if ($33) {
      $$0249307 = $30;$27 = $31;
      label = 9;
     } else {
      $$0249$lcssa = $30;$39 = $31;
      break;
     }
    }
   }
  } while(0);
  $34 = $$0249$lcssa;
  $35 = $21;
  $36 = (($34) - ($35))|0;
  if ($10) {
   _out_666($0,$21,$36);
  }
  $37 = ($36|0)==(0);
  if (!($37)) {
   $$0269$phi = $$0269;$$0243 = $36;$$0247 = $$1248;$21 = $39;$$0269 = $$0269$phi;
   continue;
  }
  $38 = ((($39)) + 1|0);
  $40 = HEAP8[$38>>0]|0;
  $41 = $40 << 24 >> 24;
  $isdigittmp = (($41) + -48)|0;
  $isdigit = ($isdigittmp>>>0)<(10);
  if ($isdigit) {
   $42 = ((($39)) + 2|0);
   $43 = HEAP8[$42>>0]|0;
   $44 = ($43<<24>>24)==(36);
   $45 = ((($39)) + 3|0);
   $$376 = $44 ? $45 : $38;
   $$$0269 = $44 ? 1 : $$0269;
   $isdigittmp$ = $44 ? $isdigittmp : -1;
   $$0253 = $isdigittmp$;$$1270 = $$$0269;$storemerge = $$376;
  } else {
   $$0253 = -1;$$1270 = $$0269;$storemerge = $38;
  }
  HEAP32[$5>>2] = $storemerge;
  $46 = HEAP8[$storemerge>>0]|0;
  $47 = $46 << 24 >> 24;
  $48 = (($47) + -32)|0;
  $49 = ($48>>>0)>(31);
  $50 = 1 << $48;
  $51 = $50 & 75913;
  $52 = ($51|0)==(0);
  $brmerge312 = $49 | $52;
  if ($brmerge312) {
   $$0262$lcssa = 0;$$lcssa295 = $46;$69 = $storemerge;
  } else {
   $$0262313 = 0;$54 = $46;$59 = $storemerge;
   while(1) {
    $53 = $54 << 24 >> 24;
    $55 = (($53) + -32)|0;
    $56 = 1 << $55;
    $57 = $56 | $$0262313;
    $58 = ((($59)) + 1|0);
    HEAP32[$5>>2] = $58;
    $60 = HEAP8[$58>>0]|0;
    $61 = $60 << 24 >> 24;
    $62 = (($61) + -32)|0;
    $63 = ($62>>>0)>(31);
    $64 = 1 << $62;
    $65 = $64 & 75913;
    $66 = ($65|0)==(0);
    $brmerge = $63 | $66;
    if ($brmerge) {
     $$0262$lcssa = $57;$$lcssa295 = $60;$69 = $58;
     break;
    } else {
     $$0262313 = $57;$54 = $60;$59 = $58;
    }
   }
  }
  $67 = ($$lcssa295<<24>>24)==(42);
  if ($67) {
   $68 = ((($69)) + 1|0);
   $70 = HEAP8[$68>>0]|0;
   $71 = $70 << 24 >> 24;
   $isdigittmp276 = (($71) + -48)|0;
   $isdigit277 = ($isdigittmp276>>>0)<(10);
   if ($isdigit277) {
    $72 = ((($69)) + 2|0);
    $73 = HEAP8[$72>>0]|0;
    $74 = ($73<<24>>24)==(36);
    if ($74) {
     $75 = (($4) + ($isdigittmp276<<2)|0);
     HEAP32[$75>>2] = 10;
     $76 = HEAP8[$68>>0]|0;
     $77 = $76 << 24 >> 24;
     $78 = (($77) + -48)|0;
     $79 = (($3) + ($78<<3)|0);
     $80 = $79;
     $81 = $80;
     $82 = HEAP32[$81>>2]|0;
     $83 = (($80) + 4)|0;
     $84 = $83;
     $85 = HEAP32[$84>>2]|0;
     $86 = ((($69)) + 3|0);
     $$0259 = $82;$$2271 = 1;$storemerge278 = $86;
    } else {
     label = 22;
    }
   } else {
    label = 22;
   }
   if ((label|0) == 22) {
    label = 0;
    $87 = ($$1270|0)==(0);
    if (!($87)) {
     $$0 = -1;
     break;
    }
    if ($10) {
     $arglist_current = HEAP32[$2>>2]|0;
     $88 = $arglist_current;
     $89 = ((0) + 4|0);
     $expanded4 = $89;
     $expanded = (($expanded4) - 1)|0;
     $90 = (($88) + ($expanded))|0;
     $91 = ((0) + 4|0);
     $expanded8 = $91;
     $expanded7 = (($expanded8) - 1)|0;
     $expanded6 = $expanded7 ^ -1;
     $92 = $90 & $expanded6;
     $93 = $92;
     $94 = HEAP32[$93>>2]|0;
     $arglist_next = ((($93)) + 4|0);
     HEAP32[$2>>2] = $arglist_next;
     $$0259 = $94;$$2271 = 0;$storemerge278 = $68;
    } else {
     $$0259 = 0;$$2271 = 0;$storemerge278 = $68;
    }
   }
   HEAP32[$5>>2] = $storemerge278;
   $95 = ($$0259|0)<(0);
   $96 = $$0262$lcssa | 8192;
   $97 = (0 - ($$0259))|0;
   $$$0262 = $95 ? $96 : $$0262$lcssa;
   $$$0259 = $95 ? $97 : $$0259;
   $$1260 = $$$0259;$$1263 = $$$0262;$$3272 = $$2271;$101 = $storemerge278;
  } else {
   $98 = (_getint_667($5)|0);
   $99 = ($98|0)<(0);
   if ($99) {
    $$0 = -1;
    break;
   }
   $$pre346 = HEAP32[$5>>2]|0;
   $$1260 = $98;$$1263 = $$0262$lcssa;$$3272 = $$1270;$101 = $$pre346;
  }
  $100 = HEAP8[$101>>0]|0;
  $102 = ($100<<24>>24)==(46);
  do {
   if ($102) {
    $103 = ((($101)) + 1|0);
    $104 = HEAP8[$103>>0]|0;
    $105 = ($104<<24>>24)==(42);
    if (!($105)) {
     $132 = ((($101)) + 1|0);
     HEAP32[$5>>2] = $132;
     $133 = (_getint_667($5)|0);
     $$pre347$pre = HEAP32[$5>>2]|0;
     $$0254 = $133;$$pre347 = $$pre347$pre;
     break;
    }
    $106 = ((($101)) + 2|0);
    $107 = HEAP8[$106>>0]|0;
    $108 = $107 << 24 >> 24;
    $isdigittmp274 = (($108) + -48)|0;
    $isdigit275 = ($isdigittmp274>>>0)<(10);
    if ($isdigit275) {
     $109 = ((($101)) + 3|0);
     $110 = HEAP8[$109>>0]|0;
     $111 = ($110<<24>>24)==(36);
     if ($111) {
      $112 = (($4) + ($isdigittmp274<<2)|0);
      HEAP32[$112>>2] = 10;
      $113 = HEAP8[$106>>0]|0;
      $114 = $113 << 24 >> 24;
      $115 = (($114) + -48)|0;
      $116 = (($3) + ($115<<3)|0);
      $117 = $116;
      $118 = $117;
      $119 = HEAP32[$118>>2]|0;
      $120 = (($117) + 4)|0;
      $121 = $120;
      $122 = HEAP32[$121>>2]|0;
      $123 = ((($101)) + 4|0);
      HEAP32[$5>>2] = $123;
      $$0254 = $119;$$pre347 = $123;
      break;
     }
    }
    $124 = ($$3272|0)==(0);
    if (!($124)) {
     $$0 = -1;
     break L1;
    }
    if ($10) {
     $arglist_current2 = HEAP32[$2>>2]|0;
     $125 = $arglist_current2;
     $126 = ((0) + 4|0);
     $expanded11 = $126;
     $expanded10 = (($expanded11) - 1)|0;
     $127 = (($125) + ($expanded10))|0;
     $128 = ((0) + 4|0);
     $expanded15 = $128;
     $expanded14 = (($expanded15) - 1)|0;
     $expanded13 = $expanded14 ^ -1;
     $129 = $127 & $expanded13;
     $130 = $129;
     $131 = HEAP32[$130>>2]|0;
     $arglist_next3 = ((($130)) + 4|0);
     HEAP32[$2>>2] = $arglist_next3;
     $338 = $131;
    } else {
     $338 = 0;
    }
    HEAP32[$5>>2] = $106;
    $$0254 = $338;$$pre347 = $106;
   } else {
    $$0254 = -1;$$pre347 = $101;
   }
  } while(0);
  $$0252 = 0;$135 = $$pre347;
  while(1) {
   $134 = HEAP8[$135>>0]|0;
   $136 = $134 << 24 >> 24;
   $137 = (($136) + -65)|0;
   $138 = ($137>>>0)>(57);
   if ($138) {
    $$0 = -1;
    break L1;
   }
   $139 = ((($135)) + 1|0);
   HEAP32[$5>>2] = $139;
   $140 = HEAP8[$135>>0]|0;
   $141 = $140 << 24 >> 24;
   $142 = (($141) + -65)|0;
   $143 = ((581 + (($$0252*58)|0)|0) + ($142)|0);
   $144 = HEAP8[$143>>0]|0;
   $145 = $144&255;
   $146 = (($145) + -1)|0;
   $147 = ($146>>>0)<(8);
   if ($147) {
    $$0252 = $145;$135 = $139;
   } else {
    break;
   }
  }
  $148 = ($144<<24>>24)==(0);
  if ($148) {
   $$0 = -1;
   break;
  }
  $149 = ($144<<24>>24)==(19);
  $150 = ($$0253|0)>(-1);
  do {
   if ($149) {
    if ($150) {
     $$0 = -1;
     break L1;
    } else {
     label = 48;
    }
   } else {
    if ($150) {
     $151 = (($4) + ($$0253<<2)|0);
     HEAP32[$151>>2] = $145;
     $152 = (($3) + ($$0253<<3)|0);
     $153 = $152;
     $154 = $153;
     $155 = HEAP32[$154>>2]|0;
     $156 = (($153) + 4)|0;
     $157 = $156;
     $158 = HEAP32[$157>>2]|0;
     $159 = $6;
     $160 = $159;
     HEAP32[$160>>2] = $155;
     $161 = (($159) + 4)|0;
     $162 = $161;
     HEAP32[$162>>2] = $158;
     label = 48;
     break;
    }
    if (!($10)) {
     $$0 = 0;
     break L1;
    }
    _pop_arg_669($6,$145,$2);
   }
  } while(0);
  if ((label|0) == 48) {
   label = 0;
   if (!($10)) {
    $$0243 = 0;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
    continue;
   }
  }
  $163 = HEAP8[$135>>0]|0;
  $164 = $163 << 24 >> 24;
  $165 = ($$0252|0)!=(0);
  $166 = $164 & 15;
  $167 = ($166|0)==(3);
  $or$cond280 = $165 & $167;
  $168 = $164 & -33;
  $$0235 = $or$cond280 ? $168 : $164;
  $169 = $$1263 & 8192;
  $170 = ($169|0)==(0);
  $171 = $$1263 & -65537;
  $$1263$ = $170 ? $$1263 : $171;
  L70: do {
   switch ($$0235|0) {
   case 110:  {
    $trunc = $$0252&255;
    switch ($trunc<<24>>24) {
    case 0:  {
     $178 = HEAP32[$6>>2]|0;
     HEAP32[$178>>2] = $$1248;
     $$0243 = 0;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
     continue L1;
     break;
    }
    case 1:  {
     $179 = HEAP32[$6>>2]|0;
     HEAP32[$179>>2] = $$1248;
     $$0243 = 0;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
     continue L1;
     break;
    }
    case 2:  {
     $180 = ($$1248|0)<(0);
     $181 = $180 << 31 >> 31;
     $182 = HEAP32[$6>>2]|0;
     $183 = $182;
     $184 = $183;
     HEAP32[$184>>2] = $$1248;
     $185 = (($183) + 4)|0;
     $186 = $185;
     HEAP32[$186>>2] = $181;
     $$0243 = 0;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
     continue L1;
     break;
    }
    case 3:  {
     $187 = $$1248&65535;
     $188 = HEAP32[$6>>2]|0;
     HEAP16[$188>>1] = $187;
     $$0243 = 0;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
     continue L1;
     break;
    }
    case 4:  {
     $189 = $$1248&255;
     $190 = HEAP32[$6>>2]|0;
     HEAP8[$190>>0] = $189;
     $$0243 = 0;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
     continue L1;
     break;
    }
    case 6:  {
     $191 = HEAP32[$6>>2]|0;
     HEAP32[$191>>2] = $$1248;
     $$0243 = 0;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
     continue L1;
     break;
    }
    case 7:  {
     $192 = ($$1248|0)<(0);
     $193 = $192 << 31 >> 31;
     $194 = HEAP32[$6>>2]|0;
     $195 = $194;
     $196 = $195;
     HEAP32[$196>>2] = $$1248;
     $197 = (($195) + 4)|0;
     $198 = $197;
     HEAP32[$198>>2] = $193;
     $$0243 = 0;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
     continue L1;
     break;
    }
    default: {
     $$0243 = 0;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
     continue L1;
    }
    }
    break;
   }
   case 112:  {
    $199 = ($$0254>>>0)>(8);
    $200 = $199 ? $$0254 : 8;
    $201 = $$1263$ | 8;
    $$1236 = 120;$$1255 = $200;$$3265 = $201;
    label = 60;
    break;
   }
   case 88: case 120:  {
    $$1236 = $$0235;$$1255 = $$0254;$$3265 = $$1263$;
    label = 60;
    break;
   }
   case 111:  {
    $217 = $6;
    $218 = $217;
    $219 = HEAP32[$218>>2]|0;
    $220 = (($217) + 4)|0;
    $221 = $220;
    $222 = HEAP32[$221>>2]|0;
    $223 = (_fmt_o($219,$222,$11)|0);
    $224 = $$1263$ & 8;
    $225 = ($224|0)==(0);
    $226 = $223;
    $227 = (($12) - ($226))|0;
    $228 = ($$0254|0)>($227|0);
    $229 = (($227) + 1)|0;
    $230 = $225 | $228;
    $$0254$$0254$ = $230 ? $$0254 : $229;
    $$0228 = $223;$$1233 = 0;$$1238 = 1045;$$2256 = $$0254$$0254$;$$4266 = $$1263$;$256 = $219;$258 = $222;
    label = 66;
    break;
   }
   case 105: case 100:  {
    $231 = $6;
    $232 = $231;
    $233 = HEAP32[$232>>2]|0;
    $234 = (($231) + 4)|0;
    $235 = $234;
    $236 = HEAP32[$235>>2]|0;
    $237 = ($236|0)<(0);
    if ($237) {
     $238 = (_i64Subtract(0,0,($233|0),($236|0))|0);
     $239 = tempRet0;
     $240 = $6;
     $241 = $240;
     HEAP32[$241>>2] = $238;
     $242 = (($240) + 4)|0;
     $243 = $242;
     HEAP32[$243>>2] = $239;
     $$0232 = 1;$$0237 = 1045;$250 = $238;$251 = $239;
     label = 65;
     break L70;
    } else {
     $244 = $$1263$ & 2048;
     $245 = ($244|0)==(0);
     $246 = $$1263$ & 1;
     $247 = ($246|0)==(0);
     $$ = $247 ? 1045 : (1047);
     $$$ = $245 ? $$ : (1046);
     $248 = $$1263$ & 2049;
     $249 = ($248|0)!=(0);
     $$283$ = $249&1;
     $$0232 = $$283$;$$0237 = $$$;$250 = $233;$251 = $236;
     label = 65;
     break L70;
    }
    break;
   }
   case 117:  {
    $172 = $6;
    $173 = $172;
    $174 = HEAP32[$173>>2]|0;
    $175 = (($172) + 4)|0;
    $176 = $175;
    $177 = HEAP32[$176>>2]|0;
    $$0232 = 0;$$0237 = 1045;$250 = $174;$251 = $177;
    label = 65;
    break;
   }
   case 99:  {
    $267 = $6;
    $268 = $267;
    $269 = HEAP32[$268>>2]|0;
    $270 = (($267) + 4)|0;
    $271 = $270;
    $272 = HEAP32[$271>>2]|0;
    $273 = $269&255;
    HEAP8[$13>>0] = $273;
    $$2 = $13;$$2234 = 0;$$2239 = 1045;$$2251 = $11;$$5 = 1;$$6268 = $171;
    break;
   }
   case 109:  {
    $274 = (___errno_location()|0);
    $275 = HEAP32[$274>>2]|0;
    $276 = (_strerror($275)|0);
    $$1 = $276;
    label = 70;
    break;
   }
   case 115:  {
    $277 = HEAP32[$6>>2]|0;
    $278 = ($277|0)!=(0|0);
    $279 = $278 ? $277 : 1055;
    $$1 = $279;
    label = 70;
    break;
   }
   case 67:  {
    $286 = $6;
    $287 = $286;
    $288 = HEAP32[$287>>2]|0;
    $289 = (($286) + 4)|0;
    $290 = $289;
    $291 = HEAP32[$290>>2]|0;
    HEAP32[$8>>2] = $288;
    HEAP32[$14>>2] = 0;
    HEAP32[$6>>2] = $8;
    $$4258355 = -1;$339 = $8;
    label = 74;
    break;
   }
   case 83:  {
    $$pre349 = HEAP32[$6>>2]|0;
    $292 = ($$0254|0)==(0);
    if ($292) {
     _pad_672($0,32,$$1260,0,$$1263$);
     $$0240$lcssa357 = 0;
     label = 83;
    } else {
     $$4258355 = $$0254;$339 = $$pre349;
     label = 74;
    }
    break;
   }
   case 65: case 71: case 70: case 69: case 97: case 103: case 102: case 101:  {
    $314 = +HEAPF64[$6>>3];
    $315 = (_fmt_fp($0,$314,$$1260,$$0254,$$1263$,$$0235)|0);
    $$0243 = $315;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
    continue L1;
    break;
   }
   default: {
    $$2 = $21;$$2234 = 0;$$2239 = 1045;$$2251 = $11;$$5 = $$0254;$$6268 = $$1263$;
   }
   }
  } while(0);
  L94: do {
   if ((label|0) == 60) {
    label = 0;
    $202 = $6;
    $203 = $202;
    $204 = HEAP32[$203>>2]|0;
    $205 = (($202) + 4)|0;
    $206 = $205;
    $207 = HEAP32[$206>>2]|0;
    $208 = $$1236 & 32;
    $209 = (_fmt_x($204,$207,$11,$208)|0);
    $210 = ($204|0)==(0);
    $211 = ($207|0)==(0);
    $212 = $210 & $211;
    $213 = $$3265 & 8;
    $214 = ($213|0)==(0);
    $or$cond282 = $214 | $212;
    $215 = $$1236 >> 4;
    $216 = (1045 + ($215)|0);
    $$290 = $or$cond282 ? 1045 : $216;
    $$291 = $or$cond282 ? 0 : 2;
    $$0228 = $209;$$1233 = $$291;$$1238 = $$290;$$2256 = $$1255;$$4266 = $$3265;$256 = $204;$258 = $207;
    label = 66;
   }
   else if ((label|0) == 65) {
    label = 0;
    $252 = (_fmt_u($250,$251,$11)|0);
    $$0228 = $252;$$1233 = $$0232;$$1238 = $$0237;$$2256 = $$0254;$$4266 = $$1263$;$256 = $250;$258 = $251;
    label = 66;
   }
   else if ((label|0) == 70) {
    label = 0;
    $280 = (_memchr($$1,0,$$0254)|0);
    $281 = ($280|0)==(0|0);
    $282 = $280;
    $283 = $$1;
    $284 = (($282) - ($283))|0;
    $285 = (($$1) + ($$0254)|0);
    $$3257 = $281 ? $$0254 : $284;
    $$1250 = $281 ? $285 : $280;
    $$2 = $$1;$$2234 = 0;$$2239 = 1045;$$2251 = $$1250;$$5 = $$3257;$$6268 = $171;
   }
   else if ((label|0) == 74) {
    label = 0;
    $$0229320 = $339;$$0240319 = 0;$$1244318 = 0;
    while(1) {
     $293 = HEAP32[$$0229320>>2]|0;
     $294 = ($293|0)==(0);
     if ($294) {
      $$0240$lcssa = $$0240319;$$2245 = $$1244318;
      break;
     }
     $295 = (_wctomb($9,$293)|0);
     $296 = ($295|0)<(0);
     $297 = (($$4258355) - ($$0240319))|0;
     $298 = ($295>>>0)>($297>>>0);
     $or$cond285 = $296 | $298;
     if ($or$cond285) {
      $$0240$lcssa = $$0240319;$$2245 = $295;
      break;
     }
     $299 = ((($$0229320)) + 4|0);
     $300 = (($295) + ($$0240319))|0;
     $301 = ($$4258355>>>0)>($300>>>0);
     if ($301) {
      $$0229320 = $299;$$0240319 = $300;$$1244318 = $295;
     } else {
      $$0240$lcssa = $300;$$2245 = $295;
      break;
     }
    }
    $302 = ($$2245|0)<(0);
    if ($302) {
     $$0 = -1;
     break L1;
    }
    _pad_672($0,32,$$1260,$$0240$lcssa,$$1263$);
    $303 = ($$0240$lcssa|0)==(0);
    if ($303) {
     $$0240$lcssa357 = 0;
     label = 83;
    } else {
     $$1230331 = $339;$$1241330 = 0;
     while(1) {
      $304 = HEAP32[$$1230331>>2]|0;
      $305 = ($304|0)==(0);
      if ($305) {
       $$0240$lcssa357 = $$0240$lcssa;
       label = 83;
       break L94;
      }
      $306 = (_wctomb($9,$304)|0);
      $307 = (($306) + ($$1241330))|0;
      $308 = ($307|0)>($$0240$lcssa|0);
      if ($308) {
       $$0240$lcssa357 = $$0240$lcssa;
       label = 83;
       break L94;
      }
      $309 = ((($$1230331)) + 4|0);
      _out_666($0,$9,$306);
      $310 = ($307>>>0)<($$0240$lcssa>>>0);
      if ($310) {
       $$1230331 = $309;$$1241330 = $307;
      } else {
       $$0240$lcssa357 = $$0240$lcssa;
       label = 83;
       break;
      }
     }
    }
   }
  } while(0);
  if ((label|0) == 66) {
   label = 0;
   $253 = ($$2256|0)>(-1);
   $254 = $$4266 & -65537;
   $$$4266 = $253 ? $254 : $$4266;
   $255 = ($256|0)!=(0);
   $257 = ($258|0)!=(0);
   $259 = $255 | $257;
   $260 = ($$2256|0)!=(0);
   $or$cond = $260 | $259;
   $261 = $$0228;
   $262 = (($12) - ($261))|0;
   $263 = $259 ^ 1;
   $264 = $263&1;
   $265 = (($262) + ($264))|0;
   $266 = ($$2256|0)>($265|0);
   $$2256$ = $266 ? $$2256 : $265;
   $$2256$$$2256 = $or$cond ? $$2256$ : $$2256;
   $$0228$ = $or$cond ? $$0228 : $11;
   $$2 = $$0228$;$$2234 = $$1233;$$2239 = $$1238;$$2251 = $11;$$5 = $$2256$$$2256;$$6268 = $$$4266;
  }
  else if ((label|0) == 83) {
   label = 0;
   $311 = $$1263$ ^ 8192;
   _pad_672($0,32,$$1260,$$0240$lcssa357,$311);
   $312 = ($$1260|0)>($$0240$lcssa357|0);
   $313 = $312 ? $$1260 : $$0240$lcssa357;
   $$0243 = $313;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
   continue;
  }
  $316 = $$2251;
  $317 = $$2;
  $318 = (($316) - ($317))|0;
  $319 = ($$5|0)<($318|0);
  $$$5 = $319 ? $318 : $$5;
  $320 = (($$$5) + ($$2234))|0;
  $321 = ($$1260|0)<($320|0);
  $$2261 = $321 ? $320 : $$1260;
  _pad_672($0,32,$$2261,$320,$$6268);
  _out_666($0,$$2239,$$2234);
  $322 = $$6268 ^ 65536;
  _pad_672($0,48,$$2261,$320,$322);
  _pad_672($0,48,$$$5,$318,0);
  _out_666($0,$$2,$318);
  $323 = $$6268 ^ 8192;
  _pad_672($0,32,$$2261,$320,$323);
  $$0243 = $$2261;$$0247 = $$1248;$$0269 = $$3272;$21 = $139;
 }
 L113: do {
  if ((label|0) == 86) {
   $324 = ($0|0)==(0|0);
   if ($324) {
    $325 = ($$0269|0)==(0);
    if ($325) {
     $$0 = 0;
    } else {
     $$2242306 = 1;
     while(1) {
      $326 = (($4) + ($$2242306<<2)|0);
      $327 = HEAP32[$326>>2]|0;
      $328 = ($327|0)==(0);
      if ($328) {
       $$2242$lcssa = $$2242306;
       break;
      }
      $330 = (($3) + ($$2242306<<3)|0);
      _pop_arg_669($330,$327,$2);
      $331 = (($$2242306) + 1)|0;
      $332 = ($$2242306|0)<(9);
      if ($332) {
       $$2242306 = $331;
      } else {
       $$2242$lcssa = $331;
       break;
      }
     }
     $329 = ($$2242$lcssa|0)<(10);
     if ($329) {
      $$3304 = $$2242$lcssa;
      while(1) {
       $335 = (($4) + ($$3304<<2)|0);
       $336 = HEAP32[$335>>2]|0;
       $337 = ($336|0)==(0);
       if (!($337)) {
        $$0 = -1;
        break L113;
       }
       $333 = (($$3304) + 1)|0;
       $334 = ($$3304|0)<(9);
       if ($334) {
        $$3304 = $333;
       } else {
        $$0 = 1;
        break;
       }
      }
     } else {
      $$0 = 1;
     }
    }
   } else {
    $$0 = $$1248;
   }
  }
 } while(0);
 STACKTOP = sp;return ($$0|0);
}
function _out_666($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = HEAP32[$0>>2]|0;
 $4 = $3 & 32;
 $5 = ($4|0)==(0);
 if ($5) {
  (___fwritex($1,$2,$0)|0);
 }
 return;
}
function _getint_667($0) {
 $0 = $0|0;
 var $$0$lcssa = 0, $$06 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $isdigit = 0, $isdigit5 = 0, $isdigittmp = 0, $isdigittmp4 = 0, $isdigittmp7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = HEAP32[$0>>2]|0;
 $2 = HEAP8[$1>>0]|0;
 $3 = $2 << 24 >> 24;
 $isdigittmp4 = (($3) + -48)|0;
 $isdigit5 = ($isdigittmp4>>>0)<(10);
 if ($isdigit5) {
  $$06 = 0;$7 = $1;$isdigittmp7 = $isdigittmp4;
  while(1) {
   $4 = ($$06*10)|0;
   $5 = (($isdigittmp7) + ($4))|0;
   $6 = ((($7)) + 1|0);
   HEAP32[$0>>2] = $6;
   $8 = HEAP8[$6>>0]|0;
   $9 = $8 << 24 >> 24;
   $isdigittmp = (($9) + -48)|0;
   $isdigit = ($isdigittmp>>>0)<(10);
   if ($isdigit) {
    $$06 = $5;$7 = $6;$isdigittmp7 = $isdigittmp;
   } else {
    $$0$lcssa = $5;
    break;
   }
  }
 } else {
  $$0$lcssa = 0;
 }
 return ($$0$lcssa|0);
}
function _pop_arg_669($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$mask = 0, $$mask31 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0.0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0;
 var $116 = 0.0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0;
 var $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0;
 var $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0;
 var $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0;
 var $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $arglist_current = 0, $arglist_current11 = 0, $arglist_current14 = 0, $arglist_current17 = 0;
 var $arglist_current2 = 0, $arglist_current20 = 0, $arglist_current23 = 0, $arglist_current26 = 0, $arglist_current5 = 0, $arglist_current8 = 0, $arglist_next = 0, $arglist_next12 = 0, $arglist_next15 = 0, $arglist_next18 = 0, $arglist_next21 = 0, $arglist_next24 = 0, $arglist_next27 = 0, $arglist_next3 = 0, $arglist_next6 = 0, $arglist_next9 = 0, $expanded = 0, $expanded28 = 0, $expanded30 = 0, $expanded31 = 0;
 var $expanded32 = 0, $expanded34 = 0, $expanded35 = 0, $expanded37 = 0, $expanded38 = 0, $expanded39 = 0, $expanded41 = 0, $expanded42 = 0, $expanded44 = 0, $expanded45 = 0, $expanded46 = 0, $expanded48 = 0, $expanded49 = 0, $expanded51 = 0, $expanded52 = 0, $expanded53 = 0, $expanded55 = 0, $expanded56 = 0, $expanded58 = 0, $expanded59 = 0;
 var $expanded60 = 0, $expanded62 = 0, $expanded63 = 0, $expanded65 = 0, $expanded66 = 0, $expanded67 = 0, $expanded69 = 0, $expanded70 = 0, $expanded72 = 0, $expanded73 = 0, $expanded74 = 0, $expanded76 = 0, $expanded77 = 0, $expanded79 = 0, $expanded80 = 0, $expanded81 = 0, $expanded83 = 0, $expanded84 = 0, $expanded86 = 0, $expanded87 = 0;
 var $expanded88 = 0, $expanded90 = 0, $expanded91 = 0, $expanded93 = 0, $expanded94 = 0, $expanded95 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($1>>>0)>(20);
 L1: do {
  if (!($3)) {
   do {
    switch ($1|0) {
    case 9:  {
     $arglist_current = HEAP32[$2>>2]|0;
     $4 = $arglist_current;
     $5 = ((0) + 4|0);
     $expanded28 = $5;
     $expanded = (($expanded28) - 1)|0;
     $6 = (($4) + ($expanded))|0;
     $7 = ((0) + 4|0);
     $expanded32 = $7;
     $expanded31 = (($expanded32) - 1)|0;
     $expanded30 = $expanded31 ^ -1;
     $8 = $6 & $expanded30;
     $9 = $8;
     $10 = HEAP32[$9>>2]|0;
     $arglist_next = ((($9)) + 4|0);
     HEAP32[$2>>2] = $arglist_next;
     HEAP32[$0>>2] = $10;
     break L1;
     break;
    }
    case 10:  {
     $arglist_current2 = HEAP32[$2>>2]|0;
     $11 = $arglist_current2;
     $12 = ((0) + 4|0);
     $expanded35 = $12;
     $expanded34 = (($expanded35) - 1)|0;
     $13 = (($11) + ($expanded34))|0;
     $14 = ((0) + 4|0);
     $expanded39 = $14;
     $expanded38 = (($expanded39) - 1)|0;
     $expanded37 = $expanded38 ^ -1;
     $15 = $13 & $expanded37;
     $16 = $15;
     $17 = HEAP32[$16>>2]|0;
     $arglist_next3 = ((($16)) + 4|0);
     HEAP32[$2>>2] = $arglist_next3;
     $18 = ($17|0)<(0);
     $19 = $18 << 31 >> 31;
     $20 = $0;
     $21 = $20;
     HEAP32[$21>>2] = $17;
     $22 = (($20) + 4)|0;
     $23 = $22;
     HEAP32[$23>>2] = $19;
     break L1;
     break;
    }
    case 11:  {
     $arglist_current5 = HEAP32[$2>>2]|0;
     $24 = $arglist_current5;
     $25 = ((0) + 4|0);
     $expanded42 = $25;
     $expanded41 = (($expanded42) - 1)|0;
     $26 = (($24) + ($expanded41))|0;
     $27 = ((0) + 4|0);
     $expanded46 = $27;
     $expanded45 = (($expanded46) - 1)|0;
     $expanded44 = $expanded45 ^ -1;
     $28 = $26 & $expanded44;
     $29 = $28;
     $30 = HEAP32[$29>>2]|0;
     $arglist_next6 = ((($29)) + 4|0);
     HEAP32[$2>>2] = $arglist_next6;
     $31 = $0;
     $32 = $31;
     HEAP32[$32>>2] = $30;
     $33 = (($31) + 4)|0;
     $34 = $33;
     HEAP32[$34>>2] = 0;
     break L1;
     break;
    }
    case 12:  {
     $arglist_current8 = HEAP32[$2>>2]|0;
     $35 = $arglist_current8;
     $36 = ((0) + 8|0);
     $expanded49 = $36;
     $expanded48 = (($expanded49) - 1)|0;
     $37 = (($35) + ($expanded48))|0;
     $38 = ((0) + 8|0);
     $expanded53 = $38;
     $expanded52 = (($expanded53) - 1)|0;
     $expanded51 = $expanded52 ^ -1;
     $39 = $37 & $expanded51;
     $40 = $39;
     $41 = $40;
     $42 = $41;
     $43 = HEAP32[$42>>2]|0;
     $44 = (($41) + 4)|0;
     $45 = $44;
     $46 = HEAP32[$45>>2]|0;
     $arglist_next9 = ((($40)) + 8|0);
     HEAP32[$2>>2] = $arglist_next9;
     $47 = $0;
     $48 = $47;
     HEAP32[$48>>2] = $43;
     $49 = (($47) + 4)|0;
     $50 = $49;
     HEAP32[$50>>2] = $46;
     break L1;
     break;
    }
    case 13:  {
     $arglist_current11 = HEAP32[$2>>2]|0;
     $51 = $arglist_current11;
     $52 = ((0) + 4|0);
     $expanded56 = $52;
     $expanded55 = (($expanded56) - 1)|0;
     $53 = (($51) + ($expanded55))|0;
     $54 = ((0) + 4|0);
     $expanded60 = $54;
     $expanded59 = (($expanded60) - 1)|0;
     $expanded58 = $expanded59 ^ -1;
     $55 = $53 & $expanded58;
     $56 = $55;
     $57 = HEAP32[$56>>2]|0;
     $arglist_next12 = ((($56)) + 4|0);
     HEAP32[$2>>2] = $arglist_next12;
     $58 = $57&65535;
     $59 = $58 << 16 >> 16;
     $60 = ($59|0)<(0);
     $61 = $60 << 31 >> 31;
     $62 = $0;
     $63 = $62;
     HEAP32[$63>>2] = $59;
     $64 = (($62) + 4)|0;
     $65 = $64;
     HEAP32[$65>>2] = $61;
     break L1;
     break;
    }
    case 14:  {
     $arglist_current14 = HEAP32[$2>>2]|0;
     $66 = $arglist_current14;
     $67 = ((0) + 4|0);
     $expanded63 = $67;
     $expanded62 = (($expanded63) - 1)|0;
     $68 = (($66) + ($expanded62))|0;
     $69 = ((0) + 4|0);
     $expanded67 = $69;
     $expanded66 = (($expanded67) - 1)|0;
     $expanded65 = $expanded66 ^ -1;
     $70 = $68 & $expanded65;
     $71 = $70;
     $72 = HEAP32[$71>>2]|0;
     $arglist_next15 = ((($71)) + 4|0);
     HEAP32[$2>>2] = $arglist_next15;
     $$mask31 = $72 & 65535;
     $73 = $0;
     $74 = $73;
     HEAP32[$74>>2] = $$mask31;
     $75 = (($73) + 4)|0;
     $76 = $75;
     HEAP32[$76>>2] = 0;
     break L1;
     break;
    }
    case 15:  {
     $arglist_current17 = HEAP32[$2>>2]|0;
     $77 = $arglist_current17;
     $78 = ((0) + 4|0);
     $expanded70 = $78;
     $expanded69 = (($expanded70) - 1)|0;
     $79 = (($77) + ($expanded69))|0;
     $80 = ((0) + 4|0);
     $expanded74 = $80;
     $expanded73 = (($expanded74) - 1)|0;
     $expanded72 = $expanded73 ^ -1;
     $81 = $79 & $expanded72;
     $82 = $81;
     $83 = HEAP32[$82>>2]|0;
     $arglist_next18 = ((($82)) + 4|0);
     HEAP32[$2>>2] = $arglist_next18;
     $84 = $83&255;
     $85 = $84 << 24 >> 24;
     $86 = ($85|0)<(0);
     $87 = $86 << 31 >> 31;
     $88 = $0;
     $89 = $88;
     HEAP32[$89>>2] = $85;
     $90 = (($88) + 4)|0;
     $91 = $90;
     HEAP32[$91>>2] = $87;
     break L1;
     break;
    }
    case 16:  {
     $arglist_current20 = HEAP32[$2>>2]|0;
     $92 = $arglist_current20;
     $93 = ((0) + 4|0);
     $expanded77 = $93;
     $expanded76 = (($expanded77) - 1)|0;
     $94 = (($92) + ($expanded76))|0;
     $95 = ((0) + 4|0);
     $expanded81 = $95;
     $expanded80 = (($expanded81) - 1)|0;
     $expanded79 = $expanded80 ^ -1;
     $96 = $94 & $expanded79;
     $97 = $96;
     $98 = HEAP32[$97>>2]|0;
     $arglist_next21 = ((($97)) + 4|0);
     HEAP32[$2>>2] = $arglist_next21;
     $$mask = $98 & 255;
     $99 = $0;
     $100 = $99;
     HEAP32[$100>>2] = $$mask;
     $101 = (($99) + 4)|0;
     $102 = $101;
     HEAP32[$102>>2] = 0;
     break L1;
     break;
    }
    case 17:  {
     $arglist_current23 = HEAP32[$2>>2]|0;
     $103 = $arglist_current23;
     $104 = ((0) + 8|0);
     $expanded84 = $104;
     $expanded83 = (($expanded84) - 1)|0;
     $105 = (($103) + ($expanded83))|0;
     $106 = ((0) + 8|0);
     $expanded88 = $106;
     $expanded87 = (($expanded88) - 1)|0;
     $expanded86 = $expanded87 ^ -1;
     $107 = $105 & $expanded86;
     $108 = $107;
     $109 = +HEAPF64[$108>>3];
     $arglist_next24 = ((($108)) + 8|0);
     HEAP32[$2>>2] = $arglist_next24;
     HEAPF64[$0>>3] = $109;
     break L1;
     break;
    }
    case 18:  {
     $arglist_current26 = HEAP32[$2>>2]|0;
     $110 = $arglist_current26;
     $111 = ((0) + 8|0);
     $expanded91 = $111;
     $expanded90 = (($expanded91) - 1)|0;
     $112 = (($110) + ($expanded90))|0;
     $113 = ((0) + 8|0);
     $expanded95 = $113;
     $expanded94 = (($expanded95) - 1)|0;
     $expanded93 = $expanded94 ^ -1;
     $114 = $112 & $expanded93;
     $115 = $114;
     $116 = +HEAPF64[$115>>3];
     $arglist_next27 = ((($115)) + 8|0);
     HEAP32[$2>>2] = $arglist_next27;
     HEAPF64[$0>>3] = $116;
     break L1;
     break;
    }
    default: {
     break L1;
    }
    }
   } while(0);
  }
 } while(0);
 return;
}
function _fmt_x($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $$05$lcssa = 0, $$056 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 $4 = ($0|0)==(0);
 $5 = ($1|0)==(0);
 $6 = $4 & $5;
 if ($6) {
  $$05$lcssa = $2;
 } else {
  $$056 = $2;$15 = $1;$8 = $0;
  while(1) {
   $7 = $8 & 15;
   $9 = (1097 + ($7)|0);
   $10 = HEAP8[$9>>0]|0;
   $11 = $10&255;
   $12 = $11 | $3;
   $13 = $12&255;
   $14 = ((($$056)) + -1|0);
   HEAP8[$14>>0] = $13;
   $16 = (_bitshift64Lshr(($8|0),($15|0),4)|0);
   $17 = tempRet0;
   $18 = ($16|0)==(0);
   $19 = ($17|0)==(0);
   $20 = $18 & $19;
   if ($20) {
    $$05$lcssa = $14;
    break;
   } else {
    $$056 = $14;$15 = $17;$8 = $16;
   }
  }
 }
 return ($$05$lcssa|0);
}
function _fmt_o($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0$lcssa = 0, $$06 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($0|0)==(0);
 $4 = ($1|0)==(0);
 $5 = $3 & $4;
 if ($5) {
  $$0$lcssa = $2;
 } else {
  $$06 = $2;$11 = $1;$7 = $0;
  while(1) {
   $6 = $7&255;
   $8 = $6 & 7;
   $9 = $8 | 48;
   $10 = ((($$06)) + -1|0);
   HEAP8[$10>>0] = $9;
   $12 = (_bitshift64Lshr(($7|0),($11|0),3)|0);
   $13 = tempRet0;
   $14 = ($12|0)==(0);
   $15 = ($13|0)==(0);
   $16 = $14 & $15;
   if ($16) {
    $$0$lcssa = $10;
    break;
   } else {
    $$06 = $10;$11 = $13;$7 = $12;
   }
  }
 }
 return ($$0$lcssa|0);
}
function _fmt_u($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$010$lcssa$off0 = 0, $$012 = 0, $$09$lcssa = 0, $$0914 = 0, $$1$lcssa = 0, $$111 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0;
 var $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($1>>>0)>(0);
 $4 = ($0>>>0)>(4294967295);
 $5 = ($1|0)==(0);
 $6 = $5 & $4;
 $7 = $3 | $6;
 if ($7) {
  $$0914 = $2;$8 = $0;$9 = $1;
  while(1) {
   $10 = (___uremdi3(($8|0),($9|0),10,0)|0);
   $11 = tempRet0;
   $12 = $10&255;
   $13 = $12 | 48;
   $14 = ((($$0914)) + -1|0);
   HEAP8[$14>>0] = $13;
   $15 = (___udivdi3(($8|0),($9|0),10,0)|0);
   $16 = tempRet0;
   $17 = ($9>>>0)>(9);
   $18 = ($8>>>0)>(4294967295);
   $19 = ($9|0)==(9);
   $20 = $19 & $18;
   $21 = $17 | $20;
   if ($21) {
    $$0914 = $14;$8 = $15;$9 = $16;
   } else {
    break;
   }
  }
  $$010$lcssa$off0 = $15;$$09$lcssa = $14;
 } else {
  $$010$lcssa$off0 = $0;$$09$lcssa = $2;
 }
 $22 = ($$010$lcssa$off0|0)==(0);
 if ($22) {
  $$1$lcssa = $$09$lcssa;
 } else {
  $$012 = $$010$lcssa$off0;$$111 = $$09$lcssa;
  while(1) {
   $23 = (($$012>>>0) % 10)&-1;
   $24 = $23 | 48;
   $25 = $24&255;
   $26 = ((($$111)) + -1|0);
   HEAP8[$26>>0] = $25;
   $27 = (($$012>>>0) / 10)&-1;
   $28 = ($$012>>>0)<(10);
   if ($28) {
    $$1$lcssa = $26;
    break;
   } else {
    $$012 = $27;$$111 = $26;
   }
  }
 }
 return ($$1$lcssa|0);
}
function _strerror($0) {
 $0 = $0|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (___pthread_self_85()|0);
 $2 = ((($1)) + 188|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = (___strerror_l($0,$3)|0);
 return ($4|0);
}
function _pad_672($0,$1,$2,$3,$4) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 var $$0$lcssa = 0, $$011 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 256|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(256|0);
 $5 = sp;
 $6 = $4 & 73728;
 $7 = ($6|0)==(0);
 $8 = ($2|0)>($3|0);
 $or$cond = $8 & $7;
 if ($or$cond) {
  $9 = (($2) - ($3))|0;
  $10 = ($9>>>0)<(256);
  $11 = $10 ? $9 : 256;
  _memset(($5|0),($1|0),($11|0))|0;
  $12 = ($9>>>0)>(255);
  if ($12) {
   $13 = (($2) - ($3))|0;
   $$011 = $9;
   while(1) {
    _out_666($0,$5,256);
    $14 = (($$011) + -256)|0;
    $15 = ($14>>>0)>(255);
    if ($15) {
     $$011 = $14;
    } else {
     break;
    }
   }
   $16 = $13 & 255;
   $$0$lcssa = $16;
  } else {
   $$0$lcssa = $9;
  }
  _out_666($0,$5,$$0$lcssa);
 }
 STACKTOP = sp;return;
}
function _wctomb($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$0 = 0, $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = ($0|0)==(0|0);
 if ($2) {
  $$0 = 0;
 } else {
  $3 = (_wcrtomb($0,$1,0)|0);
  $$0 = $3;
 }
 return ($$0|0);
}
function _fmt_fp($0,$1,$2,$3,$4,$5) {
 $0 = $0|0;
 $1 = +$1;
 $2 = $2|0;
 $3 = $3|0;
 $4 = $4|0;
 $5 = $5|0;
 var $$ = 0, $$$ = 0, $$$$564 = 0.0, $$$3484 = 0, $$$3484699 = 0, $$$3484700 = 0, $$$3501 = 0, $$$4502 = 0, $$$543 = 0.0, $$$564 = 0.0, $$0 = 0, $$0463$lcssa = 0, $$0463587 = 0, $$0464597 = 0, $$0471 = 0.0, $$0479 = 0, $$0487644 = 0, $$0488 = 0, $$0488655 = 0, $$0488657 = 0;
 var $$0496$$9 = 0, $$0497656 = 0, $$0498 = 0, $$0509585 = 0.0, $$0510 = 0, $$0511 = 0, $$0514639 = 0, $$0520 = 0, $$0521 = 0, $$0521$ = 0, $$0523 = 0, $$0527 = 0, $$0527$in633 = 0, $$0530638 = 0, $$1465 = 0, $$1467 = 0.0, $$1469 = 0.0, $$1472 = 0.0, $$1480 = 0, $$1482$lcssa = 0;
 var $$1482663 = 0, $$1489643 = 0, $$1499$lcssa = 0, $$1499662 = 0, $$1508586 = 0, $$1512$lcssa = 0, $$1512610 = 0, $$1515 = 0, $$1524 = 0, $$1526 = 0, $$1528617 = 0, $$1531$lcssa = 0, $$1531632 = 0, $$1601 = 0, $$2 = 0, $$2473 = 0.0, $$2476 = 0, $$2476$$549 = 0, $$2476$$551 = 0, $$2483$ph = 0;
 var $$2500 = 0, $$2513 = 0, $$2516621 = 0, $$2529 = 0, $$2532620 = 0, $$3 = 0.0, $$3477 = 0, $$3484$lcssa = 0, $$3484650 = 0, $$3501$lcssa = 0, $$3501649 = 0, $$3533616 = 0, $$4 = 0.0, $$4478$lcssa = 0, $$4478593 = 0, $$4492 = 0, $$4502 = 0, $$4518 = 0, $$5$lcssa = 0, $$534$ = 0;
 var $$540 = 0, $$540$ = 0, $$543 = 0.0, $$548 = 0, $$5486$lcssa = 0, $$5486626 = 0, $$5493600 = 0, $$550 = 0, $$5519$ph = 0, $$557 = 0, $$5605 = 0, $$561 = 0, $$564 = 0.0, $$6 = 0, $$6494592 = 0, $$7495604 = 0, $$7505 = 0, $$7505$ = 0, $$7505$ph = 0, $$8 = 0;
 var $$9$ph = 0, $$lcssa675 = 0, $$neg = 0, $$neg568 = 0, $$pn = 0, $$pr = 0, $$pr566 = 0, $$pre = 0, $$pre$phi691Z2D = 0, $$pre$phi698Z2D = 0, $$pre690 = 0, $$pre693 = 0, $$pre697 = 0, $$sink = 0, $$sink547$lcssa = 0, $$sink547625 = 0, $$sink560 = 0, $10 = 0, $100 = 0, $101 = 0;
 var $102 = 0, $103 = 0, $104 = 0, $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0.0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0.0, $119 = 0.0, $12 = 0;
 var $120 = 0.0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0;
 var $139 = 0, $14 = 0.0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0;
 var $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0;
 var $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0;
 var $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0;
 var $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0;
 var $23 = 0, $230 = 0, $231 = 0.0, $232 = 0.0, $233 = 0, $234 = 0.0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0;
 var $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0;
 var $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0;
 var $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $30 = 0, $300 = 0, $301 = 0;
 var $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0;
 var $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0;
 var $339 = 0, $34 = 0.0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0.0, $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0;
 var $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0, $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0;
 var $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0, $389 = 0, $39 = 0, $390 = 0, $391 = 0, $40 = 0;
 var $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $50 = 0.0, $51 = 0, $52 = 0, $53 = 0, $54 = 0.0, $55 = 0.0, $56 = 0.0, $57 = 0.0, $58 = 0.0, $59 = 0.0, $6 = 0;
 var $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0;
 var $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0.0, $88 = 0.0, $89 = 0.0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0;
 var $97 = 0, $98 = 0, $99 = 0, $not$ = 0, $or$cond = 0, $or$cond3$not = 0, $or$cond542 = 0, $or$cond545 = 0, $or$cond556 = 0, $or$cond6 = 0, $scevgep686 = 0, $scevgep686687 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 560|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(560|0);
 $6 = sp + 8|0;
 $7 = sp;
 $8 = sp + 524|0;
 $9 = $8;
 $10 = sp + 512|0;
 HEAP32[$7>>2] = 0;
 $11 = ((($10)) + 12|0);
 (___DOUBLE_BITS_673($1)|0);
 $12 = tempRet0;
 $13 = ($12|0)<(0);
 if ($13) {
  $14 = - $1;
  $$0471 = $14;$$0520 = 1;$$0521 = 1062;
 } else {
  $15 = $4 & 2048;
  $16 = ($15|0)==(0);
  $17 = $4 & 1;
  $18 = ($17|0)==(0);
  $$ = $18 ? (1063) : (1068);
  $$$ = $16 ? $$ : (1065);
  $19 = $4 & 2049;
  $20 = ($19|0)!=(0);
  $$534$ = $20&1;
  $$0471 = $1;$$0520 = $$534$;$$0521 = $$$;
 }
 (___DOUBLE_BITS_673($$0471)|0);
 $21 = tempRet0;
 $22 = $21 & 2146435072;
 $23 = (0)==(0);
 $24 = ($22|0)==(2146435072);
 $25 = $23 & $24;
 do {
  if ($25) {
   $26 = $5 & 32;
   $27 = ($26|0)!=(0);
   $28 = $27 ? 1081 : 1085;
   $29 = ($$0471 != $$0471) | (0.0 != 0.0);
   $30 = $27 ? 1089 : 1093;
   $$0510 = $29 ? $30 : $28;
   $31 = (($$0520) + 3)|0;
   $32 = $4 & -65537;
   _pad_672($0,32,$2,$31,$32);
   _out_666($0,$$0521,$$0520);
   _out_666($0,$$0510,3);
   $33 = $4 ^ 8192;
   _pad_672($0,32,$2,$31,$33);
   $$sink560 = $31;
  } else {
   $34 = (+_frexpl($$0471,$7));
   $35 = $34 * 2.0;
   $36 = $35 != 0.0;
   if ($36) {
    $37 = HEAP32[$7>>2]|0;
    $38 = (($37) + -1)|0;
    HEAP32[$7>>2] = $38;
   }
   $39 = $5 | 32;
   $40 = ($39|0)==(97);
   if ($40) {
    $41 = $5 & 32;
    $42 = ($41|0)==(0);
    $43 = ((($$0521)) + 9|0);
    $$0521$ = $42 ? $$0521 : $43;
    $44 = $$0520 | 2;
    $45 = ($3>>>0)>(11);
    $46 = (12 - ($3))|0;
    $47 = ($46|0)==(0);
    $48 = $45 | $47;
    do {
     if ($48) {
      $$1472 = $35;
     } else {
      $$0509585 = 8.0;$$1508586 = $46;
      while(1) {
       $49 = (($$1508586) + -1)|0;
       $50 = $$0509585 * 16.0;
       $51 = ($49|0)==(0);
       if ($51) {
        break;
       } else {
        $$0509585 = $50;$$1508586 = $49;
       }
      }
      $52 = HEAP8[$$0521$>>0]|0;
      $53 = ($52<<24>>24)==(45);
      if ($53) {
       $54 = - $35;
       $55 = $54 - $50;
       $56 = $50 + $55;
       $57 = - $56;
       $$1472 = $57;
       break;
      } else {
       $58 = $35 + $50;
       $59 = $58 - $50;
       $$1472 = $59;
       break;
      }
     }
    } while(0);
    $60 = HEAP32[$7>>2]|0;
    $61 = ($60|0)<(0);
    $62 = (0 - ($60))|0;
    $63 = $61 ? $62 : $60;
    $64 = ($63|0)<(0);
    $65 = $64 << 31 >> 31;
    $66 = (_fmt_u($63,$65,$11)|0);
    $67 = ($66|0)==($11|0);
    if ($67) {
     $68 = ((($10)) + 11|0);
     HEAP8[$68>>0] = 48;
     $$0511 = $68;
    } else {
     $$0511 = $66;
    }
    $69 = $60 >> 31;
    $70 = $69 & 2;
    $71 = (($70) + 43)|0;
    $72 = $71&255;
    $73 = ((($$0511)) + -1|0);
    HEAP8[$73>>0] = $72;
    $74 = (($5) + 15)|0;
    $75 = $74&255;
    $76 = ((($$0511)) + -2|0);
    HEAP8[$76>>0] = $75;
    $77 = ($3|0)<(1);
    $78 = $4 & 8;
    $79 = ($78|0)==(0);
    $$0523 = $8;$$2473 = $$1472;
    while(1) {
     $80 = (~~(($$2473)));
     $81 = (1097 + ($80)|0);
     $82 = HEAP8[$81>>0]|0;
     $83 = $82&255;
     $84 = $41 | $83;
     $85 = $84&255;
     $86 = ((($$0523)) + 1|0);
     HEAP8[$$0523>>0] = $85;
     $87 = (+($80|0));
     $88 = $$2473 - $87;
     $89 = $88 * 16.0;
     $90 = $86;
     $91 = (($90) - ($9))|0;
     $92 = ($91|0)==(1);
     if ($92) {
      $93 = $89 == 0.0;
      $or$cond3$not = $77 & $93;
      $or$cond = $79 & $or$cond3$not;
      if ($or$cond) {
       $$1524 = $86;
      } else {
       $94 = ((($$0523)) + 2|0);
       HEAP8[$86>>0] = 46;
       $$1524 = $94;
      }
     } else {
      $$1524 = $86;
     }
     $95 = $89 != 0.0;
     if ($95) {
      $$0523 = $$1524;$$2473 = $89;
     } else {
      break;
     }
    }
    $96 = ($3|0)==(0);
    $$pre693 = $$1524;
    if ($96) {
     label = 24;
    } else {
     $97 = (-2 - ($9))|0;
     $98 = (($97) + ($$pre693))|0;
     $99 = ($98|0)<($3|0);
     if ($99) {
      $100 = (($3) + 2)|0;
      $$pre690 = (($$pre693) - ($9))|0;
      $$pre$phi691Z2D = $$pre690;$$sink = $100;
     } else {
      label = 24;
     }
    }
    if ((label|0) == 24) {
     $101 = (($$pre693) - ($9))|0;
     $$pre$phi691Z2D = $101;$$sink = $101;
    }
    $102 = $11;
    $103 = $76;
    $104 = (($102) - ($103))|0;
    $105 = (($104) + ($44))|0;
    $106 = (($105) + ($$sink))|0;
    _pad_672($0,32,$2,$106,$4);
    _out_666($0,$$0521$,$44);
    $107 = $4 ^ 65536;
    _pad_672($0,48,$2,$106,$107);
    _out_666($0,$8,$$pre$phi691Z2D);
    $108 = (($$sink) - ($$pre$phi691Z2D))|0;
    _pad_672($0,48,$108,0,0);
    _out_666($0,$76,$104);
    $109 = $4 ^ 8192;
    _pad_672($0,32,$2,$106,$109);
    $$sink560 = $106;
    break;
   }
   $110 = ($3|0)<(0);
   $$540 = $110 ? 6 : $3;
   if ($36) {
    $111 = $35 * 268435456.0;
    $112 = HEAP32[$7>>2]|0;
    $113 = (($112) + -28)|0;
    HEAP32[$7>>2] = $113;
    $$3 = $111;$$pr = $113;
   } else {
    $$pre = HEAP32[$7>>2]|0;
    $$3 = $35;$$pr = $$pre;
   }
   $114 = ($$pr|0)<(0);
   $115 = ((($6)) + 288|0);
   $$561 = $114 ? $6 : $115;
   $$0498 = $$561;$$4 = $$3;
   while(1) {
    $116 = (~~(($$4))>>>0);
    HEAP32[$$0498>>2] = $116;
    $117 = ((($$0498)) + 4|0);
    $118 = (+($116>>>0));
    $119 = $$4 - $118;
    $120 = $119 * 1.0E+9;
    $121 = $120 != 0.0;
    if ($121) {
     $$0498 = $117;$$4 = $120;
    } else {
     break;
    }
   }
   $122 = ($$pr|0)>(0);
   if ($122) {
    $$1482663 = $$561;$$1499662 = $117;$124 = $$pr;
    while(1) {
     $123 = ($124|0)<(29);
     $125 = $123 ? $124 : 29;
     $$0488655 = ((($$1499662)) + -4|0);
     $126 = ($$0488655>>>0)<($$1482663>>>0);
     if ($126) {
      $$2483$ph = $$1482663;
     } else {
      $$0488657 = $$0488655;$$0497656 = 0;
      while(1) {
       $127 = HEAP32[$$0488657>>2]|0;
       $128 = (_bitshift64Shl(($127|0),0,($125|0))|0);
       $129 = tempRet0;
       $130 = (_i64Add(($128|0),($129|0),($$0497656|0),0)|0);
       $131 = tempRet0;
       $132 = (___uremdi3(($130|0),($131|0),1000000000,0)|0);
       $133 = tempRet0;
       HEAP32[$$0488657>>2] = $132;
       $134 = (___udivdi3(($130|0),($131|0),1000000000,0)|0);
       $135 = tempRet0;
       $$0488 = ((($$0488657)) + -4|0);
       $136 = ($$0488>>>0)<($$1482663>>>0);
       if ($136) {
        break;
       } else {
        $$0488657 = $$0488;$$0497656 = $134;
       }
      }
      $137 = ($134|0)==(0);
      if ($137) {
       $$2483$ph = $$1482663;
      } else {
       $138 = ((($$1482663)) + -4|0);
       HEAP32[$138>>2] = $134;
       $$2483$ph = $138;
      }
     }
     $$2500 = $$1499662;
     while(1) {
      $139 = ($$2500>>>0)>($$2483$ph>>>0);
      if (!($139)) {
       break;
      }
      $140 = ((($$2500)) + -4|0);
      $141 = HEAP32[$140>>2]|0;
      $142 = ($141|0)==(0);
      if ($142) {
       $$2500 = $140;
      } else {
       break;
      }
     }
     $143 = HEAP32[$7>>2]|0;
     $144 = (($143) - ($125))|0;
     HEAP32[$7>>2] = $144;
     $145 = ($144|0)>(0);
     if ($145) {
      $$1482663 = $$2483$ph;$$1499662 = $$2500;$124 = $144;
     } else {
      $$1482$lcssa = $$2483$ph;$$1499$lcssa = $$2500;$$pr566 = $144;
      break;
     }
    }
   } else {
    $$1482$lcssa = $$561;$$1499$lcssa = $117;$$pr566 = $$pr;
   }
   $146 = ($$pr566|0)<(0);
   if ($146) {
    $147 = (($$540) + 25)|0;
    $148 = (($147|0) / 9)&-1;
    $149 = (($148) + 1)|0;
    $150 = ($39|0)==(102);
    $$3484650 = $$1482$lcssa;$$3501649 = $$1499$lcssa;$152 = $$pr566;
    while(1) {
     $151 = (0 - ($152))|0;
     $153 = ($151|0)<(9);
     $154 = $153 ? $151 : 9;
     $155 = ($$3484650>>>0)<($$3501649>>>0);
     if ($155) {
      $159 = 1 << $154;
      $160 = (($159) + -1)|0;
      $161 = 1000000000 >>> $154;
      $$0487644 = 0;$$1489643 = $$3484650;
      while(1) {
       $162 = HEAP32[$$1489643>>2]|0;
       $163 = $162 & $160;
       $164 = $162 >>> $154;
       $165 = (($164) + ($$0487644))|0;
       HEAP32[$$1489643>>2] = $165;
       $166 = Math_imul($163, $161)|0;
       $167 = ((($$1489643)) + 4|0);
       $168 = ($167>>>0)<($$3501649>>>0);
       if ($168) {
        $$0487644 = $166;$$1489643 = $167;
       } else {
        break;
       }
      }
      $169 = HEAP32[$$3484650>>2]|0;
      $170 = ($169|0)==(0);
      $171 = ((($$3484650)) + 4|0);
      $$$3484 = $170 ? $171 : $$3484650;
      $172 = ($166|0)==(0);
      if ($172) {
       $$$3484700 = $$$3484;$$4502 = $$3501649;
      } else {
       $173 = ((($$3501649)) + 4|0);
       HEAP32[$$3501649>>2] = $166;
       $$$3484700 = $$$3484;$$4502 = $173;
      }
     } else {
      $156 = HEAP32[$$3484650>>2]|0;
      $157 = ($156|0)==(0);
      $158 = ((($$3484650)) + 4|0);
      $$$3484699 = $157 ? $158 : $$3484650;
      $$$3484700 = $$$3484699;$$4502 = $$3501649;
     }
     $174 = $150 ? $$561 : $$$3484700;
     $175 = $$4502;
     $176 = $174;
     $177 = (($175) - ($176))|0;
     $178 = $177 >> 2;
     $179 = ($178|0)>($149|0);
     $180 = (($174) + ($149<<2)|0);
     $$$4502 = $179 ? $180 : $$4502;
     $181 = HEAP32[$7>>2]|0;
     $182 = (($181) + ($154))|0;
     HEAP32[$7>>2] = $182;
     $183 = ($182|0)<(0);
     if ($183) {
      $$3484650 = $$$3484700;$$3501649 = $$$4502;$152 = $182;
     } else {
      $$3484$lcssa = $$$3484700;$$3501$lcssa = $$$4502;
      break;
     }
    }
   } else {
    $$3484$lcssa = $$1482$lcssa;$$3501$lcssa = $$1499$lcssa;
   }
   $184 = ($$3484$lcssa>>>0)<($$3501$lcssa>>>0);
   $185 = $$561;
   if ($184) {
    $186 = $$3484$lcssa;
    $187 = (($185) - ($186))|0;
    $188 = $187 >> 2;
    $189 = ($188*9)|0;
    $190 = HEAP32[$$3484$lcssa>>2]|0;
    $191 = ($190>>>0)<(10);
    if ($191) {
     $$1515 = $189;
    } else {
     $$0514639 = $189;$$0530638 = 10;
     while(1) {
      $192 = ($$0530638*10)|0;
      $193 = (($$0514639) + 1)|0;
      $194 = ($190>>>0)<($192>>>0);
      if ($194) {
       $$1515 = $193;
       break;
      } else {
       $$0514639 = $193;$$0530638 = $192;
      }
     }
    }
   } else {
    $$1515 = 0;
   }
   $195 = ($39|0)!=(102);
   $196 = $195 ? $$1515 : 0;
   $197 = (($$540) - ($196))|0;
   $198 = ($39|0)==(103);
   $199 = ($$540|0)!=(0);
   $200 = $199 & $198;
   $$neg = $200 << 31 >> 31;
   $201 = (($197) + ($$neg))|0;
   $202 = $$3501$lcssa;
   $203 = (($202) - ($185))|0;
   $204 = $203 >> 2;
   $205 = ($204*9)|0;
   $206 = (($205) + -9)|0;
   $207 = ($201|0)<($206|0);
   if ($207) {
    $208 = ((($$561)) + 4|0);
    $209 = (($201) + 9216)|0;
    $210 = (($209|0) / 9)&-1;
    $211 = (($210) + -1024)|0;
    $212 = (($208) + ($211<<2)|0);
    $213 = (($209|0) % 9)&-1;
    $214 = ($213|0)<(8);
    if ($214) {
     $$0527$in633 = $213;$$1531632 = 10;
     while(1) {
      $$0527 = (($$0527$in633) + 1)|0;
      $215 = ($$1531632*10)|0;
      $216 = ($$0527$in633|0)<(7);
      if ($216) {
       $$0527$in633 = $$0527;$$1531632 = $215;
      } else {
       $$1531$lcssa = $215;
       break;
      }
     }
    } else {
     $$1531$lcssa = 10;
    }
    $217 = HEAP32[$212>>2]|0;
    $218 = (($217>>>0) % ($$1531$lcssa>>>0))&-1;
    $219 = ($218|0)==(0);
    $220 = ((($212)) + 4|0);
    $221 = ($220|0)==($$3501$lcssa|0);
    $or$cond542 = $221 & $219;
    if ($or$cond542) {
     $$4492 = $212;$$4518 = $$1515;$$8 = $$3484$lcssa;
    } else {
     $222 = (($217>>>0) / ($$1531$lcssa>>>0))&-1;
     $223 = $222 & 1;
     $224 = ($223|0)==(0);
     $$543 = $224 ? 9007199254740992.0 : 9007199254740994.0;
     $225 = (($$1531$lcssa|0) / 2)&-1;
     $226 = ($218>>>0)<($225>>>0);
     $227 = ($218|0)==($225|0);
     $or$cond545 = $221 & $227;
     $$564 = $or$cond545 ? 1.0 : 1.5;
     $$$564 = $226 ? 0.5 : $$564;
     $228 = ($$0520|0)==(0);
     if ($228) {
      $$1467 = $$$564;$$1469 = $$543;
     } else {
      $229 = HEAP8[$$0521>>0]|0;
      $230 = ($229<<24>>24)==(45);
      $231 = - $$543;
      $232 = - $$$564;
      $$$543 = $230 ? $231 : $$543;
      $$$$564 = $230 ? $232 : $$$564;
      $$1467 = $$$$564;$$1469 = $$$543;
     }
     $233 = (($217) - ($218))|0;
     HEAP32[$212>>2] = $233;
     $234 = $$1469 + $$1467;
     $235 = $234 != $$1469;
     if ($235) {
      $236 = (($233) + ($$1531$lcssa))|0;
      HEAP32[$212>>2] = $236;
      $237 = ($236>>>0)>(999999999);
      if ($237) {
       $$5486626 = $$3484$lcssa;$$sink547625 = $212;
       while(1) {
        $238 = ((($$sink547625)) + -4|0);
        HEAP32[$$sink547625>>2] = 0;
        $239 = ($238>>>0)<($$5486626>>>0);
        if ($239) {
         $240 = ((($$5486626)) + -4|0);
         HEAP32[$240>>2] = 0;
         $$6 = $240;
        } else {
         $$6 = $$5486626;
        }
        $241 = HEAP32[$238>>2]|0;
        $242 = (($241) + 1)|0;
        HEAP32[$238>>2] = $242;
        $243 = ($242>>>0)>(999999999);
        if ($243) {
         $$5486626 = $$6;$$sink547625 = $238;
        } else {
         $$5486$lcssa = $$6;$$sink547$lcssa = $238;
         break;
        }
       }
      } else {
       $$5486$lcssa = $$3484$lcssa;$$sink547$lcssa = $212;
      }
      $244 = $$5486$lcssa;
      $245 = (($185) - ($244))|0;
      $246 = $245 >> 2;
      $247 = ($246*9)|0;
      $248 = HEAP32[$$5486$lcssa>>2]|0;
      $249 = ($248>>>0)<(10);
      if ($249) {
       $$4492 = $$sink547$lcssa;$$4518 = $247;$$8 = $$5486$lcssa;
      } else {
       $$2516621 = $247;$$2532620 = 10;
       while(1) {
        $250 = ($$2532620*10)|0;
        $251 = (($$2516621) + 1)|0;
        $252 = ($248>>>0)<($250>>>0);
        if ($252) {
         $$4492 = $$sink547$lcssa;$$4518 = $251;$$8 = $$5486$lcssa;
         break;
        } else {
         $$2516621 = $251;$$2532620 = $250;
        }
       }
      }
     } else {
      $$4492 = $212;$$4518 = $$1515;$$8 = $$3484$lcssa;
     }
    }
    $253 = ((($$4492)) + 4|0);
    $254 = ($$3501$lcssa>>>0)>($253>>>0);
    $$$3501 = $254 ? $253 : $$3501$lcssa;
    $$5519$ph = $$4518;$$7505$ph = $$$3501;$$9$ph = $$8;
   } else {
    $$5519$ph = $$1515;$$7505$ph = $$3501$lcssa;$$9$ph = $$3484$lcssa;
   }
   $$7505 = $$7505$ph;
   while(1) {
    $255 = ($$7505>>>0)>($$9$ph>>>0);
    if (!($255)) {
     $$lcssa675 = 0;
     break;
    }
    $256 = ((($$7505)) + -4|0);
    $257 = HEAP32[$256>>2]|0;
    $258 = ($257|0)==(0);
    if ($258) {
     $$7505 = $256;
    } else {
     $$lcssa675 = 1;
     break;
    }
   }
   $259 = (0 - ($$5519$ph))|0;
   do {
    if ($198) {
     $not$ = $199 ^ 1;
     $260 = $not$&1;
     $$540$ = (($$540) + ($260))|0;
     $261 = ($$540$|0)>($$5519$ph|0);
     $262 = ($$5519$ph|0)>(-5);
     $or$cond6 = $261 & $262;
     if ($or$cond6) {
      $263 = (($5) + -1)|0;
      $$neg568 = (($$540$) + -1)|0;
      $264 = (($$neg568) - ($$5519$ph))|0;
      $$0479 = $263;$$2476 = $264;
     } else {
      $265 = (($5) + -2)|0;
      $266 = (($$540$) + -1)|0;
      $$0479 = $265;$$2476 = $266;
     }
     $267 = $4 & 8;
     $268 = ($267|0)==(0);
     if ($268) {
      if ($$lcssa675) {
       $269 = ((($$7505)) + -4|0);
       $270 = HEAP32[$269>>2]|0;
       $271 = ($270|0)==(0);
       if ($271) {
        $$2529 = 9;
       } else {
        $272 = (($270>>>0) % 10)&-1;
        $273 = ($272|0)==(0);
        if ($273) {
         $$1528617 = 0;$$3533616 = 10;
         while(1) {
          $274 = ($$3533616*10)|0;
          $275 = (($$1528617) + 1)|0;
          $276 = (($270>>>0) % ($274>>>0))&-1;
          $277 = ($276|0)==(0);
          if ($277) {
           $$1528617 = $275;$$3533616 = $274;
          } else {
           $$2529 = $275;
           break;
          }
         }
        } else {
         $$2529 = 0;
        }
       }
      } else {
       $$2529 = 9;
      }
      $278 = $$0479 | 32;
      $279 = ($278|0)==(102);
      $280 = $$7505;
      $281 = (($280) - ($185))|0;
      $282 = $281 >> 2;
      $283 = ($282*9)|0;
      $284 = (($283) + -9)|0;
      if ($279) {
       $285 = (($284) - ($$2529))|0;
       $286 = ($285|0)>(0);
       $$548 = $286 ? $285 : 0;
       $287 = ($$2476|0)<($$548|0);
       $$2476$$549 = $287 ? $$2476 : $$548;
       $$1480 = $$0479;$$3477 = $$2476$$549;$$pre$phi698Z2D = 0;
       break;
      } else {
       $288 = (($284) + ($$5519$ph))|0;
       $289 = (($288) - ($$2529))|0;
       $290 = ($289|0)>(0);
       $$550 = $290 ? $289 : 0;
       $291 = ($$2476|0)<($$550|0);
       $$2476$$551 = $291 ? $$2476 : $$550;
       $$1480 = $$0479;$$3477 = $$2476$$551;$$pre$phi698Z2D = 0;
       break;
      }
     } else {
      $$1480 = $$0479;$$3477 = $$2476;$$pre$phi698Z2D = $267;
     }
    } else {
     $$pre697 = $4 & 8;
     $$1480 = $5;$$3477 = $$540;$$pre$phi698Z2D = $$pre697;
    }
   } while(0);
   $292 = $$3477 | $$pre$phi698Z2D;
   $293 = ($292|0)!=(0);
   $294 = $293&1;
   $295 = $$1480 | 32;
   $296 = ($295|0)==(102);
   if ($296) {
    $297 = ($$5519$ph|0)>(0);
    $298 = $297 ? $$5519$ph : 0;
    $$2513 = 0;$$pn = $298;
   } else {
    $299 = ($$5519$ph|0)<(0);
    $300 = $299 ? $259 : $$5519$ph;
    $301 = ($300|0)<(0);
    $302 = $301 << 31 >> 31;
    $303 = (_fmt_u($300,$302,$11)|0);
    $304 = $11;
    $305 = $303;
    $306 = (($304) - ($305))|0;
    $307 = ($306|0)<(2);
    if ($307) {
     $$1512610 = $303;
     while(1) {
      $308 = ((($$1512610)) + -1|0);
      HEAP8[$308>>0] = 48;
      $309 = $308;
      $310 = (($304) - ($309))|0;
      $311 = ($310|0)<(2);
      if ($311) {
       $$1512610 = $308;
      } else {
       $$1512$lcssa = $308;
       break;
      }
     }
    } else {
     $$1512$lcssa = $303;
    }
    $312 = $$5519$ph >> 31;
    $313 = $312 & 2;
    $314 = (($313) + 43)|0;
    $315 = $314&255;
    $316 = ((($$1512$lcssa)) + -1|0);
    HEAP8[$316>>0] = $315;
    $317 = $$1480&255;
    $318 = ((($$1512$lcssa)) + -2|0);
    HEAP8[$318>>0] = $317;
    $319 = $318;
    $320 = (($304) - ($319))|0;
    $$2513 = $318;$$pn = $320;
   }
   $321 = (($$0520) + 1)|0;
   $322 = (($321) + ($$3477))|0;
   $$1526 = (($322) + ($294))|0;
   $323 = (($$1526) + ($$pn))|0;
   _pad_672($0,32,$2,$323,$4);
   _out_666($0,$$0521,$$0520);
   $324 = $4 ^ 65536;
   _pad_672($0,48,$2,$323,$324);
   if ($296) {
    $325 = ($$9$ph>>>0)>($$561>>>0);
    $$0496$$9 = $325 ? $$561 : $$9$ph;
    $326 = ((($8)) + 9|0);
    $327 = $326;
    $328 = ((($8)) + 8|0);
    $$5493600 = $$0496$$9;
    while(1) {
     $329 = HEAP32[$$5493600>>2]|0;
     $330 = (_fmt_u($329,0,$326)|0);
     $331 = ($$5493600|0)==($$0496$$9|0);
     if ($331) {
      $337 = ($330|0)==($326|0);
      if ($337) {
       HEAP8[$328>>0] = 48;
       $$1465 = $328;
      } else {
       $$1465 = $330;
      }
     } else {
      $332 = ($330>>>0)>($8>>>0);
      if ($332) {
       $333 = $330;
       $334 = (($333) - ($9))|0;
       _memset(($8|0),48,($334|0))|0;
       $$0464597 = $330;
       while(1) {
        $335 = ((($$0464597)) + -1|0);
        $336 = ($335>>>0)>($8>>>0);
        if ($336) {
         $$0464597 = $335;
        } else {
         $$1465 = $335;
         break;
        }
       }
      } else {
       $$1465 = $330;
      }
     }
     $338 = $$1465;
     $339 = (($327) - ($338))|0;
     _out_666($0,$$1465,$339);
     $340 = ((($$5493600)) + 4|0);
     $341 = ($340>>>0)>($$561>>>0);
     if ($341) {
      break;
     } else {
      $$5493600 = $340;
     }
    }
    $342 = ($292|0)==(0);
    if (!($342)) {
     _out_666($0,1113,1);
    }
    $343 = ($340>>>0)<($$7505>>>0);
    $344 = ($$3477|0)>(0);
    $345 = $343 & $344;
    if ($345) {
     $$4478593 = $$3477;$$6494592 = $340;
     while(1) {
      $346 = HEAP32[$$6494592>>2]|0;
      $347 = (_fmt_u($346,0,$326)|0);
      $348 = ($347>>>0)>($8>>>0);
      if ($348) {
       $349 = $347;
       $350 = (($349) - ($9))|0;
       _memset(($8|0),48,($350|0))|0;
       $$0463587 = $347;
       while(1) {
        $351 = ((($$0463587)) + -1|0);
        $352 = ($351>>>0)>($8>>>0);
        if ($352) {
         $$0463587 = $351;
        } else {
         $$0463$lcssa = $351;
         break;
        }
       }
      } else {
       $$0463$lcssa = $347;
      }
      $353 = ($$4478593|0)<(9);
      $354 = $353 ? $$4478593 : 9;
      _out_666($0,$$0463$lcssa,$354);
      $355 = ((($$6494592)) + 4|0);
      $356 = (($$4478593) + -9)|0;
      $357 = ($355>>>0)<($$7505>>>0);
      $358 = ($$4478593|0)>(9);
      $359 = $357 & $358;
      if ($359) {
       $$4478593 = $356;$$6494592 = $355;
      } else {
       $$4478$lcssa = $356;
       break;
      }
     }
    } else {
     $$4478$lcssa = $$3477;
    }
    $360 = (($$4478$lcssa) + 9)|0;
    _pad_672($0,48,$360,9,0);
   } else {
    $361 = ((($$9$ph)) + 4|0);
    $$7505$ = $$lcssa675 ? $$7505 : $361;
    $362 = ($$3477|0)>(-1);
    if ($362) {
     $363 = ((($8)) + 9|0);
     $364 = ($$pre$phi698Z2D|0)==(0);
     $365 = $363;
     $366 = (0 - ($9))|0;
     $367 = ((($8)) + 8|0);
     $$5605 = $$3477;$$7495604 = $$9$ph;
     while(1) {
      $368 = HEAP32[$$7495604>>2]|0;
      $369 = (_fmt_u($368,0,$363)|0);
      $370 = ($369|0)==($363|0);
      if ($370) {
       HEAP8[$367>>0] = 48;
       $$0 = $367;
      } else {
       $$0 = $369;
      }
      $371 = ($$7495604|0)==($$9$ph|0);
      do {
       if ($371) {
        $375 = ((($$0)) + 1|0);
        _out_666($0,$$0,1);
        $376 = ($$5605|0)<(1);
        $or$cond556 = $364 & $376;
        if ($or$cond556) {
         $$2 = $375;
         break;
        }
        _out_666($0,1113,1);
        $$2 = $375;
       } else {
        $372 = ($$0>>>0)>($8>>>0);
        if (!($372)) {
         $$2 = $$0;
         break;
        }
        $scevgep686 = (($$0) + ($366)|0);
        $scevgep686687 = $scevgep686;
        _memset(($8|0),48,($scevgep686687|0))|0;
        $$1601 = $$0;
        while(1) {
         $373 = ((($$1601)) + -1|0);
         $374 = ($373>>>0)>($8>>>0);
         if ($374) {
          $$1601 = $373;
         } else {
          $$2 = $373;
          break;
         }
        }
       }
      } while(0);
      $377 = $$2;
      $378 = (($365) - ($377))|0;
      $379 = ($$5605|0)>($378|0);
      $380 = $379 ? $378 : $$5605;
      _out_666($0,$$2,$380);
      $381 = (($$5605) - ($378))|0;
      $382 = ((($$7495604)) + 4|0);
      $383 = ($382>>>0)<($$7505$>>>0);
      $384 = ($381|0)>(-1);
      $385 = $383 & $384;
      if ($385) {
       $$5605 = $381;$$7495604 = $382;
      } else {
       $$5$lcssa = $381;
       break;
      }
     }
    } else {
     $$5$lcssa = $$3477;
    }
    $386 = (($$5$lcssa) + 18)|0;
    _pad_672($0,48,$386,18,0);
    $387 = $11;
    $388 = $$2513;
    $389 = (($387) - ($388))|0;
    _out_666($0,$$2513,$389);
   }
   $390 = $4 ^ 8192;
   _pad_672($0,32,$2,$323,$390);
   $$sink560 = $323;
  }
 } while(0);
 $391 = ($$sink560|0)<($2|0);
 $$557 = $391 ? $2 : $$sink560;
 STACKTOP = sp;return ($$557|0);
}
function ___DOUBLE_BITS_673($0) {
 $0 = +$0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 HEAPF64[tempDoublePtr>>3] = $0;$1 = HEAP32[tempDoublePtr>>2]|0;
 $2 = HEAP32[tempDoublePtr+4>>2]|0;
 tempRet0 = ($2);
 return ($1|0);
}
function _frexpl($0,$1) {
 $0 = +$0;
 $1 = $1|0;
 var $2 = 0.0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = (+_frexp($0,$1));
 return (+$2);
}
function _frexp($0,$1) {
 $0 = +$0;
 $1 = $1|0;
 var $$0 = 0.0, $$016 = 0.0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0.0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0.0, $9 = 0.0, $storemerge = 0, $trunc$clear = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 HEAPF64[tempDoublePtr>>3] = $0;$2 = HEAP32[tempDoublePtr>>2]|0;
 $3 = HEAP32[tempDoublePtr+4>>2]|0;
 $4 = (_bitshift64Lshr(($2|0),($3|0),52)|0);
 $5 = tempRet0;
 $6 = $4&65535;
 $trunc$clear = $6 & 2047;
 switch ($trunc$clear<<16>>16) {
 case 0:  {
  $7 = $0 != 0.0;
  if ($7) {
   $8 = $0 * 1.8446744073709552E+19;
   $9 = (+_frexp($8,$1));
   $10 = HEAP32[$1>>2]|0;
   $11 = (($10) + -64)|0;
   $$016 = $9;$storemerge = $11;
  } else {
   $$016 = $0;$storemerge = 0;
  }
  HEAP32[$1>>2] = $storemerge;
  $$0 = $$016;
  break;
 }
 case 2047:  {
  $$0 = $0;
  break;
 }
 default: {
  $12 = $4 & 2047;
  $13 = (($12) + -1022)|0;
  HEAP32[$1>>2] = $13;
  $14 = $3 & -2146435073;
  $15 = $14 | 1071644672;
  HEAP32[tempDoublePtr>>2] = $2;HEAP32[tempDoublePtr+4>>2] = $15;$16 = +HEAPF64[tempDoublePtr>>3];
  $$0 = $16;
 }
 }
 return (+$$0);
}
function _wcrtomb($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$0 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0;
 var $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0;
 var $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $or$cond = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ($0|0)==(0|0);
 do {
  if ($3) {
   $$0 = 1;
  } else {
   $4 = ($1>>>0)<(128);
   if ($4) {
    $5 = $1&255;
    HEAP8[$0>>0] = $5;
    $$0 = 1;
    break;
   }
   $6 = (___pthread_self_904()|0);
   $7 = ((($6)) + 188|0);
   $8 = HEAP32[$7>>2]|0;
   $9 = HEAP32[$8>>2]|0;
   $10 = ($9|0)==(0|0);
   if ($10) {
    $11 = $1 & -128;
    $12 = ($11|0)==(57216);
    if ($12) {
     $14 = $1&255;
     HEAP8[$0>>0] = $14;
     $$0 = 1;
     break;
    } else {
     $13 = (___errno_location()|0);
     HEAP32[$13>>2] = 84;
     $$0 = -1;
     break;
    }
   }
   $15 = ($1>>>0)<(2048);
   if ($15) {
    $16 = $1 >>> 6;
    $17 = $16 | 192;
    $18 = $17&255;
    $19 = ((($0)) + 1|0);
    HEAP8[$0>>0] = $18;
    $20 = $1 & 63;
    $21 = $20 | 128;
    $22 = $21&255;
    HEAP8[$19>>0] = $22;
    $$0 = 2;
    break;
   }
   $23 = ($1>>>0)<(55296);
   $24 = $1 & -8192;
   $25 = ($24|0)==(57344);
   $or$cond = $23 | $25;
   if ($or$cond) {
    $26 = $1 >>> 12;
    $27 = $26 | 224;
    $28 = $27&255;
    $29 = ((($0)) + 1|0);
    HEAP8[$0>>0] = $28;
    $30 = $1 >>> 6;
    $31 = $30 & 63;
    $32 = $31 | 128;
    $33 = $32&255;
    $34 = ((($0)) + 2|0);
    HEAP8[$29>>0] = $33;
    $35 = $1 & 63;
    $36 = $35 | 128;
    $37 = $36&255;
    HEAP8[$34>>0] = $37;
    $$0 = 3;
    break;
   }
   $38 = (($1) + -65536)|0;
   $39 = ($38>>>0)<(1048576);
   if ($39) {
    $40 = $1 >>> 18;
    $41 = $40 | 240;
    $42 = $41&255;
    $43 = ((($0)) + 1|0);
    HEAP8[$0>>0] = $42;
    $44 = $1 >>> 12;
    $45 = $44 & 63;
    $46 = $45 | 128;
    $47 = $46&255;
    $48 = ((($0)) + 2|0);
    HEAP8[$43>>0] = $47;
    $49 = $1 >>> 6;
    $50 = $49 & 63;
    $51 = $50 | 128;
    $52 = $51&255;
    $53 = ((($0)) + 3|0);
    HEAP8[$48>>0] = $52;
    $54 = $1 & 63;
    $55 = $54 | 128;
    $56 = $55&255;
    HEAP8[$53>>0] = $56;
    $$0 = 4;
    break;
   } else {
    $57 = (___errno_location()|0);
    HEAP32[$57>>2] = 84;
    $$0 = -1;
    break;
   }
  }
 } while(0);
 return ($$0|0);
}
function ___pthread_self_904() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (_pthread_self()|0);
 return ($0|0);
}
function ___pthread_self_85() {
 var $0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $0 = (_pthread_self()|0);
 return ($0|0);
}
function ___strerror_l($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $$012$lcssa = 0, $$01214 = 0, $$016 = 0, $$113 = 0, $$115 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 $$016 = 0;
 while(1) {
  $3 = (1115 + ($$016)|0);
  $4 = HEAP8[$3>>0]|0;
  $5 = $4&255;
  $6 = ($5|0)==($0|0);
  if ($6) {
   label = 2;
   break;
  }
  $7 = (($$016) + 1)|0;
  $8 = ($7|0)==(87);
  if ($8) {
   $$01214 = 1203;$$115 = 87;
   label = 5;
   break;
  } else {
   $$016 = $7;
  }
 }
 if ((label|0) == 2) {
  $2 = ($$016|0)==(0);
  if ($2) {
   $$012$lcssa = 1203;
  } else {
   $$01214 = 1203;$$115 = $$016;
   label = 5;
  }
 }
 if ((label|0) == 5) {
  while(1) {
   label = 0;
   $$113 = $$01214;
   while(1) {
    $9 = HEAP8[$$113>>0]|0;
    $10 = ($9<<24>>24)==(0);
    $11 = ((($$113)) + 1|0);
    if ($10) {
     break;
    } else {
     $$113 = $11;
    }
   }
   $12 = (($$115) + -1)|0;
   $13 = ($12|0)==(0);
   if ($13) {
    $$012$lcssa = $11;
    break;
   } else {
    $$01214 = $11;$$115 = $12;
    label = 5;
   }
  }
 }
 $14 = ((($1)) + 20|0);
 $15 = HEAP32[$14>>2]|0;
 $16 = (___lctrans($$012$lcssa,$15)|0);
 return ($16|0);
}
function ___lctrans($0,$1) {
 $0 = $0|0;
 $1 = $1|0;
 var $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $2 = (___lctrans_impl($0,$1)|0);
 return ($2|0);
}
function _vsnprintf($0,$1,$2,$3) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 $3 = $3|0;
 var $$$015 = 0, $$0 = 0, $$014 = 0, $$015 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0;
 var $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 128|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(128|0);
 $4 = sp + 124|0;
 $5 = sp;
 dest=$5; src=444; stop=dest+124|0; do { HEAP32[dest>>2]=HEAP32[src>>2]|0; dest=dest+4|0; src=src+4|0; } while ((dest|0) < (stop|0));
 $6 = (($1) + -1)|0;
 $7 = ($6>>>0)>(2147483646);
 if ($7) {
  $8 = ($1|0)==(0);
  if ($8) {
   $$014 = $4;$$015 = 1;
   label = 4;
  } else {
   $9 = (___errno_location()|0);
   HEAP32[$9>>2] = 75;
   $$0 = -1;
  }
 } else {
  $$014 = $0;$$015 = $1;
  label = 4;
 }
 if ((label|0) == 4) {
  $10 = $$014;
  $11 = (-2 - ($10))|0;
  $12 = ($$015>>>0)>($11>>>0);
  $$$015 = $12 ? $11 : $$015;
  $13 = ((($5)) + 48|0);
  HEAP32[$13>>2] = $$$015;
  $14 = ((($5)) + 20|0);
  HEAP32[$14>>2] = $$014;
  $15 = ((($5)) + 44|0);
  HEAP32[$15>>2] = $$014;
  $16 = (($$014) + ($$$015)|0);
  $17 = ((($5)) + 16|0);
  HEAP32[$17>>2] = $16;
  $18 = ((($5)) + 28|0);
  HEAP32[$18>>2] = $16;
  $19 = (_vfprintf($5,$2,$3)|0);
  $20 = ($$$015|0)==(0);
  if ($20) {
   $$0 = $19;
  } else {
   $21 = HEAP32[$14>>2]|0;
   $22 = HEAP32[$17>>2]|0;
   $23 = ($21|0)==($22|0);
   $24 = $23 << 31 >> 31;
   $25 = (($21) + ($24)|0);
   HEAP8[$25>>0] = 0;
   $$0 = $19;
  }
 }
 STACKTOP = sp;return ($$0|0);
}
function _sn_write($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $$ = 0, $$cast = 0, $10 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = ((($0)) + 16|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = ((($0)) + 20|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (($4) - ($6))|0;
 $8 = ($7>>>0)>($2>>>0);
 $$ = $8 ? $2 : $7;
 $$cast = $6;
 _memcpy(($$cast|0),($1|0),($$|0))|0;
 $9 = HEAP32[$5>>2]|0;
 $10 = (($9) + ($$)|0);
 HEAP32[$5>>2] = $10;
 return ($2|0);
}
function _sprintf($0,$1,$varargs) {
 $0 = $0|0;
 $1 = $1|0;
 $varargs = $varargs|0;
 var $2 = 0, $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 16|0; if ((STACKTOP|0) >= (STACK_MAX|0)) abortStackOverflow(16|0);
 $2 = sp;
 HEAP32[$2>>2] = $varargs;
 $3 = (_vsprintf($0,$1,$2)|0);
 STACKTOP = sp;return ($3|0);
}
function _vsprintf($0,$1,$2) {
 $0 = $0|0;
 $1 = $1|0;
 $2 = $2|0;
 var $3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $3 = (_vsnprintf($0,2147483647,$1,$2)|0);
 return ($3|0);
}
function runPostSets() {
}
function _i64Add(a, b, c, d) {
    /*
      x = a + b*2^32
      y = c + d*2^32
      result = l + h*2^32
    */
    a = a|0; b = b|0; c = c|0; d = d|0;
    var l = 0, h = 0;
    l = (a + c)>>>0;
    h = (b + d + (((l>>>0) < (a>>>0))|0))>>>0; // Add carry from low word to high word on overflow.
    return ((tempRet0 = h,l|0)|0);
}
function _i64Subtract(a, b, c, d) {
    a = a|0; b = b|0; c = c|0; d = d|0;
    var l = 0, h = 0;
    l = (a - c)>>>0;
    h = (b - d)>>>0;
    h = (b - d - (((c>>>0) > (a>>>0))|0))>>>0; // Borrow one from high word to low word on underflow.
    return ((tempRet0 = h,l|0)|0);
}
function _llvm_cttz_i32(x) {
    x = x|0;
    var ret = 0;
    ret = ((HEAP8[(((cttz_i8)+(x & 0xff))>>0)])|0);
    if ((ret|0) < 8) return ret|0;
    ret = ((HEAP8[(((cttz_i8)+((x >> 8)&0xff))>>0)])|0);
    if ((ret|0) < 8) return (ret + 8)|0;
    ret = ((HEAP8[(((cttz_i8)+((x >> 16)&0xff))>>0)])|0);
    if ((ret|0) < 8) return (ret + 16)|0;
    return (((HEAP8[(((cttz_i8)+(x >>> 24))>>0)])|0) + 24)|0;
}
function ___udivmoddi4($a$0, $a$1, $b$0, $b$1, $rem) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    $rem = $rem | 0;
    var $n_sroa_0_0_extract_trunc = 0, $n_sroa_1_4_extract_shift$0 = 0, $n_sroa_1_4_extract_trunc = 0, $d_sroa_0_0_extract_trunc = 0, $d_sroa_1_4_extract_shift$0 = 0, $d_sroa_1_4_extract_trunc = 0, $4 = 0, $17 = 0, $37 = 0, $49 = 0, $51 = 0, $57 = 0, $58 = 0, $66 = 0, $78 = 0, $86 = 0, $88 = 0, $89 = 0, $91 = 0, $92 = 0, $95 = 0, $105 = 0, $117 = 0, $119 = 0, $125 = 0, $126 = 0, $130 = 0, $q_sroa_1_1_ph = 0, $q_sroa_0_1_ph = 0, $r_sroa_1_1_ph = 0, $r_sroa_0_1_ph = 0, $sr_1_ph = 0, $d_sroa_0_0_insert_insert99$0 = 0, $d_sroa_0_0_insert_insert99$1 = 0, $137$0 = 0, $137$1 = 0, $carry_0203 = 0, $sr_1202 = 0, $r_sroa_0_1201 = 0, $r_sroa_1_1200 = 0, $q_sroa_0_1199 = 0, $q_sroa_1_1198 = 0, $147 = 0, $149 = 0, $r_sroa_0_0_insert_insert42$0 = 0, $r_sroa_0_0_insert_insert42$1 = 0, $150$1 = 0, $151$0 = 0, $152 = 0, $154$0 = 0, $r_sroa_0_0_extract_trunc = 0, $r_sroa_1_4_extract_trunc = 0, $155 = 0, $carry_0_lcssa$0 = 0, $carry_0_lcssa$1 = 0, $r_sroa_0_1_lcssa = 0, $r_sroa_1_1_lcssa = 0, $q_sroa_0_1_lcssa = 0, $q_sroa_1_1_lcssa = 0, $q_sroa_0_0_insert_ext75$0 = 0, $q_sroa_0_0_insert_ext75$1 = 0, $q_sroa_0_0_insert_insert77$1 = 0, $_0$0 = 0, $_0$1 = 0;
    $n_sroa_0_0_extract_trunc = $a$0;
    $n_sroa_1_4_extract_shift$0 = $a$1;
    $n_sroa_1_4_extract_trunc = $n_sroa_1_4_extract_shift$0;
    $d_sroa_0_0_extract_trunc = $b$0;
    $d_sroa_1_4_extract_shift$0 = $b$1;
    $d_sroa_1_4_extract_trunc = $d_sroa_1_4_extract_shift$0;
    if (($n_sroa_1_4_extract_trunc | 0) == 0) {
      $4 = ($rem | 0) != 0;
      if (($d_sroa_1_4_extract_trunc | 0) == 0) {
        if ($4) {
          HEAP32[$rem >> 2] = ($n_sroa_0_0_extract_trunc >>> 0) % ($d_sroa_0_0_extract_trunc >>> 0);
          HEAP32[$rem + 4 >> 2] = 0;
        }
        $_0$1 = 0;
        $_0$0 = ($n_sroa_0_0_extract_trunc >>> 0) / ($d_sroa_0_0_extract_trunc >>> 0) >>> 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      } else {
        if (!$4) {
          $_0$1 = 0;
          $_0$0 = 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        HEAP32[$rem >> 2] = $a$0 & -1;
        HEAP32[$rem + 4 >> 2] = $a$1 & 0;
        $_0$1 = 0;
        $_0$0 = 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      }
    }
    $17 = ($d_sroa_1_4_extract_trunc | 0) == 0;
    do {
      if (($d_sroa_0_0_extract_trunc | 0) == 0) {
        if ($17) {
          if (($rem | 0) != 0) {
            HEAP32[$rem >> 2] = ($n_sroa_1_4_extract_trunc >>> 0) % ($d_sroa_0_0_extract_trunc >>> 0);
            HEAP32[$rem + 4 >> 2] = 0;
          }
          $_0$1 = 0;
          $_0$0 = ($n_sroa_1_4_extract_trunc >>> 0) / ($d_sroa_0_0_extract_trunc >>> 0) >>> 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        if (($n_sroa_0_0_extract_trunc | 0) == 0) {
          if (($rem | 0) != 0) {
            HEAP32[$rem >> 2] = 0;
            HEAP32[$rem + 4 >> 2] = ($n_sroa_1_4_extract_trunc >>> 0) % ($d_sroa_1_4_extract_trunc >>> 0);
          }
          $_0$1 = 0;
          $_0$0 = ($n_sroa_1_4_extract_trunc >>> 0) / ($d_sroa_1_4_extract_trunc >>> 0) >>> 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        $37 = $d_sroa_1_4_extract_trunc - 1 | 0;
        if (($37 & $d_sroa_1_4_extract_trunc | 0) == 0) {
          if (($rem | 0) != 0) {
            HEAP32[$rem >> 2] = 0 | $a$0 & -1;
            HEAP32[$rem + 4 >> 2] = $37 & $n_sroa_1_4_extract_trunc | $a$1 & 0;
          }
          $_0$1 = 0;
          $_0$0 = $n_sroa_1_4_extract_trunc >>> ((_llvm_cttz_i32($d_sroa_1_4_extract_trunc | 0) | 0) >>> 0);
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        $49 = Math_clz32($d_sroa_1_4_extract_trunc | 0) | 0;
        $51 = $49 - (Math_clz32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
        if ($51 >>> 0 <= 30) {
          $57 = $51 + 1 | 0;
          $58 = 31 - $51 | 0;
          $sr_1_ph = $57;
          $r_sroa_0_1_ph = $n_sroa_1_4_extract_trunc << $58 | $n_sroa_0_0_extract_trunc >>> ($57 >>> 0);
          $r_sroa_1_1_ph = $n_sroa_1_4_extract_trunc >>> ($57 >>> 0);
          $q_sroa_0_1_ph = 0;
          $q_sroa_1_1_ph = $n_sroa_0_0_extract_trunc << $58;
          break;
        }
        if (($rem | 0) == 0) {
          $_0$1 = 0;
          $_0$0 = 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        HEAP32[$rem >> 2] = 0 | $a$0 & -1;
        HEAP32[$rem + 4 >> 2] = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
        $_0$1 = 0;
        $_0$0 = 0;
        return (tempRet0 = $_0$1, $_0$0) | 0;
      } else {
        if (!$17) {
          $117 = Math_clz32($d_sroa_1_4_extract_trunc | 0) | 0;
          $119 = $117 - (Math_clz32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
          if ($119 >>> 0 <= 31) {
            $125 = $119 + 1 | 0;
            $126 = 31 - $119 | 0;
            $130 = $119 - 31 >> 31;
            $sr_1_ph = $125;
            $r_sroa_0_1_ph = $n_sroa_0_0_extract_trunc >>> ($125 >>> 0) & $130 | $n_sroa_1_4_extract_trunc << $126;
            $r_sroa_1_1_ph = $n_sroa_1_4_extract_trunc >>> ($125 >>> 0) & $130;
            $q_sroa_0_1_ph = 0;
            $q_sroa_1_1_ph = $n_sroa_0_0_extract_trunc << $126;
            break;
          }
          if (($rem | 0) == 0) {
            $_0$1 = 0;
            $_0$0 = 0;
            return (tempRet0 = $_0$1, $_0$0) | 0;
          }
          HEAP32[$rem >> 2] = 0 | $a$0 & -1;
          HEAP32[$rem + 4 >> 2] = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
          $_0$1 = 0;
          $_0$0 = 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
        $66 = $d_sroa_0_0_extract_trunc - 1 | 0;
        if (($66 & $d_sroa_0_0_extract_trunc | 0) != 0) {
          $86 = (Math_clz32($d_sroa_0_0_extract_trunc | 0) | 0) + 33 | 0;
          $88 = $86 - (Math_clz32($n_sroa_1_4_extract_trunc | 0) | 0) | 0;
          $89 = 64 - $88 | 0;
          $91 = 32 - $88 | 0;
          $92 = $91 >> 31;
          $95 = $88 - 32 | 0;
          $105 = $95 >> 31;
          $sr_1_ph = $88;
          $r_sroa_0_1_ph = $91 - 1 >> 31 & $n_sroa_1_4_extract_trunc >>> ($95 >>> 0) | ($n_sroa_1_4_extract_trunc << $91 | $n_sroa_0_0_extract_trunc >>> ($88 >>> 0)) & $105;
          $r_sroa_1_1_ph = $105 & $n_sroa_1_4_extract_trunc >>> ($88 >>> 0);
          $q_sroa_0_1_ph = $n_sroa_0_0_extract_trunc << $89 & $92;
          $q_sroa_1_1_ph = ($n_sroa_1_4_extract_trunc << $89 | $n_sroa_0_0_extract_trunc >>> ($95 >>> 0)) & $92 | $n_sroa_0_0_extract_trunc << $91 & $88 - 33 >> 31;
          break;
        }
        if (($rem | 0) != 0) {
          HEAP32[$rem >> 2] = $66 & $n_sroa_0_0_extract_trunc;
          HEAP32[$rem + 4 >> 2] = 0;
        }
        if (($d_sroa_0_0_extract_trunc | 0) == 1) {
          $_0$1 = $n_sroa_1_4_extract_shift$0 | $a$1 & 0;
          $_0$0 = 0 | $a$0 & -1;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        } else {
          $78 = _llvm_cttz_i32($d_sroa_0_0_extract_trunc | 0) | 0;
          $_0$1 = 0 | $n_sroa_1_4_extract_trunc >>> ($78 >>> 0);
          $_0$0 = $n_sroa_1_4_extract_trunc << 32 - $78 | $n_sroa_0_0_extract_trunc >>> ($78 >>> 0) | 0;
          return (tempRet0 = $_0$1, $_0$0) | 0;
        }
      }
    } while (0);
    if (($sr_1_ph | 0) == 0) {
      $q_sroa_1_1_lcssa = $q_sroa_1_1_ph;
      $q_sroa_0_1_lcssa = $q_sroa_0_1_ph;
      $r_sroa_1_1_lcssa = $r_sroa_1_1_ph;
      $r_sroa_0_1_lcssa = $r_sroa_0_1_ph;
      $carry_0_lcssa$1 = 0;
      $carry_0_lcssa$0 = 0;
    } else {
      $d_sroa_0_0_insert_insert99$0 = 0 | $b$0 & -1;
      $d_sroa_0_0_insert_insert99$1 = $d_sroa_1_4_extract_shift$0 | $b$1 & 0;
      $137$0 = _i64Add($d_sroa_0_0_insert_insert99$0 | 0, $d_sroa_0_0_insert_insert99$1 | 0, -1, -1) | 0;
      $137$1 = tempRet0;
      $q_sroa_1_1198 = $q_sroa_1_1_ph;
      $q_sroa_0_1199 = $q_sroa_0_1_ph;
      $r_sroa_1_1200 = $r_sroa_1_1_ph;
      $r_sroa_0_1201 = $r_sroa_0_1_ph;
      $sr_1202 = $sr_1_ph;
      $carry_0203 = 0;
      while (1) {
        $147 = $q_sroa_0_1199 >>> 31 | $q_sroa_1_1198 << 1;
        $149 = $carry_0203 | $q_sroa_0_1199 << 1;
        $r_sroa_0_0_insert_insert42$0 = 0 | ($r_sroa_0_1201 << 1 | $q_sroa_1_1198 >>> 31);
        $r_sroa_0_0_insert_insert42$1 = $r_sroa_0_1201 >>> 31 | $r_sroa_1_1200 << 1 | 0;
        _i64Subtract($137$0 | 0, $137$1 | 0, $r_sroa_0_0_insert_insert42$0 | 0, $r_sroa_0_0_insert_insert42$1 | 0) | 0;
        $150$1 = tempRet0;
        $151$0 = $150$1 >> 31 | (($150$1 | 0) < 0 ? -1 : 0) << 1;
        $152 = $151$0 & 1;
        $154$0 = _i64Subtract($r_sroa_0_0_insert_insert42$0 | 0, $r_sroa_0_0_insert_insert42$1 | 0, $151$0 & $d_sroa_0_0_insert_insert99$0 | 0, ((($150$1 | 0) < 0 ? -1 : 0) >> 31 | (($150$1 | 0) < 0 ? -1 : 0) << 1) & $d_sroa_0_0_insert_insert99$1 | 0) | 0;
        $r_sroa_0_0_extract_trunc = $154$0;
        $r_sroa_1_4_extract_trunc = tempRet0;
        $155 = $sr_1202 - 1 | 0;
        if (($155 | 0) == 0) {
          break;
        } else {
          $q_sroa_1_1198 = $147;
          $q_sroa_0_1199 = $149;
          $r_sroa_1_1200 = $r_sroa_1_4_extract_trunc;
          $r_sroa_0_1201 = $r_sroa_0_0_extract_trunc;
          $sr_1202 = $155;
          $carry_0203 = $152;
        }
      }
      $q_sroa_1_1_lcssa = $147;
      $q_sroa_0_1_lcssa = $149;
      $r_sroa_1_1_lcssa = $r_sroa_1_4_extract_trunc;
      $r_sroa_0_1_lcssa = $r_sroa_0_0_extract_trunc;
      $carry_0_lcssa$1 = 0;
      $carry_0_lcssa$0 = $152;
    }
    $q_sroa_0_0_insert_ext75$0 = $q_sroa_0_1_lcssa;
    $q_sroa_0_0_insert_ext75$1 = 0;
    $q_sroa_0_0_insert_insert77$1 = $q_sroa_1_1_lcssa | $q_sroa_0_0_insert_ext75$1;
    if (($rem | 0) != 0) {
      HEAP32[$rem >> 2] = 0 | $r_sroa_0_1_lcssa;
      HEAP32[$rem + 4 >> 2] = $r_sroa_1_1_lcssa | 0;
    }
    $_0$1 = (0 | $q_sroa_0_0_insert_ext75$0) >>> 31 | $q_sroa_0_0_insert_insert77$1 << 1 | ($q_sroa_0_0_insert_ext75$1 << 1 | $q_sroa_0_0_insert_ext75$0 >>> 31) & 0 | $carry_0_lcssa$1;
    $_0$0 = ($q_sroa_0_0_insert_ext75$0 << 1 | 0 >>> 31) & -2 | $carry_0_lcssa$0;
    return (tempRet0 = $_0$1, $_0$0) | 0;
}
function ___udivdi3($a$0, $a$1, $b$0, $b$1) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    var $1$0 = 0;
    $1$0 = ___udivmoddi4($a$0, $a$1, $b$0, $b$1, 0) | 0;
    return $1$0 | 0;
}
function ___uremdi3($a$0, $a$1, $b$0, $b$1) {
    $a$0 = $a$0 | 0;
    $a$1 = $a$1 | 0;
    $b$0 = $b$0 | 0;
    $b$1 = $b$1 | 0;
    var $rem = 0, __stackBase__ = 0;
    __stackBase__ = STACKTOP;
    STACKTOP = STACKTOP + 16 | 0;
    $rem = __stackBase__ | 0;
    ___udivmoddi4($a$0, $a$1, $b$0, $b$1, $rem) | 0;
    STACKTOP = __stackBase__;
    return (tempRet0 = HEAP32[$rem + 4 >> 2] | 0, HEAP32[$rem >> 2] | 0) | 0;
}
function _bitshift64Lshr(low, high, bits) {
    low = low|0; high = high|0; bits = bits|0;
    var ander = 0;
    if ((bits|0) < 32) {
      ander = ((1 << bits) - 1)|0;
      tempRet0 = high >>> bits;
      return (low >>> bits) | ((high&ander) << (32 - bits));
    }
    tempRet0 = 0;
    return (high >>> (bits - 32))|0;
}
function _bitshift64Shl(low, high, bits) {
    low = low|0; high = high|0; bits = bits|0;
    var ander = 0;
    if ((bits|0) < 32) {
      ander = ((1 << bits) - 1)|0;
      tempRet0 = (high << bits) | ((low&(ander << (32 - bits))) >>> (32 - bits));
      return low << bits;
    }
    tempRet0 = low << (bits - 32);
    return 0;
}
function _llvm_bswap_i32(x) {
    x = x|0;
    return (((x&0xff)<<24) | (((x>>8)&0xff)<<16) | (((x>>16)&0xff)<<8) | (x>>>24))|0;
}
function _memcpy(dest, src, num) {
    dest = dest|0; src = src|0; num = num|0;
    var ret = 0;
    var aligned_dest_end = 0;
    var block_aligned_dest_end = 0;
    var dest_end = 0;
    // Test against a benchmarked cutoff limit for when HEAPU8.set() becomes faster to use.
    if ((num|0) >=
      8192
    ) {
      return _emscripten_memcpy_big(dest|0, src|0, num|0)|0;
    }

    ret = dest|0;
    dest_end = (dest + num)|0;
    if ((dest&3) == (src&3)) {
      // The initial unaligned < 4-byte front.
      while (dest & 3) {
        if ((num|0) == 0) return ret|0;
        HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
        dest = (dest+1)|0;
        src = (src+1)|0;
        num = (num-1)|0;
      }
      aligned_dest_end = (dest_end & -4)|0;
      block_aligned_dest_end = (aligned_dest_end - 64)|0;
      while ((dest|0) <= (block_aligned_dest_end|0) ) {
        HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
        HEAP32[(((dest)+(4))>>2)]=((HEAP32[(((src)+(4))>>2)])|0);
        HEAP32[(((dest)+(8))>>2)]=((HEAP32[(((src)+(8))>>2)])|0);
        HEAP32[(((dest)+(12))>>2)]=((HEAP32[(((src)+(12))>>2)])|0);
        HEAP32[(((dest)+(16))>>2)]=((HEAP32[(((src)+(16))>>2)])|0);
        HEAP32[(((dest)+(20))>>2)]=((HEAP32[(((src)+(20))>>2)])|0);
        HEAP32[(((dest)+(24))>>2)]=((HEAP32[(((src)+(24))>>2)])|0);
        HEAP32[(((dest)+(28))>>2)]=((HEAP32[(((src)+(28))>>2)])|0);
        HEAP32[(((dest)+(32))>>2)]=((HEAP32[(((src)+(32))>>2)])|0);
        HEAP32[(((dest)+(36))>>2)]=((HEAP32[(((src)+(36))>>2)])|0);
        HEAP32[(((dest)+(40))>>2)]=((HEAP32[(((src)+(40))>>2)])|0);
        HEAP32[(((dest)+(44))>>2)]=((HEAP32[(((src)+(44))>>2)])|0);
        HEAP32[(((dest)+(48))>>2)]=((HEAP32[(((src)+(48))>>2)])|0);
        HEAP32[(((dest)+(52))>>2)]=((HEAP32[(((src)+(52))>>2)])|0);
        HEAP32[(((dest)+(56))>>2)]=((HEAP32[(((src)+(56))>>2)])|0);
        HEAP32[(((dest)+(60))>>2)]=((HEAP32[(((src)+(60))>>2)])|0);
        dest = (dest+64)|0;
        src = (src+64)|0;
      }
      while ((dest|0) < (aligned_dest_end|0) ) {
        HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
        dest = (dest+4)|0;
        src = (src+4)|0;
      }
    } else {
      // In the unaligned copy case, unroll a bit as well.
      aligned_dest_end = (dest_end - 4)|0;
      while ((dest|0) < (aligned_dest_end|0) ) {
        HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
        HEAP8[(((dest)+(1))>>0)]=((HEAP8[(((src)+(1))>>0)])|0);
        HEAP8[(((dest)+(2))>>0)]=((HEAP8[(((src)+(2))>>0)])|0);
        HEAP8[(((dest)+(3))>>0)]=((HEAP8[(((src)+(3))>>0)])|0);
        dest = (dest+4)|0;
        src = (src+4)|0;
      }
    }
    // The remaining unaligned < 4 byte tail.
    while ((dest|0) < (dest_end|0)) {
      HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
      dest = (dest+1)|0;
      src = (src+1)|0;
    }
    return ret|0;
}
function _memset(ptr, value, num) {
    ptr = ptr|0; value = value|0; num = num|0;
    var end = 0, aligned_end = 0, block_aligned_end = 0, value4 = 0;
    end = (ptr + num)|0;

    value = value & 0xff;
    if ((num|0) >= 67 /* 64 bytes for an unrolled loop + 3 bytes for unaligned head*/) {
      while ((ptr&3) != 0) {
        HEAP8[((ptr)>>0)]=value;
        ptr = (ptr+1)|0;
      }

      aligned_end = (end & -4)|0;
      block_aligned_end = (aligned_end - 64)|0;
      value4 = value | (value << 8) | (value << 16) | (value << 24);

      while((ptr|0) <= (block_aligned_end|0)) {
        HEAP32[((ptr)>>2)]=value4;
        HEAP32[(((ptr)+(4))>>2)]=value4;
        HEAP32[(((ptr)+(8))>>2)]=value4;
        HEAP32[(((ptr)+(12))>>2)]=value4;
        HEAP32[(((ptr)+(16))>>2)]=value4;
        HEAP32[(((ptr)+(20))>>2)]=value4;
        HEAP32[(((ptr)+(24))>>2)]=value4;
        HEAP32[(((ptr)+(28))>>2)]=value4;
        HEAP32[(((ptr)+(32))>>2)]=value4;
        HEAP32[(((ptr)+(36))>>2)]=value4;
        HEAP32[(((ptr)+(40))>>2)]=value4;
        HEAP32[(((ptr)+(44))>>2)]=value4;
        HEAP32[(((ptr)+(48))>>2)]=value4;
        HEAP32[(((ptr)+(52))>>2)]=value4;
        HEAP32[(((ptr)+(56))>>2)]=value4;
        HEAP32[(((ptr)+(60))>>2)]=value4;
        ptr = (ptr + 64)|0;
      }

      while ((ptr|0) < (aligned_end|0) ) {
        HEAP32[((ptr)>>2)]=value4;
        ptr = (ptr+4)|0;
      }
    }
    // The remaining bytes.
    while ((ptr|0) < (end|0)) {
      HEAP8[((ptr)>>0)]=value;
      ptr = (ptr+1)|0;
    }
    return (end-num)|0;
}
function _sbrk(increment) {
    increment = increment|0;
    var oldDynamicTop = 0;
    var oldDynamicTopOnChange = 0;
    var newDynamicTop = 0;
    var totalMemory = 0;
    increment = ((increment + 15) & -16)|0;
    oldDynamicTop = HEAP32[DYNAMICTOP_PTR>>2]|0;
    newDynamicTop = oldDynamicTop + increment | 0;

    if (((increment|0) > 0 & (newDynamicTop|0) < (oldDynamicTop|0)) // Detect and fail if we would wrap around signed 32-bit int.
      | (newDynamicTop|0) < 0) { // Also underflow, sbrk() should be able to be used to subtract.
      abortOnCannotGrowMemory()|0;
      ___setErrNo(12);
      return -1;
    }

    HEAP32[DYNAMICTOP_PTR>>2] = newDynamicTop;
    totalMemory = getTotalMemory()|0;
    if ((newDynamicTop|0) > (totalMemory|0)) {
      if ((enlargeMemory()|0) == 0) {
        HEAP32[DYNAMICTOP_PTR>>2] = oldDynamicTop;
        ___setErrNo(12);
        return -1;
      }
    }
    return oldDynamicTop|0;
}

  
function dynCall_ii(index,a1) {
  index = index|0;
  a1=a1|0;
  return FUNCTION_TABLE_ii[index&1](a1|0)|0;
}


function dynCall_iiii(index,a1,a2,a3) {
  index = index|0;
  a1=a1|0; a2=a2|0; a3=a3|0;
  return FUNCTION_TABLE_iiii[index&7](a1|0,a2|0,a3|0)|0;
}

function b0(p0) {
 p0 = p0|0; nullFunc_ii(0);return 0;
}
function b1(p0,p1,p2) {
 p0 = p0|0;p1 = p1|0;p2 = p2|0; nullFunc_iiii(1);return 0;
}

// EMSCRIPTEN_END_FUNCS
var FUNCTION_TABLE_ii = [b0,___stdio_close];
var FUNCTION_TABLE_iiii = [b1,b1,___stdout_write,___stdio_seek,_sn_write,___stdio_write,b1,b1];

  return { ___errno_location: ___errno_location, ___udivdi3: ___udivdi3, ___uremdi3: ___uremdi3, _bitshift64Lshr: _bitshift64Lshr, _bitshift64Shl: _bitshift64Shl, _ems_branch: _ems_branch, _ems_can_branch: _ems_can_branch, _ems_can_redo: _ems_can_redo, _ems_can_trunk: _ems_can_trunk, _ems_can_undo: _ems_can_undo, _ems_get_str: _ems_get_str, _ems_move: _ems_move, _ems_redo: _ems_redo, _ems_setup: _ems_setup, _ems_trunk: _ems_trunk, _ems_undo: _ems_undo, _fflush: _fflush, _free: _free, _i64Add: _i64Add, _i64Subtract: _i64Subtract, _llvm_bswap_i32: _llvm_bswap_i32, _malloc: _malloc, _memcpy: _memcpy, _memset: _memset, _sbrk: _sbrk, dynCall_ii: dynCall_ii, dynCall_iiii: dynCall_iiii, establishStackSpace: establishStackSpace, getTempRet0: getTempRet0, runPostSets: runPostSets, setTempRet0: setTempRet0, setThrew: setThrew, stackAlloc: stackAlloc, stackRestore: stackRestore, stackSave: stackSave };
})
// EMSCRIPTEN_END_ASM
(Module.asmGlobalArg, Module.asmLibraryArg, buffer);

var real____errno_location = asm["___errno_location"]; asm["___errno_location"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____errno_location.apply(null, arguments);
};

var real____udivdi3 = asm["___udivdi3"]; asm["___udivdi3"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____udivdi3.apply(null, arguments);
};

var real____uremdi3 = asm["___uremdi3"]; asm["___uremdi3"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real____uremdi3.apply(null, arguments);
};

var real__bitshift64Lshr = asm["_bitshift64Lshr"]; asm["_bitshift64Lshr"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__bitshift64Lshr.apply(null, arguments);
};

var real__bitshift64Shl = asm["_bitshift64Shl"]; asm["_bitshift64Shl"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__bitshift64Shl.apply(null, arguments);
};

var real__ems_branch = asm["_ems_branch"]; asm["_ems_branch"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_branch.apply(null, arguments);
};

var real__ems_can_branch = asm["_ems_can_branch"]; asm["_ems_can_branch"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_can_branch.apply(null, arguments);
};

var real__ems_can_redo = asm["_ems_can_redo"]; asm["_ems_can_redo"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_can_redo.apply(null, arguments);
};

var real__ems_can_trunk = asm["_ems_can_trunk"]; asm["_ems_can_trunk"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_can_trunk.apply(null, arguments);
};

var real__ems_can_undo = asm["_ems_can_undo"]; asm["_ems_can_undo"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_can_undo.apply(null, arguments);
};

var real__ems_get_str = asm["_ems_get_str"]; asm["_ems_get_str"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_get_str.apply(null, arguments);
};

var real__ems_move = asm["_ems_move"]; asm["_ems_move"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_move.apply(null, arguments);
};

var real__ems_redo = asm["_ems_redo"]; asm["_ems_redo"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_redo.apply(null, arguments);
};

var real__ems_setup = asm["_ems_setup"]; asm["_ems_setup"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_setup.apply(null, arguments);
};

var real__ems_trunk = asm["_ems_trunk"]; asm["_ems_trunk"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_trunk.apply(null, arguments);
};

var real__ems_undo = asm["_ems_undo"]; asm["_ems_undo"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__ems_undo.apply(null, arguments);
};

var real__fflush = asm["_fflush"]; asm["_fflush"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__fflush.apply(null, arguments);
};

var real__free = asm["_free"]; asm["_free"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__free.apply(null, arguments);
};

var real__i64Add = asm["_i64Add"]; asm["_i64Add"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__i64Add.apply(null, arguments);
};

var real__i64Subtract = asm["_i64Subtract"]; asm["_i64Subtract"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__i64Subtract.apply(null, arguments);
};

var real__llvm_bswap_i32 = asm["_llvm_bswap_i32"]; asm["_llvm_bswap_i32"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__llvm_bswap_i32.apply(null, arguments);
};

var real__malloc = asm["_malloc"]; asm["_malloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__malloc.apply(null, arguments);
};

var real__sbrk = asm["_sbrk"]; asm["_sbrk"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real__sbrk.apply(null, arguments);
};

var real_establishStackSpace = asm["establishStackSpace"]; asm["establishStackSpace"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_establishStackSpace.apply(null, arguments);
};

var real_getTempRet0 = asm["getTempRet0"]; asm["getTempRet0"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_getTempRet0.apply(null, arguments);
};

var real_setTempRet0 = asm["setTempRet0"]; asm["setTempRet0"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_setTempRet0.apply(null, arguments);
};

var real_setThrew = asm["setThrew"]; asm["setThrew"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_setThrew.apply(null, arguments);
};

var real_stackAlloc = asm["stackAlloc"]; asm["stackAlloc"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackAlloc.apply(null, arguments);
};

var real_stackRestore = asm["stackRestore"]; asm["stackRestore"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackRestore.apply(null, arguments);
};

var real_stackSave = asm["stackSave"]; asm["stackSave"] = function() {
  assert(runtimeInitialized, 'you need to wait for the runtime to be ready (e.g. wait for main() to be called)');
  assert(!runtimeExited, 'the runtime was exited (use NO_EXIT_RUNTIME to keep it alive after main() exits)');
  return real_stackSave.apply(null, arguments);
};
var ___errno_location = Module["___errno_location"] = asm["___errno_location"];
var ___udivdi3 = Module["___udivdi3"] = asm["___udivdi3"];
var ___uremdi3 = Module["___uremdi3"] = asm["___uremdi3"];
var _bitshift64Lshr = Module["_bitshift64Lshr"] = asm["_bitshift64Lshr"];
var _bitshift64Shl = Module["_bitshift64Shl"] = asm["_bitshift64Shl"];
var _ems_branch = Module["_ems_branch"] = asm["_ems_branch"];
var _ems_can_branch = Module["_ems_can_branch"] = asm["_ems_can_branch"];
var _ems_can_redo = Module["_ems_can_redo"] = asm["_ems_can_redo"];
var _ems_can_trunk = Module["_ems_can_trunk"] = asm["_ems_can_trunk"];
var _ems_can_undo = Module["_ems_can_undo"] = asm["_ems_can_undo"];
var _ems_get_str = Module["_ems_get_str"] = asm["_ems_get_str"];
var _ems_move = Module["_ems_move"] = asm["_ems_move"];
var _ems_redo = Module["_ems_redo"] = asm["_ems_redo"];
var _ems_setup = Module["_ems_setup"] = asm["_ems_setup"];
var _ems_trunk = Module["_ems_trunk"] = asm["_ems_trunk"];
var _ems_undo = Module["_ems_undo"] = asm["_ems_undo"];
var _fflush = Module["_fflush"] = asm["_fflush"];
var _free = Module["_free"] = asm["_free"];
var _i64Add = Module["_i64Add"] = asm["_i64Add"];
var _i64Subtract = Module["_i64Subtract"] = asm["_i64Subtract"];
var _llvm_bswap_i32 = Module["_llvm_bswap_i32"] = asm["_llvm_bswap_i32"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var _memset = Module["_memset"] = asm["_memset"];
var _sbrk = Module["_sbrk"] = asm["_sbrk"];
var establishStackSpace = Module["establishStackSpace"] = asm["establishStackSpace"];
var getTempRet0 = Module["getTempRet0"] = asm["getTempRet0"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var setTempRet0 = Module["setTempRet0"] = asm["setTempRet0"];
var setThrew = Module["setThrew"] = asm["setThrew"];
var stackAlloc = Module["stackAlloc"] = asm["stackAlloc"];
var stackRestore = Module["stackRestore"] = asm["stackRestore"];
var stackSave = Module["stackSave"] = asm["stackSave"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
;



// === Auto-generated postamble setup entry stuff ===

Module['asm'] = asm;

if (!Module["intArrayFromString"]) Module["intArrayFromString"] = function() { abort("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["intArrayToString"]) Module["intArrayToString"] = function() { abort("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
Module["ccall"] = ccall;
Module["cwrap"] = cwrap;
if (!Module["setValue"]) Module["setValue"] = function() { abort("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getValue"]) Module["getValue"] = function() { abort("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["allocate"]) Module["allocate"] = function() { abort("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getMemory"]) Module["getMemory"] = function() { abort("'getMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["Pointer_stringify"]) Module["Pointer_stringify"] = function() { abort("'Pointer_stringify' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["AsciiToString"]) Module["AsciiToString"] = function() { abort("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stringToAscii"]) Module["stringToAscii"] = function() { abort("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["UTF8ArrayToString"]) Module["UTF8ArrayToString"] = function() { abort("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["UTF8ToString"]) Module["UTF8ToString"] = function() { abort("'UTF8ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stringToUTF8Array"]) Module["stringToUTF8Array"] = function() { abort("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stringToUTF8"]) Module["stringToUTF8"] = function() { abort("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["lengthBytesUTF8"]) Module["lengthBytesUTF8"] = function() { abort("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["UTF16ToString"]) Module["UTF16ToString"] = function() { abort("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stringToUTF16"]) Module["stringToUTF16"] = function() { abort("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["lengthBytesUTF16"]) Module["lengthBytesUTF16"] = function() { abort("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["UTF32ToString"]) Module["UTF32ToString"] = function() { abort("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stringToUTF32"]) Module["stringToUTF32"] = function() { abort("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["lengthBytesUTF32"]) Module["lengthBytesUTF32"] = function() { abort("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["allocateUTF8"]) Module["allocateUTF8"] = function() { abort("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["stackTrace"]) Module["stackTrace"] = function() { abort("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addOnPreRun"]) Module["addOnPreRun"] = function() { abort("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addOnInit"]) Module["addOnInit"] = function() { abort("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addOnPreMain"]) Module["addOnPreMain"] = function() { abort("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addOnExit"]) Module["addOnExit"] = function() { abort("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addOnPostRun"]) Module["addOnPostRun"] = function() { abort("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["writeStringToMemory"]) Module["writeStringToMemory"] = function() { abort("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["writeArrayToMemory"]) Module["writeArrayToMemory"] = function() { abort("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["writeAsciiToMemory"]) Module["writeAsciiToMemory"] = function() { abort("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addRunDependency"]) Module["addRunDependency"] = function() { abort("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["removeRunDependency"]) Module["removeRunDependency"] = function() { abort("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["FS"]) Module["FS"] = function() { abort("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["FS_createFolder"]) Module["FS_createFolder"] = function() { abort("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["FS_createPath"]) Module["FS_createPath"] = function() { abort("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["FS_createDataFile"]) Module["FS_createDataFile"] = function() { abort("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["FS_createPreloadedFile"]) Module["FS_createPreloadedFile"] = function() { abort("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["FS_createLazyFile"]) Module["FS_createLazyFile"] = function() { abort("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["FS_createLink"]) Module["FS_createLink"] = function() { abort("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["FS_createDevice"]) Module["FS_createDevice"] = function() { abort("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["FS_unlink"]) Module["FS_unlink"] = function() { abort("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you") };
if (!Module["GL"]) Module["GL"] = function() { abort("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["staticAlloc"]) Module["staticAlloc"] = function() { abort("'staticAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["dynamicAlloc"]) Module["dynamicAlloc"] = function() { abort("'dynamicAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["warnOnce"]) Module["warnOnce"] = function() { abort("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["loadDynamicLibrary"]) Module["loadDynamicLibrary"] = function() { abort("'loadDynamicLibrary' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["loadWebAssemblyModule"]) Module["loadWebAssemblyModule"] = function() { abort("'loadWebAssemblyModule' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getLEB"]) Module["getLEB"] = function() { abort("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getFunctionTables"]) Module["getFunctionTables"] = function() { abort("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["alignFunctionTables"]) Module["alignFunctionTables"] = function() { abort("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["registerFunctions"]) Module["registerFunctions"] = function() { abort("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["addFunction"]) Module["addFunction"] = function() { abort("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["removeFunction"]) Module["removeFunction"] = function() { abort("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getFuncWrapper"]) Module["getFuncWrapper"] = function() { abort("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["prettyPrint"]) Module["prettyPrint"] = function() { abort("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["makeBigInt"]) Module["makeBigInt"] = function() { abort("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["dynCall"]) Module["dynCall"] = function() { abort("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };
if (!Module["getCompilerSetting"]) Module["getCompilerSetting"] = function() { abort("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") };if (!Module["ALLOC_NORMAL"]) Object.defineProperty(Module, "ALLOC_NORMAL", { get: function() { abort("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_STACK"]) Object.defineProperty(Module, "ALLOC_STACK", { get: function() { abort("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_STATIC"]) Object.defineProperty(Module, "ALLOC_STATIC", { get: function() { abort("'ALLOC_STATIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_DYNAMIC"]) Object.defineProperty(Module, "ALLOC_DYNAMIC", { get: function() { abort("'ALLOC_DYNAMIC' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });
if (!Module["ALLOC_NONE"]) Object.defineProperty(Module, "ALLOC_NONE", { get: function() { abort("'ALLOC_NONE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)") } });

if (memoryInitializer) {
  if (!isDataURI(memoryInitializer)) {
    if (typeof Module['locateFile'] === 'function') {
      memoryInitializer = Module['locateFile'](memoryInitializer);
    } else if (Module['memoryInitializerPrefixURL']) {
      memoryInitializer = Module['memoryInitializerPrefixURL'] + memoryInitializer;
    }
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module['readBinary'](memoryInitializer);
    HEAPU8.set(data, GLOBAL_BASE);
  } else {
    addRunDependency('memory initializer');
    var applyMemoryInitializer = function(data) {
      if (data.byteLength) data = new Uint8Array(data);
      for (var i = 0; i < data.length; i++) {
        assert(HEAPU8[GLOBAL_BASE + i] === 0, "area for memory initializer should not have been touched before it's loaded");
      }
      HEAPU8.set(data, GLOBAL_BASE);
      // Delete the typed array that contains the large blob of the memory initializer request response so that
      // we won't keep unnecessary memory lying around. However, keep the XHR object itself alive so that e.g.
      // its .status field can still be accessed later.
      if (Module['memoryInitializerRequest']) delete Module['memoryInitializerRequest'].response;
      removeRunDependency('memory initializer');
    }
    function doBrowserLoad() {
      Module['readAsync'](memoryInitializer, applyMemoryInitializer, function() {
        throw 'could not load memory initializer ' + memoryInitializer;
      });
    }
    if (Module['memoryInitializerRequest']) {
      // a network request has already been created, just use that
      function useRequest() {
        var request = Module['memoryInitializerRequest'];
        var response = request.response;
        if (request.status !== 200 && request.status !== 0) {
            // If you see this warning, the issue may be that you are using locateFile or memoryInitializerPrefixURL, and defining them in JS. That
            // means that the HTML file doesn't know about them, and when it tries to create the mem init request early, does it to the wrong place.
            // Look in your browser's devtools network console to see what's going on.
            console.warn('a problem seems to have happened with Module.memoryInitializerRequest, status: ' + request.status + ', retrying ' + memoryInitializer);
            doBrowserLoad();
            return;
        }
        applyMemoryInitializer(response);
      }
      if (Module['memoryInitializerRequest'].response) {
        setTimeout(useRequest, 0); // it's already here; but, apply it asynchronously
      } else {
        Module['memoryInitializerRequest'].addEventListener('load', useRequest); // wait for it
      }
    } else {
      // fetch it from the network ourselves
      doBrowserLoad();
    }
  }
}



/**
 * @constructor
 * @extends {Error}
 * @this {ExitStatus}
 */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun']) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}





/** @type {function(Array=)} */
function run(args) {
  args = args || Module['arguments'];

  if (runDependencies > 0) {
    return;
  }

  writeStackCookie();

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    if (ABORT) return;

    ensureInitRuntime();

    preMain();

    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
  checkStackCookie();
}
Module['run'] = run;

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in NO_FILESYSTEM
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var print = Module['print'];
  var printErr = Module['printErr'];
  var has = false;
  Module['print'] = Module['printErr'] = function(x) {
    has = true;
  }
  try { // it doesn't matter if it fails
    var flush = flush_NO_FILESYSTEM;
    if (flush) flush(0);
  } catch(e) {}
  Module['print'] = print;
  Module['printErr'] = printErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set NO_EXIT_RUNTIME to 0 (see the FAQ), or make sure to emit a newline when you printf etc.');
  }
}

function exit(status, implicit) {
  checkUnflushedContent();

  // if this is just main exit-ing implicitly, and the status is 0, then we
  // don't need to do anything here and can just leave. if the status is
  // non-zero, though, then we need to report it.
  // (we may have warned about this earlier, if a situation justifies doing so)
  if (implicit && Module['noExitRuntime'] && status === 0) {
    return;
  }

  if (Module['noExitRuntime']) {
    // if exit() was called, we may warn the user if the runtime isn't actually being shut down
    if (!implicit) {
      Module.printErr('exit(' + status + ') called, but NO_EXIT_RUNTIME is set, so halting execution but not exiting the runtime or preventing further async execution (build with NO_EXIT_RUNTIME=0, if you want a true shutdown)');
    }
  } else {

    ABORT = true;
    EXITSTATUS = status;
    STACKTOP = initialStackTop;

    exitRuntime();

    if (Module['onExit']) Module['onExit'](status);
  }

  if (ENVIRONMENT_IS_NODE) {
    process['exit'](status);
  }
  Module['quit'](status, new ExitStatus(status));
}
Module['exit'] = exit;

var abortDecorators = [];

function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  if (what !== undefined) {
    Module.print(what);
    Module.printErr(what);
    what = JSON.stringify(what)
  } else {
    what = '';
  }

  ABORT = true;
  EXITSTATUS = 1;

  var extra = '';
  var output = 'abort(' + what + ') at ' + stackTrace() + extra;
  if (abortDecorators) {
    abortDecorators.forEach(function(decorator) {
      output = decorator(output, what);
    });
  }
  throw output;
}
Module['abort'] = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}


Module["noExitRuntime"] = true;

run();

// {{POST_RUN_ADDITIONS}}





// {{MODULE_ADDITIONS}}



//# sourceMappingURL=gui.js.map