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
}

class Dmgcalc {
    constructor(ctx, src, dst){
        this.src = src;
        this.c_src = ctx.c_src;
        this.p_src = this.src.Param();

        this.dst = dst;
        this.c_dst = ctx.c_dst;
        this.p_dst = this.dst.Param();

        this.c_killer = null;
        this.e_ks = this.src.Event('killer');

        let dc = this;
        this.dst.Event('killerstate').listener( function () {
            dc.c_killer = null;
        });

        this.base_coef = 1.5 / 0.6 ;
    }

    static init(src, dst) {
        let ctx = {c_src:1, c_dst:1}
        let new_dc = function () {
            return new Dmgcalc(ctx, src, dst);
        }
        return new_dc;
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
            let atk = this.src.base_atk * (1 + this.p_src.get('atk')
                      + this.p_src.get('atk_buff') + this.p_src.get('atk_ex'));
            let crit_mod = 1 + (this.p_src.get('cc') * (this.p_src.get('cd') + 0.7));
            src = atk * crit_mod;
            this.c_src = src;
            this.p_src.ctx.dirty = 0;
        } else {
            src = this.c_src;
        }
        if (this.p_dst.ctx.dirty) {
            let def = this.dst.base_def * (1 + this.p_dst.get('def'));
            let dt = 1 + this.p_dst.get('dt');
            dst = def / dt;
            this.c_dst = dst;
            this.p_dst.ctx.dirty = 0;
        } else {
            dst = this.c_dst;
        }
        if (this.c_killer == null) {
            this.e_ks.ks = this.dst.ks;
            this.e_ks.on();
            this.c_killer = this.p_src.get('killer');
        }
        return src / dst * this.c_killer * this.base_coef;
    }
    calc(hitattr) {
        return this.calc_base() * hitattr.calc();
    }
}
1: 7
2: eli
3: lan
4: ku
5: sha
6: luca
7: namu
9: mei
10: mumu
18: lifu
29: meigong
32: laxi

class Hitattr {
    constructor(ctx, src, dst, conf){
        this.src = src;
        this.dst = dst;
        this.l2cache = 0;
        this.conf = conf;
        this.p_src = this.src.Param();
        this.p_dst = this.dst.Param();
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
    static init(src, dst) {
        let new_hitattr = function (conf) {
            return new Hitattr(ctx, src, dst, conf);
        }
        return new_hitattr;
    }
    calc() {
        let base = calc_base();
        let type_mod = 1;
        if (this.p_src.ctx.dirty) {
            if (this.conf.atype == 's') {
                type_mod += this.p_src.get('s')
                type_mod += this.p_src.get('s_b')
                type_mod += this.p_src.get('s_ex')
            } else if (this.conf.atype == 'fs') {
                type_mod += this.p_src.get('fs')
            }
        }
        for (var i in this.src.killer) {
        }
    }
    calc_base() {
        let src, dst
        if (this.p_src.ctx.dirty) {
            let atk = this.src.base_atk * (1 + this.p_src.get('atk')
                      + this.p_src.get('atk_buff') + this.p_src.get('atk_ex'));
            let crit_mod = 1 + (this.p_src.get('cc') * (this.p_src.get('cd') + 0.7));
            src = atk * crit_mod;
            this.c_src = src;
            this.p_src.ctx.dirty = 0;
        } else {
            src = this.c_src;
        }
        if (this.p_dst.ctx.dirty) {
            let def = this.dst.base_def * (1 + this.p_dst.get('def'));
            let dt = 1 + this.p_dst.get('dt');
            dst = def / dt;
            this.c_dst = dst;
            this.p_dst.ctx.dirty = 0;
        } else {
            dst = this.c_dst;
        }
        return src / dst * type_mod / 0.6;
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

console.log(typeof []);
console.log(typeof {});

let c = {};
c.base_atk = 3000;
c.Event = Event.init();
let t = {};
t.base_def = 10;
t.Event = Event.init();

c.Param = Param.init(['atk','atk_buff','atk_ex','def','cc','cd','s','fs','sp','s_buff','s_ex','killer', 'bk']);
t.Param = Param.init(['def', 'dt', 'killer']);
c.Dc = Dmgcalc.init(c, t)();
c.Ha = Hitattr.init(c, t);

let k = new Passive(c, 'killer', 0.3, 'burn').on();
new Passive(c, 'killer', 0.2, 'p').on();
//t.e_ks = t.Event('killerstate').on();
t.ks = {'p':1, 'burn':0};
console.log( c.Dc.calc_killer() );
t.ks = {'p':1, 'burn':1};
t.e_ks = t.Event('killerstate').on();
console.log( c.Dc.calc_killer() );


let e = c.Event('test');
console.log(e);
