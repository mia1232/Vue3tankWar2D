// 碰撞检测的算法
export const envTestObject = (objA, objB) => {
  // 找出所有没有碰撞的结果
  // 取反
  // 碰撞上的结果
  return (
    objA.x + objA.width >= objB.x + 5 &&
    objB.x + objB.width >= objA.x + 5 &&
    objA.y + objA.height >= objB.y + 5 &&
    objB.y + objB.height >= objA.y + 5 
  );
};



export const bulletHitTestObject = (objA, objB) => {
  return (
    objA.x + objA.width >= objB.x &&
    objB.x + objB.width >= objA.x &&
    objA.y + objA.height >= objB.y  &&
    objB.y + objB.height >= objA.y
  );
};


export const environmentRuleHasCollision = ({ environment, tankInfo }) => {
  const { SteelBlocks, WallsBlocks } = environment;
  if(tankInfo.x < 0 || tankInfo.x + 60 > 60 * 14 || tankInfo.y < 0 || tankInfo.y + 60 > 60 * 12 )
    return true;
  //使坦克无法驶出地图边界
  if (SteelBlocks || WallsBlocks) {
    return (
      SteelBlocks.filter(steelBlock => envTestObject(steelBlock, tankInfo))
        .length > 0 || 
      WallsBlocks.filter(wallsBlock => envTestObject(wallsBlock, tankInfo))
        .length > 0 
    );
  } else {
    return false;
  }
};

// 将子弹出现的位置 定位到坦克的枪管子上 使得开火的效果更加逼真
export const firePointTransform = ({ x, y, direction }) => {
  switch (direction.value) {
    case "TOP":
      return {
        x: x.value + 20,
        y: y.value,
        direction: direction.value
      };
    case "DOWN":
      return {
        x: x.value + 20,
        y: y.value + 40,
        direction: direction.value
      };
    case "LEFT":
      return {
        x: x.value,
        y: y.value + 20,
        direction: direction.value
      };
    case "RIGHT":
      return {
        x: x.value + 40,
        y: y.value + 20,
        direction: direction.value
      };
  }
};


export function throttle(fn, delay) {
  let wait = false;
  return function() {
    if(!wait) {
      wait = true;
      setTimeout(() => {
        fn(...arguments);
        wait = false;
      }, delay);
    }
  }
}
