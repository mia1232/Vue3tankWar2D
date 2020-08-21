import {
    h,
    defineComponent,
    toRefs,
  } from "@vue/runtime-core";
  import star from "../../assets/star.gif";
  
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
        h("Sprite", { texture: star }),
      ]);
    },
  });