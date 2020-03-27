(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/createChatAdapter.js":
/*!**********************************!*\
  !*** ./lib/createChatAdapter.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = createChatAdapter;\n\nvar DEFAULT_ENHANCER = function DEFAULT_ENHANCER(next) {\n  return function (options) {\n    return next(options);\n  };\n};\n\nfunction createChatAdapter(options) {\n  var enhancer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_ENHANCER;\n  return enhancer(function () {\n    return {\n      // TODO: Implement this adapter using IC3SDK.\n      //       Don't implement using RxJS@5 because it's obsoleted. Implement using ES Observable from core-js.\n      //       Also, don't use any operators from RxJS package. It make the logic unreadable and very difficult to debug.\n      //       Currently, we are using options.mockXXX$ so we can easily test the enhancer/middleware pattern.\n      activity$: options.mockActivity$,\n      connectionStatus$: options.mockConnectionStatus$,\n      end: function end() {\n        throw new Error('not implemented');\n      },\n      postActivity: function postActivity() {\n        throw new Error('not implemented');\n      }\n    };\n  })(options);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGF0LWFkYXB0ZXIvY2hhdC1hZGFwdGVyOi8vL3NyYy9jcmVhdGVDaGF0QWRhcHRlci50cz82YzBmIl0sIm5hbWVzIjpbIkRFRkFVTFRfRU5IQU5DRVIiLCJuZXh0Iiwib3B0aW9ucyIsImNyZWF0ZUNoYXRBZGFwdGVyIiwiZW5oYW5jZXIiLCJhY3Rpdml0eSQiLCJtb2NrQWN0aXZpdHkkIiwiY29ubmVjdGlvblN0YXR1cyQiLCJtb2NrQ29ubmVjdGlvblN0YXR1cyQiLCJlbmQiLCJFcnJvciIsInBvc3RBY3Rpdml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBLElBQU1BLGdCQUFpQyxHQUFHLFNBQXBDQSxnQkFBb0MsQ0FBQUMsSUFBSTtBQUFBLFNBQUksVUFBQUMsT0FBTztBQUFBLFdBQUlELElBQUksQ0FBQ0MsT0FBRCxDQUFSO0FBQUEsR0FBWDtBQUFBLENBQTlDOztBQUVlLFNBQVNDLGlCQUFULENBQTJCRCxPQUEzQixFQUFrRztBQUFBLE1BQTlDRSxRQUE4Qyx1RUFBbEJKLGdCQUFrQjtBQUMvRyxTQUFPSSxRQUFRLENBQUM7QUFBQSxXQUFPO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBRUFDLGVBQVMsRUFBRUgsT0FBTyxDQUFDSSxhQU5FO0FBT3JCQyx1QkFBaUIsRUFBRUwsT0FBTyxDQUFDTSxxQkFQTjtBQVNyQkMsU0FBRyxFQUFFLGVBQU07QUFDVCxjQUFNLElBQUlDLEtBQUosQ0FBVSxpQkFBVixDQUFOO0FBQ0QsT0FYb0I7QUFhckJDLGtCQUFZLEVBQUUsd0JBQU07QUFDbEIsY0FBTSxJQUFJRCxLQUFKLENBQVUsaUJBQVYsQ0FBTjtBQUNEO0FBZm9CLEtBQVA7QUFBQSxHQUFELENBQVIsQ0FnQkhSLE9BaEJHLENBQVA7QUFpQkQiLCJmaWxlIjoiLi9saWIvY3JlYXRlQ2hhdEFkYXB0ZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZGFwdGVyT3B0aW9ucywgQWRhcHRlckVuaGFuY2VyIH0gZnJvbSAnLi90eXBlcy9DaGF0QWRhcHRlclR5cGVzJztcclxuXHJcbmNvbnN0IERFRkFVTFRfRU5IQU5DRVI6IEFkYXB0ZXJFbmhhbmNlciA9IG5leHQgPT4gb3B0aW9ucyA9PiBuZXh0KG9wdGlvbnMpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlQ2hhdEFkYXB0ZXIob3B0aW9uczogQWRhcHRlck9wdGlvbnMsIGVuaGFuY2VyOiBBZGFwdGVyRW5oYW5jZXIgPSBERUZBVUxUX0VOSEFOQ0VSKSB7XHJcbiAgcmV0dXJuIGVuaGFuY2VyKCgpID0+ICh7XHJcbiAgICAvLyBUT0RPOiBJbXBsZW1lbnQgdGhpcyBhZGFwdGVyIHVzaW5nIElDM1NESy5cclxuICAgIC8vICAgICAgIERvbid0IGltcGxlbWVudCB1c2luZyBSeEpTQDUgYmVjYXVzZSBpdCdzIG9ic29sZXRlZC4gSW1wbGVtZW50IHVzaW5nIEVTIE9ic2VydmFibGUgZnJvbSBjb3JlLWpzLlxyXG4gICAgLy8gICAgICAgQWxzbywgZG9uJ3QgdXNlIGFueSBvcGVyYXRvcnMgZnJvbSBSeEpTIHBhY2thZ2UuIEl0IG1ha2UgdGhlIGxvZ2ljIHVucmVhZGFibGUgYW5kIHZlcnkgZGlmZmljdWx0IHRvIGRlYnVnLlxyXG4gICAgLy8gICAgICAgQ3VycmVudGx5LCB3ZSBhcmUgdXNpbmcgb3B0aW9ucy5tb2NrWFhYJCBzbyB3ZSBjYW4gZWFzaWx5IHRlc3QgdGhlIGVuaGFuY2VyL21pZGRsZXdhcmUgcGF0dGVybi5cclxuXHJcbiAgICBhY3Rpdml0eSQ6IG9wdGlvbnMubW9ja0FjdGl2aXR5JCxcclxuICAgIGNvbm5lY3Rpb25TdGF0dXMkOiBvcHRpb25zLm1vY2tDb25uZWN0aW9uU3RhdHVzJCxcclxuXHJcbiAgICBlbmQ6ICgpID0+IHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcclxuICAgIH0sXHJcblxyXG4gICAgcG9zdEFjdGl2aXR5OiAoKSA9PiB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm90IGltcGxlbWVudGVkJyk7XHJcbiAgICB9XHJcbiAgfSkpKG9wdGlvbnMpO1xyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/createChatAdapter.js\n");

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _createChatAdapter = _interopRequireDefault(__webpack_require__(/*! ./createChatAdapter */ \"./lib/createChatAdapter.js\"));\n\nvar _default = _createChatAdapter[\"default\"];\nexports[\"default\"] = _default;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGF0LWFkYXB0ZXIvY2hhdC1hZGFwdGVyOi8vL3NyYy9pbmRleC50cz9hZTNhIl0sIm5hbWVzIjpbImNyZWF0ZUNoYXRBZGFwdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7ZUFFZUEsNkIiLCJmaWxlIjoiLi9saWIvaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY3JlYXRlQ2hhdEFkYXB0ZXIgZnJvbSAnLi9jcmVhdGVDaGF0QWRhcHRlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDaGF0QWRhcHRlcjtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./lib/index.js\n");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : {\n    \"default\": obj\n  };\n}\n\nmodule.exports = _interopRequireDefault;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jaGF0LWFkYXB0ZXIvLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvaGVscGVycy9pbnRlcm9wUmVxdWlyZURlZmF1bHQuanM/NGVhNCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvaW50ZXJvcFJlcXVpcmVEZWZhdWx0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHtcbiAgICBcImRlZmF1bHRcIjogb2JqXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdDsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/@babel/runtime/helpers/interopRequireDefault.js\n");

/***/ })

/******/ });
});