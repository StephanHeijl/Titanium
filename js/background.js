function startListening() {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
		if (sender.tab) {
			if (request.imgUrl.length == 0) {}
			else {
				saveImage(sender.url, request.imgUrl, request.tags);
				chrome.tabs.query({
					active : true,
					currentWindow : true
				}, function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {
						"flash" : 1
					});
				});
			}

			chrome.runtime.onMessage.removeListener(arguments.callee);
			console.log(request)
			if (request.repeatMode) {
				setTimeout(function () {
					console.log("Repeat!");
					startHighlight()
				}, 600);
			}

		}
	});
}

chrome.commands.onCommand.addListener(function (command) {
	console.log('Command:', command);
	if (command == "start_highlight") {
		startHighlight()
	}
});

function startHighlight() {
	startListening();
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			"highlight" : 1
		});
	});
}
function relativeToAbsolute(a, b) {
	var linkA = document.createElement('a');
	linkA.href = a;
	var linkB = document.createElement('a');
	linkB.href = b;
	return linkB.href.replace(linkB.host, linkA.host)
}

function encode_utf8(s) {
	return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
	return decodeURIComponent(escape(s));
}

function saveImage(origin, url, tags) {
	var name = String(md5(url));
	var urlSplit = url.split(".");
	console.log("Got:", url);
	if (url.indexOf("http") != 0) {
		if (url.indexOf("//") == 0) {
			url = "http:" + url;
		} else {
			url = relativeToAbsolute(origin, url);
		}
	}

	url = url.replace("chrome-extension://", "http://")

		console.log(url, name);

	var toStore = {}
	toStore[name] = {
		"date" : new Date().getTime(),
		"origin" : url,
		"tags" : tags
	};

	var img = new Image();
	img.src = url;

	img.onload = function () {
		var canvas = document.createElement("canvas");
		canvas.height = img.height;
		canvas.width = img.width;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		toStore[name]["imagedata"] = canvas.toDataURL();

		chrome.storage.local.get("keys", function (result) {
			console.log(result, name, typeof result);
			if (typeof result == "undefined" || typeof result["keys"] == "undefined" || result["keys"].length == 0) {
				var newKeys = {
					"keys" : [name]
				};
			} else {
				result["keys"].push(name);
				var newKeys = {
					"keys" : result["keys"]
				};
				console.log(newKeys);
			}
			console.log(newKeys);
			chrome.storage.local.set(newKeys);
		})

		chrome.storage.local.set(toStore);

	}
}
