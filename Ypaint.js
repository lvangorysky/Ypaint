(function(){
	console.log("\n %c APlayer 1.6.1 %c http://aplayer.js.org \n\n","color: #fadfa3; background: #030307; padding:5px 0;","background: #fadfa3; padding:5px 0;");
	function Ypaint(){
		this.init = function(canvas){
			this.outerParams= {
				rect:{},
				circle:{},
				line:{},
				arrow:{},
			}
			this.isLine = false,
            this.isArrow = false,
            this.isRect = false,
            this.isCircle = false,
			this.lock = false; //鼠标是否在被拖动
			this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d'); //canvas对象
            this.w = this.canvas.width; //画布的宽
        	this.h = this.canvas.height; //画布的高  	
        	this.touch = ("createTouch" in document); //判定是否为手持设备
            this.StartEvent = this.touch ? "touchstart" : "mousedown";
            this.MoveEvent = this.touch ? "touchmove" : "mousemove";
            this.EndEvent = this.touch ? "touchend" : "mouseup";
            this.clickDrag = [];
            this.lineX = [];
            this.lineY = [];
            this.beginPoint = {};
            this.stopPoint = {}; 
            this.storage = {};
            this.rect = {}; //
            this.polygonVertex = [];
            this.status = {
                lineArr: [],
                arrowArr: [],
                circleArr: [],
                rectArr: [],
            };
            this.bind()
		}
		this.bind = function(){
			var t = this;
			this.canvas['on' + t.StartEvent] = function(e) {
				var touch = t.touch ? e.touches[0] : e;
                //记录点击的坐标点
                t.lock = true;
                var _x = touch.offsetX;
                var _y = touch.offsetY;
                if(t.isRect){
                	t.rect.x = _x;
	            	t.rect.y = _y;
                } else if (t.isCircle) {
                    t.storage.x = _x;
                    t.storage.y = _y;
                } else if (t.isLine) {
                    t.movePoint(_x, _y);
                    t.drawPoint(t.lineX, t.lineY, t.clickDrag, t.outerParams.line.lineWidth, t.outerParams.line.color);
                } else if (t.drawArrow) {
                    t.beginPoint.x = _x;
                    t.beginPoint.y = _y;
                } 
			}

			this.canvas['on' + t.MoveEvent] = function(e) {
				if(t.lock){
					if(t.isRect){
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
			            t.drawRect(t.rect.realX, t.rect.realY, t.rect.width, t.rect.height, t.outerParams.rect.radius, t.outerParams.rect.color,t.outerParams.rect.lineWidth);
					} else if (t.isCircle) {
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
                        t.drawEllipse(pointX, pointY, lineX, lineY, t.outerParams.circle.lineWidth ,t.outerParams.circle.color);
                    } else if (t.isLine) {
                        t.movePoint(e.offsetX, e.offsetY, true);
                        t.drawPoint(t.lineX, t.lineY, t.clickDrag, t.lineWidth, t.outerParams.line.color);
                    }  			
				}
			}

			this.canvas['on' + t.EndEvent] = function(e) {
				if(t.isRect){
					t.status.rectArr.push({ realX: t.rect.realX, realY: t.rect.realY, width: t.rect.width, height: t.rect.height, radius: t.outerParams.rect.radius, color: t.outerParams.rect.color, lineWidth: t.outerParams.rect.lineWidth});
					t.rect = {};
				}else if (t.isCircle) {
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
                    var lineY = Math.abs(t.storage.y - e.offsetY) / 2;
                    t.status.circleArr.push({ x: pointX, y: pointY, a: lineX, b: lineY, color: t.outerParams.circle.color, lineWidth: t.outerParams.circle.lineWidth});
                    console.log(t.status)
                    t.storage = {};
                } else if (t.isLine) {
                    t.status.lineArr.push({ x: t.lineX, y: t.lineY, clickDrag: t.clickDrag, lineWidth: t.outerParams.line.lineWidth, color: t.outerParams.line.color})
                    t.lineX = [];
                    t.lineY = [];
                    t.clickDrag = [];
                } 
				t.lock = false;
			}
		}
        this.movePoint = function(x, y) {
            this.lineX.push(x);
            this.lineY.push(y);
            this.clickDrag.push(y);
        },
        this.drawPoint = function(x, y, clickDrag, lineWidth, color) {
            for (var i = 0; i < x.length; i++) //循环数组
            {
                this.ctx.beginPath();
                if (clickDrag[i] && i) {
                    this.ctx.moveTo(x[i - 1], y[i - 1]);
                } else {
                    this.ctx.moveTo(x[i] - 1, y[i]);
                }
                this.ctx.lineWidth = lineWidth;
                this.ctx.strokeStyle = color;
                this.ctx.lineTo(x[i], y[i]);
                this.ctx.closePath();
                this.ctx.stroke();
            }
        },
		this.createRect = function(x, y, width, height, radius, color, type ,lineWidth) { //绘制圆
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
            this.ctx.lineWidth = lineWidth;
            this.ctx.closePath();
            this.ctx[type]();
        },
        this.drawRect = function(realX, realY, width, height, radius, color, lineWidth){
            this.createRect(realX, realY, width, height, radius, color, 'stroke', lineWidth)
        }
        this.drawEllipse = function(x, y, a, b, lineWidth, color) {
            this.ctx.beginPath();
            this.ctx.ellipse(x, y, a, b, 0, 0, 2 * Math.PI);
            this.ctx.lineWidth = lineWidth;
            this.ctx.fillStyle = 'rgba(0,0,0,0)';
            this.ctx.strokeStyle = color;
            this.ctx.fill();
            this.ctx.stroke();
        },
        this.clear = function(){
        	this.ctx.clearRect(0, 0, this.w, this.h); //清除画布，左上角为起点
        }
        this.redrawAll = function(){
        	var t = this;
        	if (this.status.rectArr.length > 0) {
                this.status.rectArr.forEach(function(val) {
                    t.drawRect(val.realX, val.realY, val.width, val.height, val.radius, val.color, val.lineWidth)
                })
            }
            if (this.status.circleArr.length > 0) {
                this.status.circleArr.forEach(function(val) {
                    t.drawEllipse(val.x, val.y, val.a, val.b, val.lineWidth, val.color)
                })

            }
            if (this.status.lineArr.length > 0) {
                this.status.lineArr.forEach(function(val, index) {
                    t.drawPoint(val.x, val.y, val.clickDrag, val.lineWidth, val.color);
                })
            }
        }
	}
	window.Ypaint = function(canvas) {
        var p = new Ypaint();
        p.init(canvas);
        return p;
    };
})()