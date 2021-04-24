import { Object3D } from '../build/three.module.js';

class LOD extends Object3D{

    constructor(){

        super();

        this._currentZoom = 0;
        this.zoom = 0;
        this.type = 'MyLOD';

        Object.defineProperties( this , {
            zooms:{
                enumerable: true,
                value:[]
            },
            isLOD:{
                value: true,
            }
        });

        this.autoUpdate = true;

    }

    addLevel(object, zoom = 0){

        zoom = Math.abs(zoom);
        const zooms = this.zooms;
        
        let l;
        for(l = 0 ; l < zooms.length; l++){
            if(zoom < zooms[l].zoom){
                break;
            }
        }

        zooms.splice(l, 0, {
            zoom: zoom,
            object: object
        });
        this.add(object);

        return this;
    }

    getCurrentLevel(){
        return this._currentZoom;
    }

    getObjectForZoom(zoom){
        const zooms = this.zooms;

        if(zooms.length > 0 ){
            let i ,l;

            for(i =1 ,l = zooms.length; i<l;i++){
                if(zoom < zooms[i].zoom){
                    break;
                }
            }

            return zooms[i-1].object;
        }

        return null;
    }

    update(camera){
        const zooms = this.zooms;
        if(zooms.length>1){

            const zoom = camera.zoom;

            this.zoom = zoom;

            zooms[0].object.visible = true;

            let i , l; 
            for(i = 1,l = zooms.length; i < l ; i++){
                if(zoom >= zooms[i].zoom){
                    zooms[i-1].object.visible = false;
                    zooms[i].object.visible = true;
                }else{
                    break;
                }
            }
            this._currentZoom = i - 1;

            for(; i < l;i++){
                zooms[i].object.visible = false;
            }

        }

    }

}
export{LOD};