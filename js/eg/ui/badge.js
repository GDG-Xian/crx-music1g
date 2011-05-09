/**
 * ���ͼ������β���
 * @class Badge
 * @namespace eg.ui
 */
(function(){


    eg.ui.Badge = new Class({
        
        Implements: Options,

        options: {
            backgroundColor: [255, 0, 0, 0],
            text: ''
        },

        _maxCount: 8,
        _currentDot: 0,  
        _maxDot: 4,
        _timer: null,

        _text: '',

        initialize: function(options){
            this.setOptions(options);
            var opt = this.options;

            this.setBackgroundColor(opt.backgroundColor);
            this.setText(opt.text);
        },

        /**
         * ���ñ�����ɫ
         * @param {Array} color 
         */
        setBackgroundColor: function(color){
            chrome.browserAction.setBadgeBackgroundColor({
                color: color 
            });
            this._color = color;
        },

        /**
         * �����ַ�
         * @param {String} str 
         */
        setText: function(str){
			chrome.browserAction.setBadgeText({text: str});
            this._text = str;
        },

        /**
         * ������ȡ����
         */
        startLoadingAnimation: function() {
            if (!this._timer) {
                var self = this;
                this._timer = window.setInterval(function() {
                    self._paintLoadingAnimationFrame();
                }, 100);
            }
        },

        /**
         * ֹͣ��ȡ����
         */
        stopLoadingAnimation: function() {
            if (this._timer) {
                window.clearInterval(this._timer);
                this._timer = null;
                this.setText(this._text);
            }
        },

        /**
         * ���ƶ�ȡ״̬��һ֡
         * @private
         */
        _paintLoadingAnimationFrame: function() {
            var text = '';
            for (var i = 0; i < this._maxDot; i++) {
                text += (i == this._currentDot) ? "." : " ";
            }
            if (this._currentDot >= this._maxDot) {
                text += "";
            }

			chrome.browserAction.setBadgeText({text: text});
            ++this._currentDot;
            if (this._currentDot == this._maxCount) {
                this._currentDot = 0;
            }
        }
        
    });

})();
