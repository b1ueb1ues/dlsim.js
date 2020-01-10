
class _Event {
    constructor(el, name) {
        this._el = el;
        this._name = name;
        this._trigger = el.get_event_trigger(name);
    }
    on() {
        for (var i in this._trigger){
            this._trigger[i](this);
        }
        return this;
    }
    listener(callback) {
        let l = new _Listener(this._el, this._name, callback);
        l.on();
        return l;
    }
}

class _Listener {
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
        this._el.add_event_listener(this._name, this._cb);
        this._online = 1;
        return this;
    }
    off() {
        if (!this._online)  // acceptable
            return 0;
        let et = this._el.get_event_trigger(this._name);
        let idx = et.indexOf(this._cb);
        et.splice(idx, 1);
        this._online = 0;
        return this;
    }
}


class EventL {
    constructor() {
        this._event_listeners = {};
        let _el = this;
        this.Event = function(name) {
            return new _Event(_el, name);
        }
    }

    add_event_listener(eventname, callback){
        if (eventname in this._event_listeners) {
            this._event_listeners[eventname].push(callback); }
        else {
            this._event_listeners[eventname] = [callback]; }
    }

    get_event_trigger(eventname) {
        if (eventname in this._event_listeners) {
            return this._event_listeners[eventname]; }
        else {
            this._event_listeners[eventname] = [];
            return this._event_listeners[eventname]; }
    }
}

