import Object from './Object';
import { TILE } from '../Constants';

class Balcony extends Object {
    
    constructor(scene, x, y, levelType) {
        
        super(scene, x, y, TILE.BALCONY_RIGHT, levelType );

        this.yOffset = -4;

        this.balcony = scene.add.sprite(0, this.yOffset, this.key, this.key + '_balcony').setOrigin(0,0);
        scene.backLayer.add(this.balcony);

    }

    setX(x) {
        super.setX(x);
        this.balcony.setX(x);
    }

    setY(y) {
        super.setY(y);
        this.balcony.setY(y + this.yOffset);
    }

}

export default Balcony;
