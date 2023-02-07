export default class Component{
	constructor(name){
		Component.components[name] = this;
	}

	#props = [];
	props(name){
		this.#props.push(name);
	}

	#data = {
		
	};
	data(name, value){
		this.#data[name] = value;
	}

	#inner;
	inner(value){
		this.#inner = typeof value === "object"? value.outerHTML : value; 
	}

	#watch = {
		
	};
	watch(name, fnc){
		if(this.#watch[name] === undefined) this.#watch[name] = [];
		this.#watch[name].push(fnc);
	}
	
	method(name, fnc){
		this.#methods[name] = fnc;
	}

	#mounted = () => {};
	mounted(fnc){
		this.#mounted = fnc;
	}

	#methods = {
		
	};

	assign(tag){
		let porter = document.createElement("div");
		porter.innerHTML = this.#inner;
		const el = porter.firstChild;
		
		for(let index = 0; index < tag.attributes.length; index++){
			el.attributes.setNamedItem(tag.cloneNode().attributes.removeNamedItem(tag.attributes.item(index).name));
		}

		el._comp = {
			get el(){
				return el;
			},
			child_text: [],
			child_if: [],
			child_classer: [],
			refresh(){
				for(const child of this.child_text){
					child.textContent = child.originTextContent.replace(
						/\{\{(.*?)\}\}/g,
						(tag, index) => {
							if(typeof this[index] === "function")return this[index]();
							else return this[index];
						}
					);
				}

				for(const child of this.child_if){
					let cdn = typeof this[child.if] === "function"? 
						this[child.if]() === false : 
						this[child.if] === false;
					if(cdn){
						child.style.display = "none";
					}
					else {
						child.style.display = "";
					}
				}

				for(const child of this.child_classer){
					try{
						for(const [cls, index] of Object.entries(child.classer)){
							for(const cl of cls.split(" ")){
								child.classList.toggle(cl, typeof this[index] === "function"? this[index]() : this[index]);
							}
						}
					}
					catch(e){
						console.error(e);
					}
				}
			},
			data : {},
			slot: el.innerHTML
		};

		el.innerHTML = "";

		for(const [index, fnc] of Object.entries(this.#methods)){
			Object.defineProperty(
				el._comp,
				index,
				{
					get: () => {
						return fnc.bind(el._comp);
					}
				}
			);
		}

		for(const props of this.#props){
			Object.defineProperty(
				el._comp,
				props,
				{
					get: () => {
						return el.getAttribute(props);
					},
					set: (arg) => {
						el.setAttribute(props, arg);
					}
				}
			);
		}

		for(const [index, data] of Object.entries(this.#data)){
			el._comp.data[index] = data;
			Object.defineProperty(
				el._comp,
				index,
				{

					get: () => {
						return el._comp.data[index];
					},

					set: (arg) => {
						let old = el._comp.data[index];
						el._comp.data[index] = arg;
						el._comp.refresh();
						for(const watch of this.#watch[data] || []){
							watch.call(this, arg, old);
						}
					}
				}
			);
		}
		
		
		(function find(elo){
			for(const child of elo.children){
				for(const event of Component.events){
					if(child.getAttribute(event.attr) !== null){
						child[event.fnc] = el._comp[child.getAttribute(event.attr)];
						child.removeAttribute(event.attr);
					}
				}

				if(child.getAttribute("if") !== null){
					child.if = child.getAttribute("if");
					child.removeAttribute("if");
					el._comp.child_if.push(child);
				}

				if(child.getAttribute("classer") !== null){
					child.classer = JSON.parse(child.getAttribute("classer").replace(/\'/g, "\""));
					child.removeAttribute("classer");
					el._comp.child_classer.push(child);
				}

				if(/\{\{(.*?)\}\}/.test(child.textContent)){
					child.originTextContent = child.textContent;
					el._comp.child_text.push(child);
				}

				find(child);
			}

		}).call(this, el);

		el._comp.refresh();

		while(div.firstChild){
			el.append(div.firstChild);
		}

		this.#mounted.call(el._comp, el);

	}

	static components = {

	};

	static events = [
		{
			attr: "@click",
			fnc: "onclick"
		},
		{
			attr: "@focus",
			fnc: "onfocus"
		},
		{
			attr: "@blur",
			fnc: "onblur"
		},
		{
			attr: "@submit",
			fnc: "onsubmit"
		},
		{
			attr: "@input",
			fnc: "oninput"
		},
	];
}



export function getComp(query){
	const el = document.querySelector(query);
	if(el._comp === undefined)Component.components[el.getAttribute("comp")].assign(el);
	return el._comp;
}


document.addEventListener("DOMContentLoaded", () => {
	for(const el of document.querySelectorAll("[comp]")){
		if(el._comp === undefined)Component.components[el.getAttribute("comp")].assign(el);
	}
});
