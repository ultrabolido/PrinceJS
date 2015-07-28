PrinceJS.Enemy = function (game, level, location, direction, room, skill, key) {
    
    PrinceJS.Fighter.call(this, game, level, location, direction, room, key, 'fighter');
    
    this.charX += direction * 7;
    
    this.strikeProbability = PrinceJS.Enemy.STRIKE_PROBABILITY[skill];
    this.restrikeProbability = PrinceJS.Enemy.RESTRIKE_PROBABILITY[skill];
    this.blockProbability = PrinceJS.Enemy.BLOCK_PROBABILITY[skill];
    this.impairblockProbability = PrinceJS.Enemy.IMPAIRBLOCK_PROBABILITY[skill];
    this.advanceProbability = PrinceJS.Enemy.ADVANCE_PROBABILITY[skill];
    
    this.refracTimer = 0;
    this.blockTimer = 0;
    this.strikeTimer = 0;
    
    this.health = PrinceJS.Enemy.EXTRA_STRENGTH[skill] + PrinceJS.Enemy.STRENGTH[this.level.number];
    
    this.charSkill = skill;
    
    this.onDamageLive.add(this.resetRefracTimer,this);
    this.onStrikeBlocked.add(this.resetBlockTimer,this);
    this.onEnemyStrike.add(this.resetStrikeTimer,this);
    
};

PrinceJS.Enemy.STRIKE_PROBABILITY = [ 61, 100, 61, 61, 61, 40, 100, 220, 0, 48, 32, 48 ];
PrinceJS.Enemy.RESTRIKE_PROBABILITY = [ 0, 0, 0, 5, 5, 175, 16, 8, 0, 255, 255, 150 ];
PrinceJS.Enemy.BLOCK_PROBABILITY = [ 0, 150, 150, 200, 200, 255, 200, 250, 0, 255, 255, 255 ];
PrinceJS.Enemy.IMPAIRBLOCK_PROBABILITY = [ 0, 61, 61, 100, 100, 145, 100, 250, 0, 145, 255, 175 ];
PrinceJS.Enemy.ADVANCE_PROBABILITY = [ 255, 200, 200, 200, 255, 255, 200, 0, 0, 255, 100, 100 ];
PrinceJS.Enemy.REFRAC_TIMER = [ 16, 16, 16, 16, 8, 8, 8, 8, 0, 8, 0, 0 ];
PrinceJS.Enemy.EXTRA_STRENGTH = [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ];
PrinceJS.Enemy.STRENGTH = [ 4, 3, 3, 3, 3, 4, 5, 4, 4, 5, 5, 5, 4, 6, 0, 0 ];

PrinceJS.Enemy.prototype = Object.create(PrinceJS.Fighter.prototype);
PrinceJS.Enemy.prototype.constructor = PrinceJS.Enemy;

PrinceJS.Enemy.prototype.updateBehaviour = function() {
    
    
    if ( (this.opponent == null) || !this.alive ) return;
    if ( !this.opponent.alive ) return;
    
    console.log('----------- NEXT FIGHT TURN ------------');
    
    if (this.refracTimer > 0) this.refracTimer--;
    if (this.blockTimer > 0) this.blockTimer--;
    if (this.strikeTimer > 0) this.strikeTimer--;
    
    if ( this.action == 'stabbed' || this.action == 'stabkill' || this.action == 'dropdead') return;
    
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
    
};

PrinceJS.Enemy.prototype.enemyAdvance = function() {
    
    var tileF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
    var tile2F = this.level.getTileAt(this.charBlockX + (this.charFace * 2), this.charBlockY, this.room);
    
    if (tileF.isWalkable() || tile2F.isWalkable() ) {
        
        this.advance();
        
    } else {
     
        this.retreat();
        
    }
    
};

PrinceJS.Enemy.prototype.oppTooFar = function(distance) {
  
    if (this.refracTimer != 0) return;
    if (this.opponent.action == 'running') {

        if ( distance < 40 ) this.strike();

    } else if (this.opponent.action == 'runjump') {

        if (distance < 50 ) this.strike();

    } else this.enemyAdvance();
    
};

PrinceJS.Enemy.prototype.oppTooClose = function(distance) {
  
    if ( this.charFace == this.opponent.charFace ) {
                        
            this.retreat();

    } else {

            this.advance();

    }
    
};

PrinceJS.Enemy.prototype.oppInRange = function(distance) {
  
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
    
};

PrinceJS.Enemy.prototype.oppInRangeArmed = function(distance) {
  
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

};

PrinceJS.Enemy.prototype.tryAdvance = function() {

    if ( (this.charSkill == 0) || ( this.strikeTimer == 0 ) ) {
        
        if ( this.advanceProbability > this.game.rnd.between(0,254) ) this.advance();
        
    }
    
};

PrinceJS.Enemy.prototype.tryBlock = function() {

    if ( this.opponent.frameID(152,153) || this.opponent.frameID(162) || this.opponent.frameID(2,3) || this.opponent.frameID(12) ) {
        
        if ( this.blockTimer != 0 ) {
            
            if ( this.impairblockProbability > this.game.rnd.between(0,254) ) this.block();
            
        } else{
            
            if ( this.blockProbability > this.game.rnd.between(0,254) ) this.block();
            
        }
        
    }
    
};

PrinceJS.Enemy.prototype.tryStrike = function() {

    if ( this.opponent.frameID(169) || this.opponent.frameID(151) || this.opponent.frameID(19) || this.opponent.frameID(1) ) return;
    if ( this.frameID(150) ) {
        
        if ( this.restrikeProbability > this.game.rnd.between(0,254) ) this.strike();
        
    } else {
        
        if ( this.strikeProbability > this.game.rnd.between(0,254) ) this.strike();
            
    }
    
};

PrinceJS.Enemy.prototype.resetRefracTimer = function() {
  
    this.refracTimer = PrinceJS.Enemy.REFRAC_TIMER[this.charSkill];
    
};

PrinceJS.Enemy.prototype.resetBlockTimer = function() {
  
    this.blockTimer = 4;
    
};

PrinceJS.Enemy.prototype.resetStrikeTimer = function() {
  
    this.strikeTimer = 15;
    
};







