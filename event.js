
function type(a){
    return a.__proto__.constructor.name;
}

class Event_list {
    constructor() {
        this._event_listeners = [];
        ctx.active_el = this;
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
} // class Event_list

class Event {
    constructor(name) {
        if (name) {
            this.name = name;
            this._trigger = ctx.active_el.get_event_trigger(name); }
        else {
            this._trigger = []; }
    }

    listener(cb) {
        if (type(cb) == 'Array'){
            for (var i in cb) {
                i = cb[i];
                ctx.active_el.add_event_listener(this.name, i); } }
        else {
            ctx.active_el.add_event_listener(this.name, cb); } 
    }

    on(e) {
        for (var i in this._trigger) {
            i = this._trigger[i];
            i(this); }
    }

    init() {
        new Event_list();
    }
} // class Event

class Listener {
    constructor(name, cb){
        this.__cb = cb
        this.__eventname = name
        this.__online = 0
        this.on()
    }

    on(cb) {
        if (this.__online) {
            return; }
        if (cb) {
            this.__cb = cb; }

        if (type(this.__eventname) == 'Array') {
            for (var i in this.__eventname) {
                i = this.__eventname[i];
                ctx.active_el.add_event_listener(i, this.__cb); } }
        else {
            ctx.active_el.add_event_listener(this.__eventname, this.__cb); }
        this.__online = 1;
        return this;
    }

    off() {
        if (!this.__online) {
            return; }
        if (type(this.__eventname) == 'Array') {
            for (var i in this.__eventname) {
                i = this.__eventname[i];
                var els = ctx.active_el.get_event_trigger(i);
                var idx = els.indexOf(this.__cb);
                els.splice(idx, 1); } }
        else {
            var els = ctx.active_el.get_event_trigger(this.__eventname);
            var idx = els.indexOf(this.__cb);
            els.splice(idx, 1); }
        this.__online = 0;
        return this;
    }
}

function test() {
    function foo(e) {
        print('foo: '+e.name); 
        print(': '+e.test); 
    }
    function bar(e) {
        print('bar: '+e.name); 
    }

    new Event().init();
    e = new Event('test');
    e.test = 1;
    l = new Listener('test', foo);
    l2 = new Listener(['test2','test'], bar);
    e2 = new Event('test2');
    e.on();
    e2.on();
}
//test();
