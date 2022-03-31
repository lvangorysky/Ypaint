"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
// define default params
var defaultDrawWay = "pencil";
var defaultLineWidth = 3;
var defaultColor = "#000000";
var defaultRadius = 0;
var defaultRectangleType = "stroke";
var defaultFillColor = "rgba(0, 0, 0, 0)";
// define params
var PaintEnviroment = /** @class */ (function () {
    //记录画笔
    function PaintEnviroment(canvas) {
        this.canvas = canvas;
    }
    var _a;
    _a = PaintEnviroment;
    PaintEnviroment.touch = "createTouch" in document;
    PaintEnviroment.StartEvent = _a.touch ? "touchstart" : "mousedown";
    PaintEnviroment.MoveEvent = _a.touch ? "touchmove" : "mousemove";
    PaintEnviroment.EndEvent = _a.touch ? "touchend" : "mouseup";
    return PaintEnviroment;
}());
var Paint = /** @class */ (function (_super) {
    __extends(Paint, _super);
    function Paint(canvas) {
        var _this = _super.call(this, canvas) || this;
        _this.bindStartEvent = function (drawWay, drawLineWidth, drawColor) {
            _this.canvas["on".concat(Paint.StartEvent)] = function (e) {
                var touch = Paint.touch ? e.touches[0] : e;
                Paint.isLock = true;
                var _x = touch.offsetX;
                var _y = touch.offsetY;
                switch (drawWay) {
                    case "pencil":
                        _this.movePoint(_x, _y);
                        _this.drawPoint(Paint.lineX, Paint.lineY, Paint.clickDrag, drawLineWidth, drawColor);
                        break;
                    case "rectangle":
                        Paint.rectangle.x = _x;
                        Paint.rectangle.y = _y;
                        break;
                    case "circle":
                        Paint.circle.x = _x;
                        Paint.circle.y = _y;
                    case "arrow":
                        Paint.arrowBeginPoint.x = _x;
                        Paint.arrowBeginPoint.y = _y;
                }
            };
        };
        _this.bindMoveEvent = function (drawWay, drawLineWidth, drawColor, drawRadius, drawRectangleType, drawFillColor) {
            _this.canvas["on".concat(Paint.MoveEvent)] = function (e) {
                if (Paint.isLock) {
                    switch (drawWay) {
                        case "pencil":
                            _this.movePoint(e.offsetX, e.offsetY);
                            _this.drawPoint(Paint.lineX, Paint.lineY, Paint.clickDrag, drawLineWidth, drawColor);
                            break;
                        case "rectangle":
                            Paint.rectangle.width = Math.abs(Paint.rectangle.x - e.offsetX);
                            Paint.rectangle.height = Math.abs(Paint.rectangle.y - e.offsetY);
                            if (Paint.rectangle.x > e.offsetX) {
                                Paint.rectangle.realX = e.offsetX;
                            }
                            else {
                                Paint.rectangle.realX = Paint.rectangle.x;
                            }
                            if (Paint.rectangle.y > e.offsetY) {
                                Paint.rectangle.realY = e.offsetY;
                            }
                            else {
                                Paint.rectangle.realY = Paint.rectangle.y;
                            }
                            _this.clear();
                            _this.redrawAll();
                            _this.createRect(Paint.rectangle.realX, Paint.rectangle.realY, Paint.rectangle.width, Paint.rectangle.height, drawRadius, drawColor, drawLineWidth, drawRectangleType);
                            break;
                        case "circle":
                            var pointX = void 0, pointY = void 0, lineX = void 0, lineY = void 0;
                            if (Paint.circle.x > e.offsetX) {
                                pointX =
                                    Paint.circle.x -
                                        Math.abs(Paint.circle.x - e.offsetX) / 2;
                            }
                            else {
                                pointX =
                                    Math.abs(Paint.circle.x - e.offsetX) / 2 +
                                        Paint.circle.x;
                            }
                            if (Paint.circle.y > e.offsetY) {
                                pointY =
                                    Paint.circle.y -
                                        Math.abs(Paint.circle.y - e.offsetY) / 2;
                            }
                            else {
                                pointY =
                                    Math.abs(Paint.circle.y - e.offsetY) / 2 +
                                        Paint.circle.y;
                            }
                            lineX = Math.abs(Paint.circle.x - e.offsetX) / 2;
                            lineY = Math.abs(Paint.circle.y - e.offsetY) / 2;
                            _this.clear();
                            _this.redrawAll();
                            _this.drawEllipse(pointX, pointY, lineX, lineY, drawLineWidth, drawColor, drawFillColor);
                            break;
                        case 'arrow':
                            Paint.arrowStopPoint.x = e.offsetX;
                            Paint.arrowStopPoint.y = e.offsetY;
                            _this.clear();
                            _this.redrawAll();
                            _this.arrowCoord(Paint.arrowBeginPoint, Paint.arrowStopPoint, drawLineWidth);
                            _this.sideCoord();
                            _this.drawArrow(drawColor);
                            break;
                    }
                }
            };
        };
        _this.bindEndEvent = function (drawWay, drawLineWidth, drawColor, drawRadius, drawRectangleType, drawFillColor) {
            _this.canvas["on".concat(Paint.EndEvent)] = function (e) {
                if (Paint.isLock) {
                    switch (drawWay) {
                        case "pencil":
                            Paint.contentList.lineArr.push({
                                x: Paint.lineX,
                                y: Paint.lineY,
                                clickDrag: Paint.clickDrag,
                                lineWidth: drawLineWidth,
                                color: drawColor
                            });
                            Paint.lineX = [];
                            Paint.lineY = [];
                            Paint.clickDrag = [];
                            break;
                        case "rectangle":
                            Paint.contentList.rectArr.push({
                                realX: Paint.rectangle.realX,
                                realY: Paint.rectangle.realY,
                                width: Paint.rectangle.width,
                                height: Paint.rectangle.height,
                                radius: drawRadius,
                                color: drawColor,
                                lineWidth: drawLineWidth,
                                type: drawRectangleType
                            });
                            Paint.rectangle = {};
                            break;
                        case "circle":
                            var pointX = void 0, pointY = void 0, lineX = void 0, lineY = void 0;
                            if (Paint.circle.x > e.offsetX) {
                                pointX =
                                    Paint.circle.x -
                                        Math.abs(Paint.circle.x - e.offsetX) / 2;
                            }
                            else {
                                pointX =
                                    Math.abs(Paint.circle.x - e.offsetX) / 2 +
                                        Paint.circle.x;
                            }
                            if (Paint.circle.y > e.offsetY) {
                                pointY =
                                    Paint.circle.y -
                                        Math.abs(Paint.circle.y - e.offsetY) / 2;
                            }
                            else {
                                pointY =
                                    Math.abs(Paint.circle.y - e.offsetY) / 2 +
                                        Paint.circle.y;
                            }
                            lineX = Math.abs(Paint.circle.x - e.offsetX) / 2;
                            lineY = Math.abs(Paint.circle.y - e.offsetY) / 2;
                            Paint.contentList.circleArr.push({
                                x: pointX,
                                y: pointY,
                                a: lineX,
                                b: lineY,
                                color: drawColor,
                                lineWidth: drawLineWidth,
                                fillColor: drawFillColor
                            });
                            Paint.circle = {};
                            break;
                        case 'arrow':
                            var tempObj = {
                                beginPoint: Paint.arrowBeginPoint,
                                stopPoint: { x: e.offsetX, y: e.offsetY },
                                range: drawLineWidth,
                                color: drawColor
                            };
                            Paint.contentList.arrowArr.push(tempObj);
                            Paint.arrowBeginPoint = {
                                x: 0,
                                y: 0
                            };
                            break;
                    }
                    Paint.isLock = false;
                }
            };
        };
        /**
         * @description: move mouse to draw line
         * @param {number} x
         * @param {number} y
         * @return {*}
         */
        _this.movePoint = function (x, y) {
            Paint.lineX.push(x);
            Paint.lineY.push(y);
            Paint.clickDrag.push(y);
        };
        /**
         * @description: draw line
         * @param {Array} lineX
         * @param {Array} lineY
         * @param {Array} clickDrag
         * @param {number} lineWidth
         * @param {string} color
         * @return {*}
         */
        _this.drawPoint = function (lineX, lineY, clickDrag, lineWidth, color) {
            var ctx = _this.canvas.getContext("2d");
            for (var i = 0; i < lineX.length; i++) {
                ctx.canvas.getContext("2d").beginPath();
                if (clickDrag[i] && i) {
                    ctx.moveTo(lineX[i - 1], lineY[i - 1]);
                }
                else {
                    ctx.moveTo(lineX[i] - 1, lineY[i]);
                }
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = color;
                ctx.lineTo(lineX[i], lineY[i]);
                ctx.closePath();
                ctx.stroke();
            }
        };
        _this.drawEllipse = function (x, y, a, b, lineWidth, color, fillColor) {
            var ctx = _this.canvas.getContext("2d");
            ctx.beginPath();
            ctx.ellipse(x, y, a, b, 0, 0, 2 * Math.PI);
            ctx.lineWidth = lineWidth;
            ctx.fillStyle = fillColor;
            ctx.strokeStyle = color;
            ctx.fill();
            ctx.stroke();
        };
        _this.arrowCoord = function (beginPoint, stopPoint, range) {
            Paint.polygonVertex[0] = beginPoint.x;
            Paint.polygonVertex[1] = beginPoint.y;
            Paint.polygonVertex[6] = stopPoint.x;
            Paint.polygonVertex[7] = stopPoint.y;
            _this.getRadian(beginPoint, stopPoint);
            Paint.polygonVertex[8] = stopPoint.x - 25 * Math.cos(Math.PI / 180 * (Paint.angle + range));
            Paint.polygonVertex[9] = stopPoint.y - 25 * Math.sin(Math.PI / 180 * (Paint.angle + range));
            Paint.polygonVertex[4] = stopPoint.x - 25 * Math.cos(Math.PI / 180 * (Paint.angle - range));
            Paint.polygonVertex[5] = stopPoint.y - 25 * Math.sin(Math.PI / 180 * (Paint.angle - range));
        };
        _this.getRadian = function (beginPoint, stopPoint) {
            Paint.angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math.PI * 180;
        };
        _this.sideCoord = function () {
            var midpoint = {
                x: 0,
                y: 0
            };
            midpoint.x = (Paint.polygonVertex[4] + Paint.polygonVertex[8]) / 2;
            midpoint.y = (Paint.polygonVertex[5] + Paint.polygonVertex[9]) / 2;
            Paint.polygonVertex[2] = (Paint.polygonVertex[4] + midpoint.x) / 2;
            Paint.polygonVertex[3] = (Paint.polygonVertex[5] + midpoint.y) / 2;
            Paint.polygonVertex[10] = (Paint.polygonVertex[8] + midpoint.x) / 2;
            Paint.polygonVertex[11] = (Paint.polygonVertex[9] + midpoint.y) / 2;
        };
        _this.drawArrow = function (color) {
            var ctx = _this.canvas.getContext("2d");
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(Paint.polygonVertex[0], Paint.polygonVertex[1]);
            ctx.lineTo(Paint.polygonVertex[2], Paint.polygonVertex[3]);
            ctx.lineTo(Paint.polygonVertex[4], Paint.polygonVertex[5]);
            ctx.lineTo(Paint.polygonVertex[6], Paint.polygonVertex[7]);
            ctx.lineTo(Paint.polygonVertex[8], Paint.polygonVertex[9]);
            ctx.lineTo(Paint.polygonVertex[10], Paint.polygonVertex[11]);
            ctx.closePath();
            ctx.fill();
        };
        _this.createRect = function (x, y, width, height, radius, color, lineWidth, type) {
            if (type === void 0) { type = "stroke"; }
            var ctx = _this.canvas.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(x, y + radius);
            ctx.lineTo(x, y + height - radius);
            ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
            ctx.lineTo(x + width - radius, y + height);
            ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
            ctx.lineTo(x + width, y + radius);
            ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
            ctx.lineTo(x + radius, y);
            ctx.quadraticCurveTo(x, y, x, y + radius);
            ctx[type + "Style"] = color;
            ctx.lineWidth = lineWidth;
            ctx.closePath();
            ctx[type]();
        };
        /**
         * @description: clear canvas
         */
        _this.clear = function () {
            var ctx = _this.canvas.getContext("2d");
            var width = _this.canvas.width;
            var height = _this.canvas.height;
            ctx.clearRect(0, 0, width, height); //清除画布，左上角为起点
        };
        /**
         * @description: use contentList redraw all picture
         */
        _this.redrawAll = function () {
            Paint.contentList.rectArr.length &&
                Paint.contentList.rectArr.forEach(function (val) {
                    _this.createRect(val.realX, val.realY, val.width, val.height, val.radius, val.color, val.lineWidth, val.type);
                });
            Paint.contentList.lineArr.length > 0 &&
                Paint.contentList.lineArr.forEach(function (val) {
                    _this.drawPoint(val.x, val.y, val.clickDrag, val.lineWidth, val.color);
                });
            Paint.contentList.circleArr.length > 0 &&
                Paint.contentList.circleArr.forEach(function (val) {
                    _this.drawEllipse(val.x, val.y, val.a, val.b, val.lineWidth, val.color, val.fillColor);
                });
            Paint.contentList.arrowArr.length > 0 &&
                Paint.contentList.arrowArr.forEach(function (val) {
                    if (val.beginPoint && val.beginPoint.x) {
                        _this.arrowCoord(val.beginPoint, val.stopPoint, val.range);
                        _this.sideCoord();
                        _this.drawArrow(val.color);
                    }
                });
        };
        return _this;
    }
    Paint.prototype.init = function (params) {
        this.bindDrawOptions(params);
        this.bindDrawFunc();
    };
    Paint.prototype.bindDrawFunc = function () {
        this.bindStartEvent(Paint.drawWay, Paint.lineWidth, Paint.color);
        this.bindMoveEvent(Paint.drawWay, Paint.lineWidth, Paint.color, Paint.radius, Paint.rectangleType, Paint.fillColor);
        this.bindEndEvent(Paint.drawWay, Paint.lineWidth, Paint.color, Paint.radius, Paint.rectangleType, Paint.fillColor);
    };
    Paint.prototype.bindDrawOptions = function (params) {
        Paint.drawWay = params.drawWay || defaultDrawWay;
        Paint.lineWidth = params.lineWidth || defaultLineWidth;
        Paint.color = params.color || defaultColor;
        Paint.radius = params.radius || defaultRadius;
        Paint.rectangleType = params.rectangleType || defaultRectangleType;
        Paint.fillColor = params.fillColor || defaultFillColor;
    };
    Paint.isLock = false; // 鼠标是否在被拖动
    // 铅笔参数
    Paint.clickDrag = [];
    Paint.lineX = [];
    Paint.lineY = [];
    // rect params
    Paint.rectangle = {};
    // circle params
    Paint.circle = {};
    //arrow params
    Paint.arrowBeginPoint = {};
    Paint.arrowStopPoint = {};
    Paint.polygonVertex = [];
    // redraw array
    Paint.contentList = {
        lineArr: [],
        rectArr: [],
        circleArr: [],
        arrowArr: []
    };
    return Paint;
}(PaintEnviroment));
exports["default"] = Paint;
