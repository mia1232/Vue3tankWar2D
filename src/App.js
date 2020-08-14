// 根组件

import { defineComponent, h, computed, ref } from "@vue/runtime-core";
import StartPage from "./page/StartPage";
import Lv1GamePage from "./page/lv1GamePage";
import Lv2GamePage from "./page/lv2GamePage";
import EndPage from "./page/EndPage";
import { GameLevel1Setup } from "./environment-config/envConfig";
import { GameLevel2Setup } from "./environment-config/lv2envConfig";


export default defineComponent({
  setup() {
    const currentPageName = ref("StartPage");
    const gameLevel = ref(1);
    const currentPage = computed(() => {
      if (currentPageName.value === "StartPage") {
        return StartPage;
      } else if (currentPageName.value === "GamePagelv1") {
        return Lv1GamePage;
      } else if (currentPageName.value === "EndPage") {
        return EndPage;
      } else if (currentPageName.value === "GamePagelv2") {
        return Lv2GamePage;
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
        }
      }),
    ]);
  },
});
