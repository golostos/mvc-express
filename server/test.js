class Super {
    static init(message) {
        console.log('Super ' + message);
    }
}

class Child extends Super {

}

// function Super2() {

// }

// Super2.init = function(message) {
//     console.log('Super ' + message);
// }

// function Child2() {

// }

// Object.assign(Child2, Super2);
// Child2.prototype = Object.create(Super2.prototype);
// Child2.prototype.constructor = Child2;

// Child2.init('hello');
console.log(Object.entries(Super))
console.log(Super.init)
