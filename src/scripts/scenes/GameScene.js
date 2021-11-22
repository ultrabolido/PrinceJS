import { Scene } from 'phaser';
import GameState from '../ui/GameState';
import Interface from '../ui/Interface';
import Kid from '../actors/Kid';
import Enemy from '../actors/Enemy';
import LevelManager from '../levels/LevelManager';
import { ROOM_HEIGHT, ROOM_WIDTH } from '../Config'
import { TILE } from '../Constants';

const RED_COLOR = 'rgba(255,85,85,1)';
const STRONG_RED_COLOR = 'rgba(170,0,0,1)';
const YELLOW_COLOR = 'rgba(255,255,85,1)';
const BLACK_COLOR = 'rgba(0,0,0,1)';

class GameScene extends Scene {

    constructor() {
        super('GameScene');

        this.kid;
        this.level;
        this.ui;
        this.guards = [];

        this.flashCount = 0;
    }
    
    create() {

        //GameState.currentLevel = 4;
        const json = this.cache.json.get('level' + GameState.currentLevel);

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
        //json.prince.location = 13;
        
        this.kid = new Kid(this, this.level, json.prince.location, json.prince.direction, json.prince.room);
        
        this.kid.on('changeroom', this.setupCamera, this);
        this.kid.on('changeroom', this.checkForOpponent, this);
        this.kid.on('nextlevel', this.nextLevel, this);
        this.kid.on('hit', this.hitFlash, this);
        
        
        this.setupCamera(json.prince.room);
        this.currentRoom = json.prince.room;
        
        this.ui = new Interface(this);
        this.ui.setPlayer(this.kid);
        
        // for level 1 only -> close gate first room !!!
        if ( GameState.currentLevel == 1 ) this.level.fireEvent(8, TILE.DROP_BUTTON);
        
        this.input.keyboard.on('keydown-Q', this.previousLevel, this);
        this.input.keyboard.on('keydown-W', this.nextLevel, this);
        this.input.keyboard.on('keydown-R', this.reset, this);

        this.input.keyboard.on('keydown-K', this.bottomRoom, this);
        this.input.keyboard.on('keydown-I', this.topRoom, this);
        this.input.keyboard.on('keydown-J', this.leftRoom, this);
        this.input.keyboard.on('keydown-L', this.rightRoom, this);

        this.input.keyboard.on('keydown-ENTER', this.restart, this);
        this.input.keyboard.on('keydown-SPACE', this.showTimeLeft, this);
        
	}
    
    update() {
        
        this.level.update();
        this.kid.updateActor();
        this.guards.forEach( g => { g.updateActor(); });
        this.ui.update();
        this.flash()
         
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
        this.ui.showTimeLeft(0);
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
     
        this.guards = [];
        
        if ( [2,4,6,8,9,12,15].indexOf(GameState.currentLevel) > -1 ) {
            
            this.scene.start('CutScene');
            
        } else {
        
            this.scene.restart();
        
        }
        
    }

    restart() {

        if (!this.kid.alive) {
            GameState.kidHealth = GameState.kidMaxHealth;
            this.scene.restart();
        }

    }
    
    setupCamera(room) {
      
        this.cameras.main.scrollX = this.level.rooms[room].x * ROOM_WIDTH;
        this.cameras.main.scrollY = this.level.rooms[room].y * ROOM_HEIGHT;
        
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

    bottomRoom() {
        const room = this.level.rooms[this.currentRoom].links.down;
        if (room != -1) {
            this.currentRoom = room;
            this.setupCamera(room);
        }
    }

    topRoom() {
        const room = this.level.rooms[this.currentRoom].links.up;
        if (room != -1) {
            this.currentRoom = room;
            this.setupCamera(room);
        }
    }

    leftRoom() {
        const room = this.level.rooms[this.currentRoom].links.left;
        if (room != -1) {
            this.currentRoom = room;
            this.setupCamera(room);
        }
    }

    rightRoom() {
        const room = this.level.rooms[this.currentRoom].links.right;
        if (room != -1) {
            this.currentRoom = room;
            this.setupCamera(room);
        }
    }
}

export default GameScene;