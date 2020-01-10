//import {dprint, print} from './print.js';
import {_Timeline, _Timer} from './timeline.js';
export * from './print.js';

let active_ctx = 0;
export class _Ctx {
    constructor() {
        active_ctx = this;
        this.timeline = new _Timeline();
        return;
    }
    on() {
        active_ctx = this;
        return this;
    }
}
new _Ctx();

export function Ctx() {
    return new _Ctx();
}

export function Timer(cb) {
    return new _Timer(active_ctx.timeline, cb);
}

export function now() {
    return active_ctx.timeline._now;
}

export function run() {
    return active_ctx.timeline.run();
}


