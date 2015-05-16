/*
 * gpsdws_simple.js
 * Test program for gpsdws in JavaScript.
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

var gpsdws = null;

function gpsdws_simple_test(latId, lngId) {
	gpsdws = new GPSdWSClient('wss://localhost:8947/gpsdws');

	if (!gpsdws.hasWebsockets()) {
		alert('no websockets :(');
	} else {
		var lat = document.getElementById(latId);
		var lng = document.getElementById(lngId);

		gpsdws.onDisconnect = function(e) {
			console.log('Connection failed, reconnecting...');
			setTimeout('gpsdws.connect()', 1000);
		};

		gpsdws.onLocation = function(msg) {
			lat.innerText = msg.lat;
			lng.innerText = msg.lon;
		};

		gpsdws.connect();
	}
}

