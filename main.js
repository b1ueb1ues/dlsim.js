//import {Timer, print, dprint, now} from './ctx.js'
//import * as ctx from './ctx.js'
import * as tl from './timeline.js'




function main(){
    let t = ['0','1','2','3'];
    let c = t.splice(1,1);
    console.log(t);
    console.log(c);
}

main();


//function test_timeline() {
//    function foo() {
//        dprint('foo: '+now());
//    }
//    Timer.init()
//    var t = new Timer(foo, 0.2);
//    t.on();
//    var t2 = new Timer(0,10,0.2);
//    t2.on();
//
//    ctx.run();
//    dprint('done');
//}
//test_timeline();
//
