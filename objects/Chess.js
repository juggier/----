import * as THREE from '../build/three.module.js';

//type:1-小型单位，2-中型单位，3-大型单位
//建议直接获取information数组以获取信息
//单位信息整合数组："information"：[id,name,health,defense,move_speed,cooling,armour,visibility,weapon_id,size]
class Chess extends THREE.Object3D {

    constructor(map){

        super();
        this.map = map;
        this.changeEvent = { type: 'change' };

        this.materials = []//存储左右两个材质

        this.type = 'Chess';
        this.pos = undefined;
        this.elevation = undefined;
        this.row = undefined;
        this.colume = undefined;
        this.color = undefined;//'red'是红队，'blue'是蓝队
        this.category = undefined;//兵种分类

        this.information = undefined;
        this.No = undefined;
        this.name = undefined;
        this.health = undefined;
        this.defense = undefined;
        this.move_speed = undefined;
        this.cooling = undefined;
        this.armour = undefined;
        this.visibility = undefined;
        this.weapon_id = undefined;
        //this.position = [null, null, null, null, null];//[x,y,z,high,point_type]
        this.size = undefined;

        this.moveStack=[];
        this.speedTemp = 0;
        this.nextHex = null;
    }

    //攻击
    //移动
    //销毁
    Destory(){
        this.visible = false;
    }
    
    GetDomElement(){
        return this.domElment;
    }

    move() 
    {
        this.map.getrequest();

        this.speedLelf = Math.round((1/this.move_speed) * 200);//速度剩余（？），例如要走10s一格，则speedLeft = 10    //////--(Math.round(200 * (1/this.move_speed)))--//////

        if(this.nextHex == null && this.moveStack.length != 0)//若有路线且下一步无格子，则pop一个为下一步的格子
        {
            this.nextHex = this.moveStack.pop();
            //console.log(this.move_speed + "||" + this.speedLelf);
        }
        else if( this.nextHex != null)
        {
            if(this.speedTemp < this.speedLelf)
            {

                if(this.row % 2 ==1)//改变位置
                {
                    if(this.nextHex.x - this.row == -1 && this.nextHex.y - this.colume == 0)
                    {
                        this.position.x -= 8.66/this.speedLelf;
                        this.position.y += 15/this.speedLelf;
                    }
                    if(this.nextHex.x - this.row == -1 && this.nextHex.y - this.colume == 1)
                    {
                        this.position.x += 8.66/this.speedLelf;
                        this.position.y += 15/this.speedLelf;
                    }
                    if(this.nextHex.x - this.row == 0 && this.nextHex.y - this.colume == -1)
                    {
                        this.position.x -= 17.32/this.speedLelf;
                    }
                    if(this.nextHex.x - this.row == 0 && this.nextHex.y - this.colume == 1)
                    {
                        this.position.x += 17.32/this.speedLelf;
                    }
                    if(this.nextHex.x - this.row == 1 && this.nextHex.y - this.colume == 0)
                    {
                        this.position.x -= 8.66/this.speedLelf;
                        this.position.y -= 15/this.speedLelf;
                    }
                    if(this.nextHex.x - this.row == 1 && this.nextHex.y - this.colume == 1)
                    {
                        this.position.x += 8.66/this.speedLelf;
                        this.position.y -= 15/this.speedLelf;
                    }
                }
                else//改变位置
                {
                    if(this.nextHex.x - this.row == -1 && this.nextHex.y - this.colume == -1)
                    {
                        this.position.x -= 8.66/this.speedLelf;
                        this.position.y += 15/this.speedLelf;
                    }
                    if(this.nextHex.x - this.row == -1 && this.nextHex.y - this.colume == 0)
                    {
                        this.position.x += 8.66/this.speedLelf;
                        this.position.y += 15/this.speedLelf;
                    }
                    if(this.nextHex.x - this.row == 0 && this.nextHex.y - this.colume == -1)
                    {
                        this.position.x -= 17.32/this.speedLelf;
                    }
                    if(this.nextHex.x - this.row == 0 && this.nextHex.y - this.colume == 1)
                    {
                        this.position.x += 17.32/this.speedLelf;
                    }
                    if(this.nextHex.x - this.row == 1 && this.nextHex.y - this.colume == -1)
                    {
                        this.position.x -= 8.66/this.speedLelf;
                        this.position.y -= 15/this.speedLelf;
                    }
                    if(this.nextHex.x - this.row == 1 && this.nextHex.y - this.colume == 0)
                    {
                        this.position.x += 8.66/this.speedLelf;
                        this.position.y -= 15/this.speedLelf;
                    }
                }

                this.speedTemp += 1;
            }
            else
            {
                //改变行列
                this.row = this.nextHex.x;
                this.colume = this.nextHex.y;
                //console.log(this.name + "移动到了" + this.row +" "+ this.colume);

                //重置单格移动计时器
                this.speedTemp = 0;
                //重置下一格
                this.nextHex = null;
            }
        }
    }

    ThisToJson()
    {
        return{
            "information" : this.information,
            "No" : this.No,
            "name" : this.name,
            "health" : this.health,
            "defense" : this.defense,
            "move_speed" : this.move_speed,
            "cooling" : this.cooling,
            "armour" : this.armour,
            "visibility" : this.visibility,
            "weapon_id" : this.weapon_id,

            "visible" :this.visible,
            "moveStack" : this.moveStack,
            "speedTemp" : this.speedTemp,
            "nextHex" : this.nextHex,
        }
    }

