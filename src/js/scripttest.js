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