
var colors = ['red','orange','yellow','green','blue','purple','pink'];
var sounds = {
    'red' : "Sounds/Root.M4A",
    'orange' : "Sounds/Oranje.M4A",
    'yellow' : "Sounds/Geel.M4A",
    'green' : "Sounds/Groen.M4A",
    'blue' : "Sounds/Blauw.M4A",
    'purple' : "Sounds/Paars.M4A",
    'pink' : "Sounds/Roze.M4A"
};
var balloons = {};
var boribon = {
    ballooni : 3,
    state : 'hold', // 'leftJump','rightJump'
    jumpAnimLeft : 0,
    x : 0,
    y : 0,
    speedx : 0,
    speedy : 0,
}

var coloredBalloonCount = 0;

//Clear the canvas: the full balloons become empty again
function clearCanvas(){
    var emptyRed;
    var mySound = new Audio("Sounds/Schoon.M4A");
    mySound.play();

    for ( let colori in colors ) {
        let color = colors[colori];
        document.getElementById(color).src = "Balloons/empty_"+color+"_balloon.png";
    }

    coloredBalloonCount = 0;
}

function colorBalloon(color){
        var colorSound = new Audio(sounds[color]);
        colorSound.play();
        if ( (document.getElementById(color).src+"").indexOf("Balloons/"+color+"_balloon.png")<0 ) {
            document.getElementById(color).src = "Balloons/"+color+"_balloon.png";
            coloredBalloonCount++;
            if ( coloredBalloonCount >= 7 ) {
                colorSound.pause();
                endGame();
            }
        }
}

function setPos(color) {
    let img = document.getElementById(color);
    img.style.top=Math.round(balloons[color].y)+'px';
    img.style.left=Math.round(balloons[color].x)+'px';
}

function displayBoribon() {
    let boribonImg = document.getElementById("boribon");
    let leftHandImg = document.getElementById("leftHand");
    let rightHandImg = document.getElementById("rightHand");

    if ( boribon.state=='hold' || boribon.state=='win' ) {
        let color=colors[boribon.ballooni];
        leftHandImg.style.display='block';
        rightHandImg.style.display='block';
        boribonImg.src='boribon.png';
        boribonImg.style.top=Math.round(balloons[color].y)+250+"px";
        boribonImg.style.left=Math.round(balloons[color].x)-15+"px";
        leftHandImg.style.top=Math.round(balloons[color].y)+250+50+"px";
        leftHandImg.style.left=Math.round(balloons[color].x)-15-70+"px";
        rightHandImg.style.top=Math.round(balloons[color].y)+250+50+"px";
        rightHandImg.style.left=Math.round(balloons[color].x)-15+150+"px";
    } 
    
    else {
        leftHandImg.style.display='none';
        rightHandImg.style.display='none';
        boribonImg.src=boribon.state+'.png';
        boribon.x+=boribon.speedx;
        boribon.y+=boribon.speedy;
        boribon.speedy+=0.1;
        boribonImg.style.left=Math.round(boribon.x)+"px";
        boribonImg.style.top=Math.round(boribon.y)+"px";
        boribon.jumpAnimLeft--;
        if ( boribon.jumpAnimLeft<=0 && boribon.ballooni>=0 ) {
            let color=colors[boribon.ballooni];
            boribon.state='hold';
            colorBalloon(color);
        }
    }
}

function checkHand(dir) {
    let handCenter = document.getElementById(dir+"Hand").offsetLeft + 25;
    //console.log("handCenter "+handCenter);
    let minColori=-1;
    let minDistance=10000;

    for ( let colori in colors ) {
        let color = colors[colori];
        let balloonCenter = document.getElementById(color).offsetLeft + 55;
        let distance = Math.abs(handCenter-balloonCenter);
        //console.log("- "+color+" "+distance);

        if ( minColori==-1 || minDistance>distance ) {
            minColori = colori;
            minDistance = distance;
        }
    }

    //What happends when the little bear cannot grab the next balloon
    //console.log("minDistance "+minDistance);
    var fallingSound = new Audio("Sounds/Falling3.m4a");
    if ( minDistance>20 ) { // error limit
        boribon.ballooni = -1;
        fallingSound.play();
    } else {
        boribon.ballooni = minColori;
    }
}

function jump(dir) {
    //jump left or right function
    let color = colors[boribon.ballooni];
    boribon.state=dir+'Jump';
    if ( boribon.state=='leftJump' ) {
        boribon.x=Math.round(balloons[color].x)-15-50;
    } else {
        boribon.x=Math.round(balloons[color].x)-15+75;
    }
    boribon.y=Math.round(balloons[color].y)+250;
    boribon.jumpAnimLeft = 10;
    boribon.speedx = (boribon.state=='leftJump')?-4:4;
    boribon.speedy = 0;
    checkHand(dir);
}

function update() {
    let canvas = document.getElementById("canvas");
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    for ( let color in balloons ) {
        let img = document.getElementById(color);
        let balloon = balloons[color];
        let oldx = balloon.x;
        balloon.x += balloon.speedx;

        if ( boribon.state!='win' && (balloon.x<0 || balloon.x+img.clientWidth>width) ) {
            balloon.speedx=-balloon.speedx;
            balloon.x = oldx;
            balloon.x += balloon.speedx;
        }

        let oldy = balloon.y;
        balloon.y += balloon.speedy;
        if ( boribon.state!='win' && (balloon.y<0 || balloon.y+img.clientHeight>height) ) {
            balloon.speedy=-balloon.speedy;
            balloon.y = oldy;
            balloon.y += balloon.speedy;
        }
        setPos(color);
    }
    displayBoribon();
}

function tick() {
    update();
    window.setTimeout("tick()",20);
}

//The animation of the balloons when the page is refreshed
$(function() {

    var canvas = document.getElementById("canvas");
    let index = 0;
    for ( let colori in colors ) {
        let color = colors[colori];
        let angle = Math.random()*Math.PI*2;
        let speed = 1;
        balloons[color] = {
            x : 20+index*130,
            y : 80,
            speedx : Math.sin(angle)*speed,
            speedy : Math.cos(angle)*speed,
        }

        var img = document.createElement("img");
        img.id=color;
        img.src="Balloons/empty_"+color+"_balloon.png"
        index++;
        canvas.appendChild(img);
        setPos(color);
    }
    var img = document.createElement("img");
    img.id='boribon';
    img.src="boribon.png"
    canvas.appendChild(img);

    img = document.createElement("img");
    img.id='leftHand';
    img.src="leftHand.png"
    img.onclick= function(){jump('left')};
    img.style.cursor='grab';
    canvas.appendChild(img);

    img = document.createElement("img");
    img.id='rightHand';
    img.src="rightHand.png"
    img.onclick= function(){jump('right')};
    img.style.cursor='grab';
    canvas.appendChild(img);

    displayBoribon();

    var $img = $('img');
    $img.hide().each(function(index) {
      $(this).delay(70 * index).fadeIn(70);
    });
  
    tick();
  });

  function endGame(){
    boribon.state='win';
    for ( let colori in colors ) {
        let color = colors[colori];
        let angle = Math.random()*Math.PI*2;
        let speed = 1;
        balloons[color].speedy -= 3;
    }
    var successSound = new Audio("Sounds/Succes.m4a");
    successSound.play();
  }