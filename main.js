//import {Timer, print, dprint, now} from './ctx.js'
//import * as ctx from './ctx.js'
import {print, dprint, Timer, Ctx, Event} from './core/ctx.js'
import * as ctx from './core/ctx.js'


function foo(e){
    //print('foo@'+ctx.now());
    e.sum += ctx.now();
    e.count++;
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
    c.e.count = 0;
    c.t = Timer(bar).on(0.001);
    c.t.e = c.e;
    c.Param = Param.init(['atk','def','s','fs']);
    c.p_atk = c.Param('atk');
    c.p_s = c.Param('s');
    ctx.run(180*1000);
    console.log(c.e.sum);
    console.log(c.e.count);
    //let sum = 0;
    //for (var i = 0; i <= 180*10000*1000; i++) {
    //    sum += i/1000;
    //}
    //console.log(sum);


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

