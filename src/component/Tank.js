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
import BuffedTankImgD from "../../assets/superTankD.gif";
import BuffedTankImgL from "../../assets/superTankL.gif";
import BuffedTankImgR from "../../assets/superTankR.gif";
import BuffedTankImgU from "../../assets/superTankU.gif";
import { PLAYER_FIRE_INTERVAL} from "../gameconfig/game-config";
  
import Blast from "../../assets/blast7.gif";
import { firePointTransform, throttle } from "../utils/index";


export default defineComponent({
  props: ["x", "y", "direction", "status"],
  setup(props, { emit }) {

    const { x, y, direction, status } = toRefs(props);

    const TankImg = computed(() => {
      if(status.value === 'DEAD') {
        // 坦克死亡 展示 爆炸图像
        return Blast;
      } else if (status.value !== 'INVINCIBLE') {
        if (direction.value === "TOP") {
          return TankImgU;
        } else if (direction.value === "LEFT") {
          return TankImgL;
        } else if (direction.value === "RIGHT") {
          return TankImgR;
        } else if (direction.value === "DOWN") {
          return TankImgD;
        }  
      } else {
        if (direction.value === "TOP") {
          return BuffedTankImgU;
        } else if (direction.value === "LEFT") {
          return BuffedTankImgL;
        } else if (direction.value === "RIGHT") {
          return BuffedTankImgR;
        } else if (direction.value === "DOWN") {
          return BuffedTankImgD;
        }  
      }
    });

    function tankFireHandler(e) {
      if (e.code === "Space") {
        emit("attack", firePointTransform({x, y, direction}));
      }
    }

    window.addEventListener("keydown", throttle(tankFireHandler, PLAYER_FIRE_INTERVAL));
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
