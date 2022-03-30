// define default params
const defaultLineWidth: number = 3;
const defaultColor: string = '#000000';
const defaultRadius: number = 0;
const defaultRectangleType: string = 'stroke'
// define params
class PaintEnviroment {
    public canvas;
    static touch: boolean = "createTouch" in document;
    static StartEvent = this.touch ? "touchstart" : "mousedown";
    static MoveEvent = this.touch ? "touchmove" : "mousemove";
    static EndEvent = this.touch ? "touchend" : "mouseup";
    //记录画笔
    constructor(canvas) {
        this.canvas = canvas;
    }
}

interface DrawWayParams {
    drawWay: string;
    drawParams: {
        lineWidth: number;
        color: string;
        radius?: number;
        rectangleType?: string;
    };
}

class Paint extends PaintEnviroment {
    static isLock: boolean = false; // 鼠标是否在被拖动
    // 铅笔参数
    static clickDrag: Array<number> = [];
    static lineX: Array<number> = [];
    static lineY: Array<number> = [];
    // 矩形参数
    static rectangle: any = {};

    // redraw array
    static contentList :any = {
        lineArr: [],
        rectArr: []
    };

    constructor(canvas) {
        super(canvas);
    }
    
    bindStartEvent = (params, drawLineWidth, drawColor) => {
        this.canvas[`on${Paint.StartEvent}`] = (e) => {
            const touch = Paint.touch ? e.touches[0] : e;
            Paint.isLock = true;
            let _x = touch.offsetX;
            let _y = touch.offsetY;
            switch (params.drawWay) {
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
            }
        }
    }
    bindMoveEvent = (params, drawLineWidth, drawColor, drawRadius, drawRectangleType) => {
        this.canvas[`on${Paint.MoveEvent}`] = (e) => {
            if (Paint.isLock) {
                switch (params.drawWay) {
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
                }
            }
        }    
        
    }
    bindEndEvent = (params,drawLineWidth, drawColor, drawRadius, drawRectangleType) => {
        this.canvas[`on${Paint.EndEvent}`] = (e) => {
            if (Paint.isLock) {
                switch (params.drawWay) {
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
                            type: drawRectangleType
                        });
                        Paint.rectangle = {};
                        break;
                }
                Paint.isLock = false;
            }
        };
    }
    bindDrawWay(params: DrawWayParams) {
        let drawLineWidth = params.drawParams?.lineWidth || defaultLineWidth;
        let drawColor = params.drawParams?.color || defaultColor;
        let drawRadius = params.drawParams?.radius || defaultRadius
        let drawRectangleType = params.drawParams?.rectangleType || defaultRectangleType  
        this.bindStartEvent(params, drawLineWidth, drawColor);
        this.bindMoveEvent(params, drawLineWidth, drawColor, drawRadius, drawRectangleType);
        this.bindEndEvent(params,drawLineWidth, drawColor, drawRadius, drawRectangleType)
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
        console.log('createRect')
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
    };
}

export default Paint;