var player = new Player();
var playerFrame = document.getElementById('player-frame');

// 在内嵌窗口中打开亦歌音乐播放器
function openMusic1g() {
    playerFrame.src = 'http://www.1g1g.com/';        
}

function closeMusic1g() {
    playerFrame.src = 'about:blank';
}
