PrinceJS.Kid = function (game, level, location, direction, room) {

    PrinceJS.Fighter.call(this, game, level, location, direction, room, 'kid');
    
    this.fallingBlocks = 0;
    
    this.onChangeRoom = new Phaser.Signal();
    this.onNextLevel = new Phaser.Signal();
    this.onRecoverLive = new Phaser.Signal();
    this.onAddLive = new Phaser.Signal();
    
    this.pickupSword = false;
    this.pickupPotion = false;
    
    this.allowCrawl = true;
    this.inJumpUP = false;
    this.charRepeat = false;
    this.recoverCrop = false;
    
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    this.ZKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.AKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.SKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    
    this.registerCommand(0xFD,this.CMD_UP);
    this.registerCommand(0xFC,this.CMD_DOWN);
    this.registerCommand(0xF8,this.CMD_SETFALL);
    this.registerCommand(0xF7,this.CMD_IFWTLESS);
    this.registerCommand(0xF5,this.CMD_JARU);
    this.registerCommand(0xF4,this.CMD_JARD);
    this.registerCommand(0xF3,this.CMD_EFFECT);
    this.registerCommand(0xF1,this.CMD_NEXTLEVEL);
    
    this.maxHealth = 3;
    
    this.haveSword = true;
    this.flee = false;
    
    this.allowAdvance = true;
    this.allowRetreat = true;
    this.allowBlock = true;
    this.allowStrike = true;
    
    //this.onChangeRoom.add(this.followOpponent,this);

};

PrinceJS.Kid.prototype = Object.create(PrinceJS.Fighter.prototype);
PrinceJS.Kid.prototype.constructor = PrinceJS.Kid;

PrinceJS.Kid.prototype.CMD_UP = function(data) {
    
    if (this.charBlockY == 0) {
            
        this.charY += 189;
        this.baseY -= 189;
        this.charBlockY = 2;
        this.room = this.level.rooms[this.room].links.up;
        this.onChangeRoom.dispatch(this.room);

    }
    
};

PrinceJS.Kid.prototype.CMD_DOWN = function(data) {
    
    if (this.charBlockY > 2) {
            
        this.charY -= 189;
        this.baseY += 189;
        this.charBlockY = 0;
        this.room = this.level.rooms[this.room].links.down;
        this.onChangeRoom.dispatch(this.room);

    } 
    
};

PrinceJS.Kid.prototype.CMD_SETFALL = function(data) {
    
    this.charXVel = data.p1 * this.charFace;
    this.charYVel = data.p2;
    
};

PrinceJS.Kid.prototype.CMD_IFWTLESS = function(data) {
    
};

PrinceJS.Kid.prototype.CMD_EFFECT = function(data) {
    
};

PrinceJS.Kid.prototype.CMD_JARU = function(data) {
    
    this.level.shakeFloor(this.charBlockY - 1,this.room);
    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY - 1,this.room);
    if (tile.element == PrinceJS.Level.TILE_LOOSE_BOARD) tile.shake(true);
    
};

PrinceJS.Kid.prototype.CMD_JARD = function(data) {
    
    this.level.shakeFloor(this.charBlockY,this.room);
    
};

PrinceJS.Kid.prototype.CMD_NEXTLEVEL = function(data) {
    
    console.log('NEXT LEVEL!!!');
    this.onNextLevel.dispatch();
    
};

/*PrinceJS.Kid.prototype.followOponent = function() {
    
    if (this.opponent != null) {
        
        this.opponent.following = true;
        
    }
    
};*/

PrinceJS.Kid.prototype.recoverLive = function() {
    
    if (this.health < this.maxHealth) {
        
        this.health++;
        this.onRecoverLive.dispatch();
        
    }
    
};


PrinceJS.Kid.prototype.addLive = function() {
    
    this.maxHealth++;
    this.onAddLive.dispatch();
    
};


PrinceJS.Kid.prototype.updateActor = function() {
    
    this.updateBehaviour();
    this.processCommand();
    this.updateAcceleration();
    this.updateVelocity();
    this.checkFight();
    this.checkSpikes();
    this.checkChoppers();
    this.checkBarrier();
    this.checkFloor();
    this.checkRoomChange();
    this.updateCharPosition();
    this.updateSwordPosition();
    this.maskAndCrop();
    
};

