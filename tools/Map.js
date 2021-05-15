import * as THREE from '../build/three.module.js';
import { CameraControl } from './CameraControl.js';
import { LOD } from './LOD.js';
import { Hex } from '../objects/Hex.js';
import { Tank, ArmouredVehicle, Infantry } from '../objects/Chess.js';
import { PickHelper } from './PickHelper.js';

function Map(map, window) {

    this.window = window;


    //地图基础属性
    const LODLEVEL = { LEVEL0: 0, LEVEL1: 1, LEVEL2: 2, LEVEL3: 3 };
    const POINTS = { normal: 0, subordination: 1, important: 2 };
    const LANDS = { flat: 0, residential: 1, jungle: 2, country_road: 3, normal_road: 4, highway: 5 };
    const CHESS = { none:0, tank: 1, armoured_vehicle: 2, infantry: 3 };
    const ZOOMS = [2, 0.9, 0.5, 0.25];

    this.row, this.colume;
    this.renderRequested = false;

        //高程集合：low_heights < 100 , middle_heights < 200
    let low_heights = [],middle_heights = [];

        //地图集合：丛林，居民地，夺控点
    this.jungles = [], this.houses = [], this.points = [[46, 47], [46, 48], [47, 47]];

        //棋子集合：红方、蓝方
    let red_tank = [[23, 49]], red_armoured_vehicle = [[23, 50]]; //(规定存放顺序红方：0 - tank；1 - armoured_vehicle)
    let blue_tank = [[71, 45]], blue_infantry = [[71, 46]];//(规定存放顺序蓝方：0 - armoured_vehicle；1 - infantry)
    let red = [red_tank,red_armoured_vehicle] ,blue = [blue_tank,blue_infantry];
    //this.chess = [red,blue];

    //场景模型集合：
    this.hex_map = new THREE.Group();
    this.hex_map.name = 'hex_map';
    this.red_chesses = new THREE.Group();
    this.red_chesses.name = 'red_chesses';
    this.blue_chesses = new THREE.Group();
    this.blue_chesses.name = 'blue_chesses';

    this.canvas = document.querySelector(map);
    this.renderer = new THREE.WebGLRenderer({ canvas:this.canvas, antialias: true, alpha: true });
    this.scene = new THREE.Scene();

        //Camera
    this.camera = CreateCamera(this.canvas);
    this.camera_control = new CameraControl(this.camera, this.renderer.domElement);
    this.camera_control.update();

        //Lighting
    const point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300);
    this.scene.add(point);

        //环境光
    const ambient = new THREE.AmbientLight(0x444444);
    this.scene.add(ambient);

    //test
    // const gmaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    // const geo = new THREE.BoxGeometry(50,50,50);
    // const cube = new THREE.Mesh(geo, gmaterial);
    // cube.position.z = -50;
    // const gro = new THREE.Group();
    // gro.add(cube);
    // this.scene.add(gro);
    // console.log(this.scene);



        //UI交互属性
    this.pickHelper = new PickHelper(this.canvas, this.renderer.domElement,this.camera);
    this.pickHelper.clearPickPosition();

<<<<<<< HEAD
    this.curRow, this.curColume, this.curChess, this.curElevation, this.curHex, this.speed;

=======
    this.curRow, this.curColume, this.curElevation, this.speed;
    this.curHex, this.curHexCategory, this.curChess, this.curChessCategory;
    
