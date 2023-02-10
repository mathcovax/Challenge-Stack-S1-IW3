import "./components/carousel";
import "./components/list";
import "./components/ico";
import "./components/tab";
import "./components/text-input";
import Component, { getComp } from "./lib/component";

export const currentScript = document.currentScript;

window.getComp = getComp;
window.Component = Component;
