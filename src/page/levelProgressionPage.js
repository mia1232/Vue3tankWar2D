import { h, defineComponent } from "@vue/runtime-core";
import coverImg from "../../assets/cover.gif";

export default defineComponent({
  setup(props, ctx) {
    const onClick = () => {
      ctx.emit("changePage","GamePage")
    };

    return {
      onClick,
    };
  },
  render(ctx) {
    return h("Container", [
      h("Sprite", { texture: coverImg,
        x: 10,
        y: 0,
        interactive: true,
        onClick: ctx.onClick})
    ]);
  },
});
