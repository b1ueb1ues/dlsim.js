if (!nodejs) {
    function print(line) {
        document.body.innerText += line+'\n';
    }
    function dprint(line) {
        document.body.innerText += line+'\n';
        console.log(line);
    }
} else {
    function print(line) {
        console.log(line);
    }

    function dprint(line){
        console.log(line);
    }
}
