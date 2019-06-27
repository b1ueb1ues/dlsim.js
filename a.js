if (typeof require != 'undefined') {
    console.log('nodejs');
    var utils = require('./nodeutils.js');
    ctx = utils.ctx;
    print = utils.print;
    dprint = utils.dprint;
    const fs = require('fs');
    eval(fs.readFileSync('timeline.js')+'')
}



print('hello world');


document.head.innerText += '<script type="text/javascript" src="./ctx.js"></script>'
if (ctx.test){
    print('!!!');
}

