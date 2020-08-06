// Use Ctx(someclass) to make a context of a class.
// Call context will new a class with ctx as first arg, and attach ctx to this 
// instance. Instance created by the same ctx share the same ctx, which can 
// be used as a static field.
export function Ctx(_class){
    var _new = function (...args) {
        let _instance = new _class(_new, ...args);
        _instance.ctx = _new;
        return _instance;
    }
    return _new;
}
