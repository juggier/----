import * as THREE from '../build/three.module.js';
import {Weapon} from "./Weapon.js";

//type:1-小型单位，2-中型单位，3-大型单位
//建议直接获取information数组以获取信息
//单位信息整合数组："information"：[id,name,health,defense,move_speed,cooling,armour,visibility,weapon_id,type]
class Chess extends THREE.Object3D {

    constructor() {

        super();

        this.materials = []//存储左右两个材质

        this.type = 'Chess';
        this.pos = undefined;
        this.elevation = undefined;
        this.row = undefined;
        this.colume = undefined;
        this.color = undefined;//0是红队，1是蓝队

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
        this.type = undefined;

    }

    //攻击
        //伤害计算函数
    cal_harm(weapon_Information,enemy_Information) {
        //EnemyPiece [id name health defense move_speed cooling armour visibility type]
        //Weapon [id name attack range anti_armoured cooling type] 7项
        //piece_type:1-轻单位 2-中型单位 3-重型单位
        //weapon_type:1-轻武器 2-火炮类武器 3-导弹类武器
        //轻单位（1）  ----对轻武器效果（1）：防御力*0.7----对火炮武器效果（2）：防御力*1.1----对导弹类武器效果（3）：防御力*1.5
        //中型单位（1）----对轻武器效果（1）：防御力*1.2----对火炮武器效果（2）：防御力*0.7----对导弹类武器效果（3）：防御力*0.8
        //重型单位（1）----对轻武器效果（1）：防御力*2  ----对火炮武器效果（2）：防御力*1.2----对导弹类武器效果（3）：防御力*0.6
        let this_enemy_type = enemy_Information.information[8];
        var this_enemy_is_armour = enemy_Information.information[6];
        var this_enemy_defense = enemy_Information.information[3];

        var this_weapon_type = weapon_Information[6];
        var this_weapon_anti_armour = weapon_Information[4];
        var this_weapon_attack = weapon_Information[2];
        //var this_weapon_range = choose_weapon_obj[3];
        var this_weapon_cooling = weapon_Information[5];
        var harm_sum = 0;

        console.log("敌人类型：" + this_enemy_type + "敌人是否装甲单位：" + this_enemy_is_armour +
            "武器类型:" + this_enemy_type + "武器是否能击穿装甲单位：" + this_weapon_anti_armour);

        if (this_enemy_is_armour == true) {
            if (this_weapon_anti_armour == true) {
                switch (this_enemy_type) {
                    case 1: //轻单位（1）  ----对轻武器效果（1）：防御力*0.7----对火炮武器效果（2）：防御力*1.1----对导弹类武器效果（3）：防御力*1.5
                        switch (this_weapon_type) {
                            case 1:
                                harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 0.7));
                            case 2:
                                harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 1.1));
                            case 3:
                                harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 1.5));

                        };
                    case 2: //中型单位（1）----对轻武器效果（1）：防御力*1.2----对火炮武器效果（2）：防御力*0.7----对导弹类武器效果（3）：防御力*0.8
                        switch (this_weapon_type) {
                            case 1:
                                harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 1.2));
                            case 2:
                                harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 0.7));
                            case 3:
                                harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 0.8));
                        };
                    case 3: //重型单位（1）----对轻武器效果（1）：防御力*2  ----对火炮武器效果（2）：防御力*1.2----对导弹类武器效果（3）：防御力*0.6
                        switch (this_weapon_type) {
                            case 1:
                                harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 2));
                            case 2:
                                harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 1.2));
                            case 3:
                                harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 0.6));
                        };
                }
                return harm_sum;
            } else {
                return null;
            }
        } else {
            switch (this_enemy_type) {
                case 1: //轻单位（1）  ----对轻武器效果（1）：防御力*0.7----对火炮武器效果（2）：防御力*1.1----对导弹类武器效果（3）：防御力*1.5
                    switch (this_weapon_type) {
                        case 1:
                            harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 0.7));
                        case 2:
                            harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 1.1));
                        case 3:
                            harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 1.5));

                    };
                case 2: //中型单位（1）----对轻武器效果（1）：防御力*1.2----对火炮武器效果（2）：防御力*0.7----对导弹类武器效果（3）：防御力*0.8
                    switch (this_weapon_type) {
                        case 1:
                            harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 1.2));
                        case 2:
                            harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 0.7));
                        case 3:
                            harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 0.8));
                    };
                case 3: //重型单位（1）----对轻武器效果（1）：防御力*2  ----对火炮武器效果（2）：防御力*1.2----对导弹类武器效果（3）：防御力*0.6
                    switch (this_weapon_type) {
                        case 1:
                            harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 2));
                        case 2:
                            harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 1.2));
                        case 3:
                            harm_sum = Math.round(this_weapon_attack - (this_enemy_defense * 0.6));
                    };
            }
            return harm_sum;
        }
    }
    //移动
    //销毁
    Destory(){
        this.visible = false;
    }
}

class Tank extends Chess{


    constructor(id,color,pos,elevation,row,colume){
        super();

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
            this.move_speed = 10;
            this.cooling = 0;
            this.armour = true;
            this.visibility = 9;
            this.weapon_id = [22, 23, 25];
            //this.position = [null, null, null, null, null];//[x,y,z,high,point_type]
            this.type = 3;
        }
        else if (color == 'blue'){
            this.information = [id, "tank_" + color, 12, 2, 8, 0, true, 11, 3];
            this.No = id;
            this.name = "tank_" + color;
            this.health = 12;
            this.defense = 2;
            this.move_speed = 8;
            this.cooling = 0;
            this.armour = true;
            this.visibility = 11;
            this.weapon_id = [21, 23, 25];
            //this.position = [null, null, null, null, null];//[x,y,z,high,point_type]
            this.type = 3;
        }

    }
}

class ArmouredVehicle extends Chess {
    constructor(id, color, pos, elevation, row, colume) {
        super();

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
            this.type = 2;
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
            this.type = 2;
        }

    }
}

class Infantry extends Chess {
    constructor(id, color, pos, elevation, row, colume) {
        super();

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
        this.move_speed = 3;
        this.cooling = 0;
        this.armour = false;
        this.visibility = 3;
        this.weapon_id = [24, 26];
        //this.position = [null, null, null, null, null];//[x,y,z,high,point_type]
        this.type = 1;

    }
}

export { Chess, Tank, ArmouredVehicle,Infantry };