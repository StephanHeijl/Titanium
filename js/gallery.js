
function loadGallery() {
	console.log("Loading the gallery");
	chrome.storage.local.get(function (images) {
		console.log(images);

		$.each(images, function (name, data) {
			console.log(name);
			var img = "<a href='%s'><img src='data:%s;base64,%s' alt='%s' /></a>";
			console.log(img);
			img = sprintf(img, data["origin"], data["type"], data["imagedata"], name);
			console.log("appending img");
			console.log(img);
			$("#img-container").append(img);
		});
	});
}

$(function () {
	console.log("Hey");
	loadGallery();
});
