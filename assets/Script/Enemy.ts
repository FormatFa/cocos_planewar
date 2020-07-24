// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
import Direction from  './utils/Direction'
import Bullet from "./Bullet";
import {EnemyInfo,BaseEnemy} from './enemy/EnemyFactory'
const {ccclass, property} = cc._decorator;

// 敌人组件，在Game.ts里生成节点获取
@ccclass
export default class Enemy extends cc.Component {


    forwardAction:cc.ActionInterval = null //向前移动到屏幕顶端
    moveAction:cc.ActionInterval = null //继续移动的action
    dieAction:cc.ActionInterval = null //消失的action

    game:Game = null


    // enemy的实现信息
    _enemyItem:BaseEnemy


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }



    // 设置enemy
    setEnemy(enemy:BaseEnemy) {

        this._enemyItem = enemy

          // 设置当前组件到enemy
        this._enemyItem.enemy = this

        //
        this.node.setPosition(this._enemyItem.getEnemyPosition())

        // 获取移动的action,移动完成后，调用回收
        this.moveAction = enemy.getMoveAction(this.removeEnemy.bind(this))
        this.forwardAction = enemy.getForwradAction()
        this.dieAction = enemy.getDieAction(this.removeEnemy.bind(this))

    
        // 缩放大小
        this.node.setScale(this._enemyItem.enemyInfo.size)


    }


    // 开始飞行
    doFly() {

        this._enemyItem.isDie = false
        // this.node.runAction(this.forwardAction)
        // this.node.runAction(this.moveAction)

        this.node.runAction(cc.sequence(this.forwardAction,this.moveAction))
        this._enemyItem.startAttack() //攻击
        
    }

    // 发射子弹攻击，由具体的Enemy调用
    doAttack(bulletId:string) {
        
        
        this.game.attack(this.node,bulletId)
    }


    //消失
    doDie() {
        console.log("die..")
        this.node.runAction(this.dieAction)
    }

    start () {
        
    }


    // 回收
    removeEnemy() {
        this.game.recycleEnemy(this.node)
    }

     // 碰撞产生时
     onCollisionEnter(other:cc.BoxCollider,self:cc.BoxCollider) {

        // 对方子弹击中
            if(other.node.name=="bullet") {
                
                let bullet:Bullet = other.node.getComponent(Bullet)

                console.log("碰撞到enemy:"+bullet.from.name)
                
                if(bullet.from==null)return;
                // 对方的子弹
                if(bullet.from.name=="player") {
                    // 删除子弹
                    this._enemyItem.beAttacked(bullet)
                    // 移动掉子弹，消失
                    bullet.node.x=3000
                }
            }      
    } 

    update (dt) {

    }
}
