if (typeof document == 'undefined') {
    var nodejs = true;
    console.log('node');
    var print = function(line){
        console.log(line);
    }
    var dprint = function(line) {
        console.log(line);
    }
} else {  // browser
    var print = function(line){
        document.body.innerText += line+'\n';
    }
    var dprint = function(line) {
        console.log(line);
    }
}
export {print, dprint};
