var port = chrome.extension.connect({name: 'commander'});

document.addEventListener('music1g', function(evt) {
    var data = evt.detail;
    console.log(JSON.stringify(data));
    port.postMessage(data);
});

chrome.extension.onConnect.addListener(function(port){
    console.assert(port.name == "commander");
    port.onMessage.addListener(function(event){
        if (event.type) {
            var detail = { "type": type, "body": body };
            var evt = new CustomEvent("music1g", { "detail": detail });
            commandbox.dispatchEvent(evt);
        }
    });
});
