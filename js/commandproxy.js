
var eventbox = document.getElementById('eventbox');
var port = chrome.extension.connect();

eventbox.addEventListener('1gEvent', function(){
	var data = eventbox.innerText;
	port.postMessage(JSON.parse(data));
});

//
var commandbox = document.getElementById('commandbox');
var commandEvent = document.createEvent('Event');
commandEvent.initEvent('1gCommand', true, true);

chrome.extension.onConnect.addListener(function(port){
    port.onMessage.addListener(function(event){
        if (event.type) {
            commandbox.innerText = JSON.stringify(event);
            commandbox.dispatchEvent(commandEvent);
        }
    });
});

