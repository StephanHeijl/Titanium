
$(function () {
	function addImages(handler, images, start, n) {
		var i = 0;
		$.each(images, function (name, data) {
			if (i >= start && i < n) {
				console.log(name, i)
				var img = $("<img>");
				var linkContainer = $("<div>").addClass("new");
				img.attr("src", data["imagedata"]);
				linkContainer.attr("href", data["origin"]);
				linkContainer.append(img)

				handler.isotope('insert', linkContainer);

				i++;
				delete images[name];
			}
		});

		return images
	}

	function loadGalleryImages() {
		console.log("Loading the gallery");
		handler = $('#img-container');
		handler.isotope({
			itemSelector : 'div',
			layoutMode : 'masonry'
		});

		chrome.storage.local.get(function (images) {
			var s = 0;
			var n = 10;

			images = addImages(handler, images, s, n, function () {});

			$(document).scroll(function () {
				var vertPos = $(window).height() + $(this).scrollTop();
				if (vertPos + 200 > $(this).outerHeight()) {
					images = addImages(handler, images, s, n, function () {});
				}
			});
		});

	}
	
	$("#img-container").on("rightclick",".isotope-item", function(event) {
		event.preventDefault();
		$(this).css("border-color","#bbb");
	});	
	
	$("#img-container").on("click",".isotope-item", function(event) {
		event.preventDefault();
		var offset = $(this).offset()
		
		var box = $(this).clone().addClass("box").css({"top":offset.height, "line-height":$(window).height()+"px", "height":$(window).height()+"px"});
		$("body").append(box);
		box.click(function() {
			$(this).remove();
		});
	});
	
	loadGalleryImages();
});
