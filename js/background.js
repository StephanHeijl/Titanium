function startListening() {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
		if (sender.tab) {
			if (request.imgUrl.length == 0) {
			} else {
				saveImage(request.imgUrl);
				chrome.tabs.query({
					active : true,
					currentWindow : true
				}, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {
						"flash" : 1
					});
				});
			}

			chrome.runtime.onMessage.removeListener(arguments.callee);

		}
	});
}

function startHighlight() {
	startListening();
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			"highlight" : 1
		});
		console.log(chrome.runtime.lastError)
	});
}

function saveImage(url) {}