PrinceJS.Kid.prototype.drinkPotion = function() {
    
    this.action = 'drinkpotion';
    this.pickupPotion = false;
    this.allowCrawl = true;
    this.level.removeObject(this.charBlockX + this.charFace,this.charBlockY,this.room);
    
};

PrinceJS.Kid.prototype.gotSword = function() {
    
    this.action = 'pickupsword';
    this.pickupSword = false;
    this.allowCrawl = true;
    this.level.removeObject(this.charBlockX + this.charFace,this.charBlockY,this.room);
    this.haveSword = true;
    
};

PrinceJS.Kid.prototype.updateBehaviour = function() {
    
    if ( !this.keyL() && this.faceL() ) this.allowCrawl = this.allowAdvance = true;
    if ( !this.keyR() && this.faceR() ) this.allowCrawl = this.allowAdvance = true;
    if ( !this.keyL() && this.faceR() ) this.allowRetreat = true;
    if ( !this.keyR() && this.faceL() ) this.allowRetreat = true;
    if ( !this.keyU() ) this.allowBlock = true;
    if ( !this.keyS() ) this.allowStrike = true;
    
    switch (this.action) {
    
            case 'stand':
                if ( !this.flee && ( this.opponent != null ) ) return this.tryEngarde(); 
                if ( this.flee && this.keyS() ) return this.tryEngarde();
                if ( this.keyL() && this.faceR() ) return this.turn();
                if ( this.keyR() && this.faceL() ) return this.turn();
                if ( this.keyL() && this.keyU() && this.faceL() ) return this.standjump();
                if ( this.keyR() && this.keyU() && this.faceR() ) return this.standjump();
                if ( this.keyL() && this.keyS() && this.faceL() ) return this.step();
                if ( this.keyR() && this.keyS() && this.faceR() ) return this.step();
                if ( this.keyL() && this.faceL() ) return this.startrun();
                if ( this.keyR() && this.faceR() ) return this.startrun();
                if ( this.keyU() ) return this.jump();
                if ( this.keyD() ) return this.stoop();
                if ( this.keyS() ) return this.tryPickup();
                if ( this.ZKey.isDown) return this.engarde();
                break;
            
            case 'startrun':
                if ( this.keyU() ) return this.standjump();
                break;
            
            case 'running':
                if ( this.keyL() && this.faceR() ) return this.runturn();
                if ( this.keyR() && this.faceL() ) return this.runturn();
                if ( !this.keyL() && this.faceL() ) return this.runstop();
                if ( !this.keyR() && this.faceR() ) return this.runstop();
                if ( this.keyU() ) return this.runjump();
                if ( this.keyD() ) return this.rdiveroll();
                break;
            
            case 'turn':
                if ( this.keyL() && this.faceL() && this.frameID(48) ) return this.turnrun();
                if ( this.keyR() && this.faceR() && this.frameID(48) ) return this.turnrun();
                break;
            
            case 'stoop':
                if ( this.pickupSword && this.frameID(109) ) return this.gotSword();
                if ( this.pickupPotion && this.frameID(109) ) return this.drinkPotion();
                if ( !this.keyD() && this.frameID(109) ) return this.standup();
                if ( this.keyL() && this.faceL() && this.allowCrawl ) return this.crawl();
                if ( this.keyR() && this.faceR() && this.allowCrawl ) return this.crawl();
                break;
            
            case 'hang':
                var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
                if ( tile.element == PrinceJS.Level.TILE_WALL ) { this.action = 'hangstraight'; }
            case 'hangstraight':
                if ( this.keyU() ) return this.climbup();
                if ( !this.keyS() ) return this.startFall();
                break;
            
            case 'freefall':
                if ( this.keyS() ) return this.tryGrabEdge();
                break;
            
            case 'engarde':
                if ( this.keyL() && this.faceL() && this.allowAdvance ) return this.advance();
                if ( this.keyR() && this.faceR() && this.allowAdvance ) return this.advance();
                if ( this.keyL() && this.faceR() && this.allowRetreat ) return this.retreat();
                if ( this.keyR() && this.faceL() && this.allowRetreat ) return this.retreat();
                if ( this.keyU() && this.allowBlock ) return this.block();
                if ( this.keyS() && this.allowStrike ) return this.strike();
                if ( this.keyD() ) return this.fastsheathe();
            
                if ( this.ZKey.isDown ) return this.stabbed();
                if ( this.AKey.isDown ) return this.recoverLive();
                if ( this.SKey.isDown ) return this.addLive();
                break;
            
            case 'advance':
            case 'blockedstrike':
                if ( this.keyU() && this.allowBlock ) return this.block();
                break;
            
            case 'retreat':
            case 'strike':
            case 'block':
                if ( this.keyS() && this.allowStrike ) return this.strike();
                break;
            
    }
    
};

