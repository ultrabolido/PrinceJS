PrinceJS.Tile = {};

PrinceJS.Tile.Base = function (game, element, modifier, type) {
    
    this.game = game;
    
    this.element = element;
    this.modifier = modifier;
    
    this.type = type;
    
    this.key = (type == PrinceJS.Level.TYPE_DUNGEON) ? 'dungeon' : 'palace';
    
    this.back  = this.game.make.sprite(0, 0, this.key, this.key + '_' + element);
    this.front = this.game.make.sprite(0, 0, this.key, this.key + '_' + element + '_fg');
    
    this.room;
    this.roomX;
    this.roomY;
    
    this.frame = null;
    
};

PrinceJS.Tile.Base.prototype = {
    
    toggleMask: function() {
     
        if (this.frame != null) {
            
            this.front.frameName = this.frame;
            this.front.crop(null);
            this.frame = null;
            
        } else {
            
            this.frame = this.front.frameName;
            this.front.frameName = this.back.frameName;
            this.front.crop(new Phaser.Rectangle(0,0,33,this.front.height));
            
        }
        
    },
    
    isWalkable: function() {
     
        return (this.element != PrinceJS.Level.TILE_WALL) && (this.element != PrinceJS.Level.TILE_SPACE) && 
               (this.element != PrinceJS.Level.TILE_TOP_BIG_PILLAR) && (this.element != PrinceJS.Level.TILE_TAPESTRY_TOP) && 
               (this.element != PrinceJS.Level.TILE_LATTICE_SUPPORT) && (this.element != PrinceJS.Level.TILE_SMALL_LATTICE) && 
               (this.element != PrinceJS.Level.TILE_LATTICE_LEFT) && (this.element != PrinceJS.Level.TILE_LATTICE_RIGHT);
        
    },
    
    isSpace: function() {
      
        return (this.element == PrinceJS.Level.TILE_SPACE) || (this.element == PrinceJS.Level.TILE_TOP_BIG_PILLAR) ||
               (this.element == PrinceJS.Level.TILE_TAPESTRY_TOP) || (this.element == PrinceJS.Level.TILE_LATTICE_SUPPORT) ||
               (this.element == PrinceJS.Level.TILE_SMALL_LATTICE) || (this.element == PrinceJS.Level.TILE_LATTICE_LEFT) ||
               (this.element == PrinceJS.Level.TILE_LATTICE_RIGHT);
        
    },
    
    isBarrier: function (element) {
     
        return (this.element == PrinceJS.Level.TILE_WALL) || (this.element == PrinceJS.Level.TILE_GATE) || (this.element == PrinceJS.Level.TILE_TAPESTRY) || (this.element == PrinceJS.Level.TILE_TAPESTRY_TOP);
                
    },
    
    isExitDoor: function() {
      
        return (this.element == PrinceJS.Level.TILE_EXIT_LEFT) || (this.element == PrinceJS.Level.TILE_EXIT_RIGHT);
        
    },
    
    destroy: function() {
        
        this.back.destroy();
        this.front.destroy();
        
    },
    
    getBounds: function() {
  
        var bounds = new Phaser.Rectangle(0,0,0,0);

        bounds.height = 63;
        bounds.width = 4;
        bounds.x = this.roomX * 32 + 40;
        bounds.y = this.roomY * 63;

        return bounds;
    
    },
    
    intersects: function(bounds) {
  
        return this.getBounds().intersects(bounds);
    
    }

};

PrinceJS.Tile.Base.prototype.constructor = PrinceJS.Tile.Base;

Object.defineProperty(PrinceJS.Tile.Base.prototype, "x", {

    get: function () {

        return this.back.x;

    },

    set: function (value) {

        this.back.x = value;
        this.front.x = value;

    }

});

Object.defineProperty(PrinceJS.Tile.Base.prototype, "y", {

    get: function () {

        return this.back.y;

    },

    set: function (value) {

        this.back.y = value;
        this.front.y = value;

    }

});