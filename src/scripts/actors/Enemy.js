import Fighter from './Fighter';

const STRIKE_PROBABILITY =      [  61, 100,  61,   61, 61,  40, 100, 220, 0,  48,  32,  48 ];
const RESTRIKE_PROBABILITY =    [   0,   0,   0,   5,   5, 175,  16,   8, 0, 255, 255, 150 ];
const BLOCK_PROBABILITY =       [   0, 150, 150, 200, 200, 255, 200, 250, 0, 255, 255, 255 ];
const IMPAIRBLOCK_PROBABILITY = [   0,  61, 61,  100, 100, 145, 100, 250, 0, 145, 255, 175 ];
const ADVANCE_PROBABILITY =     [ 255, 200, 200, 200, 255, 255, 200,   0, 0, 255, 100, 100 ];
const REFRAC_TIMER =            [  16,  16,  16,  16,   8,   8,   8,   8, 0,   8,   0,   0 ];
const EXTRA_STRENGTH =          [   0,   0,   0,   0,   1,   0,   0,   0, 0,   0,   0,   0 ];

const STRENGTH = [ 4, 3, 3, 3, 3, 4, 5, 4, 4, 5, 5, 5, 4, 6, 0, 0 ];

class Enemy extends Fighter {

    constructor(scene, level, location, direction, room, skill, key) {
    
        super(scene, level, location, direction, room, key, 'fighter');
    
        this.charX += direction * 7;
        
        this.strikeProbability = STRIKE_PROBABILITY[skill];
        this.restrikeProbability = RESTRIKE_PROBABILITY[skill];
        this.blockProbability = BLOCK_PROBABILITY[skill];
        this.impairblockProbability = IMPAIRBLOCK_PROBABILITY[skill];
        this.advanceProbability = ADVANCE_PROBABILITY[skill];
        
        this.refracTimer = 0;
        this.blockTimer = 0;
        this.strikeTimer = 0;
        
        this.health = EXTRA_STRENGTH[skill] + STRENGTH[this.level.number];
        this.maxHealth = this.health;
        
        this.charSkill = skill;

        this.setDepth(25);
        
        this.on('updatehealth', this.resetRefracTimer, this);
        this.on('strickeblocked', this.resetBlockTimer, this);
        this.on('enemyStrike', this.resetStrikeTimer, this);

    }

    updateBehaviour() {
    
    
        if ( !this.opponent || !this.alive ) return;
        if ( !this.opponent.alive ) return;
        
        console.log('----------- NEXT FIGHT TURN ------------');
        
        if (this.refracTimer > 0)  this.refracTimer--;
        if (this.blockTimer  > 0)  this.blockTimer--;
        if (this.strikeTimer > 0)  this.strikeTimer--;
        
        if ( this.getAction() == 'stabbed' || this.getAction() == 'stabkill' || this.getAction() == 'dropdead') return;
        
        var distance = this.opponentDistance();
        
        if (this.swordDrawn) {
            
            if ( distance >= 35) {
    
                this.oppTooFar(distance);
    
            } else if ( distance < 12 ) {
                       
                this.oppTooClose(distance);   
            
            } else this.oppInRange(distance);    
            
        } else {
            
            if ( this.canSeeOpponent() > 0 ) {
                
                this.engarde();
                
            }
            
        }
        
    }

    enemyAdvance = function() {
    
        var tileF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
        var tile2F = this.level.getTileAt(this.charBlockX + (this.charFace * 2), this.charBlockY, this.room);
        
        if (tileF.isWalkable() || tile2F.isWalkable() ) {
            
            this.advance();
            
        } else {
         
            this.retreat();
            
        }
        
    }
    
    oppTooFar(distance) {
      
        if (this.refracTimer != 0) return;
        if (this.opponent.getAction() == 'running') {
    
            if ( distance < 40 ) this.strike();
    
        } else if (this.opponent.getAction() == 'runjump') {
    
            if (distance < 50 ) this.strike();
    
        } else this.enemyAdvance();
        
    }
    
    oppTooClose() {
      
        if ( this.charFace == this.opponent.charFace ) {
                            
                this.retreat();
    
        } else {
    
                this.advance();
    
        }
        
    }
    
    oppInRange(distance) {
      
        if ( !this.opponent.swordDrawn ) {
                            
            if (this.refracTimer == 0) {
                
                if ( distance < 29 ) {
                    
                    this.strike();
                    
                } else {
                    
                    this.advance();
                    
                }
                
            }
    
        } else {
    
                this.oppInRangeArmed(distance);
    
        }
        
    }
    
    oppInRangeArmed(distance) {
      
        if ( ( distance < 10 ) || ( distance >= 29 ) ) {
            
            this.tryAdvance();
            
        } else {
            
            this.tryBlock();
            if ( this.refracTimer == 0 ) {
                
                if ( distance < 12 ) {
                    
                    this.tryAdvance();
                    
                } else {
                    
                    this.tryStrike();
                    
                }
                
            }
            
        }
    
    }
    
    tryAdvance() {
    
        if ( (this.charSkill == 0) || ( this.strikeTimer == 0 ) ) {
            
            if ( this.advanceProbability > Phaser.Math.Between(0,254) ) this.advance();
            
        }
        
    }
    
    tryBlock() {
    
        if ( this.opponent.frameID(152,153) || this.opponent.frameID(162) || this.opponent.frameID(2,3) || this.opponent.frameID(12) ) {
            
            if ( this.blockTimer != 0 ) {
                
                if ( this.impairblockProbability > Phaser.Math.Between(0,254) ) this.block();
                
            } else{
                
                if ( this.blockProbability > Phaser.Math.Between(0,254) ) this.block();
                
            }
            
        }
        
    }
    
    tryStrike() {
    
        if ( this.opponent.frameID(169) || this.opponent.frameID(151) || this.opponent.frameID(19) || this.opponent.frameID(1) ) return;
        if ( this.frameID(150) ) {
            
            if ( this.restrikeProbability > Phaser.Math.Between(0,254) ) this.strike();
            
        } else {
            
            if ( this.strikeProbability > Phaser.Math.Between(0,254) ) this.strike();
                
        }
        
    }
    
    resetRefracTimer() {
      
        this.refracTimer = REFRAC_TIMER[this.charSkill];
        
    }
    
    resetBlockTimer() {
      
        this.blockTimer = 4;
        
    }
    
    resetStrikeTimer() {
      
        this.strikeTimer = 15;
        
    }
    
}

export default Enemy;