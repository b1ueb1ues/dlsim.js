
export class Action {
    static init (src) {
        function new_action (conf, data) {
            return new Action(conf, data);
        }
        return new_action;
    }
    constructor (conf, data) {

    }
}

let conf = {"atype":"s"};
conf.hit = [{"timing":1, "label":"test"},
            {"timing":1, "label":"test", "delay":[0, 0.1]},
           ];
conf.cancel = [{"timing":1, "duration":1, "atype":"fs"}];
console.log(conf)
