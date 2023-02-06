window.stop();
let script = document.createElement("script");
script.type = "module";
script.src = document.currentScript.getAttribute("lib");
document.head.append(script);
