import "./components/carousel";
import "./components/list";
import "./components/ico";
import "./components/tab";
import { getComp } from "./lib/component";

export const currentScript = document.currentScript;

window.getComp = getComp;
