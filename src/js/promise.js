;(function() {

    //promise的方法
    //promise的resolve和reject状态

    //promise的执行过程有3中状态:
    //Pending (进行中)
    //Resolved/Fulfilled (已完成)
    //Rejected (已失败)
    // const p1 = new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(111);
    //     }, 10000);
    //
    //     setTimeout(() => {
    //         reject(222);
    //     }, 20000);
    // });
    //
    // p1.then((data) => {
    //     console.log(data);
    // }).catch((data) => {
    //     console.log(data);
    // });

    //串联
    // function ps1() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             console.log("执行任务1");
    //             resolve("完成任务1");
    //         }, 1000);
    //     });
    // }
    //
    // function ps2() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             console.log("执行任务2");
    //             resolve("完成任务2");
    //         }, 2000);
    //     });
    // }
    //
    // function ps3() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             console.log("执行任务3");
    //             reject("完成任务3");
    //         }, 3000);
    //     });
    // }
    //
    // ps1().then((data) => {
    //     console.log(data);
    //     return ps2();
    // }).then((data) => {
    //     console.log(data);
    //     return ps3();
    // }).catch((data) => {
    //     console.log(data);
    // });

    //并行all【与】
    //只有全部返回resolve，才能全部返回，并且返回的是Array
    //有一个返回reject，则直接返回reject
    // function tog1() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(1);
    //         }, 1000);
    //     });
    // }
    //
    // function tog2() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(2);
    //         });
    //     });
    // }
    //
    // function tog3() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             reject(2);
    //         });
    //     });
    // }
    //
    // Promise.all([tog1(), tog2(), tog3()]).then((data) => {
    //     console.log(data);
    // }).catch((data) => {
    //     console.log(data);
    // });

    //race的用法【或】
    //优先返回先执行完成的
    // function rac1() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(1);
    //         }, 1000);
    //     });
    // }
    //
    // function rac2() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(2);
    //         }, 500);
    //     });
    // }
    //
    // Promise.race([rac1(), rac2()]).then((data) => {
    //     console.log(data);
    // }).catch((data) => {
    //     console.log(data);
    // });
    // console.log("aaa");
    // const pp = Promise.resolve({
    //     then() {
    //         console.log(123);
    //     }
    // });

    function bb(aa) {
        console.log(aa);
    }

    bb(aa.call(this));

    function aa() {
        console.log(1234);
    }

    // pp.then(data=> console.log(data));

    //promise的实现
    function Promises(executor) {
        const self = this;

        //Promise当前的状态
        self.status = "pending",

        //Promise的值
        self.data = undefined,

        //Promise resolve时的回调函数集
        self.onResolvedCallback = [],

        //Promise reject时的回调函数集
        self.onRejectedCallback = [];

        function resolve(value) {
            if (self.status === 'pending') {
                self.status = 'resolved'
                self.data = value
                for(var i = 0; i < self.onResolvedCallback.length; i++) {
                    self.onResolvedCallback[i](value);
                }
            }
        }

        function reject(reason) {
            if (self.status === 'pending') {
                self.status = 'rejected'
                self.data = reason
                for(var i = 0; i < self.onRejectedCallback.length; i++) {
                    self.onRejectedCallback[i](reason)
                }
            }
        }

        try {
            executor(resolve.bind(this), reject.bind(this));
        } catch(e) {
            reject.bind(this)(e);
        }
    }

    //兼容其他的Promise
    function resolvePromise(promise2, x, resolve, reject) {
        let then,
            thenCallbackOrThrow = false;

        if(promise2 === x) {
            return reject(new TypeError("Chaining cycle detacted for promise."));
        }

        if(x instanceof Promises) {
            //如果x的状态还没有确定, 那么它有可能被一个thenable决定最终状态和值的
            //所以这里需要做一下处理, 而不能一概地以为它会被一个"正常"的值resolve
            if(x.status === "pending") {
                x.then((value) => {
                    resolvePromise(promise2, value, resolve, reject);
                });
            } else {

                //但如果这个Promise的状态已经确定了, 那么它肯定有一个"正常"的值, 而不是一个thenable, 所以这里直接取它的状态
                x.then(resolve, reject);
            }

            return;
        }

        if((x !== null) && ((typeof x === "object") || (typeof x === "function"))) {
            try {

                //因为x.then有可能是一个getter, 这种情况下多次读取就有可能产生副作用
                //即要判断它的类型, 又要调用它, 这就是两次读取
                const then = x.then;
                if(typeof then === "function") {
                    then.call(x, function rs(y) {
                        if(thenCalledOrThrow) {
                            return;
                        }

                        thenCalledOrThrow = true;

                        return resolvePromise(promise2, y, resolve, reject);
                    }, function rj(r) {
                        if(thenCalledOrThrow) {
                            return;
                        }

                        thenCallbackOrThrow = true;

                        return reject(r);
                    });
                } else {
                    resolve(x);
                }
            } catch(e) {
                if(thenCalledOrThrow) {
                    return;
                }
                thenCalledOrThrow = true;

                return reject(e);
            }
        } else {
            resolve(x);
        }
    }

    //then方法接收两个参数, onResolved和onRejected, 分别为Promise成功或失败的回调
    Promises.prototype.then = function(onResolved, onRejected) {
        var self = this
        var promise2

        // 根据标准，如果then的参数不是function，则我们需要忽略它，此处以如下方式处理
        onResolved = typeof onResolved === 'function' ? onResolved : function(value) { return value; }
        onRejected = typeof onRejected === 'function' ? onRejected : function(reason) { throw reason; }

        if (self.status === 'resolved') {
            // 如果promise1(此处即为this/self)的状态已经确定并且是resolved，我们调用onResolved
            // 因为考虑到有可能throw，所以我们将其包在try/catch块里
            return promise2 = new Promises(function(resolve, reject) {
                try {
                    var x = onResolved(self.data);

                    if (x instanceof Promises) { // 如果onResolved的返回值是一个Promise对象，直接取它的结果做为promise2的结果
                        x.then(resolve, reject);
                    }
                    resolve(x); // 否则，以它的返回值做为promise2的结果
                } catch (e) {
                    reject(e); // 如果出错，以捕获到的错误做为promise2的结果
                }
            })
        }

        if (self.status === 'pending') {
            // 如果当前的Promise还处于pending状态，我们并不能确定调用onResolved还是onRejected，
            // 只能等到Promise的状态确定后，才能确实如何处理。
            // 所以我们需要把我们的**两种情况**的处理逻辑做为callback放入promise1(此处即this/self)的回调数组里
            // 逻辑本身跟第一个if块内的几乎一致，此处不做过多解释
            return promise2 = new Promises(function(resolve, reject) {
                self.onResolvedCallback.push(function(value) {
                    try {
                        var x = onResolved(self.data);

                        if (x instanceof Promises) {
                            x.then(resolve, reject);
                        }

                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                })

                self.onRejectedCallback.push(function(reason) {
                    try {
                        var x = onRejected(self.data);
                        if (x instanceof Promises) {
                            x.then(resolve, reject);
                        }
                    } catch (e) {
                        reject(e);
                    }
                })
            })
        }
    }

    Promises.prototype.catch = function(onRejected) {
        return this.then(null, onRejected);
    }

    const p1 = new Promises(function(resolve, reject) {
        setTimeout(() => {
            resolve(1);
        }, 1000);

        // setTimeout(() => {
        //     reject(2);
        // }, 2000);
    });

    const p2 = new Promises(function(resolve, reject) {
        setTimeout(() => {
            resolve(2);
        });
    });

    p1
    .then()
    .then()
    .then(data => console.log(data))
    .catch((data) => {
        // console.log(data);
    });
})();
