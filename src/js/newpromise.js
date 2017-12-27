"use strict";

import asap from "./asap";

//设置空函数
function noop() {};

//提取try/catch函数
let LAST_ERROR = null;
let IS_ERROR = {};

function getThen(obj) {
    try {
        return obj.then;
    } catch(ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
    }
}

function tryCallOne(fn, a) {
    try {
        return fn(a);
    } catch(ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
    }
}

function tryCallTwo(fn, a, b) {
    try {
        return fn(a, b);
    } catch(ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
    }
}

module.exports = Newpromise;

function Newpromise(fn = noop) {

    //延迟状态
    this._deferredState = 0;

    //当前状态
    this._state = 0;

    //获取到的值
    this._value = null;

    //延迟
    this._deferreds = null;

    if(fn === noop) return;

    doResolve(fn, this);
}

Newpromise.prototype.then = function() {
    if(this.constructor !== Newpromise) {
        return safeThen(this, onFullfilled, onRejected);
    }

    const res = new Newpromise(noop);
    handle(this, new Handler(onFullfilled, onRejected, res));

    return res;
}

function safeThen(self, onFullfilled, onRejected) {
    return new self.constructor(function(resolve, reject) {
        const res = new Newpromise(noop);
        res.then(resolve, reject);
        handle(self, new Handler(onFullfilled, onRejected));
    });

}

//Newpormise设置handle和reject的静态方法, 设置noop的静态空方法
Newpromise._onHandle = null;
Newpromise._onReject = null;
Newpromise._noop = noop;

//实现resolve功能函数
function resolve(self, newValue) {

    //判断self和newValue的值相等的情况
    if(newValue === self) {
        return reject(
            self,
            new TypeError("A promise cannot be resolved with itself.")
        );
    }

    //如果存在newValue且newValue的值是对象或者函数
    if(
        newValue &&
        (typeof newValue === "object" || typeof newValue === "function")
    ) {
        const then = getThen(newValue);
        if(then === IS_ERROR) {
            return reject(self, LAST_ERROR);
        }

        if(then === self.then && newValue instanceof Newpromise) {
            self._state = 3;
            self._value = newValue;

            //修改状态
            finale(self);

            return;
        } else if(typeof then === "function") {
            doResolve(then.bind(newValue), self);
            return;
        }
    }
}

//实现reject功能函数
function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;

    if(Newpromise._onRejected) {
        Newpromise._onRejected(self, newValue);
    }

    //修改状态
    finale(self);
}

//执行函数
function handle(self, deferred) {

    //当状态为3时候，为兼容其他的promise
    while(self._state === 3) {
        self = self._value;
    }

    if(Newpromise._onHandle) {
        Newpromise._onHandle(self);
    }

    //当前的状态为0时进行的操作
    if(self._state === 0) {

        //当延迟状态为0时, 将其状态修改为1(Fullfilled)
        if(self._deferredState === 0) {
            self._deferredState = 1;

            //添加_deferreds的属性
            self._deferreds = deferred;

            return;
        }

        //当延迟状态为1时候,将其状态修改为2(Rejected)
        if(self._deferredState === 1) {
            self._deferredState = 2;

            //添加_deferreds的单个数组
            self._deferreds = [self._deferreds, deferred];

            return;
        }

        //添加_deferreds的数组
        self._deferreds.push(deferred);

        return;
    }

    handleResolved(self, deferred);
}

//实现handleResolved
function handleResolved(self, deferred) {
    asap(function() {
        const cb = self._state === 1 ? deferred.onFullfilled : deferred.onRejected;

        if(cb === null) {
            if(self._state === 1) {
                resolve(deferred.promise, self._value);
            } else {
                reject(deferred.promise, self._value)
            }
            return;
        }

        const ret = tryCallOne(cb, self._value);

        if(ret === IS_ERROR) {
            reject(deferred.promise, LAST_ERROR);
        } else {
            resolve(deferred.promise, ret);
        }
    });
}

//修改状态函数
function finale(self) {

    //当延迟状态为1的时候, 执行当前的状态
    if(self._deferredState === 1) {

        //
        handle(self, self._deferreds);
        self._deferreds = null;
    }

    //当延迟状态为2的时候, 循环执行当前的状态
    if(self._deferredState === 2) {
        for(let i = 0; i < self._deferreds.length; i++) {

            //
            handle(self, self._deferreds[i]);
        }
        self._deferreds = null;
    }
}

//新建构造函数
function Handler(onFullfilled, onRejected, promise) {
    this.onFullfilled = typeof onFullfilled === "function" ? onFullfilled : null;
    this.onRejected = typeof onRejected === "function" ? onRejected : null;
    this.promise = promise;
}

//行为不当的功能: 确保onResolved和onRejected只执行一次, 不保证异步
function doResolve(fn ,promise) {

    //设置一个
    let done = false;

    //将a和b放入fn中
    let res = tryCallTwo(fn, function(value) {
        if(done) return;

        done = true;
        resolve(promise, value);
    }, function(reason) {
        if(done) return;

        done = true;
        reject(promise, reason);
    });

    //如果res报错, 则直接返回reject
    if(!done && res === IS_ERROR) {
        done = true;
        reject(promise, LAST_ERROR);
    }
}