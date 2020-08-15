// 根组件

import { defineComponent, h, computed, ref } from "@vue/runtime-core";
import StartPage from "./page/StartPage";
import GamePage from "./page/GamePage";
import EndPage from "./page/EndPage";
import Coverpage from "./page/levelProgressionPage";
import { GameLevel1Setup, GameLevel2Setup } from "./environment-config/envConfig";


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
      }
    });

    return {
      currentPage,
      currentPageName,
      currentGameSetup,
      gameLevel
    };
  },
  render(ctx) {
    // 响应式数据来的 -> vnode -> dom element
    return h("Container", [
      h(ctx.currentPage, { 
        setup: ctx.currentGameSetup,
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
