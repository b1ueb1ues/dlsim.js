import {Ctx} from './ctx.js'

export class Timeline {
    static init() {
        let c = Ctx(this);
        c.tlist = [];
        c.now = 0;
        c.to = function(host) {
            function _new(name) {
                return c(name, host);
            }
            return _new;
        }
        c.run = function() {

        }
        return c;
    }
    constructor(ctx, tname, host=null) {
        this.tl = ctx.tlist;
        this._name = tname;
        this._timeout = 0;
        this._online = 0;
        this._callback = host['on_'+this._name].bind(host);
    }
    o(t) {
        this._callback(this);
        return this;
    }
}
