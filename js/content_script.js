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

	function setHandleElementOnClick(highlighter) {
		// Rightclick
		$("body").on("contextmenu", null, function (event) {
			event.preventDefault();
			$("body").off("mouseover click contextmenu", null);
			highlighter.remove();
		});

		// Leftclick
		$("body").on("click", null, function (event) {
			event.preventDefault();

			var shiftWasHeld = event.shiftKey;

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
				
				// Now, let's get us some tags
				var tags = getImageTags(t);
				
				chrome.runtime.sendMessage({
					"imgUrl" : imgUrl,
					"repeatMode" : shiftWasHeld,
					"tags": tags
				});
			} else {
				highlighter.animate({
					"opacity" : "0",
					"marginTop" : "10px"
				}, 1000);
				chrome.runtime.sendMessage({
					"imgUrl" : "",
					"repeatMode" : shiftWasHeld,
					"tags": ""
				});
			}

			$("body").off("mouseover click contextmenu", null);

		});
	}

	function doFlashSaveEffect(element, callback) {
		var flash = $("<div>")
			.attr('class', 'background')
			.css({
				backgroundColor : 'white',
				position : 'absolute',
				top : 0,
				left : 0,
				zIndex : 999,
				width : element.width(),
				height : element.height(),
				padding : '10px'
			});

		element.append(flash);
		element.addClass("notransition").height();
		element.animate({
			"padding" : "0px",
			"marginTop" : "-3px",
			"marginLeft" : "-3px"
		}, 50);
		flash.animate({
			"padding" : "0px"
		}, 50);
		flash.animate({
			"opacity" : "0"
		}, 1200, function () {
			callback();
		});
	}
	
	function countWords(text) {
		commonWordsEN = ["the","be","and","of","off","had","used","a","in","to","have","to","it","I","that","for","you","he","with","on","do","say","this","they","at","but","we","his","from","that","not","can't",,"by","she","or","as","what","go","their","can","who","get","if","would","her","all","my","make","about","know","will","as","up","one","time","there","year","so","think","when","which","them","some","me","people","take","out","into","just","see","him","your","come","could","now","than","like","other","how","then","its","our","two","more","these","want","way","look","first","also","new","because","day","more","use","no","man","find","here","thing","give","many", "jpg", "png", "gif", "tif", "anonymous", "thread", "mon", "file", "utc", "are", "post","return", "replies", "images", "only", "", "reply","page","change","posted","image","settings","password","owned","poster","falsehood","posting"];
		commonWordsNL = ["de","van","in","het","een","en","is","op","zijn","met","hij","te","voor","werd","die","door","was","als","aan","dat","uit","ook","bij","tot","er","wordt","naar","deze","om","of","ze","niet","worden","maar","dit"];
		
		commonWords = commonWordsEN.concat(commonWordsNL);

		words = text.split(" ");
		wordcount = {}
		for( w in words) {
			if ( words[w] in wordcount ) {
				wordcount[words[w]]++;
			} else {
				if (words[w].length > 2 && commonWords.indexOf(words[w] ) < 0) {
					wordcount[words[w]] = 1;
				}
			}
		}
		
		var sortable = [];
		for (var word in wordcount)
			  sortable.push([word, wordcount[word]])
		sortable.sort(function(a, b) {return b[1] - a[1]})
		
		return sortable;
	}
	
	function getImageTags(t) {
		var text = getAllTextOnPage().toLowerCase().replace(/\s{2,}/g, " ").replace(/[^a-z\s]/g,"");
		var tags = countWords(text).slice(0,25);

		var ntags = [];
		for( tag in tags ) {
			ntags.push(tags[tag][0]);
		}
		
		console.log(ntags);
		return ntags;
	}

	function getTextNodesIn(el) {
		return $(el).find("div, span, article, p, blockquote").addBack().contents().filter(function () {
			return this.nodeType == 3;
		});
	};
	
	function getAllTextOnPage() {
		var tn = getTextNodesIn("body").slice(0,750);
		var text = []
		for( n in tn) {
			//console.log(tn[n]);
			text.push(tn[n].nodeValue);
		}
		
		return text.join(" ");
	}
	
	function getCommonParentsDepth( a, b ) {
		return a.parents().has(b).first().parents().length;
	}
	

	function waitForMessages() {
		highlighters = [];
		chrome.runtime.onMessage.addListener(
			function (request, sender, sendResponse) {
			console.log(request);
			if ("highlight" in request && request.highlight == 1) {
				console.log("Highlighting element");
				highlighters.push(addHighlighterToBody());
				setMoveHightlighterOnClick(highlighters[highlighters.length - 1]);
				setHandleElementOnClick(highlighters[highlighters.length - 1]);
				

			} else if ("flash" in request && request.flash == 1) {
				doFlashSaveEffect(highlighters[0], function () {
					highlighters[0].remove()
					highlighters.splice(0, 1);
				});
			}
		});
	}

	console.log("Started")
	waitForMessages()

});
