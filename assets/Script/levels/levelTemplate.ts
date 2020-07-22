// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    level = 0

    @property(cc.Label)
    levelText: cc.Label = null

    @property(cc.Label)
    levelName:cc.Label = null

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // 数据接收处理后
    init(data) {
        this.levelText.string = "L"+data.level
        this.levelName.string = data.name

    }

    // update (dt) {}
}
