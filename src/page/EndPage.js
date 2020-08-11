import { h, defineComponent } from "@vue/runtime-core";
import endPageImg from "../../assets/over.gif";
import restartBtnImg from "../../assets/restartBtn.png";

export default defineComponent({
  setup(props, ctx) {
    // 没有this
    // 作为 vue3 的入口函数
    const onClick = () => {
      ctx.emit("changePage","GamePage")
    };

    return {
      onClick,
    };
  },
  render(ctx) {
    // 背景图片
    // <div><img src="imgpath/></div>
    // pixi.js
    return h("Container", [
      h("Sprite", { texture: endPageImg,x: 8 * 60 - 40, y: 8 * 60 - 22.5}),
      h("Sprite", {
        texture: restartBtnImg,
        x: 8 * 60 - 150,
        y: 530,
        interactive: true,
        onClick: ctx.onClick,
      }),
    ]);
  },
});