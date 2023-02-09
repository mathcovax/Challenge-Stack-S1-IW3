import Component from "../lib/component";
import html from "./ico.html";

const ico = new Component("ico");
ico.inner(html);
ico.props("size", "24px");

ico.method("clicked", function(e){
	this.emit("click", e);
});

ico.mounted(async function (el){
	el.innerHTML = await (await fetch("https://ico.campani.fr/" + this.slotText + ".svg")).text();
});
