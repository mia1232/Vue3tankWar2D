//根据敌我相对位置 让地方坦克向玩家的位置挪动

export function getBestDirection(currentTankInfo, targetInfo){
    const dirDistanceMapping = {};
    dirDistanceMapping["TOP"] = getDistance(targetInfo, {...currentTankInfo, y: currentTankInfo.y  - 15});
    dirDistanceMapping["DOWN"] = getDistance(targetInfo, {...currentTankInfo, y: currentTankInfo.y + 15});
    dirDistanceMapping["LEFT"] = getDistance(targetInfo, {...currentTankInfo, x: currentTankInfo.x - 15});
    dirDistanceMapping["RIGHT"] = getDistance(targetInfo, {...currentTankInfo, x: currentTankInfo.x + 15});
    return Object.keys(dirDistanceMapping).reduce((a, b) => dirDistanceMapping[a] < dirDistanceMapping[b] ? a : b);
}

function getDistance(tank1, tank2) {
    return Math.sqrt(Math.abs(tank1.x - tank2.x)*Math.abs(tank1.x - tank2.x) + Math.abs(tank1.y - tank2.y) * Math.abs(tank1.y - tank2.y));
}