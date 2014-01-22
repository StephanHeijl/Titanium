$(function () {
	$("#find-an-image").click(function () {
		chrome.runtime.getBackgroundPage(function( bg ) {
			console.log("Starting highlight")
			bg.startHighlight();
			window.close();
		});
		
	});
	
	$("#show-gallery").click(function() {
		chrome.tabs.create({"url":"gallery.htm"});
	});
	
	$("#share-an-image").click(function() {
		alert(checkAuth());
	});
});

function saveImage( url ) {
	console.log(url);
}