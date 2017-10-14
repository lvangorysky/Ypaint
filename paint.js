//地图编辑器 功能部分
(function() {
    CONST = {
        edgeLen: 25,
        angle: 15
    };

    function paint() {
        this.angle = "",
            this.drawLine = false,
            this.drawArrow = false,
            this.drawRect = false,
            this.drawCircle = false,
            this.init = function(canvas, bgIndex) {
                this.load(canvas, bgIndex);
                this.clear();
            },

            this.drawBg = function(canvas, data) {
                this.x = []; //x坐标数组
                this.y = []; //y坐标数组
                this.imgSrc = '';
                this.canvasObj = canvas;
                this.canvas = canvas[0];
                if (this.canvas.getContext) {} else {
                    alert("您的浏览器不支持 canvas 标签");
                    return;
                }
                this.ctx = this.canvas.getContext('2d'); //canvas对象
                this.ctx.lineJoin = "round";
                this.w = this.canvas.width; //画布的宽
                this.h = this.canvas.height; //画布的高 
                this.lastDrawTime = -1;
                this.beginPoint = {};
                this.stopPoint = {}; //circle
                this.storage = {};
                this.rect = {};
                this.polygonVertex = [];
                this.imgArr = [];
                this.imgArea = [];

                var t = this;
                var img = new Image();
                img.crossOrigin = "anonymous";
                img.src = '{cdn}/app/img/editorImg/lolmap' + data.index + '.png';
                img.onload = function() {
                    t.ctx.drawImage(img, 0, 0, t.w, t.h)
                    t.drawCanvas(canvas, data);
                }
            },

            this.load = function(canvas, bgIndex) {
                this.x = []; //x坐标数组
                this.y = []; //y坐标数组
                this.lock = false; //鼠标移动前，判断鼠标是否按下
                this.move = false; //判断是否为拖动图片
                this.clickDrag = [];
                this.imgSrc = '';
                this.canvasObj = canvas;
                this.canvas = canvas[0];
                if (this.canvas.getContext) {} else {
                    alert("您的浏览器不支持 canvas 标签");
                    return;
                }
                this.ctx = this.canvas.getContext('2d'); //canvas对象
                this.ctx.lineJoin = "round";
                this.w = this.canvas.width; //画布的宽
                this.h = this.canvas.height; //画布的高 
                this.touch = ("createTouch" in document); //判定是否为手持设备
                this.StartEvent = this.touch ? "touchstart" : "mousedown";
                this.MoveEvent = this.touch ? "touchmove" : "mousemove";
                this.EndEvent = this.touch ? "touchend" : "mouseup";
                this.lastDrawTime = -1;
                this.beginPoint = {};
                this.stopPoint = {}; //circle
                this.storage = {};
                this.rect = {};
                this.polygonVertex = [];
                this.imgArr = [];
                this.imgArea = [];
                this.clickX = 0;
                this.clickY = 0;
                this.status = {
                    index: bgIndex,
                    lineArr: [],
                    arrowArr: [],
                    circleArr: [],
                    rectArr: [],
                    imgArr: [],
                };
                this.lastPush = [];
                this.lastCancel = [];
                this.bind();
            },
            this.drawCanvas = function(canvas, data) {
                this.status = data;
                this.drawAll();
            }
            this.bind = function() {
                var t = this;
                /*鼠标按下事件，记录鼠标位置，并绘制，解锁lock，打开mousemove事件*/
                this.canvas['on' + t.StartEvent] = function(e) {
                    if (e.buttons == 1) {
                        var touch = t.touch ? e.touches[0] : e;
                        var _x = touch.offsetX;
                        var _y = touch.offsetY;
                        if (t.drawLine) {
                            t.movePoint(_x, _y);
                            t.drawPoint(t.x, t.y, t.clickDrag, t.lineWidth);
                        } else if (t.drawArrow) {
                            t.beginPoint.x = _x;
                            t.beginPoint.y = _y;
                        } else if (t.drawCircle) {
                            t.storage.x = _x;
                            t.storage.y = _y;
                        } else if (t.drawRect) {
                            t.rect.x = _x;
                            t.rect.y = _y;
                        }
                        t.lock = true;
                        if (!t.drawLine && !t.drawArrow && !t.drawCircle && !t.drawRect) {
                            if (t.imgArea.length > 0) {
                                t.imgArea.forEach(function(val) {
                                    if (e.offsetX > val.leftMin && e.offsetX < val.leftMax && e.offsetY > val.topMin && e.offsetY < val.topMax) {
                                        t.clickX = e.offsetX - val.left;
                                        t.clickY = e.offsetY - val.top;
                                        t.move = true;
                                        t.imgSrc = val.id;
                                    }
                                })
                            }
                        }
                    }

                };
                /*鼠标移动事件*/
                this.canvas['on' + t.MoveEvent] = function(e) {
                    if (e.buttons == 1) {
                        var touch = t.touch ? e.touches[0] : e;
                        if (t.lock) {
                            var _x = touch.offsetX;
                            var _y = touch.offsetY;
                            if (t.drawLine) {
                                t.movePoint(_x, _y, true);
                                t.drawPoint(t.x, t.y, t.clickDrag, t.lineWidth);
                            } else if (t.drawArrow) {
                                t.stopPoint.x = e.offsetX;
                                t.stopPoint.y = e.offsetY;
                                t.clear();
                                t.redrawAll();
                                t.arrowCoord(t.beginPoint, t.stopPoint);
                                t.sideCoord();
                                t.drawArrow1();
                            } else if (t.drawCircle) {
                                if (t.storage.x > e.offsetX) {
                                    var pointX = t.storage.x - Math.abs(t.storage.x - e.offsetX) / 2;
                                } else {
                                    var pointX = Math.abs(t.storage.x - e.offsetX) / 2 + t.storage.x;
                                }
                                if (t.storage.y > e.offsetY) {
                                    var pointY = t.storage.y - Math.abs(t.storage.y - e.offsetY) / 2;
                                } else {
                                    var pointY = Math.abs(t.storage.y - e.offsetY) / 2 + t.storage.y;
                                }
                                var lineX = Math.abs(t.storage.x - e.offsetX) / 2;
                                var lineY = Math.abs(t.storage.y - e.offsetY) / 2
                                t.clear();
                                t.redrawAll();
                                t.drawEllipse(pointX, pointY, lineX, lineY);
                            } else if (t.drawRect) {
                                t.rect.width = Math.abs(t.rect.x - e.offsetX)
                                t.rect.height = Math.abs(t.rect.y - e.offsetY)
                                if (t.rect.x > e.offsetX) {
                                    t.rect.realX = e.offsetX
                                } else {
                                    t.rect.realX = t.rect.x
                                }
                                if (t.rect.y > e.offsetY) {
                                    t.rect.realY = e.offsetY
                                } else {
                                    t.rect.realY = t.rect.y
                                }
                                t.clear();
                                t.redrawAll();
                                t.drawRect1(t.rect.realX, t.rect.realY, t.rect.width, t.rect.height);
                            }
                        }
                        if (t.move) {
                            var m_x = touch.offsetX;
                            var m_y = touch.offsetY;
                            t.clear();
                            t.status.imgArr.forEach(function(val) {
                                if (val.id == t.imgSrc) {
                                    val.left = m_x - t.clickX;
                                    val.top = m_y - t.clickY;
                                }
                            })
                            t.imgArea.forEach(function(val) {
                                if (val.id == t.imgSrc) {
                                    val.left = m_x - t.clickX;
                                    val.top = m_y - t.clickY;
                                    val.leftMin = m_x - t.clickX;
                                    val.topMin = m_y - t.clickY;
                                    val.leftMax = m_x - t.clickX + 36;
                                    val.topMax = m_y - t.clickY + 36;
                                }
                            })
                            t.redrawAll();
                        }
                    }
                };

                this.canvas['onmouseout'] = this.canvas['on' + t.EndEvent] = function(e) {
                    /*重置数据*/
                    var notInCanvas = e.offsetX > 733 || e.offsetX < 0 || e.offsetY > 453 || e.offsetY < 0;
                    if (!notInCanvas) {
                        if (t.drawArrow) {
                            var tempObj = {
                                beginPoint: t.beginPoint,
                                stopPoint: { x: e.offsetX, y: e.offsetY }
                            }
                            t.status.arrowArr.push(tempObj);
                            t.lastPush.push('arrow');
                            t.beginPoint = {};
                        } else if (t.drawCircle) {
                            // t.status.circleArr.push({ x: t.storage.x, y: t.storage.y, radius: t.storage.radius });
                            if (t.storage.x > e.offsetX) {
                                var pointX = t.storage.x - Math.abs(t.storage.x - e.offsetX) / 2;
                            } else {
                                var pointX = Math.abs(t.storage.x - e.offsetX) / 2 + t.storage.x;
                            }
                            if (t.storage.y > e.offsetY) {
                                var pointY = t.storage.y - Math.abs(t.storage.y - e.offsetY) / 2;
                            } else {
                                var pointY = Math.abs(t.storage.y - e.offsetY) / 2 + t.storage.y;
                            }
                            var lineX = Math.abs(t.storage.x - e.offsetX) / 2;
                            var lineY = Math.abs(t.storage.y - e.offsetY) / 2
                            t.status.circleArr.push({ x: pointX, y: pointY, a: lineX, b: lineY, radius: t.storage.radius });
                            t.lastPush.push('circle');
                            t.storage = {};
                        } else if (t.drawRect) {
                            t.status.rectArr.push({ realX: t.rect.realX, realY: t.rect.realY, width: t.rect.width, height: t.rect.height });
                            t.lastPush.push('rect');
                            t.rect = {};
                        } else if (t.drawLine) {
                            t.status.lineArr.push({ x: t.x, y: t.y, clickDrag: t.clickDrag, lineWidth: t.lineWidth })
                            t.lastPush.push('line');
                            t.x = [];
                            t.y = [];
                            t.clickDrag = [];
                        } else if (t.move) {

                        }
                    }

                    t.move = false;
                    t.lock = false;
                }
            },
            this.movePoint = function(x, y, dragging) {
                this.x.push(x);
                this.y.push(y);
                this.clickDrag.push(y);
            },
            this.drawPoint = function(x, y, clickDrag, lineWidth) {
                for (var i = 0; i < x.length; i++) //循环数组
                {
                    this.ctx.beginPath();

                    if (clickDrag[i] && i) {
                        this.ctx.moveTo(x[i - 1], y[i - 1]);
                    } else {
                        this.ctx.moveTo(x[i] - 1, y[i]);
                    }
                    this.ctx.lineWidth = lineWidth;
                    this.ctx.strokeStyle = '#e6071d';
                    this.ctx.lineTo(x[i], y[i]);
                    this.ctx.closePath();
                    this.ctx.stroke();
                }
            },
            this.getRadian = function(beginPoint, stopPoint) {
                this.angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math.PI * 180;
            },
            this.arrowCoord = function(beginPoint, stopPoint) {
                this.polygonVertex[0] = beginPoint.x;
                this.polygonVertex[1] = beginPoint.y;
                this.polygonVertex[6] = stopPoint.x;
                this.polygonVertex[7] = stopPoint.y;
                this.getRadian(beginPoint, stopPoint);
                this.polygonVertex[8] = stopPoint.x - CONST.edgeLen * Math.cos(Math.PI / 180 * (this.angle + CONST.angle));
                this.polygonVertex[9] = stopPoint.y - CONST.edgeLen * Math.sin(Math.PI / 180 * (this.angle + CONST.angle));
                this.polygonVertex[4] = stopPoint.x - CONST.edgeLen * Math.cos(Math.PI / 180 * (this.angle - CONST.angle));
                this.polygonVertex[5] = stopPoint.y - CONST.edgeLen * Math.sin(Math.PI / 180 * (this.angle - CONST.angle));
            },
            this.sideCoord = function() {
                var midpoint = {};
                midpoint.x = (this.polygonVertex[4] + this.polygonVertex[8]) / 2;
                midpoint.y = (this.polygonVertex[5] + this.polygonVertex[9]) / 2;
                this.polygonVertex[2] = (this.polygonVertex[4] + midpoint.x) / 2;
                this.polygonVertex[3] = (this.polygonVertex[5] + midpoint.y) / 2;
                this.polygonVertex[10] = (this.polygonVertex[8] + midpoint.x) / 2;
                this.polygonVertex[11] = (this.polygonVertex[9] + midpoint.y) / 2;
            },
            this.drawArrow1 = function() {
                this.ctx.fillStyle = "#e6071d";
                this.ctx.beginPath();
                this.ctx.moveTo(this.polygonVertex[0], this.polygonVertex[1]);
                this.ctx.lineTo(this.polygonVertex[2], this.polygonVertex[3]);
                this.ctx.lineTo(this.polygonVertex[4], this.polygonVertex[5]);
                this.ctx.lineTo(this.polygonVertex[6], this.polygonVertex[7]);
                this.ctx.lineTo(this.polygonVertex[8], this.polygonVertex[9]);
                this.ctx.lineTo(this.polygonVertex[10], this.polygonVertex[11]);
                this.ctx.closePath();
                this.ctx.fill();
            },
            this.createCircle = function(x, y, radius) { //绘制圆
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
            },
            this.createRect = function(x, y, width, height, radius, color, type) { //绘制圆
                this.ctx.beginPath();
                this.ctx.moveTo(x, y + radius);
                this.ctx.lineTo(x, y + height - radius);
                this.ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
                this.ctx.lineTo(x + width - radius, y + height);
                this.ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
                this.ctx.lineTo(x + width, y + radius);
                this.ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
                this.ctx.lineTo(x + radius, y);
                this.ctx.quadraticCurveTo(x, y, x, y + radius);
                this.ctx[type + 'Style'] = color;
                this.ctx.closePath();
                this.ctx[type]();
            },
            this.drawCircle1 = function(x, y, radius) {
                this.ctx.fillStyle = 'rgba(0,0,0,0)';
                this.ctx.strokeStyle = '#e6071d';
                this.ctx.lineWidth = 3;
                this.createCircle(x, y, radius)
            },
            this.drawEllipse = function(x, y, a, b, radius) {
                this.ctx.fillStyle = 'rgba(0,0,0,0)';
                this.ctx.strokeStyle = '#e6071d';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.ellipse(x, y, a, b, 0, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
            },
            this.drawRect1 = function(realX, realY, width, height) {
                this.ctx.lineWidth = 3;
                this.createRect(realX, realY, width, height, 3, '#e6071d', 'stroke')
            },
            this.preventDefault = function(e) {
                /*阻止默认*/
                var touch = this.touch ? e.touches[0] : e;
                if (this.touch) touch.preventDefault();
                else window.event.returnValue = false;
            },
            this.insertImg = function(id, src, left, top) {
                var t = this;
                this.imgArr.src = src;
                this.imgArr.left = left;
                this.imgArr.top = top;
                if (typeof src === 'string') {
                    var img = new Image();
                    img.src = src;
                    t.ctx.drawImage(img, left, top)
                } else {
                    t.ctx.drawImage(src, left, top)
                }
            },
            this.drawImg = function(id, src, left, top) {
                var t = this;
                this.imgArr.src = src;
                this.imgArr.left = left;
                this.imgArr.top = top;

                if (typeof src === 'string') {
                    var img = new Image();
                    // img.crossOrigin = "anonymous";
                    img.src = src;
                    img.onload = function() {
                        t.ctx.drawImage(img, left, top)
                    }
                } else {
                    t.ctx.drawImage(src, left, top)
                }
            },
            this.imgArraypush = function(id, src, left, top) {
                var tempObj = {
                    id: id,
                    left: left,
                    top: top,
                    leftMin: left,
                    leftMax: left + 36,
                    topMin: top,
                    topMax: top + 36,
                }
                this.imgArea.push(tempObj);
                this.lastPush.push('img');
                this.status.imgArr.push({ id: id, src: src, left: left, top: top })
            },
            this.redrawAll = function() {
                var t = this;
                if (this.status.lineArr.length > 0) {
                    this.status.lineArr.forEach(function(val, index) {
                        t.drawPoint(val.x, val.y, val.clickDrag, val.lineWidth);
                    })
                }
                if (this.status.arrowArr.length > 0) {
                    this.status.arrowArr.forEach(function(val, index) {
                        if (val.beginPoint != {}) {
                            t.arrowCoord(val.beginPoint, val.stopPoint);
                            t.sideCoord();
                            t.drawArrow1();
                        }
                    })
                }
                if (this.status.circleArr.length > 0) {
                    this.status.circleArr.forEach(function(val) {
                        t.drawEllipse(val.x, val.y, val.a, val.b, val.radius)
                    })
                }
                if (this.status.rectArr.length > 0) {
                    this.status.rectArr.forEach(function(val) {
                        t.drawRect1(val.realX, val.realY, val.width, val.height)
                    })
                }
                if (this.status.imgArr.length > 0) {
                    this.status.imgArr.forEach(function(val) {
                        t.insertImg(val.id, val.src, val.left, val.top)
                    })
                }
            },

            this.drawAll = function() {
                var t = this;
                if (this.status.lineArr.length > 0) {
                    this.status.lineArr.forEach(function(val, index) {
                        t.drawPoint(val.x, val.y, val.clickDrag, val.lineWidth);
                    })
                }
                if (this.status.arrowArr.length > 0) {
                    this.status.arrowArr.forEach(function(val, index) {
                        if (val.beginPoint != {}) {
                            t.arrowCoord(val.beginPoint, val.stopPoint);
                            t.sideCoord();
                            t.drawArrow1();
                        }
                    })
                }
                if (this.status.circleArr.length > 0) {
                    this.status.circleArr.forEach(function(val) {
                        t.drawEllipse(val.x, val.y, val.a, val.b, val.radius)
                    })

                }
                if (this.status.rectArr.length > 0) {
                    this.status.rectArr.forEach(function(val) {
                        t.drawRect1(val.realX, val.realY, val.width, val.height)
                    })
                }
                if (this.status.imgArr.length > 0) {
                    this.status.imgArr.forEach(function(val) {
                        t.drawImg(val.id, val.src, val.left, val.top)
                    })
                }
                this.status = {
                    index: 1,
                    lineArr: [],
                    arrowArr: [],
                    circleArr: [],
                    rectArr: [],
                    imgArr: [],
                };
            },

            this.clear = function() {
                this.ctx.clearRect(0, 0, this.w, this.h); //清除画布，左上角为起点
            },
            this.cancel = function() {
                if (this.lastPush.length > 0) {
                    var len = this.lastPush.length - 1
                    var lastType = this.lastPush[len];
                    if (lastType == 'img') {
                        this.lastCancel.push({ type: 'img', data: this.status.imgArr[this.status.imgArr.length - 1] });
                        this.status.imgArr.pop();
                    } else if (lastType == 'circle') {
                        this.lastCancel.push({ type: 'circle', data: this.status.circleArr[this.status.circleArr.length - 1] });
                        this.status.circleArr.pop();
                    } else if (lastType == 'rect') {
                        this.lastCancel.push({ type: 'rect', data: this.status.rectArr[this.status.rectArr.length - 1] });
                        this.status.rectArr.pop();
                    } else if (lastType == 'arrow') {
                        this.lastCancel.push({ type: 'arrow', data: this.status.arrowArr[this.status.arrowArr.length - 1] });
                        this.status.arrowArr.pop();
                    } else if (lastType == 'line') {
                        this.lastCancel.push({ type: 'line', data: this.status.lineArr[this.status.lineArr.length - 1] });
                        this.status.lineArr.pop();
                    }
                    this.lastPush.pop();
                    this.clear();
                    this.redrawAll();
                } else {
                    console.log('退无可退')
                }
            },
            this.restore = function() {
                if (this.lastCancel.length > 0) {
                    var len = this.lastCancel.length - 1;
                    var lastType = this.lastCancel[len].type;
                    var lastData = this.lastCancel[len].data
                    if (lastType == 'img') {
                        this.status.imgArr.push(lastData);
                        this.lastPush.push('img');
                    } else if (lastType == 'circle') {
                        this.status.circleArr.push(lastData);
                        this.lastPush.push('circle');
                    } else if (lastType == 'rect') {
                        this.status.rectArr.push(lastData);
                        this.lastPush.push('rect');
                    } else if (lastType == 'arrow') {
                        this.status.arrowArr.push(lastData);
                        this.lastPush.push('arrow');
                    } else if (lastType == 'line') {
                        this.status.lineArr.push(lastData);
                        this.lastPush.push('line');
                    }
                    this.lastCancel.pop();
                    this.clear();
                    this.redrawAll();
                } else {
                    console.log('进无可进')
                }
            }
    }
    window.paint = function(canvas, bgIndex) {
        var p = new paint();
        p.init(canvas, bgIndex);
        return p;
    };
    window.paintDraw = function(canvas, data) {
        var p = new paint();
        p.drawBg(canvas, data);
        return p;
    };
})();