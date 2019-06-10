
var loglevel = 0;

function loginit(log){
    if (log) {
        ctx.active_log = log;
        return 1; }
    else {
        ctx.active_log = [];
        return ctx.active_log; }
}

function log(t, name, amount, misc) {
    ctx.active_log.push([now(), t, name, amount, misc]);
}

var Log = {
    catline: function(i) {
        var j = [];
        j[1] = i[1];
        j[2] = i[2];
        j[3] = i[3];
        j[4] = i[4];

        if (!i[1]) {
            j[1] = ''; }
        else {
            j[1] = i[1]; }

        if (!i[2]) {
            j[2] = ''; }
        else {
            j[2] = i[2]; }

        if (!i[3]) {
            j[3] = ''; }
        else {
            j[3] = i[3]; }

        if (!i[4]) {
            j[4] = ''; }
        else {
            j[4] = i[4]; }

        print(''+i[0]+': '+j[1]+'\t, '+j[2]+'\t, '+j[3]+'\t, '+j[4]+'') 
    }
}

function logcat(filter, log) {
    if (!log) {
        log = ctx.active_log; }


    if (!filter) {
        for (var i in log) {
            Log.catline(log[i]);
        } 
    } 
    else {
        for (var i in log) {
            for (var j in filter) {
                if (log[i][1] == filter[j]) {
                    Log.catline(log[i]); } } } }
}

function logget() {
    return ctx.active_log;
}

function logreset() {
    ctx.active_log = [];
}