PrinceJS.Kid.prototype.checkSpikes = function() {
    
    if ( this.distanceToEdge() < 5 )
    {
        this.trySpikes(this.charBlockX + this.charFace, this.charBlockY);
    }
    this.trySpikes(this.charBlockX, this.charBlockY);
};

PrinceJS.Kid.prototype.checkChoppers = function() {
    
    
    this.level.activateChopper(-1,this.charBlockY,this.room);
    
    
};

PrinceJS.Kid.prototype.tryEngarde = function() {
 
    console.log('try_engarde!!');
    if (this.opponent.alive && ( this.opponentDistance() < 90 ) ) {
        
        this.engarde();
        this.flee = false;
        
    }
    
};

PrinceJS.Kid.prototype.trySpikes = function(x,y) {
    
    while (y < 3)
    {
        var tile = this.level.getTileAt(x, y,this.room);
        if (tile.element == PrinceJS.Level.TILE_SPIKES) { tile.raise(); }
        if (tile.element != PrinceJS.Level.TILE_SPACE) { return; }
        //if (this.action == 'standjump' ) console.log((this.charBlockX + this.charFace) + ' ' + y);
        y++;

    }

};

PrinceJS.Kid.prototype.tryGrabEdge = function() {
    
    var tileT = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
    var tileTF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY - 1, this.room);
    var tileTR = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY - 1, this.room);
  
    if ( tileTF.isWalkable() && ( tileT.element == PrinceJS.Level.TILE_SPACE) ) {
     
        return this.grab(this.charBlockX);
        
    } else {
    
        if ( tileT.isWalkable() && ( tileTR.element == PrinceJS.Level.TILE_SPACE) ) {
     
            return this.grab(this.charBlockX - 1);
            
        }
        
    }
    
};

PrinceJS.Kid.prototype.grab = function(x) {
    
    if (this.faceL()) {
        this.charX = PrinceJS.Utils.convertBlockXtoX(x) - 2;
    } else {
        this.charX = PrinceJS.Utils.convertBlockXtoX(x + 1) + 1;  
    }
    this.charY = PrinceJS.Utils.convertBlockYtoY(this.charBlockY);
    this.charXVel = 0;
    this.charYVel = 0;
    this.fallingBlocks = 0;
    this.updateBlockXY();
    this.action = 'hang';
    this.processCommand();
    
};

PrinceJS.Kid.prototype.nearBarrier = function() {
  
    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
    var tileF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
    
    return ( ( tileF.element == PrinceJS.Level.TILE_WALL ) || 
           ( ( tileF.element == PrinceJS.Level.TILE_GATE ) && this.faceL() && !tileF.canCross(this.height) ) ||
           ( ( tile.element == PrinceJS.Level.TILE_GATE ) && this.faceR() && !tile.canCross(this.height) ) ||
           ( ( tile.element == PrinceJS.Level.TILE_TAPESTRY ) && this.faceR() ) ||
           ( ( tileF.element == PrinceJS.Level.TILE_TAPESTRY ) && this.faceL() ) ||
           ( ( tileF.element == PrinceJS.Level.TILE_TAPESTRY_TOP ) && this.faceL() ) );
    
};

