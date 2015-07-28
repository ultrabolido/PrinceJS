PrinceJS.Tile.Gate = function (game, modifier, type) {
    
    PrinceJS.Tile.Base.call(this, game, PrinceJS.Level.TILE_GATE, modifier, type);
    
    var y = - modifier * 46;
    
    this.tileChildBack = this.game.make.sprite(0, y, this.key, this.key + '_gate');
    this.back.addChild(this.tileChildBack);
    
    this.tileChildFront = this.game.make.sprite(32, y+16, this.key, this.key + '_gate_fg');
    this.tileChildFront.crop(new Phaser.Rectangle(0, -y, this.tileChildFront.width, this.tileChildFront.height + y));
    this.front.addChild(this.tileChildFront);
    
    this.state = modifier;
    this.step = 0;
    
};

PrinceJS.Tile.Gate.STATE_CLOSED = 0;
PrinceJS.Tile.Gate.STATE_OPEN = 1;
PrinceJS.Tile.Gate.STATE_RAISING = 2;
PrinceJS.Tile.Gate.STATE_DROPPING = 3;
PrinceJS.Tile.Gate.STATE_FAST_DROPPING = 4;
PrinceJS.Tile.Gate.STATE_WAITING = 5;

PrinceJS.Tile.Gate.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.Gate.prototype.constructor = PrinceJS.Tile.Gate;

PrinceJS.Tile.Gate.prototype.update = function() {
    
    var gateBack = this.tileChildBack;
    var gateFront = this.tileChildFront;
    
    switch (this.state)
    {
        case PrinceJS.Tile.Gate.STATE_RAISING:  
            if (gateBack.y == -47) {
                
                this.state = PrinceJS.Tile.Gate.STATE_WAITING;
                this.step = 0;
            
            } else {
            
                gateBack.y -= 1;
                gateFront.crop(new Phaser.Rectangle(0, -gateBack.y, gateFront.width, gateFront.height));
            
            }
            break;

        case PrinceJS.Tile.Gate.STATE_WAITING:
            this.step++;
            if (this.step == 50) {
                
                this.state = PrinceJS.Tile.Gate.STATE_DROPPING;
                this.step = 0;
                
            }
            break;

        case PrinceJS.Tile.Gate.STATE_DROPPING:                         
            if (!this.step) {
                
                gateBack.y += 1;
                gateFront.crop(new Phaser.Rectangle(0, -gateBack.y, gateFront.width, gateFront.height + 1));
                if (gateBack.y >= 0) {
                    
                    gateBack.y = 0;
                    gateFront.crop(null);
                    this.state = PrinceJS.Tile.Gate.STATE_CLOSED;
                    
                }
                this.step++;
            
            } else {
                
                this.step = (this.step + 1) % 4;
                
            }
            break;

        case PrinceJS.Tile.Gate.STATE_FAST_DROPPING:
            gateBack.y += 10;
            gateFront.crop(new Phaser.Rectangle(0, -gateBack.y, gateFront.width, gateFront.height + 10));
            if (gateBack.y >= 0) {
                
                gateBack.y = 0;
                gateFront.crop(null);
                this.state = PrinceJS.Tile.Gate.STATE_CLOSED;
                
            }
            break;
    }
    
};

PrinceJS.Tile.Gate.prototype.raise = function() {
  
    this.step = 0;
    if ( this.state != PrinceJS.Tile.Gate.STATE_WAITING ) {
        
        this.state = PrinceJS.Tile.Gate.STATE_RAISING;
        
    }
    
};

PrinceJS.Tile.Gate.prototype.drop = function() {
    
    if ( this.state != PrinceJS.Tile.Gate.CLOSED ) {
        
        this.state = PrinceJS.Tile.Gate.STATE_FAST_DROPPING;
        
    }
    
};

PrinceJS.Tile.Gate.prototype.getBounds = function() {
  
    var bounds = new Phaser.Rectangle(0,0,0,0);
    
    bounds.height = 63 - 10 + this.tileChildBack.y - 4;
    bounds.width = 4;
    bounds.x = this.roomX * 32 + 40;
    bounds.y = this.roomY * 63;
    
    return bounds;
    
};

PrinceJS.Tile.Gate.prototype.canCross = function(height) {
    
    return (Math.abs(this.tileChildBack.y)  >  height) ;
    
};
