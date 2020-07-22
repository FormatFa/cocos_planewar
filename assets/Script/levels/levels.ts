// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.JsonAsset)
    levels: cc.JsonAsset = null; //关卡数据

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        // 根据模板动态添加level到节点
        

    }

    start () {

    }

    // update (dt) {}
}
