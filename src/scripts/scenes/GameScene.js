import { Scene } from 'phaser';
import GameState from '../ui/GameState';
import Interface from '../ui/Interface';
import Kid from '../actors/Kid';
import Enemy from '../actors/Enemy';
import LevelManager from '../levels/LevelManager';
import SpecialEvents from '../levels/SpecialEvents';
import SNDCFG from '../levels/SoundConfig';
import { ROOM_HEIGHT, ROOM_WIDTH } from '../Config'
import { toMinutes, toMilliseconds } from '../Utils';
import { SOUND } from '../Constants';

const RED_COLOR = 'rgba(255,85,85,1)';
const STRONG_RED_COLOR = 'rgba(170,0,0,1)';
const YELLOW_COLOR = 'rgba(255,255,85,1)';
const BLACK_COLOR = 'rgba(0,0,0,1)';

class GameScene extends Scene {

    constructor() {
        super('GameScene');
    }
    
    create() {

        this.flashCount = 0;
        this.guards = [];
        this.soundPlaying = SOUND.SILENCE;
        this.requestedSoundPlay = [];
        this.resetSoundRequest();

        this.sound.stopAll();
        this.sfx = this.sound.addAudioSprite('sounds');

        const json = this.cache.json.get('level' + GameState.currentLevel);

        this.specialEvents = new SpecialEvents(this);

        this.backLayer = this.add.layer().setDepth(10);
        this.frontLayer = this.add.layer().setDepth(30);

        this.level = new LevelManager(this).create(json);

        //json.guards[0].location = 25;
        //json.guards[0].room = json.prince.room;

        json.guards.forEach( g => {
            let guard = new Enemy(this, this.level, g.location, g.direction, g.room, g.skill, g.type);
            this.guards.push(guard);
        });
        
        //json.prince.room = 15;
        //json.prince.location = 8;
        
        this.kid = new Kid(this, this.level, json.prince.location, json.prince.direction, json.prince.room);
        
        this.kid.on('changeroom', this.setupCamera, this);
        this.kid.on('changeroom', this.checkForOpponent, this);
        this.kid.on('nextlevel', this.nextLevel, this);
        this.kid.on('hit', this.hitFlash, this);
        
        
        this.setupCamera(json.prince.room);
        
        this.ui = new Interface(this);
        this.ui.setPlayer(this.kid);
        
        this.input.keyboard.on('keydown-Q', this.previousLevel, this);
        this.input.keyboard.on('keydown-W', this.nextLevel, this);
        this.input.keyboard.on('keydown-R', this.reset, this);

        this.input.keyboard.on('keydown-U', this.viewRoom, this);
        this.input.keyboard.on('keydown-H', this.viewRoom, this);
        this.input.keyboard.on('keydown-J', this.viewRoom, this);
        this.input.keyboard.on('keydown-N', this.viewRoom, this);

        this.input.keyboard.on('keydown-ENTER', this.restart, this);
        this.input.keyboard.on('keydown-SPACE', this.showTimeLeft, this);
        
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS).on('down', this.decrementTime, this); // MINUS key on Chrome
        this.input.keyboard.addKey(173).on('down', this.decrementTime, this); // MINUS key on Firefox
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT).on('down', this.decrementTime, this); // MINUS key on numpad


        this.time.addEvent({delay: 1000, loop: true, callback: this.updateTime, callbackScope: this});

        this.specialEvents.levelStart();
        this.sfx.on('complete', () => { this.soundPlaying = SOUND.SILENCE});
        
	}
    
    update() {
        
        this.level.update();
        this.kid.updateActor();
        this.guards.forEach( g => { g.updateActor(); });
        this.ui.update();
        this.flash();
        this.playSound();
         
    }

    updateTime() {
        GameState.timeLeft -= 1000;
        const min = toMinutes(GameState.timeLeft);
        if (min == 0) {
            this.gameOver();
        } else {
            if ((min % 5 == 0) || (min <= 1)) this.showTimeLeft();
        }
        
    }

    playSound() {

        if ((this.soundPlaying == SOUND.SILENCE) || SNDCFG[this.soundPlaying].int) {

            const last = (this.soundPlaying == SOUND.SILENCE) ? SNDCFG.length : this.soundPlaying + 1;

            for (var i=0; i < last; i++) {

                if (this.requestedSoundPlay[i]) {
                    this.soundPlaying = i;
                    this.sfx.play(SNDCFG[i].key);
                    break;
                }
                
            };

        }

        this.resetSoundRequest();

    }

    requestSoundPlay(sound, tile) {

        if ((tile != undefined) && !this.tileOnScreen(tile)) return;
        this.requestedSoundPlay[sound] = true;

    }

    tileOnScreen(tile) {
        return true;
    }

    resetSoundRequest() {

        for (var i=0; i < SNDCFG.length; i++) this.requestedSoundPlay[i] = false;

    }

    decrementTime() {
        console.log('decrement');
        const min = toMinutes(GameState.timeLeft);
        GameState.timeLeft = toMilliseconds(Math.ceil(min - 1));
        this.showTimeLeft();
    }

    incrementTime() {
        const min = toMinutes(GameState.timeLeft);
        GameState.timeLeft = toMilliseconds(Math.floor(min) + 1);
        this.showTimeLeft();
    }

    flash() {

        if (this.flashCount) {
            this.cameras.main.setBackgroundColor(this.flashCount % 2 == 0 ? this.flashColor : BLACK_COLOR );
            this.flashCount--;
        }
    
    }

    hitFlash() {

        this.flashColor = RED_COLOR;
        this.flashCount = 2;
        
    }

    swordFlash() {
        this.flashColor = YELLOW_COLOR;
        this.flashCount = 6;
    }

    potionFlash() {
        this.flashColor = STRONG_RED_COLOR;
        this.flashCount = 2;
    }

    showTimeLeft() {
        this.ui.showTimeLeft();
    }
    
	nextLevel() {

		GameState.currentLevel++;
        if (GameState.currentLevel == 16) GameState.currentLevel = 1;
        this.saveGameState();
        this.reset();

	}
    
    previousLevel() {

		GameState.currentLevel--;
        if (GameState.currentLevel == 0) GameState.currentLevel = 14;
        this.reset();

	}
    
    reset() {
        
        if ( [2,4,6,8,9,12,15].indexOf(GameState.currentLevel) > -1 ) {
            
            this.scene.start('CutScene');
            
        } else {
        
            this.scene.restart();
        
        }
        
    }

    gameOver() {
        GameState.currentLevel = 16;
        GameState.kidHasSword = false;
        GameState.kidHealth = 3;
        GameState.kidMaxHealth = 3;
        GameState.timeLeft = 3600000;
        this.scene.start('CutScene');
    }

    restart() {

        if (!this.kid.alive) {
            GameState.kidHealth = GameState.kidMaxHealth;
            this.scene.restart();
        }

    }
    
    setupCamera(room) {
      
        if (room == -1) return;
        this.cameras.main.scrollX = this.level.rooms[room].x * ROOM_WIDTH;
        this.cameras.main.scrollY = this.level.rooms[room].y * ROOM_HEIGHT;
        this.currentRoom = room;
        
    }

    saveGameState() {
        GameState.kidHasSword = this.kid.hasSword;
        GameState.kidMaxHealth = this.kid.maxHealth;
        GameState.kidHealth = this.kid.health;
    }
    
    checkForOpponent(room) {
        
        this.guards.forEach( guard => {
            
            if ( ( guard.room == room ) && guard.alive ) {
                
                this.kid.opponent = guard;
                guard.opponent = this.kid;
                this.ui.setOponent(guard);
                
            }
            
        });
    }

    viewRoom(event) {

        let room = -1;

        switch (event.key) {
            case 'u':
            case 'U':
                 room = this.level.rooms[this.currentRoom].links.up; break;
            case 'n': 
            case 'N':
                room = this.level.rooms[this.currentRoom].links.down; break;
            case 'h': 
            case 'H':
                room = this.level.rooms[this.currentRoom].links.left; break;
            case 'j':
            case 'J':
                room = this.level.rooms[this.currentRoom].links.right; break;
        }
       
        if (room != -1) this.setupCamera(room);
    
    }

}

export default GameScene;