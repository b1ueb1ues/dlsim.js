//import {Timer, print, dprint, now} from './ctx.js'
//import * as ctx from './ctx.js'
import {print, dprint, Timer, Ctx} from './core/ctx.js'
import * as ctx from './core/ctx.js'
import {float} from './core/singleprecision.js'


let sum = 0;
function foo(t){
    //print('foo@'+ctx.now());
    sum += ctx.now();
    t.on();
}

function main(){
    let c1;
    for (var i=0; i<=1000; i++){
        sum = 0;
        c1 = Ctx();
        Timer(foo).on(0.001);
        ctx.run();
    }
}


console.time('main');
main();
console.log(sum);
console.log(ctx.now());
console.timeEnd('main');

