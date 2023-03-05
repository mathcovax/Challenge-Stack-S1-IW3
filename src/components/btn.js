import Component from "../lib/component";
import html from "./btn.html";

const btn = new Component("btn");
btn.inner(html);
btn.data("circleTop", "0px");
btn.data("circleLeft", "0px");
btn.data("active", false);

btn.method("clicked", function(e){
	this.circleLeft = e.offsetX + "px";
	this.circleTop = e.offsetY + "px";
	this.active = true;
	if(this.onclick)this.onclick(e);
	else if(this.tag.onclick)this.tag.onclick(e);
	
});

btn.mounted(function(){
	this.refs.circle.addEventListener("animationend", () => {
		this.active = false;
	});
});
