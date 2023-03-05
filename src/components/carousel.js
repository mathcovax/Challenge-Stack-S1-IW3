import Component from "../lib/component";
import html from "./carousel.html";

const carousel = new Component("carousel");
carousel.inner(html);

carousel.props("duration", "500ms");
carousel.data("index", 0);

carousel.method("isHidden", function(img){
	return this.index !== Number(img.index);
});
carousel.method("right", function(){
	this.index = this.index + 1 > this.slot.length-1? 0 : this.index + 1;
});
carousel.method("left", function(){
	this.index = this.index - 1 < 0? this.slot.length-1 : this.index - 1;
});

carousel.mounted(function(){
	for(const [index, slot] of Object.entries(this.slot)){
		slot.index = index;
		this.classer(
			slot, 
			{
				"hide": "isHidden",
			}
		);
		slot.setAttribute("draggable", false);
	}
});