PrinceJS.Kid.prototype.checkBarrier = function() {
    
    if ( this.action == 'jumphanglong') return;
    if ( this.action == 'climbup' ) return;
    if ( this.action == 'climbdown' ) return;
    if ( this.action == 'climbfail' ) return;
    //if ( this.action == 'stand' ) return;
    if ( this.action == 'turn' ) return;
    if ( this.action.substring(0,4) == 'step' ) return;
    if ( this.action.substring(0,4) == 'hang' ) return;

    var tileT = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
    
    if ( ( this.action == 'freefall' ) && ( tileT.element == PrinceJS.Level.TILE_WALL ) ) {
        
        if (this.faceL())
        {

            this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX + 1) - 1;


        } else {

            this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX);

        }
        this.updateBlockXY();
        this.bump();
        return;
    }
    
    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
    
    if ( this.faceR() && tile.isBarrier()  ) {
     
        if ( tile.intersects(this.getCharBounds()) ) {
            
            console.log(this.action);
            this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 10;
            this.updateBlockXY();
            this.bump();
            
        }
        
    } else {
    
        var blockX = PrinceJS.Utils.convertXtoBlockX( this.charX + this.charFdx * this.charFace );
        var tileNext = this.level.getTileAt(blockX,this.charBlockY,this.room);

        if ( tileNext.isBarrier() )
        {

            switch (tileNext.element) {

                case PrinceJS.Level.TILE_WALL:
                    
                    if ( this.action == 'stand' ) return;
                    if (this.faceL())
                    {
            
                        this.charX = PrinceJS.Utils.convertBlockXtoX(blockX + 1) - 1;
                    
                        
                    } else {

                        this.charX = PrinceJS.Utils.convertBlockXtoX(blockX);
                        
                    }
                    this.updateBlockXY();
                    this.bump();
                    break;

                case PrinceJS.Level.TILE_GATE:
                    
                    if (this.faceL() && tileNext.intersects(this.getCharBounds())) 
                    {
                        
                        if ( ( this.action == 'stand' ) && (tile.element == PrinceJS.Level.TILE_GATE ) ) {
                            
                            this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 3;
                            this.updateBlockXY();
                            
                        } else {
                            
                            this.charX = PrinceJS.Utils.convertBlockXtoX(blockX + 1) - 1;
                            this.updateBlockXY();
                            this.bump();
                            
                        }
                        
                    }
                    break;
                    
                case PrinceJS.Level.TILE_TAPESTRY:
                case PrinceJS.Level.TILE_TAPESTRY_TOP:
                
                    if ( this.action == 'stand' ) return;
                    if (this.faceL())
                    {
            
                        this.charX = PrinceJS.Utils.convertBlockXtoX(blockX + 1) - 1;
                        this.updateBlockXY();
                        this.bump();
                        
                    }
                    
                    break;
                    

            }

        }
        
    }

};

PrinceJS.Kid.prototype.getCharBounds = function() {

    var f = this.game.cache.getFrameData('kid').getFrameByName('kid-' + this.charFrame);
    
    var x = PrinceJS.Utils.convertX(this.charX + this.charFdx * this.charFace);
    var y = this.charY + this.charFdy - f.height;
    
    if (this.faceR()) {
        x -= f.width;
    }
    
    if ((this.charFood && this.faceL()) || (!this.charFood && this.faceR())) {
        
        x += 1;
        
    }
    
    return new Phaser.Rectangle(x,y,f.width,f.height);
    
};

PrinceJS.Kid.prototype.bump = function() {
    
    console.log('bumping...');
    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
    
    if ( tile.isSpace() ) {
        
        this.charX -= 2 * this.charFace;
        this.bumpFall();
        
    } else {
        
        var y = this.distanceToFloor();
        console.log('to floor:' + y + ' ' + this.charBlockY + ' ' + this.charY + ' ' + this.charFdy);
        if ( y >= 5 )
        {
            this.bumpFall();
            console.log('distance: ' + y);
            
        } else {
            
            if ( this.frameID(24,25) || this.frameID(40,42) || this.frameID(102,106) ) {
                
                this.charX -= 5 * this.charFace;
                this.fallingBlocks = 0;
                this.land();
                
            } else {
                
                this.action = 'bump';
                this.processCommand();
                
            }
        }
    }
    
};

PrinceJS.Kid.prototype.bumpFall = function() {
  
    if ( this.actionCode == 4) {
        this.charX -= this.charFace;
        this.charXVel = 0;
    } else {
        this.charX -= 2 * this.charFace;
        this.action = 'bumpfall';
        this.processCommand();
    }
    
};

