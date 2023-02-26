import "./components/carousel";
import "./components/list";
import "./components/ico";
import "./components/tab";
import "./components/text-input";
import "./components/btn";
import Component, { getComp } from "./lib/component";
import register from "./lib/register";

export const currentScript = document.currentScript;

window.getComp = getComp;
window.Component = Component;
register((currentScript.getAttribute("register") || "").split(","));
