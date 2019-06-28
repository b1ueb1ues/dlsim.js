//function include(url) {
//    var script = document.createElement("script"); 
//    script.src = url; 
//    document.head.appendChild(script); 
//}

class Characterbase {
    constructor() {
        this.base_atk = 3000;
    }

    dmg_make(name, dmg_coef, dtype) {
        if (!dtype) {
            dtype = name; }
        var amount = this.dmg_formula(dtype, dmg_coef);
        this.dmg_before(name, amount);
        log('dmg', name, amount);
        this.dmg_after(name, amount);
    }

    dmg_formula(dtype, dmg_coef) {
        var atk = 1.0 * this.atk_mod() * this.base_atk
        var def = 10.0 * this.def_mod()
        return 1.0/0.6 * dmg_coef * this.dmg_mod(dtype) * atk/def * 1.5
    }

    atk_mod() {
        return 1;
    }

    def_mod() {
        return 1;
    }

    dmg_mod() {
        return 1;
    }

    dmg_before() {
        return;
    }
    dmg_after() {
        return;
    }

}


function test(){
    ctx = {};
    new Log().init();
    new Timer().init();
    new Event().init();
    
    var c = new Characterbase();
    
    function foo(){
        c.dmg_make('x',1,'s');
        log('debug');
    }
    
    new Timer(foo,0,2).on();
    
    ctx.active_tl.run(100);
    
    logcat(['dmg','debug']);
}
test();
