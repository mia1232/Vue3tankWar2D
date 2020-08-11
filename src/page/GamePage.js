import {
  h,
  defineComponent,
  reactive,
  onMounted,
  onUnmounted
} from "@vue/runtime-core";
import Steels from "../component/Steels";
import Tank from "../component/Tank";
import EnemyTank from "../component/EnemyTank";
import Bullet from "../component/Bullet";
import EnemyBullet from "../component/EnemyBullet";
import { game } from "../Game";
import {
  hitTestObject,
  bulletHitTestObject,
  environmentRuleHasCollision
} from "../utils/index";

import { parseInitEnvDataToGameWorld } from "../utils/envParser";
import { initTwoDimensionalArrayData } from "../environment-config/envConfig";
import { getBestDirection } from "../tank-ai/tankai";
import Water from "../component/Water";
import Grass from "../component/Grass";
import Walls from "../component/Walls";

export default defineComponent({
  setup(props, { emit }) {

    const { SteelBlocksArr: SteelIntialData, GrassBlocksArr:GrassInitialData, WallsBlockArr: WallsInitData, WaterBlockArr: WaterIntialData, EnemyArr: enemyTankConfig, Player: PlayerInitData  } =  parseInitEnvDataToGameWorld(initTwoDimensionalArrayData);

    const { enemyTanks } = useCreateEnemyTank(enemyTankConfig);

    const SteelBlocks = useBackgrounds(SteelIntialData);
    const { tankInfo } = useCreateTank(PlayerInitData, environmentRuleHasCollision, {
      SteelBlocks
    });

    const WaterBlocks = useBackgrounds(WaterIntialData);

    const GrassBlocks = useBackgrounds(GrassInitialData);

    const WallsBlocks = useBackgrounds(WallsInitData);

    // 我方子弹
    const { bullets, addBullet } = useCreateBullets();
    const {
      bullets: enemyBullets,
      addBullet: addEnemyBullet
    } = useCreateBullets();
    useFighting(enemyTanks, bullets, enemyBullets, tankInfo, emit, {
      SteelBlocks, WallsBlocks
    });
    useEnvironmentInteraction(tankInfo, environmentRuleHasCollision, enemyTanks, {
      SteelBlocks
    });

    const onAttack = bulletInfo => {
      // 添加子弹
      addBullet(bulletInfo);
    };

    const onEnemyAttack = bulletInfo => {
      // 添加子弹
      addEnemyBullet(bulletInfo);
    };

    return {
      onAttack,
      onEnemyAttack,
      enemyTanks,
      enemyBullets,
      bullets,
      tankInfo,
      SteelBlocks,
      WaterBlocks,
      GrassBlocks,
      WallsBlocks
    };
  },

  render(ctx) {
    // 创建敌方

    const createEnemyTanks = onEnemyAttack => {
      return ctx.enemyTanks.map(info => {
        return h(EnemyTank, {
          x: info.x,
          y: info.y,
          direction: info.direction,
          onAttack: onEnemyAttack
        });
      });
    };

    // 我方子弹
    const createBullets = () => {
      return ctx.bullets.map(info => {
        return h(Bullet, { x: info.x, y: info.y, direction: info.direction });
      });
    };

    const createEnemyBullets = () => {
      return ctx.enemyBullets.map(info => {
        return h(EnemyBullet, {
          x: info.x,
          y: info.y,
          direction: info.direction
        });
      });
    };

    const createBackgroundBlocks = (backgroundInitData, backgroundType) => {
      return backgroundInitData.map(info => {
        return h(backgroundType, { x: info.x, y: info.y });
      });
    };

    return h("Container", [
      h(Tank, {
        x: ctx.tankInfo.x,
        y: ctx.tankInfo.y,
        direction: ctx.tankInfo.direction,
        onAttack: ctx.onAttack
      }),
      ...createEnemyTanks(ctx.onEnemyAttack),
      ...createBullets(),
      ...createEnemyBullets(),
      ...createBackgroundBlocks(ctx.SteelBlocks, Steels),
      ...createBackgroundBlocks(ctx.WaterBlocks, Water),
      ...createBackgroundBlocks(ctx.GrassBlocks, Grass),
      ...createBackgroundBlocks(ctx.WallsBlocks, Walls)
    ]);
  }
});

