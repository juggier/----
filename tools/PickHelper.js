import * as THREE from '../build/three.module.js';

function PickHelper(canvas,domElement,camera){

    this.canvas = canvas;
    this.domElement = domElement;
    this.camera = camera;
    this.pickPosition = { x: 0, y: 0 };
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;

    let scope = this;
    let changeEvent = { type: 'change' };

    this.pick = function(objects){
        // 重置标记物体
        if (scope.pickedObject){
            scope.pickedObject = undefined;
        }

        // 发射射线
        scope.raycaster.setFromCamera(scope.pickPosition,scope.camera);
        // 获得与射线相交的物体数组
        const intersectedObjects = scope.raycaster.intersectObjects(objects.children,true);
        //console.log(intersectedObjects);
        if(intersectedObjects.length){
            scope.pickedObject = intersectedObjects[0].object;
        }
        
    }


    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);
        scope.pickPosition.x = (pos.x / scope.canvas.width) * 2 - 1;
        scope.pickPosition.y = (pos.y / scope.canvas.height) * -2 + 1;
        
        // scope.pickPosition.x = (event.clientX - window.innerWidth) * 2 - 1;
        // scope.pickPosition.t = (event.clientY - window.innerHeight) * 2 + 1;
        scope.dispatchEvent(changeEvent);
    }

    function getCanvasRelativePosition(event){
        const rect = scope.canvas.getBoundingClientRect();
        return {
            x:(event.clientX - rect.left) * canvas.width / rect.width,
            y:(event.clientY - rect.top) * canvas.height / rect.height,
        };
    }

    function clearPickPosition(){
        scope.pickPosition.x = -100000;
        scope.pickPosition.y = -100000;
    }

    scope.domElement.addEventListener('pointermove', setPickPosition);
    scope.domElement.addEventListener('pointout', clearPickPosition);
    scope.domElement.addEventListener('pointleave', clearPickPosition);

    scope.domElement.addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
    }, { passive: false });

    scope.domElement.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });

    scope.domElement.addEventListener('touchend',clearPickPosition);
}
PickHelper.prototype = Object.create(THREE.EventDispatcher.prototype);
PickHelper.prototype.constructor = PickHelper;
export{PickHelper};