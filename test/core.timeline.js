import {Timeline} from '../core/timeline.js'

var Timer = Timeline.init();
class A {
    constructor() {
        this.timer = Timer.to(this);
        this.t = this.timer('test').o(1);
    }
    on_test(t) {
        console.log(this);
    }
}

let a = new A();
console.log(a.t);

