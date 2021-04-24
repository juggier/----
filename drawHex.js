Vector3 = function(x,y,z) {this.x = x;this.y = y;this.z = z};
Vector3.prototype = {
    length : function() {return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);},
    add : function(v) { return new Vector3 (this.x + v.x, this.y + v.y , this.z + v.z);},
    subtract: function (v) { return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);},

}

var hex = {
    this:postion=Float32Array(3),
    this:vectices=Float32Array(6),
    this:create_hex = function(pos,vec){
        this.position = pos;
        this.vectices = vec;
    }
}


var hex_Plane = new THREE.BufferGeometry();
var outerRadius = 100.0;
var innerRadius = outerRadius * 0.866025404;
var H = 0.75 * outerRadius;
var W = 2 * innerRadius;
for(var i = 0; i <100;i++){
    for(var j = 0; j<100;j++){
        var hex_vertices = new Float32Array([
            i * W              , 0, j * H,
            i * W              , 0, j * H + outerRadius,
            i * W + innerRadius, 0, j * H + 0.5 * outerRadius,
            i * W + innerRadius, 0, j * H - 0.5 * outerRadius,
            i * W              , 0, j * H - outerRadius,
            i * W - innerRadius, 0, j * H - 0.5 * outerRadius,
            i * W - innerRadius, 0, j * H + 0.5 * outerRadius
        ]);
        var attribute = new THREE.BufferAttribute(hex_vertices, 3);
        hex_Plane.attributes.position = attribute;

        var normals = new Float32Array([
            0, 0, 1,

            0, 0, 1, //顶点1法向量
            0, 0, 1, //顶点2法向量
            0, 0, 1, //顶点3法向量

            0, 0, 1, //顶点4法向量
            0, 0, 1, //顶点5法向量
            0, 0, 1, //顶点6法向量
        ]);
        hex_Plane.attributes.normal = new THREE.BufferAttribute(normals, 3);

        var indexes = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 5,
            0, 5, 6,
            0, 6, 1,
        ]);
        hex_Plane.index = new THREE.BufferAttribute(indexes, 1);
    }
}
