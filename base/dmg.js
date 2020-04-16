import {Conf} from './conf.js'
import {Param} from './fparam.js'
import {Event} from './event.js'

export class Hitattr {
    static init (src) {
        function new_hitattr (conf) {
            return new Hitattr(src, conf);
        }
        return new_hitattr;
    }

    constructor (src, conf) {
        this.src = src
        this.name = conf.name
        this.coef = conf.coef
        this.hits = conf.hits
        this.to_od = conf.to_od
        this.to_bk = conf.to_bk
        this.ks = conf.ks //killer stat
        this.kr = conf.kr //killer rate
    }
}

export class Dmg_calc {
    static init(src, dst) {
        function new_calc (hitattr) {
            return new Dmg_calc(dst, hitattr);
        }
    }

    constructor(dst, hitattr) {

    }

}
