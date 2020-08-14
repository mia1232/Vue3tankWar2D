import {
  h,
  defineComponent,
  reactive,
  onMounted,
  onUnmounted,
  toRefs
} from "@vue/runtime-core";
import Steels from "../component/Steels";
import Tank from "../component/Tank";
import EnemyTank from "../component/EnemyTank";
import EnemyTank2 from "../component/EnemyTank2";
import Bullet from "../component/Bullet";
import EnemyBullet from "../component/EnemyBullet";
import { game } from "../Game";
import {
  hitTestObject,
  bulletHitTestObject,
  environmentRuleHasCollision
} from "../utils/index";

import { parseInitEnvDataToGameWorld } from "../utils/envParser";
import { getBestDirection } from "../tank-ai/tankai";
import Water from "../component/Water";
import Grass from "../component/Grass";
import Walls from "../component/Walls";

export default defineComponent({
  props: ["level", "setup"],
  setup(props, { emit }) {
    const { level, setup } = toRefs(props);

    const {
      SteelBlocksArr: SteelIntialData,
      GrassBlocksArr: GrassInitialData,
      WallsBlockArr: WallsInitData,
      WaterBlockArr: WaterIntialData,
      EnemyBasicTankArr: enemyTankConfig,
      EnemyTankType2Arr: enemyType2Config,
      Player: PlayerInitData
    } = parseInitEnvDataToGameWorld(setup.value);

    const { enemyTanks } = useCreateEnemyTank(enemyTankConfig);

    const { enemyTanks: enemyTanksType2 } = useCreateEnemyTank(
      enemyType2Config
    );

    const WallsBlocks = useBackgrounds(WallsInitData);
    const SteelBlocks = useBackgrounds(SteelIntialData);
    const { tankInfo } = useCreateTank(
      PlayerInitData,
      environmentRuleHasCollision,
      {
        SteelBlocks,
        WallsBlocks
      }
    );

    const WaterBlocks = useBackgrounds(WaterIntialData);

    const GrassBlocks = useBackgrounds(GrassInitialData);

    // 我方子弹
    const { bullets, addBullet } = useCreateBullets();
    const {
      bullets: enemyBullets,
      addBullet: addEnemyBullet
    } = useCreateBullets();
    useFighting(
      level.value,
      enemyTanks,
      enemyTanksType2,
      bullets,
      enemyBullets,
      tankInfo,
      emit,
      {
        SteelBlocks,
        WallsBlocks
      }
    );
    useEnvironmentInteraction(
      tankInfo,
      environmentRuleHasCollision,
      enemyTanks,
      enemyTanksType2,
      {
        SteelBlocks,
        WallsBlocks
      }
    );

    const onAttack = bulletInfo => {
      // 本方坦克发射子弹
      addBullet(bulletInfo);
    };

    const onEnemyAttack = bulletInfo => {
      // 敌方坦克发射子弹
      addEnemyBullet(bulletInfo);
    };

    return {
      onAttack,
      onEnemyAttack,
      enemyTanks,
      enemyTanksType2,
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
    const createEnemyTanks = onEnemyAttack => {
      return ctx.enemyTanks.map(info => {
        return h(EnemyTank, {
          status: info.status,
          x: info.x,
          y: info.y,
          health: info.health,
          direction: info.direction,
          onAttack: onEnemyAttack
        });
      });
    };

    const createEnemyTanksType2 = onEnemyAttack => {
      return ctx.enemyTanksType2.map(info => {
        return h(EnemyTank2, {
          status: info.status,
          x: info.x,
          y: info.y,
          health: info.health,
          direction: info.direction,
          onAttack: onEnemyAttack
        });
      });
    };

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
      ...createEnemyTanksType2(ctx.onEnemyAttack),
      ...createBullets(),
      ...createEnemyBullets(),
      ...createBackgroundBlocks(ctx.SteelBlocks, Steels),
      ...createBackgroundBlocks(ctx.WaterBlocks, Water),
      ...createBackgroundBlocks(ctx.GrassBlocks, Grass),
      ...createBackgroundBlocks(ctx.WallsBlocks, Walls)
    ]);
  }
});

