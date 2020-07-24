// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
import Direction from  './utils/Direction'
import Bullet from './Bullet'
const {ccclass, property} = cc._decorator;


class PlayerInfo {
    constructor(public hp:number,public bulletId:string) {

    }
}
@ccclass
export default class Player extends cc.Component {

    @property
    moveSpeed = 0 //飞机移动速度

    @property(cc.Prefab) //普通子弹
    bulletPrefab:cc.Prefab = null

    @property(Game)
    game:Game = null
    
    playerInfo:PlayerInfo

    nowDirection:Direction = Direction.STAND //当前移动方向
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this)

        this.playerInfo = new PlayerInfo(100,"carrot")
        
    }
  

    onDestroy(){

    }

    start () {

    }

    // 按键事件回调
    onKeyDown(event:cc.Event.EventKeyboard){
        
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.nowDirection = Direction.LEFT;
                break;
            case cc.macro.KEY.d:
                this.nowDirection = Direction.RIGHT;
                break;
            case cc.macro.KEY.w:
                this.nowDirection = Direction.UP;
                break;
            case cc.macro.KEY.s:
                this.nowDirection = Direction.DOWN;
                break;
            case cc.macro.KEY.space:
                // 
                this.game.attack(this.node,this.playerInfo.bulletId)
                break;
            case cc.macro.KEY.b:
                let biggerAction = cc.scaleTo(2,5,5)
                this.node.runAction(biggerAction)
                break;
            case cc.macro.KEY.p:
                let rotateAction = cc.rotateBy(1,360).repeatForever()
                this.node.runAction(rotateAction)
                
        }

    }
    onKeyUp(event:cc.Event.EventKeyboard){
        switch(event.keyCode) {
            case cc.macro.KEY.a:if(this.nowDirection==Direction.LEFT)this.nowDirection = Direction.STAND;break;
            case cc.macro.KEY.d:if(this.nowDirection==Direction.RIGHT)this.nowDirection = Direction.STAND;break;
            case cc.macro.KEY.w:if(this.nowDirection==Direction.UP)this.nowDirection = Direction.STAND;break;
            case cc.macro.KEY.s:if(this.nowDirection==Direction.DOWN)this.nowDirection = Direction.STAND;break;
        }
    }


    
    onCollisionEnter(other:cc.BoxCollider,self:cc.BoxCollider) {

        // 对方子弹击中
            if(other.node.name=="bullet") {
                
                let bullet:Bullet = other.node.getComponent(Bullet)

                console.log("碰撞到enemy:"+bullet.from.name)
                
                if(bullet.from==null)return;
                // 对方的子弹
                if(bullet.from.name=="enemy") {


                    // 移动掉子弹，消失
                    bullet.node.x=3000
                    
                }
            }      
    } 

        

    update (dt) {

        // 根据速度方向设置位置
        switch(this.nowDirection) {
            case Direction.LEFT:
                this.node.x -= this.moveSpeed
                break;
            case Direction.RIGHT:
                this.node.x += this.moveSpeed
                break;
            case Direction.UP:
                this.node.y += this.moveSpeed
                break;
            case Direction.DOWN:
                this.node.y -= this.moveSpeed
                break;
        }

    }
}
