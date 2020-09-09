// 引入第二类敌方坦克 行动速度更快 开火频率更短

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
  import enemyTankSpawningStage1 from "../../assets/born1.gif";
  import enemyTankSpawningStage2 from "../../assets/born3.gif";
  import Blast from "../../assets/blast7.gif";
  import { firePointTransform } from "../utils/index";
  import { ENEMY_TANK_TYPE2_FIRE_INTERVAL } from "../gameconfig/game-config";
  
  export default defineComponent({
    props: ["x", "y", "direction", "status"],

    setup(props, { emit }) {
      const { x, y, direction, status } = toRefs(props);
      const TankImg = computed(() => {
        if(status.value === 'SPAWNINGSTAGE1') {
          return enemyTankSpawningStage1;
        }
        if(status.value === 'SPAWNINGSTAGE2') {
          return enemyTankSpawningStage2;
        }
        if(status.value === 'DEAD') {
          return Blast;
        }
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
  
  
      function enemyFire() {
        emit("attack", firePointTransform({x, y, direction}));
      }
  
      let timeIntervalReturnedValue;
      onMounted(() => {
        //每2.5秒发射一颗子弹
        timeIntervalReturnedValue = setInterval(enemyFire, ENEMY_TANK_TYPE2_FIRE_INTERVAL );
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
  