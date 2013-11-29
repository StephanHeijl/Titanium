
function loadGallery(callback) {
	console.log("Loading the gallery");
	chrome.storage.local.get(function (images) {
		console.log(images);

		$.each(images, function (name, data) {
			var img = $("<img>");
			var linkContainer = $("<a>");
			img.attr("src", data["imagedata"]);
			linkContainer.attr("href", data["origin"]);

			linkContainer.append(img)

			$("#img-container").append(linkContainer);
		});

		callback()
	});
}

$(function () {
	console.log("Hey");
	loadGallery(function () {
		console.log("isotope");
		handler = $('#img-container');

		handler.isotope({
			// options
			itemSelector : 'a',
			layoutMode : 'masonry'
		});
	});
});
