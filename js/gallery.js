
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
			
			setupCenteredMasonry();
			
			handler = $('#img-container');
			handler.isotope({
				itemSelector : 'div',
				layoutMode : 'masonry',
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
	
	function setupCenteredMasonry() {
	
	$.Isotope.prototype._getCenteredMasonryColumns = function() {
		this.width = this.element.width();

		var parentWidth = this.element.parent().width();

		var colW = this.options.masonry && this.options.masonry.columnWidth || // i.e. options.masonry && options.masonry.columnWidth

		this.$filteredAtoms.outerWidth(true) || // or use the size of the first item

		parentWidth; // if there's no items, use size of container

		var cols = Math.floor(parentWidth / colW);

		cols = Math.max(cols, 1);

		this.masonry.cols = cols; // i.e. this.masonry.cols = ....
		this.masonry.columnWidth = colW; // i.e. this.masonry.columnWidth = ...
	};

	$.Isotope.prototype._masonryReset = function() {

		this.masonry = {}; // layout-specific props
		this._getCenteredMasonryColumns(); // FIXME shouldn't have to call this again

		var i = this.masonry.cols;

		this.masonry.colYs = [];
			while (i--) {
			this.masonry.colYs.push(0);
		}
	};

	$.Isotope.prototype._masonryResizeChanged = function() {

		var prevColCount = this.masonry.cols;

		this._getCenteredMasonryColumns(); // get updated colCount
		return (this.masonry.cols !== prevColCount);
	};

	$.Isotope.prototype._masonryGetContainerSize = function() {

		var unusedCols = 0,

		i = this.masonry.cols;
			while (--i) { // count unused columns
			if (this.masonry.colYs[i] !== 0) {
				break;
			}
			unusedCols++;
		}

		return {
			height: Math.max.apply(Math, this.masonry.colYs),
			width: (this.masonry.cols - unusedCols) * this.masonry.columnWidth // fit container to columns that have been used;
		};
	};
	
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
		var shareButton = $("<div>").addClass("share").text("Share");

		overlay.append(removeButton).append(shareButton);
		
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

		$("body").css({"overflow":"hidden", "padding-right":"17px"});			

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
				$("body").css({"overflow":"auto", "padding-right":"0px"});
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
