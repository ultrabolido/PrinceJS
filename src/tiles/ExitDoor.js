PrinceJS.Tile.ExitDoor = function (game, modifier, type) {
    
    PrinceJS.Tile.Base.call(this, game, PrinceJS.Level.TILE_EXIT_RIGHT, modifier, type);
    
    this.tileChildBack = this.game.make.sprite(10,12,this.key,this.key + '_door');
    this.back.addChild(this.tileChildBack);
    if ( this.type == PrinceJS.Level.TYPE_PALACE ) { this.tileChildBack.x -= 3; }
    
    this.tileChildFront = this.game.make.sprite(0,0,this.key,this.key + '_door_fg');
    this.front.addChild(this.tileChildFront);
    this.tileChildFront.visible = false;
    
    this.step = 0;
    
    this.open = false;
    
};

PrinceJS.Tile.ExitDoor.STATE_OPEN = 0;
PrinceJS.Tile.ExitDoor.STATE_RAISING = 1;
PrinceJS.Tile.ExitDoor.STATE_DROPPING = 2;
PrinceJS.Tile.ExitDoor.STATE_CLOSED = 3;

PrinceJS.Tile.ExitDoor.prototype = Object.create(PrinceJS.Tile.Base.prototype);
PrinceJS.Tile.ExitDoor.prototype.constructor = PrinceJS.Tile.ExitDoor;

PrinceJS.Tile.ExitDoor.prototype.update = function() {
    
    var door = this.tileChildBack;
    
    switch (this.state) {
            
        case PrinceJS.Tile.ExitDoor.STATE_RAISING:
            
            if (door.height == ( 8 + this.type) ) {
                
                this.open = true;
                
            } else {
                
                this.step++;
                door.crop(new Phaser.Rectangle(0, this.step, door.width, door.height));
                
            }
            break;
            
    }
    
};

PrinceJS.Tile.ExitDoor.prototype.raise = function() {
    
    if ( this.state == PrinceJS.Tile.ExitDoor.STATE_CLOSED ) {
        
        this.state = PrinceJS.Tile.ExitDoor.STATE_RAISING;
        
    }
    
};

PrinceJS.Tile.ExitDoor.prototype.mask = function() {
    
    this.tileChildFront.visible = true;
    
};

Object.defineProperty(PrinceJS.Tile.ExitDoor.prototype, 'open', {

    get: function () {

        return (this.state == PrinceJS.Tile.ExitDoor.STATE_OPEN);

    },

    set: function (value) {

        this.state = value ? PrinceJS.Tile.ExitDoor.STATE_OPEN : PrinceJS.Tile.ExitDoor.STATE_CLOSED;
        this.step = 0;

    }

});