PrinceJS.Kid.prototype.fastsheathe = function() {
  
    this.flee = true;
    this.action = 'fastsheathe';
    this.swordDrawn = false;
    this.opponent.refracTimer = 9;
    
};

PrinceJS.Kid.prototype.block = function() {
  
    if ( this.frameID(158) || this.frameID(165) ) {
        
        if (this.opponent.frameID(18)) return;
        this.action = 'block';
        if (this.opponent.frameID(3)) this.processCommand();
        
    } else {
        
        if (!this.frameID(167)) return;
        this.action = 'striketoblock';
        
    }
    
    this.allowBlock = false;
    
};

PrinceJS.Kid.prototype.checkFloor = function() {
    
    if (this.action == 'climbdown') return;
    if (this.action == 'climbup') return;
    //if (this.action == 'hangfall') return;
    
    switch (this.actionCode) {
            
        case 0:    
        case 1: // running
        case 7:
        case 5:

            if (this.charFcheck) {
                
                var tile = this.level.getTileAt(this.charBlockX, this.charBlockY,this.room);
                
                switch (tile.element) {

                    case PrinceJS.Level.TILE_SPACE:
                        if ( this.actionCode == 5 ) return;
                        this.startFall();
                        break;

                    case PrinceJS.Level.TILE_LOOSE_BOARD:
                        tile.shake(true);
                        break;

                    case PrinceJS.Level.TILE_RAISE_BUTTON:
                    case PrinceJS.Level.TILE_DROP_BUTTON:
                        tile.push();
                        break;

                    case PrinceJS.Level.TILE_SPIKES:
                        tile.raise();
                        break;

                }

            }
            break;
                        
        case 4: // freefall
        //case 3:
            console.log('charY: ' + this.charY + ' fdy: ' + this.charFdy);
            if ( this.charY > PrinceJS.Utils.convertBlockYtoY(this.charBlockY) ) {
                
                var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
    
                if ( tile.isWalkable() ) {
                    
                    this.land();
                    
                } else {
                    
                    this.fallingBlocks++;
                    console.log(this.fallingBlocks);
                    
                }

            }
            break;
                   
    }

};

PrinceJS.Kid.prototype.checkRoomChange = function() {
    
    if ( !this.inCamera &&  this.faceR() ) {
        
        var room = this.room;
        if (this.charBlockX == 9) room = this.level.rooms[this.room].links.right;
        this.onChangeRoom.dispatch(room);
        
    }
    
    var footX = this.charX + ( this.charFdx * this.charFace );
    
    if ( (PrinceJS.Utils.convertXtoBlockX(footX) == 8) && this.faceL() ) {
        
        this.onChangeRoom.dispatch(this.room);
    
    }
    
    if (this.charY > 192) {
        //this.game.camera.y += 189*2;
        this.charY -= 192;
        this.baseY += 189;
        this.room = this.level.rooms[this.room].links.down;
        this.onChangeRoom.dispatch(this.room);
    }
    
};


PrinceJS.Kid.prototype.maskAndCrop = function() {
     
    // mask climbing
    if ( this.faceR() && (this.charFrame > 134) && (this.charFrame < 145)) { this.frameName += 'r'; }
    
    // mask hanging
    if ( this.faceR() && (this.action.substring(0,4) == 'hang') ) { 
        
        this.level.maskTile(this.charBlockX, this.charBlockY - 1, this.room); 
    
    }
    if ( this.faceR() && (this.action == 'climbdown') && this.frameID(91)) { 
        
        this.level.maskTile(this.charBlockX, this.charBlockY - 1, this.room); 
    
    }
        
    // unmask falling / hangdroping
    if ( this.frameID(15) ) { this.level.unMaskTile(); }
    
    // crop in jumpup
    if ( this.recoverCrop ) {
        
        this.crop( null ); 
        this.recoverCrop = false;
        
    }
    
    if ( this.inJumpUP && this.frameID(79) ) { 
        
        this.crop( new Phaser.Rectangle(0, 7, - this.width * this.charFace, this.height) ); 
    
    }    
    
    if ( this.inJumpUP && this.frameID(81) ) {
        
        this.crop( null ); 
        this.crop( new Phaser.Rectangle(0, 3, - this.width * this.charFace, this.height) ); 
        this.inJumpUP = false; 
        this.recoverCrop = true; 
    
    }
      
};

