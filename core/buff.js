import {Logger} from './log.js'
import {Timer} from './ctx.js'

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
    static init(src) {
        let ctx = {'group':{}};
        let new_buff = function (name, param, value, duration, group) {
            return new Buff(ctx, src, name, param, value, duration, group);
        }
        let dst = src;
        new_buff.l_receiver = Event('buff').listener(function (e) {
            return new Buff(ctx, e.src, dst, e.name, e.param, e.value, e.duration, e.group);
        });
        return new_buff;
    }
    constructor(ctx, src, name, param, value, duration, group) {
        this.ctx = ctx;
        this.src = src;
        this.name = name;
        this.param = param;
        this.value = value;
        this.duration = duration;
        if (group) {
            this.group = group;
        } else {
            this.group = param;
        }

        this.dst = dst;
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
    to(dst) {
    }
    on() {
        this.log(this.src.name, this.dst.name, 'on', this.value, this.duration)
        this.p.set(this.value);
        let buff = this;
        this.t_end = Timer(function () {
            buff.on_end();
            buff.off();
        });
        return this;
    }
    off() {
        this.log(this.src.name, this.dst.name, 'off')
        this.p.set(0);
        return this;
    }
}

