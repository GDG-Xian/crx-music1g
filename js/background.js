var URL = 'http://1g1g.com';
// mini player 窗口宽度 	
var MINI_WIDTH = 400;
// mini player 窗口高度
var MINI_HEIGHT = 570;
    
var DEFAULT_OPTIONS = {
    playMode: 0
};

var commander = new eg.Commander();
var badge = new eg.ui.Badge({
    backgroundColor: [190, 190, 190, 230]
});
var optionsManager = new eg.OptionsManager(DEFAULT_OPTIONS);
// classes

var openInWindow = localStorage['innerPlayer'] === 'false';
var showControl = localStorage['showControl'] === 'true' || localStorage['showControl'] === undefined;


var _bgPlayer = document.id('player');
chrome.windows.onRemoved.addListener(function(winId){
	if (gwin && gwin.id == winId) {
		statusManager.setStatus(OFF);	
	}	
});

var _isOpened = false;
var on = function(){
    badge.startLoadingAnimation();
    switch (optionsManager.get('playMode')) {
        case 0: 
            if (_bgPlayer) {
                _bgPlayer.src = URL;
            }
        break;    
        case 1:
	        chrome.windows.create({
			    url: URL, 
                width: MINI_WIDTH, 
                height: MINI_HEIGHT,
                type: 'popup'
            },
			function(win){
			    window.gwin = win;
            });
        break;    
        default:null;break;
    }
};

var off = function(){
    innerPlayer.src = '';
    if (window.gwin) {
	    chrome.windows.remove(window.gwin.id);
    }
};

var isOn = function(){
    return _isOpened;
};

var _fixedPane = null;
var openFixedPane = function(){
    if (_fixedPane) return;
	_fixedPane = webkitNotifications.createHTMLNotification('minipane.html');
    _fixedPane.show();
    _fixedPane.addEventListener('close', function(){
		_fixedPane = null;
	});
};

var closeFixedPane = function(){
    if (!_fixedPane) return;
    _fixedPane.cancel();
	_fixedPane = null;
};

var fixedPaneIsOpen = function(){
    return !!_fixedPane;
};

commander.addEvent('connect', function(){
    _isOpened = true;
    badge.stopLoadingAnimation();
    badge.setBackgroundColor([255, 0, 0, 255]);
    chrome.browserAction.setIcon({
        path: 'img/icon32-red.png'
    });
    commander.command('getStatus', 'volume');
}, true);

commander.addEvent('disconnect', function(){
    _isOpened = false;
    badge.setBackgroundColor([190, 190, 190, 230]);
    chrome.browserAction.setIcon({
        path: 'img/icon32-blue.png'
    });
}, true);

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (!changeInfo.url) return;    
    if (changeInfo.url.match(/.*1g1g\.com\/?$/i) ||
        changeInfo.url.match(/.*1g1g\.com\/?#.*$/i)) {
        _bgPlayer.src = '';        
    }
});


