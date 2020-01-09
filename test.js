
class _Event {
    constructor(el, name) {
        this._name = name
        this._trigger = el.get_event_trigger(name);
    }
    on() {
        console.log(this._trigger);
        for (var i in this._trigger){
            this._trigger[i](this);
        }
    }
}

class _Listener {
    constructor(el, name) {
        this._name = name;
        this._el = el;
        this._online = 0;
    }
    on(cb) {
        if (this._online)
            dprint('err: turn on an online listener'); 
            errrrrrrrr();
            return;
        if (cb) 
            this._cb = cb;
        this._el.add_event_listener(this._name, this._cb);
        this._online = 1;
    }
    off() {
    }
}

class EventL {
    constructor() {
        this._event_listeners = {};
        let _el = this;
        this.Event = function(name) {
            return new _Event(_el, name);
        }
        this.Listener = function(name) {
            return new _Listener(_el, name);
        }
    }

    add_event_listener(eventname, listener){
        if (eventname in this._event_listeners) {
            this._event_listeners[eventname].push(listener); }
        else {
            this._event_listeners[eventname] = [listener]; }
    }

    get_event_trigger(eventname) {
        if (eventname in this._event_listeners) {
            return this._event_listeners[eventname]; }
        else {
            this._event_listeners[eventname] = [];
            return this._event_listeners[eventname]; }
    }
}
function foo(){
    console.log('foo');
}
let t = {};
t.el = new EventL();
t.Event = t.el.Event;
t.e = t.Event('ename');
t.e.ttt = 'ttt';
t.el.add_event_listener('ename', foo);
//console.log(t.e);
t.e.on();