    /* move() 
    {
        if(this.moveStack.length != 0)
        {
            //console.log("移动");
            //console.log(this.moveStack);
            let nextHex = this.moveStack.pop();


            if(this.row % 2 ==1)
            {
                if(nextHex.x - this.row == -1 && nextHex.y - this.colume == 0)
                {
                    this.position.x -= 8.66;
                    this.position.y += 15;
                }
                if(nextHex.x - this.row == -1 && nextHex.y - this.colume == 1)
                {
                    this.position.x += 8.66;
                    this.position.y += 15;
                }
                if(nextHex.x - this.row == 0 && nextHex.y - this.colume == -1)
                {
                    this.position.x -= 17.32;
                }
                if(nextHex.x - this.row == 0 && nextHex.y - this.colume == 1)
                {
                    this.position.x += 17.32;
                }
                if(nextHex.x - this.row == 1 && nextHex.y - this.colume == 0)
                {
                    this.position.x -= 8.66;
                    this.position.y -= 15;
                }
                if(nextHex.x - this.row == 1 && nextHex.y - this.colume == 1)
                {
                    this.position.x += 8.66;
                    this.position.y -= 15;
                }
            }
            else
            {
                if(nextHex.x - this.row == -1 && nextHex.y - this.colume == -1)
                {
                    this.position.x -= 8.66;
                    this.position.y += 15;
                }
                if(nextHex.x - this.row == -1 && nextHex.y - this.colume == 0)
                {
                    this.position.x += 8.66;
                    this.position.y += 15;
                }
                if(nextHex.x - this.row == 0 && nextHex.y - this.colume == -1)
                {
                    this.position.x -= 17.32;
                }
                if(nextHex.x - this.row == 0 && nextHex.y - this.colume == 1)
                {
                    this.position.x += 17.32;
                }
                if(nextHex.x - this.row == 1 && nextHex.y - this.colume == -1)
                {
                    this.position.x -= 8.66;
                    this.position.y -= 15;
                }
                if(nextHex.x - this.row == 1 && nextHex.y - this.colume == 0)
                {
                    this.position.x += 8.66;
                    this.position.y -= 15;
                }
            }

            //改变行列
            this.row = nextHex.x;
            this.colume = nextHex.y;

            //改变位置
            //this.position.x += move_x;
            //this.position.y += move_y;
            //this.position.z += move_z;
            console.log(this.name + "移动到了" + this.row +" "+ this.colume);
            //console.log("棋子的移动路线："+this.moveStack);
        }
    } */

}

class Tank extends Chess{


    constructor(map,id,color,pos,elevation,row,colume){
        super(map);
        this.type = 'Chess';
        this.category = 'Tank';
        this.pos = pos;
        this.elevation = elevation;
        this.row = row;
        this.colume = colume;
        this.color = color;

        if(color == 'red'){
            this.information = [id, "tank_" + color , 8, 3, 10, 0, true, 9, 3];
            this.No = id;
            this.name = "tank_" + color;
            this.health = 8;
            this.defense = 3;
            this.move_speed = 9;
            this.cooling = 0;
            this.armour = true;
            this.visibility = 9;
            this.weapon_id = [22, 23, 25];
            //this.position = [null, null, null, null, null];//[x,y,z,high,point_type]
            this.size = 3;
        }
        else if (color == 'blue'){
            this.information = [id, "tank_" + color, 12, 2, 8, 0, true, 11, 3];
            this.No = id;
            this.name = "tank_" + color;
            this.health = 12;
            this.defense = 2;
            this.move_speed = 9;
            this.cooling = 0;
            this.armour = true;
            this.visibility = 11;
            this.weapon_id = [21, 23, 25];
            //this.position = [null, null, null, null, null];//[x,y,z,high,point_type]
            this.size = 3;
        }

    }
}

class ArmouredVehicle extends Chess {
    constructor(map,id, color, pos, elevation, row, colume) {
        super(map);
        this.type = 'Chess';
        this.category = 'ArmouredVehicle'
        this.pos = pos;
        this.elevation = elevation;
        this.row = row;
        this.colume = colume;
        this.color = color;

        if (color == 'red') {
            this.information = [id, "armoured_vehicle_" + color, 5, 2, 13, 0, true, 7, 2];
            this.No = id;
            this.name = "armoured_vehicle_" + color;
            this.health = 5;
            this.defense = 2;
            this.move_speed = 13;
            this.cooling = 0;
            this.armour = true;
            this.visibility = 7;
            this.weapon_id = [23, 25];
            //this.position = [null, null, null, null, null];//[x,y,z,high,point_type]
            this.size = 2;
        } 
        else if (color == 'blue'){
            this.information = [id, "armoured_vehicle_" + color, 6, 2, 11, 0, true, 8, 2];
            this.No = id;
            this.name = "armoured_vehicle_" + color;
            this.health = 6;
            this.defense = 2;
            this.move_speed = 11;
            this.cooling = 0;
            this.armour = true;
            this.visibility = 8;
            this.weapon_id = [23, 25];
            //this.position = [null, null, null, null, null];//[x,y,z,high,point_type]
            this.size = 2;
        }

    }
}

class Infantry extends Chess {
    constructor(map,id, color, pos, elevation, row, colume) {
        super(map);
        this.type = 'Chess';
        this.category = 'Infantry';
        this.pos = pos;
        this.elevation = elevation;
        this.row = row;
        this.colume = colume;
        this.color = color;

        this.information = [id, "infantry_" + color, 5, 1, 3, 0, false, 3, 1];
        this.No = id;
        this.name = "infantry_" + color;
        this.health = 5;
        this.defense = 1;
        this.move_speed = 7;
        this.cooling = 0;
        this.armour = false;
        this.visibility = 3;
        this.weapon_id = [24, 26];
        //this.position = [null, null, null, null, null];//[x,y,z,high,point_type]
        this.size = 1;

    }
}

export { Chess, Tank, ArmouredVehicle,Infantry };