class Event_list() {
    constructer() {
        this._event_listeners = [];
        ctx.active_el = this;
    }

    add_event_listener(eventname, listener){
        if (eventname in this._event_listeners) {
            this._event_listeners[eventname].push(listener); }
        else {
            this._event_listeners[eventname] = [listener]; }
    }

    get_event_trigger(eventname, trigger = []){
        if (eventname in this._event_listeners) {
            return this._event_listeners[eventname]; }
        else {
            this._event_listeners[eventname] = [];
            return this._event_listeners[eventname]; }
    }
}

class Event() {
    constructer(name) {
        if (name) {
            this.name = name;
            this._trigger =  ;
        }
    }

}
