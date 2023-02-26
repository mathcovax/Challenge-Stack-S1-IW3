export default function register(arr){
	for(const link of arr){
		if(link === "")continue;
		const request = new XMLHttpRequest();
		request.open("GET", link, false);
		request.send(null);
		const document = new DOMParser().parseFromString(request.responseText, "text/html");
		let inner = document.body.children[0];
		eval(document.body.children[1].innerHTML);
		window.document.head.append(document.body.children[2]);
	}
}
