
export class Param {
    constructor(ctx, name) {
        this.ctx = ctx;
        this.name = name;
        this.value = 0;
        if (name){  // setter
            ctx.params[name].push(this);
        } else {   // getter
            this.d_cache = ctx.cache;
            this.d_l_params = ctx.params;
        }
    }
    static init(register) {
        let ctx = {params:{}, cache:{}};
        for (var i in register) {
            ctx.params[register[i]] = [];
            ctx.cache[register[i]] = null;
        }
        function new_param(name) {
            return new Param(ctx, name);
        }
        return new_param;
    }
    set(v) {
        this.value = v;
        this.ctx.cache[this.name] = null;
        return this;
    }
    get(name) {
        let cache = this.d_cache[name];
        if (cache != null) {
            return cache;
        }
        else {
            let p = this.d_l_params[name];
            cache = 0;
            for (var i in p){
                cache += p[i].value;
            }
            this.ctx.cache[name] = cache;
            return cache;
        }
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
