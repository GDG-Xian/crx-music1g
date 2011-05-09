/**
 * 1gcommander 的一个chrome插件机制实现 
 * require: base.js
 */
(function(){

    /**
     * 事件类型
     */
    var EVENT = {
        CONNECT: 'connect',
        DISCONNECT: 'disconnect',
        COLOR_STYLE: 'colorStyle',
        PLAYER_STATUS: 'playerStatus',
        PLAYHEAD: 'playhead',
        CURRENT_SONG_INFO: 'currentSongInfo',
        VOLUME: 'volume',
        PlAY_MODE: 'playMode',
        LRC: 'lrc',
        LYRIC_SENTENCE: 'lyricSentence',
        DISPLAY: 'display',
        MESSAGE: 'message',
        USER_INFO: 'userInfo'
    };

    /**
     * 代理页面地址
     * 由于Chrome环境的限制，需要通过代理页面来转交事件
     */
    var PROXY_PAGE = 'http://1gapi.sinaapp.com/apiproxy.html';

    eg.Commander = new Class({

        Implements: [Options, Events],
        
        initialize: function(options){
            this.setOptions(options);
            var opt = this.options;

            this._proxyPageContainer = 
                opt.proxyPageContainer || document.body;
            
            this._createProxyPage();
            this._initProxyPageConnect();
        },

        /**
         * 执行一个动作
         * @param {String} type 命令名称
         * @param {String | Object} param 参数
         */
        command: function(type, param){
            if (!this._proxyPagePort) {
                this._proxyPagePort = chrome.extension.connect();
            }
            this._proxyPagePort.postMessage({
                type: type,
                param: param
            });
        },

        /**
         * 创建并加载api代理页面
         * @private
         */
        _createProxyPage: function(){
            var container =  document.id(this._proxyPageContainer);         
            this._proxyPage = new Element('iframe', {
                src: PROXY_PAGE
            }).inject(container);
        },

        /**
         * 初始化与代理页面的事件传输通道
         * @private
         */
        _initProxyPageConnect: function(){
            var self = this; 

            chrome.extension.onConnect.addListener(function(port){
	            port.onMessage.addListener(function(event){
                    if (event.type) {
                        self.fireEvent(event.type, event.body);
		            }
		        });
	        });	

        }

    });

})();
