import Object from './Object';
import { TILE } from '../Constants';

const STATE_INACTIVE = 0;
const STATE_RAISING = 1;
const STATE_FULL_OUT = 2;
const STATE_DROPPING = 3;

class Spikes extends Object {
    
    constructor(scene, x, y, levelType, modifier) {
    
        super(scene, x, y, TILE.SPIKES, levelType);

        this.scene = scene;
    
        this.state = STATE_INACTIVE;
        this.step = 0;
        this.mortal = (modifier < 5);
        
        if ((modifier > 2) && (modifier < 6)) { modifier = 5; }
        if (modifier == 6) { modifier = 4; }
        if (modifier > 6) { modifier = 9 - modifier; }
        
        this.spikeBack = this.scene.add.sprite(0,0,this.key, this.key + '_' + TILE.SPIKES + '_' + modifier);
        this.scene.backLayer.add(this.spikeBack);
        
        this.spikeFront = this.scene.add.sprite(0,0,this.key, this.key + '_' + TILE.SPIKES + '_' + modifier + '_fg');
        this.scene.frontLayer.add(this.spikeFront);
    }

    update() {
    
        switch (this.state) {
    
            case STATE_RAISING:
                this.step++;
                this.spikeBack.setFrame(this.key + '_' + TILE.SPIKES + '_' + this.step).setOrigin(0,0);
                this.spikeFront.setFrame(this.key + '_' + TILE.SPIKES + '_' + this.step + '_fg').setOrigin(0,0);
                if (this.step == 5) {
                   
                    this.state = STATE_FULL_OUT;
                    this.step = 0;

                }
                break;
    
            case STATE_FULL_OUT:
                this.step++;
                if (this.step > 15) {

                    this.state = STATE_DROPPING;
                    this.step = 5;

                }
                break;
    
            case STATE_DROPPING:
                this.step--;
                if (this.step == 3) this.step--;
                this.spikeBack.setFrame(this.key + '_' + TILE.SPIKES + '_' + this.step).setOrigin(0,0);
                this.spikeFront.setFrame(this.key + '_' + TILE.SPIKES + '_' + this.step + '_fg').setOrigin(0,0);
                if (this.step == 0) {

                    this.state = STATE_INACTIVE;
                
                }
                break;
    
        }
        
    }

    setX(x) {
        super.setX(x);
        this.spikeBack.setX(x);
        this.spikeFront.setX(x);
    }

    setY(y) {
        super.setY(y);
        this.spikeBack.setY(y);
        this.spikeFront.setY(y);
    }
    
    raise() {
      
        if (this.state == STATE_INACTIVE) {
            
            this.state = STATE_RAISING;
            this.scene.sfx.play('26-spikes');
            
        } else {
            
            if (this.state == STATE_FULL_OUT) {
                
                this.step = 0;
                
            }
            
        }
    }
    
}

export default Spikes;