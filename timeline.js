if (typeof require != 'undefined') {
    console.log('nodejs');
    var utils = require('./nodeutils.js');
    ctx = utils.ctx;
    print = utils.print;
    dprint = utils.dprint;
}


function now() {
    return ctx.active_tl._now;
}

class Timeline {
    constructor() {
        this._tlist = [];
        this._now = 0;
        //this.on();
    }

    print() {
        print(this.name);
    }

    add(t) {
        this._tlist.push(t);
    }

    rm(t) {
        var i = this._tlist.indexOf(t);
        return this._tlist.pop(i);
    }

    on() {
        ctx.active_tl = this;
        return this;
    }

    run(duration=180){
        this.on();
        duration += this._now;
        while(1){
            if (this._now > duration) {
                return; }
            if (this.process_head() == -1){
                return; } }
    }

    process_head(){
        var tcount = this._tlist.length;
        if (tcount == 0) {
            return -1; }
        if (tcount == 1) {
            var headtiming = this._tlist[0].timing;
            var headindex = 0; }
        else { // if tcount >= 2
            var headtiming = this._tlist[0].timing;
            var headindex = 0;
            for (var i=1; i < tcount; i++) {
                var timing = this._tlist[i].timing;
                if (timing < headtiming) {
                    headtiming = timing;
                    headindex = i; } } }

        if (headtiming >= this._now) {
            this._now = headtiming;
            var headt = this._tlist[headindex];
            var suc = headt.callback(); 
            if (suc) {
                this._tlist.splice(headindex,1); } }
        else{
            dprint('timeline time err');
            errrrrrrrrr(); }
        return 0;
    }
}

class Timer {
    constructor(cb, timeout, repeat, timeline) {
        if (cb) {
            this._callback = cb; }

        if (timeout) {
            this.timeout = timeout; }
        else {
            this.timeout = 0;
        }

        if (repeat) {
            this.callback = this.callback_repeat; }
        else {
            this.callback = this.callback_once; }

        if (timeline) {
            this.timeline = timeline; }
        else {
            this.timeline = ctx.active_tl; }

        this.timing = 0;
        this.online = 0;
    }

    on(timeout){
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

    off(){
        if (this.online) {
            this.online = 0;
            this.timeline.rm(this); }

        return this;
    }

    callback_once(){
        this._callback(this);
        if (this.timing <= now()) {
            this.online = 0;
            return 1; }
        else{
            return 0; }
    }

    callback_repeat(){
        this._callback(this);
        if (this.timing == now()) {
            this.timing += this.timeout; }
        return 0;
    }

    toString(){
        return 'timer@'+now();
    }
    
    _callback(t){
        dprint('default callback: '+t);
    }
}




function test() {
    function foo() {
        dprint('foo: '+now());
    }
    tl = new Timeline().on();
    var t = new Timer(foo, 2);
    t.on();
    var t2 = new Timer(0,10,1);
    t2.on();
    dprint(tl);

    tl.run();
    dprint('done');
}
//test();
