var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var solution = [];
var instructions = [];
var steps = [];
var n;
var count = 1;
var discProp = {
    height: 12,
    width: 20,
}

var pegProp = {
    width: 5,
    maxWidth: 150,
    seperation: 100
}

document.getElementById('btnSolve').onclick = function () {

    makeReady();

    n = parseInt(document.getElementById('numRings').value);

    //set Canvas Height
    var canvasHeight = ((determinePegHeight(n) + 80) * Math.pow(2, n));
    if (n > 7) canvasHeight = ((determinePegHeight(7) + 80) * Math.pow(2, 7)); // max limit is 7
    canvas.setAttribute('height', canvasHeight);

    if (n > 0) {
        var pegs = {
                "Source": [],
                "Auxiliary": [],
                "Destination": []
            }
            //fill the source with rings       
        for (i = n; i >= 1; i--) {
            pegs["Source"].push(i);
        }

        //        screen.textContent = "";
        instructions.push("Step 1 : Initial Step");
        hanoi(n, 'Source', 'Auxiliary', 'Destination');

        steps = generateSolution(solution, pegs);
        printToCanvas(steps, 0);

    } else {
        alert("Invalid no of disks");
    }
}

var hanoi = function (disc, src, aux, dst) {
    if (disc > 0) {
        hanoi(disc - 1, src, dst, aux);

        count++;
        var msg = 'Step ' + count + ' : Move disc ' + (disc) + ' from ' + src + ' to ' + dst;
        // screen.textContent += msg + '\n';
        instructions.push(msg);
        solution.push({
            from: src,
            to: dst
        });

        hanoi(disc - 1, aux, src, dst);
    }
}

function printToCanvas(steps, startY) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var pegHeight = determinePegHeight(n);

    var seperation = 40;
    var unitY = (pegHeight + 30);
    var y = seperation + startY;
    for (var i = 0; i < steps.length; i++) {
        var x = pegProp.maxWidth;
        printPeg(steps[i]["Source"], x, y, pegHeight);

        x = 2 * pegProp.maxWidth + pegProp.seperation;
        printPeg(steps[i]["Auxiliary"], x, y, pegHeight);

        x = 3 * pegProp.maxWidth + 2 * pegProp.seperation;
        printPeg(steps[i]["Destination"], x, y, pegHeight);

        //draw instruction
        ctx.fillStyle = "maroon";
        ctx.font = 'bold 11px sans-serif';
        var msg = instructions[i];
        var msgWidth = ctx.measureText(msg).width;
        var msgX = canvas.width / 2 - msgWidth / 2;
        var msgY = y + pegHeight + seperation / 1.5;
        //        console.log(msgX + " " + msgY + " " + msgWidth);
        ctx.fillText(msg, msgX, msgY);

        //draw seperation line
        ctx.beginPath();
        ctx.moveTo(0, y + pegHeight + seperation);
        ctx.lineTo(canvas.width, y + pegHeight + seperation);
        ctx.stroke();

        y += unitY + seperation;

    }

}

function printPeg(rings, x, y, height) {
    //    console.log(rings);

    var pX = x,
        pY = y,
        pHeight = height;
    //    console.log(pHeight);

    ctx.fillStyle = 'black';
    ctx.fillRect(pX, pY, pegProp.width, pHeight); // draw peg

    var base = {
        height: 5,
        width: 200
    };
    //draw base
    ctx.fillRect(pX - base.width / 2 + pegProp.width / 2, pY + pHeight, base.width, base.height);


    //draw rings
    for (var i = 0; i < rings.length; i++) {
        var width = discProp.width * rings[i];
        //        console.log(width);
        x = pX - width / 2 + pegProp.width / 2;
        y = (pY + pHeight) - (i * discProp.height) - discProp.height;
        //        console.log(x + " , " + y);
        ctx.fillStyle = 'chocolate';
        ctx.fillRect(x, y, width, discProp.height); // draw the ring
        ctx.strokeStyle = "black";
        ctx.strokeRect(x, y, width, discProp.height); // draw border

        ctx.fillStyle = "white";
        ctx.font = "bold 10px sans-serif";
        ctx.fillText(rings[i], pX, (y + 10));
    }



}

function generateSolution(solution, pegs) {
    var steps = [];

    steps.push(JSON.parse(JSON.stringify(pegs)));

    //steps.push(pegs);
    for (var i = 0; i < solution.length; i++) {
        var toMove = pegs[solution[i].from].pop();
        //        console.log(toMove);
        pegs[solution[i].to].push(toMove);

        steps.push(JSON.parse(JSON.stringify(pegs)));

    }

    //   console.log(steps);
    return steps;
}

function determinePegHeight(n) {
    return ((n * discProp.height) + 30);
}

function makeReady() {
    solution = [];
    instructions = [];
    count = 1;
    scrollY = 0;
}

var scrollY = 0;
var scrollUnit = 50;
document.getElementById('btnUp').onmousedown = function () {
    scroll(ctx, 0);
}

document.getElementById('btnDown').onmousedown = function () {
    scroll(ctx, 1);
}

function scroll(ctx, direction) {

    if (direction) scrollY -= scrollUnit;
    else scrollY += scrollUnit;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    printToCanvas(steps, scrollY);
}