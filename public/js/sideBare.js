document.querySelector(".docs--bgSidebar").style.display = "none";

document.querySelector(".docs--bgSidebar").addEventListener("click", () => {
	document.querySelector(".docs--bgSidebar").style.display = "none";
	document.querySelector(".docs--sidebar").style.transform = "";
});

document.querySelector(".docs--topbarMenu").addEventListener("click", () => {
	document.querySelector(".docs--bgSidebar").style.display = "";
	document.querySelector(".docs--sidebar").style.transform = "translateX(0)";
});

document.querySelector(".docs--sidebar").querySelectorAll("a").forEach((items) => {
	items.addEventListener("click", (e) => {
		e.preventDefault();
		document.querySelector(".docs--bgSidebar").style.display = "none";
		document.querySelector(".docs--sidebar").style.transform = "";

		setTimeout(() => {
			document.querySelector(e.target.getAttribute("href")).scrollIntoView({behavior: "smooth"});
		}, 200);
	});
});
