(function($) {
    var background = chrome.extension.getBackgroundPage();
    var player = background.player;

    function getSongInfo(songInfo) {
        return fmt('%{name} - %{singer}', songInfo); 
    }

    $(function() {
        $('#next').click(function() {
            player.command('next')
        });
        
        $('#play').click(function() {
            if (!player.is1g1gPlayerOpen) {
                $('#msg').html('连接中...');
                background.openMusic1g();
            } else {
                player.command('playPause');
            }

            $(this).hide();
            $('#pause').show();
        });

        $('#pause').click(function() {
            player.command('playPause');
            $(this).hide();
            $('#play').show();
        });

        player.bind('colorStyle', function(data) {
            $('#container').attr('class', data.colorStyle);
        });
        
        player.bind('currentSongInfo', function(currentSongInfo) {
            $('#msg').html(getSongInfo(currentSongInfo));
            $('#msg2').html('专辑: ' + currentSongInfo.album);
        });
        
        player.bind('playhead', function(body) {
            $('#progressinner').css('width', 100 * body.currentTime / body.totalTime + '%');
            $('#current-time').html(toTimeStr(body.currentTime)); 
            $('#total-time').html(toTimeStr(body.totalTime)); 
        });
        
        player.bind('lyricSentence', function(data) {
            data.lyricSentence && $('#msg2').html(data.lyricSentence); 
        });

        if (player.is1g1gPlayerOpen) {
            // 加载歌曲信息
            if (player.currentSongInfo) {
                $('#msg').html(getSongInfo(player.currentSongInfo));
                $('#msg2').html('专辑: ' + player.currentSongInfo.album);
            } else {
                $('#msg').html('连接中...');
            }
            
            // 加载播放状态
            if (player.playerState) {
                var state = player.playerState.state;
                if ('playing' === state) {
                    $('#pause').show();
                    $('#play').hide();
                } else {
                    $('#pause').hide();
                    $('#play').show();
                }
            } 

            // 加载皮肤
            if (player.colorStyle) {
                $('#container').attr('class', player.colorStyle.colorStyle);
            }
        } else {
            $('#msg').html('未开启...');
        }
    })
})(jQuery);
