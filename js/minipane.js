
var player = chrome.extension.getBackgroundPage();
var commander = player.commander;
var currSongName;

var container = document.id('container');
var msgEl = document.id('msg');
var msg2El = document.id('msg2');
var progressinnerEl = document.id('progressinner');
var currentTimeEl = document.id('current-time');
var totalTimeEl = document.id('total-time');
var volumeMaxEl = document.id('volume-max');
var volumeMinEl = document.id('volume-min');

// 更换主题颜色
var changeTheme = function(themeName){
    container.set('class', themeName || '');
};
// 播放
var play = function(){
    if (!player.isOn()) {
        player.on();
        msgEl.set('text', '开启中...');
    } else {
        commander.command('playPause');
    }
};
// 暂停
var pause = play;
// 下一首
var next = function(){
    commander.command('next');
};
// 加收藏
var star = function() {
    if (player.isOn()) {
        msgEl.set('text', '收藏"' + currSongName + '"中...');
        commander.command('saveCurrent');
        setTimeout(function() {
            msgEl.set('text', currSongName);
        }, 2000);
    }
}

// 转换时间为字符串
var toTimeStr = function(time){
    var t = parseInt(time, 10);
    var m = parseInt(t / 60, 10);
    var s = t % 60;
    if (s < 10) s = '0' + s;
    return m + ':' + s; 
};
// 
var setVolume = function(volume){
    commander.command('changeVolume', volume);
};

// 
var playEl = document.id('play');
playEl.addEvent('click', play);

var pauseEl = document.id('pause');
pauseEl.addEvent('click', pause);

var nextEl = document.id('next');
nextEl.addEvent('click', next);

var starEl = document.id('star');
starEl.addEvent('click', star);

var volumeThumbEl = document.id('volume-thumb');
var volumeThumbDown = false;
volumeThumbEl.addEvent('mousedown', function(e){
   volumeThumbDown = true;
});
volumeThumbEl.addEvent('mouseup', function(){
   volumeThumbDown = false;
   setVolume((this.getStyle('left').toInt()-19)/33);
});
document.addEvent('mouseup', function(){
   volumeThumbDown = false;
   setVolume((this.getStyle('left').toInt()-19)/33);
});
document.addEvent('mousemove', function(e){
    if (!volumeThumbDown) return;
    var x = e.client.x;
    if (x > 17 && x < 53) {
        volumeThumbEl.setStyle('left', x);
    }
});

volumeMaxEl.addEvent('click', function(){
    setVolume(1);    
}); 
volumeMinEl.addEvent('click', function(){
    setVolume(0);
});

var fixedPaneEl = document.id('fixedpane');
if (!player.fixedPaneIsOpen()){
    fixedPaneEl.setStyle('display', 'block');
    fixedPaneEl.addEvent('click', function(){
        player.openFixedPane();
        fixedPaneEl.setStyle('display', 'none');
    });
}
//
commander.addEvents({
    colorStyle: function(e){
        changeTheme(e.colorStyle);    
    },
    connect: function(){
        commander.command('getStatus', 'colorStyle');
        commander.command('getStatus', 'playerState');
    },
    disconnect: function(){
    },
    playerState: function(e){
        if (e.state == 'playing' || e.state == 'loading') {
            pauseEl.setStyle('display', 'block');
            playEl.setStyle('display', 'none');
            if (e.state == 'loading') {
                msg2El.set('text', '读取歌曲...');
            }
        } else if (e.state == 'paused' || e.state == 'stop') {
            playEl.setStyle('display', 'block');
            pauseEl.setStyle('display', 'none');
        } 
    },
    currentSongInfo: function(e){
        currSongName = e.name;
        var str = e.name + ' - ' + e.singer;
        msgEl.set('text', str); 
    },
    lyricSentence: function(e){
       msg2El.set('text', e.lyricSentence); 
    },
    playhead: function(e){
        progressinnerEl.setStyle('width', 
            100*e.currentTime/e.totalTime + '%');
        currentTimeEl.set('text', toTimeStr(e.currentTime)); 
        totalTimeEl.set('text', toTimeStr(e.totalTime));
    },
    volume: function(e){
        if (!volumeThumbDown) {
            volumeThumbEl.setStyle('left', e.volume*33+19);
        }
    }
});

        
//init
if (player.isOn()) {
    commander.command('getStatus', 'colorStyle');
    commander.command('getStatus', 'playerState');
    commander.command('getStatus', 'display');
    commander.command('getStatus', 'currentSongInfo');
    commander.command('getStatus', 'lyricSentence');
    commander.command('getStatus', 'volume');
} else {
    msgEl.set('text', '未开启');
}
container.setStyle('display', 'block');

document.body.onunload = function(){
    if (!player.fixedPaneIsOpen()) {
        commander.removeEvents();
    }
};

