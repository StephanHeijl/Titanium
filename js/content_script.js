$(function () {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
		console.log(request);
		if (request.highlight == 1) {
			console.log("Highlighting element");
			
			document.body.addEventListener("mouseover", t, false);
			
			
			$("body *").click(function (event) {
				event.preventDefault();
				$(".titanium-highlight").removeClass("titanium-highlight");
				console.log($(this));
				$("body").off("mouseleave", "*");
				$("body").off("mouseover", null);
			});
		}
	});
	
	var e;
	
	function t(t) {
		if (t.target === document.body || e && e === t.target) {
			return
		}
		if (e) {
			//$(e).removeClass("titanium-highlight");
			//$(".titanium-highlight").remove()
			e.style.border = ""
			e = undefined
		}
		if (t.target) {
			e = t.target;
			$(e).append("<div class='titanium-highlight'></div>");
			console.log($(e));
			e.style.border = "1px solid blue"
		}
	}
});
