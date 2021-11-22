import { Scene } from 'phaser';

class TitleScene extends Scene {

    constructor() {
        super("TitleScene");
    }

    create() {

        this.back = this.add.image(0, 0, 'title', 'main_background').setOrigin(0,0);
        this.presents = this.add.image(this.scale.width * 0.5, this.scale.height * 0.5 + 29.5, 'title', 'presents').setOrigin(0.5,0.5).setVisible(false);
        this.author = this.add.image(this.scale.width * 0.5 - 3, this.scale.height * 0.5 + 37, 'title', 'author').setOrigin(0.5,0.5).setVisible(false);
        this.prince = this.add.image(0, 0, 'title', 'prince').setOrigin(0,0).setVisible(false);
        this.textBack = this.add.image(0, 0, 'title', 'in_the_absence').setOrigin(0,0);
        
        this.cropRect = this.add.rectangle(0, 0, 0, this.textBack.height);
        this.textBack.setCrop(this.cropRect);

        this.cameras.main.fadeIn(2000)

        this.tween1 = this.tweens.add({
            targets: this.cropRect,
            width: this.textBack.width,
            duration: 200,
            paused: true,
            completeDelay: 2000,
            onCompleteScope: this,
            onComplete: function() { this.cameras.main.fadeOut(2000) }
        });

        this.time.delayedCall(4000, () => this.presents.setVisible(true), [], this);
        this.time.delayedCall(6000, () => this.presents.setVisible(false), [], this);
        this.time.delayedCall(7000, () => this.author.setVisible(true), [], this);
        this.time.delayedCall(9000, () => this.author.setVisible(false), [], this);
        this.time.delayedCall(10000, () => this.prince.setVisible(true), [], this);
        this.time.delayedCall(12000, () => this.tween1.play(), [], this);
    
        this.cameras.main.on('camerafadeoutcomplete', () => this.scene.start('CutScene'));
        this.input.keyboard.on('keydown', () => this.scene.start('GameScene'));
        
	}

	update() {
 
        this.textBack.setCrop(this.cropRect);

	}
    
}

export default TitleScene;
