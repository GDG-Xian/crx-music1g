var Player = function() {
    var self = this;

    // 接受来自CONTENTSCRIPT的信息
    chrome.extension.onConnect.addListener(function(port) {
        console.assert(port.name == 'MUSIC1G_STATUS');
        port.onMessage.addListener(function(msg) {
            console.log('>>> ACCEPT STATUS: ' + msg.type + ', ' + JSON.stringify(msg.body));
            self.dispatcher(msg.type, msg.body);        
            
            // 将接收到的状态信息模拟成事件，发送给对应的状态监听
            var evt = new CustomEvent(msg.type, { 'detail': msg.body });
            document.dispatchEvent(evt); 
        });
    });
    
}

Player.prototype = {
    constructor: Player,
        
    resetStatus: function() {
        this.is1g1gPlayerOpen = false;
        this.currentSongInfo = null;
        this.currentLrc = null;
        this.userInfo = null;
        this.message = null;
        this.display = null;
        this.colorStyle = null;
    },

    initialize: function() {
        this.resetStatus();
    },

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
    },

    //== 事件监听方法 ==
    
    dispatcher: function(type, body) {
        switch(type) {
            case 'connect':
                console.log('player connected');
                this.is1g1gPlayerOpen = true;
                this.command('getStatus', 'playerState');
                this.command('getStatus', 'currentSongInfo');
                this.command('getStatus', 'colorStyle');
                this.command('getStatus', 'userInfo');
                break;
            case 'disconnect':
                console.log('player disconnected');
                this.resetStatus();
                break;
            default:
                console.log(fmt('dispatch: type=%{1}, body=%{2}', type, JSON.stringify(body)));
                this[type] = body;
                break;
        }
    }
}
