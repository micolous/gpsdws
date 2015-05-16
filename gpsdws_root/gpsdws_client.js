/*
 * gpsdws_client.js
 * Client library in JavaScript for gpsdws.
 * Copyright 2015 Michael Farrell <micolous+git@gmail.com>
 *
 * This library is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this library.  If not, see <http://www.gnu.org/licenses/>.
 */


var GPSdWSClient = (function() {
	function delegate(that, thatMethod) { return function() { return thatMethod.apply(that, arguments); } }

	var _uri;
	var _socket;
	var _verbose;
	
	function GPSdWSClient(uri, verbose) {
		_uri = uri;

		if (verbose === undefined) {
			verbose = false;
		}

		_verbose = verbose;
	};
	
	GPSdWSClient.prototype.hasWebsockets = function() {
		return window.WebSocket != null || window.MozWebSocket != null;
	};
	
	GPSdWSClient.prototype.connect = function() {
		if (window.MozWebSocket != null) {
			// firefox <= 10.0
			_socket = new MozWebSocket(_uri);
		} else {
			_socket = new WebSocket(_uri);
		}

		_socket.onopen = delegate(this, this.onConnect);
		_socket.onclose = delegate(this, this.onDisconnect);
		_socket.onmessage = delegate(this, this.handleMessage);
	};
	
	GPSdWSClient.prototype.onConnect = function() {
		console.log('GPSdWSClient: Connected to server ' + _uri);
	};
	
	GPSdWSClient.prototype.onDisconnect = function(e) {
		console.log("GPSdWSClient: connection closed (" + e.code + ")");
	};
	
	GPSdWSClient.prototype.handleMessage = function(e) {
		msg = JSON.parse(e.data);
		
		if (this._verbose) {
			console.log('GPSdWSClient: recieved server event: ' + msg['class'] + '(' + JSON.stringify(msg) + ')');
		}
		
		// http://www.catb.org/gpsd/gpsd_json.html
		switch (msg['class']) {
			case 'TPV':
				if (msg.mode >= 2 && msg.lat !== undefined && msg.lon !== undefined) {
					// have a fix
					this.onLocation(msg);
				}
				break;

			// TODO: Support other messages.
/*			default:
				console.log('GPSdWSClient: Unhandled event type (' + msg['class'] + ')');
				break;
*/
		}
	};
	
	GPSdWSClient.prototype.onLocation = function(msg) {
		if (this._verbose) {
			console.log('GPSdWSClient: ' + msg.lat + ',' + msg.lon + ' ' + (msg.alt !== undefined ? ('@' + msg.alt + ' metres') : ''));
		}
	};

	return GPSdWSClient;
})();

