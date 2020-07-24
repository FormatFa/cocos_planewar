// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from '../Game'
import Bullet from '../Bullet'
import Helpers from '../utils/Helpers'
import Enemy from '../Enemy'


// // 数据里的接口
// export interface EnemyData {
//     hp:number,
//     size:number,
//     spriteFrame:string,
//     direction:string,
//     bulletId:string,
//     type:string
// }

export class EnemyInfo {
    
    spriteFrame:cc.SpriteFrame
    hp:number
    size:number
    direction:string
    bulletId:string
    type:string

}
// 基本的敌人
export abstract class BaseEnemy {

    
    
    isDie=false
    moveDuration = 4 //移动到结束需要的时间
    rawHp = 0
    // 原始hp
    readonly rawInfo:EnemyInfo
    game:Game
    enemyInfo:EnemyInfo

    // enemy组件的对象
    enemy:Enemy
    

    

    // 收到子弹攻击时，默认hp-，小于0，
    beAttacked(bullet:Bullet) {

        this.enemyInfo.hp-=bullet.getHarm()
        
        console.log(`hp: ${this.enemyInfo.hp} / ${this.rawHp}`)
        if(this.enemyInfo.hp<=0) {
        this.isDie=true
        this.enemy.doDie()
        }
        

    }

    //  开始飞行时调用，默认开始循环发射子弹
    onFly() {
        this.rawHp = this.enemyInfo.hp
        this.startAttack()
    }

    
    // 移动到屏幕顶端，默认不移动
    getForwradAction():cc.ActionInterval {
            //移动到屏幕前面
        // let forward = cc.moveTo(1,cc.v2(this.enemy.node.x,this.game.gameHeight/2-this.enemy.node.height))    
        let forward = cc.moveBy(1,cc.v2(0,0))
        return forward;
        
    }
    // 获取默认的移动action。callback表示执行完后的回调，用来回收到对象池
    getMoveAction(moveDoneCallback:()=>void):cc.ActionInterval {
        let inAction = cc.fadeIn(1) //出现
        //移动一个屏幕距离
        let action = cc.moveBy(this.moveDuration,cc.v2(0,-this.game.gameHeight-this.game.gameHeight/2)) 
        //后消失
        let callBack = cc.callFunc(moveDoneCallback,this)
        return cc.sequence(inAction,action,callBack)
    }

    // 获取消失的Action
    getDieAction(dieDoneCallback:()=>void):cc.ActionInterval {
        let dieFunc = cc.callFunc(dieDoneCallback,this)
        let dieAction = cc.sequence(cc.fadeOut(1.0),dieFunc)// 1秒内消失
        return cc.sequence(dieAction,dieFunc)
    }


    
    // 实现定时发射攻击的逻辑，开始定时发射子弹。
    startAttack() {
        
        // 间隔1,重复3,延迟0
        this.enemy.schedule(this.onSchedule.bind(this),1,cc.macro.REPEAT_FOREVER,0)
    }
    // 开始攻击 定时器的回调
    onSchedule() {
        
        this.enemy.doAttack(this.enemyInfo.bulletId)
    }

      // 随机生成位置
    getEnemyPosition() {

        let randX =  Helpers.randomRange(0,this.game.gameWidth)-this.game.gameWidth/2;
        // 在屏幕后面一半距离里随机出现
        let randY =  Helpers.randomRange(0,this.game.gameHeight/2) + this.game.gameHeight/2

        return cc.v2(randX,randY)        
    }
 

}


export class Soldier extends BaseEnemy {

}
//特殊实现
export class Boss extends BaseEnemy
{

    // 移动到屏幕顶端，默认不移动
    getForwradAction():cc.ActionInterval {
        //移动到屏幕前面
    let forward = cc.moveTo(1,cc.v2(0,this.game.gameHeight/2-this.enemy.node.height))    
    // let forward = cc.moveBy(1,cc.v2(0,0))
    return forward;
    
}
    // boss在顶部徘徊，不直接飞过
    getMoveAction(moveDoneCallback:()=>void):cc.ActionInterval {
        
        // 左右移动
        let rightMove = cc.moveBy(2,cc.v2(100,0))
        let leftMove = cc.moveBy(2,cc.v2(-100,0))

        let right_left = cc.sequence(rightMove,leftMove).repeatForever()//forever没有生效？
        
        return right_left
    }
    
}
export class EnemyFactory {

    static getEnemy(enemyType:String):BaseEnemy {
        switch(enemyType) {
            case "soldier":
                return new Soldier()
            case "boss":
                return new Boss()
        }
        return null

    }

}