import Component from "../lib/component";
import html from "./list.html";

const list = new Component("list");
list.inner(html);
list.data("arr", [{test: "tpp"}, {test: "tt"}]);