function useFighting(
  level,
  enemyTanks,
  enemyTanksTypes2,
  bullets,
  enemyBullets,
  playerTankInfo,
  emit,
  environment
) {
  const handleTicker = () => {
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
      if (hitTestObject(enemyInfo, playerTankInfo)) {
        emit("changePage", "EndPage");
      }
    });

    enemyTanksTypes2.forEach(enemyInfo => {
      if (hitTestObject(enemyInfo, playerTankInfo)) {
        emit("changePage", "EndPage");
      }
    });

    if (enemyTanksTypes2.length === 0 && enemyTanks.length === 0) {
      if (level === 1) {
        emit("changePage", "CoverPage");
        emit("changeLevel", 2);
      } else if (level === 2) {
        emit("changePage", "StartPage");
        emit("changeLevel", 1);
      }
    }

    enemyBullets.forEach(enemyInfo => {
      if (hitTestObject(enemyInfo, playerTankInfo)) {
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
          if (WallsBlockInfo.health === 0) {
            WallsBlocks.splice(WallsBlocksIndex, 1);
          } else {
            WallsBlockInfo.health = WallsBlockInfo.health - 50;
          }
        }
      });
    });

    enemyBullets.forEach((bulletInfo, bulletIndex) => {
      WallsBlocks.forEach((WallsBlockInfo, WallsBlocksIndex) => {
        if (bulletHitTestObject(bulletInfo, WallsBlockInfo)) {
          enemyBullets.splice(bulletIndex, 1);
          if (WallsBlockInfo.health === 0) {
            WallsBlocks.splice(WallsBlocksIndex, 1);
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
        if (
          hitTestObject(bulletInfo, enemyInfo) &&
          enemyInfo.status === "ALIVE"
        ) {
          bullets.splice(bulletIndex, 1);
          if (enemyInfo.health === 0) {
            enemyInfo.status = "DEAD";
            setTimeout(function() {
              enemyTanks.splice(enemyIndex, 1);
            }, 1000);
          } else {
            enemyInfo.health = enemyInfo.health - 25;
          }
        }
      });
    });

    bullets.forEach((bulletInfo, bulletIndex) => {
      enemyTanksTypes2.forEach((enemyInfo, enemyIndex) => {
        if (
          hitTestObject(bulletInfo, enemyInfo) &&
          enemyInfo.status === "ALIVE"
        ) {
          bullets.splice(bulletIndex, 1);
          // 能挨两炮
          if (enemyInfo.health === 0) {
            enemyInfo.status = "DEAD";
            setTimeout(function() {
              enemyTanksTypes2.splice(enemyIndex, 1);
            }, 1000);
          } else {
            enemyInfo.health = enemyInfo.health - 25;
          }
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
  enemyTanksType2,
  environment
) {
  let timeIntervalReturnedValue;
  const handleTicker = () => {
    enemyTanksType2.forEach(tankInfo => {
      if (tankInfo.status === "ALIVE") {
        const speed = 15;
        const direction = getBestDirection(tankInfo, playerTankInfo);
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
          if (
            randonNumber >= 0 &&
            randonNumber <= 0.25 &&
            tankInfo.direction !== "LEFT" &&
            tankInfo.direction !== "RIGHT"
          ) {
            tankInfo.direction = "TOP";
            tankInfo.y -= speed;
            if (environmentRuleHasCollision({ tankInfo, environment })) {
              tankInfo.y += speed;
            }
          } else if (
            randonNumber >= 0.25 &&
            randonNumber <= 0.5 &&
            tankInfo.direction !== "LEFT" &&
            tankInfo.direction !== "RIGHT"
          ) {
            tankInfo.direction = "DOWN";
            tankInfo.y += speed;
            if (environmentRuleHasCollision({ tankInfo, environment })) {
              tankInfo.y -= speed;
            }
          } else if (
            randonNumber >= 0.5 &&
            randonNumber <= 0.75 &&
            tankInfo.direction !== "TOP" &&
            tankInfo.direction !== "DOWN"
          ) {
            tankInfo.direction = "LEFT";
            tankInfo.x -= speed;
            if (environmentRuleHasCollision({ tankInfo, environment })) {
              tankInfo.x += speed;
            }
          } else if (
            tankInfo.direction !== "TOP" &&
            tankInfo.direction !== "DOWN"
          ) {
            tankInfo.direction = "RIGHT";
            tankInfo.x += speed;
            if (environmentRuleHasCollision({ tankInfo, environment })) {
              tankInfo.x -= speed;
            }
          }
        }
      }
    });

    enemyTanks.forEach(tankInfo => {
      if (tankInfo.status === "ALIVE") {
        const speed = 7.5;
        const direction = getBestDirection(tankInfo, playerTankInfo);
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
          if (
            randonNumber >= 0 &&
            randonNumber <= 0.25 &&
            tankInfo.direction !== "LEFT" &&
            tankInfo.direction !== "RIGHT"
          ) {
            tankInfo.direction = "TOP";
            tankInfo.y -= speed;
            if (environmentRuleHasCollision({ tankInfo, environment })) {
              tankInfo.y += speed;
            }
          } else if (
            randonNumber >= 0.25 &&
            randonNumber <= 0.5 &&
            tankInfo.direction !== "LEFT" &&
            tankInfo.direction !== "RIGHT"
          ) {
            tankInfo.direction = "DOWN";
            tankInfo.y += speed;
            if (environmentRuleHasCollision({ tankInfo, environment })) {
              tankInfo.y -= speed;
            }
          } else if (
            randonNumber >= 0.5 &&
            randonNumber <= 0.75 &&
            tankInfo.direction !== "TOP" &&
            tankInfo.direction !== "DOWN"
          ) {
            tankInfo.direction = "LEFT";
            tankInfo.x -= speed;
            if (environmentRuleHasCollision({ tankInfo, environment })) {
              tankInfo.x += speed;
            }
          } else if (
            tankInfo.direction !== "TOP" &&
            tankInfo.direction !== "DOWN"
          ) {
            tankInfo.direction = "RIGHT";
            tankInfo.x += speed;
            if (environmentRuleHasCollision({ tankInfo, environment })) {
              tankInfo.x -= speed;
            }
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

function useCreateTank(
  playerInitData,
  environmentRuleHasCollision,
  environment
) {
  const tankInfo = reactive(playerInitData);
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
