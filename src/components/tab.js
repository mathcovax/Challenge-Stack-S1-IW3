import Component from "../lib/component";
import html from "./tab.html";

const tab = new Component("tab");
tab.inner(html);

tab.props("tab", "");
tab.data("tabs", []);
tab.data("slider", {});

tab.method("tabClicked", function(event){
	this.slider = {
		width: event.target.offsetWidth + "px",
		left: event.target.offsetLeft+ "px"
	};
	this.tab = event.target.arr;
});
tab.method("isHidden", function(tab){
	return this.tab !== tab.getAttribute("name");
});
tab.method("isHightLight", function(tab){
	return this.tab === tab.arr;
});

tab.method("sliderWidth", function(el){
	return this.slider.width || "";
});
tab.method("sliderLeft", function(el){
	return this.slider.left || "";
});

tab.mounted(function(){
	this.tab = this.slot[0].getAttribute("name");

	for(const slot of this.slot){
		this.classer(
			slot,
			{
				"hide": "isHidden"
			}
		);
		this.tabs = [
			...this.tabs,
			slot.getAttribute("name")
		];
	}

	window.addEventListener("resize", () => this.tabClicked({target: this.refs.tabs.forChild[0]}));
	setTimeout(() => this.tabClicked({target: this.refs.tabs.forChild[0]}), 5);
});
