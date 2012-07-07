$(function() {
    var background = chrome.extension.getBackgroundPage();
    var commander = background.commander;
    
    // 转换时间为字符串
    function toTimeStr(time){
        var t = parseInt(time, 10);
        var m = parseInt(t / 60, 10);
        var s = t % 60;
        if (s < 10) s = '0' + s;
        return m + ':' + s; 
    };
    
    function changeTheme(themeName) {
        $('#container').attr('css', themeName);
    };
    
    document.getElementById('next').onclick = function() {
        commander.command('next');
    };
    
    commander.bind('connect', function() {
        commander.command('getStatus', 'colorStyle');
        commander.command('getStatus', 'playerState');
    });
    
    commander.bind('colorStyle', function(body) {
        changeTheme(body.colorStyle);  
    });
    
    commander.bind('currentSongInfo', function(body) {
        $('#msg').html(body.name);
        $('#detail').html('Loading...');
    });
    
    commander.bind('playhead', function(body) {
        $('#progressinner').css('width', 100 * body.currentTime / body.totalTime + '%');
        $('#current-time').html(toTimeStr(body.currentTime)); 
        $('#total-time').html(toTimeStr(body.totalTime)); 
    });
    
    commander.bind('lyricSentence', function(data) {
        data.lyricSentence && $('#detail').html(data.lyricSentence); 
    });
    
    commander.command('getStatus', 'colorStyle');
    commander.command('getStatus', 'currentSongInfo');
});