>>>>>>> 8dd70b5a98be52d6a0d75caff6ce9e4a2f52e73e

    let scope = this;

    this.camera_control.addEventListener('change', requestRenderIfNotRequested);
    this.pickHelper.addEventListener('change', requestRenderIfNotRequested);
    this.window.addEventListener('resize', requestRenderIfNotRequested);

    this.GenerateMap = function(result) {

        let datas = result.split('\n');

        let heights = [];

        this.row = 81;
        this.colume = 81;

        for (let i = 0; i < this.row * this.colume; i++) {
            //计算每个点高程
            const elevation = Math.ceil((parseInt(datas[i]) - 400) / 10) * 10;

            //高程分类
            if (elevation <= 200) {

                const _row = parseInt(i / this.row);
                const _colume = i % this.row;

                middle_heights.push([_row, _colume, elevation]);

                if (elevation <= 100) {

                    low_heights.push([_row, _colume]);

                }

            }
            heights.push(elevation);
        }

        // console.log(this.low_heights);
        // console.log(this.middle_heights);
        // console.log(heights);

        //绘制
        Draw(heights);
        //console.log(heights);
        DrawObjects(scope.points, 'point');
        DrawChess();
        CreateHouses();
        CreateTrees();
        this.Render();

    }

    this.InputMap = function(result) {

        let data = JSON.parse(result);

        scope.row = data.row;
        scope.colume = data.colume;

        let heights = [];
        const map = data.map;


        for (let i = 0; i < map.length; i++) {

            const _row = parseInt(i / scope.row);
            const _colume = i % scope.row;

            heights.push(map[i].elevation);

            if (map[i].point_Level == 1) {

                scope.points.push([_row, _colume]);

            } else if (map[i].land_Level == 1) {

                scope.houses.push([_row, _colume]);

            } else if (map[i].land_Level == 2) {

                scope.jungles.push([_row, _colume]);

            }
        }

        console.log(heights);
        console.log(scope.points);
        console.log(scope.houses);
        console.log(scope.jungles);

        Draw(heights);
        DrawObjects(scope.points, 'point');
        DrawChess();
        DrawObjects(scope.houses, 'house');
        DrawObjects(scope.jungles, 'tree');
        this.Render();

    }

    function Draw(datas) {
        CreateHexes(10, scope.row, scope.colume, datas);
        scope.scene.add(scope.hex_map);
        console.log(scope.scene);

    }

    function DrawObjects(objects, type) {

        //网格数据
        const objectGeometries = [
            new THREE.PlaneGeometry(15, 15),
            new THREE.PlaneGeometry(18, 18),
            new THREE.PlaneGeometry(22, 22)
        ];

        //贴图
        const loader = new THREE.TextureLoader();
        let material
        switch (type) {

            case 'point':
                material = new THREE.MeshBasicMaterial({
                    map: loader.load('./textures/points1.png'),
                    transparent: true
                });
                break;
            case 'house':
                material = new THREE.MeshBasicMaterial({
                    map: loader.load('./textures/house1.png'),
                    transparent: true
                });
                break;
            case 'tree':
                material = new THREE.MeshBasicMaterial({
                    map: loader.load('./textures/tree2.png'),
                    transparent: true
                });
                break;

        }

        material.depthTest = false;
        material.renderOrder = 1;

        //绘制
        for (let i = 0; i < objects.length; i++) {

            const _row = objects[i][0];
            const _colume = objects[i][1];
            //const id = parseInt(_row / 10).toString() + (_row % 10).toString() + parseInt(_colume / 10).toString() + (_colume % 10).toString();
            //let hex = scope.hex_map.getObjectByName(id);

            let hex = scope.hex_map.children[_row * 81 + _colume];

            switch (type) {

                case 'point':
                    hex.point_Level = 1;
                    break;
                case 'house':
                    hex.land_Level = 1;
                    break;
                case 'tree':
                    hex.land_Level = 2;
                    break;

            }

            const detail_objectmesh = new THREE.Mesh(objectGeometries[0], material);
            const detail_objectmesh2 = new THREE.Mesh(objectGeometries[1], material);
            const simpler_objectmesh = new THREE.Mesh(objectGeometries[2], material);

            const objectMesh = new LOD();
            objectMesh.name = 'ObjectLOD';
            objectMesh.addLevel(detail_objectmesh, 0.9);
            objectMesh.addLevel(detail_objectmesh2, 0.3);
            objectMesh.addLevel(simpler_objectmesh, 0.2);
            objectMesh.position.x = hex.pos.x;
            objectMesh.position.y = hex.pos.y;
            hex.add(objectMesh);

        }

    }

    function DrawChess(){

        //网格数据
        const chessGeometries = [
            new THREE.PlaneGeometry(12, 12),
            new THREE.PlaneGeometry(15, 15),
            new THREE.PlaneGeometry(20, 20)
        ];

        //贴图
        const loader = new THREE.TextureLoader();
            //红色坦克
        const r_tank_material_l = new THREE.MeshBasicMaterial({
            map: loader.load('./textures/red0-0.png'),
            transparent: true, side: THREE.DoubleSide
        });
        const r_tank_material_r = new THREE.MeshBasicMaterial({
            map: loader.load('./textures/red0-180.png'),
            transparent: true
        });
        const r_tank_materials = [r_tank_material_l,r_tank_material_r];

            //红色装甲
        const r_armoured_vehicle_material_l = new THREE.MeshBasicMaterial({
            map: loader.load('./textures/red1-0.png'),
            transparent: true, side: THREE.DoubleSide
        });
        const r_armoured_vehicle_material_r = new THREE.MeshBasicMaterial({
            map: loader.load('./textures/red1-180.png'),
            transparent: true
        });
        const r_armoured_vehicle_materials = [r_armoured_vehicle_material_l, r_armoured_vehicle_material_r];

            //蓝色坦克
        const b_tank_material_l = new THREE.MeshBasicMaterial({
            map: loader.load('./textures/blue0-0.png'),
            transparent: true
        });
        const b_tank_material_r = new THREE.MeshBasicMaterial({
            map: loader.load('./textures/blue0-180.png'),
            transparent: true
        });
        const b_tank_materials = [b_tank_material_l, b_tank_material_r];

            //蓝色步兵
        const b_infantry_material_l = new THREE.MeshBasicMaterial({
            map: loader.load('./textures/blue2-0.png'),
            transparent: true
        });
        const b_infantry_material_r = new THREE.MeshBasicMaterial({
            map: loader.load('./textures/blue2-180.png'),
            transparent: true
        });
        const b_infantry_materials = [b_infantry_material_l, b_infantry_material_r];

            //综合
        const red_materials = [r_tank_materials,r_armoured_vehicle_materials];
        const blue_materials = [b_tank_materials,b_infantry_materials];

        // material.depthTest = false;
        //material.renderOrder = 1;

        //绘制
            //红色方
        for(let i = 0; i < red.length; i++ ){
            for(let j = 0 ; j < red[i].length; j++){
                const _row = red[i][j][0];
                const _colume = red[i][j][1];


                let hex = scope.hex_map.children[_row * 81 + _colume];

                const detail_chessmesh = new THREE.Mesh(chessGeometries[0], red_materials[i][0]);
                const detail_chessmesh2 = new THREE.Mesh(chessGeometries[1], red_materials[i][0]);
                const simpler_chessmesh = new THREE.Mesh(chessGeometries[2], red_materials[i][0]);


                const chessMesh = new LOD();
                chessMesh.name = 'ChessLOD';
                chessMesh.addLevel(detail_chessmesh, 0.9);
                chessMesh.addLevel(detail_chessmesh2, 0.3);
                chessMesh.addLevel(simpler_chessmesh, 0.2);
                chessMesh.position.x = hex.pos.x;
                chessMesh.position.y = hex.pos.y;

                let redChess;
                switch(i){
                    case 0:
                        redChess = new Tank(11, 'red',hex.pos, hex.elevation, hex.row, hex.colume);
                        break;
                    case 1:
                        redChess = new ArmouredVehicle(13, 'red', hex.pos, hex.elevation, hex.row, hex.colume);
                        break;
                }
                
                redChess.add(chessMesh);
                scope.red_chesses.add(redChess);
            }
        }

            //蓝色方
        for (let i = 0; i < blue.length; i++) {
            for (let j = 0; j < blue[i].length; j++) {
                const _row = blue[i][j][0];
                const _colume = blue[i][j][1];

                let hex = scope.hex_map.children[_row * 81 + _colume];

                const detail_chessmesh = new THREE.Mesh(chessGeometries[0], blue_materials[i][0]);
                const detail_chessmesh2 = new THREE.Mesh(chessGeometries[1], blue_materials[i][0]);
                const simpler_chessmesh = new THREE.Mesh(chessGeometries[2], blue_materials[i][0]);

                const chessMesh = new LOD();
                chessMesh.name = 'ChessLOD';
                chessMesh.addLevel(detail_chessmesh, 0.9);
                chessMesh.addLevel(detail_chessmesh2, 0.3);
                chessMesh.addLevel(simpler_chessmesh, 0.2);
                chessMesh.position.x = hex.pos.x;
                chessMesh.position.y = hex.pos.y;

                let blueChess;
                switch (i) {
                    case 0:
                        blueChess = new Tank(12, 'blue', hex.pos, hex.elevation, hex.row, hex.colume);
                        break;
                    case 1:
                        blueChess = new Infantry(15, 'blue', hex.pos, hex.elevation, hex.row, hex.colume);
                        break;
                }

                blueChess.add(chessMesh);
                scope.blue_chesses.add(blueChess);
            }
        }

        //添加到场景
        scope.scene.add(scope.red_chesses);
        scope.scene.add(scope.blue_chesses);
        //console.log(scope.red_chesses);
        //console.log(scope.blue_chesses);
    }

    function CreateHexes(radius, row, colume, datas) {
        //这里row和colume在这里表示的是相反的（以更正）
        //六角格初始化
        const outerRadius = radius;
        const innerRadius = outerRadius * 0.866025404;
        const height_offset = 1.5 * outerRadius;
        const width_offset = 2 * innerRadius;

        //模型
        const hexGeometry = new THREE.CircleGeometry(outerRadius, 6);
        const hexLineGeometry = new THREE.EdgesGeometry(hexGeometry);

        //材质
        const hexLineMaterial = new THREE.LineBasicMaterial({ color: 0x707070, linewidth: 1 });

        for (let _colume = 0; _colume < colume; _colume++) {
            for (let _row = 0; _row < row; _row++) {
                //ID和高程
                const id = parseInt(_colume / 10).toString() + (_colume % 10).toString() + parseInt(_row / 10).toString() + (_row % 10).toString();
                const elevation = datas[_row + _colume * row];

                //纹理
                const detail_tex = CreateMapTexture(24, id, elevation, true);
                const detail_tex2 = CreateMapTexture(12, id, elevation, true);
                const simpler_tex = CreateMapTexture(12, id, elevation, false);

                //绘制
                //mesh+line
                const detail_hexmesh = new THREE.Mesh(hexGeometry, new THREE.MeshBasicMaterial({ map: detail_tex }));
                detail_hexmesh.position.z = -1;
                const detail_hexmesh2 = new THREE.Mesh(hexGeometry, new THREE.MeshBasicMaterial({ map: detail_tex2 }));
                detail_hexmesh2.position.z = -1;
                const simpler_hexmesh = new THREE.Mesh(hexGeometry, new THREE.MeshBasicMaterial({ map: simpler_tex }));
                simpler_hexmesh.position.z = -1;
                const hexLine = new THREE.Line(hexLineGeometry, hexLineMaterial);
                hexLine.position.z = -1;

                hexLine.material.depthTest = false;
                hexLine.renderOrder = 1;

                //LOD
                const hexmesh = new LOD();
                hexmesh.name = 'HEXLOD';
                hexmesh.addLevel(detail_hexmesh, 0.9);
                hexmesh.addLevel(detail_hexmesh2, 0.3);
                hexmesh.addLevel(simpler_hexmesh, 0.2);

                //位移
                hexmesh.add(hexLine);
                hexmesh.rotateZ(-Math.PI / 2);
                hexmesh.position.x = width_offset * _row + (_colume % 2 == 0) * -width_offset * 0.5;
                hexmesh.position.y = -height_offset * _colume;
                hexmesh.updateWorldMatrix(true, true);

                //数据存储
                const hex_pos = new THREE.Vector2(hexmesh.position.x, hexmesh.position.y);
                const hex = new Hex(hex_pos, id, elevation);
                hex.row = _colume;
                hex.colume = _row;
                hex.add(hexmesh);

                // const axes = new THREE.AxesHelper();
                // axes.material.depthTest = false;
                // axes.renderOrder = 1;
                // hex.add(axes);
                scope.hex_map.add(hex);
            }
        }

        scope.camera.lookAt(scope.hex_map);
    }

    function CreateMapTexture(size, position, elevation, detail) {

        const text_ctx = document.createElement('canvas').getContext('2d');
        // const borderSize = 2;
        // const width = text_ctx.measureText(name).width + 2 * borderSize;
        // const height = 2 * (size + borderSize);
        text_ctx.canvas.width = size * 8;
        text_ctx.canvas.height = size * 8;

        let r, g, b;

        if (elevation <= 200) {
            r = 255;
            g = Math.max(186, 255 - (elevation / 200) * (255 - 186));
            b = Math.max(107, 255 - (elevation / 200) * (255 - 107));
        }
        else if (elevation > 200 && elevation < 500) {
            r = Math.max(130, 255 - ((elevation - 200) / 300) * (255 - 130));
            g = Math.max(95, 186 - ((elevation - 200) / 300) * (186 - 95));
            b = Math.max(55, 107 - ((elevation - 200) / 300) * (107 - 55));
        }
        else if (elevation >= 500) {
            r = 130;
            g = Math.min(130, 95 + ((elevation - 500) / 400) * (130 - 95));
            b = Math.min(130, 55 + ((elevation - 500) / 400) * (130 - 55));
        }

        text_ctx.fillStyle = `rgba(${r},${g},${b},1)`;
        text_ctx.fillRect(0, 0, text_ctx.canvas.width, text_ctx.canvas.height);

        if (detail) {
            text_ctx.fillStyle = '#000000';
            text_ctx.font = `${size}px sans-serif`;
            text_ctx.textAlign = "center";
            text_ctx.Baseline = "middle";

            text_ctx.fillText(position, text_ctx.canvas.width / 2, text_ctx.canvas.height / 3);
            text_ctx.fillText(elevation, text_ctx.canvas.width / 2, text_ctx.canvas.height / 1.3);
        }

        const texture = new THREE.CanvasTexture(text_ctx.canvas);
        texture.minFilter = THREE.LinearFilter;
        //const text_material = new THREE.MeshBasicMaterial({ map: texture });
        texture.center.set(0.5, 0.5);
        texture.rotation = Math.PI / 2;

        return texture;

    }

    function CreateHouses() {
        //判断条件1:是否高程小于100
        for (let i = 0; i < low_heights.length; i++) {

            let point_dist = 31;
            let neighbor_count = 0;
            let nearest_neighbor_dist = 0;

            //判断条件2：周围是否有距离8以内的其他居民楼且数量少于等于2个（多于直接跳过该点，少于获得3分）
            for (let j = 0; j < scope.houses.length; j++) {

                const neighbor_dist = scope.coffset_distance(low_heights[i][0], low_heights[i][1], scope.houses[j][0], scope.houses[j][1]);

                if (neighbor_dist <= 8) {
                    neighbor_count++;
                    if (neighbor_count > 2) {
                        break;
                    }
                    nearest_neighbor_dist = Math.min(nearest_neighbor_dist, neighbor_dist);

                }

            }

            if (neighbor_count > 2) {

                continue;

            }

            //条件3：绝对距离夺控点10以内，根据距离从近到远随机获得（10-2分）,否则跳过该点
            for (let j = 0; j < scope.points.length; j++) {

                const dist = scope.coffset_distance(low_heights[i][0], low_heights[i][1], scope.points[j][0], scope.points[j][1]);

                if (dist > 30) {

                    point_dist = dist;
                    break;

                }
                point_dist = Math.min(point_dist, dist);
            }

            if (point_dist > 20) {

                continue;

            }

            //条件4：条件2附近没有距离10以内的居民楼但是10米以外有那么获得6分；
            //计算得分:
            const max = (Math.abs(10 - point_dist) / 10 * 10 + 2) + (neighbor_count == 0 && nearest_neighbor_dist >= 10) * 6;
            let result = 0;

            if (max >= 6) {

                result = Math.floor(Math.random() * 11);
            }

            //如果得分大于6则创建居民楼
            if (result > 7) {

                scope.houses.push([low_heights[i][0], low_heights[i][1]]);
            }
        }

        console.log(scope.houses);
        DrawObjects(scope.houses, 'house');

    }

    function CreateTrees() {
        //判断条件1:是否高程小于300 （根据海拔高度获得1-3分，根据高度越高越小）
        for (let i = 0; i < middle_heights.length; i++) {

            let point_dist = 31;
            let house_dist = 8;
            let neighbor_count = 0;
            let nearest_neighbor_dist = 0;

            let result = parseInt((300 - middle_heights[i][2]) / 100) + 1;

            //超过夺控点30距离跳过
            for (let j = 0; j < scope.points.length; j++) {

                const dist = scope.coffset_distance(middle_heights[i][0], middle_heights[i][1], scope.points[j][0], scope.points[j][1]);

                if (dist > 30) {

                    point_dist = dist;
                    break;

                }

                point_dist = Math.min(point_dist, dist);

            }

            if (point_dist > 30) {
                continue;
            }

            //判断条件2：周围是否有距离10以内的其他丛林且数量少于等于2个（多于直接跳过该点，少于获得1-2分，越多越少）
            for (let j = 0; j < scope.jungles.length; j++) {

                const neighbor_dist = scope.coffset_distance(middle_heights[i][0], middle_heights[i][1], scope.jungles[j][0], scope.jungles[j][1]);

                if (neighbor_dist <= 10) {

                    neighbor_count++;

                    if (neighbor_count > 2) {

                        break;

                    }

                    nearest_neighbor_dist = Math.min(nearest_neighbor_dist, neighbor_dist);

                }

            }

            if (neighbor_count > 2) {

                continue;
            }
            else if (neighbor_count == 2) {

                result += 2;

            } else {

                result += 1;

            }

            //条件3：距离6以内,不能出现居民区,否则跳过该点(根据距离获得1-3分)
            for (let j = 0; j < scope.houses.length; j++) {

                const dist = scope.coffset_distance(middle_heights[i][0], middle_heights[i][1], scope.houses[j][0], scope.houses[j][1]);

                if (dist <= 6) {

                    house_dist = dist;
                    break;
                }

                house_dist = Math.max(house_dist, dist);
            }

            if (house_dist <= 6) {

                continue;

            } else {

                result += Math.ceil((Math.max(12, house_dist) - 6) / 6) * 3;

            }


            //条件4：条件2附近没有距离8以内的居民楼且距离最近的丛林大于10（根据距离获得1-3分距离越远越多）
            if (neighbor_count == 0 && nearest_neighbor_dist >= 10) {

                result += Math.ceil((Math.max(16, nearest_neighbor_dist) - 10) / 6) * 3;

            }

            //计算得分:
            //console.log(result);
            if (result >= 7) {

                result = Math.floor(Math.random() * 11);

            }

            //如果得分大于6则创建丛林
            if (result >= 7) {

                scope.jungles.push([middle_heights[i][0], middle_heights[i][1]]);

            }


        }

        console.log(scope.jungles);
        DrawObjects(scope.jungles, 'tree');

    }

    this.Render = function() {

        scope.renderRequested = undefined;
        if (scope.resizeRendererToDisplaySize()) {
            const canvas = scope.renderer.domElement;
            scope.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            scope.camera.updateProjectionMatrix();
        }

        scope.camera_control.update();
        scope.pickHelper.pick(scope.scene);
        scope.UpdateUIAttribute();

        scope.renderer.setClearColor(0xb9d3ff, 1);
        scope.renderer.setViewport(0, 0, scope.canvas.clientWidth, scope.canvas.clientHeight);
        scope.renderer.render(scope.scene, scope.camera);
    }

    this.resizeRendererToDisplaySize = function() {
        const canvas = scope.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;

        if (needResize)
            scope.renderer.setSize(width, height, false);

        return needResize;

    }

    function requestRenderIfNotRequested() {
        
        if (!scope.renderRequested) {

            scope.renderRequested = true;
            requestAnimationFrame(scope.Render);
        }
    }

    function CreateCamera(canvas) {

        const left = -canvas.width / 2;
        const right = canvas.width / 2;
        const top = canvas.height / 2;
        const bottom = -canvas.height / 2;
        // let s = 10;//三维场景的显示系数，越大范围越大
        let camera = new THREE.OrthographicCamera(left, right, top, bottom, -1, 1000);
        camera.lookAt(0, 0, 0); //设置相机方向(指向场景对象)
        return camera;

    }

    function UpdateLOD(scene, camera) {
        let zoom = camera.zoom;
    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //六角网格的相关算法
        //直角坐标转网格坐标
    this.offset_to_cube = function(row, colume) {
        const x = row - (colume - (colume & 1)) / 2;
        const z = colume;
        const y = -x - z;
        return [x, y, z];
    }

        //以直角坐标查询周围网格
    this.offset_neighbor = function(direction) {
        const oddr_directions = [
            [0, +1], [-1, +1], [-1, 0], [0, -1], [+1, 0], [+1, +1]
        ];
        const dir = oddr_directions[direction];
        return [this.row + dir[0], this.colume + dir[1]];
    }

        //测量两个网格之间的距离
    this.cube_distance = function(a, b) {
        return (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])) / 2;
    }

    this.coffset_distance = function(arow, acolume, brow, bcolume) {
        const ac = scope.offset_to_cube(arow, acolume);
        const bc = scope.offset_to_cube(brow, bcolume);
        return scope.cube_distance(ac, bc);
    }

    //导出地图Json格式
    this.mapToJson = function(botton,event){

        event.preventDefault();

        let array = [];

        for (let i = 0; i < scope.hex_map.children.length;i++){

            const json = scope.hex_map.children[i].toJson();
            array.push(json);

        }

        const json = {"row":this.row, "colume":this.colume, "map":array};
        const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download',"map.txt");
        link.click();

    }

    //与UI属性传输交互
    this.UpdateUIAttribute = function(){
        let object = scope.pickHelper.pickedObject;

        if(object){

            object = object.parent.parent;
            //console.log(object);

            scope.curRow = object.row;
            scope.curColume = object.colume;
            scope.curElevation = object.elevation;

            if(object.type == 'Chess'){
                const chess = object;
                scope.curHex = scope.hex_map.children[chess.row * 81 + chess.colume];
                scope.curChess = chess;
                scope.curChessCategory = chess.color + '_' + chess.category;

            }
            else if(object.type == 'HexMap'){

                const hex = object;
                scope.curHex = hex;
                scope.curChess = undefined;
                scope.curChessCategory = undefined;

                if (hex.point_Level == 0 && hex.land_Level == 0) {

                    scope.curHexCategory = '平地'

                } else if (hex.point_Level != 0) {

                    scope.curHexCategory = '夺控点'

                } else if (hex.land_Level != 0) {

                    switch (hex.land_Level) {

                        case 1:
                            scope.curHexCategory = '居民地';
                            break;
                        case 2:
                            scope.curHexCategory = '灌木丛';
                            break;

                    }

                }

            }
            
            console.log(scope.curRow, scope.curColume, scope.curElevation, scope.curHexCategory,scope.curChessCategory);
            //console.log(scope.curHex);
            //console.log(scope.curChess);

            document.getElementById("bottom-left").innerHTML = "x坐标： "+scope.curRow + " " +"y坐标： "+scope.curColume +"<br>"+"当前高程："+scope.curElevation;
<<<<<<< HEAD
            //console.log(scope.curChess);
            
            getmap(this.hex_map.children);
=======

>>>>>>> 8dd70b5a98be52d6a0d75caff6ce9e4a2f52e73e
        }
        else 
            console.log('pick none');
    }
}
export{Map};


