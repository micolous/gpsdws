chrome.runtime.onMessage.addListener(function(msg) {
	// Got a message from gpsd, send it to the window
	window.postMessage(msg, '*');
});

// Add the shim
var shim = document.createElement('script');
shim.src = chrome.extension.getURL('shim.js');
shim.onload = function() {
	this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(shim);

