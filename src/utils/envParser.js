
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
    const InvunerableBuffsArr = [];
    let Player = {};
    for(let rowIndex = 0; rowIndex < 12; rowIndex++) {
        for(let columnIndex = 0; columnIndex < 14; columnIndex++) {
            switch(initTwoDimensionalArrayData[rowIndex][columnIndex]) {
                case 1:
                    GrassBlocksArr.push({
                        x: columnIndex * BLOCKWIDTH,
                        y: rowIndex* BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH
                    })
                    break;
                case 2:
                    SteelBlocksArr.push({
                        x: columnIndex * BLOCKWIDTH,
                        y: rowIndex * BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH
                    })
                    break;
                case 3:
                    WallsBlockArr.push({
                        x: columnIndex * BLOCKWIDTH,
                        y: rowIndex * BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH,
                        health: 50
                    })
                    break;
                case 4:
                    WaterBlockArr.push({
                        x: columnIndex * BLOCKWIDTH,
                        y: rowIndex * BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH
                    })
                    break;  
                case 5:
                    EnemyBasicTankArr.push({
                        status: "ALIVE",
                        direction: "TOP",
                        x: columnIndex * BLOCKWIDTH,
                        y: rowIndex * BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH,
                        health: 25,
                    })
                    break;      
                case 6:
                    Player = {
                        status: "ALIVE",
                        direction: "TOP",
                        x: columnIndex * BLOCKWIDTH,
                        y: rowIndex * BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH
                    }
                    break;
                case 7:
                    EnemyTankType2Arr.push({
                        status: "ALIVE",
                        direction: "TOP",
                        x: columnIndex * BLOCKWIDTH,
                        y: rowIndex * BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH,
                        health: 50,
                    })
                    break;
                case 8:
                    InvunerableBuffsArr.push({
                        x: columnIndex * BLOCKWIDTH,
                        y: rowIndex * BLOCKWIDTH,
                        width: BLOCKWIDTH,
                        height: BLOCKWIDTH
                    })
                    break;
                default:
                
            }
        }   
    }
    return {
        InvunerableBuffsArr,
        SteelBlocksArr, 
        GrassBlocksArr, 
        WallsBlockArr, 
        WaterBlockArr, 
        EnemyBasicTankArr, 
        Player, 
        EnemyTankType2Arr
    }
}







