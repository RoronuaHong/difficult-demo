/**
 * Created by SlimHong on 2018/0306
 */
//判断JS是否加载完成
//我们使用document的readyState属性: document.readyState
//readyState 属性返回当前文档的状态:
//
//uninitialized - 还未开始加载
//loading - 加载中
//interactive - 已加载, 文档与用户可以开始交互
//complete - 载入完成(loaded)

//封装loadScript
function loadScript(url, callback) {
    var script = document.createElement("script");

    script.type = "text/javascript";
    script.src = url;
    script.async = "async";

    document.appendChild(script);

    if(script.readyState) {     //IE
        script.onreadystatechange = function() {
            if(script.readyState === "completed" || script.readyState === "loaded") {
                script.onreadystatechange = null;
                callback();
            }
        }
    } else {        //非IE
        script.onload = function() { callback() }
    }

    //绑定资源加载失败事件
    script.onerror = function() {

    }
}

var script = document.createElement("script");
var head = document.getElementsByTagName("head")[0];

script.type = "text/javascript";
script.src = "//i.alicdn.com/resource.js";

//绑定资源加载成功事件
script.onreadystatechange = function() {
    if(/^(loaded|complete)$/.test(script.readyState)) {
        script.onreadystatechange = null;
    }
}

//绑定资源加载失败事件
script.onerror = function() {

}

head.insertBefore(script, head.firstChild);