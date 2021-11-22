import { Scene } from 'phaser';
import GameState from '../ui/GameState'

class CreditsScene extends Scene {

    constructor() {
        super("CreditsScene");
    }   

    create() {

        this.textBack = this.add.image(0, 0, 'title', 'marry_jaffar').setOrigin(0,0).setAlpha(0);
        this.back = this.add.image(0, 0, 'title', 'prince').setOrigin(0,0);
        this.cropRect = this.add.rectangle(0, 0, 0, this.back.height);
        this.credits = this.add.image(0, 0, 'title', 'credits').setOrigin(0,0);
        this.cropCredits = this.add.rectangle(0, 0, 0, this.credits.height);
        
        let timeline = this.tweens.createTimeline();

        timeline.add({
            targets: this.textBack,
            alpha: 1,
            duration: 2000,
            completeDelay: 3000
        });
        
        timeline.add({
            targets: this.cropRect,
            width: this.back.width,
            duration: 200,
            completeDelay: 3000,
            onCompleteScope: this,
            onComplete: function() { this.textBack.destroy(); }
        });
    
        timeline.add({
            targets: this.cropCredits,
            width: this.credits.width,
            duration: 200,
            completeDelay: 3000,
            onCompleteScope: this,
            onComplete: function() { this.back.destroy(); }
        });
        
        timeline.add({
            targets: this.credits,
            alpha: 0,
            duration: 2000
        });

        timeline.on('complete', this.demo, this);
        timeline.play();
        
        this.input.keyboard.on('keydown', () => this.scene.start('GameScene'));
        
	}

   
	update() {

        this.back.setCrop(this.cropRect);
        this.credits.setCrop(this.cropCredits);

	}
    
    demo() {
    
        GameState.currentLevel = 0;
        this.scene.start('GameScene');
        
    }
    
}

export default CreditsScene;