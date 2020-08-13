// 引入第二类地方坦克 行动速度更快 开火频率更短

import {
    h,
    defineComponent,
    toRefs,
    computed,
    onMounted,
    onUnmounted
  
  } from "@vue/runtime-core";
  import enemyTankImgD from "../../assets/enemy2D.gif";
  import enemyTankImgL from "../../assets/enemy2L.gif";
  import enemyTankImgR from "../../assets/enemy2R.gif";
  import enemyTankImgU from "../../assets/enemy2U.gif";
  import { firePointTransform } from "../utils/index";
  
  export default defineComponent({
    props: ["x", "y", "direction"],

    setup(props, { emit }) {
            
      const tankFireInterval = 2500;
      const { x, y, direction } = toRefs(props);
      const TankImg = computed(() => {
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
        //每2.5秒发射一颗子弹
        timeIntervalReturnedValue = setInterval(enenyFire, tankFireInterval);
      });
    
      onUnmounted(() => {
        //组件卸载时 清除 定时器 释放内存
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
  