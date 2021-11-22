import { Scene } from 'phaser';

class EndTitleScene extends Scene {

    constructor() {
        super('EndTitleScene');
    }

    create() {

        this.back = this.add.image(0, 0, 'title', 'the_tyrant').setOrigin(0,0).setAlpha(0);

        this.textBack = this.add.image(0, this.scale.height, 'title', 'main_background').setOrigin(0,1);
        this.cropRect = this.add.rectangle(0, 0, 0, this.textBack.height);
            
        let timeline = this.tweens.createTimeline();

        timeline.add({
            targets: this.back,
            alpha: 1,
            duration: 2000,
            completeDelay: 3000
        });
        
        timeline.add({
            targets: this.cropRect,
            width: this.textBack.width,
            duration: 200,
            completeDelay: 3000,
            onCompleteScope: this,
            onComplete: function() { this.back.destroy(); }
        });

        timeline.add({
            targets: [this.textBack, this.back],
            alpha: 0,
            duration: 2000
        });

        timeline.on('complete', () => this.scene.start('TitleScene'));
        timeline.play();
	}
   
	update() {
 
        this.textBack.setCrop(this.cropRect);

	}

}

export default EndTitleScene;
