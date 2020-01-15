
export class Event {
    constructor(event_listeners, name) {
        this._el = event_listeners;
        this._name = name;
        if (name in event_listeners) {
            this._trigger = event_listeners[name]; }
        else {
            this._trigger = [];
            event_listeners[name] = this._trigger;
        }
    }
    set(args) {
        for (var i in args) {
            this[i] = args[i];
        }
        return this;
    }
    on() {
        for (var i in this._trigger){
            this._trigger[i](this);
        }
        return this;
    }
    listener(callback) {
        let l = new Listener(this._el, this._name, callback);
        l.on();
        return l;
    }
    static init() {
        let el={};
        function new_event(name) {
            return new Event(el, name);
        }
        return new_event;
    }
}

class Listener {
    constructor(el, name, callback) {
        this._el = el;
        this._name = name;
        this._cb = callback
        this._online = 0;
    }
    on() {
        if (this._online){
            dprint('err: turn on an online listener'); 
            errrrrrrrr();
            return;
        }
        if (this._name in this._el) {
            this._el[this._name].push(this._cb); }
        else {
            this._el[this._name] = [this._cb]; }
        this._online = 1;
        return this;
    }
    off() {
        if (!this._online)  // acceptable
            return 0;
        let et = this._el[this._name];
        let idx = et.indexOf(this._cb);
        et.splice(idx, 1);
        this._online = 0;
        return this;
    }
}

