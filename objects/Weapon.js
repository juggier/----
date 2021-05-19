function Weapon(){
    
    this.weaponlist = {
        //[id name attack range anti_armoured cooling type] 7项
        //weapon_type:1-轻武器 2-火炮类武器 3-导弹类武器
        "21": [21, "tank_gun_heavy", 4, 11, true, 5, 2],
        "22": [22, "tank_gun_medium", 3, 10, true, 4, 2],
        "23": [23, "tank_light_machinegun", 4, 5, false, 5, 1],
        "24": [24, "infantry_machinegun", 3, 4, false, 5, 1],
        "25": [25, "missile", 6, 20, true, 15, 3],
        "26": [26, "infantry_missile", 5, 6, true, 10, 3],
    }

    let weapon = {
        "tank_gun_heavy": {
            "id": 21,
            "name": "tank_gun",
            "attack": 4,
            "range": 11,
            "anti_armoured": true,
            "cooling": 5,
            "weapon_tpe": 2,
        },

        "tank_gun_medium": {
            "id": 22,
            "name": "tank_gun_medium",
            "attack": 3,
            "range": 10,
            "anti_armoured": true,
            "cooling": 4,
            "weapon_tpe": 2,
        },

        "tank_light_machinegun": {
            "id": 23,
            "name": "tank_light_machinegun",
            "attack": 4,
            "range": 5,
            "anti_armoured": false,
            "cooling": 5,
            "weapon_tpe": 1,
        },

        "infantry_machinegun": {
            "id": 24,
            "name": "infantry_machinegun",
            "attack": 3,
            "range": 4,
            "anti_armoured": false,
            "cooling": 5,
            "weapon_tpe": 1,
        },

        "missile": {
            "id": 25,
            "name": "missile",
            "attack": 6,
            "range": 20,
            "anti_armoured": true,
            "cooling": 15,
            "weapon_tpe": 3,
        },

        "infantry_missile": {
            "id": 26,
            "name": "infantry_missile",
            "attack": 5,
            "range": 4,
            "anti_armoured": true,
            "cooling": 10,
            "weapon_tpe": 3,
        },
    }
}
export{Weapon};
