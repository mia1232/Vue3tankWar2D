//我方子弹
import {
  h,
  defineComponent,
  toRefs,
} from "@vue/runtime-core";
import tankMissleImg from "../../assets/tankmissile.gif";

export default defineComponent({
  props: ["x", "y"],
  setup(props, ctx) {
    const { x, y } = toRefs(props);
    return {
      x,
      y,
    };
  },
  render(ctx) {
    return h("Container", { x: ctx.x, y: ctx.y }, [
      h("Sprite", { texture: tankMissleImg }),
    ]);
  },
});