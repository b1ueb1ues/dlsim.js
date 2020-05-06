import {now, Timer} from '../core/ctx.js'
import * as ctx from '../core/ctx.js'



function Tick(...args) {
    return new _Tick(...args);
}

class _Tick {
    constructor(t, on_tick, data) {
        let tk = this;
        console.log(on_tick);
        this.data = data;
        this._next = {};
        this._next.start_at = function(){};
        this.t_tick = Timer(function() {
            on_ick(tk.data);
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
        this.state = 2; // -2:input -1:marker 0:active 1:end
        this.conf = conf;
        this.atype = conf.atype;
        this.itype = conf.itype;
        this.delay = conf.delay;
        this.marker = conf.marker;
        this.duration = conf.duration;
        if (conf.proc)
            this.proc = conf.proc;
        this.hit_cur = 0;
        this.hit_total = 0;
        this.speed = 1;
        this.soft_next = null;
        this.hard_next = null;
        this.tick_next = 0;
        this.cancel = null;
        this.input = null;
        this.lock = 1;

        this.tk_end = Tick(this.duration, this.on_end);
        this.ticks = [this.tk_end];

        this.regist_start();
        this.add_tick(conf.input, this.on_input);
        this.add_tick(conf.hit, this.on_hit);
        this.add_tick(conf.hook, this.on_hook);
        this.add_tick(conf.buff, this.on_buff);
        this.add_tick(conf.cancel, this.on_cancel);
        this.regist_end();
        this.hit_total = conf.hit.length;
        console.log(this.hit_total);
    }

    regist_start() {
        let action = this;
        this.on_hit = function(conf) {
            console.log(`${now().toFixed(3)}: hitlabel_${conf.hit}`);
            action.hit_cur++;
        }
        this.on_cancel = function(conf) {
            console.log(`${now().toFixed(3)}: canceldata_${conf.cancel}`);
        }
        this.on_hook = function(conf) {
            conf.hook();
        }
        this.on_buff = function(conf) {
        }
    }
    regist_end() {
        if (this.ticks.length >= 2) {
            for (var i=1; i<this.ticks.length; i++) {
                this.ticks[i-1].next = this.ticks[i];
            }
        }
    }

    on() { 
        this.hit_cur = 0;
        if (this.check) {
            if (this.nospeed)
                this.ticks[this.tick_next].start_at(0);
            else
                this.ticks[this.tick_next].start_at(0, this.ctx.speed);
        }
        this.ticks[this.tick_next].start_at(0, this.ctx.speed);
    }
    off() { }

    pre() {
        if (this.input) {

        }

    }

    on_end(t) {
    }

    check() {
        if (!this.ctx.active) {
            return 1;
        }
        if (this.atype in this.ctx.active.cancel) {
            return 1;
        }
        if (this.itype in this.ctx.active.input) {
            return 1;
        }
    }


    add_tick(conf, callback) {
        let action = this;
        for (var i in conf) {
            let tk = Tick(conf[i].t, callback, conf[i]);
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

    farsee() { }
    proc() { }
}

let conf_x = {"atype":"x", "input":0.1, "duration":3, "proc":null};
let conf_s = {"atype":"s", "input":0.1, "duration":3, "proc":null};
let conf_fs = {"atype":"fs", "input":0.15, "marker":0.15,"duration":3, "proc":null};

let conf = conf_x;
conf.hit = [
            {"t":1.2, "hit":"test", "delay":[0, 0.1]},
            {"t":1, "hit":"test"},
           ];
conf.buff = [{"t":0.15, "buff":"test" }];
conf.cancel = [{"t":1, "cancel":"fs", "duration":1}];
conf.hook = [{"t":2, "hook":function() {console.log('hook')} }];
conf.input = [{"t":0, "input":"x", "duration":3}];
conf.next = [{"t":0.2, "next":null}]

let c = {};
c.Action = Action.init();
let a = c.Action(conf);
a.on();
ctx.run();
