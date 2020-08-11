// 碰撞检测的算法
export const hitTestObject = (objA, objB) => {
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
  // 找出所有没有碰撞的结果
  // 取反
  // 碰撞上的结果
  return (
    objA.x + objA.width >= objB.x &&
    objB.x + objB.width >= objA.x &&
    objA.y + objA.height >= objB.y  &&
    objB.y + objB.height >= objA.y
  );
};


export const environmentRuleHasCollision = ({ environment, tankInfo }) => {
  const { SteelBlocks } = environment;
  if (SteelBlocks) {
    return (
      SteelBlocks.filter(steelBlock => hitTestObject(steelBlock, tankInfo))
        .length > 0
    );
  } else {
    return false;
  }
};

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
