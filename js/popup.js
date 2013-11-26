$(function () {
	$("#find-an-image").click(function () {
		chrome.runtime.getBackgroundPage(function () {
			chrome.runtime.sendMessage(
				null,
				{
					"highlight" : 1
				},
				function (response) {
					console.log(chrome.runtime.lastError);
					console.log("Got response :D");
					console.log(response);
					console.log(response.imgUrl);
				}
			);
		});
	});
});
