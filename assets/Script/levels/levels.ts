// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import levelTemplate from "./levelTemplate";

import {setLevelData} from '../data/Status'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Levels extends cc.Component {

    @property(cc.JsonAsset)
    levels: cc.JsonAsset = null; //关卡数据

    @property(cc.Prefab)
    levelItemPrefab:cc.Prefab = null //



    

    // 贴图资源
    bullteSpriteFrames:{}[] = []
    // 当前选择的关卡数据
    nowLevel= null

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        //不知为何 会加载两次，第一次是空的
        if(this.levelItemPrefab==null)return;

        console.log("Level on load...")
        
        // 设置为常驻节点，切换时不会被销毁
        cc.game.addPersistRootNode(this.node)
        
        this.loadLevelData()//加载关卡数据，添加节点
        
    }
    loadLevelData() {
        let levelsJson = this.levels.json['levels']


        // 根据模板动态添加level到节点.遍历item，生成节点,初始化节点的数据
        for(let i =0;i<levelsJson.length;i+=1)
        {
         

            let item = cc.instantiate(this.levelItemPrefab)
         
            let data = levelsJson[i]
            this.node.addChild(item)
            let temp = (item.getComponent("levelTemplate") as levelTemplate )
            temp.init(data,this.openLevel)
        }
    }
 

// 进入关卡，切换到游戏场景
    openLevel(levelData:object) {
        console.log("进入关卡:")
        console.log(levelData)
        console.log(this)
        this.nowLevel = levelData
        setLevelData(levelData)

        cc.director.loadScene("game")
    }
    start () {

    }

    // update (dt) {}
}
