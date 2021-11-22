import Object from './Object';
import { TILE, LEVEL } from '../Constants';

class Tapestry extends Object {
    
    constructor(scene, x, y, tileType, levelType, modifier, drawSmallLatice) {
        
        super(scene, x, y, tileType, levelType );

        if ( ( this.levelType == LEVEL.PALACE ) && ( modifier > 0 ) ) {

            this.tileBack.setFrame(this.key + '_' + tileType + '_' + modifier).setOrigin(0,0);
            this.tileFront.setFrame(this.tileBack.frame.name + '_fg').setOrigin(0,0);

            if ( drawSmallLatice && (tileType == TILE.TAPESTRY_TOP) ) {

                this.latice = scene.add.sprite(0, 0, this.key, this.key + '_' + TILE.SMALL_LATTICE + '_fg').setOrigin(0,0);
                scene.backLayer.add(this.latice);

            }

        }

    }

    setX(x) {
        super.setX(x);
        if (this.latice) this.latice.setX(x);
    }

    setY(y) {
        super.setY(y);
        if (this.latice) this.latice.setY(y);
    }

}

export default Tapestry;
