function randhexgen() {
	return (1 + (Math.random() * 0x1000000) | 0).toString(16);
}

var GpsListener = function() {

};


GpsListener.prototype.getCurrentPosition = function(success, error) {
	chrome.runtime.sendMessage({f: 'getCurrentPosition'}, function(response) {
		console.log(response);
	});
	

};

// Lets override the geolocation API with our own version.
//navigator.geolocation = new GpsListener();

(new GpsListener()).getCurrentPosition(null, null);

