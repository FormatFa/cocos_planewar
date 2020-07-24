// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Game from './Game'

@ccclass
export default class Bullet extends cc.Component {

    @property
    moveDuration = 1 //运动时间

    //Game对象，用于回收子弹
    game:Game = null
    
    moveAction:cc.ActionInterval

    from:cc.Node //来自谁的子弹
    // LIFE-CYCLE CALLBACKS:
    _harm = 1 //伤害
    _size = 1 //缩放倍数
    

    onLoad () {
        console.log("on load bullet")
        // 开始位置到屏幕顶部

    }


    start () {

    }

    // 设置
    equip(data,spriteFrame:cc.SpriteFrame) {

        this.getComponent(cc.Sprite).spriteFrame = spriteFrame

        this._harm = data['harm']
        this._size = data['size']

        this.node.setScale(this._size)
    }

    // 开始移动子弹
    fly() {
        
        this.moveAction = this.loadAction()
          // 飞行轨迹
        this.node.runAction(this.moveAction)
        
    }
    getHarm() {
        return this._harm;
    }
    // update (dt) {}

    // 加载动作，根据不同方，运动的方向也不一样
    loadAction() {
        
    let callback = cc.callFunc(this._removeBullet,this)

    let forwards = null;

     if(this.from.name=="enemy")    {
        forwards =  cc.moveBy(this.moveDuration,cc.v2(0, -this.game.gameHeight))
     }
     else if(this.from.name=="player") {
        forwards =  cc.moveBy(this.moveDuration,cc.v2(0, +this.game.gameHeight))
     }
     
    return cc.sequence(forwards,callback)
    }


    // 回收子弹
    doDie() {
        this._removeBullet()
    }

    _removeBullet() {
        
        this.game.recycleBullet(this.node)
        
    }


    // 碰撞产生时
    onCollisionEnter(other:cc.BoxCollider,self:cc.BoxCollider) {

        

    
        // // player子弹和敌人相撞时
        // if( fromname=="player" && othername=="enemy") {
        //     other.getComponent("Enemy").die() //敌人消失
        // }        
    }  
    // 产生还没结束
    onCollisionStay(other:cc.BoxCollider,self:cc.BoxCollider)  {

    }
    // 碰撞结束了
    onCollisionExit(other:cc.BoxCollider,self:cc.BoxCollider)  {
        
    }


}
