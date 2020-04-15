import {Conf} from './conf.js'
import {Param} from './fparam.js'
import {Event} from './event.js'

class Dmg {
    constructor(src, dmg, conf) {
        this.src = src;
        this.dmg = dmg;
        this.name = conf.name;
        this.hits = conf.hits;
        this.to_od = conf.to_od;
        this.to_bk = conf.to_bk;
    }
    dup() {
        return new Dmg(this.src, this.dmg, 
            {'name':this.name, 'hits':this.hits, 
                'to_od':this.to_od, 'to_bk':this.to_bk});
    }
}

export class Dmgcalc {
    static init(src, dst) {
        let dc = new Dmgcalc(src, dst);
        let new_dmg = function (hitattr) {
            return dc.calc(hitattr);
        }
        return new_dmg;
    }

    constructor(src, dst){
        this.src = src;
        this.c_src = null;
        this.p_src = this.src.Param();
        this.p_src.ctx.dirty = 1;

        this.dst = dst;
        this.c_dst = null;
        this.p_dst = this.dst.Param();
        this.p_dst.ctx.dirty = 1;

        this.c_killer = null;
        this.e_killer = this.src.Event('killer');

        let dc = this;
        this.l_ks = this.dst.Event('killerstate').listener( function () {
            dc.c_killer = null;
        });

        this.base_coef = 1.5 / 0.6 ;
    }

    tar(dst) {
        this.dst = dst;
        this.c_dst = null;
        this.p_dst = this.dst.Param();
        this.p_dst.ctx.dirty = 1;
        this.l_ks.off();
        let dc = this;
        this.l_ks = this.dst.Event('killerstate').listener( function () {
            dc.c_killer = null;
        });
    }

    set_ele(v) {
        this.base_coef = v / 0.6;
    }

    calc_ele(src_ele, dst_ele) {
        if (src_ele == 'flame' && dst_ele == 'wind')
            this.ele = 1.5
        else if (src_ele == 'water' && dst_ele == 'flame')
            this.ele = 1.5
        else if (src_ele == 'wind' && dst_ele == 'water')
            this.ele = 1.5
        else if (src_ele == 'light' && dst_ele == 'shadow')
            this.ele = 1.5
        else if (src_ele == 'shadow' && dst_ele == 'light')
            this.ele = 1.5

        else if (src_ele == 'flame' && dst_ele == 'water')
            this.ele = 0.5
        else if (src_ele == 'water' && dst_ele == 'wind')
            this.ele = 0.5
        else if (src_ele == 'wind' && dst_ele == 'flame')
            this.ele = 0.5
        else
            this.ele = 1

        if (dst_ele == 'on')
            this.ele = 1.5
        else if (dst_ele == 'off')
            this.ele = 0.5
        if (src_ele == 'on')
            this.ele = 1.5
        else if (src_ele == 'off')
            this.ele = 0.5

        this.base_coef = this.ele / 0.6
    }

    calc_base() {
        let src, dst
        if (this.p_src.ctx.dirty) {
            let atk = this.src.base_atk * (1 + this.p_src('atk')
                      + this.p_src('atk_buff') + this.p_src('atk_ex'));
            let crit_mod = 1 + (this.p_src('cc') * (this.p_src('cd') + 0.7));
            src = atk * crit_mod;
            this.c_src = src;
            this.p_src.ctx.dirty = 0;
        } else {
            src = this.c_src;
        }
        if (this.p_dst.ctx.dirty) {
            let def = this.dst.base_def * (1 + this.p_dst('def'));
            let dt = 1 + this.p_dst('dt');
            dst = def / dt;
            this.c_dst = dst;
            this.p_dst.ctx.dirty = 0;
        } else {
            dst = this.c_dst;
        }
        if (this.c_killer == null) {
            this.e_killer.ks = this.dst.ks;
            this.e_killer.on();
            this.c_killer = 1 + this.p_src('killer');
        }
        return src / dst * this.c_killer * this.base_coef;
    }

    calc(hitattr) {
        let dmg = this.calc_base();
        let type_mod = 1;
        if (this.p_src.ctx.dirty || hitattr.c_type == null) {
            if (hitattr.conf.atype == 's') {
                type_mod *= 1 + this.p_src('s');
                type_mod *= 1 + this.p_src('s_buff');
                type_mod *= 1 + this.p_src('s_ex');
            } else if (hitattr.conf.atype == 'fs') {
                type_mod += this.p_src('fs');
            }
            hitattr.c_type = type_mod;
        } else {
            type_mod = hitattr.c_type;
        }
        let killer_mod = 1;
        let killer = hitattr.conf.killer;
        if (killer) {
            for (var i in killer) {
                if (this.dst.ks[i]) {
                    killer_mod *= 1+killer[i];
                }
            }
        }
        dmg = dmg * type_mod * killer_mod * hitattr.conf.coef;
        return new Dmg(this.src, dmg, hitattr.conf);
    }
}

export class Hitattr {
    constructor(conf){
        this.c_killer = null;
        this.c_type = null;
        this.conf = conf;
        let conf_default = {
             'name'    : 'default_dmg'
            ,'timing'  : [0, 0.1]
            ,'missile' : [0]
            ,'atype'   : 'x'
            ,'hits'    : 1
            ,'coef'    : 1
            ,'to_od'   : 1
            ,'to_bk'   : 1
            ,'proc'    : null
            ,'killer'  : null
        }
        Conf.default(conf, conf_default);
    }
    set(name, value) {
        this.conf[name] = value;
        if (name == 'atype')
            this.c_type = null;
        if (name == 'killer')
            this.c_killer = null;
    }
    static init() {
        let new_hitattr = function (conf) {
            return new Hitattr(conf);
        }
        return new_hitattr;
    }
}

class Passive {
    constructor(src, param, value, condition) {
        this.src = src;
        this.param = param;
        this.value = value;
        this.condition = condition;
        this.p = src.Param(param);
        if (param == 'killer'){
            let passive = this;
            this.src.Event('killer').listener(function (e) {
                if (e.ks[passive.condition]) {
                    passive.on();
                } else {
                    passive.off();
                }
            });
        }
    }
    on() {
        this.p.set(this.value);
        return this;
    }
    off() {
        this.p.set(0);
        return this;
    }
}

