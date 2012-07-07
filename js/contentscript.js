// 建立向扩展页面发送播放状态信息的通道
var port = chrome.extension.connect({name: 'MUSIC1G_STATUS'});

// 捕获甴COMMANDER代理页面传递回来的播放状态
// 并通过 MUSIC1G_STATUS通道发送给扩展页面
document.addEventListener('MUSIC1G_STATUS', function(evt) {
    port.postMessage(evt.detail);
});

// 接受来自扩展页面发出的播放指令
chrome.extension.onConnect.addListener(function(port) {
    console.assert(port.name == 'MUSIC1G_COMMAND');
    port.onMessage.addListener(function(msg) {
        console.log('SEND COMMAND: type=' + msg.type 
            + (msg.option ? ', option=' + JSON.stringify(msg.option) : ''));
        var detail = { 'type': msg.type, 'option': msg.option };
        var evt = new CustomEvent('MUSIC1G_COMMAND', { 'detail': detail });
        document.dispatchEvent(evt);
    });
});
