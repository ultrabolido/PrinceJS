import Object from './Object';
import { LEVEL, TILE } from '../Constants';

class Wall extends Object {
    
    constructor(scene, x, y, levelType, modifier, tileLeft, tileRight, tileX, tileY, roomId) {
        super(scene, x, y, TILE.WALL, levelType );

        const tileSeed = tileY*10 + tileX + roomId;

        if ( levelType == LEVEL.DUNGEON ) {

            const wallType = tileLeft + 'W' + tileRight;
            this.tileFront.setFrame(wallType + '_' + tileSeed).setOrigin(0,0);

        } else {

            this.tileFront.setTexture('wp_room_' + roomId, 'wall_' + tileX + '_' + tileY).setOrigin(0,0);
            this.decoFront = scene.add.sprite(0, 16, this.key, 'W_' + tileSeed).setOrigin(0,0);
            scene.frontLayer.add(this.decoFront);

        }

        if ( tileRight == 'S' ) {

            this.tileBack.setFrame(this.key + '_wall_' + modifier).setOrigin(0,0);

        }
        
    }

    setX(x) {
        super.setX(x);
        if ( this.levelType == LEVEL.PALACE) this.decoFront.setX(x);
    }

    setY(y) {
        super.setY(y);
        if ( this.levelType == LEVEL.PALACE) this.decoFront.setY(y + 16);
    }
    
}

export default Wall;
