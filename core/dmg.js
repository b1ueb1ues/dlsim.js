import {Conf} from './conf.js'
import {Param} from './fparam.js'

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

class Hitattr {
    constructor(src, dst, conf){
        this.src = src;
        this.dst = dst;
        this.conf = conf;
        this.p_src = this.src.Param();
        this.p_dst = this.dst.Param();
        let conf_default = {
             'name'    : 'default_dmg'
            ,'timing'  : [0, 0.1]
            ,'missile' : [0]
            ,'type'    : 'x'
            ,'hits'    : 1
            ,'coef'    : 1
            ,'to_od'   : 1
            ,'to_bk'   : 1
            ,'proc'    : null
            ,'killer'  : null
        }
        Conf.default(conf, conf_default);
    }
    calc() {
        let base = calc_base();
    }
    calc_base() {
        let atk = this.src.base_atk * (1 + this.p_src.get('atk')
                  + this.p_src.get('atk_b') + this.p_src.get('atk_ex'));
        let def = this.dst.base_def * (1 + this.p_dst.get('def'));
        let crit_mod = 1 + (this.p_src.get('cc') * (this.p_src.get('cd') + 0.7));
        let type_mod = 1;
        if (this.conf.type == 's') {
            type_mod += this.p_src.get('s')
            type_mod += this.p_src.get('s_b')
            type_mod += this.p_src.get('s_ex')
        } else if (this.conf.type == 'fs') {
            type_mod += this.p_src.get('fs')
        }
        return atk / def * crit_mod * type_mod / 0.6
    }
}

let c = {};
c.base_atk = 3000;
let t = {};
t.base_def = 10;
let conf = {};
c.Param = Param.init(['atk','atk_b','atk_ex','def','cc','cd','s','fs','sp','s_b','s_ex']);
c.Param('atk').set(0.2);
t.Param = Param.init(['def']);
c.hit = new Hitattr(c, t, conf);
console.log(c.hit);

let d = c.hit.calc_base();
console.log('=',d);
