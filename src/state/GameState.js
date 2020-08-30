import { reactive } from "@vue/runtime-core";
export function useCreateEnemyTank(enemyInitData) {
  const enemyTanks = reactive(enemyInitData);
  return {
    enemyTanks
  };
}

export function useInvunerableBuff(buffInitData) {
  const InvulnerableBuffs = reactive(buffInitData);

  return InvulnerableBuffs;
}

export function useCreateBullets() {
  const bullets = reactive([]);

  const addBullet = info => {
    bullets.push({ ...info, width: 17, height: 17 });
  };

  return {
    bullets,
    addBullet
  };
}

export function useCreateTank(
  PlayerInitialData,
  environmentRuleHasCollision,
  environment
) {
  const tankInfo = reactive(PlayerInitialData);
  const speed = 5;
  window.addEventListener("keydown", e => {
    if (
      (tankInfo.status === "ALIVE" || tankInfo.status === "INVINCIBLE") &&
      !environmentRuleHasCollision({ tankInfo, environment })
    ) {
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
