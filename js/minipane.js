(function($) {
    var background = chrome.extension.getBackgroundPage();
    var commander = background.commander;
    var player = background.player;

    $(function() {
        $('#next').click(player.next);
        
        player.bind('colorStyle', function(body) {
            $('#container').attr('css', themeName);
        });
        
        player.bind('currentSongInfo', function(body) {
            $('#msg').html(body.name);
            $('#detail').html('Loading...');
        });
        
        player.bind('playhead', function(body) {
            $('#progressinner').css('width', 100 * body.currentTime / body.totalTime + '%');
            $('#current-time').html(toTimeStr(body.currentTime)); 
            $('#total-time').html(toTimeStr(body.totalTime)); 
        });
        
        commander.bind('lyricSentence', function(data) {
            data.lyricSentence && $('#detail').html(data.lyricSentence); 
        });
        
        commander.command('getStatus', 'colorStyle');
        commander.command('getStatus', 'currentSongInfo');
    })
})(jQuery);
