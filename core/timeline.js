
export class _Timeline {
    constructor() {
        this._tlist = [];
        this._now = 0;
    }

    print() {
        print(this.name);
    }

    run(duration=180) {
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
        let headtiming = 0;
        let headindex = 0;
        if (tcount == 0) {
            return -1; }
        if (tcount == 1) {
            headtiming = this._tlist[0].timing;
            headindex = 0; }
        else { // if tcount >= 2
            headtiming = this._tlist[0].timing;
            headindex = 0;
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
            console.log('err:', headtiming, this._now);
            throw 'timeline time err';
        }
        return 0;
    }
}

export class _Timer {
    constructor(tl, cb) {
        this.timeline = tl;
        if (cb) {
            this._callback = cb; }
        this._timeout = 0;
        this.online = 0;
    }

    on(timeout) {
        if (timeout) {
            this._timeout = timeout;
            this.timing = this.timeline._now + timeout; }
        else {
            this.timing = this.timeline._now + this._timeout; }

        if (this.online == 0) {
            this.online = 1;
            this.timeline._tlist.push(this);
        }
        return this;
    }

    set timeout(timeout) {
        if (this.online) {
            this.timing = this.timing - this._timeout + timeout; 
            if (this.timing < now()){
                throw 'start_timing + timeout < now';
            }
            this._timeout = timeout;
        } else {
            this._timeout = timeout;
        }
    }

    get timeout() {
        return this.timing - this.timeline._now;
    }

    off() {
        if (this.online) {
            this.online = 0;
            let tlist = this.timeline._tlist;
            let i = tlist.indexOf(this);
            tlist.splice(i);
        }
        return this;
    }

    callback() {
        this._callback();
        if (this.timing <= this.timeline._now) {
            this.online = 0;
            return 1; }
        else{
            return 0; }
    }

    toString() {
        return 'timer@' + this.timeline._now;
    }
    
    _callback(t) {
        dprint('default callback: ' + t);
    }
}
