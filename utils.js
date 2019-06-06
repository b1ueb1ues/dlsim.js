var ctx = {};

utils = {
    print : function(line){
        document.body.innerText += line+'\n';
    },

    dprint: function(line){
        document.body.innerText += line+'\n';
        console.log(line);
    },
}

print = utils.print
dprint = utils.dprint
