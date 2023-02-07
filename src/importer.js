window.stop();
document.documentElement.innerHTML = document.documentElement.innerHTML + "<body></body>";
document.body.innerHTML = "test";

(async () => {
	let arr = [];
	for (let index = 0; document.currentScript.getAttribute("lib-" + index) !== null; index++) {
		let script = document.createElement("script");
		script.type = "module";
		script.src = document.currentScript.getAttribute("lib-" + index);
		arr.push(
			new Promise((resolve) => {
				script.onload = resolve;
			})
		);
		document.head.append(script);
	}

	await Promise.all(arr);

	// const page = new DOMParser()
	// .parseFromString(
	// 	await (await fetch(window.location.href)).text(), 
	// 	"text/html"
	// );
	
	
	// const iframe = document.createElement("object");
	// document.body.append(iframe);

	// iframe.contentDocument.body.replaceWith(body);
	
})();


