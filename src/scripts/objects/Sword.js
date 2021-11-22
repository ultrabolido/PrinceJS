import Object from './Object';
import { TILE } from '../Constants';

class Sword extends Object {
    
    constructor(scene, levelType, modifier) {
    
        super(scene, 0, 0, TILE.SWORD, levelType);
        
        this.tick = Phaser.Math.Between(40,167);
        this.step = 0;
        this.scene = scene;
    
    }

    update() {
    
        if (this.step == -1) {
            
            this.tileBack.setFrame(this.key + '_' + this.tileType).setOrigin(0,0);
            Phaser.Math.Between(40,167);
            
        } 
            
        this.step++;
        
        if (this.step == this.tick) {
            
            this.tileBack.setFrame(this.tileBack.frame.name + '_bright').setOrigin(0,0);
            this.step = -1;
            
        }
        
    }

}

export default Sword;