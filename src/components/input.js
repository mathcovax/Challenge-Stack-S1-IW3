import Component from "../lib/component";

const input = new Component("input");
input.method("test", function(){
	return "wow";
});
input.method("clicked", function(){
	console.log(this);
});
input.props("title");
input.inner(`
<div @click='clicked' classer="{'classTest': 'tt'}">{{yes}}</div>
<div if='tt'>{{test}}</div>
<div>{{test}}</div>
`);
input.data("yes", "ok");
input.data("tt", false);
