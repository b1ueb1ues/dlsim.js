//import {dprint, print} from './print.js';
import {Timer} from './timeline.js';
export * from './print.js';
export * from './timeline.js';

export let ctx = 0;
export class Ctx {
    constructor() {
        ctx = this;
        Timer.init();
        return;
    }
    on() {
        ctx = this;
        return this;
    }
}

