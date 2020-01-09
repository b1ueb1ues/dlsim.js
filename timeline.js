import {print, dprint} from './print.js'

let ctx = {};
export function now() {
    return ctx.timeline._now;
}

export function run() {
    ctx.timeline.run();
}

export function timer(...args){
    return new Timer(...args);
}

class Timeline {
    constructor() {
        this._tlist = [];
        this._now = 0;
    }

    print() {
        print(this.name);
    }

    add(t) {
        this._tlist.push(t);
    }

    rm(t) {
        var i = this._tlist.indexOf(t);
        return this._tlist.splice(i);
    }

    on() {
        ctx.timeline = this;
        return this;
    }

    run(duration=180) {
        this.on();
        duration += this._now;
        while(1){
            if (this._now > duration)
                return;
            if (this.process_head() == -1)
                return;
        }
    }

    process_head() {
        let tcount = this._tlist.length;
        if (tcount == 0) {
            return -1; }
        if (tcount == 1) {
            let headtiming = this._tlist[0].timing;
            let headindex = 0; }
        else { // if tcount >= 2
            let headtiming = this._tlist[0].timing;
            let headindex = 0;
            for (var i=1; i < tcount; i++) {
                let timing = this._tlist[i].timing;
                if (timing < headtiming) {
                    headtiming = timing;
                    headindex = i; } } }

        if (headtiming >= this._now) {
            this._now = headtiming;
            let headt = this._tlist[headindex];
            let suc = headt.callback(); 
            if (suc) {
                this._tlist.splice(headindex,1); } }
        else {
            dprint('timeline time err');
            errrrrrrrrr(); }
        return 0;
    }
}

export class Timer {
    constructor(cb) {
        if (cb) {
            this._callback = cb; }
        this.timeout = 0;
        this.online = 0;
        this.timeline = ctx.timeline;
    }

    static init() {
        let timeline = new Timeline();
        timeline.on();
        return timeline;
    }

    on(timeout) {
        if (timeout) {
            this.timeout = timeout;
            this.timing = now() + timeout; }
        else {
            this.timing = now() + this.timeout; }

        if (this.online == 0) {
            this.online = 1;
            this.timeline.add(this); }

        return this;
    }

    off() {
        if (this.online) {
            this.online = 0;
            this.timeline.rm(this); }

        return this;
    }

    callback() {
        this._callback(this);
        if (this.timing <= now()) {
            this.online = 0;
            return 1; }
        else{
            return 0; }
    }

    toString() {
        return 'timer@'+now();
    }
    
    _callback(t) {
        dprint('default callback: '+t);
    }
}

function foo(){
    dprint('foo1'+t);
}
function foo2(t){
    dprint('foo2'+t);
    t.on();
}


function test_timeline() {
    let tl = Timer.init();
    var t = new Timer(foo);
    var t2 = new Timer(foo2);
    t.on(0.2);
    t2.on();

    tl.run();
    dprint('done');
}
test_timeline();


