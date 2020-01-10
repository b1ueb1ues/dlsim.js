
class ParamBase {
    constructor(){
        this.params = {};
        this.cache = {};
        let pb = this;
        this.Param = function(bracket) {
            let p = new _Param(pb, bracket);
            if (bracket in pb.params) {
                pms[bracket].push(p);
            } else {
                pms[bracket] = [p];
            }
            return p;

        }
    }
}

class _Param {
    constructor(pb, bracket) {
        this.pb = pb;
        this.bracket = bracket;
        this.value = 0;
    }
}

class A {
    constructor(a){
        this.a = a;
    }
}
let o = [];
let a = new A('2');
let b = new A();
o.push(a);
o.push(b);

console.log(o);
for (var i in o){
    console.log('-',o[i]);
    if (o[i] == a) {
        console.log('=');
    }
}

