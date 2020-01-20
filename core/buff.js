import {Logger} from './log.js'

export class Passive {
    static init(src) {
        let new_passive = function (name, param, value, condition) {
            return new Passive(src, name, param, value, condition);
        }
        return new_passive;
    }
    constructor(src, name, param, value, condition) {
        this.src = src;
        this.name = name;
        this.param = param;
        this.value = value;
        this.condition = condition;
        this.p = src.Param(param);
        this.log_k = Logger('killer');
        this.log_b = Logger('buff');
        this.log_c = Logger('condition');

        let passive = this;
        if (param == 'killer'){
            this.src.Event('killer').listener(function (e) {
                if (e.ks[passive.condition]) {
                    passive.log_k(passive.src.name, passive.src.name, 'killer', 
                        `${passive.condition}: ${passive.value}`, 'on');
                    passive.on();
                } else {
                    passive.log_k(passive.src.name, passive.src.name, 'killer', 
                        `${passive.condition}: ${passive.value}`, 'off');
                    passive.off();
                }
            });
        } else {
            this.src.Event('condition').listener(function (e) {
                if (e.condition[passive.condition]) {
                    passive.log_k(passive.src.name, passive.src.name, 'condition', 
                        `${passive.condition}: ${passive.value}`, 'on');
                    passive.on();
                } else {
                    passive.log_k(passive.src.name, passive.src.name, 'condition', 
                        `${passive.condition}: ${passive.value}`, 'off');
                    passive.off();
                }
            });
        }
    }
    on() {
        this.log_b(this.src.name, this.src.name, 'on', this.value);
        this.p.set(this.value);
        return this;
    }
    off() {
        this.log_b(this.src.name, this.src.name, 'off')
        this.p.set(0);
        return this;
    }
}


export class Buff {
    constructor(src, dst, name, param, value, duration, group) {
        this.src = src;
        this.dst = dst;
        this.name = name;
        this.param = param;
        this.value = value;
        this.duration = duration;
        if (group) {
            this.group = group;
        } else {
            this.group = param;
        }
        this.p = dst.Param(param);
        this.log = Logger('buff');
        if (param == 'killer'){
            for (var i in value) {
                this.value = value[i];
                this.condition = i;
            }
            let buff = this;
            this.dst.Event('killer').listener(function (e) {
                if (e.ks[passive.condition]) {
                    buff.on();
                } else {
                    buff.off();
                }
            });
        }
    }
    on() {
        this.log(this.src.name, this.dst.name, 'on', this.value, this.duration)
        this.p.set(this.value);
        return this;
    }
    off() {
        this.log(this.src.name, this.dst.name, 'off')
        this.p.set(0);
        return this;
    }
}

