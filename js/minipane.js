(function($) {
    var background = chrome.extension.getBackgroundPage();
    var player = background.player;

    var savingSong = false;

    function getSongInfo(songInfo) {
        return fmt('%{name} - %{singer}', songInfo); 
    }

    $(function() {
        var $message = $('#message');

        $message.find('.close').click(function() {
            $message.stop(true).fadeOut();
        });

        function showMessage(message, keep) {
            $message.find('span').html(message);
            $message.fadeIn();
            keep || $message.delay(4000).fadeOut();
        }

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

        $('#star').click(function() {
            var currSongName = player.currentSongInfo.name;
            player.command('saveCurrent');
            savingSong = true;
            showMessage(fmt('对"%{1}"操作进行中', currSongName), true);
        });
        
        player.bind('message', function(data) {
            // 收藏歌曲
            if (savingSong && data.text.indexOf('收藏成功') != -1) {
                showMessage(data.text);
                savingSong = false;
            }
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
