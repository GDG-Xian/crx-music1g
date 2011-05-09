/**
 * 1gcommander ��һ��chrome�������ʵ�� 
 * require: base.js
 */
(function(){

    /**
     * �¼�����
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
     * ����ҳ���ַ
     * ����Chrome���������ƣ���Ҫͨ������ҳ����ת���¼�
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
         * ִ��һ������
         * @param {String} type ��������
         * @param {String | Object} param ����
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
         * ����������api����ҳ��
         * @private
         */
        _createProxyPage: function(){
            var container =  document.id(this._proxyPageContainer);         
            this._proxyPage = new Element('iframe', {
                src: PROXY_PAGE
            }).inject(container);
        },

        /**
         * ��ʼ�������ҳ����¼�����ͨ��
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