PrinceJS.Kid.prototype.tryPickup = function() {

    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
    var tileF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
    
    this.pickupSword = (tile.element == PrinceJS.Level.TILE_SWORD) || (tileF.element == PrinceJS.Level.TILE_SWORD);
    this.pickupPotion = (tile.element == PrinceJS.Level.TILE_POTION) || (tileF.element == PrinceJS.Level.TILE_POTION);
    
    if ( this.pickupPotion || this.pickupSword ) { 
        
        if (this.faceR())
        {
            if ((tileF.element == PrinceJS.Level.TILE_POTION) || (tileF.element == PrinceJS.Level.TILE_SWORD))  { this.charBlockX++;}
            this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + ( 1 * this.pickupPotion );
        }
        if (this.faceL())
        {
            if ((tile.element == PrinceJS.Level.TILE_POTION) || (tile.element == PrinceJS.Level.TILE_SWORD)) { this.charBlockX++;}
            this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) - 3;
        }
        this.action = 'stoop'; 
        this.allowCrawl = false;
    
    }
    
};

PrinceJS.Kid.prototype.keyL = function() {
    
    return this.cursors.left.isDown;
    
};

PrinceJS.Kid.prototype.keyR = function() {
    
    return this.cursors.right.isDown;
    
};

PrinceJS.Kid.prototype.keyU = function() {
    
    return this.cursors.up.isDown;
    
};

PrinceJS.Kid.prototype.keyD = function() {
    
    return this.cursors.down.isDown;
    
};

PrinceJS.Kid.prototype.keyS = function() {
    
    return this.shiftKey.isDown;
    
};

PrinceJS.Kid.prototype.turn = function() {
    
    if ( !this.haveSword || this.canSeeOpponent() < 1 || this.opponentDistance() > 0 ) {
        
        this.action = 'turn';
        
    } else {
        
        this.action = 'turndraw';
        this.flee = false;
        
    }
    
};

PrinceJS.Kid.prototype.standjump = function() {
    
    this.action = 'standjump';
    
};

PrinceJS.Kid.prototype.startrun = function() {
    
    if ( this.nearBarrier() ) return this.step();
    this.action = 'startrun';
    
};

PrinceJS.Kid.prototype.runturn = function() {
    
    this.action = 'runturn';
    
};

PrinceJS.Kid.prototype.turnrun = function() {
    
    if ( this.nearBarrier() ) return this.step();
    this.action = 'turnrun';
    
};

PrinceJS.Kid.prototype.runjump = function() {
    
    this.action = 'runjump';
    
};

PrinceJS.Kid.prototype.rdiveroll = function() {
    
    this.action = 'rdiveroll';
    this.allowCrawl = false;
    
};

PrinceJS.Kid.prototype.standup = function() {
    
    this.action = 'standup';
    this.allowCrawl = true;
    
};

PrinceJS.Kid.prototype.land = function() {
    
    console.log('land: ' + this.fallingBlocks);
    this.charY = PrinceJS.Utils.convertBlockYtoY(this.charBlockY);
    this.charXVel = 0;
    this.charYVel = 0;
    
    switch (this.fallingBlocks) {
            
        case 0: case 1: this.action = 'softland'; break;
        case 2: this.action = 'medland'; break;
        default: this.action = 'medland';
    
    }
    this.processCommand();
    
};

PrinceJS.Kid.prototype.crawl = function() {
    
    this.action = 'crawl';
    this.allowCrawl = false;
    
};

PrinceJS.Kid.prototype.runstop = function() {
    
    if ( this.frameID(7) || this.frameID(11) ) this.action = 'runstop';
    
};

PrinceJS.Kid.prototype.distanceToEdge = function() {

    if (this.faceR()) {
        return PrinceJS.Utils.convertBlockXtoX(this.charBlockX + 1) - 1 - this.charX - this.charFdx + this.charFfoot;
    } else {
        return this.charX + this.charFdx + this.charFfoot - PrinceJS.Utils.convertBlockXtoX(this.charBlockX);
    }

};

