import { h, defineComponent } from "@vue/runtime-core";
import startPageImg from "../../assets/Battle_City.png";
import audioPath from '../gameaudio/intro.m4a';
import { backgroundAudio } from "../gameaudio/audioUtil";

export default defineComponent({
  setup(props, ctx) {
    const bgMusic = new backgroundAudio(audioPath);
    bgMusic.play();
    const onClick = () => {
      bgMusic.stop();
      ctx.emit("changePage","GamePage")
    };

    return {
      onClick,
    };
  },
  render(ctx) {
    return h("Container", [
      h("Sprite", { texture: startPageImg,
        x: 10,
        y: 0,
        interactive: true,
        onClick: ctx.onClick})
    ]);
  },
});
