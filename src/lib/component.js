export default class Component{
	constructor(name){
		Component.components[name] = this;
	}

	#props = {
		
	};
	props(name, value){
		this.#props[name] = value;
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
		let elClass = [...el.classList];
		for(let index = 0; index < tag.attributes.length; index++){
			el.attributes.setNamedItem(tag.cloneNode().attributes.removeNamedItem(tag.attributes.item(index).name));
		}
		el.classList.add(...elClass);

		el._comp = {
			get el(){
				return el;
			},
			child_text: [],
			child_if: [],
			child_classer: [],
			child_styler: [],
			child_for: [],
			refresh(){
				for(const child of this.child_text){
					child.textContent = child.originTextContent.replace(
						/\{\{(.*?)\}\}/g,
						(tag, index) => {
							if(typeof this[index] === "function")return this[index](child);
							else return this[index];
						}
					);
				}

				for(const child of this.child_if){
					let cdn = typeof this[child.if] === "function"? 
						this[child.if](child) === false : 
						this[child.if] === false;
					if(cdn){
						child.style.display = "none";
					}
					else {
						child.style.display = "";
					}
				}

				for(const child of this.child_classer){
					for(const [cls, index] of Object.entries(child.classer)){
						for(const cl of cls.split(" ")){
							child.classList.toggle(cl, typeof this[index] === "function"? this[index](child) : this[index]);
						}
					}
				}

				for(const child of this.child_styler){
					for(const [stls, index] of Object.entries(child.styler)){
						child.style.setProperty(stls, typeof this[index] === "function"? this[index](child) : this[index]);
					}
				}

				for(const child of this.child_for){
					let forArr = [];
					for(const arr of (typeof this[child.for] === "function"? this[child.for](child) : this[child.for])|| []){
						let clone = child.cloneNode(true);
						clone.style.display = "";
						clone.arr = arr;
						forArr.push(clone);
						clone.innerHTML = clone.innerHTML.replace(
							/\{\{arr(.*?)\}\}/g, 
							(tag, index) => {
								if(index === ""){
									return arr;
								}
								return (function find(obj, arr){
									if(arr.length === 1)return obj[arr[0]];
									else if(obj[arr[0]] === undefined)return undefined;
									else return find(obj[arr[0]], arr.slice(1));
								})(arr, index.split(".").slice(1));
							}
						);
					}
					let div = document.createElement("div");
					div.style.display = "none";
					child.parentNode.insertBefore(div, child);
					for(const oc of child.forChild)oc.remove();
					div.replaceWith(...forArr);
					child.forChild = forArr;
				}
			},
			classer(el, obj){
				el.classer = obj;
				this.child_classer.push(el);
				this.refresh();
			},
			styler(el, obj){
				el.styler = obj;
				this.child_styler.push(el);
				this.refresh();
			},
			data : {},
			slot: [...tag.children],
			slotText: tag.innerText,
			refs : {}
		};

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

		for(const [props, value] of Object.entries(this.#props)){
			if(el.getAttribute(props) === null)el.setAttribute(props, value);

			let nameSplit = props.split("-");
			let nameVar = nameSplit.shift();
			for (let index = 0; index < nameSplit.length; index++) {
				nameSplit[index] = nameSplit[index].charAt(0).toUpperCase() + nameSplit[index].slice(1);
				nameVar += nameSplit[index];
			}

			el._comp.data[nameVar] = el.getAttribute(props);
			el.removeAttribute(props);
			Object.defineProperty(
				el._comp,
				nameVar,
				{
					get: () => {
						return el._comp.data[nameVar];
					},
					set: (arg) => {
						let old = el._comp.data[nameVar];
						el._comp.data[nameVar] = arg;
						el._comp.refresh();
						for(const watch of this.#watch[nameVar] || []){
							watch.call(this, arg, old);
						}
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
		
		for(const [index, fnc] of Object.entries(tag.events || {})){
			el[index] = fnc;
		}
		
		(function find(elo){
			for(const child of [...elo.children]){
				if(child.nodeName === "SLOT"){
					for(const slot of el._comp.slot)slot.classList.add(...child.classList);
					child.replaceWith(...el._comp.slot);
					continue;
				}

				for(const event of Component.events){
					if(child.getAttribute(event.attr) !== null){
						child[event.fnc] = el._comp[child.getAttribute(event.attr)];
						if(child.events === undefined)child.events = {};
						child.events[event.fnc] = el._comp[child.getAttribute(event.attr)];
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

				if(child.getAttribute("styler") !== null){
					child.styler = JSON.parse(child.getAttribute("styler").replace(/\'/g, "\""));
					child.removeAttribute("styler");
					el._comp.child_styler.push(child);
				}

				if(child.getAttribute("ref") !== null){
					el._comp.refs[child.getAttribute("ref")] = child._comp === undefined? child : child._comp;
				}

				if(child.getAttribute("for") !== null){
					child.forChild = [];
					child.for = child.getAttribute("for");
					child.style.display = "none";
					el._comp.child_for.push(child);
				}

				if(Component.components[child.getAttribute("comp")] && child._comp === undefined){
					Component.components[child.getAttribute("comp")].assign(child);
					continue;
				}

				if(Component.components[child.nodeName.toLowerCase()] && child._comp === undefined){
					child.setAttribute("comp", child.nodeName.toLowerCase());
					Component.components[child.nodeName.toLowerCase()].assign(child);
					continue;
				}

				if(child.for === undefined){
					if(child.children.length === 0 && /\{\{(.*?)\}\}/.test(child.textContent)){
						child.originTextContent = child.textContent;
						el._comp.child_text.push(child);
					}

					find(child);
				}

			}

		}).call(this, porter);

		el._comp.refresh();
		tag.replaceWith(el);
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


document.addEventListener("DOMContentLoaded", async () => {
	const CR = (await import("../main")).currentScript;
	if(CR.getAttribute("use-tag") !== null){
		for(const comp of Object.keys(Component.components)){
			for(const el of document.querySelectorAll(comp)){
				if(el._comp === undefined){
					el.setAttribute("comp", comp);
					Component.components[comp].assign(el);
				}
			}
		}
	}
	for(const el of document.querySelectorAll("[comp]")){
		if(el._comp === undefined)Component.components[el.getAttribute("comp")].assign(el);
	}
});
