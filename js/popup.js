$(function () {
	$("#find-an-image").click(function () {
		chrome.runtime.getBackgroundPage(function( bg ) {
			console.log("Starting highlight")
			bg.startHighlight();
		});
		
	});
});

function saveImage( url ) {
	console.log(url);
}