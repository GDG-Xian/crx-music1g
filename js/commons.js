// 格式化字符串
// 
// 用法：
// 
// var s1 = 'I like %{1} and %{2}!';
// console.log('source: ' + s1);
// console.log('target: ' + fmt(s1, 'ask', 'learn'));
// 
// var s2 = "%{name} is %{age} years old, his son's name is %{sons[0].name}";
// console.log('source: ' + s2);
// console.log('target: ' + fmt(s2, { name: 'Lao Ming', age: 32, sons: [{ name: 'Xiao Ming', age: 12}]}));
function fmt() {
    var args = arguments;
    return args[0].replace(/%\{(.*?)}/g, function(match, prop) {
        return function(obj, props) {
            var prop = /\d+/.test(props[0]) ? parseInt(props[0]) : props[0];
            if (props.length > 1) {
                return arguments.callee(obj[prop], props.slice(1));
            } else {
                return obj[prop];
            }
        }(typeof args[1] === 'object' ? args[1] : args, prop.split(/\.|\[|\]\[|\]\./));
    });
}

// 转换时间为字符串
function toTimeStr(time) {
    var t = parseInt(time, 10);
    var m = parseInt(t / 60, 10);
    var s = t % 60;
    if (s < 10) s = '0' + s;
    return m + ':' + s; 
}


