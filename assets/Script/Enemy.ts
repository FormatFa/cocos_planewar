// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
import Direction from  './utils/Direction'
import Bullet from "./Bullet";
const {ccclass, property} = cc._decorator;


class EnemyInfo {
    
    spriteFrame:cc.SpriteFrame
    hp:number
    size:number
    direction:string
    bulletId:string

}

abstract class BaseEnemy {

    isDie=false

    readonly rawInfo:EnemyInfo
    constructor(public game:Game,public enemy:Enemy,public enemyInfo:EnemyInfo) {
        this.rawInfo = enemyInfo
    }

// this.game.attack(this.enemy.node,"")

// 收到子弹攻击时，默认hp-
    beAttacked(bullet:Bullet) {
        this.enemyInfo.hp-=bullet.getHarm()
    }

    // 获取默认的移动action
    getMoveAction() {
        let inAction = cc.fadeIn(1)
        let action = cc.moveBy(this.enemy.moveDuration,cc.v2(0,-this.game.gameHeight-this.game.gameHeight/2))
        let callBack = cc.callFunc(this.enemy.removeEnemy,this)
        return cc.sequence(inAction,action,callBack)
    }

}
class Soldier extends BaseEnemy {




}
class Boss extends BaseEnemy
{

    // beAttacked(bullet:Bullet) {

    // }
}

@ccclass
export default class Enemy extends cc.Component {

    @property
    moveDuration = 10 //移动时间，一个屏幕距离

    moveAction:cc.ActionInterval = null //移动的action
    dieAction:cc.ActionInterval = null //消失的action


    game:Game = null
    isDie = true

    _total_hp = 10 //原始的血量
    _hp = 10 //
    _size = 1.0  // 大小
    _direction:Direction //飞行方向
    _bulletId:string //子弹id




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
    // 设置大小(倍数)，贴图等
    equip(spriteFrame:cc.SpriteFrame,hp:number,size:number,direction:string,bulletId:string) {

        this.getComponent(cc.Sprite).spriteFrame = spriteFrame
        this._direction = Direction[direction]
        this._size = size
        this._hp = hp
        this._total_hp = hp
        this._bulletId = bulletId

        this.node.setScale(size)

    }
    fly() {
        this.isDie = false
        
        this.loadAction()
    
        this.node.runAction(this.moveAction)

        // 敌人定时发射子弹，每秒一次，重复4次,2秒后开始
        this.schedule(this.attack,2,4,2)
    }

    
    attack() {
        // this.game
        if(this.isDie)return;
        this.game.attack(this.node,this._bulletId)

    }

    // 被子弹击中调用，Bullet里调用
    die() {
        
        if(this.isDie)return;
        this.isDie = true
        this.unschedule(this.attack)
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

     // 碰撞产生时
     onCollisionEnter(other:cc.BoxCollider,self:cc.BoxCollider) {

        // 对方子弹击中
            if(other.node.name=="bullet") {
                let bullet = other.node.getComponent(Bullet)
                // 对方的子弹
                if(bullet.from.name=="player") {
                    
                    this._hp -= bullet.getHarm()

                    if(this._hp<0){
                        this.die()
                    }


                }
            }
        // let fromname = this.from.name
        // let othername = other.node.name

        // // player子弹和敌人相撞时
        // if( fromname=="player" && othername=="enemy") {
        //     other.getComponent("Enemy").die() //敌人消失
        // }        
    } 
    update (dt) {

    }
}
