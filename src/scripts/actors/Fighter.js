import Actor from './Actor';
import { convertBlockXtoX, convertBlockYtoY, convertXtoBlockX, convertYtoBlockY } from '../Utils';
import { ROOM_HEIGHT, ROOM_WIDTH } from '../Config';
import { ACTION, SOUND } from '../Constants';

const GRAVITY = 3;
const TOP_SPEED = 33;

class Fighter extends Actor {

    constructor(scene, level, location, direction, room, key, animKey) {
        
        const charBlockX = location % 10;
        const charBlockY = Math.floor( location / 10);
        
        super(scene, convertBlockXtoX(charBlockX), convertBlockYtoY(charBlockY), direction, key, animKey);

        this.level = level;
        this.room = room;
        
        this.charBlockX = charBlockX;
        this.charBlockY = charBlockY;
        
        this.charXVel = 0;
        this.charYVel = 0;
        this.actionCode = ACTION.STAND;
        
        this.charSword = true;
        this.showSplash = false;
        
        this.swordFrame = 0;
        this.swordDx = 0;
        this.swordDy = 0;
        
        this.splash = scene.add.sprite(0,0,'general', this.charName + '-splash');
        this.splash.setOrigin(0.5,0.5);
        this.splash.x = -6;
        this.splash.y = -15;
        this.splash.setVisible(false);
        this.splash.setDepth(20);
        
        this.sword = scene.add.sprite(0,0,'general');
        this.sword.scaleX *= -this.charFace;
        this.sword.setDepth(21);
        this.sword.setOrigin(0,1);
        
        this.baseX = this.level.rooms[this.room].x * ROOM_WIDTH;
        this.baseY = this.level.rooms[this.room].y * ROOM_HEIGHT + 3;
        
        this.swordAnims = scene.cache.json.get('sword-anims');
        
        this.registerCommand(0xF9,this.CMD_ACT);
        this.registerCommand(0xF6,this.CMD_DIE);
        
        this.opponent = null;
        
        this.health = 3;
        this.maxHealth = 3;
        this.alive = true;
        this.swordDrawn = false;
        this.blocked = false;

        this.hasSword = true;
        
    }

    CMD_ABOUTFACE() {
    
        this.charFace *= -1;
        this.scaleX *= -1;
        this.sword.scaleX *= -1;
        this.splash.scaleX *= -1;
        
    }
    
    CMD_DIE() {
        
        if (this.charName == 'kid') this.emit('dead');
        this.alive = false;
        this.showSplash = true;
        this.swordDrawn = false;
        
    }
    
    CMD_ACT(data) {
        
        this.actionCode = data.p1;
        if (data.p1 == 1) {
            
            this.charXVel = 0;
            this.charYVel = 0;
            
        }
        
    }
    
    CMD_FRAME(data) {
        
        this.charFrame = data.p1;
        this.updateCharFrame();
        this.updateSwordFrame();
        this.updateBlockXY();
        this.processing = false;
        
    }
    
    updateSwordFrame() {
        
        const framedef = this.animation.framedef[this.charFrame];
        
        this.charSword = (typeof framedef.fsword !== 'undefined');
        
        if (this.charSword) {
            
            var stab = this.swordAnims.swordtab[framedef.fsword - 1];
            this.swordFrame = stab.id;
            this.swordDx = stab.dx;
            this.swordDy = stab.dy;  
            
        }
        
    }
    
    updateBlockXY() {
        
        var footX = this.charX + ( this.charFdx * this.charFace ) - ( this.charFfoot * this.charFace );
        var footY = this.charY + this.charFdy;
        this.charBlockX = convertXtoBlockX(footX);
        this.charBlockY = convertYtoBlockY(footY); // - this.height);
        
        if (this.charBlockX < 0) {
            this.charX += 140;
            this.baseX -= ROOM_WIDTH;
            this.charBlockX = 9;
            this.room = this.level.rooms[this.room].links.left;
        }
        
        if (this.charBlockX > 9) {
            this.charX -= 140;
            this.baseX += ROOM_WIDTH;
            this.charBlockX = 0;
            this.room = this.level.rooms[this.room].links.right;
        }  
        
    }
    
    updateActor() {
        
        this.updateBehaviour();
        this.processCommand();
        this.updateAcceleration();
        this.updateVelocity();
        this.checkFight();
        this.checkBarrier();
        this.updateCharPosition();
        this.updateSwordPosition();
        this.updateSplashPosition();
        
    };
    
    updateBehaviour() {
        
        
    }
    
    checkBarrier() {

        if (!this.swordDrawn) return;

        var blockX = convertXtoBlockX( this.charX - this.charFdx * this.charFace );
        console.log(blockX + ' ');
        var tileNext = this.level.getTileAt(blockX-1,this.charBlockY,this.room);
    
        if ( tileNext.isBarrier() ) {
            this.charX = convertBlockXtoX(blockX+1) - 0;
            this.updateBlockXY();

        }

    }

