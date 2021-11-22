import Object from './Object';
import { TILE } from '../Constants';

class Button extends Object {
    constructor(scene, x, y, tileType, levelType, modifier) {
        super(scene, x, y, tileType, levelType);

        this.stepMax = (tileType == TILE.RAISE_BUTTON) ? 3 : 5;
        this.step = 0;
    
        this.active = false;
        this.modifier = modifier;
        
    }

    update() {
    
        if (this.active) {
           
            if (this.step == this.stepMax) {
                
                this.tileBack.setFrame(this.key + '_' + this.tileType).setOrigin(0,0);
                this.tileFront.setFrame(this.key + '_' + this.tileType + '_fg').setOrigin(0,0);
                if (this.maskFrame) { 
                    this.mask();
                } 
                this.active = false;
    
            }
            this.step++;
            
        }
    }
    
    push() {
      
        if (!this.active) {
            
            this.active = true;
            this.tileBack.setFrame(this.tileBack.frame.name + '_down').setOrigin(0,0);
            this.tileFront.setFrame(this.key + '_' + TILE.FLOOR + '_fg').setOrigin(0,0);
            if (this.maskFrame) {
                this.mask();
            } 
            this.emit('pushed', this.modifier, this.tileType);
            
        }
        this.step = 0;
        
        
    }

}

export default Button;
