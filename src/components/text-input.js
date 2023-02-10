import Component from "../lib/component";
import html from "./text-input.html";

const textInput = new Component("text-input");

textInput.inner(html);
textInput.props("label", "");
textInput.data("value", "");
textInput.data("focus", false);

textInput.method("inputed", function(e){
	this.value = e.target.value;
});
textInput.method("focused", function(e){
	this.focus = true;
});
textInput.method("blured", function(e){
	this.focus = false;
});
textInput.method("isNotEmptyValue", function(e){
	return this.value !== "";
});

textInput.mounted(function(){
	this.refs.input.value = this.value;
});