function useFighting(enemyTanks, bullets, enemyBullets, planeInfo, emit, environment) {
  const handleTicker = () => {
    // 主循环
    // 敌方飞机移动
    // y
    // 移动我方子弹

    const { SteelBlocks, WallsBlocks } = environment;
    bullets.forEach(bulletInfo => {
      switch (bulletInfo.direction) {
        case "TOP":
          bulletInfo.y--;
          break;
        case "DOWN":
          bulletInfo.y++;
          break;
        case "LEFT":
          bulletInfo.x--;
          break;
        case "RIGHT":
          bulletInfo.x++;
          break;
      }
    });

    enemyBullets.forEach(bulletInfo => {
      switch (bulletInfo.direction) {
        case "TOP":
          bulletInfo.y--;
          break;
        case "DOWN":
          bulletInfo.y++;
          break;
        case "LEFT":
          bulletInfo.x--;
          break;
        case "RIGHT":
          bulletInfo.x++;
          break;
      }
    });

    enemyTanks.forEach(enemyInfo => {
      if (hitTestObject(enemyInfo, planeInfo)) {
        console.log("hit");
        // 游戏结束
        emit("changePage", "EndPage");
      }
    });

    enemyBullets.forEach(enemyInfo => {
      if (hitTestObject(enemyInfo, planeInfo)) {
        console.log("hit");
        // 游戏结束
        emit("changePage", "EndPage");
      }
    });

    bullets.forEach((bulletInfo, bulletIndex) => {
      enemyBullets.forEach((enemyBulletInfo, enemyIndex) => {
        if (bulletHitTestObject(bulletInfo, enemyBulletInfo)) {
          bullets.splice(bulletIndex, 1);
          enemyBullets.splice(enemyIndex, 1);
        }
      });
    });

    bullets.forEach((bulletInfo, bulletIndex) => {
      SteelBlocks.forEach((SteelBlockInfo, enemyIndex) => {
        if (bulletHitTestObject(bulletInfo, SteelBlockInfo)) {
          bullets.splice(bulletIndex, 1);
        }
      });
    });

    bullets.forEach((bulletInfo, bulletIndex) => {
      WallsBlocks.forEach((WallsBlockInfo, WallsBlocksIndex) => {
        if (bulletHitTestObject(bulletInfo, WallsBlockInfo)) {         
          bullets.splice(bulletIndex, 1);
          if( WallsBlockInfo.health === 0) {
            WallsBlocks.splice(WallsBlocksIndex, 1)
          } else {
            WallsBlockInfo.health = WallsBlockInfo.health - 50;
          }
        }
      });
    });


    enemyBullets.forEach((bulletInfo, bulletIndex) => {
      WallsBlocks.forEach((WallsBlockInfo, WallsBlocksIndex) => {
        if (bulletHitTestObject(bulletInfo, WallsBlockInfo)) {         
          bullets.splice(bulletIndex, 1);
          if( WallsBlockInfo.health === 0) {
            WallsBlocks.splice(WallsBlocksIndex, 1)
          } else {
            WallsBlockInfo.health = WallsBlockInfo.health - 25;
          }
        }
      });
    });


    enemyBullets.forEach((bulletInfo, bulletIndex) => {
      SteelBlocks.forEach((SteelBlockInfo, enemyIndex) => {
        if (bulletHitTestObject(bulletInfo, SteelBlockInfo)) {
          enemyBullets.splice(bulletIndex, 1);
        }
      });
    });

    bullets.forEach((bulletInfo, bulletIndex) => {
      enemyTanks.forEach((enemyInfo, enemyIndex) => {
        if (hitTestObject(bulletInfo, enemyInfo)) {
          bullets.splice(bulletIndex, 1);
          enemyTanks.splice(enemyIndex, 1);
          // 我方子弹消失
          // 敌方飞机消失
        }
      });
    });
  };

  onMounted(() => {
    game.ticker.add(handleTicker);
  });

  onUnmounted(() => {
    game.ticker.remove(handleTicker);
  });
}

