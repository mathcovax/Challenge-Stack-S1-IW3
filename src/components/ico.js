import Component from "../lib/component";
import html from "./ico.html";

const listIco = {};
const ico = new Component("ico");
ico.inner(html);
ico.props("size", "24px");
ico.props("color", "#000");

ico.method("clicked", function(e){
	this.emit("click", e);
});

ico.mounted(async function (el){
	if(listIco[this.slotText] === undefined){
		listIco[this.slotText] = (await fetch("https://ico.campani.fr/" + this.slotText + ".svg")).text();
	}

	el.innerHTML = await listIco[this.slotText];
});
