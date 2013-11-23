$(function () {
	$("#find-an-image").click(function () {
		console.log("Highlighting");
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				"highlight" : 1
			}, function (response) {
				// response handling
			});
		});
	});
});
