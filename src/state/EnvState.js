import {
    reactive,
    onMounted,
    onUnmounted
  } from "@vue/runtime-core";
  
import { getBestDirection } from "../tank-ai/tankai";
export function  useBackgrounds(bgInitData) {

  const backgroundBlocks = reactive(bgInitData);

  return backgroundBlocks;
}



export function useEnvironmentInteraction(
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
    });
  
    onUnmounted(() => {
      clearInterval(timeIntervalReturnedValue);
    });
  }