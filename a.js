if (typeof require != 'undefined') {
    console.log('nodejs');
    var utils = require('./nodeutils.js');
    ctx = utils.ctx;
    print = utils.print;
    dprint = utils.dprint;
}


print('hello world');
