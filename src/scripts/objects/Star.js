class Star extends Phaser.GameObjects.Sprite {
    
    constructor(scene, x, y) {

        super(scene, x, y, 'cutscene', 'star0');
        scene.backLayer.add(this);
        this.state = 0;

    }

    update() {

        const step = Phaser.Math.Between(1,30);
        
        switch (step) {
                
            case 1:
                if (this.state > 0) this.state--;
                break;
                
            case 2:
                if (this.state < 2) this.state++;
                break;
                
        }
        
        this.setFrame('star' + this.state, false, false);
    }
    
}

export default Star;