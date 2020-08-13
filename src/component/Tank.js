// 飞机
import {
  h,
  defineComponent,
  toRefs,
  computed
} from "@vue/runtime-core";
import TankImgD from "../../assets/p1tankD.gif";
import TankImgL from "../../assets/p1tankL.gif";
import TankImgR from "../../assets/p1tankR.gif";
import TankImgU from "../../assets/p1tankU.gif";
import { firePointTransform } from "../utils/index";


export default defineComponent({
  props: ["x", "y", "direction"],
  setup(props, { emit }) {

    const { x, y, direction } = toRefs(props);

    const TankImg = computed(() => {
      if (direction.value === "TOP") {
        return TankImgU;
      } else if (direction.value === "LEFT") {
        return TankImgL;
      } else if (direction.value === "RIGHT") {
        return TankImgR;
      } else if (direction.value === "DOWN") {
        return TankImgD;
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        emit("attack", firePointTransform({x, y, direction}));
      }
    });
    return {
      x,
      y,
      TankImg
    };
  },
  render(ctx) {
    return h("Container", { x: ctx.x, y: ctx.y }, [
      h("Sprite", { texture: ctx.TankImg}),
    ]);
  },
});
