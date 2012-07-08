!(function($) {
    var Player = window.Player = function(commander) {
        this.commander = commander;
        this.frontEnd = null;
        this.initialize();
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
            this.commander.bind('connect', $.proxy(this.connect, this));
            this.commander.bind('disconnect', $.proxy(this.disconnect, this));
        },

        connect: function() {
            this.is1g1gPlayerOpen = true;
            this.commander.command('getStatus', 'playerState');
            this.commander.command('getStatus', 'currentSongInfo');
            this.commander.command('getStatus', 'colorStyle');
            this.commander.command('getStatus', 'userInfo');
        },

        disconnect: function() {
            this.resetStatus();
        },

        next: function() {
            this.commander.command('next');
        }
    };
}(jQuery));
