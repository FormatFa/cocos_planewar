// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab) //普通子弹
    bulletPrefab:cc.Prefab = null

    @property(cc.Prefab) //星子弹
    bulletStarPrefab:cc.Prefab = null

    @property(cc.Prefab) //enemy
    enemyPrefab:cc.Prefab = null




    // 子弹对象池
    bulletPool:cc.NodePool
    bulletStarPool:cc.NodePool

    // enemy pool
    enemyPool:cc.NodePool


    gameWidth = 0
    gameHeight = 0
    // LIFE-CYCLE CALLBACKS:

    onLoad () {



        this.initData()
        this.gameWidth = this.node.width
        this.gameHeight = this.node.height

        this.generateEnemySchedule()


        this.loadResources()
    }

    // 加载资源
    loadResources() {

    }


    // 初始化数据
    initData() {

        this.bulletPool = new cc.NodePool()
        for(let i=0;i<30;i+=1) {
            let bullet = cc.instantiate(this.bulletPrefab)
            
            bullet.getComponent("Bullet").game = this
            this.bulletPool.put(bullet)
        }
        this.bulletStarPool = new cc.NodePool()
        for(let i=0;i<30;i+=1) {
            let bullet = cc.instantiate(this.bulletStarPrefab)
            
            bullet.getComponent("Bullet").game = this
            this.bulletStarPool.put(bullet)
        }

        this.enemyPool = new cc.NodePool()
        for(let i =0;i<10;i+=1)
        {
            let enemy = cc.instantiate(this.enemyPrefab)
            enemy.getComponent("Enemy").game = this
            this.enemyPool.put(enemy)
        }
        // CollisionManager
        let manager = cc.director.getCollisionManager()

        manager.enabled = true
        manager.enabledDebugDraw = true

    }


    start () {

    }



    // 发射星星的子弹
    openStarFire(who:cc.Node) {
        this.openFire(who, this.bulletStarPool, this.bulletStarPrefab)

    }
    openCarrotFire(who:cc.Node) {
        this.openFire(who, this.bulletPool, this.bulletPrefab)
    }
    /**
     * 
     * @param who 
     * @param bulletPool 
     * @param prefab 
     */
    openFire(who:cc.Node,bulletPool:cc.NodePool,prefab:cc.Prefab) {

        this.schedule(function(){

            // 如果敌人击中了消失了，就取消定时器
            if(who.name=="enemy" && who.getComponent("Enemy").isDie)
            {
                this.unschedule(this.callback)
            }

            let bullet:cc.Node = null;
            if(bulletPool.size()>0)
            {
                bullet = bulletPool.get()
            }
            else
            {
                bullet = cc.instantiate(prefab)
                bullet.getComponent("Bullet").game = this
            }
            
            bullet.getComponent("Bullet").from = who

            // 位置是0就是和player一样，player的锚点在中间，要在上面显示再加上高度一半
            if(who.name=="enemy")
             bullet.setPosition(cc.v2(who.x, who.y-who.height/2))
            else bullet.setPosition(cc.v2(who.x, who.y+who.height/2))   

            this.node.addChild(bullet)
            bullet.getComponent("Bullet").fly()
            // 每隔1/5秒，发射一个，执行4+1次
        },1/5,4,0)

    }



    // 定时生成敌人
    generateEnemySchedule() {
        this.schedule(function () {
            this.generateEnemy()
        },5,10,0)
    }

    // 生成敌人，随机出现
    generateEnemy() {

        console.log("generate enemy...")
        for(let i=0;i<5;i+=1)
        {

            // 锚点在中心，x随机出现在正负一半里
            let randX =  Math.random()*this.gameWidth-this.gameWidth/2;
            // 在屏幕后面一半距离里随机出现
            let randY =  this.gameHeight/2+  Math.random()*(this.gameHeight/2)

            let enemy = null;
            if(this.enemyPool.size()>0)
            {
                enemy = this.enemyPool.get()
            }
            else {
                enemy = cc.instantiate(this.enemyPrefab)
                enemy.getComponent("Enemy").game = this
            }
            enemy.setPosition(randX,randY)
            console.log(`randX:${randX} randY: ${randY}`)
            this.node.addChild(enemy)
            enemy.getComponent("Enemy").fly()
        }


    }

    // update (dt) {}

    // 回收子弹
    recycleBullet(bullet:cc.Node) {
        
        if(bullet.name=="bullet")
        this.bulletPool.put(bullet)
        else
        this.bulletStarPool.put(bullet)
    }
    // 回收敌人
    recycleEnemy(enemy) {
        this.enemyPool.put(enemy)
    }
}
