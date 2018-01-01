/*

    Newpromise的调用顺序


 */

"use strict";

import asap from "./asap";

//空函数
function noop() {};

//存储错误, 用来做traceback的
let LAST_ERROR = null,

    //枚举变量, 代表有错误
    IS_ERROR = {};

//获取then函数
function getThen(obj) {
    try {
        return obj;
    } catch(ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
    }
}

//执行一次
function tryCallOne(fn, a) {
    try {
        return fn(a);
    } catch(ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
    }
}

//执行两次
function tryCallTwo(fn, a, b) {
    try {
        return fn(a, b);
    } catch(ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
    }
}

//构建Newpromise函数
module.exports = Newpromise;

function Newpromise(fn = noop) {
    
}