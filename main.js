//import {Timer, print, dprint, now} from './ctx.js'
//import * as ctx from './ctx.js'
import {print, dprint, Timer, Ctx} from './core/ctx.js'
import * as ctx from './core/ctx.js'


function foo(t){
    print('foo@'+ctx.now());
    t.on();
}

function main(){
    let c1 = new Ctx();
    new Timer(foo).on(0.1);
    ctx.run();
}

console.time('main');
main();
console.timeEnd('main');

