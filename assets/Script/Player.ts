// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game";
import Direction from  './utils/Direction'
const {ccclass, property} = cc._decorator;


@ccclass
export default class Player extends cc.Component {

    @property
    moveSpeed = 0 //飞机移动速度

    @property(cc.Prefab) //普通子弹
    bulletPrefab:cc.Prefab = null

    @property(Game)
    game:Game = null

    

    // 子弹对象池
    bulletPool:cc.NodePool

    nowDirection:Direction = Direction.STAND //当前移动方向
    isRunning = false

    canvasWidth=0
    canvasHeight=0



    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this)

        this.canvasWidth = this.node.parent.width;
        this.canvasHeight = this.node.parent.height;


        this.bulletPool = new cc.NodePool()
        for(let i=0;i<30;i+=1) {
            let bullet = cc.instantiate(this.bulletPrefab)
            bullet.getComponent("Bullet").player = this
            this.bulletPool.put(bullet)
        }

        
    }
    startGame() {
        
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
                // this.openFire()
                // 
                this.game.openCarrotFire(this.node)
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



    // 发射
    openFire() {
        console.log("open fire..")
        // let node = cc.instantiate(this.bulletPrefab)
        // 每隔一会发射一次
        this.schedule(function(){
            let bullet = null;
            if(this.bulletPool.size()>0)
            {
                bullet = this.bulletPool.get()
            }
            else
            {
                bullet = cc.instantiate(this.bulletPrefab)
                bullet.getComponent("Bullet").player = this
            }
            // bullet是player的child,位置是0就是和player一样
            bullet.setPosition(cc.v2(0,this.node.height/2))
            this.node.addChild(bullet)
            bullet.getComponent("Bullet").fly()
        },1/5,5,0)
        // for(let i=0;i<5;i+=1) {
        //     let bullet = null;
        //     if(this.bulletPool.size()>0)
        //     {
        //         bullet = this.bulletPool.get()
        //     }
        //     else
        //     {
        //         bullet = cc.instantiate(this.bulletPrefab)
        //         bullet.getComponent("Bullet").player = this
        //     }
        //     // bullet是player的child,位置是0就是和player一样
        //     bullet.setPosition(cc.v2(0,this.node.height/2))
        //     this.node.addChild(bullet)
        //     bullet.getComponent("Bullet").fly()
        // }




    }

    recycleBullet(bullet) {
        this.bulletPool.put(bullet)
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
