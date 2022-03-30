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
// import throttle from 'lodash/throttle'
// define default params
var defaultLineWidth = 3;
var defaultColor = '#000000';
var defaultRadius = 0;
var defaultRectangleType = 'stroke';
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
        _this.bindStartEvent = function (params, drawLineWidth, drawColor) {
            _this.canvas["on".concat(Paint.StartEvent)] = function (e) {
                var touch = Paint.touch ? e.touches[0] : e;
                Paint.isLock = true;
                var _x = touch.offsetX;
                var _y = touch.offsetY;
                switch (params.drawWay) {
                    case "pencil":
                        _this.movePoint(_x, _y);
                        _this.drawPoint(Paint.lineX, Paint.lineY, Paint.clickDrag, drawLineWidth, drawColor);
                        break;
                    case "rectangle":
                        Paint.rectangle.x = _x;
                        Paint.rectangle.y = _y;
                        break;
                }
            };
        };
        _this.bindMoveEvent = function (params, drawLineWidth, drawColor, drawRadius, drawRectangleType) {
            _this.canvas["on".concat(Paint.MoveEvent)] = function (e) {
                if (Paint.isLock) {
                    switch (params.drawWay) {
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
                    }
                }
            };
        };
        _this.bindEndEvent = function (params, drawLineWidth, drawColor, drawRadius, drawRectangleType) {
            _this.canvas["on".concat(Paint.EndEvent)] = function (e) {
                if (Paint.isLock) {
                    switch (params.drawWay) {
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
        _this.createRect = function (x, y, width, height, radius, color, lineWidth, type) {
            if (type === void 0) { type = "stroke"; }
            console.log('createRect');
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
            // if (this.status.circleArr.length > 0) {
            //     this.status.circleArr.forEach(function(val) {
            //         t.drawEllipse(val.x, val.y, val.a, val.b, val.lineWidth, val.color)
            //     })
            // }
            // if (this.status.arrowArr.length > 0) {
            //     this.status.arrowArr.forEach(function(val, index) {
            //         if (val.beginPoint != {}) {
            //             t.arrowCoord(val.beginPoint, val.stopPoint, val.range);
            //             t.sideCoord();
            //             t.drawArrow(val.color);
            //         }
            //     })
            // }
        };
        return _this;
    }
    Paint.prototype.bindDrawWay = function (params) {
        var _this = this;
        var _b, _c, _d, _e;
        var drawLineWidth = ((_b = params.drawParams) === null || _b === void 0 ? void 0 : _b.lineWidth) || defaultLineWidth;
        var drawColor = ((_c = params.drawParams) === null || _c === void 0 ? void 0 : _c.color) || defaultColor;
        var drawRadius = ((_d = params.drawParams) === null || _d === void 0 ? void 0 : _d.radius) || defaultRadius;
        var drawRectangleType = ((_e = params.drawParams) === null || _e === void 0 ? void 0 : _e.rectangleType) || defaultRectangleType;
        this.canvas["on".concat(Paint.StartEvent)] = function (e) {
            var touch = Paint.touch ? e.touches[0] : e;
            Paint.isLock = true;
            var _x = touch.offsetX;
            var _y = touch.offsetY;
            switch (params.drawWay) {
                case "pencil":
                    _this.movePoint(_x, _y);
                    _this.drawPoint(Paint.lineX, Paint.lineY, Paint.clickDrag, drawLineWidth, drawColor);
                    break;
                case "rectangle":
                    Paint.rectangle.x = _x;
                    Paint.rectangle.y = _y;
                    break;
            }
        };
        this.canvas["on".concat(Paint.MoveEvent)] = function (e) {
            if (Paint.isLock) {
                switch (params.drawWay) {
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
                }
            }
        };
        this.canvas["on".concat(Paint.EndEvent)] = function (e) {
            if (Paint.isLock) {
                switch (params.drawWay) {
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
                }
                Paint.isLock = false;
            }
        };
    };
    Paint.isLock = false; // 鼠标是否在被拖动
    // 铅笔参数
    Paint.clickDrag = [];
    Paint.lineX = [];
    Paint.lineY = [];
    // 矩形参数
    Paint.rectangle = {};
    // redraw array
    Paint.contentList = {
        lineArr: [],
        rectArr: []
    };
    return Paint;
}(PaintEnviroment));
