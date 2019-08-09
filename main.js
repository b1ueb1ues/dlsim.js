var debug = 0;

var include = [
    'utils.js',
    'ctx.js',
    'event.js',
    'timeline.js',
    'log.js',
    'characterbase.js',
    '__END__'
]

var i = 0;
var len = include.length-1;

function loadNext(){
    i += 1;
    if (i >= len)return;
    loadScript(include[i], loadNext);
}

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

if (typeof require != 'undefined') {
    if (debug) console.log('nodejs');
    const fs = require('fs');
    var js = '';
    var nodejs = true;

    for (i=0;i<len;i++) {
        if (debug) console.log(include[i]);
        js += fs.readFileSync(include[i])+'';
    }
    eval(js);
} else { // browser
    loadScript(include[i], loadNext);
}
