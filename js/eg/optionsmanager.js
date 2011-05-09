/**
 * 用于设置参数的管理
 * @class OptionsManager
 * @namespace eg
 */
(function(){


    eg.OptionsManager = new Class({
        
        Implements: Options,

        options: {
            
        },
        
        initialize: function(defaultOptions){
            this.setOptions(defaultOptions);
            this._readOptions();    
        },

        set: function(key, value){
            this.options[key] = value;
            this._writeOptions();
        },

        get: function(key){
            return this.options[key];
        },

        _readOptions: function(){
            var opt = JSON.parse(localStorage['options']||'{}');
            this.setOptions(opt);
        },

        _writeOptions: function(){
            localStorage['options'] = JSON.stringify(this.options);
        }

    });

})();
