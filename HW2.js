var canvas = document.getElementById("mycanvas");
var context = canvas.getContext("2d");
var img = new Image();

//定义变量
var FONT_HEIGHT = 21,//字体大小
    HAND_TRUNCATION = canvas.width / 24,
    HOUR_HAND_TRUNCATION = canvas.width / 10, //与指针长度相关
    NUMERAL_SPACING = 10,//未使用
    RADIUS = 185,//去了-MARGIN
   // HAND_RADIUS = RADIUS + NUMERAL_SPACING;
    HAND_RADIUS = 200,
    curTimeSecond = 0;

// Functions.....................................................

//画钟的外圆
function drawCircle(x,y,r,context) {
    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = '#359768';
    context.arc(x, y, r, 0, Math.PI*2);
    context.closePath();
    context.stroke();
}

//绘12个数字
function drawNumerals() {
    var numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        angle = 0,
        numeralWidth = 0;   
    context.beginPath();
        
    //只为数字添加阴影效果
    context.save();
    context.shadowColor = 'rgba(0,0,0,0.7)';
    context.shadowBlur = 10;
    context.shadowOffsetX = -5;
    context.shadowOffsetY = 5;
    numerals.forEach(function (numeral) {
        angle = Math.PI / 6 * (numeral - 3);  
        numeralWidth = context.measureText(numeral).width;//在画布上输出文本之前，检查字体的宽度
        context.fillText(numeral,
            canvas.width / 2 + Math.cos(angle) * (HAND_RADIUS) - numeralWidth / 2,
            canvas.height / 2 + Math.sin(angle) * (HAND_RADIUS) + FONT_HEIGHT / 3);
    });
    context.closePath();
    context.restore();
}

//画刻度线
function drawKedu() {
    var r = 0;
    for(var i = 0; i < 60; i++) {
        //有数字处的刻度线
        if(i % 5 == 0) {
            r = 170;
            context.lineWidth = 4;
        }
        else {
            r = 175;
            context.lineWidth = 2;
        }
        context.strokeStyle = '#4e1e1e';
        context.beginPath();
        context.moveTo((250 + 185 * Math.cos(i * 6 / 180.0 * Math.PI)),
                       (250 + 185 * Math.sin(i * 6 / 180.0 * Math.PI)));
        context.lineTo((250 + r * Math.cos(i * 6 / 180.0 * Math.PI)),
                       (250 + r * Math.sin(i * 6 / 180.0 * Math.PI)));
        context.closePath();
        context.stroke();
    }
}

//画圆心
function drawCenter(x, y, r, context) {
    context.fillStyle = '#f4806d';
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2);
    context.closePath();
    context.fill();
}

//画指针
function drawHand(loc, isHour,lWidth, color) {
    var angle = (450 - loc) / 180 * Math.PI,//以3点钟方向为起点
        handRadius = isHour ? RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION : RADIUS - HAND_TRUNCATION;
        //时针比分针与秒针短
    context.lineWidth = lWidth;
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(canvas.width / 2, canvas.height / 2);
    context.lineTo(canvas.width / 2 + Math.cos(angle) * handRadius,
                   canvas.height / 2 - Math.sin(angle) * handRadius);
    context.closePath();
    context.stroke();
}

function drawHands() {
    var date = new Date(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();
    hour = hour > 12 ? hour - 12 : hour;
    drawHand(hour * (360 / 12) + minute * 0.5, true, 3,"black"); //画时针（与分钟也有关）
    drawHand(minute * (360 / 60) + second * 0.1, false, 2,"black"); //画分针（与秒数也有关）
    drawHand(second * (360 / 60), false, 1,"red"); //画秒针
}

// function drawImage() {   
//     var img = new Image();
//     img.src = "time.jpg";
//     img.onload = function() {
//         var w = img.width;
//         var h = img.height;
//         var dw = 500/w      //canvas与图片的宽高比
//         var dh = 500/h
//         var ratio;       
//         // 裁剪图片中间部分
//         if(w > 500 && h > 500 || w < 500 && h < 500){
//             if (dw > dh) {
//                 context.drawImage(img, 0, (h - 500/dw)/2, w, 500/dw, 0, 0, 500, 500)
//             } else {
//                 context.drawImage(img, (w - 500/dh)/2, 0, 500/dh, h, 0, 0, 500, 500)
//             }
//         }
//         // 拉伸图片
//         else{
//             if(w < 500){
//                 context.drawImage(img, 0, (h - 500/dw)/2, w, 500/dw, 0, 0, 500, 500)
//             }else {
//                 context.drawImage(img, (w - 500/dh)/2, 0, 500/dh, h, 0, 0, 500, 500)
//             }
//         }
//     }

// }
function drawBackground() {
    var pattern = context.createPattern(img, 'no-repeat');
    context.fillStyle = pattern;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawClock() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();      
    drawCenter(250,250,5,context);
    drawKedu();
    drawCircle(250,250,185,context);
    drawHands();
    drawNumerals();
}



//Initialization................................................
context.font = FONT_HEIGHT + 'px Verdana';
img.src = 'time.png';

img.onload = function () {
    drawClock();//若不添加刷新的时候会...(难以描述)
    loop = setInterval(//按照指定的周期来调用函数，实现动画效果s
        drawClock,
        1000//ms
    );
}








