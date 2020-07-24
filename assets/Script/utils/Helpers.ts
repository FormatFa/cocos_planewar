// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

// 工具类
export default class Helpers {

    /**
     * 产生指定范围内的随机数
     */
    static  randomRange(start:number,end:number) {

        return start + Math.floor(Math.random()*(end-start))
    }


}