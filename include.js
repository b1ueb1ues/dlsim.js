var include = [
    'ctx.js',
    'timeline.js'
]

if (typeof require != 'undefined') {
    console.log('nodejs');
    const fs = require('fs');
    for (var i in include) {
        eval(fs.readFileSync(include[i])+'')
    }
} else { // browser
    for (var i in include) {
        document.head.innerText += '<script type="text/javascript" src="'+include[i]+'"></script>'
    }
}

if (ctx.test) {
    print('ok');
}

