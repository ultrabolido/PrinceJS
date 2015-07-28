PrinceJS.Level = function (game, number, name, type) {
    
    this.game = game;
    
    this.number = number;
    this.name = name;
    
    this.type = type;
    
    this.rooms = [];
    
    this.back = this.game.add.group();
    this.back.z = 10;
        
    this.front = this.game.add.group();
    this.front.z = 30;
    
    this.trobs = [];
    
    this.maskedTile = null;
    
    this.dummyWall = new PrinceJS.Tile.Base(this.game, PrinceJS.Level.TILE_WALL, 0, this.type);
    
    //console.log('Level created!');
    
};

PrinceJS.Level.TYPE_DUNGEON = 0;
PrinceJS.Level.TYPE_PALACE = 1;

PrinceJS.Level.TILE_SPACE = 0;
PrinceJS.Level.TILE_FLOOR = 1;
PrinceJS.Level.TILE_SPIKES = 2;
PrinceJS.Level.TILE_PILLAR = 3;
PrinceJS.Level.TILE_GATE = 4;
PrinceJS.Level.TILE_STUCK_BUTTON = 5;
PrinceJS.Level.TILE_DROP_BUTTON = 6;
PrinceJS.Level.TILE_TAPESTRY = 7;
PrinceJS.Level.TILE_BOTTOM_BIG_PILLAR = 8;
PrinceJS.Level.TILE_TOP_BIG_PILLAR = 9;
PrinceJS.Level.TILE_POTION = 10;
PrinceJS.Level.TILE_LOOSE_BOARD = 11;
PrinceJS.Level.TILE_TAPESTRY_TOP = 12;
PrinceJS.Level.TILE_MIRROR = 13;
PrinceJS.Level.TILE_DEBRIS = 14;
PrinceJS.Level.TILE_RAISE_BUTTON = 15;
PrinceJS.Level.TILE_EXIT_LEFT = 16;
PrinceJS.Level.TILE_EXIT_RIGHT = 17;
PrinceJS.Level.TILE_CHOPPER = 18;
PrinceJS.Level.TILE_TORCH = 19;
PrinceJS.Level.TILE_WALL = 20;
PrinceJS.Level.TILE_SKELETON = 21;
PrinceJS.Level.TILE_SWORD = 22;
PrinceJS.Level.TILE_BALCONY_LEFT = 23;
PrinceJS.Level.TILE_BALCONY_RIGHT = 24;
PrinceJS.Level.TILE_LATTICE_PILLAR = 25;
PrinceJS.Level.TILE_LATTICE_SUPPORT = 26;
PrinceJS.Level.TILE_SMALL_LATTICE = 27;
PrinceJS.Level.TILE_LATTICE_LEFT = 28;
PrinceJS.Level.TILE_LATTICE_RIGHT = 29;
PrinceJS.Level.TILE_TORCH_WITH_DEBRIS = 30;
PrinceJS.Level.TILE_NULL = 31;


