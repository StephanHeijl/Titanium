$(function () {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
		console.log(request);
		if (request.highlight == 1) {
			var highlighter = $("<div>");
			var highlighterData = $("<span>");

			highlighter.addClass("titanium-highlight");
			highlighterData.addClass("titanium-highlight-data");

			highlighter.append(highlighterData);

			$("body").append(highlighter);

			console.log("Highlighting element");
			$("body").on("mouseover", null, function (event) {
				var t = $(event.target);
				var offset = t.offset();
				highlighter.css({
					"width" : t.outerWidth(),
					"height" : t.outerHeight(),
					"left" : offset.left,
					"top" : offset.top
				});

				var tagName = t.prop("tagName");
				if (tagName == "A" || tagName == "IMG") {
					highlighter.css({
						"border-color" : "#2E7EFF"
					});
					highlighterData.css({
						"background-color" : "#2E7EFF"
					});
				} else {
					highlighter.css({
						"border-color" : "#333"
					});
					highlighterData.css({
						"background-color" : "#333"
					});
				}

				highlighterData.html("<b>" + tagName + "</b> ")
				if (typeof t.attr("src") !== 'undefined' && t.attr("src") !== false) {
					highlighterData.append("src: " + t.attr("src") + " ")
				}

				if (typeof t.attr("href") !== 'undefined' && t.attr("href") !== false) {
					highlighterData.append("href: " + t.attr("href") + " ")
				}

			});

			$("body").on("click", null, function (event) {
				event.preventDefault();

				var t = $(event.target);
				var imgUrl = "";

				if (t.prop("tagName") == "IMG") {
					// We'll look for a parent anchor on top of the img,
					// as these will often be links to larger versions of the image

					pu = t.parentsUntil("a");
					anchor = pu.eq(pu.length - 1).parent();
					console.log(pu);
					console.log(anchor);

					if (anchor.prop("tagName") != "A") {

						// We don't want to save the link if it's not an image, so we check whether it contains
						// one of these common image extensions
						var href = anchor.attr("href");
						var extensions = [".jpg", ".png", ".gif", ".jpeg", ".tif", ".bmp", ".raw"];
						var foundExt = false;

						for (e in extensions) {
							ext = extensions[e];
							if (href.indexOf(ext) > 0) {
								imgUrl = href;
								foundExt = true;
								break;
							}
						}
						if (!foundExt) {
							imgUrl = t.attr("src");
						}
					} else {
						imgUrl = t.attr("src");
					}
				} else if (t.prop("tagName") == "A") {
					// Same logic as before, except we'll stop if we can't find anything we can use.
					var href = t.attr("href");
					var extensions = [".jpg", ".png", ".gif", ".jpeg", ".tif", ".bmp", ".raw"];
					var foundExt = false;

					for (e in extensions) {
						ext = extensions[e];
						if (href.indexOf(ext) > 0) {
							imgUrl = href;
							foundExt = true;
							break;
						}
					}
					if (!foundExt) {
						// We can get the element background, if there is one...
						var bgImg = t.css('background-image');
						console.log(bgImg);
						bgImg = bgImg.replace('url(', '').replace(')', '');
						imgUrl = bgImg;
					}
				} else {
					// We can get the element background, if there is one...
					var bgImg = t.css('background-image');
					console.log(bgImg);
					bgImg = bgImg.replace('url(', '').replace(')', '');
					
					imgUrl = bgImg;
				}

				console.log(imgUrl)
				if (imgUrl.length > 0 && imgUrl != "none") {
					sendResponse({
						"imgUrl" : imgUrl
					});
				} else {
					alert("Could not retreive an image from this element.");
				}

				//$(".titanium-highlight").remove()
				$("body").off("mouseover click", null);
			});
		}
	});
});
