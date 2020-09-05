import { onMounted, onUnmounted } from "@vue/runtime-core";
import { bulletHitTestObject } from "../utils/index";
import { game } from "../Game";
export function useFighting(
  bgMusic,
  level,
  enemyTanks,
  enemyTanksTypes2,
  bullets,
  enemyBullets,
  playerTankInfo,
  emit,
  environment,
  InvulnerableBuffs
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
      if (playerTankInfo.status !== "INVINCIBLE" && bulletHitTestObject(enemyInfo, playerTankInfo)) {
        playerTankInfo.status = "DEAD";
        setTimeout(function() {
          bgMusic.stop();
          emit("changePage", "EndPage");
        }, 1000);
      }
    });

    // enemyTanksTypes2.forEach(enemyInfo => {
    //   if (playerTankInfo.status !== "INVINCIBLE" && bulletHitTestObject(enemyInfo, playerTankInfo)) {
    //     playerTankInfo.status = "DEAD";
    //     setTimeout(function() {
    //       bgMusic.stop();
    //       emit("changePage", "EndPage");
    //     }, 1000);
    //   }
    // });

    InvulnerableBuffs.forEach((buff, buffIndex) => {
      if (bulletHitTestObject(buff, playerTankInfo)) {
        InvulnerableBuffs.splice(buffIndex, 1);
        playerTankInfo.status = "INVINCIBLE";
        setTimeout(function() {
          playerTankInfo.status = "ALIVE";
        }, 20000);
      }
    });

    if (enemyTanksTypes2.length === 0 && enemyTanks.length === 0) {
      if (level === 1) {
        bgMusic.stop();
        emit("changePage", "CoverPage");
        emit("changeLevel", 2);
      } else if (level === 2) {
        bgMusic.stop();
        emit("changePage", "CoverPage");
        emit("changeLevel", 3);
      }
    }

    enemyBullets.forEach((enemyInfo, bulletIndex) => {
      if (bulletHitTestObject(enemyInfo, playerTankInfo)) {
        enemyBullets.splice(bulletIndex, 1);
        if(playerTankInfo.status!== "INVINCIBLE") {
        playerTankInfo.status = "DEAD";
        // 游戏结束
        setTimeout(function() {
          bgMusic.stop();
          emit("changePage", "EndPage");
        }, 1000);
        }
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
      SteelBlocks.forEach((SteelBlockInfo) => {
        if (bulletHitTestObject(bulletInfo, SteelBlockInfo)) {
          bullets.splice(bulletIndex, 1);
        }
      });
    });

    bullets.forEach((bulletInfo, bulletIndex) => {
      WallsBlocks.forEach((WallsBlockInfo, WallsBlocksIndex) => {
        if (bulletHitTestObject(bulletInfo, WallsBlockInfo)) {
          bullets.splice(bulletIndex, 1);
          if (WallsBlockInfo.health <= 0) {
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
      SteelBlocks.forEach((SteelBlockInfo) => {
        if (bulletHitTestObject(bulletInfo, SteelBlockInfo)) {
          enemyBullets.splice(bulletIndex, 1);
        }
      });
    });

    bullets.forEach((bulletInfo, bulletIndex) => {
      enemyTanks.forEach((enemyInfo, enemyIndex) => {
        if (
          bulletHitTestObject(bulletInfo, enemyInfo) &&
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
          bulletHitTestObject(bulletInfo, enemyInfo) &&
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
