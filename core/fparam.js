
//function type(a){
//    return a.__proto__.constructor.name;
//}

export class Param {
    static init() {
        let ctx = {params:{}, cache:{}, dirty:1};
        function new_param(name) {
            if (name) { // setter
                return new Param(ctx, name);
            } else { // getter
                function get(name) {
                    let cache = ctx.cache[name];
                    if (cache != null) {
                        return cache;
                    }
                    else {
                        let p = ctx.params[name];
                        cache = 0;
                        for (var i in p){
                            cache += p[i].value;
                        }
                        ctx.cache[name] = cache;
                        return cache;
                    }
                }
                get.ctx = ctx;
                return get;
            }
        }
        return new_param;
    }
    constructor(ctx, name) {
        this.ctx = ctx;
        this.name = name;
        this.value = 0;
        if (ctx.params[name]) {
            ctx.params[name].push(this);
        } else {
            ctx.params[name] = [this];
            ctx.cache[name] = null;
        }
    }
    set(v) {
        this.value = v;
        this.ctx.cache[this.name] = null;
        this.ctx.dirty = 1;
        return this;
    }
}
/**
 * manual inline
 *
    _get(name) {
        let p = this.ctx.params[name];
        let cache = 0;
        for (var i in p){
            cache += p[i].value;
        }
        this.ctx.cache[name] = cache;
        return cache;
    }
    if (cache[name])
        return cache[name];
    else
        return p._get();
*/