PrinceJS.Level.prototype = {
    
    addTile: function(x, y, room, tile) {
     
        //console.log('Adding tile: ' + x + ' ' + y + ' ' + room);
        
        if ( (x >= 0) && ( y >= 0 ) ) {
            
            this.rooms[room].tiles[y*10 + x] = tile;
            tile.roomX = x;
            tile.roomY = y;
            tile.room = room;
        }
        
        // -13? => real image height 79 - block height 63 = -16 for overlapping tiles + 3 for top screen offset
        
        tile.x  = this.rooms[room].x * PrinceJS.ROOM_WIDTH + x * PrinceJS.BLOCK_WIDTH;
        tile.y  = this.rooms[room].y * PrinceJS.ROOM_HEIGHT + y * PrinceJS.BLOCK_HEIGHT - 13;
        
        this.back.add(tile.back);
        this.front.add(tile.front);
        
    },
    
    addTrob: function(trob) {
        
        this.trobs.push( trob );
        
    },
    
    update: function() {
        
        var i = this.trobs.length;

        while (i--)
        {
            
            this.trobs[i].update();
            
        }
        
    },
    
    removeObject: function(x,y,room) {
        
        var tile = this.getTileAt(x,y,room);
        tile.removeObject();
        
        var idx = this.trobs.indexOf(tile);
        this.trobs.splice(idx, 1);
        
    },
    
    getTileAt: function (x, y, room) {
        
        var newRoom = room;
        
        if (x < 0) {
            
            newRoom = this.rooms[room].links.left;
            x += 10;
            
        }
        if (x > 9) {
         
            newRoom = this.rooms[room].links.right;
            x -= 10;
            
        }
        if (y < 0) {
            
            newRoom = this.rooms[room].links.up;
            y += 3;
            
        }
        if (y > 2) {
            
            newRoom = this.rooms[room].links.down;
            y -= 3;
            
        }
        
        if (newRoom == -1) return this.dummyWall;
        
        return this.rooms[newRoom].tiles[x + y * 10];
        
    },
    
    shakeFloor: function (y, room) {   
        
        for (var x=0; x<10; x++)
        {
            
            var tile = this.getTileAt(x,y,room);
            
            if (tile.element == PrinceJS.Level.TILE_LOOSE_BOARD) {
                
                tile.shake(false);
                
            }
  
        }
        
    },
    
    unMaskTile: function () {
     
        if (this.maskedTile != null) {
         
            this.maskedTile.toggleMask();
            this.maskedTile = null;
            
        }
        
    },
    
    maskTile: function (x,y,room) {
        
        var tile = this.getTileAt(x,y,room);
        
        //console.log('masking tile ' + x + ' ' + y + ' ' + room);
        
        if (this.maskedTile == tile) return;
        if (this.maskedTile != null) { this.unMaskTile(); }
        
        if ( tile.isWalkable() )
        {
            this.maskedTile = tile;
            tile.toggleMask();
            //console.log('masked!');
            
        }
        
    },
    
    floorStartFall: function (tile) {
        
        // Remove floor from room and set space tile                
        var space = new PrinceJS.Tile.Base(this.game,PrinceJS.Level.TILE_SPACE,0,tile.type);
        if ( tile.type == PrinceJS.Level.TYPE_PALACE ) {
         
            space.back.frameName = tile.key + '_0_1';
            
        }
        this.addTile(tile.roomX, tile.roomY, tile.room, space);
        
        // Calculate stop level
        while (this.getTileAt(tile.roomX,tile.roomY,tile.room).element == PrinceJS.Level.TILE_SPACE)
        {
            tile.roomY++;
            if (tile.roomY == 3) {
                
                tile.roomY = 0;
                tile.room = this.rooms[tile.room].links.down;
                
            }
            
            tile.yTo += PrinceJS.BLOCK_HEIGHT;
            
        }
        
    },
    
    floorStopFall: function (tile) {
     
        tile.destroy();
        
        var floor = this.getTileAt(tile.roomX, tile.roomY, tile.room);
        
        if (floor.element == PrinceJS.Level.TILE_TORCH) {
            
            floor.element = PrinceJS.Level.TILE_TORCH_WITH_DEBRIS;
        
        } else {
            
            floor.element = PrinceJS.Level.TILE_DEBRIS;
            
        }
        
        floor.back.frameName = floor.key + '_' + floor.element;
        floor.front.frameName = floor.key + '_' + floor.element + '_fg';
            
    },
    
    fireEvent: function(event, type) {
      
        var room = this.events[event].room;
        var x = ( this.events[event].location - 1 ) % 10;
        var y = Math.floor( (this.events[event].location - 1) / 10);
        
        console.log('Fire ' + event + ' - ' + room + ' ' + x + ' ' + y);
        
        var tile = this.getTileAt(x, y, room);
        
        if ( tile.element == PrinceJS.Level.TILE_EXIT_LEFT ) { 
            
            tile = this.getTileAt(x + 1, y, room);
        
        }
                
        if (type == PrinceJS.Level.TILE_RAISE_BUTTON) {
            
            tile.raise();
            
        } else {
            
            tile.drop();
            
        }
        
        if (this.events[event].next)
        {
            this.fireEvent(event + 1, type);
        }
        
    },
    
    activateChopper: function (x,y,room) {
      
        var tile;
        
        do {
            
            tile = this.getTileAt(++x, y, room);
            
        } while ( ( x < 9 ) && ( tile.element != PrinceJS.Level.TILE_CHOPPER ) )

        if (tile.element == PrinceJS.Level.TILE_CHOPPER) { 
              
            tile.chop();
                
        }
        
    }
    
    
};

PrinceJS.Level.prototype.constructor = PrinceJS.Level;