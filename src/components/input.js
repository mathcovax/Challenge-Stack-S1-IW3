import Component from "../lib/component";

const input = new Component("input");
input.inner(html);

input.props("title");

input.data("yes", "ok");
input.data("tt", false);

input.method("test", function(){
	this.title;
	
	return "wow";
});

input.method("clicked", function(){
	console.log(this);
});


