class Test{
    constructor(name = 'default') {
        this.name = name;
    }
    print(){
        print(this.name);
    }
}

Timer = {
    _init : function(){
        t = {};
        t.test = 1;
        return t;
    },
    print : function(t){
        print(t.test);
    },
}

a = Timer._init();
Timer.print(a);

c = new Test('test');
c.print()
