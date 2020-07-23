// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class levelTemplate extends cc.Component {

    @property
    level = 0

    @property(cc.Label)
    levelText: cc.Label = null

    @property(cc.Label)
    levelName:cc.Label = null

    _data = null
    // 点击后回调
    _callback:(levelData:any)=>void
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // 点击事件
    onClick() {
        console.log("level template click:"+this.levelText.string)
        this._callback(this._data)
    }
    // 数据接收处理后
    init(data,callback:(levelData:any)=>void) {
        this.levelText.string = "L"+data.level
        this.levelName.string = data.name

        this._data = data
        this._callback = callback
    }

    // update (dt) {}
}
