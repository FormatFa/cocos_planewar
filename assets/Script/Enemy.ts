// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property
    moveDuration = 10 //移动时间，一个屏幕距离

    moveAction:cc.ActionInterval = null //移动的action
    dieAction:cc.ActionInterval = null //消失的action

    game:Game = null
    isDie = true

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log("onload..")
        
    }

    // 设置移动和被击中的action
    loadAction() {

        // 先fadein出来，因为nodepool里重新使用时还是fadeout后的

        let inAction = cc.fadeIn(1)

        // 移动范围是游戏画面高度+一半
        let action = cc.moveBy(this.moveDuration,cc.v2(0,-this.game.gameHeight-this.game.gameHeight/2))
        let callBack = cc.callFunc(this.removeEnemy,this)
        this.moveAction = cc.sequence(inAction,action,callBack)

        let dieFunc = cc.callFunc(this.dieCallback,this)
        this.dieAction = cc.sequence(cc.fadeOut(1.0),dieFunc)// 1秒内消失

    }
    fly() {
        this.isDie = false

        this.loadAction()
    
        this.node.runAction(this.moveAction)

        // 敌人定时发射子弹，每秒一次，重复4次,2秒后开始
        this.schedule(function(){    
            // 死了就不发了
            if(this.isDie){this.unschedule(this.callback)}
            else
            this.game.openStarFire(this.node)
        },2,4,2)
    }

    // 被子弹击中调用，Bullet里调用
    die() {
        
        if(this.isDie)return;
        this.isDie = true
        console.log("die..")
        this.node.runAction(this.dieAction)
    }

    start () {
        console.log("start..")
        
    }

    // 通知加分，
    dieCallback() {
        // TODO: add score
        this.node.stopAllActions()
        this.removeEnemy()

    }
    removeEnemy() {
        this.game.recycleEnemy(this.node)
    }

    
    // update (dt) {}
}
