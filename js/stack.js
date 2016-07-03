function Stack() {
    this.top = -1;
    this.MAX = 100;
    this.data = [];
}

Stack.prototype.push = function (val) {

    if (!this.isFull()) {
        this.top++;
        this.data.push(val);
        //console.log(val + " pushed");
    } else {
        console.log("Error : Stack is full");
    }

}

Stack.prototype.pop = function () {

    if (!this.isEmpty()) {
        var toReturn = this.data[this.top];
        this.data.splice((this.top) --, 1);
        return (toReturn);
    } else {
        console.log("Error : Stack is empty");
    }

}

Stack.prototype.isEmpty = function () {
    return (this.top === -1);
}

Stack.prototype.isFull = function () {
    return (this.top + 1 === this.MAX);
}

Stack.prototype.onTop = function () {
    return (this.data[this.top]);
}

Stack.prototype.printStack = function () {
    console.log(this.data);
    //console.log(postStack);
}
