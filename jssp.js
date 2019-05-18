var service = new WebSocket('ws://localhost:8000/game');
service.onopen = function () {
    service.send(JSON.stringify("new"));
};
service.onmessage = function (event) {
    var spaceship = document.querySelector("#player");
    var obj = {};

    function reset() {
        alert("You are LOSER! Your score is " + parseInt(document.querySelector("#score").innerHTML));
        var arr = [];
        for (i = 0; i < robots.length; i++) {
            arr.push({'top': parseFloat(robots[i].style.top), 'left': parseFloat(robots[i].style.left)});
            robots[i].style.top = 9 + "vh";
            curr[i] = 9;
        }
        d = 60;
        l = 50;
        spaceship.style.top = d + "vh";
        spaceship.style.left = l + "vw";
        service.send(JSON.stringify("new"));
        document.querySelector("#score").innerHTML = 0;
    };
    a = parseInt(spaceship.style.left);
    b = parseInt(spaceship.style.top);
    for(i=0;i<robots.length;i++)
    {
        if((parseInt(robots[i].style.left)+5>a && a>parseInt(robots[i].style.left)) || ((a+5>parseInt(robots[i].style.left)) && a<parseInt(robots[i].style.left)) || ((a+5<=parseInt(robots[i].style.left)+5) && a>=parseInt(robots[i].style.left)))
        {
            if((parseInt(robots[i].style.top)+5>b) && (b+5>parseInt(robots[i].style.top)))
            {
                reset();
                return;
            }
        }
    }
    k = event.data;
    if (k == "\"s\"") {
        if (100 <= d + 7) {
            reset();
            return;
        }
        d += 2;
        spaceship.style.top = d + "vh";
    }
    else if (k == "\"w\"") {
        if (d <= 8) {
            reset();
            return;
        }
        d -= 2;
        spaceship.style.top = d + "vh";
    }
    else if (k == "\"d\"") {
        if (100 <= l + 6) {
            reset();
            return;
        }
        l += 2;
        spaceship.style.left = l + "vw";
    }
    else if (k == "\"a\"") {
        if (l <= 0) {
            reset();
            return;
        }
        l -= 2;
        spaceship.style.left = l + "vw";
    }
    a = parseInt(spaceship.style.left);
    b = parseInt(spaceship.style.top);
    for (i = 0; i < robots.length; i++) {
        robots[i].style.top = curr[i] + "vh"
        curr[i] = curr[i] + speeds[i]
        if (curr[i] >= 94) {
            curr[i] = 9;
            k = Math.random() * 7;
            if (k < 1) {
                k = 1;
            }
            speeds[i] = k;
            document.querySelector("#score").innerHTML = parseInt(document.querySelector("#score").innerHTML) + 1;
        }
    }
    var arr = [];
    for (i = 0; i < robots.length; i++) {
        arr.push({'top': parseFloat(robots[i].style.top), 'left': parseFloat(robots[i].style.left)});
    }
    service.send(JSON.stringify({
        "robots": arr,
        spaceship: {'top': parseFloat(spaceship.style.top), 'left': parseFloat(spaceship.style.left)}}));
};

d = 60;
l = 50;
robots = document.querySelectorAll(".robo>div");
speeds = []
for(i=0;i<robots.length;i++)
{
    k = ((Math.random())**2)*7;
    if(k<1)
    {
        k = 1;
    }
    speeds[i] = k;
}
curr = []
for(i=0;i<robots.length;i++)
{
    curr[i] = speeds[i]+9
}