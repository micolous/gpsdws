/*
 * content_script.js
 * Inserts the location shim into the page, and plumbs location messages from
 * the background worker into the shim.
 */

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

