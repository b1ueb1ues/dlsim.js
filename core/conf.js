
export function Conf (c) {
    return new _Conf(c);
}

class _Conf {
    constructor(c) {
        for (var i in c) {
            this[i] = c[i];
        }
    }

    static default(c, d) {
        for (var i in d) {
            if (i in c) {}
            else {
                c[i] = d[i];
            }
        }
    }

    static sync(c) {
        for (var i in c) {
            if (typeof c[i] == 'function') {
                this[i](c); 
            } 
        }
    }

    static update(dst, src) {
        Object.assign(dst, src);
    }

    static clean(c) {
        for (var i in c) {
            delete c[i];
        }
    }
}

let a = {};
let b = {};
a.a = 'a'
a.o = {};
a.o.name = 'test';
a.o.id = 1;
b.a = 'b'
b.o = {};
b.o.name = 'testb';
console.log(a);

let c = Conf(a);
console.log(c);


