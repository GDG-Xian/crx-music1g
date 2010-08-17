
var eventbox = document.getElementById('eventbox');
var port = chrome.extension.connect();

eventbox.addEventListener('playerEvent', function(){
	var data = eventbox.innerText;
	port.postMessage(JSON.parse(data));
});