//AstarWay
/* function(row, colume) {
    const x = row - (colume - (colume & 1)) / 2;
    const z = colume;
    const y = -x - z;
    return [x, y, z];
} */

var map = {};

function getmap(this_map)
{
    for(var i= 0;i<this_map.length;i++)
    {
        var key = i;
        var col = this_map[i].colume;
        var row = this_map[i].row;

        var x = row - (col - (col & 1)) / 2;
        var z = col;
        var y = -x - z;
        map[key] = [x,y,z];
    }
    console.log(map);
}




function search_Road(start_x, start_y, start_z, end_x, end_y, end_z) {

    var openlist = [];
    var closelist = [];
    var result = [];
    var result_index;
    openlist.push({
        X: start_x,
        y: start_y,
        z: start_z,
        G: 0
    });

    do {
        var currentpoint = openlist.pop();
        //pop方法删除数组最后一位 且 返回被删除的值
        closelist.push(currentpoint);
        var surroundpoint = surround_point(currentpoint);
        //寻找该点周围的点，存入临时对象
        for (var i in surroundpoint) {
            var item = surroundpoint[i];
            if (item.x >= 0 &&
                item.y >= 0 &&
                item.x < MAP.row &&
                item.y < MAP.col &&
                !exist_list(item, closelist)
            ) {
                var g = currentpoint.G + 1; //父对象g+当前g,六角格临近格之间g相同
                if (!exist_list(item, openlist)) //若不在开启列表中
                {
                    item['H'] = Math.abs(end_x - item.x) + Math.abs(end_y - item.y) + Math.abs(end_z - item.z)
                    item['G'] = g;
                    item['F'] = item.H + item.G
                    item['parent'] = currentpoint;
                    openlist.push(item);
                } else {
                    var index = exist_list(item, openlist);
                    if (g < openlist[index].G) {
                        openlist[index].parent = currentpoint;
                        openlist[index].G = g;
                        openlist[index].F = g + openlist[index].H;
                    }
                }
            }
        }
        if (openlist.length == 0) {
            break;
        } //若开启列表空了，则说明没路了
        openlist.sort(sortF);
    }
    while (!(result_index = exist_list({ x: end_x, y: end_y }, openlist)));

    if (!result_index) {
        result = [];
    } else {
        var currentobj = openlist[result_index]
        do {
            result.unshift({
                x: currentobj.x,
                y: currentobj.y
            });
            currentobj = currentobj.parent;
        }
        while (currentobj.x != start_x.x || currentobj.y != start_y);
        return result;
    }

    function sortF(a, b) {
        return b.f - a.f;
    } //f值排序

    function surround_point(currentpoint) {
        var x = currentpoint.x;
        var y = currentpoint.y;
        return [{ x: x - 1, y: y - 1 },
            { x: x - 1, y: y },
            { x: x, y: y - 1 },
            { x: x, y: y + 1 },
            { x: x + 1, y: y - 1 },
            { x: x + 1, y: y },
        ];
    } //获得周围点坐标

    function exist_list(point, list) { //判断点是否在列表里面
        for (var i in list) {
            if (point.x == list[i].x && point.y == list[i].y) {
                return i;
            }
        }
        return false;
    }
}