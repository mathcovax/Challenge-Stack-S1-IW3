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
		this.#inner = value;
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

	#methods = {
		
	};

	assign(el){
		el.innerHTML = "";
		el._comp = {
			get el(){
				return el;
			}
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

		for(const props of this.#props){
			Object.defineProperty(
				el._comp,
				props,
				{
					get: () => {
						return el.getAttribute(props);
					}
				}
			);
		}
		
		let div = document.createElement("div");
		div.innerHTML = this.#inner;
		(function find(el){
			for(const child of el.children){
				let origin = child.textContent; 
				child.textContent = origin.replace(
					/\{\{(.*?)\}\}/g,
					(tag, index) => {
						this.watch(
							index, 
							(n) => {
								child.textContent = origin.replace(tag, n);
							}
						);
						return this.#data[index];
					}
				);
			}
		}).call(this, div);

		while(div.firstChild){
			el.append(div.firstChild);
		}

		setTimeout(() => {
			console.log("test");
			for(const fnc of this.#watch["yes"]){
				fnc("test");
			}
			
		}, 5000);


	}

	static components = {

	};
}
