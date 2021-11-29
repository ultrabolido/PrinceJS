import Object from './Object';
import { TILE, SOUND } from '../Constants';

const STATE_INACTIVE = 0;
const STATE_SHAKING = 1;
const STATE_FALLING = 2;

const FALL_VELOCITY = 3;

const SOUNDS = [SOUND.LOOSE_SHAKE_1, SOUND.LOOSE_SHAKE_2, SOUND.LOOSE_SHAKE_3];

class Loose extends Object {

    constructor(scene, x, y, levelType) {

        super(scene, x, y, TILE.LOOSE_BOARD, levelType);

        this.scene = scene;

        this.step = 0;
    
        this.state = STATE_INACTIVE;
    
        this.vacc = 0;
        this.yTo = 0;

        this.frames = scene.anims.generateFrameNames(this.key, { prefix: this.key + '_loose_', start: 1, end: 8 });

    }

    update() {
    
        switch (this.state) {
                
            case STATE_SHAKING:
            
                if (this.fall) {
                    
                    const p = Phaser.Math.Between(0,2);
                    if (this.step == 0) this.scene.requestSoundPlay(SOUNDS[p]);
                    if (this.step == 2) this.scene.requestSoundPlay(SOUNDS[p]);
                    if (this.step == 7) this.scene.requestSoundPlay(SOUNDS[p]);

                }

                if ( this.step == this.frames.length ) {
    
                    this.emit('startfalling', this);
                    this.state = STATE_FALLING;
                    this.step = 0;
                    this.tileBack.setFrame(this.key + '_falling').setOrigin(0,0);
                    this.scene.tileShaking = false;
    
                } else {
    
                    if ( ( this.step == 3 ) && ( !this.fall ) ) {
    
                        this.tileFront.setVisible(true);
                        this.tileBack.setFrame(this.key + '_' + TILE.LOOSE_BOARD).setOrigin(0,0);
                        this.state = STATE_INACTIVE;
                        this.scene.tileShaking = false;
    
                    } else {
    
                        this.tileBack.setFrame(this.frames[this.step].frame).setOrigin(0,0);
                        this.step++;
    
                    }
    
                }
                break;
                
            case STATE_FALLING:
                var v = FALL_VELOCITY * this.step;
                this.tileBack.y += v;
                this.tileFront.y += v;
                this.step++;
                this.vacc += v;
                
                if ( this.vacc > this.yTo ) {
                 
                    this.state = STATE_INACTIVE;
                    this.emit('stopfalling', this);
                    this.scene.requestSoundPlay(SOUND.TILE_CRASHING);
                    
                }
                break;
    
        }
        
    }
    
    shake(fall) {
      
        if (this.state == STATE_INACTIVE) {
            this.state = STATE_SHAKING;
            this.step = 0;
            this.tileFront.setVisible(false);
            this.scene.tileShaking = true;
        }
        this.fall = fall;
        
    }
}

export default Loose;