var debug = 1;

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
    console.log('nodejs');
    const fs = require('fs');
    for (var i in include) {
        eval(fs.readFileSync(include[i])+'')
    }
} else { // browser
    loadScript(include[i], loadNext);
}
