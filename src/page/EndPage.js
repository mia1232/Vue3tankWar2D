import { h, defineComponent, onMounted, onUnmounted } from "@vue/runtime-core";
import endPageImg from "../../assets/over.gif";

export default defineComponent({
  setup(props, ctx) {
    const onClick = () => {
      ctx.emit("changePage", "GamePagelv1");
    };

    const restartGameListener = e => {
      if (e.code === "Enter" || e.code === "Space")
        ctx.emit("changePage", "GamePagelv1");
    };

    onMounted(() => {
      window.addEventListener("keydown", restartGameListener);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", restartGameListener);
    });

    return {
      onClick
    };
  },
  render() {
    return h("Container", [
      h("Sprite", { texture: endPageImg, x: 8 * 60 - 40, y: 8 * 60 - 22.5 })
    ]);
  }
});
