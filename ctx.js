import {print, dprint} from './print.js';
import {timer, now, run} from './timeline.js';
export {print, dprint, Timer, now, run};

export class Ctx {
    constructor() {
        this.tl = Timer.init();
        console.log(this.__proto__);
        this.test = 1;
        return;
    }
    init(){
        print(this.test);
    }
}
let ctx = new Ctx();
export {ctx};
