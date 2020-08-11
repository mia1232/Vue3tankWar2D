import { h, defineComponent } from "@vue/runtime-core";
import startPageImg from "../../assets/Battle_City.png";

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
      h("Sprite", { texture: startPageImg,
        x: 10,
        y: 0,
        interactive: true,
        onClick: ctx.onClick})
    ]);
  },
});
