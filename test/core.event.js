import {Event, Listener} from '../core/event.js'

let newE = Event.init();
let e_t, l_t

if(0) {
    e_t = newE('test1');
    l_t = e_t.listener(
        function(m) {
            console.log('test1');
        }
    );
    l_t = e_t.listener(
        function(m) {
            console.log('test1 another');
        }
    );
    let e1 = e_t;

    e_t = newE('test2');
    l_t = e_t.listener(
        function(m) {
            console.log('test2');
        }
    );
    let e2 = e_t;

    e2.o();
    e1.o();
    e2.o();
    // output: 
    // test2
    // test1
    // test1 another
    // test2
}



class A {
    constructor(id){
        this.id = id;
        this.Listener = newE.to(this);
        this.l = this.Listener('class');
        this.l2 = this.Listener('test');
    }
    on_class(e) {
        console.log(e);
        console.log(this.id);
    }
    on_test(e) {
        console.log('test');
    }
    printid(e) {
        console.log(e);
        console.log(this.id);
    }
}

let a1 = new A(1);
//let a2 = new A(2);
//a2.l.x();
newE('class').o({tm:'testmessage'});
newE('test').o();