PrinceJS.Kid.prototype.distanceToFloor = function() {

    return PrinceJS.Utils.convertBlockYtoY(this.charBlockY) - this.charY - this.charFdy;

};

PrinceJS.Kid.prototype.step = function() {
    
    var px = 11;
    
    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
    var tileF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
    
    if ( this.nearBarrier() || ( tileF.element == PrinceJS.Level.TILE_SPACE ) || 
       ( tileF.element == PrinceJS.Level.TILE_POTION ) || ( tileF.element == PrinceJS.Level.TILE_LOOSE_BOARD ) ||
       ( tileF.element == PrinceJS.Level.TILE_SWORD ) )
    {
    
        px = this.distanceToEdge();
        console.log('dtoedge' + px);
        
        if ( ( (tile.element == PrinceJS.Level.TILE_GATE) || (tile.element == PrinceJS.Level.TILE_TAPESTRY) ) && this.faceR() ) {
            
            px -= 6;
            if (px <= 0) { this.action = 'bump'; return; }
            
        } else {
        
            if ( tileF.isBarrier() ) {
                
                px -= 2;
                if (px <= 0) { this.action = 'bump'; return; }
            
            } else {

                if ((px == 0) && (( tileF.element == PrinceJS.Level.TILE_LOOSE_BOARD) || (tileF.element == PrinceJS.Level.TILE_SPACE))) {

                    if (this.charRepeat) {
                        this.charRepeat = false;
                        px = 11;
                    } else {
                        this.charRepeat = true;
                        this.action = 'testfoot';
                        return;
                    }
                }
            }
            
        }
        
    }
    this.action = 'step' + px;
        
};

PrinceJS.Kid.prototype.startFall = function() {
    
    this.fallingBlocks = 0;
    
    if (this.action.substring(0,4) == 'hang') {
        
        var blockX = this.charBlockX;
        if ( this.action == 'hangstraight' ) blockX -= this.charFace;

        var tile = this.level.getTileAt(blockX,this.charBlockY,this.room);

        if (tile.element != PrinceJS.Level.TILE_SPACE) {

            tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
            
            if ( tile.element == PrinceJS.Level.TILE_WALL ) {

                this.charX -= 7 * this.charFace;

            }
            this.action = 'hangdrop';

        } else {

            this.action = 'hangfall';
            this.processCommand();

        }
        
    } else {
     
        var act = 'stepfall';
        
        if ( this.frameID(44) ) { act = 'rjumpfall'; }
        if ( this.frameID(26) ) { act = 'jumpfall'; }
        if ( this.frameID(13) ) { act = 'stepfall2'; }

        if ( this.faceL() ) { 
            this.level.maskTile(this.charBlockX + 1,this.charBlockY,this.room); 
        }
        this.action = act;
        this.processCommand();   
        
    }
    
};

PrinceJS.Kid.prototype.stoop = function() {
    
    var tileR = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY, this.room);
    
    if (tileR.element == PrinceJS.Level.TILE_SPACE) {
        
        if (this.charFace == -1) {
            
            if ( ( this.charX - PrinceJS.Utils.convertBlockXtoX(this.charBlockX) ) > 4 ) return this.climbdown();

        } else {

            if ( ( this.charX - PrinceJS.Utils.convertBlockXtoX(this.charBlockX) ) < 9 ) return this.climbdown();

        }
        
    } 
    
    this.action = 'stoop';
    
};

PrinceJS.Kid.prototype.climbdown = function() {
    
    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
    
    if ( this.faceL() && (tile.element == PrinceJS.Level.TILE_GATE) && !tile.canCross(10) ) {
        
        this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 3;
        
    } else {
        
        if (this.faceL())
        {
            this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 6;

        } else {

            this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 7;

        }
        this.action = 'climbdown';
        
    }
    
};

PrinceJS.Kid.prototype.climbup = function() {
    
    var tileT = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
    
    if ( this.faceL() && (tileT.element == PrinceJS.Level.TILE_GATE) && !tileT.canCross(10) ) {
        
        this.action = 'climbfail';
        
    } else {
        
        this.action = 'climbup';
        if ( this.faceR() ) {

            this.level.unMaskTile();
        }
        
    }
    
};

