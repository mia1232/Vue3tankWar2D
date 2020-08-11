//敌方飞机
import {
  h,
  defineComponent,
  toRefs,
  computed,
  onMounted,
  onUnmounted

} from "@vue/runtime-core";
import enemyTankImgD from "../../assets/enemy1D.gif";
import enemyTankImgL from "../../assets/enemy1L.gif";
import enemyTankImgR from "../../assets/enemy1R.gif";
import enemyTankImgU from "../../assets/enemy1U.gif";
import { firePointTransform } from "../utils/index";

export default defineComponent({
  props: ["x", "y", "direction"],


  setup(props, { emit }) {
    const { x, y, direction } = toRefs(props);
    const TankImg = computed(() => {
      console.log(direction.value)
      if (direction.value === "TOP") {
        return enemyTankImgU;
      } else if (direction.value === "LEFT") {
        return enemyTankImgL;
      } else if (direction.value === "RIGHT") {
        return enemyTankImgR;
      } else if (direction.value === "DOWN") {
        return enemyTankImgD;
      }
    });


    function enenyFire() {
      emit("attack", firePointTransform({x, y, direction}));
    }

    let timeIntervalReturnedValue;
    onMounted(() => {
      timeIntervalReturnedValue = setInterval(enenyFire,4000);
    });
  
    onUnmounted(() => {
      clearInterval(timeIntervalReturnedValue);
    });
    return {
      x,
      y,
      TankImg
    };
  },
  render(ctx) {
    return h("Container", { x: ctx.x, y: ctx.y }, [
      h("Sprite", { texture: ctx.TankImg }),
    ]);
  },
});
