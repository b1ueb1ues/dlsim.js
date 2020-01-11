//import {Timer, print, dprint, now} from './ctx.js'
//import * as ctx from './ctx.js'
import {print, dprint, Timer, Ctx, Event} from './core/ctx.js'
import * as ctx from './core/ctx.js'


function foo(e){
    //print('foo@'+ctx.now());
    e.sum += ctx.now();
}

function bar(t){
    t.e.on();
    t.on();
}

function main(){
    let c = {};
    c.Event = Event.init();
    c.l = c.Event('test').listener(foo);
    c.e = c.Event('test');
    c.e.sum = 0;
    c.t = Timer(bar).on(0.01);
    c.t.e = c.e;
    ctx.run();
    console.log(c.e.sum);


    //let c1;
    //for (var i=0; i<=1000; i++){
    //    sum = 0;
    //    c1 = Ctx();
    //    Timer(foo).on(0.001);
    //    ctx.run();
    //}
}


console.time('main');
main();
console.timeEnd('main');

