/*
 * @Author: yhh
 * @LastEditors: yhh
 */
import Paint from "../src/index";

document.body.innerHTML = '<canvas id="canvas" width="800" height="600"></canvas>';
let canvas = document.getElementById('canvas')
let newPaint = new Paint(canvas)
test("function init", () => {
    expect(newPaint.init({}))
});

test("move start bind", () => {
    expect(newPaint.bindStartEvent(
        'pencel', 4, '#fff'
    ))
});