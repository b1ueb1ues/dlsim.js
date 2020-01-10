import {now, print} from './ctx.js'

let verbose = {};
let active_log = [];

function Logger(t) {
    if (verbose[t]){
        function log(src='', dst='', name='', value=0, comment=''){
            active_log.push(
                [now(), src, dst, t, name, value, comment]
            );
        }
        return log;
    } else {
        return function(){};
    }
}

function logget() {
    return active_log;
}

function logreset() {
    verbose = {};
    logs = [];
}

function logset(l) {
    if (typeof l == 'string'){
        verbose[l] = 1;
        return;
    }
    if (typeof l == 'object'){
        for (var i in l){
            verbose[l[i]] = 1;
        }
        return;
    }
}

function logcat(l) {
    let data = '';
    if (!l)
        l = active_log;
    for (var i in l){
        let d = l[i];
        data += `${d[0]}, ${d[1]}, ${d[2]}, ${d[3]}` +
                `, ${d[4]}, ${d[5]}, ${d[6]}\n` ;
    }
    print(data);
}

function logrm(l) {
    if (typeof l == 'string'){
        delete verbose[l];
        return;
    }
    if (typeof l == 'object'){
        for (var i in l){
            delete verbose[l[i]];
        }
        return;
    }
}

