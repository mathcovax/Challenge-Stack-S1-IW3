import Component from "../lib/component";

const input = new Component("input");
input.method("test", function(){
	console.log(this);
});
input.props("title");
input.inner("<div>{{yes}}</div><div>{{yes}}</div>");
input.data("yes", "ok");

let h1 = document.querySelector("h1");
input.assign(h1);
console.log(h1._comp);
