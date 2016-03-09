var gpsd_port = null

gpsd_port_messageHandler = function(msg) {
	console.log('gpsd: ' + JSON.stringify(msg));
};

gpsd_port_disconnectHandler = function(first_try) {
	if (first_try !== true) {
		console.log('gpsd: disconnected, trying to reconnect in 1s...');
	}

	setTimeout(function() {
		gpsd_port = chrome.runtime.connectNative('au.id.micolous.gpspipe');
		gpsd_port.onDisconnect.addListener(gpsd_port_disconnectHandler);
		gpsd_port.onMessage.addListener(gpsd_port_messageHandler);
	}, 1000);
};

gpsd_port_disconnectHandler(true);


chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript({
		file: "content_script.js",
		runAt: "document_start"
	});

});

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
	switch (msg.f) {
		case 'getCurrentPosition':
			console.log('getCurrentPosition ');
			setTimeout(function() {
				sendResponse({x: 4, y: 10});
			}, 3000);

			return true;
	};			

});

