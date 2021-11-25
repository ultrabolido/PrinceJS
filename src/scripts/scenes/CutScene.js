import { Scene } from 'phaser';
import Torch from '../objects/Torch'
import Star from '../objects/Star'
import Clock from '../objects/Clock'
import Actor from '../actors/Actor'
import GameState from '../ui/GameState'
import { TILE, LEVEL } from '../Constants';

const STATE_WAITING = 0;
const STATE_RUNNING = 1;
const TORCHES = [ { x: 53, y: 81 } , { x: 171, y: 81 } ];
const STARS = [ { x: 20, y: 97 } , { x: 16, y: 104 }, { x: 23, y: 110 }, { x: 17, y: 116 }, { x: 24, y: 120 }, { x: 18, y: 128 } ];
const BLACK = 'rgba(0,0,0,1)';
const WHITE = 'rgba(255,255,255,1)';

class CutScene extends Scene {

    constructor() {
        super("CutScene");
    }
    
    create() {
        
        this.reset();
        
        this.program = this.cache.json.get('cutscene' + GameState.currentLevel).program;

        this.backLayer = this.add.layer().setDepth(10);
        this.frontLayer = this.add.layer().setDepth(30);
        
        const room = this.add.image(0, 0, 'cutscene', 'room').setOrigin(0,0);
        const bed = this.add.image(0, 142, 'cutscene', 'room_bed').setOrigin(0,0);
        const pillar_left = this.add.image(59, 120, 'cutscene', 'room_pillar').setOrigin(0,0);
        const pillar_right = this.add.image(240, 120, 'cutscene', 'room_pillar').setOrigin(0,0);

        this.backLayer.add([room, bed]);
        this.frontLayer.add([pillar_left, pillar_right]);
            
        TORCHES.forEach( (pos) => {

            let torch = new Torch(this, pos.x, pos.y, TILE.TORCH, LEVEL.PALACE);
            torch.hideTileOnCutscene();
            this.ambientObjects.push(torch);

        });
        
        STARS.forEach( (pos) => {

            let star = new Star(this, pos.x, pos.y);
            this.ambientObjects.push(star);

        })
        
        if (GameState.currentLevel != 15) {

            this.input.keyboard.on('keydown', () => {
                this.sound.stopAll();
                this.scene.start('GameScene');
            });

        }

        this.cameras.main.fadeIn(2000);

        this.time.addEvent({delay: 100, loop: true, callback: this.customUpdate, callbackScope: this});
        
	}
    
    executeProgram() {
      
        if (this.sceneState == STATE_WAITING) {
         
            this.waitingTime--;
            if (this.waitingTime == 0) this.sceneState = STATE_RUNNING;
            return;
            
        }
        
        while (this.sceneState == STATE_RUNNING) {
            
            var opcode = this.program[this.pc];
            switch (opcode.i) {

                case 'START':
                    break;
                    
                case 'END':
                    this.endCutscene();
                    this.sceneState = STATE_WAITING;
                    this.waitingTime = 1000;
                    break;

                case 'ACTION':
                    console.log("Action: " + opcode.p2);
                    this.actors[opcode.p1].setAction(opcode.p2);
                    break;

                case 'ADD_ACTOR':
                    this.actors[opcode.p1] = new Actor(this,opcode.p3, opcode.p4, opcode.p5, opcode.p2);
                    break;
                    
                case 'REM_ACTOR':
                    this.actors[opcode.p1].remove();
                    break;
                    
                case 'ADD_OBJECT':
                    this.sceneObjects[opcode.p1] = new Clock(this,opcode.p3,opcode.p4, opcode.p2);
                    break;
                    
                case 'START_OBJECT':
                    this.sceneObjects[opcode.p1].activate();
                    break;
                    
                case 'EFFECT':
                    this.flash = true;
                    this.tick = 0;
                    break;

                case 'WAIT':
                    this.sceneState = STATE_WAITING;
                    this.waitingTime = opcode.p1;
                    break;

                case 'MUSIC':
                    this.sound.playAudioSprite('music', opcode.p1);
                    break;

                case 'SOUND':
                    this.sound.playAudioSprite('sounds', opcode.p1);
                    break;

            }
            this.pc++;
            
        }
        
    }

    customUpdate() {
        
        this.executeProgram();
        
        this.ambientObjects.forEach((o) => o.update());
        this.sceneObjects.forEach((o) => o.update());
        this.actors.forEach((o) => o.updateActor());
        
        if (this.flash) {
            
            this.cameras.main.setBackgroundColor(this.tick % 2 ? WHITE : BLACK);
            this.tick++;
            this.flash = (this.tick < 7);
            
        }
    }
   
    endCutscene() {
      
        this.cameras.main.fadeOut(2000);
        this.cameras.main.on('camerafadeoutcomplete', this.nextScene, this);
        
    }
        
    nextScene() {
        
        switch (GameState.currentLevel) {

            case 1: this.scene.start('CreditsScene'); break;
            case 15: GameState.currentLevel = 1; this.scene.start('EndTitleScene'); break;
            case 16: GameState.currentLevel = 1; this.scene.start('TitleScene'); break;
            default: this.scene.start('GameScene');
        }
        
    }
    
    reset() {
        
        this.actors = [];
        this.ambientObjects = [];
        this.sceneObjects = [];

        this.flash = false;
        this.tick = 0;

        this.pc = 0;
        this.waitingTime = 0;
        this.sceneState = STATE_RUNNING;
        
    }
    
}

export default CutScene;