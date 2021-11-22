const SAND_X_OFFSET = 8;
const SAND_Y_OFFSET = 16;

class Clock {

    constructor(scene, x, y, state) {

        this.state = state + 1;

        this.clock = scene.add.sprite(x, y, 'cutscene', 'clock0' + this.state).setOrigin(0,0);
        this.sand = scene.add.sprite(x + SAND_X_OFFSET, y + SAND_Y_OFFSET, 'cutscene', 'clocksand01').setOrigin(0,0);
        this.sand.setVisible(false);

        scene.backLayer.add([this.clock, this.sand]);

        this.sand.anims.create({
            key: 'drop',
            frames: scene.anims.generateFrameNames('cutscene', { prefix: 'clocksand0', start: 1, end: 3 }),
            frameRate: 15,
            repeat: -1
        });

        this.active = false;

    }

    update() {

        if (this.active) {
            
            this.step++;

            if (this.step == 40) {
                this.state++;
                this.clock.setFrame('clock0' + this.state).setOrigin(0,0);
                this.step = 0;
            }

        }
    }

    activate() {
        this.active = true;
        this.sand.setVisible(true);
        this.sand.play('drop');
    }

}

export default Clock;