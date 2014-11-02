
function intRandom(begin, end) {
    return Math.ceil((Math.random() * (end - begin))) + begin;
}

function FlakeScene(tongueArea, eyesArea, xFaceOff, yFaceOff, xFlakeOff, yFlakeOff, xScoreOff, yScoreOff) {

    var score = 0;
    var eyesScore = 0;
    var faceStopped = false;
    var scoreTicks = 0;
    
    var face = document.getElementById("face");
    var face1 = document.getElementById("face1");
    var face2 = document.getElementById("face2");
    var face3 = document.getElementById("face3");
    
    var flakeElementTemplate = document.getElementById("flake-template");
    var flakes = document.getElementById("flakes");
    var scoreElement = document.getElementById("score");
    
    document.body.addEventListener("mousedown", onFaceMouseDown);
    document.body.addEventListener("mouseup", onFaceMouseUp);
    document.body.addEventListener("mousemove", onFaceMouseMove);
    
    for(var i = 0; i < 20; ++i) {
        addFlake(intRandom(0, parseInt(flakes.offsetWidth)), intRandom(0, 100));
    }
    
    flakes.addEventListener("mousedown", onMouseDown);
    setInterval(tickFlakes, 50);

    function onFaceMouseMove(e) {
        if(faceStopped)
            return;
        face.style.left = e.clientX - xFaceOff + "px";
        face.style.top = e.clientY - yFaceOff + "px";
    }
    
    function onFaceMouseDown() {
        if(faceStopped)
            return;
        face1.style.visibility = "hidden";
        face2.style.visibility = "visible";
    }
    
    function onFaceMouseUp() {
        if(faceStopped)
            return;
        face1.style.visibility = "visible";
        face2.style.visibility = "hidden";
    }
    
    function addFlake(x, y) {
        var newFlake = flakeElementTemplate.cloneNode(true);
        newFlake.style.left = x - xFlakeOff + "px";
        newFlake.style.top = y - yFlakeOff + "px";
        newFlake.style.display = "block";
        flakes.appendChild(newFlake);
    }
    
    function putFlakeOnTop(flake) {
        flake.style.left = intRandom(0, parseInt(flakes.offsetWidth)) - xFlakeOff + "px";
        flake.style.top = -yFlakeOff + "px";
    }
    
    function removeFlake(flake) {
        flake.parentNode.removeChild(flake);
    }

    function tickFlake(flake) {
        var oldLeft = parseInt(flake.style.left);
        var oldTop = parseInt(flake.style.top);
        var newLeft = oldLeft + intRandom(-4, 4);
        var newTop = oldTop + intRandom(0, 3);
        if(newLeft < -xFlakeOff)
            newLeft = flakes.offsetWidth - xFlakeOff;
        if(newLeft > flakes.offsetWidth - xFlakeOff)
            newLeft = -yFlakeOff;
        if(newTop > flakes.offsetHeight - yFlakeOff)
            newTop = -yFlakeOff;
        flake.style.left = newLeft + "px";
        flake.style.top = newTop + "px";
    }
    
    function scoreColor(value) {
        if(value >= 1000) {
            return "#f0f";
        } else if(value >= 500) {
            return "#d81";
        } else if(value >= 300) {
            return "#a6f";
        } else if(value >= 200) {
            return "#b28";
        } else if(value >= 100) {
            return "#b95";
        } else if(value >= 50) {
            return "#9be";
        } else if(value >= 30) {
            return "#5ca";
        } else if(value >= 20) {
            return "#b95";
        } else if(value >= 10) {
            return "#99c";
        } else if(value >= 5) {
            return "#aba";
        } else {
            return "#668";
        }
    }
    
    function scoreTick() {
        var top = parseInt(scoreElement.style.top);
        if(top >= 0 && scoreTicks < 80) {
            top -= 2;
            scoreElement.style.top = top + "px";
            scoreTicks++;
        }
    }
    
    function faceStop() {
        faceStopped = true;
        face1.style.visibility = "hidden";
        face2.style.visibility = "hidden";
        face3.style.visibility = "visible";
    }
    
    function faceUnstop() {
        if(!faceStopped)
            return;
        faceStopped = false;
        face1.style.visibility = "visible";
        face2.style.visibility = "hidden";
        face2.style.visibility = "hidden";
        eyesScore = 0;
    }
    
    function eyesTick(flake) {
        var x = parseInt(face.style.left) + xFaceOff - eyesArea.xOff;
        var y = parseInt(face.style.top) + yFaceOff - eyesArea.yOff;
        if(collidesWithFace(flake, x, y, eyesArea.width, eyesArea.height)) {
            eyesScore += 4;
            if(eyesScore > 30) {
                putFlakeOnTop(flake);
            }
            if(eyesScore > 31) {
                updateScore("! ай !", "#8cf", x, y);
                faceStop();
            }
        }
    }
    
    function tickFlakes() {
        for(var flake = flakes.firstChild; flake; flake = flake.nextSibling) {
            if(flake.className == "flake") {
                tickFlake(flake);
                eyesTick(flake);
            }
        }
        if(eyesScore > 0) {
            eyesScore--;
        } else {
            faceUnstop();
        }
        scoreTick();
    }
    
    function collidesWithFace(flake, x, y, areaWidth, areaHeight) {
        var flakeX = parseInt(flake.style.left) + xFlakeOff;
        var flakeY = parseInt(flake.style.top) + yFlakeOff;
        return flakeX > x - areaWidth && flakeX < x + areaWidth &&
            flakeY > y - areaHeight && flakeY < y + areaHeight;
    }
    
    function updateScore(scoreText, color, x, y) {
        scoreElement.textContent =  scoreText;
        scoreElement.style.left = x - xScoreOff + "px";
        scoreElement.style.top = y - yScoreOff + "px";
        scoreElement.style.color = color;
        scoreTicks = 0;
    }
    
    function killflakes(x, y, areaWidth, areaHeight) {
        var killed = 0;
        for(var flake = flakes.firstChild; flake; flake = flake.nextSibling) {
            if(flake.className == "flake") {
                if(collidesWithFace(flake, x, y, areaWidth, areaHeight)) {
                    putFlakeOnTop(flake);
                    killed++;
                }
            }
        }
        return killed;
    }
    
    function catchFlake(x, y) {
        var killed = killflakes(x, y, tongueArea.width, tongueArea.height);
        if(killed > 0) {
            score += killed;
            updateScore("* " + score + " *", scoreColor(score), x, y);
        }
    }
    
    function onMouseDown(e) {
        if(faceStopped)
            return;
        catchFlake(e.clientX - tongueArea.xOff, e.clientY - tongueArea.yOff);
    }
}

