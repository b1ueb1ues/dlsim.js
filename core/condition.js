
export class Condition {
    static init(host) {
        let ctx = {name_condi:{}, default_check:{}};
        let condi = this;
        host.Event('condition').listener(function (e) {
            ctx.default_check[e.name] = e.active;
        });
        let new_condition = function (cname, check) {
            let r = new Condition(ctx, cname);
            if (check)
                r.check = check;
            let name_condi = ctx.name_condi;
            if (name_condi[cname]) {
                name_condi[cname].push(r);
            } else {
                name_condi[cname] = [r];
            }
            return r;
        }
        new_condition.f5 = function () {
            for (var name in ctx.name_condi) {
                let i = ctx.name_condi[name];
                for (var j in i) {
                    j = i[j];
                    let d = ctx.default_check[name];
                    j.check(d);
                }
            }
        }
        return new_condition;
    }
    constructor(ctx, cname) {
        this.ctx = ctx;
        this.name = cname;
    }
    check(d) {
        if (d) {
            //on
        } else {
            //off
        }
    }
    rm() {
        this.off();
        this.ctx[cname].splice(this.ctx.indexOf(this), 1);
    }
}

//import {Event} from './event.js'
//let cb = {};
//cb.Event = Event.init();
//cb.Condition = Condition.init(cb);
//cb.c = cb.Condition('test', function (d) {
//    if (d) {
//        console.log('default on');
//    } else {
//        console.log('default off');
//    }
//});
//
//let e = cb.Event('condition');
//e.name = 'test';
//e.active = 1;
//e.on()
//cb.Condition.f5();
//e.active = 0;
//e.on()
//cb.Condition.f5();
