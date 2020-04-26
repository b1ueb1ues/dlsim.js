import {now, Timer} from '../core/ctx.js'
import * as ctx from '../core/ctx.js'



function Tick(t, on_tick) {
    return new _Tick(t, on_tick);
}

class _Tick {
    constructor(t, on_tick) {
        let tk = this;
        this._next = {};
        this._next.start_at = function(){};
        this.t_tick = Timer(function() {
            on_tick();
            tk._next.start_at(tk.t, tk._speed);
        });
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
    set next(v) {
        this._next = v;
    }
}


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
        this.tick_next = 0;
        this.cancel = {};

        this.tk_end = Tick(this.duration, this.on_end);
        this.ticks = [this.tk_end];

        let ts = this;
        let tmp = this.test;

        this.regist();
        this.add_tick(conf.hit, this.on_hit);
        //this.add_tick(conf.buff, this.on_buff);
        //this.add_tick(conf.cancel, this.on_cancel);
        //this.add_tick(conf.hook, this.on_hook);
        this.regist_();
    }

    regist() {
        let action = this;
        this.on_hit = function() {
            console.log('on_hit:', now());
            let tk_now = action.ticks[action.tick_next];
        }
    }
    regist_() {
        if (this.ticks.length >= 2) {
            for (var i=1; i<this.ticks.length; i++) {
                this.ticks[i-1].next = this.ticks[i];
            }
        }
    }


    on() { 
        this.ticks[this.tick_next].start_at(0, this.ctx.speed);
    }
    off() { }

    on_end(t) {
    }


    add_tick(conf, callback) {
        let action = this;
        for (var i in conf) {
            let tk = Tick(conf[i].t, callback);
            let idx = 0;
            for (var j in this.ticks){
                let tmp = this.ticks[j];
                if (tk.t < tmp.t){
                    this.ticks.splice(idx, 0, tk);
                    idx = -1;
                    break;
                }
                idx++;
            }
            if (idx != -1) {
                this.ticks.push(tk);    
            }
        }
    }

    add_buff(parts) {
    }
    on_buff(t) {
    }

    add_cancel(parts) {
    }
    on_cancel(t) {
    }

    add_hook(parts) {
    }
    on_hook(t) {
    }

    farsee() { }

}

let conf_x = {"atype":"x", "delay":0.1, "duration":3, "proc":null};
let conf_s = {"atype":"s", "delay":0.1, "duration":3, "proc":null};
let conf_fs = {"atype":"fs", "marker":0.15, "delay":0.15, "duration":3, "proc":null};

let conf = conf_x;
conf.hit = [
            {"t":1.2, "hit":"test", "delay":[0, 0.1]},
            {"t":1, "hit":"test"},
           ];
conf.buff = [{"t":0.15, "buff":"test" }];
conf.cancel = [{"t":1, "cancel":"fs", "duration":1}];
conf.hook = [{"t":2, "hook":null }];
conf.input = [{"t":0, "duration":3, "atype":"x"}];

let c = {};
c.Action = Action.init();
let a = c.Action(conf);
a.on();
ctx.run();
