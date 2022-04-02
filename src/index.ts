// define default params
const defaultDrawWay: string = "pencil";
const defaultLineWidth: number = 3;
const defaultColor: string = "#000000";
const defaultRadius: number = 0;
const defaultRectangleType: string = "stroke";
const defaultFillColor: string = "rgba(0, 0, 0, 0)";
// define params
class PaintEnviroment {
    public canvas;
    static touch: boolean = "createTouch" in document;
    static StartEvent = this.touch ? "touchstart" : "mousedown";
    static MoveEvent = this.touch ? "touchmove" : "mousemove";
    static EndEvent = this.touch ? "touchend" : "mouseup";
    //记录画笔
    constructor(canvas: any) {
        this.canvas = canvas;
    }
}

interface DrawOptions {
    drawWay?: string;
    lineWidth?: number;
    color?: string;
    radius?: number;
    rectangleType?: string;
    fillColor?: string;
}
class Paint extends PaintEnviroment {
    static isLock: boolean = false; // 鼠标是否在被拖动
    // 铅笔参数
    static clickDrag: Array<number> = [];
    static lineX: Array<number> = [];
    static lineY: Array<number> = [];
    // rect params
    static rectangle: any = {};
    // circle params
    static circle: any = {};
    //arrow params
    static arrowBeginPoint: any = {}
    static arrowStopPoint: any = {}
    static polygonVertex:any = []
    static angle:number
    // redraw array
    static contentList: any = {
        lineArr: [],
        rectArr: [],
        circleArr: [],
        arrowArr: []
    };
    // draw params
    static drawWay: string;
    static lineWidth: number;
    static color: string;
    static radius: number;
    static rectangleType: string;
    static fillColor: string;
    constructor(canvas: any) {
        super(canvas);
    }
    init(params: DrawOptions) {
        this.bindDrawOptions(params);
        this.bindDrawFunc();
    }
    bindStartEvent = (
        drawWay: string,
        drawLineWidth: number,
        drawColor: string
    ) => {
        this.canvas[`on${Paint.StartEvent}`] = (e: any) => {
            const touch = Paint.touch ? e.touches[0] : e;
            Paint.isLock = true;
            let _x = touch.offsetX;
            let _y = touch.offsetY;
            switch (drawWay) {
                case "pencil":
                    this.movePoint(_x, _y);
                    this.drawPoint(
                        Paint.lineX,
                        Paint.lineY,
                        Paint.clickDrag,
                        drawLineWidth,
                        drawColor
                    );
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
    bindMoveEvent = (
        drawWay: string,
        drawLineWidth: number,
        drawColor: string,
        drawRadius: number,
        drawRectangleType: string,
        drawFillColor: string
    ) => {
        this.canvas[`on${Paint.MoveEvent}`] = (e: any) => {
            if (Paint.isLock) {
                switch (drawWay) {
                    case "pencil":
                        this.movePoint(e.offsetX, e.offsetY);
                        this.drawPoint(
                            Paint.lineX,
                            Paint.lineY,
                            Paint.clickDrag,
                            drawLineWidth,
                            drawColor
                        );
                        break;
                    case "rectangle":
                        Paint.rectangle.width = Math.abs(
                            Paint.rectangle.x - e.offsetX
                        );
                        Paint.rectangle.height = Math.abs(
                            Paint.rectangle.y - e.offsetY
                        );
                        if (Paint.rectangle.x > e.offsetX) {
                            Paint.rectangle.realX = e.offsetX;
                        } else {
                            Paint.rectangle.realX = Paint.rectangle.x;
                        }
                        if (Paint.rectangle.y > e.offsetY) {
                            Paint.rectangle.realY = e.offsetY;
                        } else {
                            Paint.rectangle.realY = Paint.rectangle.y;
                        }
                        this.clear();
                        this.redrawAll();
                        this.createRect(
                            Paint.rectangle.realX,
                            Paint.rectangle.realY,
                            Paint.rectangle.width,
                            Paint.rectangle.height,
                            drawRadius,
                            drawColor,
                            drawLineWidth,
                            drawRectangleType
                        );
                        break;
                    case "circle":
                        let pointX, pointY, lineX, lineY: number;
                        if (Paint.circle.x > e.offsetX) {
                            pointX =
                                Paint.circle.x -
                                Math.abs(Paint.circle.x - e.offsetX) / 2;
                        } else {
                            pointX =
                                Math.abs(Paint.circle.x - e.offsetX) / 2 +
                                Paint.circle.x;
                        }
                        if (Paint.circle.y > e.offsetY) {
                            pointY =
                                Paint.circle.y -
                                Math.abs(Paint.circle.y - e.offsetY) / 2;
                        } else {
                            pointY =
                                Math.abs(Paint.circle.y - e.offsetY) / 2 +
                                Paint.circle.y;
                        }
                        lineX = Math.abs(Paint.circle.x - e.offsetX) / 2;
                        lineY = Math.abs(Paint.circle.y - e.offsetY) / 2;
                        this.clear();
                        this.redrawAll();
                        this.drawEllipse(
                            pointX,
                            pointY,
                            lineX,
                            lineY,
                            drawLineWidth,
                            drawColor,
                            drawFillColor
                        );
                        break;
                    case 'arrow':
                        Paint.arrowStopPoint.x = e.offsetX;
                        Paint.arrowStopPoint.y = e.offsetY;
                        this.clear();
                        this.redrawAll();
                        this.arrowCoord(Paint.arrowBeginPoint, Paint.arrowStopPoint, drawLineWidth);
                        this.sideCoord();
                        this.drawArrow(drawColor);
                        break;
                }
            }
        };
    };
    bindEndEvent = (
        drawWay: string,
        drawLineWidth: number,
        drawColor: string,
        drawRadius: number,
        drawRectangleType: string,
        drawFillColor: string
    ) => {
        this.canvas[`on${Paint.EndEvent}`] = (e: any) => {
            if (Paint.isLock) {
                switch (drawWay) {
                    case "pencil":
                        Paint.contentList.lineArr.push({
                            x: Paint.lineX,
                            y: Paint.lineY,
                            clickDrag: Paint.clickDrag,
                            lineWidth: drawLineWidth,
                            color: drawColor,
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
                            type: drawRectangleType,
                        });
                        Paint.rectangle = {};
                        break;
                    case "circle":
                        let pointX, pointY, lineX, lineY: number;
                        if (Paint.circle.x > e.offsetX) {
                            pointX =
                                Paint.circle.x -
                                Math.abs(Paint.circle.x - e.offsetX) / 2;
                        } else {
                            pointX =
                                Math.abs(Paint.circle.x - e.offsetX) / 2 +
                                Paint.circle.x;
                        }
                        if (Paint.circle.y > e.offsetY) {
                            pointY =
                                Paint.circle.y -
                                Math.abs(Paint.circle.y - e.offsetY) / 2;
                        } else {
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
                            fillColor: drawFillColor,
                        });
                        Paint.circle = {};
                        break;
                    case 'arrow':
                        const tempObj = {
                            beginPoint: Paint.arrowBeginPoint,
                            stopPoint: { x: e.offsetX, y: e.offsetY },
                            range: drawLineWidth,
                            color: drawColor
                        }
                        Paint.contentList.arrowArr.push(tempObj);
                        Paint.arrowBeginPoint = {
                            x:0,
                            y:0
                        };
                        break;
                }
                Paint.isLock = false;
            }
        };
    };
    bindDrawFunc() {
        this.bindStartEvent(Paint.drawWay, Paint.lineWidth, Paint.color);
        this.bindMoveEvent(
            Paint.drawWay,
            Paint.lineWidth,
            Paint.color,
            Paint.radius,
            Paint.rectangleType,
            Paint.fillColor
        );
        this.bindEndEvent(
            Paint.drawWay,
            Paint.lineWidth,
            Paint.color,
            Paint.radius,
            Paint.rectangleType,
            Paint.fillColor
        );
    }
    bindDrawOptions(params: DrawOptions) {
        Paint.drawWay = params.drawWay || defaultDrawWay;
        Paint.lineWidth = params.lineWidth || defaultLineWidth;
        Paint.color = params.color || defaultColor;
        Paint.radius = params.radius || defaultRadius;
        Paint.rectangleType = params.rectangleType || defaultRectangleType;
        Paint.fillColor = params.fillColor || defaultFillColor;
    }
    /**
     * @description: move mouse to draw line
     * @param {number} x
     * @param {number} y
     * @return {*}
     */
    movePoint = (x: number, y: number) => {
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
    drawPoint = (
        lineX: Array<number>,
        lineY: Array<number>,
        clickDrag: Array<number>,
        lineWidth: number,
        color: string
    ) => {
        const ctx = this.canvas.getContext("2d");
        for (var i = 0; i < lineX.length; i++) {
            ctx.canvas.getContext("2d").beginPath();
            if (clickDrag[i] && i) {
                ctx.moveTo(lineX[i - 1], lineY[i - 1]);
            } else {
                ctx.moveTo(lineX[i] - 1, lineY[i]);
            }
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.lineTo(lineX[i], lineY[i]);
            ctx.closePath();
            ctx.stroke();
        }
    };
    drawEllipse = (
        x: number,
        y: number,
        a: number,
        b: number,
        lineWidth: number,
        color: string,
        fillColor: string
    ) => {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.ellipse(x, y, a, b, 0, 0, 2 * Math.PI);
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = color;
        ctx.fill();
        ctx.stroke();
    }
    arrowCoord = (beginPoint:any, stopPoint:any, range:number) => {
        Paint.polygonVertex[0] = beginPoint.x;
        Paint.polygonVertex[1] = beginPoint.y;
        Paint.polygonVertex[6] = stopPoint.x;
        Paint.polygonVertex[7] = stopPoint.y;
        this.getRadian(beginPoint, stopPoint);
        Paint.polygonVertex[8] = stopPoint.x - 25 * Math.cos(Math.PI / 180 * (Paint.angle + range));
        Paint.polygonVertex[9] = stopPoint.y - 25 * Math.sin(Math.PI / 180 * (Paint.angle + range));
        Paint.polygonVertex[4] = stopPoint.x - 25 * Math.cos(Math.PI / 180 * (Paint.angle - range));
        Paint.polygonVertex[5] = stopPoint.y - 25 * Math.sin(Math.PI / 180 * (Paint.angle - range));
    }
    getRadian = (beginPoint:any, stopPoint:any) => {
        Paint.angle = Math.atan2(stopPoint.y - beginPoint.y, stopPoint.x - beginPoint.x) / Math.PI * 180;
    }
    sideCoord = () => {
        let midpoint:any = {
            x: 0,
            y: 0,
        };
        midpoint.x = (Paint.polygonVertex[4] + Paint.polygonVertex[8]) / 2;
        midpoint.y = (Paint.polygonVertex[5] + Paint.polygonVertex[9]) / 2;
        Paint.polygonVertex[2] = (Paint.polygonVertex[4] + midpoint.x) / 2;
        Paint.polygonVertex[3] = (Paint.polygonVertex[5] + midpoint.y) / 2;
        Paint.polygonVertex[10] = (Paint.polygonVertex[8] + midpoint.x) / 2;
        Paint.polygonVertex[11] = (Paint.polygonVertex[9] + midpoint.y) / 2;
    }
    drawArrow = (color: string) => {
        const ctx = this.canvas.getContext("2d");
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
    }
    createRect = (
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        color: string,
        lineWidth: number,
        type: string = "stroke"
    ) => {
        const ctx = this.canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width,
            y + height - radius
        );
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
    clear = () => {
        const ctx = this.canvas.getContext("2d");
        const width = this.canvas.width;
        const height = this.canvas.height;
        ctx.clearRect(0, 0, width, height); //清除画布，左上角为起点
    };
    /**
     * @description: use contentList redraw all picture
     */
    redrawAll = () => {
        Paint.contentList.rectArr.length &&
            Paint.contentList.rectArr.forEach((val: any) => {
                this.createRect(
                    val.realX,
                    val.realY,
                    val.width,
                    val.height,
                    val.radius,
                    val.color,
                    val.lineWidth,
                    val.type
                );
            });

        Paint.contentList.lineArr.length > 0 &&
            Paint.contentList.lineArr.forEach((val: any) => {
                this.drawPoint(
                    val.x,
                    val.y,
                    val.clickDrag,
                    val.lineWidth,
                    val.color
                );
            });
        Paint.contentList.circleArr.length > 0 &&
            Paint.contentList.circleArr.forEach((val: any) => {
                this.drawEllipse(
                    val.x,
                    val.y,
                    val.a,
                    val.b,
                    val.lineWidth,
                    val.color,
                    val.fillColor
                );
            });
            Paint.contentList.arrowArr.length > 0 &&
            Paint.contentList.arrowArr.forEach((val: any) => {
                if (val.beginPoint && val.beginPoint.x) {
                    this.arrowCoord(val.beginPoint, val.stopPoint, val.range);
                    this.sideCoord();
                    this.drawArrow(val.color);
                }
            });
    };
}

export default Paint;
