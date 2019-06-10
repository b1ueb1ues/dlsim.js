
class Conf {
    constructor() {
    }

    sync() {
        for (var i in this) {
            if (typeof this[i] == 'function') {
                print(i);
                this[i](this); } }
    }
}

function test() {
    function foob(c) {
        print('foob: ' + c);
        print('foob: ' + c.c);
    }
    function food(c) {
        print('food: ' + c);
    }
    function fooe(c) {
        print('fooe: ' + c);
    }
    function foo1(c) {
        print('foo1: ' + c.d);
        print('foo1: ' + c.e);
    }
    a = new Conf();
    a.b = new Conf();
    a.b.c = 3;
    a.d = 4;
    a.e = 5;
    a.foo = foo1;
    a.b.foo = foob;
    a.d = 44;
    a.e = 55;
    a.b.c = 33;
    a.sync();
    a.b.sync();
}
//test();
