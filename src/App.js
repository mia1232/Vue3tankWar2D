// 根组件

import { defineComponent, h, computed, ref } from "@vue/runtime-core";
import StartPage from "./page/StartPage";
import GamePage from "./page/GamePage";
import EndPage from "./page/EndPage";
import Coverpage from "./page/levelProgressionPage";
import { GameLevel1Setup, GameLevel2Setup, GameLevel3Setup, GameLevel1EnemiesTankQueue, GameLevel2EnemiesTankQueue, GameLevel3EnemiesTankQueue } from "./environment-config/envConfig";


export default defineComponent({
  setup() {
    const currentPageName = ref("StartPage");
    const gameLevel = ref(1);
    const currentPage = computed(() => {
      if (currentPageName.value === "StartPage") {
        return StartPage;
      } else if (currentPageName.value === "GamePage") {
        return GamePage;
      } else if (currentPageName.value === "EndPage") {
        return EndPage;
      } else if (currentPageName.value === "CoverPage") {
        return Coverpage;
      }
    });

    const currentGameSetup = computed(() => {
      if (gameLevel.value === 1) {
        return GameLevel1Setup;
      } else if (gameLevel.value === 2) {  
        return GameLevel2Setup;
      }else if (gameLevel.value === 3) {  
        return GameLevel3Setup;
      }
    });

    const currentEnemySpawningSetup = computed(() => {
      if (gameLevel.value === 1) {
        return GameLevel1EnemiesTankQueue;
      } else if (gameLevel.value === 2) {  
        return GameLevel2EnemiesTankQueue;
      }else if (gameLevel.value === 3) {  
        return GameLevel3EnemiesTankQueue;
      }
    });

    return {
      currentPage,
      currentPageName,
      currentEnemySpawningSetup,
      currentGameSetup,
      gameLevel
    };
  },
  render(ctx) {
    // 响应式数据来的 -> vnode -> dom element
    return h("Container", [
      h(ctx.currentPage, { 
        setup: ctx.currentGameSetup,
        enemySpawningSetup: ctx.currentEnemySpawningSetup,
        level: ctx.gameLevel,
        onChangePage(page) {
          ctx.currentPageName = page;
        },
        onChangeLevel(level) {
          ctx.gameLevel = level;
        },
      }),
    ]);
  },
});
