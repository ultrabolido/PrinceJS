import Object from './Object';
import { TILE } from '../Constants';

class Chopper extends Object {
    
    constructor(scene, x, y, levelType) {
        
        super(scene, x, y, TILE.CHOPPER, levelType)
    
        this.chopperBack = scene.add.sprite(0, 0, this.key, this.key + '_chopper_5').setOrigin(0,0);
        scene.backLayer.add(this.chopperBack);
        
        this.chopperFront = scene.add.sprite(0, 0, this.key, this.key + '_chopper_5_fg').setOrigin(0,0);
        scene.frontLayer.add(this.chopperFront);
        
        this.step = 0;      
        this.active = false;
    }

    setX(x) {
        super.setX(x);
        this.chopperBack.setX(x);
        this.chopperFront.setX(x);
    }

    setY(y) {
        super.setY(y);
        this.chopperBack.setY(y);
        this.chopperFront.setY(y);
    }

    update() {
    
        if (this.active) {
            
            this.step++;
            if (this.step > 14) {
    
                this.step = 0;
                this.active = false;
    
            } else {
    
                if (this.step < 6) {
    
                    this.chopperBack.setFrame(this.key + '_chopper_' + this.step).setOrigin(0,0);
                    this.chopperFront.setFrame(this.key + '_chopper_' + this.step + '_fg').setOrigin(0,0);
    
                    if (this.step == 3) this.emit('chopped', this.roomX, this.roomY, this.room);
    
                }
    
            }
            
        }

    }

    chop() {
  
        this.active = true;
        
    }

}

export default Chopper;