function Time() {

    var timeElement = document.getElementById("time");
    
    var begin = new Date().getTime() / 1000;

    function tick() {
        var interval = new Date().getTime() / 1000 - begin;
        var text = "Вы убили ";
        var hours = Math.floor((interval / 60) / 60);
        var minutes = Math.floor(interval / 60) - 60 * hours;
        var seconds = Math.floor(interval) - 60 * minutes - 60 * 60 * hours;
        if(hours > 0) {
            text += hours;
            if(hours % 10 == 0 || hours > 10 && hours < 20)
                text += " часов ";
            else if(hours % 10 == 1) text += " час ";
            else if(hours % 10 < 5) text += " часа ";
            else text += " часов ";
        }
        if(minutes > 0) {
            text += minutes;
            if(minutes % 10 == 0 || minutes > 10 && minutes < 20)
                text += " минут ";
            else if(minutes % 10 == 1) text += " минуту ";
            else if(minutes % 10 < 5) text += " минуты ";
            else text += " минут ";
        }
        text += seconds;
        if(seconds % 10 == 0 || seconds > 10 && seconds < 20)
            text += " секунд";
        else if(seconds % 10 == 1) text += " секундy ";
        else if(seconds % 10 < 5) text += " секунды ";
        else text += " секунд ";
        timeElement.textContent = text;
    }

    setInterval(tick, 1000);
}

function onLoad() {
    document.body.addEventListener("dragstart", function(e) { e.preventDefault(); });
    document.body.addEventListener("dblclick", function(e) { e.preventDefault(); });
        
    FlakeScene({xOff: 30, yOff: 35, width: 50, height: 30},
               {xOff: 30, yOff: 80, width: 50, height: 30},
               104, 128, 32, 32, 50, 60);
    Time();
}

window.addEventListener("load", onLoad);
