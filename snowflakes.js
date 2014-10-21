
function intRandom(begin, end) {
    return Math.ceil((Math.random() * (end - begin))) + begin;
}

function FlakeScene(flakes, flakeElementTemplate, xTongueOff, yTongueOff, tongueWidth, tongueHeight, xFlakeOff, yFlakeOff) {

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
    
    function tick() {
        for(var flake = flakes.firstChild; flake; flake = flake.nextSibling) {
            if(flake.className == "flake") {
                tickFlake(flake);
            }
        }
    }
    
    function collidesWithFace(flake, x, y) {
        var flakeX = parseInt(flake.style.left) + xFlakeOff;
        var flakeY = parseInt(flake.style.top) + yFlakeOff;
        return flakeX > x - tongueWidth && flakeX < x + tongueWidth &&
            flakeY > y - tongueHeight && flakeY < y + tongueHeight;
    }
    
    function catchFlake(x, y) {
        for(var flake = flakes.firstChild; flake; flake = flake.nextSibling) {
            if(flake.className == "flake") {
                if(collidesWithFace(flake, x, y)) {
                    putFlakeOnTop(flake);
                    //break;
                }
            }
        }
    }
    
    function onMouseDown(e) {
        catchFlake(e.clientX - xTongueOff, e.clientY - yTongueOff);
    }
    
    for(var i = 0; i < 20; ++i) {
        addFlake(intRandom(0, parseInt(flakes.offsetWidth)), 0);
    }
    
    flakes.addEventListener("mousedown", onMouseDown);
    setInterval(tick, 50);
    
}

function Face(body, face, face1, face2, xOff, yOff) {

    function onMouseMove(e) {
        face.style.left = e.clientX - xOff + "px";
        face.style.top = e.clientY - yOff + "px";
    }
    
    function onMouseDown() {
        face1.style.visibility = "hidden";
        face2.style.visibility = "visible";
    }
    
    function onMouseUp() {
        face1.style.visibility = "visible";
        face2.style.visibility = "hidden";
    }

    body.addEventListener("mousedown", onMouseDown);
    body.addEventListener("mouseup", onMouseUp);
    body.addEventListener("mousemove", onMouseMove);
}

function Time(timeElement) {

    var begin = new Date().getTime() / 1000;

    function tick() {
        var interval = new Date().getTime() / 1000 - begin;
        var text = "Вы убили ";
        var hours = Math.floor(interval / 60 / 60);
        var minutes = Math.floor(interval / 60) - 60 * hours;
        var seconds = Math.floor(interval) - 60 * minutes;
        if(hours > 0) {
            text += hours;
            if(hours % 10 == 0 || hours > 10 && hours < 20)
                text += " часов ";
            else if(hours % 10 == 1) text += " час ";
            else if(hours % 10 < 5) text += " часа";
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
    var face = document.getElementById("face");
    var face1 = document.getElementById("face1");
    var face2 = document.getElementById("face2");
    Face(document.body, face, face1, face2, 104, 128);
    var flakeTemplate = document.getElementById("flake-template");
    var flakes = document.getElementById("flakes");
    FlakeScene(flakes, flakeTemplate, 30, 35, 50, 30, 32, 32);
    document.body.addEventListener("dragstart", function(e) { e.preventDefault(); });
    document.body.addEventListener("dblclick", function(e) { e.preventDefault(); });
    var time = document.getElementById("time");
    Time(time);
}

window.addEventListener("load", onLoad);
