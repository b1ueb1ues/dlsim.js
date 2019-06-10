loginit();
tl = new Timer().init();

log('test');
log('test2','test','2');
new Timer(function (){log('test2','test','3')
}).on(1);
tl.run();

logcat();
