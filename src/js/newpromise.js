;(function() {
    function Newpromise(executor) {
        const that = this;

        //状态
        that.status = "pending",
        that.data = "",

        //存储函数的数组
        that.onResolvedCallback = [],
        that.onRejectedCallback = [];

        //回调函数的2个参数: resolve, reject:
        function resolve(value) {
            setTimeout(function() {
                if (that.status === "pending") {
                    that.status = "resolved";
                    that.data = value;

                    for (let i = 0; i < that.onResolvedCallback.length; i++) {

                        //执行每一个回调函数
                        that.onResolvedCallback[i](value);
                    }
                }
            });
        }

        function reject(reason) {
            setTimeout(function() {
                if (that.status === "pending") {
                    that.status = "rejected";
                    that.data = reason;

                    for (let i = 0; i < that.onRejectedCallback.length; i++) {

                        //执行每一个回调函数
                        that.onRejectedCallback[i](value);
                    }
                }
            });
        }

        try {
            executor(resolve.bind(this), reject.bind(this));
        } catch(ex) {
            reject.bind(this)(ex);
        }
    }

    Newpromise.prototype.then = function(onResolved, onRejected) {
        const that = this;
        let promise2;

        onResolved = typeof onResolved === "function" ? onResolved : function(value) { return value }
        onRejected = typeof onRejected === "function" ? onRejected: function(reason) { return reason }

        if(that.status === "resolved") {
            setTimeout(function() {
                return promise2 = new Newpromise((resolve, reject) => {
                    try {

                        //执行当前函数
                        const x = onResolved(that.data);

                        //递归，最后的promise分解为非promise对象
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (ex) {
                        reject(ex);
                    }
                });
            });
        }

        if(that.status === "pending") {
            setTimeout(function() {
                return promise2 = new Newpromise((resolve, reject) => {
                    that.onResolvedCallback.push((value) => {
                        try {
                            const x = onResolved(that.data);

                            resolvePromise(promise2, x, resolve, reject);
                        } catch (ex) {
                            reject(ex);
                        }
                    });

                    that.onRejectedCallback.push((reason) => {
                        try {
                            const x = onRejected(that.data);

                            resolvePromise(promise2, x, resolve, reject)
                        } catch (ex) {
                            reject(ex);
                        }
                    });
                });
            });
        }
    }

    Newpromise.prototype.catch = function(onRejected) {
        return this.then(null, onRejected);
    };

    function resolvePromise(promise2, x, resolve, reject) {
        let then,
            thenCallbackOrThrow = false;

        if(promise2 === x) {
            return reject(new TypeError("chaining cycle detacted for promise!"));
        }

        if(x instanceof Newpromise) {
            if(x.status === "pending") {
                x.then((value) => {
                    resolvePromise(promise2, value, resolve, reject);
                }, reject);
            } else {
                x.then(resolve, reject);
            }

            return;
        }

        if((x !== null) && ((typeof x === "object")) || (typeof x === "function")) {
            try {
                then = x.then;

                if(typeof x === "function") {
                    then.call(x, function rs(y) {
                        if(thenCallbackOrThrow) {
                            return;
                        }

                        thenCallbackOrThrow = true;

                        return resolvePromise(promise2, y, resolve, reject);
                    }, function rj(r) {
                        if(thenCallbackOrThrow) {
                            return;
                        }

                        return reject(r);
                    });
                } else {
                    resolve(x);
                }
            } catch(ex) {
                if(thenCallbackOrThrow) {
                    return;
                }
                thenCallbackOrThrow = true;
                return reject(ex);
            }
        } else {
            resolve(x);
        }
    }

    function p1() {
        return new Newpromise((resolve, reject) => {
            setTimeout(() => {
                resolve(321);
            }, 2000);
        });
    }

    p1()
    .then()
    .then()
    .then(data => console.log(data));
})();