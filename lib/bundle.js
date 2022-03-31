/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(module) {

eval("var __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\n// define default params\nvar defaultLineWidth = 3;\nvar defaultColor = '#000000';\nvar defaultRadius = 0;\nvar defaultRectangleType = 'stroke';\n// define params\nvar PaintEnviroment = /** @class */ (function () {\n    //记录画笔\n    function PaintEnviroment(canvas) {\n        this.canvas = canvas;\n    }\n    var _a;\n    _a = PaintEnviroment;\n    PaintEnviroment.touch = \"createTouch\" in document;\n    PaintEnviroment.StartEvent = _a.touch ? \"touchstart\" : \"mousedown\";\n    PaintEnviroment.MoveEvent = _a.touch ? \"touchmove\" : \"mousemove\";\n    PaintEnviroment.EndEvent = _a.touch ? \"touchend\" : \"mouseup\";\n    return PaintEnviroment;\n}());\nvar Paint = /** @class */ (function (_super) {\n    __extends(Paint, _super);\n    function Paint(canvas) {\n        var _this = _super.call(this, canvas) || this;\n        _this.bindStartEvent = function (params, drawLineWidth, drawColor) {\n            _this.canvas[\"on\".concat(Paint.StartEvent)] = function (e) {\n                var touch = Paint.touch ? e.touches[0] : e;\n                Paint.isLock = true;\n                var _x = touch.offsetX;\n                var _y = touch.offsetY;\n                switch (params.drawWay) {\n                    case \"pencil\":\n                        _this.movePoint(_x, _y);\n                        _this.drawPoint(Paint.lineX, Paint.lineY, Paint.clickDrag, drawLineWidth, drawColor);\n                        break;\n                    case \"rectangle\":\n                        Paint.rectangle.x = _x;\n                        Paint.rectangle.y = _y;\n                        break;\n                }\n            };\n        };\n        _this.bindMoveEvent = function (params, drawLineWidth, drawColor, drawRadius, drawRectangleType) {\n            _this.canvas[\"on\".concat(Paint.MoveEvent)] = function (e) {\n                if (Paint.isLock) {\n                    switch (params.drawWay) {\n                        case \"pencil\":\n                            _this.movePoint(e.offsetX, e.offsetY);\n                            _this.drawPoint(Paint.lineX, Paint.lineY, Paint.clickDrag, drawLineWidth, drawColor);\n                            break;\n                        case \"rectangle\":\n                            Paint.rectangle.width = Math.abs(Paint.rectangle.x - e.offsetX);\n                            Paint.rectangle.height = Math.abs(Paint.rectangle.y - e.offsetY);\n                            if (Paint.rectangle.x > e.offsetX) {\n                                Paint.rectangle.realX = e.offsetX;\n                            }\n                            else {\n                                Paint.rectangle.realX = Paint.rectangle.x;\n                            }\n                            if (Paint.rectangle.y > e.offsetY) {\n                                Paint.rectangle.realY = e.offsetY;\n                            }\n                            else {\n                                Paint.rectangle.realY = Paint.rectangle.y;\n                            }\n                            _this.clear();\n                            _this.redrawAll();\n                            _this.createRect(Paint.rectangle.realX, Paint.rectangle.realY, Paint.rectangle.width, Paint.rectangle.height, drawRadius, drawColor, drawLineWidth, drawRectangleType);\n                            break;\n                    }\n                }\n            };\n        };\n        _this.bindEndEvent = function (params, drawLineWidth, drawColor, drawRadius, drawRectangleType) {\n            _this.canvas[\"on\".concat(Paint.EndEvent)] = function (e) {\n                if (Paint.isLock) {\n                    switch (params.drawWay) {\n                        case \"pencil\":\n                            Paint.contentList.lineArr.push({\n                                x: Paint.lineX,\n                                y: Paint.lineY,\n                                clickDrag: Paint.clickDrag,\n                                lineWidth: drawLineWidth,\n                                color: drawColor\n                            });\n                            Paint.lineX = [];\n                            Paint.lineY = [];\n                            Paint.clickDrag = [];\n                            break;\n                        case \"rectangle\":\n                            Paint.contentList.rectArr.push({\n                                realX: Paint.rectangle.realX,\n                                realY: Paint.rectangle.realY,\n                                width: Paint.rectangle.width,\n                                height: Paint.rectangle.height,\n                                radius: drawRadius,\n                                color: drawColor,\n                                lineWidth: drawLineWidth,\n                                type: drawRectangleType\n                            });\n                            Paint.rectangle = {};\n                            break;\n                    }\n                    Paint.isLock = false;\n                }\n            };\n        };\n        /**\n         * @description: move mouse to draw line\n         * @param {number} x\n         * @param {number} y\n         * @return {*}\n         */\n        _this.movePoint = function (x, y) {\n            Paint.lineX.push(x);\n            Paint.lineY.push(y);\n            Paint.clickDrag.push(y);\n        };\n        /**\n         * @description: draw line\n         * @param {Array} lineX\n         * @param {Array} lineY\n         * @param {Array} clickDrag\n         * @param {number} lineWidth\n         * @param {string} color\n         * @return {*}\n         */\n        _this.drawPoint = function (lineX, lineY, clickDrag, lineWidth, color) {\n            var ctx = _this.canvas.getContext(\"2d\");\n            for (var i = 0; i < lineX.length; i++) {\n                ctx.canvas.getContext(\"2d\").beginPath();\n                if (clickDrag[i] && i) {\n                    ctx.moveTo(lineX[i - 1], lineY[i - 1]);\n                }\n                else {\n                    ctx.moveTo(lineX[i] - 1, lineY[i]);\n                }\n                ctx.lineWidth = lineWidth;\n                ctx.strokeStyle = color;\n                ctx.lineTo(lineX[i], lineY[i]);\n                ctx.closePath();\n                ctx.stroke();\n            }\n        };\n        _this.createRect = function (x, y, width, height, radius, color, lineWidth, type) {\n            if (type === void 0) { type = \"stroke\"; }\n            console.log('createRect');\n            var ctx = _this.canvas.getContext(\"2d\");\n            ctx.beginPath();\n            ctx.moveTo(x, y + radius);\n            ctx.lineTo(x, y + height - radius);\n            ctx.quadraticCurveTo(x, y + height, x + radius, y + height);\n            ctx.lineTo(x + width - radius, y + height);\n            ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);\n            ctx.lineTo(x + width, y + radius);\n            ctx.quadraticCurveTo(x + width, y, x + width - radius, y);\n            ctx.lineTo(x + radius, y);\n            ctx.quadraticCurveTo(x, y, x, y + radius);\n            ctx[type + \"Style\"] = color;\n            ctx.lineWidth = lineWidth;\n            ctx.closePath();\n            ctx[type]();\n        };\n        /**\n         * @description: clear canvas\n         */\n        _this.clear = function () {\n            var ctx = _this.canvas.getContext(\"2d\");\n            var width = _this.canvas.width;\n            var height = _this.canvas.height;\n            ctx.clearRect(0, 0, width, height); //清除画布，左上角为起点\n        };\n        /**\n         * @description: use contentList redraw all picture\n         */\n        _this.redrawAll = function () {\n            Paint.contentList.rectArr.length &&\n                Paint.contentList.rectArr.forEach(function (val) {\n                    _this.createRect(val.realX, val.realY, val.width, val.height, val.radius, val.color, val.lineWidth, val.type);\n                });\n            Paint.contentList.lineArr.length > 0 &&\n                Paint.contentList.lineArr.forEach(function (val) {\n                    _this.drawPoint(val.x, val.y, val.clickDrag, val.lineWidth, val.color);\n                });\n        };\n        return _this;\n    }\n    Paint.prototype.bindDrawWay = function (params) {\n        var _b, _c, _d, _e;\n        var drawLineWidth = ((_b = params.drawParams) === null || _b === void 0 ? void 0 : _b.lineWidth) || defaultLineWidth;\n        var drawColor = ((_c = params.drawParams) === null || _c === void 0 ? void 0 : _c.color) || defaultColor;\n        var drawRadius = ((_d = params.drawParams) === null || _d === void 0 ? void 0 : _d.radius) || defaultRadius;\n        var drawRectangleType = ((_e = params.drawParams) === null || _e === void 0 ? void 0 : _e.rectangleType) || defaultRectangleType;\n        this.bindStartEvent(params, drawLineWidth, drawColor);\n        this.bindMoveEvent(params, drawLineWidth, drawColor, drawRadius, drawRectangleType);\n        this.bindEndEvent(params, drawLineWidth, drawColor, drawRadius, drawRectangleType);\n    };\n    Paint.isLock = false; // 鼠标是否在被拖动\n    // 铅笔参数\n    Paint.clickDrag = [];\n    Paint.lineX = [];\n    Paint.lineY = [];\n    // 矩形参数\n    Paint.rectangle = {};\n    // redraw array\n    Paint.contentList = {\n        lineArr: [],\n        rectArr: []\n    };\n    return Paint;\n}(PaintEnviroment));\nmodule.exports = Paint;\n\n\n//# sourceURL=webpack://ypaint/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});