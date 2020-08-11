// 根组件

import { defineComponent, h, computed, ref } from "@vue/runtime-core";
import StartPage from "./page/StartPage";
import GamePage from "./page/GamePage";
import EndPage from "./page/EndPage";

export default defineComponent({
  setup() {
    // 普通的值
    // ref 创建一个响应式对象 值类型 string  number
    // const currentPageName = ref("StartPage");
    const currentPageName = ref("StartPage");
    // const currentPageName = ref("EndPage");
    // console.log(currentPageName);
    //改变 string 的话切换组件
    //一个依赖别的属性的属性
    //计算属性
    // ref 响应式对象
    const currentPage = computed(() => {
      if (currentPageName.value === "StartPage") {
        return StartPage;
      } else if (currentPageName.value === "GamePage") {
        return GamePage;
      } else if (currentPageName.value === "EndPage") {
        return EndPage;
      }
    });

    return {
      currentPage,
      currentPageName,
    };
  },
  render(ctx) {
    // 响应式数据来的 -> vnode -> dom element
    return h("Container", [
      h(ctx.currentPage, {
        onChangePage(page) {
          ctx.currentPageName = page;
        },
      }),
    ]);
  },
});
