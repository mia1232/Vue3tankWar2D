
// 1 represents Grass 2 represents SteelBlock 3 represents WallsBlock 4 Represents Water 5 represents enemy
const BLOCKWIDTH = 60;

const initTwoDimensionalArrayData = [[
    1,1,2,2,3,3,4,4,1,1,1,2,1,4,1,1
],[
    1,1,2,2,3,3,4,4,1,1,1,2,1,4,1,1
],[
    1,1,1,4,3,3,4,4,1,1,1,2,1,4,1,1
],[
    3,1,2,2,3,3,4,4,1,1,1,2,1,4,1,1
],[
    0,0,0,2,1,1,0,0,1,1,1,1,0,5,0,0
],[
    0,0,0,5,0,0,1,3,2,0,0,0,0,0,0,0
],[
    0,0,0,2,3,1,1,1,1,1,1,2,1,4,1,1
],[
    5,0,0,0,1,1,1,1,1,1,1,2,1,4,1,1
],[
    5,0,0,0,2,2,2,2,0,0,1,1,1,0,0,0
],[
    0,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0
],[
    0,0,0,0,0,0,0,0,6,2,2,2,0,0,1,2
],[
    2,3,4,5,0,0,0,0,0,0,0,0,0,0,0,0
],[
    0,0,0,0,0,0,0,0,1,1,1,0,0,2,2,2
],[
    0,0,0,0,0,1,1,1,3,3,3,3,3,3,0,0
],[
    0,0,0,0,0,0,3,3,3,3,1,1,1,2,2,0
],[
    0,0,0,0,0,0,0,0,0,0,1,0,1,1,1,1
]];
export function parseInitEnvDataToGameWorld() {
    const SteelBlocksArr = [];
    const GrassBlocksArr = [];
    const WallsBlockArr = [];
    const WaterBlockArr = [];
    const EnemyArr = [];
    let Player = {};
    for(let rowIndex = 0; rowIndex < 16; rowIndex++) {
        for(let columnIndex = 0; columnIndex < 16; columnIndex++) {
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
                    EnemyArr.push({
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
                default:
                
            }
        }   
    }
    return {
        SteelBlocksArr, GrassBlocksArr, WallsBlockArr, WaterBlockArr, EnemyArr, Player
    }
}







