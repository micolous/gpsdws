/*
 * shim.js
 * Replaces the HTML5 Geolocation API with a version which listens to messages
 * from the content_script.
 *
 * Structure adapted from:
 * https://dl.dropboxusercontent.com/u/577031/mocklocation/mocklocation.js
 */
(function() {
	var LocationShim = function() { /* private */
		var sequence = 0, watches = {};

		var notify = function(data) {
			Object.keys(watches).forEach(function(id) {
				var watch = watches[id];

				if (!watch.enabled) {
					return;
				}

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

			//console.log('shim: got ' + JSON.stringify(event.data));
			notify(event.data);
		});

		this.addWatch = function(once, success, error, options) {
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
			shim.addWatch(true, success, error, options);
		};
		
		geolocation.watchPosition = function(success, error, options) {
			return shim.addWatch(false, success, error, options);
		};

		geolocation.clearWatch = function(id) {
			shim.clearWatch(id);
		};
	};

	LocationShim.override(navigator.geolocation);
	console.log('LocationShim installed');

	// Show a toast in the browser, to prove we are installed.
	var toast = document.createElement('div');
	toast.textContent = 'Location shim installed.';
	toast.style.position = 'fixed';
	toast.style.top = toast.style.left = toast.style.right = 0;
	toast.style.textAlign = 'center';
	toast.style.zIndex = 99999;
	toast.style.backgroundColor = '#ffb';
	toast.style.color = '#333';
	toast.style.fontWeight = 'bold';
	toast.style.fontFamily = 'sans-serif';
	toast.style.fontSize = '30px';
	toast.style.padding = '5px';

	document.body.appendChild(toast);
	setTimeout(function() {
		document.body.removeChild(toast);
	}, 5000);
}());

