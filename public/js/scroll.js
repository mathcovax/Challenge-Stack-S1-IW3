const headerHeight = 72;

document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();

		var target = document.querySelector(this.getAttribute("href"));
		var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

		window.scrollTo({
			top: targetPosition,
			behavior: "smooth"
		});
	});
});

window.addEventListener("load", function () {
	if (window.location.hash) {
		var target = document.querySelector(window.location.hash);
		var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

		window.scrollTo({
			top: targetPosition,
			behavior: "smooth"
		});
	}
});
