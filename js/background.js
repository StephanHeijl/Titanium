$(function () {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			console.log("Got a message :O");
			console.log(request);
			chrome.tabs.query({
				active : true,
				currentWindow : true
			}, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					"highlight" : 1
				}, function (response) {
					console.log("Got response :D");
					console.log(response);					
					sendResponse(response);
				});
			});
	});
});
