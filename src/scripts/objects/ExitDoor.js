import Object from './Object';
import { TILE, LEVEL } from '../Constants';

const STATE_OPEN = 0;
const STATE_RAISING = 1;
const STATE_DROPPING = 2;
const STATE_CLOSED = 3;

class ExitDoor extends Object {
    
    constructor(scene, x, y, levelType) {
    
        super(scene, x, y, TILE.EXIT_RIGHT, levelType);

        this.xOffset = ( this.levelType == LEVEL.PALACE ) ? 7 : 10; 
    
        this.doorBack = scene.add.sprite(this.xOffset, 12, this.key, this.key + '_door').setOrigin(0,0);
        scene.backLayer.add(this.doorBack);
        
        this.doorFront = scene.add.sprite(0, 0, this.key, this.key + '_door_fg').setOrigin(0,0);
        scene.frontLayer.add(this.doorFront);
        this.doorFront.setVisible(false);
        
        this.step = 0;
        this.state = STATE_CLOSED;

    }

    setX(x) {
        super.setX(x);
        this.doorFront.setX(x);
        this.doorBack.setX(x + this.xOffset);
    }

    setY(y) {
        super.setY(y);
        this.doorFront.setY(y);
        this.doorBack.setY(y + 12);
    }

    update() {
    
        switch (this.state) {
                
            case STATE_RAISING:
                
                if (this.step == ( 43 + this.levelType) ) {
                    
                    this.open();
                    
                } else {
                    
                    this.step++;
                    this.doorBack.y -= 1;
                    this.doorBack.setCrop(0, this.step, this.doorBack.width, this.doorBack.height - this.step);
                    
                }
                break;
                
        }
        
    }

    raise() {
    
        if ( this.state == STATE_CLOSED ) {
            
            this.state = STATE_RAISING;
            
        }
        
    }
    
    mask() {
        
        this.doorFront.setVisible(true);
        
    }

    isOpen() {

        return (this.state == STATE_OPEN);

    }

    open() {
        this.state = STATE_OPEN;
        this.step = 0;
    }

    close() {
        this.state = STATE_CLOSED;
        this.step = 0;
    }
    
}

export default ExitDoor;