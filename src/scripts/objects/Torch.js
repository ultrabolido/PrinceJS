import Object from './Object';

const FIRE_X_OFFSET = 40;
const FIRE_Y_OFFSET = 18;

class Torch extends Object {
    
    constructor(scene, x, y, tileType, levelType) {
        super(scene, x, y, tileType, levelType );

        this.scene = scene;
        this.fire = this.scene.add.sprite(x + FIRE_X_OFFSET,y + FIRE_Y_OFFSET,'general','fire_1').setOrigin(0,0);
        this.scene.backLayer.add(this.fire);

        this.fire.anims.create({
            key: 'fire',
            frames: this.scene.anims.generateFrameNames('general', { prefix: 'fire_', start: 1, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.fire.play({ key: 'fire', startFrame: Phaser.Math.Between(0,8) },true);   
        
    }

    update() {

    }

    setX(x) {
        super.setX(x);
        this.fire.setX(x + FIRE_X_OFFSET);
    }

    setY(y) {
        super.setY(y);
        this.fire.setY(y + FIRE_Y_OFFSET);
    }
    
    hideTileOnCutscene() {
        this.tileBack.setFrame('palace_0', false, false);
        this.tileFront.setFrame('palace_0_fg', false, false);
    }
    
    
}

export default Torch;
