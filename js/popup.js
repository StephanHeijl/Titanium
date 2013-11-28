$(function () {
	$("#find-an-image").click(function () {
		chrome.runtime.getBackgroundPage(function( bg ) {
			console.log("Starting highlight")
			bg.startHighlight();
		});
		
	});
	
	$("#show-gallery").click(function() {
		chrome.tabs.create({"url":"gallery.htm"});
	});
});

function saveImage( url ) {
	console.log(url);
}