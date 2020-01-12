
class Conf {
    constructor() {
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