    checkFight() {
        
        if (this.opponent == null) return;
        
        if (this.blocked && this.getAction() != 'strike') {
         
            this.retreat();
            this.processCommand();
            this.blocked = false;
            return;
            
        }
        
        const distance = this.opponentDistance();
        
        switch (this.getAction()) {
                
            /*case 'stand':     
                if ( !this.flee && this.opponent.alive && this.haveSword ) {
                    
                    if (this.charName == 'kid' ) {
                            
                        this.engarde();
                            
                    } 
                    
                }
                break;*/
                
            case 'engarde':
                if (!this.opponent.alive) {
                
                    this.sheathe();
                    this.opponent = null;
                    
                }
                
                if ( distance < -4 )  {
                        
                        //if (this.charName == 'kid' ) {
                            
                            this.turnengarde();
                            this.opponent.turnengarde();
                            
                        //}
                    
                }
                break;
                
            case 'strike':
                
                if ( this.opponent.getAction() == 'climbstairs' ) return;
                if ( !this.frameID(153,154) && !this.frameID(3,4) ) return;
                
                if ( !this.opponent.frameID(150) && !this.opponent.frameID(0) ) {
                    
                    if (this.charName == 'kid') this.scene.requestSoundPlay(SOUND.SWORD_MOVING);

                    if ( this.frameID(154) || this.frameID(4) )  {
                    
                        var minHurtDistance = this.opponent.swordDrawn ? 12 : 8;
    
                        if ( ( distance >= minHurtDistance ) && ( distance < 29 ) ) {
    
                            this.opponent.stabbed();
    
                        }
                        
                    }
                    
                } else {
                    
                    this.opponent.blocked = true;
                    this.setAction('blockedstrike');
                    this.processCommand();
                    this.emit('strikeblocked');
                    if (this.charName == 'kid') this.scene.requestSoundPlay(SOUND.SWORD_VS_SWORD);
                    
                }
                break;
                
                
        }
    }
    
    
    updateSwordPosition() {
         
        if (this.charSword) {
            
            this.sword.setFrame('sword' + this.swordFrame);
            this.sword.x = this.x + this.swordDx * this.charFace;
            this.sword.y = this.y + this.swordDy;
            this.sword.setOrigin(0,1);
            
        }
        
        this.sword.setVisible(this.charSword);
          
    }

    updateSplashPosition() {
        
        this.splash.x = this.x - 6 * this.charFace;
        this.splash.y = this.y - 15;

        this.splash.setVisible(this.showSplash);
        this.showSplash = false;

    }
    
    
    opponentDistance() {
      
        if ( this.opponent.room != this.room ) return 999;
        
        var distance = (this.opponent.charX - this.charX) * this.charFace;
        if ( (distance >= 0) && (this.charFace != this.opponent.charFace) ) distance += 13;
        return distance;
        
    }
    
    updateVelocity() {
    
        this.charX += this.charXVel;
        this.charY += this.charYVel; 
        
    }
    
    updateAcceleration() {
    
        if ( this.actionCode == ACTION.FREE_FALL ) {
            
            this.charYVel += GRAVITY;
            if (this.charYVel > TOP_SPEED) { this.charYVel = TOP_SPEED; }
            
        }
        
    }
    
    engarde() {
      
        this.setAction('engarde');
        this.swordDrawn = true;
        if (this.charName == 'kid') this.scene.requestSoundPlay(SOUND.DRAW_SWORD);
        
    }
    
    turnengarde() {
      
        this.setAction('turnengarde');
        
    }
    
    sheathe() {
      
        this.setAction('resheathe');
        this.swordDrawn = false;
        if (this.charName == 'kid') this.scene.requestSoundPlay(SOUND.DRAW_SWORD);
        
    }
    
    retreat() {
      
        if ( this.frameID(158) || this.frameID(8) || this.frameID(20,21) ) {
            
            this.setAction('retreat');
            this.allowRetreat = false;
        
        }
        
    }
    
    advance() {
      
        if ( this.frameID(158) || this.frameID(8) || this.frameID(20,21) ) {
            
            this.setAction('advance');
            this.allowAdvance = false;
        
        }
        
    }
    
    strike() {
      
        if ( this.frameID(157,158) || this.frameID(165) || this.frameID(7,8) || this.frameID(20,21) || this.frameID(15) ) {
            
            this.setAction('strike');
            this.allowStrike = false;
            
        } else {
            
            if ( this.frameID(150) || this.frameID(0) || this.blocked ) {
                
                this.setAction('blocktostrike');
                this.allowStrike = false;
                this.blocked = false;
                
            }
            
        }
        if (this.opponent) this.opponent.emit('enemystrike');
        
    }
    
    block() {

        if (this.charName == 'kid') this.scene.requestSoundPlay(SOUND.SWORD_VS_SWORD);

        if ( this.frameID(8) || this.frameID(20,21) || this.frameID(18) || this.frameID(15) ) {
            
            if (this.opponentDistance() >= 32) return this.retreat();
            if (!this.opponent.frameID(152) && !this.opponent.frameID(2)) return;
            this.setAction('block');
            
        } else {
            
            if (!this.frameID(17)) return;
            this.setAction('striketoblock');
            
        }
        
        this.allowBlock = false;
        
    }
    
    stabbed() {
      
        if ( this.health == 0 ) return;
    
        this.charY = convertBlockYtoY(this.charBlockY);

        if ( this.charName == 'skeleton') return;
        
        var damage = this.swordDrawn ? 1 : this.health;
        this.hit(damage);
        this.setAction(this.health == 0 ? 'stabkill' : 'stabbed');
        if (this.charName == 'kid') {
            this.scene.requestSoundPlay(SOUND.KID_HURT);
        } else {
            this.scene.requestSoundPlay(SOUND.GUARD_HURT);
        }
        
    }
        
    canSeeOpponent() {
      
        if (this.opponent == null) return 0;
        
        if (this.opponent.room != this.room) return 0;
        
        if (this.opponent.charBlockY != this.charBlockY) return 0;
        
        return 1;
        
    }

    hit(damage) {
        this.health -= damage;
        this.showSplash = true;
        this.emit('updatehealth');
        if (this.charName == 'kid') this.emit('hit');
    }

}

export default Fighter;