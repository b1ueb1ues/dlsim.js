function test(a='a', b='b'){
    var self = {};
    self.a = a;
    self.b = b;
    self.c = function() {
        console.log('c: '+self.a);
    }
    return self;
}

let a = test('aa','bb');
console.log(a);
a.a = 3;
a.c();
