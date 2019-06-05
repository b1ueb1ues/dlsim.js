class Timeline{
    constructor() {
        this._tlist = [];
    }
}

class Timer{
    constructor(name = 'default') {
        this.name = name;
    }
    print(){
        print(this.name);
    }
}

