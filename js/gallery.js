
$(function () {
	function addImages(handler, keys, start, n) {
		console.log(start, n, start+n);
		console.log(keys, keys.length);
		for( i=start; i < start+n && i < keys.length; i++) {
			console.log(i);
			
			var name = keys[i];
			console.log(name);
			
			chrome.storage.local.get(name, function(result) {
				console.log(name, result);
				for( name in result ) {
					if($(".isotope-item[name="+name+"]").length == 0 ) {
						data = result[name];
						
						var img = $("<img>");
						var linkContainer = $("<div>").addClass("new");
						img.attr("src", data["imagedata"]);
						img.attr("alt", name);
						linkContainer.attr("origin", data["origin"]);
						linkContainer.attr("name", name);
						linkContainer.append(img)

						handler.isotope('insert', linkContainer);
						
						console.log(linkContainer);
					}
				}
				
			});
				
		}
	}

	function loadGalleryImages() {
	
		function loadImages() {
			console.log("Loading the gallery");
			
			handler = $('#img-container');
			handler.isotope({
				itemSelector : 'div',
				layoutMode : 'masonry'
			});

			chrome.storage.local.get("keys", function (keys) {
				var s = 0;
				var n = 20;
				
				console.log( keys );
				keys = keys["keys"];
				
				console.log( keys );

				addImages(handler, keys, s, n);
				
				s = n;
				n = 10;
				
				$(document).scroll( function () {
					var vertPos = $(window).height() + $(this).scrollTop();
					if (vertPos + 200 > $(this).outerHeight()) {
						addImages(handler, keys, s, n);
						s+=n;
					}
				});
				
			});
		}
		
		loadImages();
		
		$("#tag-search").keyup(function() {
			var tags = $(this).val().replace(",").split(" ");
			var s = 0;
			var n = 20;
			if ($(this).val().length > 2 ) {
				console.log(tags)
				
				chrome.storage.local.get("tags", function (tresult) {
					console.log(tresult["tags"]);
					
					var keys = []
					
					for( na in tresult["tags"] ) {
						var name = tresult["tags"][na];
						if( getIntersect(tags, name ).length >= tags.length) {
							keys.push(na);
						}
					}
					
					
					$(".isotope-item").each(function() {
						
						var i = keys.indexOf($(this).attr("name"));
						
						if(i == -1 ) {
							handler.isotope('remove', $(this));
							console.log("Removing", $(this).attr("name"))
						} else {
						
							keys.splice(i, 1);
							
						}
					});	
					
					$(document).off("scroll");
					
					$(document).scroll( function () {
						var vertPos = $(window).height() + $(this).scrollTop();
						if (vertPos + 200 > $(this).outerHeight()) {
							addImages(handler, keys, s, n);
							s+=n;
						}
					});
					
					addImages(handler, keys, s, n);
					handler.isotope('reLayout');
					
					
				});
			} 
			
			if( $(this).val().length == 0 ) {
				handler.isotope('remove', $(".isotope-item"))
				loadImages();
			}
			
			
		});

	}
	
	function getIntersect(arr1, arr2) {
		var r = [], o = {}, l = arr2.length, i, v;
		for (i = 0; i < l; i++) {
			o[arr2[i]] = true;
		}
		l = arr1.length;
		for (i = 0; i < l; i++) {
			v = arr1[i];
			if (v in o) {
				r.push(v);
			} else {
				for( oo in o ) {
					if( oo.indexOf(v) > -1 ) {
						r.push(v);
					}
				}
			}
			
		}
		return r;
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
	
	chrome.storage.local.get(function(data) { console.log(data); });
	loadGalleryImages();
});
