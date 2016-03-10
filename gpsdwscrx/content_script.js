function randhexgen() {
	return (1 + (Math.random() * 0x1000000) | 0).toString(16);
}

chrome.runtime.onMessage.addListener(function(msg) {
	// Got a message from gpsd, send it to the window
	window.postMessage(msg, '*');
});


/*
window.addEventListener('message', function(event) {
	// Only want messages from the window.
	if (event.source != window) {
		return;
	}
	
	if (event.data.f) {
		switch (event.data.f) {
			case 'getCurrentPosition':
				// event.data.id is a message id we should use to respond
				chrome.runtime.sendMessage({
					f: 'getCurrentPosition'
				}, function(response) {
					console.log('Got message back: ' + response);
					window.postMessage(window, {
						f: 'getCurrentPosition',
						i: event.data.id,
						r: response
					}, '*');
				});
			
				break;
		}
	}
});*/

// Add the shim
var shim = document.createElement('script');
shim.src = chrome.extension.getURL('shim.js');
shim.onload = function() {
	this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(shim);


/*
GpsListener.prototype.getCurrentPosition = function(success, error) {
	chrome.runtime.sendMessage({f: 'getCurrentPosition'}, function(response) {
		console.log(response);
	});

};
*/
// Lets override the geolocation API with our own version.
//navigator.geolocation = new GpsListener();

//(new GpsListener()).getCurrentPosition(null, null);

