var port = chrome.runtime.connect();



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

