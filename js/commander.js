var Commander = function() {
    this.port = chrome.extension.connect({name: "commander"});
    chrome.extension.onConnect.addListener(function(port) {
        console.assert(port.name == "commander");
        port.onMessage.addListener(function(msg) {
            var evt = new CustomEvent(msg.type, {"detail": msg.body });
            console.log(msg);
            document.dispatchEvent(evt); 
        });
    });
    
}

Commander.prototype = {
    constructor: Commander,

    bind: function(event, callback) {
        document.addEventListener(event, function(evt) {
            console.log(evt);
            console.log('listener: ' + JSON.stringify(evt.detail));
            callback(evt.detail); 
        }); 
    }
}
