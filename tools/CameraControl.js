import{
    EventDispatcher,
    MOUSE,
    Quaternion,
    Vector2,
    Vector3
} from '../../../-----/build/three.module.js';

var CameraControl = function ( object, domElement) {

    if (domElement === undefined) console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.');
    if (domElement === document) console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.');

    this.object = object;
    this.domElement = domElement;

    //启用开关
    this.enabled = true;


    //设置摄像机关注的位置
    this.target = new Vector3();

    this.zoomSpeed = 1.0;
    this.panSpeed = 1.0;

    let LODLEVEL = {LEVEL0: 0,LEVEL1: 1,LEVEL2: 2,LEVEL3: 3 };
    let ZOOMS = [ 2, 0.9, 0.5, 0.25];

    this.lodLevel = LODLEVEL.LEVEL3;
    this.minZoom = 0;
    this.maxZoom = Infinity;
    

    this.enableDamping = false;
    this.dampingFactor = 0.05;

    //鼠标开关
    this.mouseButtons = {LEFT: MOUSE.PAN, MIDDLE: MOUSE.PAN, RIGHT: MOUSE.DOLLY};

    //重置相关
    this.target0 = this.target.clone();
    this.position = this.object.position.clone();
    this.zoom0 = this.object.zoom;

    //相关事件状态
    this._domElementKeyEvents = null;

    //内部属性
    let scope = this;

    let changeEvent = {type:'change'};
    let startEvent = {type:'start'};
    let endEvent = {type:'end'};

    let STATE = {
        NONE: -1,
        PAN: 0,
        DOLLY: 1,   
    }

    let state = STATE.NONE;

    let EPS = 0.000001;

    let scale = 1;
    let panOffset = new Vector3();
    let zoomChanged = false;

    let panStart = new Vector2();
    let panEnd = new Vector2();
    let panDelta = new Vector2();

    let dollyStart = new Vector2();
    let dollyEnd = new Vector2();
    let dollyDelta = new Vector2();

    //公共方法
    this.listenToKeyEvents = function( domElement ){
        domElement.addEventListener('keydown', onkeydown);
        this._domElementKeyEvents = domElement;
    }


    this.saveState = function(){

        scope.target.copy(scope.target0);
        scope.position0.copy(scope.object.position);
        scope.zoom0 = scope.object.zoom;
    }

    this.reset = function(){
        scope.target.copy( scope.target0 );
        scope.object.position.copy(scope.position0);
        scope.object.zoom = scope.zoom0;

        scope.object.updateProjectionMatrix();
        scope.dispatchEvent( changeEvent );

        scope.update();

        state = STATE.NONE;
    }

    this.update = function() {

        let offset = new Vector3();

        let quat = new Quaternion().setFromUnitVectors(object.up, new Vector3(0, 1, 0));
        let quatInverse = quat.clone().invert();

        let lastPosition = new Vector3();
        let lastQuaternion = new Quaternion();

        return function update() {

            let position = scope.object.position;

            offset.copy(position).sub(scope.target);

            // 旋转offset去y轴向上空间
            offset.applyQuaternion(quat);

            //移动目标去指定位置
            if(scope.enableDamping === true){

                scope.target.addScaledVector( panOffset, scope.dampingFactor );
 
            }else{

                scope.target.add(panOffset);
                
            }

            offset.applyQuaternion(quatInverse);

            position.copy(scope.target).add(offset);

            scope.object.lookAt(scope.target);

            if (scope.enableDamping === true) {

                panOffset.multiplyScalar(1 - scope.dampingFactor);

            } else {

                panOffset.set(0, 0, 0);

            }

            scale = 1;

            if (zoomChanged || lastPosition.distanceToSquared(scope.object.position) > EPS ||
                8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS ){
                
                scope.dispatchEvent(changeEvent);

                lastPosition.copy(scope.object.position);
                lastQuaternion.copy(scope.object.quaternion);
                zoomChanged = false;

                return true;
            }

            return false;
        };

    }();

    this.dispose = function () {

        scope.domElement.removeEventListener('contextmenu', onContextMenu);

        
        scope.domElement.removeEventListener('wheel', onMouseWheel);

        scope.domElement.removeEventListener('pointerdown', onPointerDown);
        scope.domElement.ownerDocument.removeEventListener('pointermove', onPointerMove);
        scope.domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);


        if (scope._domElementKeyEvents !== null) {

            scope._domElementKeyEvents.removeEventListener('keydown', onKeyDown);

        }

    };

    //内部方法
    function getZoomScale() {

        return Math.pow(0.95, scope.zoomSpeed);

    }

    function getLODLEVEL(){
        return lodLevel;
    }

    let panLeft = function () {

        let v = new Vector3();
        

        return function panLeft(distance, objectMatrix) {

            v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
            v.multiplyScalar(- distance);
            panOffset.add(v);

        };

    }();

    let panUp = function () {

        let v = new Vector3();

        return function panUp(distance, objectMatrix) {

            v.setFromMatrixColumn(objectMatrix, 1);
    
            v.multiplyScalar(distance);
            
            panOffset.add(v);
        };

    }();

    let pan = function(){

        //var offset = new Vector3();

        return function pan( deltaX , deltaY ){
            var element = scope.domElement;

            // if (scope.object.isPerspectiveCamera) {

            //     // perspective
            //     var position = scope.object.position;
            //     offset.copy(position).sub(scope.target);
            //     var targetDistance = offset.length();

            //     // half of the fov is center to top of screen
            //     targetDistance *= Math.tan((scope.object.fov / 2) * Math.PI / 180.0);

            //     // we use only clientHeight here so aspect ratio does not distort speed
            //     panLeft(2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix);
            //     panUp(2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix);

            // } else 
            if (scope.object.isOrthographicCamera) {
            
                panLeft( deltaX * ( scope.object.right - scope.object.left) / scope.object.zoom / element.clientWidth, scope.object.matrix);
                panUp( deltaY * (scope.object.top - scope.object.bottom) / scope.object.zoom / element.clientHeight, scope.object.matrix);

            } else {

                // camera neither orthographic nor perspective
                console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');
                scope.enablePan = false;

            }
        }
    }();

    function dollyOut( dollyScale ){
        // scope.object.zoom = Math.max(scope.minZoom,Math.min(scope.maxZoom,scope.object.zoom * dollyScale));
        // scope.object.updateProjectionMatrix();
        // zoomChanged = true;
        if (scope.lodLevel < LODLEVEL.LEVEL3) {
            scope.lodLevel = scope.lodLevel + 1;
            scope.object.zoom = ZOOMS[scope.lodLevel] * dollyScale;
            scope.object.updateProjectionMatrix();
            zoomChanged = true;
        } else
            zoomChanged = false;
    }

    function dollyIn(dollyScale) {
        // scope.object.zoom = Math.max(scope.minZoom, Math.min(scope.maxZoom, scope.object.zoom / dollyScale));
        // scope.object.updateProjectionMatrix();
        // zoomChanged = true;
        if (scope.lodLevel > LODLEVEL.LEVEL0) {
            scope.lodLevel = scope.lodLevel - 1;
            scope.object.zoom = ZOOMS[scope.lodLevel] / dollyScale;
            scope.object.updateProjectionMatrix();
            zoomChanged = true;
        } else
            zoomChanged = false;
    }

    //
    //事件响应 ——更新状态
    //

    function handleMouseDownDolly( event ){

        dollyStart.set(event.clientX, event.clientY );
    }

    function handleMouseDownPan( event ){

        panStart.set(event.clientX, event.clientY);
    }

    function handleMouseMoveDolly( event ){

        dollyEnd.set(event.clientX,event.clientY);

        dollyDelta.subVectors(dollyEnd,dollyStart);
        // console.log(dollyDelta.y);

        if( dollyDelta.y > 0 ){
            
            dollyOut(getZoomScale());

        }else if( dollyDelta.y < 0){

            dollyIn(getZoomScale());

        }

        dollyStart.copy(dollyEnd);

        scope.update();

    }

    function handleMouseMovePan( event ){

        panEnd.set( event.clientX,event.clientY );

        panDelta.subVectors(panEnd,panStart).multiplyScalar(scope.panSpeed);

        pan(panDelta.x,panDelta.y);

        panStart.copy(panEnd);

        scope.update();

    }

    function handleMouseUp( /*event*/) {

        // no-op

    }

    function handleMouseWheel( event ){
        if(event.deltaY < 0){

            dollyIn(getZoomScale());

        }else if (event.deltaY > 0){

            dollyOut(getZoomScale());
        }

        scope.update();

    }

    function onPointerDown(event) {

        if (scope.enabled === false) return;

        switch (event.pointerType) {

            case 'mouse':
            case 'pen':
                onMouseDown(event);
                break;

            // TODO touch

        }

    }

    function onPointerMove(event) {

        if (scope.enabled === false) return;

        switch (event.pointerType) {

            case 'mouse':
            case 'pen':
                onMouseMove(event);
                break;

            // TODO touch

        }

    }

    function onPointerUp(event) {

        switch (event.pointerType) {

            case 'mouse':
            case 'pen':
                onMouseUp(event);
                break;

            // TODO touch

        }

    }

    function onMouseDown( event ){

        //防止浏览器滑动
        event.preventDefault();

        //手动设置焦点
        scope.domElement.focus ? scope.domElement.focus() : window.focus();

        var mouseAction;

        switch ( event.button ) {

            case 0:
                mouseAction = scope.mouseButtons.LEFT;
                break;
            case 1:
                mouseAction = scope.mouseButtons.MIDDLE;
                break;
            case 2:
                mouseAction = scope.mouseButtons.RIGHT;
                break;
            default:
                mouseAction = -1;
        }

        switch (mouseAction) {

            case MOUSE.DOLLY:

                handleMouseDownDolly(event);

                state = STATE.DOLLY;

                break;

            case MOUSE.ROTATE:

                if (event.ctrlKey || event.metaKey || event.shiftKey) {

                    if (scope.enablePan === false) return;

                    handleMouseDownPan(event);

                    state = STATE.PAN;

                }

                break;

            case MOUSE.PAN:
                if(event.ctrlKey || event.metaKey || event.shiftKey){
                    //旋转
                }
                else{

                    handleMouseDownPan(event);

                    state = STATE.PAN;
                }
                break;
            default:
                state = STATE.NONE;
        }

        if (state !== STATE.NONE) {

            scope.domElement.ownerDocument.addEventListener('pointermove', onPointerMove);
            scope.domElement.ownerDocument.addEventListener('pointerup', onPointerUp);

            scope.dispatchEvent(startEvent);

        }

    }

    function onMouseMove( event ){

        if(scope.enabled === false) return;

        event.preventDefault();

        switch( state ){
            case STATE.DOLLY:

                handleMouseMoveDolly(event);

                break;

            case STATE.PAN:

                handleMouseMovePan(event);
                
                break;
        }
    }

    function onMouseUp( event ){

        scope.domElement.ownerDocument.removeEventListener('pointermove',onPointerMove);
        scope.domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);

        handleMouseUp(event);

        scope.dispatchEvent(endEvent);

        state = STATE.NONE;
    }

    function onMouseWheel(event) {

        if (scope.enabled === false || state !== STATE.NONE ) return;

        event.preventDefault();

        scope.dispatchEvent(startEvent);

        handleMouseWheel(event);

        scope.dispatchEvent(endEvent);

    }

    function onContextMenu ( event ){

        if(scope.enabled === false) return;

        event.preventDefault();
    }

    scope.domElement.addEventListener('contextmenu', onContextMenu);

    scope.domElement.addEventListener('pointerdown', onPointerDown);
    scope.domElement.addEventListener('wheel', onMouseWheel);

    this.update();
};

CameraControl.prototype= Object.create( EventDispatcher.prototype );
CameraControl.prototype.constructor = CameraControl;

export { CameraControl };