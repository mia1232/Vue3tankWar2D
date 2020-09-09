

const BLOCKWIDTH = 60;
export function enemyTankGeneratorStart(environment, enemyTankType1, enemyTankType2, generateEnemiesConfig) {
    const { SteelBlocks, WallsBlocks } = environment;
    generateEnemiesConfig.forEach((tank) => {
        if(SteelBlocks.some((block) => block.x === tank.x * BLOCKWIDTH && block.y === tank.y * BLOCKWIDTH) || WallsBlocks.some((block) => block.x === tank.x * BLOCKWIDTH && block.y === tank.y * BLOCKWIDTH)) {
        } else {
            if(tank.type === 1) {
                const spawnedTank = {
                    status: "SPAWNINGSTAGE1",
                    direction: "TOP",
                    x: tank.x * BLOCKWIDTH,
                    y: tank.y * BLOCKWIDTH,
                    width: BLOCKWIDTH,
                    height: BLOCKWIDTH,
                    health: 25,
                }
                setTimeout(function() {
                    enemyTankType1.push(spawnedTank);
                }, tank.spawnTime * 1000);
                setTimeout(function() {
                    spawnedTank.status = "SPAWNINGSTAGE2";
                }, (tank.spawnTime + 1) * 1000);
                setTimeout(function() {
                    spawnedTank.status = "ALIVE";
                }, (tank.spawnTime + 2) * 1000);
            } else if(tank.type === 2) {
                const spawnedTank = {
                    status: "SPAWNINGSTAGE1",
                    direction: "TOP",
                    x: tank.x * BLOCKWIDTH,
                    y: tank.y * BLOCKWIDTH,
                    width: BLOCKWIDTH,
                    height: BLOCKWIDTH,
                    health: 50,
                }
                setTimeout(function() {
                    enemyTankType2.push(spawnedTank);
                }, tank.spawnTime * 1000);
                setTimeout(function() {
                    spawnedTank.status = "SPAWNINGSTAGE2";
                }, (tank.spawnTime + 1) * 1000);
                setTimeout(function() {
                    spawnedTank.status = "ALIVE";
                }, (tank.spawnTime + 2) * 1000);
            }
        }
    })



}