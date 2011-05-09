/**
 * 插件图标的修饰部分
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
         * 设置背景颜色
         * @param {Array} color 
         */
        setBackgroundColor: function(color){
            chrome.browserAction.setBadgeBackgroundColor({
                color: color 
            });
            this._color = color;
        },

        /**
         * 设置字符
         * @param {String} str 
         */
        setText: function(str){
			chrome.browserAction.setBadgeText({text: str});
            this._text = str;
        },

        /**
         * 启动读取动画
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
         * 停止读取动画
         */
        stopLoadingAnimation: function() {
            if (this._timer) {
                window.clearInterval(this._timer);
                this._timer = null;
                this.setText(this._text);
            }
        },

        /**
         * 绘制读取状态的一帧
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
