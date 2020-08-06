import {Ctx} from './ctx.js'

export class Event {
    static init(src) {
        let c = Ctx(this);
        c.event_listeners = {};
        c.src = src;
        c.to = function(dst) {
            return Listener.init(dst, c);
        }
        return c;
    }
    constructor(ctx, name) {
        this._name = name;
        let el = ctx.event_listeners;
        if (!el[name])
            el[name] = [];
        this._trigger = el[name];
    }
    o(message) {
        for (var i in this._trigger)
            this._trigger[i](message);
        return this;
    }
}

// use event.to is more convinient.
export class Listener {
    static init(dst, e_ctx) {
        let c = Ctx(this);
        c.dst = dst;
        c.src = e_ctx.src;
        c.event_listeners = e_ctx.event_listeners;
        return c;
    }
    constructor(ctx, name) {
        this._cb = ctx.dst['on_'+name].bind(ctx.dst);
        let el = ctx.event_listeners;
        if (!el[name])
            el[name] = [];
        this._trigger = el[name]; 
        // inline this.on() {
        this._trigger.push(this._cb);
        this._online = 1;
        // }
    }
    o() {
        if (this._online)
            throw 'err: turn on an online listener';
        this._trigger.push(this._cb);
        this._online = 1;
        return this;
    }
    x() {
        if (!this._online)  // acceptable
            return 0;
        let idx = this._trigger.indexOf(this._cb);
        this._trigger.splice(idx, 1);
        this._online = 0;
        return this;
    }
}

