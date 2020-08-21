import { createRenderer } from "@vue/runtime-core";

import { Text, Container, Sprite, Texture } from "pixi.js";
const renderer = createRenderer({
  createElement(type) {
    let element;
    switch (type) {
      case "Container":
        element = new Container();
        break;
      case "Sprite":
        element = new Sprite();
        break;
    }
    return element;
  },

  setElementText(node, text) {
    const cText = new Text(text);
    node.addChild(cText);
  },

  createText(text) {
    return new Text(text);
  },

  patchProp(el, key, prevValue, nextValue) {
    switch (key) {
      case "texture":
        el.texture = Texture.from(nextValue);
        break;
      case "onClick":
        el.on("pointertap", nextValue);
        break;
      default:
        el[key] = nextValue;
    }
  },

  insert(el, parent) {
    parent.addChild(el);
  },
  createComment() {},
  parentNode() {},
  nextSibling() {},
  remove(el) {
    const parent = el.parent;
    if (parent) {
      parent.removeChild(el);
    }
  },
});

export function createApp(rootComponent) {
  return renderer.createApp(rootComponent);
}
