import { Application } from "pixi.js";
// setup canvas
export const game = new Application({
  width:  60*16,
  height: 60*16,
});

document.body.append(game.view);

// game.stage
export function getRootContainer() {
  return game.stage;
}
