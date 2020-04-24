import {now, Timer} from '../core/ctx.js'
import * as ctx from '../core/ctx.js'


class Tick {
    constructor(t, on_tick) {
        this.t_tick = Timer(on_tick);
        this.t = t;
    }
    start_at(inner_timing, speed=1) {
        if (this.t < inner_timing) {
            throw 'Tick < start';
        }
        this._speed = speed;
        this.pretick = (this.t - inner_timing) / speed;
        this.t_tick.on(this.pretick);
    }
    set speed(v) {
        this.pretick = this.t_tick.timeout * this._speed / v;
        this._speed = v;
        this.t_tick.on(this.pretick);
    }
}

function foo() {
    console.log('!', now());
}
let t = new Tick(1, foo);
Timer(function(timer) {
    console.log('accelerate', now());
    console.log(t);
    t.speed = 2;
}).on(0.25);
t.start_at(0.5);
ctx.run();




export class Action {
    static init(src) {
        let ctx = {"speed":1, "active":null, "next":null};
        function new_action (conf) {
            return new Action(ctx, conf);
        }
        return new_action;
    }
    constructor(ctx, conf) {
        this.ctx = ctx;
        this.status = -1;
        this.duration = conf.duration;
        this.speed = 1;
        this.soft_next = null;
        this.hard_next = null;

        this.t_end = Timer(this.on_end);
        this.tt_timers = [[this.duration, this.t_end]];

        this.hit(conf.hit);
        this.buff(conf.buff);
        this.cancel(conf.cancel);
        this.hook(conf.hook);

    }
    on_tick(t) {
    }

    on_end(t) {
    }

    hit(parts) {
        for (var i in parts) {
            let t = Timer(this.on_hit);
            t.timeout = parts[i].t;
            let idx = 0;
            for (var j in this.tt_timers){
                let tmp = this.tt_timers[j];
                if (t.timeout < tmp.timeout){
                    this.tt_timers.splice(idx, 0, t);
                    idx = -1;
                    break;
                }
                idx++;
            }
            if (idx != -1) {
                this.tt_timers.push(t);    
            }
        }
    }
    on_hit(t) {
    }

    buff() {
    }
    on_buff(t) {
    }

    cancel (parts) {
    }
    on_cancel(t) {
    }

    hook (parts) {
    }
    on_hook(t) {
    }

    farsee() { }

    on() { }
    off() { }
    set() { }
}

let conf_x = {"atype":"x", "delay":0.1, "duration":3, "proc":null};
let conf_s = {"atype":"s", "delay":0.1, "duration":3, "proc":null};
let conf_fs = {"atype":"fs", "marker":0.15, "delay":0.15, "duration":3, "proc":null};

let conf = conf_x;
conf.hit = [{"t":1, "hit":"test"},
            {"t":1.2, "hit":"test", "delay":[0, 0.1]}
           ];
conf.buff = [{"t":0.15, "buff":"test" }];
conf.cancel = [{"t":1, "cancel":"fs", "duration":1}];
conf.hook = [{"t":2, "hook":null }];
conf.input = [{"t":0, "duration":3, "atype":"x"}];

let c = {};
c.Action = Action.init();
let a = c.Action(conf);

//console.log(a.tt_timers);
