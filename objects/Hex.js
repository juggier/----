import * as THREE from '../build/three.module.js';

class Hex extends THREE.Object3D {

    constructor(pos,id,elevation){

        super();

        this.type = 'Object3D';
        this.name = id;
        this.pos = pos;
        this.elevation = elevation;
        this.point_Level = 0;
        this.land_Level = 0;
        this.row = undefined;
        this.colume = undefined;

        this.autoUpdate = true;

    }

    //六角网格的相关算法
    offset_to_cube(row, colume) {
    const x = row - (colume - (colume & 1)) / 2;
    const z = colume;
    const y = -x - z;
    return [x, y, z];
    }

    //以直角坐标查询周围网格
    offset_neighbor(direction) {
        const oddr_directions = [
            [0, +1], [-1, +1], [-1, 0], [0, -1], [+1, 0], [+1, +1]
        ];
        const dir = oddr_directions[direction];
        return [this.row + dir[0], this.colume + dir[1]];
    }

    cube_distance(a, b) {
        return ( Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])) / 2; 
    }

    coffset_distance(brow, bcolume) {
        const ac = this.offset_to_cube(this.row, this.colume);
        const bc = this.offset_to_cube(brow, bcolume);
        return this.cube_distance(ac, bc);
    }

    toJson(){
        return {"elevation":this.elevation, "point_Level":this.point_Level, "land_Level":this.land_Level};
    }

}

export{Hex};