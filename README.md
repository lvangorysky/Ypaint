# Ypaint

## 使用方法

`import paint from 'Ypaint'`
`const newPaint = new Paint(paint);`

## 方法参数

<!-- ### 绘制圆形：

`paint.chooseCircle()`

#### 圆形其他参数

圆形的粗细 paint.outerParams.circle.lineWidth  
圆形的颜色 paint.outerParams.circle.color -->

### 绘制矩形：

`newPaint.bindDrawWay({
    drawWay: 'rectangle',
    drawParams: {
        lineWidth: 4, 
        color: 'red',
        radius: 2,
        rectangleType: 'stroke'
    }
});`

### 画笔工具：

`newPaint.bindDrawWay({
    drawWay: 'pencil',
    drawParams: {
        lineWidth: 4, 
        color: 'red',
    }
});`


