// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let _nowLevelData = null
export function setLevelData(levelData){
    _nowLevelData = levelData
}
 
export function getLevelData() {
    return _nowLevelData
}
