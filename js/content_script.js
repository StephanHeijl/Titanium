jQuery(document).ready(function ($) {
	function addHighlighterToBody(event) {
		var highlighter = $("<div>");
		var highlighterData = $("<span>");

		highlighter.addClass("titanium-highlight");
		highlighterData.addClass("titanium-highlight-data");

		highlighter.append(highlighterData);

		$("body").append(highlighter);
		return highlighter
	}

	function setMoveHightlighterOnClick(highlighter) {
		highlighterData = highlighter.children("span")
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
	}

	function isUrlImage(url) {
		var extensions = [".jpg", ".png", ".gif", ".jpeg", ".tif", ".bmp", ".raw"];
		var foundExt = false;

		for (e in extensions) {
			ext = extensions[e];
			if (url.indexOf(ext) > 0) {
				foundExt = true;
				break;
			}
		}
		return foundExt
	}

	function checkImgElement(t) {
		// We'll look for a parent anchor on top of the img,
		// as these will often be links to larger versions of the image

		pu = t.parentsUntil("a");
		if (pu.length > 0) {
			anchor = pu.eq(pu.length - 1).parent();
		} else {
			anchor = t.parent();
		}

		if (anchor.prop("tagName") == "A") {
			return checkAnchorElement(anchor);
		} else {
			return t.attr("src");
		}
	}

	function checkAnchorElement(t) {
		// Check if the URL is an actual image.
		var href = t.attr("href");
		if (isUrlImage(href)) {
			return href;
		} else {
			return checkOtherElement(t);
		}
	}

	function checkOtherElement(t) {
		var img = t.find("img");
		if (img.length > 0) {
			return img.attr("src");
		} else {
			return getBackgroundImage(t);
		}
	}

	function getBackgroundImage(t) {
		var bgImg = t.css('background-image');
		bgImg = bgImg.replace('url(', '').replace(')', '');
		return bgImg;
	}

	function setHandleElementOnClick(sendResponse) {
		$("body").on("click", null, function (event) {
			event.preventDefault();

			var t = $(event.target);
			var imgUrl = "";

			if (t.prop("tagName") == "IMG") {
				imgUrl = checkImgElement(t);
			} else if (t.prop("tagName") == "A") {
				imgUrl = checkAnchorElement(t);
			} else {
				imgUrl = checkOtherElement(t);
			}

			if (imgUrl.length > 0 && imgUrl != "none") {
				console.log("Found: " + imgUrl)
				sendResponse({
					"imgUrl" : imgUrl
				});
			} else {
				alert("Could not retreive an image from this element.");
			}

			$(".titanium-highlight").remove()
			$("body").off("mouseover click", null);
		});
	}

	function waitForMessages() {
		chrome.runtime.onMessage.addListener(
			function (request, sender, sendResponse) {
			console.log(request);
			if (request.highlight == 1) {
			
				console.log("Highlighting element");
				highlighter = addHighlighterToBody();
				setMoveHightlighterOnClick(highlighter);
				setHandleElementOnClick(sendResponse);

			}
		});
	}

	waitForMessages()

});
