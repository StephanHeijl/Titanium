function startListening() {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
		if (sender.tab) {
			console.log(request);
			
			if (typeof request == "undefined") {
				chrome.tabs.query({
					active : true,
					currentWindow : true
				}, function (tabs) {
					console.log("Send remove code to page!")
					chrome.tabs.sendMessage(tabs[0].id, {
						"flash" : 0
					});
				});
				
				return
			};

			saveImage(request.imgUrl);
			chrome.tabs.query({
				active : true,
				currentWindow : true
			}, function (tabs) {
				console.log("Send flash code to page!")
				chrome.tabs.sendMessage(tabs[0].id, {
					"flash" : 1
				});
			});
			chrome.runtime.onMessage.removeListener(arguments.callee);
		};
	});

}

function startHighlight() {
	startListening();
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function (tabs) {
		console.log("Send highlighting code to page!")
		chrome.tabs.sendMessage(tabs[0].id, {
			"highlight" : 1
		});
		console.log(chrome.runtime.lastError)
	});
}

function saveImage(url) {}