PrinceJS.Kid.prototype.jumpup = function() {
    
    this.action = 'jumpup';
    this.inJumpUP = true;
    
};

PrinceJS.Kid.prototype.highjump = function() {
    
    var tileTR = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY - 1, this.room);
    
    this.action = 'highjump';
    if ( this.faceL() && tileTR.isWalkable() ) { 
        
        this.level.maskTile(this.charBlockX + 1,this.charBlockY - 1,this.room);
        
    }
    
};

PrinceJS.Kid.prototype.jumpbackhang = function() {
    
    // patch x
    if (this.charFace == -1)
    {
        
        this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 7;
        
    } else {
        
        this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 6;
        
    }
    this.action = 'jumpbackhang';
    if ( this.faceR() ) { 
        
        this.level.maskTile(this.charBlockX,this.charBlockY - 1,this.room);
        
    }
    
};

PrinceJS.Kid.prototype.jumphanglong = function() {
    
    // patch x
    if (this.charFace == -1)
    {
        this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 1;
        
    } else {
        
        this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 12;
        
    }
    this.action = 'jumphanglong';
    if ( this.faceR() ) { 
        this.level.maskTile(this.charBlockX + 1,this.charBlockY - 1,this.room);
    }
    
};


PrinceJS.Kid.prototype.climbstairs = function () {
  
    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY,this.room);
    
    if (tile.element == PrinceJS.Level.TILE_EXIT_RIGHT) {
        
        this.charBlockX--;
        
    } else {
        
        tile = this.level.getTileAt(this.charBlockX + 1, this.charBlockY,this.room);
        
    }
    
    if (this.faceR()) {
     
        this.charFace *= -1;
        this.scale.x *= -1;
        
    }
    
    this.charX = PrinceJS.Utils.convertBlockXtoX(this.charBlockX) + 3;
    tile.mask();
    this.action = 'climbstairs';
    
};

PrinceJS.Kid.prototype.jump = function () {

    var tile = this.level.getTileAt(this.charBlockX, this.charBlockY, this.room);
    var tileF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY, this.room);
    var tileT = this.level.getTileAt(this.charBlockX, this.charBlockY - 1, this.room);
    var tileTF = this.level.getTileAt(this.charBlockX + this.charFace, this.charBlockY - 1, this.room);
    var tileTR = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY - 1, this.room);
    var tileR = this.level.getTileAt(this.charBlockX - this.charFace, this.charBlockY, this.room);
    
    if ( tile.isExitDoor() ) {
        
        if (tile.element == PrinceJS.Level.TILE_EXIT_LEFT) {
         
            tile = this.level.getTileAt(this.charBlockX + 1, this.charBlockY,this.room);
            
        }
     
        if ( tile.open ) return this.climbstairs();
        
    }
    
    if ( tileT.isSpace() && tileTF.isWalkable() )
    {
        return this.jumphanglong();
    }
    
    if ( tileT.isWalkable() && tileTR.isSpace() && tileR.isWalkable() )
    {
        if ( this.faceL() && (( PrinceJS.Utils.convertBlockXtoX(this.charBlockX + 1) - this.charX ) < 11 ))
        {
            this.charBlockX++;
            return this.jumphanglong();
        }
        if ( this.faceR() && (( this.charX - PrinceJS.Utils.convertBlockXtoX(this.charBlockX) ) < 9 ))
        {
            this.charBlockX--;
            return this.jumphanglong();
        }
        return this.jumpup();
    } 
    
    if ( tileT.isWalkable() &&  tileTR.isSpace() )
    {
        if ( this.faceL() && (( PrinceJS.Utils.convertBlockXtoX(this.charBlockX + 1) - this.charX ) < 11 ) )
        {
            return this.jumpbackhang();
        }
        if ( this.faceR() && (( this.charX - PrinceJS.Utils.convertBlockXtoX(this.charBlockX)) < 9 ) )
        {
            return this.jumpbackhang();
        }
        return this.jumpup();
    }
    
    if ( tileT.isSpace() )
    {
       
        return this.highjump();
        
    } 
    
    this.jumpup();
    
};

