;(function() {
    //typeof
    let number = 1,
        boolean = true,
        undefineds = undefined,
        strings = "asd",
        symbols = Symbol("123"),
        arr = [1, 2, 3],
        fn = function() {},
        obj = { abc: 1 },
        nulls = null,
        dates = new Date(),
        regexp = /^1[35789]\d{9}$/gi,
        errors = new Error(),
        NaNs = NaN;

    // console.log(errors.constructor);
    // console.log(typeof number);             //number
    // console.log(typeof boolean);            //boolean
    // console.log(typeof undefineds);         //undefined
    // console.log(typeof strings);            //string
    // console.log(typeof symbols);            //symbol
    // console.log(typeof fn);                 //function
    // console.log(typeof obj);                //object
    // console.log(typoef NaNs);               //NaN
    // console.log(typeof dates);              //object
    // console.log(typeof arr);                //object
    // console.log(typeof nulls);              //object
    // console.log(typeof regexp);             //obejct


    /*instanceof*/
    function A() {};
    function B() {};

    let a = new A(),
        b = new B();

    // console.log(a instanceof A);        //true
    // console.log(b instanceof B);        //true
    // console.log(a instanceof B);        //false

    //将A的原型对象赋值给B的原型对象
    B.prototype = A.prototype;
    // console.log(a instanceof B);        //true
    // console.log(b instanceof B);        //true

    //改变B的原型对象
    B.prototype = {};
    // console.log(b instanceof B);        //false

    //将B的constructor指向回B
    B.prototype = {
        constructor: B
    }
    let b2 = new B();

    // console.log(b instanceof B);        //false
    // console.log(b2 instanceof B);       //true
    //
    // console.log(a instanceof Object);   //true
    // console.log(b instanceof Object);   //true
    // console.log(A instanceof Object);   //true
    // console.log(B instanceof Object);   //true
    //
    //
    // console.log(dates instanceof Date);     //true
    // console.log(arr instanceof Array);      //true
    // console.log(regexp instanceof RegExp);  //true
    // console.log(fn instanceof Function);    //true

    /*Object.prototype.toString.call*/
    // console.log(Object.prototype.toString.call(number));        //[object Number]
    // console.log(Object.prototype.toString.call(boolean));       //[object Boolean]
    // console.log(Object.prototype.toString.call(undefineds));    //[object Undefined]
    // console.log(Object.prototype.toString.call(strings));       //[object String]
    // console.log(Object.prototype.toString.call(symbols));       //[object Symbol]
    // console.log(Object.prototype.toString.call(arr));           //[object Array]
    // console.log(Object.prototype.toString.call(fn));            //[object Function]
    // console.log(Object.prototype.toString.call(nulls));         //[object Null]
    // console.log(Object.prototype.toString.call(obj));           //[object Object]
    // console.log(Object.prototype.toString.call(dates));         //[object Date]
    // console.log(Object.prototype.toString.call(regexp));        //[object RegExp]
    // console.log(Object.prototype.toString.call(NaNs));          //[object Number]
    //
    // console.log(Object.prototype.toString.call(number).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(boolean).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(undefineds).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(strings).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(symbols).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(arr).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(fn).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(nulls).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(obj).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(dates).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(regexp).slice(8, -1).toLowerCase());
    // console.log(Object.prototype.toString.call(NaNs).slice(8, -1).toLowerCase());

    // console.log(number.constructor);            //Number() { [native code] }
    // console.log(boolean.constructor);           //Boolean() { [native code] }
    // // console.log(undefineds.constructor);     //Error
    // console.log(strings.constructor);           //String() { [native code] }
    // console.log(symbols.constructor);           //Symbol() { [native code] }
    // console.log(arr.constructor);               //Array() { [native code] }
    // console.log(fn.constructor);                //Function() { [native code] }
    // // console.log(nulls.constructor);          //Error
    // console.log(obj.constructor);               //Object() { [native code] }
    // console.log(dates.constructor);             //Date() { [native code] }
    // console.log(regexp.constructor);            //RegExp() { [native code] }
    // console.log(NaNs.constructor);              //Number() { [native code] }
    //
    // console.log(boolean.constructor.toString().slice(8, -20).toLowerCase());
    // console.log(strings.constructor.toString().slice(8, -20).toLowerCase());
    // console.log(symbols.constructor.toString().slice(8, -20).toLowerCase());
    // console.log(arr.constructor.toString().slice(8, -20).toLowerCase());
    // console.log(fn.constructor.toString().slice(8, -20).toLowerCase());
    // console.log(obj.constructor.toString().slice(8, -20).toLowerCase());
    // console.log(dates.constructor.toString().slice(8, -20).toLowerCase());
    // console.log(regexp.constructor.toString().slice(8, -20).toLowerCase());
    // console.log(NaNs.constructor.toString().slice(8, -20).toLowerCase());

    // console.log(Array.isArray(boolean));

    // console.log(isNaN(NaN));
    // console.log(isNaN("123"));

    var typeDetection = {
        //先判断是否为NaN, 之后使用Object.prototype.toString.call判断
        protoObj: function(obj) {
            return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        },
        //先判断是否为NaN和undefined/null, 之后使用判断
        constructorObj: function(obj) {
            if(obj === undefined) {
                return typeof undefined;
            } else if(obj === null) {
                return "null";
            }

            return obj.constructor.toString().slice(8, -20).toLowerCase();
        },
        //使用typeof和instanceof
        typeInstanceObj: function(obj) {
            if(typeof obj !== "object") {
                return typeof obj;
            }

            if(obj instanceof Object) {
                return typeof obj;
            } else {
                return "null";
            }
        }
    }

    const abc = typeDetection.protoObj(""),
        def = typeDetection.typeInstanceObj(null);

    console.log(abc);
    console.log(def);
})();