import {Gevent, now, print} from './ctx.js'

let verbose = {};
let active_log = [];
let e_log = Gevent('log');
e_log.log = active_log;

export function Logger(t) {
    if (verbose[t]) {
        function log(src='', dst='', name='', value=0, comment='') {
            let _log = [now(), src, dst, t, name, value, comment];
            active_log.push(_log);
            e_log.on();
        }
    } else {
        function log() {
            e_log.on();
        }
    }
    return log;
}

export function logget() {
    return active_log;
}

export function logreset() {
    verbose = {};
    logs = [];
}

export function logset(l) {
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

export function logcat(l) {
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

export function logrm(l) {
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

