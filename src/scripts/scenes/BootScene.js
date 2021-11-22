import { Scene } from 'phaser';

class BootScene extends Scene {

    constructor() {
        super("BootScene");
    }

    preload() {

        this.load.bitmapFont('font', 'assets/font/prince_0.png', 'assets/font/prince.xml');

    }

    create() {
        
        this.scene.start('PreloadScene');
        
    }

}

export default BootScene;

