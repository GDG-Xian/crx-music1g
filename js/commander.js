var Commander = function() {
    // 用于发送COMMAND命令的PORT  EXTENSION --> CONTENTSCRIPT

    // 接受来自CONTENTSCRIPT的信息
    chrome.extension.onConnect.addListener(function(port) {
        console.assert(port.name == 'MUSIC1G_STATUS');
        port.onMessage.addListener(function(msg) {
            // 将接收到的状态信息模拟成事件，发送给对应的状态监听
            console.log('>>> ACCEPT STATUS: ' + msg.type + ', ' + JSON.stringify(msg.body));
            var evt = new CustomEvent(msg.type, { 'detail': msg.body });
            document.dispatchEvent(evt); 
        });
    });
    
}

Commander.prototype = {
    constructor: Commander,

    bind: function(eventName, callback) {
        document.addEventListener(eventName, function(evt) {
            callback(evt.detail); 
        }); 
    },

    command: function(type, option) {
        if (!this.port) {
            this.port = chrome.extension.connect({ name: 'MUSIC1G_COMMAND' });
        }
        this.port.postMessage({ 'type': type, 'option': option });
    }
}
