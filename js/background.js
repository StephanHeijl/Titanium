function startListening() {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
		if (sender.tab) {
			if (request.imgUrl.length == 0) {}
			else {
				saveImage(sender.url, request.imgUrl);
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

		}
	});
}

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

function saveImage(origin, url) {
	var name = String(md5(url));
	var urlSplit = url.split(".");

	if (url.indexOf(origin) < 0) {
		url = relativeToAbsolute(origin, url);
	}

	url = url.replace("chrome-extension://", "http://")

		console.log(url, name);

	var toStore = {}
	toStore[name] = {
		"date" : new Date().getTime(),
	};

	$.ajax({
		type : "GET",
		url : url,
		data : "",
		success : function (imageData, status, xhr) {
			var ct = xhr.getResponseHeader("content-type") || "";

			toStore[name]["type"] = ct;
			toStore[name]["imagedata"] = btoa(encode_utf8(imageData));
			chrome.storage.local.set(toStore);

		}
	});
}

function loadGallery() {

	chrome.storage.local.get(name, function (data) {
		var img = "<img src='data:%s;base64,%s' alt='%s' />";
		var img = sprintf(img, data[name]["type"], data[name]["imagedata"], name);
		console.log("appending img");
		console.log(img);
	});

}
