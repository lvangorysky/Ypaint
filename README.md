# Ypaint

## 使用方法

`import paint from 'Ypaint'`
`const newPaint = new Paint(paint);`

## 方法参数

### 绘制矩形：
```
newPaint.init({
    drawWay: 'rectangle',
    lineWidth: 4, 
    color: 'red',
    radius: 2,
    rectangleType: 'stroke'
})
```

### 画笔工具：
```
newPaint.init({
    drawWay: 'pencil',
    drawParams: {
        lineWidth: 4, 
        color: 'red',
    }
});
```


