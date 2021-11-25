import Object from './Object';
import { TILE } from '../Constants';

const STATE_CLOSED = 0;
const STATE_OPEN = 1;
const STATE_RAISING = 2;
const STATE_DROPPING = 3;
const STATE_FAST_DROPPING = 4;
const STATE_WAITING = 5;

class Gate extends Object {

    constructor(scene, x, y, levelType, modifier) {
        super(scene, x, y, TILE.GATE, levelType);

        this.gateBackY = - modifier * 46;
        this.gateFrontY = this.gateBackY + 16;
    
        this.gateBack = scene.add.sprite(0, this.gateBackY, this.key, this.key + '_gate').setOrigin(0,0);
        scene.backLayer.add(this.gateBack);
        
        this.gateFront = scene.add.sprite(32, this.gateFrontY, this.key, this.key + '_gate_fg').setOrigin(0,0);
        //this.gateFront.setCrop(0, -this.gateBackY, this.gateFront.width, this.gateFront.height + this.gateBackY);
        scene.frontLayer.add(this.gateFront);
        
        this.state = modifier;
        this.step = 0;
    }

    setX(x) {
        super.setX(x);
        this.gateBack.setX(x);
        this.gateFront.setX(x + 32);
    }

    setY(y) {
        super.setY(y);
        this.gateBack.setY(y + this.gateBackY);
        this.gateFront.setY(y + this.gateFrontY);
    }

    setDepth(z) {
        super.setDepth(z);
        this.gateBack.setDepth(z);
        this.gateFront.setDepth(z);
    }
    
    update() {
    
        switch (this.state) {

            case STATE_RAISING:  
                if (this.gateBackY == -47) {
                    
                    this.state = STATE_WAITING;
                    this.step = 0;
                
                } else {
                
                    this.gateBackY -= 1;
                    this.gateBack.y -= 1;
                    this.gateFront.y -= 1;
                    //this.gateFront.setCrop(0, -this.gateBackY, this.gateFront.width, this.gateFront.height);
                
                }
                break;

            case STATE_WAITING:
                this.step++;
                if (this.step == 50) {
                    
                    this.state = STATE_DROPPING;
                    this.step = 0;
                    
                }
                break;

            case STATE_DROPPING:                         
                if (!this.step) {
                    
                    this.gateBack.y += 1;
                    this.gateBackY += 1;
                    this.gateFront.y += 1;
                    //this.gateFront.setCrop(0, -this.gateBackY, this.gateFront.width, this.gateFront.height + 1);
                    if (this.gateBackY == 0) {
                        
                        //this.gateFront.setCrop();
                        this.state = STATE_CLOSED;
                        
                    }
                    this.step++;
                
                } else {
                    
                    this.step = (this.step + 1) % 4;
                    
                }
                break;

            case STATE_FAST_DROPPING:
                this.gateBack.y += 10;
                this.gateBackY += 10;
                this.gateFront.y += 10;
                //this.gateFront.setCrop(0, -this.gateBackY, this.gateFront.width, this.gateFront.height + 10);
                if (this.gateBackY >= 0) {
                    
                    this.gateBack.y -= this.gateBackY;
                    this.gateFront.y -= this.gateBackY;
                    this.gateBackY = 0;
                    //this.gateFront.setCrop();
                    this.state = STATE_CLOSED;
                    
                }
                console.log(this.gateBackY);
                break;
            }
    }

    raise() {
  
        this.step = 0;
        if ( this.state != STATE_WAITING ) {
            
            this.state = STATE_RAISING;
            
        }
        
    }

    drop() {
    
        if ( this.state != STATE_CLOSED ) {
            
            this.state = STATE_FAST_DROPPING;
            this.scene.sfx.play('06-gate-reaches-floor');
            
        }
        
    }

    getBounds() {
  
        var bounds = new Phaser.Geom.Rectangle(0,0,0,0);
        
        bounds.height = 63 - 10 + this.gateBackY - 4;
        bounds.width = 4;
        bounds.x = this.roomX * 32 + 40;
        bounds.y = this.roomY * 63;
        
        return bounds;
        
    }

    canCross(height) {
    
        return (Math.abs(this.gateBackY)  >  height) ;
        
    }

}

export default Gate;