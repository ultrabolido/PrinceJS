import Object from './Object';

class Floor extends Object {
    
    constructor(scene, x, y, tileType, levelType, modifier) {
        
        super(scene, x, y, tileType, levelType );

        this.floor = scene.add.sprite(0,0, this.key, this.key + '_' + tileType + '_' + modifier).setOrigin(0,0);
        scene.backLayer.add(this.floor);

    }

    setX(x) {
        super.setX(x);
        this.floor.setX(x);
    }

    setY(y) {
        super.setY(y);
        this.floor.setY(y);
    }

}

export default Floor;
