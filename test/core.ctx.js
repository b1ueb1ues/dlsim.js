import { Ctx } from '../core/ctx.js'

class A {
    constructor (ctx) {
        console.log(ctx.test1);
        console.log(ctx.test2);
    }
    show(){
        console.log(this.ctx);
    }
    static init() {
        let c = Ctx(this);
        c.test1 = 'test1';
        return c;
    }
}
let newA = A.init();
newA.test2 = 'test2';
let a = newA();
a.show();
