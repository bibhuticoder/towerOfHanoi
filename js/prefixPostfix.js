function isOperator(c) {
    return (c === '+' || c === '-' || c === '*' || c === '/' || c === '%' || c === '$');
}

function getMatchingPair(c) {
    if (c === ')') return '(';
    else if (c === '}') return '{';
    else if (c === ']') return '[';
    else if (c === '(') return ')';
    else if (c === '{') return '}';
    else if (c === '[') return ']';
}

function checkSyntax(expression) {
    var symbolStack = new Stack();

    for (i = 0; i < expression.length; i++) {
        tmp = expression[i];
        if (tmp === '(' || tmp === '{' || tmp === '[') symbolStack.push(tmp);
        if (tmp === ')' || tmp === '}' || tmp === ']') {
            if (symbolStack.onTop() === getMatchingPair(tmp)) symbolStack.pop();
            else return false;
        }
    }

    if (symbolStack.isEmpty()) return true;
    else return false;
}

function reverse(expression) {
    var tmp = [],
        reversed = [],
        t = "",
        c;

    for (i = 0; i < expression.length; i++) {

        c = expression[i];
        if (isBracket(c, true)) tmp.push(getMatchingPair(c));
        else if (isOperand(c)) {
            t += c;
            while (isOperand(expression[++i]) && i < expression.length) t += expression[i];
            tmp.push(t);
            t = "";
            i--;
        } else if (isOperator(c)) {
            tmp.push(c);
        }
    }

    for (i = tmp.length - 1; i >= 0; i--) reversed.push(tmp[i]);

    return reversed;

}

function isOperand(c) {
    return ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || !isNaN(c));
}

function isBracket(c, checkClosed) {
    if (checkClosed) {
        return (c == '(' || c == '{' || c == '[' || c == ')' || c == '}' || c == ']');
    } else {
        return (c == '(' || c == '{' || c == '[');
    }
}

function precedence(c) {
    var precedenceTable = ['-', '+', '*', '/', '%', '$'];
    return precedenceTable.indexOf(c);
}

function toPostfix(expression) {
    var opStack = new Stack();
    var postStack = new Stack();
    var steps = [];

    var tmp = "";
    for (i = 0; i < expression.length; i++) {

        var c = expression[i];

        if (isBracket(c, false)) opStack.push(c);
        else if (isOperand(c)) {
            tmp += c;
            while (isOperand(expression[++i]) && i != expression.length) tmp += expression[i];
            c = tmp;
            postStack.push(c);
            tmp = "";
            i--;
        } else if (isOperator(c)) {

            if (!opStack.isEmpty() || isBracket(opStack.onTop(), false)) {

                if (precedence(c) > precedence(opStack.onTop())) {
                    // if greater goes to smaller one
                    opStack.push(c); // it stays there               
                } else {
                    // smaller goes to greater one
                    var toPush = opStack.pop(); //greater falls back to postStack                    
                    postStack.push(toPush);
                    opStack.push(c); // smaller stays
                }

            } else {
                opStack.push(c);
            }
        } else if (c === ')' || c === '}' || c === ']') {

            if (!opStack.isEmpty()) {
                while (opStack.onTop() !== getMatchingPair(c) && !opStack.isEmpty()) {
                    postStack.push(opStack.pop());
                }
                opStack.pop(); // remove remaining '(', '{', '['
            }
        }

        steps.push(c + '  |  ' + postStack.data + '  |  ' + opStack.data);
    }

    while (!opStack.isEmpty()) {

        postStack.push(opStack.pop());

        steps.push('  |  ' + postStack.data + '  |  ' + opStack.data);

    }

    return {
        final: postStack.data,
        steps: steps
    };

}

function toPrefix(expression) {
    var steps = [];

    //first reverse the expression

    console.log("pre rev exp" + reversedExpression);

    var reversedExpression = reverse(expression);

    console.log("pre rev exp" + reversedExpression);

    var reversedPostfix = toPostfix(reversedExpression);
    steps = reversedPostfix.steps;
    var prefixExpression = reverse(reversedPostfix.final);

    return {
        steps: steps,
        reversedExpression: reversedExpression,
        reversedPostfix: reversedPostfix,
        prefix: prefixExpression,
    }

}

function calculateExpression(expression) {
    var vStack = new Stack();
    var i;

    tmp = "";
    for (i = 0; i < expression.length; i++) {

        var c = expression[i];

        if (isOperand(c)) vStack.push(parseInt(c));

        else if (isOperator(c)) {

            var op1 = vStack.pop();
            var op2 = vStack.pop();

            console.log(op1);
            console.log(op2);

            if (c === '+') {
                vStack.push(op2 + op1);
            } else if (c === '-') {
                vStack.push(op2 - op1);
            } else if (c === '*') {
                vStack.push(op1 * op2);
            } else if (c === '/') {
                vStack.push(op2 / op1);
            } else if (c === '%') {
                vStack.push(op2 % op1);
            } else if (c === '$') {
                vStack.push(Math.pow(op2, op1));
            }
        }
    }

    return vStack.pop();

}