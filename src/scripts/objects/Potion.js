import Object from './Object';
import { TILE } from '../Constants';

const BUBBLE_COLORS = [ 'red', 'green', 'blue' ];

class Potion extends Object {

    constructor(scene, x, y, levelType, modifier) {

        super(scene, x, y, TILE.POTION, levelType);

        this.potionY = 53;
        if ((modifier > 1) && (modifier < 5)) this.potionY -= 4;
        
        this.potion = scene.add.sprite(25, this.potionY, 'general').setOrigin(0,0);
        this.tileFront.setFrame(this.tileFront.frame.name + '_' + modifier).setOrigin(0,0);
        scene.frontLayer.add(this.potion);
        
        this.color = BUBBLE_COLORS[Math.floor(modifier / 2)];

        this.potion.anims.create({
            key: 'bubbles',
            frames: scene.anims.generateFrameNames('general', { prefix: 'bubble_', start: 1, end: 7, suffix: '_' + this.color }),
            frameRate: 15,
            repeat: -1
        });

        this.potion.play({key: 'bubbles', startFrame: Phaser.Math.Between(0,6)}, true );

    }

    setX(x) {
        super.setX(x);
        this.potion.setX(x + 25);
    }

    setY(y) {
        super.setY(y);
        this.potion.setY(y + this.potionY);
    }

    update() {
        
    }

} 

export default Potion;