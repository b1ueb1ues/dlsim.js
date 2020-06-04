import {now, Timer} from '../core/ctx.js'
import * as ctx from '../core/ctx.js'
import {print, dprint} from '../core/print.js'
import {Logger, logset} from '../core/log.js'



function Tick(...args) {
    return new _Tick(...args);
}

class _Tick {
    constructor(t, on_tick, data) {
        let tk = this;
        console.log('on_tick',on_tick);
        this.data = data;
        this._next = {};
        this._next.start_at = function(){};
        this.t_tick = Timer(function() {
            on_tick(tk.data);
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
        let nop = {};
        nop.cancel_data = {'x':1, 's':1, 'fs':1};
        nop.input_data = {'x':1, 's':1, 'fs':1};
        let ctx = {"speed":1, "active":nop, "next":null, "t_input":null, "t_marker":null, "nop":nop};
        function new_action (conf) {
            return new Action(ctx, conf);
        }
        return new_action;
    }
    constructor(ctx, conf) {
        this.ctx = ctx;
        this.state = 2; // -3:input -2:marker -1:ready 0:act 1:end
        this.conf = conf;
        this.atype = conf.atype;
        this.duration = conf.duration;
        if (conf.proc)
            this.proc = conf.proc;
        this.hit_cur = 0;
        this.hit_total = 0;
        this.speed = 1;
        this.soft_next = null;
        this.hard_next = null;

        this.cancel_data = {};
        this.input_data = {};

        this.tick_next_idx = 0;
        if (this.duration) {
            this.tk_end = Tick(this.duration, this.on_end);
            this.ticks = [this.tk_end];
        } else {
            this.ticks = [];
        }

        this.regist_start();
        this.add_tick(conf.input, this.on_input);
        this.add_tick(conf.hit, this.on_hit);
        this.add_tick(conf.hook, this.on_hook);
        this.add_tick(conf.buff, this.on_buff);
        this.add_tick(conf.cancel, this.on_cancel);
        this.regist_end();
        if (conf.hit) {
            this.hit_total = conf.hit.length;
        }
        console.log('hit_total',this.hit_total);
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
        this.on_input = function(conf) {
        }
    }

    regist_end() {
        if (this.ticks.length >= 2) {
            for (var i=1; i<this.ticks.length; i++) {
                this.ticks[i-1].next = this.ticks[i];
            }
        }
    }

    tap() {
        // must have an active action
        if (this.ctx.next) {
            return;
        } else {
            this.ctx.next = this;
        }
        
        if (this.conf.input) {  
            this.start_input();
            return;
        }
        if (this.conf.marker) {
            this.start_marker();
            return;
        }
    }

    start_input() {
        if (this.ctx.active.input_data[this.atype]){
            console.log('start input');
            this.state = -3;
            let host = this;
            this.ctx.t_input = Timer(function(){
                if (host.conf.marker) {  
                    host.start_marker();
                } else {
                    this.state = -1;
                }
                host.ctx.t_input = null;
            }).on(this.conf.input);
        }
    }

    start_marker() {
        if (this.ctx.active.input_data['fs']) {
            this.state = -2;
            let host = this;
            this.ctx.t_marker = Timer(function(){
                this.state = -1;
                this.on();
                host.ctx.t_marker = null;
            }).on(this.conf.marker);
        }
    }
    
    on() { 
        if (this.ctx.active.cancel_data[this.atype]) {
            this.state = 0;
            if (this.nospeed)
                this.ticks[this.tick_next_idx].start_at(0);
            else
                this.ticks[this.tick_next_idx].start_at(0, this.ctx.speed);
        }
    }

    off() { }

    on_end(t) {
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
let conf_s = {"atype":"s", "input":0.1, "duration":2, "proc":null};
let conf_fs = {"atype":"fs", "input":0.15, "marker":0.15,"duration":3, "proc":null};

//let conf = conf_x;
//conf_x.hit = [
//            {"t":1.2, "hit":"test", "delay":[0, 0.1]},
//            {"t":1, "hit":"test"},
//           ];
//conf.buff = [{"t":0.15, "buff":"test" }];
//conf.cancel = [{"t":1, "cancel":"fs", "duration":1}];
//conf.hook = [{"t":2, "hook":function() {console.log('hook')} }];
//conf.input = [{"t":0, "input":"x", "duration":3}];
//conf.next = [{"t":0.2, "next":null}]

let c = {};
c.Action = Action.init();
let x = c.Action(conf_x);
let s = c.Action(conf_s);
let fs = c.Action(conf_fs);
x.tap();
Timer(function(){
    s.tap();
}).on(0.5);
ctx.run();
