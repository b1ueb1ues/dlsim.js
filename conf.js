function type(a){
    return a.__proto__.constructor.name;
}

class Conf {
    constructor(template) {
        this.__parentname = 0;
        this.__name = 0;
        this.__sync = 0;
        var ttype ;
        if (template) {
            ttype = type(template);
        }
        if (ttype == 'Map') {
            this.__frommap(template); }
        else if (ttype == 'Conf'){
        }
    }

    __frommap(t){
        if (type(t) != 'Map'){
            dprint('err frommap');
            errrrrrrrrrrrrr(); }

        for (var [k,v] of t) {
            if (type(v) == 'Map'){
                var tmp = new Conf();
                tmp.__frommap(v);
                this[k] = tmp;
            }
            else{
                this[k] = v; }
        }
    }

    __tomap(){
        var ret = new Map();
        for (var k in this) {
            dprint(k);
            if (type(this[k]) == 'Map'){
                ret[k] = ['__realmap',v];
            }
        }
    }
}

function test() {
    a = new Map();
    b = new Map();
    d = new Map();
    d.test = 1;
    d['test2'] = 2;
    d.set('test3',3);
    dprint(d);
    return;
    b.set('testb','b');
    a.set('test',1);
    a.set('test2',2);
    a.set('test3',b);
    c = new Conf(a);
    dprint(c);
    c.m = b
    c.__tomap();
}
test()