function useCreateBullets() {
  const bullets = reactive([]);

  const addBullet = info => {
    bullets.push({ ...info, width: 2, height: 2 });
  };

  return {
    bullets,
    addBullet
  };
}

function useCreateEnemyTank(enemyInitData) {
  const enemyTanks = reactive(enemyInitData);
  return {
    enemyTanks
  };
}

function useEnvironmentInteraction(
  playerTankInfo,
  environmentRuleHasCollision,
  enemyTanks,
  environment
) {
  let timeIntervalReturnedValue;
  const handleTicker = () => {
    // 主循环
    // 敌方飞机移动
    // y
    enemyTanks.forEach(tankInfo => {
      const speed = 7.5;
      const  direction = getBestDirection(tankInfo, playerTankInfo);
      switch (direction) {
        case "TOP":
          tankInfo.direction = "TOP";
          tankInfo.y -= speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.y += speed;
          }
          break;
        case "DOWN":
          tankInfo.direction = "DOWN";
          tankInfo.y += speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.y -= speed;
          }
          break;
        case "LEFT":
          tankInfo.direction = "LEFT";
          tankInfo.x -= speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.x += speed;
          }
          break;
        case "RIGHT":
          tankInfo.direction = "RIGHT";
          tankInfo.x += speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.x -= speed;
          }
          break;
      }
      const randonNumber = Math.random();
      if (!environmentRuleHasCollision({ tankInfo, environment })) {
        if (randonNumber >= 0 && randonNumber <= 0.25 && tankInfo.direction !== "LEFT"  && tankInfo.direction !== "RIGHT") {
          tankInfo.direction = "TOP";
          tankInfo.y -= speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.y += speed;
          }
        } else if (randonNumber >= 0.25 && randonNumber <= 0.5 && tankInfo.direction !== "LEFT"  && tankInfo.direction !== "RIGHT") {
          tankInfo.direction = "DOWN";
          tankInfo.y += speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.y -= speed;
          }
        } else if (randonNumber >= 0.5 && randonNumber <= 0.75 && tankInfo.direction !== "TOP"  && tankInfo.direction !== "DOWN") {
          tankInfo.direction = "LEFT";
          tankInfo.x -= speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.x += speed;
          }
        } else if(tankInfo.direction !== "TOP"  && tankInfo.direction !== "DOWN"){
          tankInfo.direction = "RIGHT";
          tankInfo.x += speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.x -= speed;
          }
        }
      }
    });
  };

  onMounted(() => {
    timeIntervalReturnedValue = setInterval(handleTicker, 1000);
    // game.ticker.add(handleTicker);
  });

  onUnmounted(() => {
    clearInterval(timeIntervalReturnedValue);
    // game.ticker.remove(handleTicker);
  });
}

function useBackgrounds(bgInitData) {
  const backgroundBlocks = reactive(bgInitData);

  return backgroundBlocks;
}

function useCreateTank(playerInitData, environmentRuleHasCollision, environment) {
  // 我方飞机的逻辑
  const tankInfo = reactive(playerInitData);
  // 键盘控制飞机的移动
  const speed = 5;
  window.addEventListener("keydown", e => {
    if (!environmentRuleHasCollision({ tankInfo, environment })) {
      switch (e.code) {
        case "ArrowUp":
          tankInfo.direction = "TOP";
          tankInfo.y -= speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.y += speed;
          }
          break;
        case "ArrowDown":
          tankInfo.direction = "DOWN";
          tankInfo.y += speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.y -= speed;
          }
          break;
        case "ArrowLeft":
          tankInfo.direction = "LEFT";
          tankInfo.x -= speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.x += speed;
          }
          break;
        case "ArrowRight":
          tankInfo.direction = "RIGHT";
          tankInfo.x += speed;
          if (environmentRuleHasCollision({ tankInfo, environment })) {
            tankInfo.x -= speed;
          }
          break;
      }
    }
  });
  return { tankInfo };
}

