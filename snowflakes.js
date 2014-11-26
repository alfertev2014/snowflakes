
function intRandom(begin, end) {
    return Math.round((Math.random() * (end - begin))) + begin;
}

function floatRandom(begin, end) {
    return (Math.random() * (end - begin)) + begin;
}

function FlakeScene() {

    var tongueArea = {xOff: 30, yOff: 35, width: 50, height: 30},
        eyesArea = {xOff: 30, yOff: 80, width: 50, height: 30},
        xFaceOff = 104,
        yFaceOff = 128,
        xFlakeOff = 32,
        yFlakeOff = 32,
        xScoreOff = 50,
        yScoreOff = 60,
        snowZoneHeight = 70;
    
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
    var flakeParticles = [];
    
    var scoreElement = document.getElementById("score");
    var snow = document.getElementById("snow");
    
    document.body.addEventListener("mousedown", onFaceMouseDown);
    document.body.addEventListener("mouseup", onFaceMouseUp);
    document.body.addEventListener("mousemove", onFaceMouseMove);
    
    for(var i = 0; i < 25; ++i) {
        addFlake(flakes, intRandom(0, parseInt(flakes.offsetWidth)), intRandom(0, 100));
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
    
    function setFlakeLocation(flakeElem, x, y) {
        flakeElem.style.left = Math.round(x - xFlakeOff) + "px";
        flakeElem.style.top = Math.round(y - yFlakeOff) + "px";
    }
    
    function updateFlakeElement(flake) {
        setFlakeLocation(flake.elem, flake.x, flake.y);
    }
    
    function addFlake(sceneElement, x, y) {
        var newFlake = flakeElementTemplate.cloneNode(true);
        newFlake.style.display = "block";
        var flake = {x: x, y: y, vx: 0, vy: 0, ax: 0, ay: 0, elem: newFlake};
        updateFlakeElement(flake);
        sceneElement.appendChild(newFlake);
        flakeParticles.push(flake);
    }
    
    function addSnowFlake(x, y) {
        var newFlake = flakeElementTemplate.cloneNode(true);
        newFlake.style.display = "block";
        setFlakeLocation(newFlake, x, y);
        snow.appendChild(newFlake);
    }
    
    function putFlakeOnTop(flake) {
        flake.x = intRandom(0, parseInt(flakes.offsetWidth));
        flake.y = 0;
        updateFlakeElement(flake);
    }
    
    function removeFlake(flakeParticles, i) {
        var flake = flakeParticles[i];
        flake.elem.parentNode.removeChild(flake);
        flakeParticles.splice(i, 1);
    }

    function tickFlake(flake) {
        if(intRandom(0, 10) < 5) {
            flake.ax = floatRandom(-0.2, 0.2);
            flake.ay = floatRandom(-0.2, 0.2);
        }
        flake.vx += floatRandom(-0.4, 0.4) + flake.ax;
        flake.vx *= 0.93;
        flake.vy += floatRandom(-0.4, 0.4) + flake.ay + 0.13;
        flake.vy *= 0.93;
        var newX = flake.x + flake.vx;
        var newY = flake.y + flake.vy;
        if(newX < 0)
            newX = flakes.offsetWidth;
        if(newX > flakes.offsetWidth)
            newX = 0;
        if(newY > flakes.offsetHeight - snowZoneHeight) {
            if(intRandom(0, 100) < 4) {
                addSnowFlake(newX, newY);
                putFlakeOnTop(flake);
                return;
            } else if(newY > flakes.offsetHeight) {
                putFlakeOnTop(flake);
                return;
            }
        }
        flake.x = newX;
        flake.y = newY;
        updateFlakeElement(flake);
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
                updateScore(faceStopped && intRandom(0, 10) < 4 ? "*! 6л@.. !*" : "! ай !", "#8bc", x, y);
                faceStop();
            }
        }
    }
    
    function snowTick() {
        for(var flake = snow.firstChild; flake; ) {
            if(flake.className == "flake") {
                var left = parseInt(flake.style.left);
                var top = parseInt(flake.style.top);
                if(top > snow.offsetHeight - yFlakeOff || top < snow.offsetHeight - yFlakeOff - snowZoneHeight ||
                    intRandom(0, 2000) < 1) {
                    var fl = flake;
                    flake = flake.nextSibling;
                    snow.removeChild(fl);
                    continue;
                }
            }
            flake = flake.nextSibling;
        }
    }
    
    function tickFlakes() {
        for(var i in flakeParticles) {
            var flake = flakeParticles[i];
            tickFlake(flake);
            eyesTick(flake);
        }
        if(eyesScore > 0) {
            eyesScore--;
        } else {
            faceUnstop();
        }
        scoreTick();
        snowTick();
    }
    
    function collidesWithFace(flake, x, y, areaWidth, areaHeight) {
        return flake.x > x - areaWidth && flake.x < x + areaWidth &&
            flake.y > y - areaHeight && flake.y < y + areaHeight;
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
        for(var i in flakeParticles) {
            var flake = flakeParticles[i];
            if(collidesWithFace(flake, x, y, areaWidth, areaHeight)) {
                putFlakeOnTop(flake);
                killed++;
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
    var timeShadow = document.getElementById("time-shadow");
    
    var countdownElement = document.getElementById("countdown");
    var countdownShadow = document.getElementById("countdown-shadow");
    
    var begin = new Date().getTime() / 1000;

    function timeToString(interval, nominative) {
        var text = "";
        var days = Math.floor((interval / 60) / 60 / 24);
        var hours = Math.floor((interval / 60) / 60) - days * 24;
        var minutes = Math.floor(interval / 60) - 60 * hours - days * 60 * 24;
        var seconds = Math.floor(interval) - 60 * minutes - 60 * 60 * hours - days * 60 * 60 * 24;
        if(days > 0) {
            text += days;
            if(days % 10 == 0 || days > 10 && days < 20)
                text += " дней ";
            else if(days % 10 == 1) text += " день ";
            else if(days % 10 < 5) text += " дня ";
            else text += " дней ";
        }
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
            else if(minutes % 10 == 1) text += nominative ? " минута " : " минуту ";
            else if(minutes % 10 < 5) text += " минуты ";
            else text += " минут ";
        }
        text += seconds;
        if(seconds % 10 == 0 || seconds > 10 && seconds < 20)
            text += " секунд";
        else if(seconds % 10 == 1) text += nominative ? " секунда " : " секундy ";
        else if(seconds % 10 < 5) text += " секунды ";
        else text += " секунд ";
        return text;
    }
    
    function killed() {
        var interval = new Date().getTime() / 1000 - begin;
        var text = "Вы убили " + timeToString(interval, false);
        timeElement.textContent = text;
        timeShadow.textContent = text;
    }
    
    function remains() {
        var now = new Date();
        var newYear = new Date(now.getFullYear() + 1, 0);
        var interval = newYear.getTime() / 1000 - now.getTime() / 1000;
        var text = "До Нового года осталось: " + timeToString(interval, true);
        countdownElement.textContent = text;
        countdownShadow.textContent = text;
    }
    
    function tick() {
        killed();
        remains();
    }

    setInterval(tick, 1000);
}

function onLoad() {
    document.body.addEventListener("dragstart", function(e) { e.preventDefault(); });
    document.body.addEventListener("selectstart", function(e) { e.preventDefault(); });
    document.body.addEventListener("dblclick", function(e) { e.preventDefault(); });
        
    FlakeScene();
    Time();
}

window.addEventListener("load", onLoad);
