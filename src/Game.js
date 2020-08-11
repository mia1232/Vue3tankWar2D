import { Application } from "pixi.js";
// setup canvas
export const game = new Application({
  width:  14*60,
  height: 12*60,
});

document.body.append(game.view);

// game.stage
export function getRootContainer() {
  return game.stage;
}
