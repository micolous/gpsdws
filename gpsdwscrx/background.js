var gpsd_port = null;
var listening_tabs = [];

gpsd_port_messageHandler = function(msg) {
	console.log('gpsd: ' + JSON.stringify(msg));
	
	if (msg['class'] == 'TPV') {
		// TODO: Reformat the JSON message consistently.
	
		listening_tabs.forEach(function(tab) {
			chrome.tabs.sendMessage(tab.id, msg);
		});
	}
};

gpsd_port_disconnectHandler = function(first_try) {
	var timeout = 0;
	if (first_try !== true) {
		console.log('gpsd: disconnected, trying to reconnect in 1s...');
		timeout = 1000;
	}

	setTimeout(function() {
		gpsd_port = chrome.runtime.connectNative('au.id.micolous.gpspipe');
		gpsd_port.onDisconnect.addListener(gpsd_port_disconnectHandler);
		gpsd_port.onMessage.addListener(gpsd_port_messageHandler);
	}, timeout);
};

gpsd_port_disconnectHandler(true);


chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.executeScript({
		file: "content_script.js",
		runAt: "document_start"
	});
	
	listening_tabs.push(tab);

});

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
	switch (msg.f) {
		case 'getCurrentPosition':
			console.log('getCurrentPosition ');
			setTimeout(function() {
				sendResponse({x: 4, y: 10});
				setTimeout(function() {
					sendResponse({x: 5, y: 12});
				}, 1000);
			}, 3000);

			return true;
	};			

});

