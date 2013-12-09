
$(function () {
	function addImages(handler, keys, start, n) {
		console.log(start, n);
		for( i=start; i < start+n && i < keys.length; i++) {
				var name = keys[i];
				
				chrome.storage.local.get(name, function(result) {
					
					for( name in result ) {
						data = result[name];
						
						console.log(data["tags"]);
						var img = $("<img>");
						var linkContainer = $("<div>").addClass("new");
						img.attr("src", data["imagedata"]);
						img.attr("alt", name);
						linkContainer.attr("origin", data["origin"]);
						linkContainer.attr("name", name);
						linkContainer.attr("tags", data["tags"]);
						linkContainer.append(img)

						handler.isotope('insert', linkContainer);
					}
					
				});
				
		}
	}

	function loadGalleryImages() {
		console.log("Loading the gallery");
		
		handler = $('#img-container');
		handler.isotope({
			itemSelector : 'div',
			layoutMode : 'masonry'
		});

		chrome.storage.local.get("keys", function (keys) {
			var s = 0;
			var n = 20;
			keys = keys["keys"];
			
			console.log("got me some keys", keys );

			addImages(handler, keys, s, n);
			
			s = n;
			n = 10;
			
			$(document).scroll(function () {
				var vertPos = $(window).height() + $(this).scrollTop();
				if (vertPos + 200 > $(this).outerHeight()) {
					addImages(handler, keys, s, n);
					s+=n;
				}
				
			});
			
		});
		
		$("#tag-search").keyup(function() {
			var tags = $(this).val().replace(",").split(" ");
			var selector = ".isotope-item";
			if ($(this).val().length > 0 ) {
				console.log(tags)
				
				for( t in tags ) {
					selector += "[tags*='" + tags[t] + "']";
				}
			}
			console.log(selector);
			
			handler.isotope({ filter: selector });
		});

	}

	$("#img-container").on("contextmenu", ".isotope-item:not(.selected)", function (event) {
		event.preventDefault();
		
		$(this).addClass("selected")

		var overlay = $("<div>").addClass("overlay");
		var removeButton = $("<div>").addClass("remove").text("Remove");
		var closeButton = $("<div>").addClass("close").text("Close");

		overlay.append(removeButton).append(closeButton);

		closeButton.click(function () {
			$(this).parent().remove();
		})

		$(this).append(overlay)
	});
	
	$("#img-container").on("contextmenu", ".isotope-item.selected", function (event) {
		event.preventDefault();
		$(this).removeClass("selected")
		$(this).children(".overlay").remove();
	});

	$("#img-container").on("click", ".isotope-item img", function (event) {
		event.preventDefault();
		var cont = $(this).parent();
		
		var offset = cont.offset()

			$("body").css("overflow", "hidden");

		var box = cont.clone().addClass("box").css({
				"top" : offset.height,
				"line-height" : $(window).height() + "px",
				"height" : $(window).height() + "px",
				"opacity" : 0
			});
		$("body").append(box)
		box.animate({
			"opacity" : 1
		}, 300);
		box.click(function () {
			box.fadeOut(200, function () {
				$(this).remove();
				$("body").css("overflow", "auto");
			});
		});
	});
	
	$("#img-container").on("click", ".isotope-item .remove", function (event) {
		var cont = $(this).parents(".isotope-item");
		chrome.storage.local.remove(cont.attr("name"));
		cont.remove();
		handler.isotope( 'reLayout' )
	});
	
	//chrome.storage.local.get(function(data) { console.log(data); });
	loadGalleryImages();
});
