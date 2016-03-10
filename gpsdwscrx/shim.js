/*
 * Structure adapted from:
 * https://dl.dropboxusercontent.com/u/577031/mocklocation/mocklocation.js
 */
(function() {
	var LocationShim = function() {
		var sequence = 0, watches = {};
		
		var notify = function(data) {
			Object.keys(watches).forEach(function(id) {
				var watch = watches[id];
				
				if (!watch.enabled) {
					return;
				}
				
				// pick something to send
				if (typeof(watch.success) === 'function') {
					watch.success.call(window, data);
				}
				
				if (watch.once) {
					watch.enabled = false;
				}
			});
		};
		
		window.addEventListener('message', function(event) {
			// Only want messages from the window.
			if (event.source != window) {
				console.log('shim: message not from window');
				return;
			}
			
			console.log('shim: got ' + JSON.stringify(event.data));
			notify(event.data);
		});
		
		var addWatch = function(once, success, error, options) {
			sequence++;
			watches[sequence] = {
				once: once,
				enabled: true,
				success: success,
				error: error
			};
			
			return sequence;
		};
		
		this.destroy = function() {
			watches = [];
			return this;
		};			
	
		this.getCurrentPosition = function(success, error, options) {
			return addWatch(true, success, error, options);
		};
		
		this.watchPosition = function(success, error, options) {
			return addWatch(false, success, error, options);
		}
		
		this.clearWatch = function(id) {
			if (watches[id]) {
				watches[id].enabled = false;
			}
		};
	};
	
	
	// Monkeypatch in our version of the Geolocation API
	LocationShim.override = function(geolocation) {
		var shim = new LocationShim();

		geolocation.getCurrentPosition = function(success, error, options) {
			shim.getCurrentPosition(success, error, options);
		};
		
		geolocation.watchPosition = function(success, error, options) {
			return shim.watchPosition(success, error, options);
		};
		
		geolocation.clearWatch = function(id) {
			shim.clearWatch(id);
		};
	};

	window.LocationShim = LocationShim;
	LocationShim.override(navigator.geolocation);
	console.log('LocationShim installed');
}());

