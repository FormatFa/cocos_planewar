// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Bullet from "./Bullet";
import {getLevelData} from './data/Status'
import Enemy from "./Enemy";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab) //普通子弹
    bulletPrefab:cc.Prefab = null

    @property(cc.Prefab) //星子弹
    bulletStarPrefab:cc.Prefab = null

    @property(cc.Prefab) //enemy
    enemyPrefab:cc.Prefab = null

    // 敌人配置数据
    @property(cc.JsonAsset)
    enemiesdataJson:cc.JsonAsset = null
    // 子弹配置数据
    @property(cc.JsonAsset)
    bulletsdataJson:cc.JsonAsset = null

    // 当前波敌人数据
    @property(cc.Label)
    enemyInfoLabel:cc.Label



    // 敌人贴图资源
    _enemiesSpriteFrame = {}
    // 子弹贴图资源
    _bulletsSpriteFrame = {}


    // 当前关卡的敌人数据
    enemies:[] = null
    wave = 0 //第几波

    // 敌人的信息
    _enemiesdata = null
    // 子弹信息
    _bulletsdata = null

    // 子弹对象池
    bulletPool:cc.NodePool
    bulletStarPool:cc.NodePool

    // enemy pool
    enemyPool:cc.NodePool

    gameWidth = 0
    gameHeight = 0
    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        console.log("load game...")
        this.initData()
        this.gameWidth = this.node.width
        this.gameHeight = this.node.height

        // this.generateEnemySchedule()
        this.loadEnemyData()
        this.loadResources()
    }

    // 加载敌人数据
    loadEnemyData() {
        let levelData = getLevelData()
        console.log("levelComp:"+levelData)
        this.enemies = levelData['enemies']
    }

    // 加载资源
    loadResources() {

        this._enemiesdata = this.enemiesdataJson.json
        this._bulletsdata = this.bulletsdataJson.json


        // 加载贴图资源，保存到对象，用于生成敌人时设置
        cc.resources.loadDir("enemies",cc.SpriteFrame,(error:Error,assets:cc.Asset[])=>{
            console.log("加载enemy资源完成..")
            assets.forEach(value=>this._enemiesSpriteFrame[value.name]=value)
            console.log(this._enemiesSpriteFrame    )
            // 生成敌人
            this.generateEnemySchedule()
            })
        cc.resources.loadDir("bullets",cc.SpriteFrame,(error:Error,assets:cc.Asset[])=>{
            console.log("加载bullets资源完成..")
            assets.forEach(value=>this._bulletsSpriteFrame[value.name]=value)
 
            })
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


    // 发射子弹
    attack(who:cc.Node,bulletId:string) {
        let bulletData = this._bulletsdata[bulletId]

        for(let i = 0;i<5;i+=1) {

            let bullet:cc.Node = null;
            if(this.bulletPool.size()>0)
            {
                bullet = this.bulletPool.get()
            }
            else
            {
                bullet = cc.instantiate(this.bulletPrefab)
                bullet.getComponent("Bullet").game = this
            }
            let comp = bullet.getComponent("Bullet") as Bullet
            
            comp.from = who
            comp.equip(bulletData,this._bulletsSpriteFrame[bulletData['spriteFrame']])

            // 位置是0就是和player一样，player的锚点在中间，要在上面显示再加上高度一半
            if(who.name=="enemy")
             bullet.setPosition(cc.v2(who.x, who.y-who.height/2))
            else bullet.setPosition(cc.v2(who.x, who.y+who.height/2))   

            this.node.addChild(bullet)
            comp.fly()
        }

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



    // 根据关卡敌人数据 定时生成敌人
    generateEnemySchedule() {

        // this.generateEnemy(3,"purple2")
        
        this.schedule(() =>{
            let waveEnemies = this.enemies[this.wave]
            this.generateEnemy(waveEnemies['count'],waveEnemies['enemyId'])
            this.wave +=1;
        },6,this.enemies.length-1,0)
    }

    // 根据配置生成敌人，随机出现指定数量，类型的
    generateEnemy(count:number,enemyId:string) {

        this.enemyInfoLabel.string = `wave:${this.wave} count:${count} enemyId: ${enemyId}`
        let enemydata = this._enemiesdata[enemyId]

        console.log("generate enemy...")
        for(let i=0;i<count;i+=1)
        {

            // 锚点在中心，x随机出现在正负一半里
            let randX =  Math.random()*this.gameWidth-this.gameWidth/2;
            // 在屏幕后面一半距离里随机出现
            let randY =  this.gameHeight/2+  Math.random()*(this.gameHeight/2)

            let enemy:cc.Node = null;

            if(this.enemyPool.size()>0)
            {
                enemy = this.enemyPool.get()
            }
            else {
                enemy = cc.instantiate(this.enemyPrefab)
                enemy.getComponent(Enemy).game = this
            }
            let comp = enemy.getComponent(Enemy)

            comp.equip(
                this._enemiesSpriteFrame[enemydata['spriteFrame']],enemydata['hp'],enemydata['size'],enemydata['direction'],
                enemydata['bulletId']

            )

            enemy.setPosition(randX,randY)
            
            this.node.addChild(enemy)
            comp.fly() //启动飞机
            
        }


    }

   

    // getEnemy():Enemy{

    //     let enemy =
    //     if(this.enemyPool.size()>0)
    //         {
    //             enemy = this.enemyPool.get()
    //         }
    //         else {
    //             enemy = cc.instantiate(this.enemyPrefab)
    //             enemy.getComponent("Enemy").game = this
    //         }
    // }
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




     update (dt) {
         
     }
}
