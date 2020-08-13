
// 1 represents Grass 2 represents SteelBlock 3 represents WallsBlock 4 Represents Water 5 represents enemy
// 6 represents player 7 represents enemeytank type 2
const BLOCKWIDTH = 60;

export function parseInitEnvDataToGameWorld(initTwoDimensionalArrayData) {
    const SteelBlocksArr = [];
    const GrassBlocksArr = [];
    const WallsBlockArr = [];
    const WaterBlockArr = [];
    const EnemyBasicTankArr = [];
    const EnemyTankType2Arr = [];
    let Player = {};
    for(let rowIndex = 0; rowIndex < 12; rowIndex++) {
        for(let columnIndex = 0; columnIndex < 14; columnIndex++) {
            switch(initTwoDimensionalArrayData[rowIndex][columnIndex]) {
                case 1:
                    GrassBlocksArr.push({
                        x: columnIndex * BLOCKWIDTH,
                        y:  rowIndex* BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH
                    })
                    break;
                case 2:
                    SteelBlocksArr.push({
                        x: columnIndex * BLOCKWIDTH,
                        y:  rowIndex* BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH
                    })
                    break;
                case 3:
                    WallsBlockArr.push({
                        x: columnIndex * BLOCKWIDTH,
                        y:  rowIndex* BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH,
                        health: 50
                    })
                    break;
                case 4:
                    WaterBlockArr.push({
                        x: columnIndex * BLOCKWIDTH,
                        y:  rowIndex* BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH
                    })
                    break;  
                case 5:
                    EnemyBasicTankArr.push({
                        direction: "TOP",
                        x: rowIndex * BLOCKWIDTH,
                        y: columnIndex * BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH
                    })
                    break;      
                case 6:
                    Player = {
                        direction: "TOP",
                        x: rowIndex * BLOCKWIDTH,
                        y: columnIndex * BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH
                    }
                    break;
                case 7:
                    EnemyTankType2Arr.push({
                        direction: "TOP",
                        x: rowIndex * BLOCKWIDTH,
                        y: columnIndex * BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH,
                        health: 50,
                    })
                    break;
                default:
                
            }
        }   
    }
    return {
        SteelBlocksArr, GrassBlocksArr, WallsBlockArr, WaterBlockArr, EnemyBasicTankArr, Player, EnemyTankType2Arr
    }
}







